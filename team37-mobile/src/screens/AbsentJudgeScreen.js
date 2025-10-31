import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import bgImage from "../../assets/images/webbg.png";
import { API_URL } from "../constants/api";

const api = axios.create({
  baseURL: API_URL,
});

const ConfirmationModal = ({ visible, onConfirm, onCancel, message }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Ionicons name="warning-outline" size={30} color="#F59E0B" />
            <Text style={styles.modalHeaderText}>Confirm Action</Text>
          </View>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ProjectCard = ({ project, index }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!project.project.projectid) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get(`/projects/marksheets/${project.project.projectid}`);
        setDetails(response.data);
      } catch (error) {
        console.error(`Failed to fetch details for project ${project.project.projectid}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [project.project.projectid]);

  const score1 = details?.marksheets?.[0]?.totalscore ? details.marksheets[0].totalscore : 'N/A';
  const score2 = details?.marksheets?.[1]?.totalscore ? details.marksheets[1].totalscore : 'N/A';
  const hasPendingConflict = details?.conflicts?.some(c => c.status === 'pending');

  const status = details?.project?.status;
  const statusColor =
    status === "Registered" || status === "Not Judged"
      ? "#EF4444"
      : status === "in-progress"
      ? "#F59E0B"
      : "#10B981";
  const statusStyle =
    status === "Registered" || status === "Not Judged"
      ? styles.statusNotJudged
      : status === "in-progress"
      ? styles.statusInProgress
      : styles.statusCompleted;

  return (
    <View style={[styles.projectCard, index % 2 === 0 ? styles.projectCardEven : styles.projectCardOdd]}>
      <Text style={styles.projectTitle}>{project.project.projectname || "Unnamed Project"}</Text>
      
      <View style={styles.projectDetailRow}>
        <Ionicons name="barcode-outline" size={16} color="#4F46E5" />
        <Text style={styles.projectDetailText}>Stand: {details?.project?.standnumber || "N/A"}</Text>
      </View>
      
      <View style={styles.projectDetailRow}>
        <Ionicons name="pricetag-outline" size={16} color="#9CA3AF" />
        <Text style={styles.projectDetailText}>Category: {project.project.category || "None"}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#4F46E5" style={{ marginVertical: 10 }} />
      ) : (
        <>
          <View style={styles.projectDetailRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#4B5563" />
            <Text style={styles.projectDetailText}>Judge 1: {score1}</Text>
          </View>
          <View style={styles.projectDetailRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#4B5563" />
            <Text style={styles.projectDetailText}>Judge 2: {score2}</Text>
          </View>
          {hasPendingConflict && (
            <View style={styles.projectDetailRow}>
              <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
              <Text style={[styles.projectDetailText, styles.conflictText]}>Conflict Pending</Text>
            </View>
          )}
          {status && (
            <View style={styles.projectDetailRow}>
                <Ionicons name="pulse-outline" size={16} color={statusColor} />
                <Text style={[styles.projectDetailText, statusStyle]}>
                    Status: {status === "Registered" ? "Not Judged" : status}
                </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const AbsentJudgeScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const judge = JSON.parse(params.judge);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchJudgeProjects = async () => {
      if (!judge?.userid) {
        setIsFetchingProjects(false);
        return;
      }
      try {
        const eventId = await AsyncStorage.getItem("eventid");
        let url = `/projects/allocated/${judge.userid}`;
        if (eventId) {
          url += `?eventId=${eventId}`;
        }
        const response = await api.get(url);
        if (response.status === 200) {
          setProjects(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setProjects([]);
        } else {
          console.error("Failed to fetch judge projects:", error);
          Alert.alert("Error", "Failed to fetch projects for the judge.");
        }
      } finally {
        setIsFetchingProjects(false);
      }
    };

    fetchJudgeProjects();
  }, [judge?.userid]);

  const executeAllocation = async () => {
    setIsLoading(true);
    try {
      const eventId = await AsyncStorage.getItem("eventid");
      if (judge?.userid && eventId) {
        const allocationResponse = await api.post(
          `/projects/reallocate-free/${judge.userid}/${eventId}`
        );
        if (allocationResponse.status === 200) {
          router.replace("/(drawer)/(tabs)/judges");
        } else {
          Alert.alert("Error", "Failed to allocate projects.");
        }
      } else {
        Alert.alert("Error", "Missing judge or event information.");
      }
    } catch (error) {
      console.error("Error allocating projects:", error);
      Alert.alert("Error", "An error occurred while allocating projects.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAllocation = () => {
    setModalVisible(false);
    executeAllocation();
  };

  const handleCancelAllocation = () => {
    setModalVisible(false);
  };

  function toCapital(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <ImageBackground
      source={bgImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ConfirmationModal
        visible={isModalVisible}
        onConfirm={handleConfirmAllocation}
        onCancel={handleCancelAllocation}
        message="You are confirming that the judge is at the event and their un-marked projects will be allocated to them."
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.screenTitle}>Late Judge Details</Text>
          <View style={styles.judgeInfoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#4F46E5" />
              <Text style={styles.infoText}>
                {judge.name} {judge.surname}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#4F46E5" />
              <Text style={styles.infoText}>{judge.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="pricetag-outline" size={20} color="#9CA3AF" />
              <Text style={styles.infoText}>
                Category: {judge.category || "None"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="pulse-outline" size={20} color="#EF4444" />
              <Text style={[styles.infoText, styles.statusAbsent]}>
                {toCapital(judge.status)}
              </Text>
            </View>
          </View>
          <View style={styles.projectsContainer}>
            <Text style={styles.subTitle}>Previously Allocated Projects</Text>
            {isFetchingProjects ? (
              <ActivityIndicator color="#4F46E5" style={{ marginTop: 10 }} />
            ) : (
              projects.length > 0 ? (
                projects.map((item, index) => (
                  <ProjectCard project={item} index={index} key={item.project.projectid.toString()} />
                ))
              ) : (
                <Text style={styles.emptyListText}>
                  No projects currently allocated.
                </Text>
              )
            )}
          </View>
          <TouchableOpacity
            style={styles.allocateButton}
            onPress={() => setModalVisible(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#4F46E5" />
            ) : (
              <Text style={styles.allocateButtonText}>Re-Allocate Projects</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingBackButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 16,
    paddingTop: 60,
    paddingBottom: 100,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 24,
    textAlign: "center",
  },
  judgeInfoContainer: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#4B5563",
    marginLeft: 12,
  },
  statusAbsent: {
    color: "#EF4444",
  },
  projectsContainer: {
    marginBottom: 24,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: 12,
  },
  emptyListText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 10,
  },
  projectCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  projectCardEven: {
    backgroundColor: "#F9FAFB",
  },
  projectCardOdd: {
    backgroundColor: "#FFFFFF",
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  projectDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  projectDetailText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
  },
  conflictText: {
    color: "#EF4444",
    fontWeight: "bold",
  },
  statusNotJudged: {
    color: "#EF4444",
  },
  statusInProgress: {
    color: "#F59E0B",
  },
  statusCompleted: {
    color: "#10B981",
  },
  allocateButton: {
    borderColor: "#4F46E5",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  allocateButtonText: {
    color: "#4F46E5",
    fontSize: 16,
    fontWeight: "bold",
  },
  floatingBackButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 15,
    width: '100%',
    justifyContent: 'center',
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#1F2937',
  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#6B7280",
  },
  confirmButton: {
    backgroundColor: "#4F46E5",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AbsentJudgeScreen;