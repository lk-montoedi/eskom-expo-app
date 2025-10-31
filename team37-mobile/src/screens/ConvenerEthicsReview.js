import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import bgImage from "../../assets/images/webbg.png";
import { API_URL } from "../constants/api.js";

const { width } = Dimensions.get("window");

const ConvenerEthicsReview = () => {
  const { projectId, userId } = useLocalSearchParams();
  const router = useRouter();

  const [severity, setSeverity] = useState(null);
  const [comment, setComment] = useState("");
  const [flagStatus, setFlagStatus] = useState("unflagged");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExistingReview = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/ethics/convener-review/${projectId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSeverity(data.convenor_overall_severity || null);
          setComment(data.convenor_comment || "");
          setFlagStatus(data.flag_status || "unflagged");
        }
      } catch (error) {
        console.error("Failed to fetch existing review:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExistingReview();
  }, [projectId]);

  const handleSubmit = async () => {
    if (!severity) {
      Alert.alert("Validation Error", "Please select a severity level.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/ethics/update-convener-fields/${projectId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            convenor_overall_severity: severity,
            convenor_comment: comment,
            flag_status: flagStatus,
            convenorId: userId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit review");

       router.replace({
                pathname: "/ethics",
                params: { refresh: "true" },
              });
              
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSeverityOption = (value, label, icon, color) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.optionButton,
        severity === value && { backgroundColor: color, borderColor: color },
      ]}
      onPress={() => setSeverity(value)}
    >
      <Ionicons
        name={icon}
        size={20}
        color={severity === value ? "#fff" : color}
      />
      <Text
        style={[styles.optionText, severity === value && { color: "#fff" }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderFlagStatusOption = (value, label, icon) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.optionButton,
        flagStatus === value && styles.optionButtonActive,
      ]}
      onPress={() => setFlagStatus(value)}
    >
      <Ionicons
        name={icon}
        size={20}
        color={flagStatus === value ? "#fff" : "#4B5563"}
      />
      <Text
        style={[
          styles.optionText,
          flagStatus === value && styles.optionTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={bgImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled" // <-- The key prop
      >
        <View style={styles.card}>
          <LinearGradient
            colors={["#E3F2FD", "#E8EAF6"]}
            style={styles.cardHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.screenTitle}>Convener Ethics Review</Text>
            <Text style={styles.roleIndicator}>Review for Project ID: {projectId}</Text>
          </LinearGradient>

          <View style={styles.cardBody}>
            <Text style={styles.label}>Overall Severity</Text>
            <View style={styles.optionContainer}>
              {renderSeverityOption(
                "low",
                "Low",
                "checkmark-circle",
                "#10B981"
              )}
              {renderSeverityOption(
                "moderate",
                "Moderate",
                "alert-circle",
                "#F59E0B"
              )}
              {renderSeverityOption(
                "severe",
                "Severe",
                "close-circle",
                "#EF4444"
              )}
            </View>

            <Text style={styles.label}>Comment</Text>
            <TextInput
              multiline
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              placeholder="Write your review here..."
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Flag Status</Text>
            <View style={styles.optionContainer}>
              {renderFlagStatusOption("unflagged", "Unflagged", "flag-outline")}
              {renderFlagStatusOption("flagged", "Flagged", "flag")}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit Review</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 48,
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
    marginHorizontal: 16,
    flex: 1,
  },
  cardHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 8,
    textAlign: "center",
  },
  roleIndicator: {
    fontSize: 14,
    color: "#6C7A89",
    fontWeight: "500",
  },
  cardBody: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    marginTop: 16,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginLeft: 8,
  },
  optionTextActive: {
    color: "#FFFFFF",
  },
  input: {
    height: 120,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    backgroundColor: "#F9FAFB",
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#A3B3C8",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ConvenerEthicsReview;