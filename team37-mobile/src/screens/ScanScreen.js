import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { ActivityIndicator, Button, Dimensions, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { API_URL } from '../constants/api';
import { useAuth } from '../hooks/useAuth';

const api = axios.create({
  baseURL: API_URL,
});

const { width } = Dimensions.get('window');
const qrSize = width * 0.7;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { user } = useAuth();
  const { eventid } = useLocalSearchParams();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', color: 'white' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setIsLoading(true);
    try {
      const qrData = JSON.parse(data);
      if (qrData.eventId && user?.userid) {
        if (String(qrData.eventId) !== String(eventid)) {
          alert("This QR code is for a different event.");
          setScanned(false);
          setIsLoading(false);
          return;
        }
        const response = await api.post('/attendance/check-in', {
          judgeid: user.userid,
          eventid: qrData.eventId,
        });
        if (response.status === 201) {
          await AsyncStorage.setItem('attended', "true");
          setIsLoading(false);
          setShowPoints(true);
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.delay(5000),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setShowPoints(false);
            router.replace('/(drawer)/(tabs)/marksheets');
          });
        } else {
          alert('Failed to check in.');
          setIsLoading(false);
          setScanned(false);
        }
      } else {
        alert('Invalid QR code.');
        setIsLoading(false);
        setScanned(false);
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      alert('An error occurred while scanning the QR code.');
      setIsLoading(false);
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.overlay}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Scan QR Code</Text>
        </View>
        
        <View style={styles.scannerContainer}>
            <View style={styles.scannerBox} />
        </View>

        <View style={styles.footer}>
            <Text style={styles.infoText}>
                Position the QR code within the frame.
            </Text>
        </View>
      </View>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
      {showPoints && (
        <View style={[styles.loadingOverlay]}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="trophy-outline" size={36} color="gold" />
                <Text style={styles.pointsText}> +5 expos</Text>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    width: '100%',
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  scannerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerBox: {
    width: qrSize,
    height: qrSize,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
  footer: {
    padding: 30,
    width: '100%',
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
});