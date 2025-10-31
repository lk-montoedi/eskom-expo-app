import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import bgImage from "../../assets/images/webbg.png";
import { API_URL } from "../constants/api";

const { width } = Dimensions.get("window");
const statusFilters = ["all", "flagged", "unflagged"];

const EthicsScreen = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isConvener, setIsConvener] = useState(null);
  const [convenerCategory, setConvenerCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [eventInfo, setEventInfo] = useState(null);
  const [searchActive, setSearchActive] = useState(false);

  const router = useRouter();
  const { refresh } = useLocalSearchParams();

  const counts = useMemo(
    () => ({
      all: projects.length,
      flagged: projects.filter((p) => p.flagStatus === "flagged").length,
      unflagged: projects.filter((p) => p.flagStatus === "unflagged").length,
    }),
    [projects]
  );

  const loadUserSession = useCallback(async () => {
    try {
      const tokenStr = await AsyncStorage.getItem("userToken");
      if (!tokenStr) {
        setError("Login session missing. Please log in again.");
        setLoading(false);
        return;
      }
      const { userid } = JSON.parse(tokenStr);
      setCurrentUserId(userid);
    } catch (err) {
      console.error("Session Error:", err);
      setError("Failed to load session.");
      setLoading(false);
    }
  }, []);

  const checkIfConvener = useCallback(async (userId) => {
    try {
      const response = await fetch(`${API_URL}/ethics/is-convener/${userId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error checking role");
      }
      setIsConvener(data.isConvener);
      setConvenerCategory(data.category);
    } catch (err) {
      console.error("Convener Check Error:", err);
      setError("Failed to determine user role.");
    }
  }, []);

  const fetchEthicsProjects = useCallback(
    async (userId, convenerStatus) => {
      try {
        setLoading(true);
        const endpoint = convenerStatus
          ? `${API_URL}/ethics/flagged-projects/convener/${userId}`
          : `${API_URL}/ethics/flagged-projects/${userId}`;

        const response = await axios.get(endpoint);
        const data = response.data;
        const rawProjects = data.projects || [];

// Keep only projects with at least one judge having "moderate" or "severe"
      const filtered = rawProjects.filter((p) => {
        const severities = [
          p.judge1?.severity?.toLowerCase(),
          p.judge2?.severity?.toLowerCase(),
          p.convenorSeverity?.toLowerCase(),
        ];
        return severities.includes("moderate") || severities.includes("severe");
      });

      setProjects(rawProjects);

        if (convenerStatus) {
          setProjects(data.projects || []);
          setEventInfo({
            eventId: data.eventId,
            eventName: data.eventName,
            convenerCategory: data.convenerCategory,
          });
        } else {
          setProjects(data.projects || []);
          setEventInfo({
            eventId: data.eventId,
            eventName: data.eventName,
          });
        }
        setError(null);
      } catch (err) {
        console.error("Project Fetch Error:", err);
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch projects. Please try again.");
        }
        setProjects([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const onRefresh = useCallback(async () => {
    if (!currentUserId || isConvener === null) return;
    setRefreshing(true);
    await fetchEthicsProjects(currentUserId, isConvener);
    setRefreshing(false);
  }, [currentUserId, isConvener, fetchEthicsProjects]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const init = async () => {
        await loadUserSession();
        if (isActive && currentUserId) {
          await checkIfConvener(currentUserId);
          if (isActive && isConvener !== null) {
            await fetchEthicsProjects(currentUserId, isConvener);
          }
        }
      };
      init();
      return () => {
        isActive = false;
      };
    }, [
      loadUserSession,
      checkIfConvener,
      fetchEthicsProjects,
      currentUserId,
      isConvener,
    ])
  );

  useEffect(() => {
    if (refresh === "true" && currentUserId && isConvener !== null) {
      fetchEthicsProjects(currentUserId, isConvener);
    }
  }, [refresh, currentUserId, isConvener, fetchEthicsProjects]);

  let filteredProjects = projects.filter((project) => {
    const matchesSearch = project.projectName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || project.flagStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleProjectPress = (projectId) => {
    if (isConvener) {
      router.push({
        pathname: "/con-review",
        params: { projectId: projectId.toString(), userId: currentUserId },
      });
    }
  };

  // Update the renderItem function in EthicsScreen component


const renderItem = ({ item, index }) => {
  const isEven = index % 2 === 0;
  const severityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case "severe":
        return styles.statusNotJudged;
      case "moderate":
        return styles.statusInProgress;
      case "low":
      case "minor":
        return styles.statusCompleted;
      default:
        return null;
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "flagged":
        return styles.statusNotJudged;
      case "unflagged":
        return styles.statusCompleted;
      default:
        return null;
    }
  };

  // Helper to check if severity should be shown
  const shouldShowSeverity = (severity) => {
    return severity && ["moderate", "severe"].includes(severity.toLowerCase());
  };

  return (
    <TouchableOpacity
      onPress={() => handleProjectPress(item.projectId)}
      style={[styles.projectCard, isEven ? styles.projectCardEven : styles.projectCardOdd]}
      disabled={!isConvener}
    >
      <View style={styles.projectCardInner}>
        <Text style={styles.projectTitle}>{item.projectName || "Unnamed Project"}</Text>
        <View style={styles.projectDetailRow}>
          <Ionicons name="pricetag-outline" size={16} color="#9CA3AF" />
          <Text style={styles.projectDetailText}>
            {item.category || convenerCategory || "Not Specified"}
            
          </Text>
        </View>
        <View style={styles.projectDetailRow}>
          <Ionicons
            name="pulse-outline"
            size={16}
            color={statusStyle(item.flagStatus)?.color}
          />
          <Text style={[styles.projectDetailText, statusStyle(item.flagStatus)]}>
            Status: {item.flagStatus?.toUpperCase()}
          </Text>
        </View>

        {/* Judge 1 Info - Always show name if exists */}
        {item.judge1 && item.judge1.id && (
          <View style={styles.judgeInfo}>
            <Text style={styles.judgeLabel}>
              Judge 1: {item.judge1.name || "N/A"}
            </Text>
            {shouldShowSeverity(item.judge1.severity) && (
              <Text style={[styles.severityText, severityStyle(item.judge1.severity)]}>
                {item.judge1.severity?.toUpperCase()}
              </Text>
            )}
            {shouldShowSeverity(item.judge1.severity) && item.judge1.comment && (
              <Text style={styles.commentText} numberOfLines={2}>
                "{item.judge1.comment}"
              </Text>
            )}
          </View>
        )}

        {/* Judge 2 Info - Always show name if exists */}
        {item.judge2 && item.judge2.id && (
          <View style={styles.judgeInfo}>
            <Text style={styles.judgeLabel}>
              Judge 2: {item.judge2.name || "N/A"}
            </Text>
            {shouldShowSeverity(item.judge2.severity) && (
              <Text style={[styles.severityText, severityStyle(item.judge2.severity)]}>
                {item.judge2.severity?.toUpperCase()}
              </Text>
            )}
            {shouldShowSeverity(item.judge2.severity) && item.judge2.comment && (
              <Text style={styles.commentText} numberOfLines={2}>
                "{item.judge2.comment}"
              </Text>
            )}
          </View>
        )}

        {/* Convener Review - Only show if convener and has reviewed */}
        {isConvener && item.convenorSeverity && (
          <View style={styles.convenorInfo}>
            <Text style={styles.convenorLabel}>Your Review:</Text>
            <Text style={[styles.severityText, severityStyle(item.convenorSeverity)]}>
              {item.convenorSeverity?.toUpperCase()}
            </Text>
            {item.convenorComment && (
              <Text style={styles.commentText} numberOfLines={2}>
                "{item.convenorComment}"
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

  if (loading || isConvener === null) {
    return (
      <ImageBackground source={bgImage} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading ethics projects...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground source={bgImage} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              if (currentUserId) {
                checkIfConvener(currentUserId);
              }
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage} resizeMode="cover">
      <StatusBar barStyle="light-content" />
      <View style={styles.card}>
        <LinearGradient
          colors={["#E3F2FD", "#E8EAF6"]}
          style={styles.cardHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.screenTitle}>Ethics Review</Text>
          {eventInfo && (
            <Text style={styles.eventInfo}>
              {eventInfo.eventName}
              {isConvener && convenerCategory && ` • ${convenerCategory}`}
            </Text>
          )}
          <Text style={styles.roleIndicator}>
            {isConvener ? "Convener" : "Judge"}
          </Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#6C7A89" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by Project Name..."
              placeholderTextColor="#6C7A89"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchActive(true)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#6C7A89" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
        <View style={styles.cardBody}>
          <View style={styles.filterContainer}>
            {statusFilters.map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterButton,
                  filterStatus === f && styles.filterButtonActive,
                ]}
                onPress={() => setFilterStatus(f)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterStatus === f && styles.filterButtonTextActive,
                  ]}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <FlatList
            data={filteredProjects}
            keyExtractor={(item) => item.projectId.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#4F46E5"
              />
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Ionicons name="folder-open-outline" size={48} color="#6C7A89" />
                <Text style={styles.emptyListText}>
                  {searchQuery || filterStatus !== "all"
                    ? "No projects match your criteria"
                    : "No ethics projects found"}
                </Text>
                {projects.length === 0 && (
                  <Text style={styles.emptyListSubText}>
                    Projects with ethics concerns will appear here
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "white",
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
    marginVertical: 48,
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
  eventInfo: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 4,
    textAlign: "center",
  },
  roleIndicator: {
    fontSize: 14,
    color: "#6C7A89",
    fontWeight: "500",
    marginBottom: 16,
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
    width: "100%",
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
    flex: 1,
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
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: "#4F46E5",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  flatListContent: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  projectCard: {
    backgroundColor: "#fff",
    padding: 16,
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
  statusNotJudged: {
    color: "#EF4444",
  },
  statusInProgress: {
    color: "#F59E0B",
  },
  statusCompleted: {
    color: "#10B981",
  },
  statusDismissed: {
    color: "#9CA3AF",
  },
  judgeInfo: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#4F46E5",
  },
  convenorInfo: {
    backgroundColor: "#E8F5E8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#10B981",
  },
  judgeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  convenorLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
    marginBottom: 4,
  },
  severityText: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 12,
    color: "#6C7A89",
    fontStyle: "italic",
    lineHeight: 16,
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
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
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
});

export default EthicsScreen;