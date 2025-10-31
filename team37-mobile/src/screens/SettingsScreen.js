import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Animated,
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import bgImage from "../../assets/images/webbg.png"; // background
import { useAuth } from "../hooks/useAuth";
import { API_URL } from "../constants/api";

const { width } = Dimensions.get("window");

const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [judgeProfile, setJudgeProfile] = useState(null);

  const pulseAnim1 = useState(new Animated.Value(1))[0];
  const pulseAnim2 = useState(new Animated.Value(1))[0];
  const pulseAnim3 = useState(new Animated.Value(1))[0];
  const bounceAnim1 = useState(new Animated.Value(0))[0];
  const bounceAnim2 = useState(new Animated.Value(0))[0];

  useFocusEffect(
    useCallback(() => {
      const fetchCategory = async () => {
        const cat = await AsyncStorage.getItem("category");
        if (cat) setCategory(cat);
      };
      fetchCategory();

      const fetchJudgeProfile = async () => {
        if (user && user.role.toLowerCase() === 'judge') {
          try {
            const response = await fetch(`${API_URL}/user/profile/${user.userid}`);
            const data = await response.json();
            if (data.profile) {
              setJudgeProfile(data.profile);
            }
          } catch (error) {
            console.error("Failed to fetch judge profile:", error);
          }
        }
      };

      fetchJudgeProfile();
    }, [user])
  );

  useEffect(() => {
    const bounce = (animValue) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    const pulse = (animValue) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 0.4,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    bounce(bounceAnim1);
    bounce(bounceAnim2);
    pulse(pulseAnim1);
    pulse(pulseAnim2);
    pulse(pulseAnim3);
  }, []);

  const FloatingCircles = () => (
    <View style={styles.floatingContainer} pointerEvents="none">
      <Animated.View
        style={[styles.circle, styles.circle1, { opacity: pulseAnim1 }]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle2,
          { transform: [{ translateY: bounceAnim1 }] },
        ]}
      />
      <Animated.View
        style={[styles.circle, styles.circle3, { opacity: pulseAnim2 }]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle4,
          { transform: [{ translateY: bounceAnim2 }] },
        ]}
      />
      <Animated.View
        style={[styles.circle, styles.circle5, { opacity: pulseAnim3 }]}
      />
    </View>
  );

  const handleLogout = async () => {
    logout();
    router.replace("/auth");
  };

  return (
    <ImageBackground
      source={bgImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <FloatingCircles />
      <View style={styles.scrollContent}>
        <View style={styles.card}>
          <LinearGradient
            colors={["#E3F2FD", "#E8EAF6"]}
            style={styles.cardHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.screenTitle}>Settings</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            {user ? (
              <View style={styles.profileCard}>
                <Text style={styles.profileTitle}>Profile</Text>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Name:</Text>
                  <Text style={styles.profileValue}>{user.name}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Email:</Text>
                  <Text style={styles.profileValue}>{user.email}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Role:</Text>
                  <Text style={styles.profileValue}>{user.role}</Text>
                </View>
                {user.role.toLowerCase() === 'judge' && (
                  <>
                    <View style={styles.profileRow}>
                      <Text style={styles.profileLabel}>Rating:</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.profileValue}>{judgeProfile?.rating ? Number(judgeProfile.rating).toFixed(2) : "0.00"}</Text>
                        <Text style={{fontSize: 16, marginLeft: 4}}>⭐</Text>
                      </View>
                    </View>
                    <View style={styles.profileRow}>
                      <Text style={styles.profileLabel}>Points:</Text>
                      <Text style={styles.profileValue}>{`${judgeProfile?.points ?? 0} expos`}</Text>
                    </View>
                  </>
                )}
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Category:</Text>
                  <Text style={styles.profileValue}>{category ? category : "Not Assigned"}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.loadingText}>Loading profile...</Text>
            )}

            <TouchableOpacity
              style={styles.viewEventsButton}
              onPress={() => router.push("/events")}
            >
              <Text style={styles.viewEventsButtonText}>View Events</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 48,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F46E5",
    textAlign: "center",
  },
  cardBody: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 16,
    textAlign: "center",
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  profileLabel: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  profileValue: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 16,
    color: "#4F46E5",
    textAlign: "center",
    marginVertical: 16,
  },
  viewEventsButton: {
    borderColor: "#4F46E5",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  viewEventsButtonText: {
    color: "#4F46E5",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  floatingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#6bb5ffff",
  },
  circle1: { top: 80, left: 40, width: 80, height: 80 },
  circle2: { top: 160, right: 80, width: 64, height: 64, opacity: 0.25 },
  circle3: { bottom: 160, left: 80, width: 48, height: 48 },
  circle4: { top: 240, left: width / 3, width: 32, height: 32, opacity: 0.3 },
  circle5: { bottom: 80, right: width / 3, width: 56, height: 56 },
});

export default SettingsScreen;