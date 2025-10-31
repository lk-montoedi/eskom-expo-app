import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
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
import { API_URL } from "../constants/api";
import { useAuth } from "../hooks/useAuth";

const { width } = Dimensions.get("screen");
const statusFilters = ["All", "Present", "Late"];

const Star = ({ selected, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={[styles.star, selected ? styles.starSelected : {}]}>★</Text>
  </TouchableOpacity>
);

const StarRating = ({ rating, onRatingChange }) => (
  <View style={styles.starContainer}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} selected={i <= rating} onPress={() => onRatingChange(i)} />
    ))}
  </View>
);

const JudgeCoJudgesView = ({ user }) => {
  console.log("Rendering JudgeCoJudgesView for user:", user);
  const [coJudges, setCoJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCoJudges = async () => {
    console.log("fetchCoJudges called");
    setLoading(true);
    const url = `${API_URL}/co-judge/all/${user.userid}`;
    console.log("Fetching co-judges from URL:", url);
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Received data from backend:", data);
      setCoJudges(data.coJudges);
    } catch (err) {
      console.error("Error fetching co-judges:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("useFocusEffect in JudgeCoJudgesView triggered");
      if (user?.userid) {
        fetchCoJudges();
      }
    }, [user])
  );

  const handleCardClick = (judge) => {
    router.push({
      pathname: "/rating",
      params: { judge: JSON.stringify(judge) },
    });
  };

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
            <Text style={styles.screenTitle}>Rate Co-Judges</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Loading co-judges...</Text>
              </View>
            ) : coJudges.length === 0 ? (
              <View style={styles.emptyListContainer}>
                <Ionicons name="people-outline" size={48} color="#6C7A89" />
                <Text style={styles.emptyListText}>No co-judges found</Text>
              </View>
            ) : (
              coJudges.map((judge, idx) => {
                const hasRating = judge.ratings && judge.ratings.length > 0;
                const ratingData = hasRating ? judge.ratings[0] : null;
                const defaultPic = defaultPictures[idx % defaultPictures.length];

                return (
                  <TouchableOpacity
                    key={judge.userid || idx}
                    style={[styles.judgeCard, idx % 2 === 0 ? styles.judgeCardEven : styles.judgeCardOdd]}
                    onPress={() => !hasRating && handleCardClick(judge)}
                    disabled={hasRating}
                  >
                    <View style={styles.judgeCardContent}>
                      {judge.profilepicture ? (
                        <Image source={{ uri: judge.profilepicture }} style={styles.profilePic} />
                      ) : (
                        <Image source={defaultPic} style={styles.profilePic} />
                      )}
                      <View style={styles.judgeInfo}>
                        <Text style={styles.judgeName}>{judge.name} {judge.surname}</Text>
                        {hasRating ? (
                          <View style={styles.ratingContainer}>
                            <StarRating rating={ratingData.rating} onRatingChange={() => {}} />
                            <Text style={styles.commentText}>{ratingData.comments || "No comment"}</Text>
                          </View>
                        ) : (
                          <Text style={styles.submitRatingText}>Submit rating</Text>
                        )}
                      </View>
                    </View>
                    {judge.commonProjects && judge.commonProjects.length > 0 && (
                      <View style={styles.projectsContainer}>
                        <Text style={styles.projectsTitle}>Common Projects:</Text>
                        {judge.commonProjects.map(p => (
                          <View key={p.projectid} style={styles.projectItemContainer}>
                            <View style={styles.bullet} />
                            <Text style={styles.projectItemText}>{p.title}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const JudgesScreen = () => {
  const { user } = useAuth();
  console.log("Rendering JudgesScreen, user:", user);
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [convenerCategory, setConvenerCategory] = useState(null);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      if (user?.role === 'convener') {
        let isActive = true;
        const fetchJudges = async () => {
          setLoading(true);
          try {
            const eventId = await AsyncStorage.getItem("eventid");
            const category = await AsyncStorage.getItem("category");
            if (isActive) {
              setConvenerCategory(category);
              if (eventId) {
                const { data } = await axios.get(
                  `${API_URL}/attendance/event/${eventId}`
                );
                setJudges(data);
              }
            }
          } catch (err) {
            console.error("Error fetching judges:", err);
          } finally {
            if (isActive) {
              setLoading(false);
            }
          }
        };
        fetchJudges();
        return () => {
          isActive = false;
        };
      }
    }, [user])
  );

  function toCapital(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleJudgePress = (judge) => {
    if (judge.status.toLowerCase() === "present") {
      return;
    } else if (judge.status.toLowerCase() === "absent") {
      router.push({
        pathname: "/absent-judge",
        params: { judge: JSON.stringify(judge) },
      });
    }
  };

  const filteredJudges = useMemo(() => {
    let filtered = judges;

    if (convenerCategory) {
      filtered = filtered.filter(
        (judge) => judge.category === convenerCategory
      );
    }

    if (filter !== "All") {
      filtered = filtered.filter((judge) =>
        judge.status.toLowerCase()
          ? judge.status.toLowerCase() ===
            (filter === "Late" ? "absent" : filter.toLowerCase())
          : false
      );
    }
    if (searchText.trim()) {
      const lowerSearch = searchText.trim().toLowerCase();
      filtered = filtered.filter(
        (judge) =>
          judge.name.toLowerCase().includes(lowerSearch) ||
          judge.email.toLowerCase().includes(lowerSearch) ||
          judge.surname.toLowerCase().includes(lowerSearch)
      );
    }
    return filtered;
  }, [judges, filter, searchText, convenerCategory]);

  const counts = useMemo(() => {
    let categoryFilteredJudges = judges;
    if (convenerCategory) {
      categoryFilteredJudges = judges.filter(
        (j) => j.category === convenerCategory
      );
    }
    return {
      All: categoryFilteredJudges.length,
      Present: categoryFilteredJudges.filter(
        (j) => j.status.toLowerCase() === "present"
      ).length,
      Late: categoryFilteredJudges.filter(
        (j) => j.status.toLowerCase() === "absent"
      ).length,
    };
  }, [judges, convenerCategory]);

  if (user?.role === 'judge') {
    console.log("User is a judge, rendering JudgeCoJudgesView");
    return <JudgeCoJudgesView user={user} />;
  }

  return (
    <ImageBackground
      source={bgImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <LinearGradient
            colors={["#E3F2FD", "#E8EAF6"]}
            style={styles.cardHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.screenTitle}>Judges Attendance</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6C7A89" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by Name or Email..."
                placeholderTextColor="#6C7A89"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
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
                    filter === f && styles.filterButtonActive,
                  ]}
                  onPress={() => setFilter(f)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filter === f && styles.filterButtonTextActive,
                    ]}
                  >
                    {f} ({counts[f]})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Loading judges...</Text>
              </View>
            ) : filteredJudges.length === 0 ? (
              <View style={styles.emptyListContainer}>
                <Ionicons
                  name="folder-open-outline"
                  size={48}
                  color="#6C7A89"
                />
                <Text style={styles.emptyListText}>No judges found</Text>
                <Text style={styles.emptyListSubText}>
                  Try adjusting your search or filter.
                </Text>
              </View>
            ) : (
              filteredJudges.map((judge, idx) => (
                <TouchableOpacity
                  key={judge.userid || idx}
                  style={[
                    styles.judgeCard,
                    idx % 2 === 0 ? styles.judgeCardEven : styles.judgeCardOdd,
                  ]}
                  onPress={() => handleJudgePress(judge)}
                >
                  <View style={styles.judgeCardInner}>
                    <View style={styles.judgeDetailRow}>
                      <Text style={styles.judgeTitle}>
                        {judge.name} {judge.surname}
                      </Text>
                    </View>
                    <View style={styles.judgeDetailRow}>
                      <Ionicons name="mail-outline" size={16} color="#4F46E5" />
                      <Text style={styles.judgeDetailText}>{judge.email}</Text>
                    </View>
                    <View style={styles.judgeDetailRow}>
                      <Ionicons
                        name="pricetag-outline"
                        size={16}
                        color="#9CA3AF"
                      />
                      <Text style={styles.judgeDetailText}>
                        Category:{" "}
                        {judge.category ? toCapital(judge.category) : "N/A"}
                      </Text>
                    </View>
                    <View style={styles.judgeDetailRow}>
                      <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                      <Text style={styles.judgeDetailText}>
                        Arrival:{" "}
                        {judge.arrivaltime
                          ? judge.status.toLowerCase() === "absent"
                            ? "N/A"
                            : new Date(judge.arrivaltime).toLocaleTimeString()
                          : "N/A"}
                      </Text>
                    </View>
                    <View style={styles.judgeDetailRow}>
                      <Ionicons
                        name="pulse-outline"
                        size={16}
                        color={
                          judge.status.toLowerCase() === "present"
                            ? "#10B981"
                            : "#EF4444"
                        }
                      />
                      <Text
                        style={[
                          styles.judgeDetailText,
                          judge.status.toLowerCase() === "present"
                            ? styles.statusPresent
                            : styles.statusAbsent,
                        ]}
                      >
                        Status:{" "}
                        {judge.status
                          ? judge.status.toLowerCase() === "absent"
                            ? "Late"
                            : judge.status.toLowerCase() === "present"
                              ? "Present"
                              : "N/A"
                          : "N/A"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
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
    paddingTop: 16,
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
  judgeCard: {
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
  judgeCardEven: {
    backgroundColor: "#F9FAFB",
  },
  judgeCardOdd: {
    backgroundColor: "#FFFFFF",
  },
  judgeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  judgeInfo: {
    flex: 1,
  },
  judgeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  ratingContainer: {
    marginTop: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  submitRatingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    marginTop: 8,
  },
  projectsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E7FF',
  },
  projectsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  projectItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    marginRight: 8,
  },
  projectItemText: {
    fontSize: 14,
    color: '#4B5563',
  },
  judgeCardInner: {
    paddingHorizontal: 0,
  },
  judgeDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  judgeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  judgeDetailText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
  },
  statusPresent: {
    color: "#10B981",
  },
  statusAbsent: {
    color: "#EF4444",
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
  starContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  star: {
    fontSize: 20,
    color: "#D1D5DB", // grey
    marginHorizontal: 1,
  },
  starSelected: {
    color: "#FFD700", // gold
  },
  commentInput: {
    width: '100%',
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    textAlignVertical: 'top',
    borderColor: '#E0E7FF',
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 16,
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

export default JudgesScreen;
