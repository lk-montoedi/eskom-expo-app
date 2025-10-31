import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import bgImage from "../../assets/images/webbg.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../constants/api";

const AboutConflictScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { conflict: conflictString } = params;
  const conflict = conflictString ? JSON.parse(conflictString) : null;

  const [userRole, setUserRole] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [finalMark, setFinalMark] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const tokenStr = await AsyncStorage.getItem("userToken");
      if (tokenStr) {
        const { role } = JSON.parse(tokenStr);
        setUserRole(role);
      }
    };
    fetchUserRole();
  }, []);

  const handleResolve = async () => {
    if (!finalMark) {
      return;
    }
    setSubmitting(true);
    try {
      await axios.put(`${API_URL}/conflicts/resolve/${conflict.conflictid}`, {
        agreedMark: finalMark,
      });
      setModalVisible(false);
      router.back();
    } catch (error) {
      console.error("Error resolving conflict:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!conflict) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No conflict data found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ImageBackground
      source={bgImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Project Details</Text>
              <View style={styles.detailRow}>
                <Ionicons name="barcode-outline" size={20} color="#4F46E5" />
                <Text style={styles.detailText}>
                  Stand: {conflict.standnumber || "N/A"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="pricetag-outline" size={20} color="#4F46E5" />
                <Text style={styles.detailText}>
                  Category: {conflict.category || "None"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#4F46E5"
                />
                <Text style={styles.descriptionText}>
                  {conflict.description}
                </Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Conflict Information</Text>
              <View style={styles.detailRow}>
                <Ionicons
                  name="pulse-outline"
                  size={20}
                  color={
                    conflict.status?.toLowerCase() === "resolved"
                      ? "#10B981"
                      : "#F59E0B"
                  }
                />
                <Text
                  style={[
                    styles.detailText,
                    conflict.status?.toLowerCase() === "resolved"
                      ? styles.statusResolved
                      : styles.statusPending,
                  ]}
                >
                  Status: {conflict.status}
                </Text>
              </View>
              {conflict.agreedmark && (
                <View style={styles.detailRow}>
                  <Ionicons name="star-outline" size={20} color="#4F46E5" />
                  <Text style={styles.detailText}>
                    Agreed Mark: {conflict.agreedmark}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.judgesContainer}>
              <View style={styles.judgeBox}>
                <Text style={styles.judgeTitle}>Judge 1</Text>
                <Text style={styles.judgeName}>{conflict.judge1.fullname}</Text>
                <Text style={styles.judgeEmail}>{conflict.judge1.email}</Text>
                <Text style={styles.judgeMark}>
                  Initial Mark: {conflict.judge1.initialmark}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.viewMarksheetLink}>View Marksheet</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.judgeBox}>
                <Text style={styles.judgeTitle}>Judge 2</Text>
                <Text style={styles.judgeName}>{conflict.judge2.fullname}</Text>
                <Text style={styles.judgeEmail}>{conflict.judge2.email}</Text>
                <Text style={styles.judgeMark}>
                  Initial Mark: {conflict.judge2.initialmark}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.viewMarksheetLink}>View Marksheet</Text>
                </TouchableOpacity>
              </View>
            </View>

            {userRole === 'convener' && conflict.status?.toLowerCase() === 'pending' && (
              <TouchableOpacity style={styles.resolveButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.resolveButtonText}>Resolve Conflict</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resolve Conflict</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter Final Mark"
              keyboardType="numeric"
              value={finalMark}
              onChangeText={setFinalMark}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleResolve}
                disabled={submitting}
              >
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit</Text>}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 24, // Adjusted padding
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  cardBody: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#4B5563",
    marginLeft: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: "#4B5563",
    marginLeft: 12,
    lineHeight: 24,
    flex: 1,
  },
  statusPending: {
    color: "#F59E0B",
    fontWeight: "bold",
  },
  statusResolved: {
    color: "#10B981",
    fontWeight: "bold",
  },
  judgesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  judgeBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: "#F9FAFB",
  },
  judgeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 8,
  },
  judgeName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  judgeEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginVertical: 4,
  },
  judgeMark: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 4,
  },
  viewMarksheetLink: {
    color: '#4F46E5',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  resolveButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  resolveButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: '90%',
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#1F2937",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E0E7FF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: "#10B981",
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#6B7280",
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AboutConflictScreen;
