import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import bgImage from "../../assets/images/webbg.png";
import { API_URL } from "../constants/api";
import { useMarksheets } from "../contexts/MarksheetContext";

const { width } = Dimensions.get("window");

const marksheetTypes = [
  { label: "Mathematics", value: "mathematics" },
  { label: "Social Science", value: "social-science" },
  { label: "Scientific Investigations", value: "scientific-investigations" },
  { label: "Engineering", value: "engineering" },
];

const AssignMarksheetScreen = () => {
  const router = useRouter();
  const { projectId, conflictId } = useLocalSearchParams();
  const { fetchMarksheets } = useMarksheets();

  const [selectedMarksheetType, setSelectedMarksheetType] = useState("none");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [marksheet, setMarksheet] = useState(null);
  const [judgeId, setJudgeId] = useState("");
  const [retMarksheetId, setRetMarksheetId] = useState("");

  const pulseAnim1 = useState(new Animated.Value(1))[0];
  const pulseAnim2 = useState(new Animated.Value(1))[0];
  const pulseAnim3 = useState(new Animated.Value(1))[0];
  const bounceAnim1 = useState(new Animated.Value(0))[0];
  const bounceAnim2 = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        const tokenStr = await AsyncStorage.getItem("userToken");
        let judgeid = "";
        if (tokenStr) {
          const { userid } = JSON.parse(tokenStr);
          setJudgeId(userid);
          judgeid = userid;
        }
        if (!projectId) throw new Error("No projectId provided");

        const response = await axios.get(`${API_URL}/projects/${projectId}`);
        if (response.status !== 200)
          throw new Error("Failed to fetch project details");
        setProjectDetails(response.data);

        if (judgeid && projectId) {
          const marksheetRes = await axios.get(
            `${API_URL}/marksheets/judge/${judgeid}/project/${projectId}`
          );
          if (marksheetRes.status === 200 && marksheetRes.data) {
            const { type, marksheetid } = marksheetRes.data;
            if (type && type !== "none") setSelectedMarksheetType(type);
            if (marksheetid) {
              setRetMarksheetId(marksheetid);
              setMarksheet(marksheetRes.data);
              setProjectDetails((prev) => ({ ...prev, marksheetid }));
            }
          }
        }
      } catch (err) {
        setError(err.message);
        console.log("Error fetching project details:", err);
      } finally {
        setLoadingDetails(false);
      }
    };
    if (projectId) fetchDetails();
  }, [projectId]);

  useEffect(() => {
    const bounce = (animValue) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, { toValue: -15, duration: 1000, useNativeDriver: true }),
          Animated.timing(animValue, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    };

    const pulse = (animValue) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
          Animated.timing(animValue, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    };

    bounce(bounceAnim1);
    bounce(bounceAnim2);
    pulse(pulseAnim1);
    pulse(pulseAnim2);
    pulse(pulseAnim3);
  }, []);

  const handleCreateAndAssignMarksheet = async () => {
    if (!selectedMarksheetType) {
      Alert.alert("Warning", "Please select a marksheet type.");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      if (conflictId && conflictId !== "null") {
        const response = await axios.put(`${API_URL}/conflicts/marksheets/resolve/${conflictId}`, {
          type: selectedMarksheetType,
        });
        if (response.status === 200) {
          console.log("Marksheet conflict resolved successfully");
          fetchMarksheets();
          router.back();
        }
      } else {
        const response = await axios.put(`${API_URL}/marksheets/${marksheet.marksheetid}`, {
          ...marksheet,
          type: selectedMarksheetType,
          totalScore: 0,
          projectId
        });
        if (response.status === 200) {
          console.log("Marksheet type updated successfully");
          fetchMarksheets();
          router.back();
        }
      }
    } catch (error) {
      console.error("Assignment error:", error);
      setError(error.message);
      Alert.alert("Error", error.message);
    } finally {
      setCreating(false);
    }
  };

  const FloatingCircles = () => (
    <View style={styles.floatingContainer} pointerEvents="none">
      <Animated.View style={[styles.circle, styles.circle1, { opacity: pulseAnim1 }]} />
      <Animated.View style={[styles.circle, styles.circle2, { transform: [{ translateY: bounceAnim1 }] }]} />
      <Animated.View style={[styles.circle, styles.circle3, { opacity: pulseAnim2 }]} />
      <Animated.View style={[styles.circle, styles.circle4, { transform: [{ translateY: bounceAnim2 }] }]} />
      <Animated.View style={[styles.circle, styles.circle5, { opacity: pulseAnim3 }]} />
    </View>
  );

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage}>
      <FloatingCircles />
    <ScrollView contentContainerStyle={[styles.scrollContent, { marginTop: 40 }]}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.screenTitle}>Assign Project Marksheet</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.projectInfo}>
              <Text style={styles.projectLabel}>Project ID: {projectId}</Text>
              {loadingDetails ? (
                <ActivityIndicator size="small" color="#4F46E5" style={{ marginTop: 8 }} />
              ) : projectDetails ? (
                <>
                  <Text style={styles.projectDetail}>Name: {projectDetails.projectname || "-"}</Text>
                  <Text style={styles.projectDetail}>Stand: {projectDetails.standnumber || "-"}</Text>
                  <Text style={styles.projectDetail}>Category: {projectDetails.category || "-"}</Text>
                  <Text style={styles.projectDetail}>Status: {projectDetails.status || "-"}</Text>
                </>
              ) : (
                <Text style={[styles.muted, { marginTop: 8 }]}>No details found.</Text>
              )}
            </View>

            <Text style={styles.editLabel}>Select Marksheet Type</Text>
            {marksheetTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.checkboxRow,
                  selectedMarksheetType === type.value && styles.checkboxRowActive,
                ]}
                onPress={() => setSelectedMarksheetType(type.value)}
                disabled={creating}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedMarksheetType === type.value && styles.checkboxSelected,
                  ]}
                >
                  {selectedMarksheetType === type.value && <Text style={styles.tick}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>{type.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={handleCreateAndAssignMarksheet}
              style={[
                styles.button,
                (creating || !selectedMarksheetType) && styles.buttonDisabled,
              ]}
              disabled={creating || !selectedMarksheetType}
            >
              {creating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Assign Marksheet</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.floatingBackButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, backgroundColor: "#F3F4F6" },
  scrollContent: { flexGrow: 1, padding: 16, marginTop: 40 },
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
    paddingBottom: 16,
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
    marginBottom: 16,
    textAlign: "center",
  },
  cardBody: { paddingHorizontal: 16, paddingTop: 16 },
  projectInfo: {
    marginBottom: 24,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  projectLabel: { fontSize: 16, fontWeight: "600", color: "#4B5563" },
  projectDetail: { fontSize: 14, color: "#1F2937", marginTop: 4 },
  muted: { fontSize: 14, color: "#6B7280" },
  editLabel: { fontSize: 18, fontWeight: "bold", color: "#4F46E5", marginBottom: 12 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    backgroundColor: "#F9FAFB",
  },
  checkboxRowActive: { backgroundColor: "#E0E7FF" },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: { backgroundColor: "#4F46E5" },
  tick: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  checkboxLabel: { fontSize: 14, color: "#1F2937" },
  button: {
    backgroundColor: "#4F46E5",
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#A5B4FC" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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
  },
  floatingContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999, backgroundColor: "#6bb5ffff" },
  circle1: { top: 80, left: 40, width: 80, height: 80 },
  circle2: { top: 160, right: 80, width: 64, height: 64, opacity: 0.25 },
  circle3: { bottom: 160, left: 80, width: 48, height: 48 },
  circle4: { top: 240, left: width / 3, width: 32, height: 32, opacity: 0.3 },
  circle5: { bottom: 80, right: width / 3, width: 56, height: 56 },
});

export default AssignMarksheetScreen;
