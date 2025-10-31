import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // Corrected import source for useFocusEffect
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import bgImage from "../../assets/images/webbg.png";
import { API_URL } from "../constants/api.js";
import { useTimer } from "../contexts/TimerContext";

const { width } = Dimensions.get("window");

const formatTime = (seconds) => {
  // Ensure the timer doesn't go below zero
  const clampedSeconds = Math.max(0, seconds);
  const mins = Math.floor(clampedSeconds / 60);
  const secs = clampedSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};


const ethicsIssues = [
  "The research involves breaking of any of the country's laws. Research must not violate any laws, including those related to human and animal research, intellectual property, or environmental protection.",
  "The research involves any protected species (plants, invertebrates, vertebrates). Do not use or interfere with any endangered or legally protected species of plants or animals.",
  "Any human or animal testing. You are not permitted to conduct any form of experiment on humans or animals.",
  "Any medical procedures on humans or animals. Avoid performing any medical treatments, diagnoses, or procedures on humans or animals.",
  "Use of any human or animal parts, including tissues or fluids. Do not collect or test any parts, tissues, or fluids from humans or animals, such as blood or urine.",
  "Physical exercises or tests or stress. Do not subject humans or animals to physical exercises or stress tests that could strain their bodies.",
  "Stopping medication. Never change, adjust, or stop a participant's prescribed medication for your research.",
  "Ingesting of medication, even if known. Humans or animals must not ingest any type of medication as part of your study.",
  "Ingesting any food or substance or chemicals, even if known. You cannot have humans or animals ingest any food, chemicals, or other substances for your experiment.",
  "Feeding animals with treated food. Do not feed animals with treated, specially formulated, or altered food.",
  "Starving humans or animals. Do not deprive humans or animals of food or liquids, or alter their diets by food deprivation.",
  "Applying any substance, including natural, homeopathic, or organic substances to the skin or body of an animal or human. You are not allowed to apply any substances, like creams or oils, to the skin or body of a human or animal.",
  "Risk to physical, emotional or mental wellbeing of humans or animals. Your research must not pose any risk to the physical, emotional, or mental health of humans or animals.",
  "Taking wild animals out of their natural habitat. Do not remove wild animals from their natural environments or disturb their habitats.",
  "Subjecting animals to any condition that is not normal or natural. Do not alter an animal's normal living conditions, such as temperature, humidity, or air quality.",
  "Manipulating or changing or interfering with an animal's normal physiology, anatomy, or behaviour. You cannot interfere with an animal's natural body functions, structure, or behavior.",
  "Psychological tests on humans. Do not conduct psychological tests that could affect a person's mental state or perceptions.",
  "Participants from vulnerable groups e.g. elderly, minors, sick, disabled. Do not conduct research on vulnerable people, including children, the elderly, sick, or disabled individuals.",
  "Potentially risky participants e.g. prisoners, drug addicts, violent people. Avoid direct contact with high-risk individuals such as prisoners or drug addicts.",
  "Emotionally or mentally challenged people. Do not have direct contact with individuals who are emotionally or mentally challenged.",
  "Research involving sensitive issues e.g. Race, religion, culture, medical conditions. Do not research sensitive topics like race, religion, or medical conditions, especially if it involves stereotypes or discrimination.",
  "Testing a device, invention, prototype on a humans or animal. You are not allowed to test any inventions, devices, or prototypes on humans or animals if they could cause harm.",
  "Using or testing of any illegal or contraband substance or drug. It is forbidden to use, test, or manufacture any illegal substances or drugs.",
  "Using devices / probes / electricity on humans or animals. Do not use any devices, probes, or electrical instruments on humans or animals.",
  "Taking offensive or sensitive photographs of humans. You cannot take or publish offensive or sensitive photos of people, especially minors, even with their consent.",
  "Collecting of personal, or sensitive, or confidential information. Do not collect or share personal or confidential information like medical records, addresses, or names.",
  "Using or testing dangerous items e.g. knives, weapons, machinery that could cause harm. If using dangerous items, it must be done under the supervision of a responsible adult.",
  "Using or testing of any chemical or hazardous or flammable substance or material. You must not use or test any chemical, hazardous, or flammable substances that could cause harm.",
  "Use of agar plates or any growth medium. You are not permitted to use agar plates or any other growth medium for your research.",
  "Working with pathogens, viruses, bacteria, pests. Do not work with pathogens, viruses, bacteria, or pests in an unsafe or unregulated environment.",
  "Evidence of any plagiarism (copying someone else’s work (e.g. data, text, photos and diagrams) without permission, acknowledgement or referencing). Do not copy someone else's work, including data, text, or photos, without proper permission and credit.",
  "Brand names (including organisations, food substances, non-specialized equipment, trademarks) used instead of objective labelling. Use objective labels for items instead of using specific brand names.",
  "No urls/acknowledgement of images. Always provide a URL or acknowledgment for any images you use."
];
const EthicsMarksheet = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const projectId = params.projectId ? parseInt(params.projectId, 10) : null;
  const marksheetData = params.marksheetData
    ? JSON.parse(params.marksheetData)
    : null;
  const marksheetId = params.marksheetId;

  const [ethicsMarksheetId, setEthicsMarksheetId] = useState(params.ethicsMarksheetId || null);
  const [ethicsChecks, setEthicsChecks] = useState({});
  const [selectedSeverity, setSelectedSeverity] = useState("none");
  const [judgeComments, setJudgeComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [judgeId, setJudgeId] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    timeLeft,
    setTimeLeft,
    timeControlButtonClicks,
    setTimeControlButtonClicks,
    setTimerActive,
  } = useTimer();

  // Animations
  const pulseAnim1 = useState(new Animated.Value(1))[0];
  const pulseAnim2 = useState(new Animated.Value(1))[0];
  const pulseAnim3 = useState(new Animated.Value(1))[0];
  const bounceAnim1 = useState(new Animated.Value(0))[0];
  const bounceAnim2 = useState(new Animated.Value(0))[0];

  const fetchEthicsData = async () => {
    if (!projectId) return;

    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        const user = JSON.parse(userToken);
        setJudgeId(user.userid || user.id || user.judgeid);
      } else {
        router.replace("/login");
        return;
      }

      // fetch specific to judge + project
      const res = await axios.get(
        `${API_URL}/ethics-marksheets/project/${projectId}/judge/${judgeId}`
      );

      const data = res.data;
      setEthicsMarksheetId(data.ethicsmarksheetid);

      const newEthicsChecks = {};
      for (let i = 0; i < ethicsIssues.length; i++) {
        const sectionKey = `section${i + 1}`;
        const value = data[sectionKey];
        newEthicsChecks[`issue_${i}`] =
          value === true || value === 1 || value === "1" || value === "true";
      }
      setEthicsChecks(newEthicsChecks);
      setSelectedSeverity(data.overallseverity || "none");
      setJudgeComments(data.judgecomment || "");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("No ethics marksheet found for this judge/project.");
        setEthicsChecks({});
        setSelectedSeverity("none");
        setJudgeComments("");
        setEthicsMarksheetId(null);
      } else {
        console.error("Failed to fetch ethics data:", error);
        Alert.alert("Error", "Could not load ethics marksheet.");
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setTimerActive(true);
      fetchEthicsData();

      return () => {
        setTimerActive(false);
      };
    }, [ethicsMarksheetId])
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

  // const sendEmailsToLearnersViaAPI = async (projectId) => {
  //   try {
  //     const learners = await getProjectLearners(projectId);
  //     const projectInfo = await getProjectInfoById(projectId);

  //     console.log("Learners:", learners);
  //     console.log("Project Info:", projectInfo);

  //     for (const learner of learners) {
  //       if (!learner.email) {
  //         console.warn(
  //           `No email found for learner ${learner.userId}, skipping.`
  //         );
  //         continue;
  //       }

  //       try {
  //         const response = await axios.post(
  //           `${API_URL}/email/send-project-marked-email`,
  //           {
  //             email: learner.email,
  //             projectData: projectInfo,
  //           }
  //         );

  //         console.log(`Email sent to ${learner.email}:`, response.data);
  //       } catch (err) {
  //         console.error(
  //           `Failed to send email to ${learner.email}:`,
  //           err.response?.data || err.message
  //         );
  //       }
  //     }

  //     console.log("All emails processed via API.");
  //   } catch (err) {
  //     console.error("Error sending project registration emails via API:", err);
  //   }
  // };

  const FloatingCircles = () => (
    <View style={styles.floatingContainer} pointerEvents="none">
      <Animated.View
        style={[styles.circle, styles.circle1, { opacity: pulseAnim1 }]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle2,
          { transform: [{ translateY: bounceAnim2 }] },
        ]}
      />
      <Animated.View
        style={[styles.circle, styles.circle3, { opacity: pulseAnim2 }]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle4,
          { transform: [{ translateY: bounceAnim1 }] },
        ]}
      />
      <Animated.View
        style={[styles.circle, styles.circle5, { opacity: pulseAnim3 }]}
      />
    </View>
  );

  const toggleCheck = (field) => {
    setEthicsChecks((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSeveritySelect = (value) => {
    setSelectedSeverity(value);
  };

  const handleCommentChange = (value) => {
    setJudgeComments(value);
  };

  const handleTimeControlClick = () => {
    const newClickCount = timeControlButtonClicks + 1;
    setTimeControlButtonClicks(newClickCount);
    if (newClickCount === 1) {
      setTimeLeft(5 * 60 + 10);
    } else if (newClickCount === 2) {
      setTimeLeft(1 * 60 + 10);
    } else if (newClickCount === 3) {
      setTimeLeft(10);
    }
  };


 console.log("Regular marksheet updated:", marksheetData);



const submitAllMarkingData = async () => {
  if (!projectId || !marksheetData || !marksheetId) {
    Alert.alert("Error", "Missing project, ethics ID, or marksheet data.");
    return;
  }
  if (!judgeId) {
    Alert.alert("Error", "Judge ID not loaded. Please try again or log in.");
    return;
  }

  setSubmitting(true);

  try {
    // Update the regular marksheet - map marksheetType to type for backend
    const marksheetPayload = {
      ...marksheetData,
      judgeId,
      type: marksheetData.marksheetType || marksheetData.type
    };
    // Remove marksheetType if it exists to avoid confusion
    delete marksheetPayload.marksheetType;
    
    await axios.put(`${API_URL}/marksheets/${marksheetId}`, marksheetPayload);
    console.log("Regular marksheet updated:", marksheetPayload);

    // Update ethics table only if moderate/severe violations
    if (selectedSeverity === "moderate" || selectedSeverity === "severe") {
      const ethicsPayload = {
        judgeId,
        severity: selectedSeverity,
        comment: judgeComments,
      };

      await axios.put(`${API_URL}/ethics/${projectId}/judge`, ethicsPayload);
      console.log("Ethics violations submitted:", ethicsPayload);
    } else {
      console.log("No violations → skipping ethics update.");
    }

    // Store time used in AsyncStorage
    const timeUsed = 15 * 60 - timeLeft;
    await AsyncStorage.setItem("ethicsTimeUsed", timeUsed.toString());

    setTimerActive(false);
    //await sendEmailsToLearnersViaAPI(projectId);
    router.push("/judgecompletion");
    console.log("timeLeft:", timeLeft);
    console.log("timeUsed:", timeUsed);

  } catch (err) {
    console.error("Submission Error:", err.response?.data || err.message);
    Alert.alert("Error", err.response?.data?.message || "Submission failed.");
  } finally {
    setSubmitting(false);
  }
};


  if (loading) {
    return (
      <ImageBackground source={bgImage} style={styles.backgroundImage} resizeMode="cover">
        <StatusBar barStyle="light-content" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading ethics marksheet...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage} resizeMode="cover">
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <LinearGradient
            colors={["#E3F2FD", "#E8EAF6"]}
            style={styles.cardHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.screenTitle}>Ethics Checklist</Text>
            
            {/* Timer Container in Header */}
            <View style={styles.timerHeaderContainer}>
              <View style={styles.timerDisplay}>
                <Ionicons name="time-outline" size={16} color="#4F46E5" />
                <Text style={styles.timerLabel}>Time Left:</Text>
                <Text style={[styles.timerText, { color: timeLeft < 0 ? "#EF4444" : "#10B981" }]}>
                  {formatTime(timeLeft)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.timeControlButton}
                onPress={handleTimeControlClick}
              >
                <Text style={styles.timeControlButtonText}>Adjust Time</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.cardBody}>
            {/* Ethics Issues Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#4F46E5" />
                <Text style={styles.sectionTitle}>Ethics Issues Assessment</Text>
              </View>
              <Text style={styles.sectionDescription}>
                Check any ethics violations found in the project:
              </Text>
              
              <View style={styles.checksContainer}>
                {ethicsIssues.map((label, index) => (
                  <TouchableOpacity
                    key={`issue_${index}`}
                    style={[
                      styles.checkboxCard,
                      index % 2 === 0 ? styles.checkboxCardEven : styles.checkboxCardOdd,
                      ethicsChecks[`issue_${index}`] && styles.checkboxCardChecked
                    ]}
                    onPress={() => toggleCheck(`issue_${index}`)}
                  >
                    <View style={styles.checkboxRow}>
                      <View
                        style={[
                          styles.checkbox,
                          ethicsChecks[`issue_${index}`] && styles.checkboxChecked,
                        ]}
                      >
                        {ethicsChecks[`issue_${index}`] && (
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        )}
                      </View>
                      <Text style={[
                        styles.checkboxLabel,
                        ethicsChecks[`issue_${index}`] && styles.checkboxLabelChecked
                      ]}>
                        {label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Severity Assessment Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="alert-circle-outline" size={24} color="#4F46E5" />
                <Text style={styles.sectionTitle}>Severity Assessment</Text>
              </View>
              <Text style={styles.sectionDescription}>
                Select the overall severity of ethics violations:
              </Text>
              
              <View style={styles.radioContainer}>
                {[
                  { label: "No Violations Found", value: "none", icon: "checkmark-circle-outline", color: "#10B981" },
                  { label: "Moderate Violations", value: "moderate", icon: "warning-outline", color: "#F59E0B" },
                  { label: "Severe Violations", value: "severe", icon: "close-circle-outline", color: "#EF4444" },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.radioCard,
                      selectedSeverity === option.value && styles.radioCardSelected
                    ]}
                    onPress={() => handleSeveritySelect(option.value)}
                  >
                    <View style={styles.radioRow}>
                      <View
                        style={[
                          styles.radioCircle,
                          selectedSeverity === option.value && { borderColor: option.color }
                        ]}
                      >
                        {selectedSeverity === option.value && (
                          <View style={[styles.radioSelected, { backgroundColor: option.color }]} />
                        )}
                      </View>
                      <Ionicons 
                        name={option.icon} 
                        size={20} 
                        color={selectedSeverity === option.value ? option.color : "#6B7280"} 
                        style={styles.radioIcon}
                      />
                      <Text style={[
                        styles.radioLabel,
                        selectedSeverity === option.value && { color: option.color, fontWeight: '600' }
                      ]}>
                        {option.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Comments Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="chatbox-ellipses-outline" size={24} color="#4F46E5" />
                <Text style={styles.sectionTitle}>Judge's Comments</Text>
              </View>
              <Text style={styles.sectionDescription}>
                Provide additional comments or observations:
              </Text>
              
              <View style={styles.commentContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write your detailed comments here..."
                  placeholderTextColor="#6C7A89"
                  multiline
                  numberOfLines={4}
                  onChangeText={handleCommentChange}
                  value={judgeComments}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (submitting || judgeId === null) && styles.submitButtonDisabled
              ]}
              onPress={submitAllMarkingData}
              disabled={submitting || judgeId === null}
            >
              {submitting ? (
                <View style={styles.buttonLoadingContent}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.buttonText}>Submitting Marksheets...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Submit All Marksheets</Text>
                  <Ionicons name="paper-plane-outline" size={20} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Back Button */}
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
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
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
    marginBottom: 100,
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
  timerHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#A3B3C8",
  },
  timerDisplay: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  timerLabel: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 4,
    marginRight: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeControlButton: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  timeControlButtonText: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
  },
  cardBody: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 16,
  },
  sectionContainer: {
    backgroundColor: "#F9FAFB",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6B7280",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    fontStyle: "italic",
  },
  checksContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  checkboxCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkboxCardEven: {
    backgroundColor: "#F8FAFC",
  },
  checkboxCardOdd: {
    backgroundColor: "#FFFFFF",
  },
  checkboxCardChecked: {
    borderColor: "#4F46E5",
    backgroundColor: "#EBF5FF",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    minWidth: 20,
  },
  checkboxChecked: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  checkboxLabelChecked: {
    color: "#1F2937",
    fontWeight: "500",
  },
  radioContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  radioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  radioCardSelected: {
    borderColor: "#4F46E5",
    backgroundColor: "#EBF5FF",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#FFFFFF",
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioIcon: {
    marginRight: 8,
  },
  radioLabel: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  commentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  commentInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: "top",
    minHeight: 100,
    color: "#1F2937",
  },
  submitButton: {
    backgroundColor: "#4F46E5",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
    elevation: 2,
    shadowOpacity: 0.1,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLoadingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4F46E5",
    textAlign: "center",
  },
  // Floating circles styles (keeping for consistency but removing from rendered component)
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
  circle1: {
    top: 80,
    left: 40,
    width: 80,
    height: 80,
  },
  circle2: {
    top: 160,
    right: 80,
    width: 64,
    height: 64,
    opacity: 0.25,
  },
  circle3: {
    bottom: 160,
    left: 80,
    width: 48,
    height: 48,
  },
  circle4: {
    top: 240,
    left: width / 3,
    width: 32,
    height: 32,
    opacity: 0.3,
  },
  circle5: {
    bottom: 80,
    right: width / 3,
    width: 56,
    height: 56,
  },
});

export default EthicsMarksheet;
