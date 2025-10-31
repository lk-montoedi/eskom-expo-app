import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  Keyboard,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import bgImage from "../../assets/images/webbg.png";
import { API_URL } from "../constants/api";


const { width } = Dimensions.get("screen");
const statusFilters = ["Not Judged", "In-progress", "Completed"];

const ProjectsScreen = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attended, setAttended] = useState(false);
  const [scoreIntervals, setScoreIntervals] = useState({});
  const [filter, setFilter] = useState("Not Judged");
  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [judgeId, setJudgeId] = useState("");
  const [isConvener, setIsConvener] = useState(false);
  const [convenerCategory, setConvenerCategory] = useState("");
  const [eventId, setEventId] = useState("");
  const [conflicts, setConflicts] = useState([]);
  
  const [coJudgesScores, setCoJudgesScores] = useState({});
  const [loadingScores, setLoadingScores] = useState({});
  const [overrideModalVisible, setOverrideModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [overrideScore, setOverrideScore] = useState("");
  const [submittingOverride, setSubmittingOverride] = useState(false);
  
  // New state for recommendation
  const [recommendModalVisible, setRecommendModalVisible] = useState(false);
  const [recommendedProjects, setRecommendedProjects] = useState({});
  const [submittingRecommendation, setSubmittingRecommendation] = useState(false);
  const [recommendationReason, setRecommendationReason] = useState("");
  
  const projectsRef = React.useRef(projects);
  
  React.useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);

  React.useEffect(() => {
    isConvenerRef.current = isConvener;
  }, [isConvener]);

  const router = useRouter();

  const fetchConflicts = React.useCallback(async (userId) => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}/conflicts/marksheets/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setConflicts(data.conflicts || []);
      } else {
        setConflicts([]);
      }
    } catch (error) {
      console.error("Error fetching marksheet conflicts:", error);
      setConflicts([]);
    }
  }, []);

  const conflictedProjectIds = useMemo(() => new Set(conflicts.map(c => c.projectid)), [conflicts]);

  const nonConflictedProjects = useMemo(() => 
    projects.filter(p => !conflictedProjectIds.has(p.projectid)),
    [projects, conflictedProjectIds]
  );

  const counts = useMemo(
    () => ({
      "Not Judged": nonConflictedProjects.filter((p) => (p.status === "Not Judged" || p.status === "Registered") && p.type !== "none").length,
      "In-progress": nonConflictedProjects.filter((p) => p.status === "in-progress").length,
      "Completed": nonConflictedProjects.filter((p) => p.status === "completed").length,
    }),
    [nonConflictedProjects]
  );

  const checkIfConvener = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/ethics/is-convener/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setIsConvener(data.isConvener);
        setConvenerCategory(data.category || "");
        return { isConvener: data.isConvener, category: data.category };
      }
      return { isConvener: false, category: "" };
    } catch (err) {
      console.error("Error checking convener status:", err);
      return { isConvener: false, category: "" };
    }
  };

  const fetchProjectsForConvener = async (eventId, category) => {
    try {
      const { data } = await axios.get(`${API_URL}/projects/event/${eventId}`);
      console.log("API Response:", data);
      
      let projectsArray = [];
      if (Array.isArray(data)) {
        projectsArray = data;
      } else if (data && Array.isArray(data.projects)) {
        projectsArray = data.projects;
      } else if (data && Array.isArray(data.data)) {
        projectsArray = data.data;
      } else {
        console.warn("Unexpected API response structure:", data);
        return [];
      }
      
      const categoryProjects = projectsArray.filter(project => 
        project.category && project.category.toLowerCase() === category.toLowerCase()
      );
      
      console.log(`Found ${categoryProjects.length} projects in category: ${category}`);
      return categoryProjects;
    } catch (err) {
      console.error("Error fetching projects for convener:", err);
      throw err;
    }
  };

  const fetchAllocatedProjects = async (userId) => {
    try {
      const { data } = await axios.get(`${API_URL}/projects/allocated/${userId}`);
      return data.score || [];
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log("No projects found for this judge.");
        return [];
      } else if (err.response?.data?.message?.includes("No projects found for this judge")) {
        console.log("No projects found for this judge.");
        return [];
      } else {
        console.error("Error fetching allocated projects:", err);
        throw err;
      }
    }
  };

  // Fetch co-judges scores for a specific project - wrapped in useCallback
  const fetchCoJudgesScores = useCallback(async (projectId) => {
    if (!isConvenerRef.current) return;

    setLoadingScores(prev => ({ ...prev, [projectId]: true }));

    try {
      const url = `${API_URL}/marksheets/project/${projectId}/co-judges-scores`;
      const response = await axios.get(url);
      let scores = response.data?.scores || response.data?.data || response.data || [];

      if (!Array.isArray(scores)) scores = [scores];

      setCoJudgesScores(prev => {
        const prevScores = prev[projectId];
        if (JSON.stringify(prevScores) === JSON.stringify(scores)) return prev;
        return { ...prev, [projectId]: scores };
      });
    } catch (err) {
      console.error(`[DEBUG] Error fetching co-judges scores for ${projectId}:`, err);
    } finally {
      setLoadingScores(prev => ({ ...prev, [projectId]: false }));
    }
  }, []);
  
  const isConvenerRef = useRef(isConvener);
  useEffect(() => {
    isConvenerRef.current = isConvener;
  }, [isConvener]);

  // Override total score by convener
  const handleOverrideScore = async () => {
    if (!selectedProject) {
      Alert.alert("Error", "No project selected.");
      return;
    }

    const trimmed = overrideScore.trim();
    if (!/^\d+(\.\d+)?$/.test(trimmed)) {
      Alert.alert("Error", "Please enter a valid number for the score.");
      return;
    }
    const score = parseFloat(trimmed);
    if (isNaN(score) || score < 0 || score > 100) {
      Alert.alert("Error", "Score must be a number between 0 and 100.");
      return;
    }

    if (selectedProject.status !== "completed") {
      Alert.alert("Invalid Operation", "Score can only be overridden for completed projects.");
      return;
    }

    setSubmittingOverride(true);

    try {
      await axios.put(
        `${API_URL}/marksheets/project/${selectedProject.projectid}/convener-override`,
        {
          userId: judgeId,
          newTotalScore: score
        }
      );

      setOverrideModalVisible(false);
      setOverrideScore("");
      setSelectedProject(null);

      fetchCoJudgesScores(selectedProject.projectid);
    } catch (err) {
      console.error("Error overriding score:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to override score. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmittingOverride(false);
    }
  };

  // Handle recommendation toggle
  const handleRecommendation = async () => {
    if (!selectedProject) {
      Alert.alert("Error", "No project selected.");
      return;
    }

    const projectId = selectedProject.projectid || selectedProject.id;
    const isCurrentlyRecommended = recommendedProjects[projectId];
    
    // If recommending (not removing), validate reason
    if (!isCurrentlyRecommended && !recommendationReason.trim()) {
      Alert.alert("Error", "Please provide a reason for recommending this project.");
      return;
    }
    
    if (!eventId || !judgeId) {
      Alert.alert("Error", "Missing event or user information.");
      return;
    }

    setSubmittingRecommendation(true);

    try {
      if (isCurrentlyRecommended) {
        // Use DELETE endpoint to remove recommendation
        await axios.delete(
          `${API_URL}/recommendations/${eventId}/${judgeId}/${projectId}`
        );
      } else {
        // Use POST endpoint to add recommendation
        await axios.post(
          `${API_URL}/recommend/${eventId}/${judgeId}/${projectId}`,
          {
            reason: recommendationReason.trim()
          }
        );
      }

      // Toggle the local state
      const newStatus = !isCurrentlyRecommended;
      setRecommendedProjects(prev => ({
        ...prev,
        [projectId]: newStatus
      }));

      

      setRecommendModalVisible(false);
      setSelectedProject(null);
      setRecommendationReason(""); // Clear reason after submission
    } catch (err) {
      console.error("Error toggling recommendation:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to update recommendation. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmittingRecommendation(false);
    }
  };

  // Show override modal - with status check
  const showOverrideModal = (project) => {
    if (project.status !== "completed") {
      Alert.alert(
        "Invalid Operation", 
        "Score can only be overridden for projects with 'Completed' status.\n\nCurrent status: " + 
        (project.status === "Registered" ? "Not Judged" : project.status),
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    setSelectedProject(project);
    setOverrideScore("");
    setOverrideModalVisible(true);
  };

  // Show recommendation modal
  const showRecommendModal = (project) => {
    setSelectedProject(project);
    setRecommendationReason(""); // Clear previous reason
    setRecommendModalVisible(true);
  };

  // Render co-judges scores section
  const renderCoJudgesScores = (project) => {
    if (!isConvener) {
      console.log("[DEBUG] Not convener, not rendering scores");
      return null;
    }

    const projectId = project.projectid || project.id;
    const scores = coJudgesScores[projectId];
    const loading = loadingScores[projectId];
    const isCompleted = project.status === "completed";
    const isRecommended = recommendedProjects[projectId];

    console.log(`[DEBUG] Rendering scores for project ${projectId}:`);
    console.log(`[DEBUG] - Loading:`, loading);
    console.log(`[DEBUG] - Scores:`, scores);

    return (
      <View style={styles.scoresSection}>
        <View style={styles.scoresSectionHeader}>
          <Text style={styles.scoresSectionTitle}>Co-Judges Scores</Text>
        </View>

        {loading ? (
          <View style={styles.scoresLoading}>
            <ActivityIndicator size="small" color="#4F46E5" />
            <Text style={styles.scoresLoadingText}>Loading scores...</Text>
          </View>
        ) : scores?.error ? (
          <Text style={styles.scoresError}>{scores.error}</Text>
        ) : scores && Array.isArray(scores) && scores.length > 0 ? (
          <View>
            {scores.map((score, index) => {
              const judgeLabel = score.judgeName || score.judge_name || `Judge ${score.judgeId || score.judgeid}`;
              return (
                <View key={index} style={styles.scoreItem}>
                  <Text style={styles.scoreText}>
                    {judgeLabel}: <Text style={styles.scoreValue}>{score.totalScore || score.totalscore || 'N/A'}</Text>
                  </Text>
                </View>
              );
            })}
            
            {/* Recommendation Status Badge - Only for completed */}
            {isCompleted && (
              <View style={styles.recommendationStatusBadge}>
                <Ionicons 
                  name={isRecommended ? "star" : "star-outline"} 
                  size={16} 
                  color={isRecommended ? "#F59E0B" : "#9CA3AF"} 
                />
                <Text style={[
                  styles.recommendationStatusText,
                  isRecommended && styles.recommendationStatusTextActive
                ]}>
                  {isRecommended ? "Recommended for Shortlist" : "Not Recommended"}
                </Text>
              </View>
            )}

            {/* Buttons Container */}
            <View style={styles.convenerButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.overrideButton,
                  !isCompleted && styles.overrideButtonDisabled
                ]}
                onPress={() => showOverrideModal(project)}
                disabled={!isCompleted}
              >
                <Ionicons name="create-outline" size={16} color="#fff" />
                <Text style={styles.overrideButtonText}>
                  {isCompleted ? "Override Score" : "Override Unavailable"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.recommendButton,
                  isRecommended && styles.recommendButtonActive,
                  !isCompleted && styles.recommendButtonDisabled
                ]}
                onPress={() => showRecommendModal(project)}
                disabled={!isCompleted}
              >
                <Ionicons 
                  name={isRecommended ? "close-circle-outline" : "star-outline"} 
                  size={16} 
                  color="#fff" 
                />
                <Text style={styles.recommendButtonText}>
                  {isCompleted ? (isRecommended ? "Remove Recommendation" : "Recommend") : "Recommend Unavailable"}
                </Text>
              </TouchableOpacity>
            </View>

            {!isCompleted && (
              <Text style={styles.overrideDisabledText}>
                Override and recommendation only available for completed projects
              </Text>
            )}
          </View>
        ) : (
          <View>
            <Text style={styles.noScoresText}>
              {project.status === "Not Judged" || project.status === "Registered" 
                ? "No scores available - Project not judged yet"
                : "No scores found"
              }
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Fetch recommendation status for a specific project
  const fetchRecommendationStatus = async (projectId, storedEventId) => {
  if (!isConvenerRef.current || !storedEventId) return;

  try {
    const response = await axios.get(
      `${API_URL}/recommendations/${storedEventId}/${projectId}`
    );

    // Backend returns an array of recommendation objects
    const recommendations = response.data;

    const isRecommended = Array.isArray(recommendations) && recommendations.length > 0;

    setRecommendedProjects(prev => ({
      ...prev,
      [projectId]: isRecommended
    }));
  } catch (err) {
    // If 404 or any error, project is not recommended
    console.log(`[DEBUG] Project ${projectId} is not recommended or error:`, err.response?.status);
    setRecommendedProjects(prev => ({
      ...prev,
      [projectId]: false
    }));
  }
};


  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      setLoading(true);
      
      const fetchProjects = async () => {
        try {
          const attendedFlag = await AsyncStorage.getItem("attended");
          const storedEventId = await AsyncStorage.getItem("eventid");
          const storedCategory = await AsyncStorage.getItem("category");
          
          console.log("Session info:", { attendedFlag, storedEventId, storedCategory });
          
          if (isActive) {
            setAttended(attendedFlag === "true");
            setEventId(storedEventId || "");
          }

          const tokenStr = await AsyncStorage.getItem("userToken");
          if (!tokenStr) {
            console.log("No user token found");
            return;
          }

          const { userid } = JSON.parse(tokenStr);
          if (isActive) setJudgeId(userid);

          await fetchConflicts(userid);

          const convenerInfo = await checkIfConvener(userid);
          console.log("Convener info:", convenerInfo);
          
          let projectsData = [];

          if (convenerInfo.isConvener && storedEventId && convenerInfo.category) {
            console.log(`Fetching projects for convener - Event: ${storedEventId}, Category: ${convenerInfo.category}`);
            projectsData = await fetchProjectsForConvener(storedEventId, convenerInfo.category);
          } else {
            console.log("Fetching allocated projects for judge:", userid);
            projectsData = await fetchAllocatedProjects(userid);
          }

          if (isActive) {
            console.log("Setting projects:", projectsData.length, "projects found");
            setProjects(projectsData);
            
            // Fetch scores and recommendation status for all projects if convener
            if (convenerInfo.isConvener && projectsData.length > 0 && storedEventId) {
              await Promise.all(projectsData.map(async (project) => {
                const projectId = project.projectid || project.id;
                // Fetch co-judges scores
                await fetchCoJudgesScores(projectId);
                // Fetch recommendation status
                await fetchRecommendationStatus(projectId, storedEventId);
              }));
            }
          }
        } catch (err) {
          console.error("Error in fetchProjects:", err);
          if (isActive) {
            setProjects([]);
          }
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchProjects();
      
      return () => {
        isActive = false;
      };
    }, [fetchConflicts, fetchCoJudgesScores]) // Removed fetchRecommendationStatus from dependency array since it's not a useCallback
  );

  let filteredProjects =
    filter === "All"
      ? nonConflictedProjects
      : nonConflictedProjects.filter((project) => {
          if (filter === "Not Judged") return project.status === "Not Judged" || project.status === "Registered";
          if (filter === "In-progress") return project.status === "in-progress";
          if (filter === "Completed") return project.status === "completed";
          return true;
        });

  if (searchActive && searchText.trim()) {
    const lowerSearch = searchText.trim().toLowerCase();
    filteredProjects = filteredProjects.filter(
      (project) =>
        (project.projectname && project.projectname.toLowerCase().includes(lowerSearch)) ||
        (project.standnumber && project.standnumber.toString().toLowerCase().includes(lowerSearch)) ||
        (project.description && project.description.toLowerCase().includes(lowerSearch))
    );
  }

  const handleProjectPress = (project) => {
    if (isConvener) {
      return;
    }
    router.push({
      pathname: "/marking",
      params: {
        projectId: project.projectid || project.id,
        marksheetType: project.type || "engineering",
        judgeId,
        marksheetId: project.marksheetid || "",
      },
    });
  };

  const projectsToRender = filteredProjects.filter((project) => project.type !== "none");

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
            <Text style={styles.screenTitle}>
              {isConvener ? "Category Projects" : "Projects Management"}
            </Text>
            {isConvener && convenerCategory && (
              <Text style={styles.categoryText}>Category: {convenerCategory}</Text>
            )}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6C7A89" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by Stand Number or Project Name..."
                placeholderTextColor="#6C7A89"
                value={searchText}
                onChangeText={setSearchText}
                onFocus={() => setSearchActive(true)}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Ionicons name="close-circle" size={20} color="#6C7A89" />
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>

          <View style={styles.cardBody}>
            {attended && (
              <>
                <View style={styles.filterContainer}>
                  {statusFilters.map((f) => (
                    <TouchableOpacity
                      key={f}
                      style={[styles.filterButton, filter === f && styles.filterButtonActive]}
                      onPress={() => setFilter(f)}
                    >
                      <Text style={[styles.filterButtonText, filter === f && styles.filterButtonTextActive]}>
                        {f} ({counts[f]})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {loading ? (
                  <View style={styles.center}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                    <Text style={styles.loadingText}>Loading projects...</Text>
                  </View>
                ) : projectsToRender.length === 0 ? (
                  <View style={styles.emptyListContainer}>
                    <Ionicons name="folder-open-outline" size={48} color="#6C7A89" />
                    <Text style={styles.emptyListText}>No projects found</Text>
                    <Text style={styles.emptyListSubText}>
                      {isConvener 
                        ? `No projects found in ${convenerCategory} category`
                        : "Try adjusting your search criteria"
                      }
                    </Text>
                  </View>
                ) : (
                  projectsToRender
                    .map((project, idx) => (
                      <TouchableOpacity
                        key={project.projectid || idx}
                        style={[styles.projectCard, idx % 2 === 0 ? styles.projectCardEven : styles.projectCardOdd]}
                        onPress={() => handleProjectPress(project)}
                      >
                        <View style={styles.projectCardInner}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <View style={{ flex: 1 }}>
                              <View style={styles.projectDetailRow}>
                                <Text style={styles.projectTitle}>{project.projectname || "Unnamed Project"}</Text>
                              </View>
                              <View style={styles.projectDetailRow}>
                                <Ionicons name="barcode-outline" size={16} color="#4F46E5" />
                                <Text style={styles.projectDetailText}>Stand: {project.standnumber || "N/A"}</Text>
                              </View>
                              <View style={styles.projectDetailRow}>
                                <Ionicons name="pricetag-outline" size={16} color="#9CA3AF" />
                                <Text style={styles.projectDetailText}>Category: {project.category || "None"}</Text>
                              </View>
                              <View style={styles.projectDetailRow}>
                                <Ionicons
                                  name="pulse-outline"
                                  size={16}
                                  color={
                                    project.status === "Registered" || project.status === "Not Judged"
                                      ? "#EF4444"
                                      : project.status === "in-progress"
                                      ? "#F59E0B"
                                      : "#10B981"
                                  }
                                />
                                <Text
                                  style={[
                                    styles.projectDetailText,
                                    project.status === "Registered" || project.status === "Not Judged"
                                      ? styles.statusNotJudged
                                      : project.status === "in-progress"
                                      ? styles.statusInProgress
                                      : styles.statusCompleted,
                                  ]}
                                >
                                  Status: {project.status === "Registered" ? "Not Judged" : project.status}
                                </Text>
                              </View>
                            </View>
                            {!isConvener && (project.status === 'completed' || project.status === 'in-progress') && (
                              <View style={styles.yourMarkContainer}>
                                <Text style={styles.yourMarkLabel}>Your Mark</Text>
                                <Text style={styles.yourMarkScore}>{project.totalscore != null ? Math.round(project.totalscore) : 'N/A'}</Text>
                              </View>
                            )}
                          </View>

                          {isConvener && (
                            <View style={styles.convenerBadge}>
                              <Ionicons name="eye-outline" size={14} color="#4F46E5" />
                              <Text style={styles.convenerBadgeText}>Convener View</Text>
                            </View>
                          )}
                          
                          {renderCoJudgesScores(project)}
                        </View>
                      </TouchableOpacity>
                    ))
                )}
              </>
            )}

            {!attended && (
              <View style={styles.center}>
                <Text style={styles.attendanceWarning}>You must join the event before accessing projects.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Override Score Modal */}
      <Modal
        visible={overrideModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setOverrideModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Override Total Score</Text>
            <Text style={styles.modalSubtitle}>
              Project: {selectedProject?.projectname}
            </Text>
            <Text style={styles.modalStatusText}>
              Status: <Text style={styles.modalStatusValue}>{selectedProject?.status}</Text>
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Enter new total score (0-100)"
              keyboardType="numeric"
              value={overrideScore}
              onChangeText={setOverrideScore}
              maxLength={5}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setOverrideModalVisible(false)}
                disabled={submittingOverride}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSubmitButton]}
                onPress={handleOverrideScore}
                disabled={submittingOverride}
              >
                {submittingOverride ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSubmitButtonText}>Override</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Recommendation Modal */}
      <Modal
        visible={recommendModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setRecommendModalVisible(false);
          setRecommendationReason("");
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons 
                name={recommendedProjects[selectedProject?.projectid || selectedProject?.id] ? "star" : "star-outline"} 
                size={48} 
                color="#F59E0B" 
                style={styles.modalIcon}
              />
              <Text style={styles.modalTitle}>
                {recommendedProjects[selectedProject?.projectid || selectedProject?.id] 
                  ? "Remove Recommendation" 
                  : "Recommend for Shortlist"}
              </Text>
              <Text style={styles.modalSubtitle}>
                Project: {selectedProject?.projectname}
              </Text>

              {!recommendedProjects[selectedProject?.projectid || selectedProject?.id] ? (
                <>
                  <Text style={styles.modalDescription}>
                    Please provide a reason for recommending this project for the shortlist:
                  </Text>
                  <TextInput
                    style={styles.modalTextArea}
                    placeholder="Enter reason for recommendation..."
                    placeholderTextColor="#9CA3AF"
                    value={recommendationReason}
                    onChangeText={setRecommendationReason}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </>
              ) : (
                <Text style={styles.modalDescription}>
                  Are you sure you want to remove this project from the shortlist recommendations?
                </Text>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => {
                    setRecommendModalVisible(false);
                    setRecommendationReason("");
                  }}
                  disabled={submittingRecommendation}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton, 
                    recommendedProjects[selectedProject?.projectid || selectedProject?.id]
                      ? styles.modalRemoveButton
                      : styles.modalRecommendButton
                  ]}
                  onPress={handleRecommendation}
                  disabled={submittingRecommendation}
                >
                  {submittingRecommendation ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.modalSubmitButtonText}>
                      {recommendedProjects[selectedProject?.projectid || selectedProject?.id]
                        ? "Remove"
                        : "Recommend"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    marginBottom: 16,
    textAlign: "center",
  },
  categoryText: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A3B3C8",
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    marginLeft: 8,
  },
  cardBody: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#4F46E5",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
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
  },
  emptyListContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4F46E5",
    marginTop: 16,
    textAlign: "center",
  },
  emptyListSubText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  projectCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
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
  projectCardInner: {
    paddingHorizontal: 0,
  },
  projectDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  projectDetailText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
  },
  yourMarkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E0E7FF',
    borderRadius: 8,
  },
  yourMarkLabel: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: 'bold',
  },
  yourMarkScore: {
    color: '#3730A3',
    fontSize: 28,
    fontWeight: 'bold',
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
  convenerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E7FF",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  convenerBadgeText: {
    marginLeft: 4,
    color: "#4F46E5",
    fontSize: 12,
  },
  scoresSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 16,
  },
  scoresSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  scoresSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  scoresLoading: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoresLoadingText: {
    marginLeft: 8,
    color: "#666",
  },
  scoresError: {
    color: "red",
  },
  scoreItem: {
    marginBottom: 4,
  },
  scoreText: {
    color: "#666",
  },
  scoreValue: {
    fontWeight: "bold",
  },
  recommendationStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  recommendationStatusText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  recommendationStatusTextActive: {
    color: "#F59E0B",
    fontWeight: "600",
  },
  convenerButtonsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  overrideButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  overrideButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  overrideButtonText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "600",
  },
  recommendButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  recommendButtonActive: {
    backgroundColor: "#EF4444",
  },
  recommendButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  recommendButtonText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "600",
  },
  overrideDisabledText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  noScoresText: {
    color: "#666",
  },
  attendanceWarning: {
    fontSize: 18,
    color: "#EF4444",
    textAlign: "center",
    fontWeight: "600",
    marginHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },
  modalIcon: {
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#1F2937",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  modalStatusText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  modalStatusValue: {
    fontWeight: "bold",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalTextArea: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 14,
    minHeight: 100,
    maxHeight: 150,
    backgroundColor: "#F9FAFB",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#E5E7EB",
  },
  modalCancelButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 16,
  },
  modalSubmitButton: {
    backgroundColor: "#4F46E5",
  },
  modalRecommendButton: {
    backgroundColor: "#10B981",
  },
  modalRemoveButton: {
    backgroundColor: "#EF4444",
  },
  modalSubmitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  unlockButton: {
    backgroundColor: "#4CAF50",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  unlockButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProjectsScreen;