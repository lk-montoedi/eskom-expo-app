import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { API_URL } from "../constants/api";

const { height } = Dimensions.get("window");

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const CompletionScreen = ({ params }) => {
  const router = useRouter();
  const confettiRef = useRef(null);
  const [showPoints, setShowPoints] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [judgeDetails, setJudgeDetails] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeUsed, setTimeUsed] = useState(0);

  async function fetchDetails() {
    try {
      const tokenStr = await AsyncStorage.getItem("userToken");
      if (!tokenStr) {
        setLoading(false);
        return;
      }

      const { userid } = JSON.parse(tokenStr);

      const judgeResponse = await fetch(`${API_URL}/user/userprofile/${userid}`);
      const judgeData = await judgeResponse.json();
      if (judgeData?.profile) setJudgeDetails(judgeData.profile);

      const storedProjectId = await AsyncStorage.getItem("currentProjectId");
      if (storedProjectId) {
        const projectResponse = await fetch(
          `${API_URL}/projects/${storedProjectId}`
        );
        const projectData = await projectResponse.json();
        setProjectDetails(projectData);
      }

      // Get time used from AsyncStorage
      const storedTime = await AsyncStorage.getItem("ethicsTimeUsed");
      setTimeUsed(storedTime ? Number(storedTime) : 0);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDetails();
    if (confettiRef.current) confettiRef.current.start();

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
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {showPoints && (
        <View style={styles.pointsOverlay}>
          <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
            <Text style={styles.pointsText}>+20 expos</Text>
            <Ionicons name="trophy" size={40} color="#8B5CF6" />
          </Animated.View>
        </View>
      )}
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={true}
        fadeOut={true}
        ref={confettiRef}
      />

      <LinearGradient
        colors={["#E3F2FD", "#E8EAF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardHeader}
      >
        <Text style={styles.title}>🎉 Judging Complete! 🎉</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.detail}>
          👨‍⚖️ Judge:{" "}
          <Text style={styles.value}>
            {judgeDetails
              ? `${judgeDetails.name} ${judgeDetails.surname}`
              : "Unknown"}
          </Text>
        </Text>
        <Text style={styles.detail}>
          📖 Project:{" "}
          <Text style={styles.value}>
            {projectDetails?.projectname || "Unknown"}
          </Text>
        </Text>
        <Text style={styles.detail}>
          🗂️ Category:{" "}
          <Text style={styles.value}>{projectDetails?.category || "N/A"}</Text>
        </Text>
        <Text style={styles.detail}>
          🏷️ Stand Number:{" "}
          <Text style={styles.value}>
            {projectDetails?.standnumber || "N/A"}
          </Text>
        </Text>
        <Text style={styles.detail}>
          ⏱️ Time Used: <Text style={styles.value}>{formatTime(timeUsed)}</Text>
        </Text>
      </View>

      <Text style={styles.message}>
        Thank you, {judgeDetails?.name}, for your time and expertise.{"\n"}
        Your feedback will inspire young scientists to achieve even greater
        heights.
      </Text>

      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => router.push("/projects")}
      >
        <LinearGradient colors={["#2563EB", "#4F46E5"]} style={styles.button}>
          <Text style={styles.buttonText}>Back to Projects</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    minHeight: height,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4F46E5",
  },
  pointsOverlay: {
    position: "absolute",
    top: height / 8,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  pointsText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#8B5CF6",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cardHeader: {
    padding: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F46E5",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 10,
  },
  value: {
    fontWeight: "bold",
    color: "#4F46E5",
  },
  message: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginVertical: 20,
    lineHeight: 22,
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CompletionScreen;
export const options = {
  headerTitle: 'Completed',
  headerBackVisible: false,
  tabBarStyle: { display: "none" },
  drawerLockMode: "locked-closed",
};