import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import { useMarksheets } from "../contexts/MarksheetContext";
import { API_URL } from "../constants/api";
import { useAuth } from "../hooks/useAuth";

const { width } = Dimensions.get("window");

const MarksheetsScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { projects, loading, fetchMarksheets } = useMarksheets();
  const [filter, setFilter] = useState("Not Assigned");
  const [sortAsc, setSortAsc] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [attended, setAttended] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [isConvener, setIsConvener] = useState(false);

  useEffect(() => {
    setIsConvener(user?.role?.toLowerCase() === 'convener');
  }, [user]);

  // Animation values
  const pulseAnim1 = useState(new Animated.Value(1))[0];
  const pulseAnim2 = useState(new Animated.Value(1))[0];
  const pulseAnim3 = useState(new Animated.Value(1))[0];
  const bounceAnim1 = useState(new Animated.Value(0))[0];
  const bounceAnim2 = useState(new Animated.Value(0))[0];

  const marksheetTypes = [
    { label: "Mathematics", value: "mathematics" },
    { label: "Social Science", value: "social-science" },
    { label: "Scientific Investigations", value: "scientific-investigations" },
    { label: "Engineering", value: "engineering" },
  ];

  const displayProjects = useMemo(() => {
    if (isConvener) {
        const uniqueProjects = new Map();
        projects.forEach(p => {
            if (!uniqueProjects.has(p.projectid)) {
                uniqueProjects.set(p.projectid, p);
            }
        });
        return Array.from(uniqueProjects.values());
    }
    return projects;
}, [projects, isConvener]);

  // Count projects by assignment status
  const counts = {
    "Not Assigned": displayProjects.filter(p => !p.assignedmarksheettype || p.assignedmarksheettype === "none").length,
    "Assigned": displayProjects.filter(p => p.assignedmarksheettype && p.assignedmarksheettype !== "none").length,
  };

  const fetchConflicts = useCallback(async () => {
    if (!user?.userid) return;

    try {
      const response = await fetch(`${API_URL}/conflicts/marksheets/${user.userid}`);
      if (response.ok) {
        const data = await response.json();
        setConflicts(data.conflicts || []);
      } else {
        setConflicts([]);
      }
    } catch (error) {
      setConflicts([]);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const checkAttendanceAndFetch = async () => {
        const attendedFlag = await AsyncStorage.getItem("attended");
        if (isActive) {
          setAttended(attendedFlag === "true");
        }
        fetchMarksheets();
        fetchConflicts();
      };
      checkAttendanceAndFetch();
      return () => {
        isActive = false;
      };
    }, [fetchMarksheets, fetchConflicts])
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

  let filteredProjects = [...displayProjects];
  if (filter === "Assigned") {
    filteredProjects = filteredProjects.filter(
      (p) => p.assignedmarksheettype && p.assignedmarksheettype !== "none"
    );
  } else if (filter === "Not Assigned") {
    filteredProjects = filteredProjects.filter(
      (p) => !p.assignedmarksheettype || p.assignedmarksheettype === "none"
    );
  }

  if (searchActive && searchText.trim()) {
    const lowerSearch = searchText.trim().toLowerCase();
    filteredProjects = filteredProjects.filter((project) => {
      const marksheetTypeLabel = project.assignedmarksheettype
        ? marksheetTypes
            .find((type) => type.value === project.assignedmarksheettype)
            ?.label?.toLowerCase() || "none"
        : "none";
      return (
        project.projectname?.toLowerCase().includes(lowerSearch) ||
        project.standnumber?.toString().toLowerCase().includes(lowerSearch) ||
        marksheetTypeLabel.includes(lowerSearch)
      );
    });
  }

  filteredProjects.sort((a, b) =>
    sortAsc
      ? a.projectname.localeCompare(b.projectname)
      : b.projectname.localeCompare(a.projectname)
  );

  const navigateToAssignMarksheet = (project) => {
    const conflict = conflicts.find(c => c.projectid === project.projectid);
    router.push({
      pathname: "/assign-marksheet",
      params: { projectId: project.projectid, conflictId: conflict ? conflict.id : null },
    });
  };

  const tabs = ["Not Assigned", "Assigned"];

  return (
    <ImageBackground
      source={bgImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <FloatingCircles />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <LinearGradient
            colors={["#E3F2FD", "#E8EAF6"]}
            style={styles.cardHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.screenTitle}>Assign Marksheets</Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6C7A89" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search projects..."
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
            {!attended ? (
              <View style={styles.center}>
                <Text style={styles.attendanceWarning}>
                  You must join the event before assigning marksheets.
                </Text>
              </View>
            ) : loading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Loading projects...</Text>
              </View>
            ) : (
              <>
                {/* Filter Buttons */}
                <View style={styles.filterContainer}>
                  {tabs.map(tab => (
                    <TouchableOpacity
                      key={tab}
                      style={[
                        styles.filterButton,
                        filter === tab && styles.filterButtonActive,
                      ]}
                      onPress={() => setFilter(tab)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          filter === tab && styles.filterButtonTextActive,
                        ]}
                      >
                        {tab} ({counts[tab]})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {filteredProjects.length === 0 ? (
                  <View style={styles.emptyListContainer}>
                    <Ionicons
                      name="folder-open-outline"
                      size={48}
                      color="#6C7A89"
                    />
                    <Text style={styles.emptyListText}>No projects found</Text>
                    <Text style={styles.emptyListSubText}>Try adjusting your search criteria</Text>
                  </View>
                ) : (
                  filteredProjects.map((project, index) => {
                    const marksheetTypeLabel = project.assignedmarksheettype
                      ? marksheetTypes.find(
                          (type) => type.value === project.assignedmarksheettype
                        )?.label || "None"
                      : "None";
                    const isNone =
                      !project.assignedmarksheettype ||
                      marksheetTypeLabel === "None";

                    const hasConflict = conflicts.some(c => c.projectid === project.projectid);

                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => navigateToAssignMarksheet(project)}
                        disabled={!isNone && !isConvener}
                        style={[
                          styles.projectCard,
                          index % 2 === 0 ? styles.projectCardEven : styles.projectCardOdd,
                          hasConflict && { borderColor: '#F97316', borderWidth: 2 }
                        ]}
                      >
                        <View style={styles.projectCardInner}>
                          <View style={styles.projectDetailRow}>
                            <Text style={styles.projectTitle}>
                              {project.projectname || "Unnamed Project"}
                            </Text>
                          </View>
                          <View style={styles.projectDetailRow}>
                            <Ionicons
                              name="barcode-outline"
                              size={16}
                              color="#4F46E5"
                            />
                            <Text style={styles.projectDetailText}>
                              Stand: {project.standnumber || "N/A"}
                            </Text>
                          </View>
                          <View style={styles.projectDetailRow}>
                            <Ionicons
                              name="pricetag-outline"
                              size={16}
                              color="#9CA3AF"
                            />
                            <Text style={styles.projectDetailText}>
                              Category: {project.category || "None"}
                            </Text>
                          </View>
                          <View style={styles.projectDetailRow}>
                            <Ionicons
                              name="document-text-outline"
                              size={16}
                              color={isNone ? "#EF4444" : "#10B981"}
                            />
                            <Text
                              style={[
                                styles.projectDetailText,
                                {
                                  color: isNone ? "#EF4444" : "#10B981",
                                  fontWeight: "bold",
                                },
                              ]}
                            >
                              Marksheet: {marksheetTypeLabel}
                            </Text>
                          </View>
                          {hasConflict && (
                            <View style={styles.projectDetailRow}>
                                <Ionicons
                                name="alert-circle-outline"
                                size={16}
                                color="#F97316"
                                />
                                <Text style={{color: '#F97316', fontWeight: 'bold', marginLeft: 8, fontSize: 14}}>Type Conflict</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </>
            )}
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
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
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
  attendanceWarning: {
    fontSize: 18,
    color: "#EF4444",
    textAlign: "center",
    fontWeight: "600",
    marginHorizontal: 20,
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
  },
  circle1: {
    top: 80,
    left: 40,
    width: 80,
    height: 80,
    backgroundColor: "rgba(63, 131, 248, 0.2)",
  },
  circle2: {
    top: 160,
    right: 80,
    width: 64,
    height: 64,
    backgroundColor: "rgba(79, 70, 229, 0.3)",
    opacity: 0.25,
  },
  circle3: {
    bottom: 160,
    left: 80,
    width: 48,
    height: 48,
    backgroundColor: "rgba(107, 114, 128, 0.2)",
  },
  circle4: {
    top: 240,
    left: width / 3,
    width: 32,
    height: 32,
    backgroundColor: "rgba(79, 70, 229, 0.4)",
    opacity: 0.3,
  },
  circle5: {
    bottom: 80,
    right: width / 3,
    width: 56,
    height: 56,
    backgroundColor: "rgba(63, 131, 248, 0.3)",
  },
});

export default MarksheetsScreen;
