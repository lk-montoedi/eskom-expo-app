import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ImageBackground,
  Modal,
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
import { useConflicts } from "../contexts/ConflictContext";

const { width } = Dimensions.get("screen");
const statusFilters = ["Pending", "Resolved"];

const ConflictsScreen = () => {
  const { conflicts, fetchConflicts } = useConflicts();
  const [loading, setLoading] = useState(true);
  const [attended, setAttended] = useState(false);
  const [filter, setFilter] = useState("Pending");
  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [judgeId, setJudgeId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [agreedMark, setAgreedMark] = useState("");
  const [meetRequested, setMeetRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const pulseAnim1 = useState(new Animated.Value(1))[0];
  const pulseAnim2 = useState(new Animated.Value(1))[0];
  const pulseAnim3 = useState(new Animated.Value(1))[0];
  const bounceAnim1 = useState(new Animated.Value(0))[0];
  const bounceAnim2 = useState(new Animated.Value(0))[0];

  const [meetupModalVisible, setMeetupModalVisible] = useState(false);
  const [meetups, setMeetups] = useState([]);

  // Count conflicts by status
  const counts = {
    "Pending": Array.isArray(conflicts) ? conflicts.filter(c => c.conflictstatus?.toLowerCase() === "pending").length : 0,
    "Resolved": Array.isArray(conflicts) ? conflicts.filter(c => c.conflictstatus?.toLowerCase() === "resolved").length : 0,
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        setMeetupModalVisible(false);

        const attendedFlag = await AsyncStorage.getItem("attended");
        setAttended(attendedFlag === "true");
        const tokenStr = await AsyncStorage.getItem("userToken");
        const eventId = await AsyncStorage.getItem("eventid");
        
        if (!tokenStr) {
          setLoading(false);
          return;
        }

        const { userid, role } = JSON.parse(tokenStr);
        setUserRole(role);

        setJudgeId(userid);
        await fetchConflicts(userid, role, eventId);

        if (role !== 'convener') {
          try {
            const res = await axios.get(
              `${API_URL}/conflicts/get-meetups/${userid}`
            );
            if (res.data.meetups && res.data.meetups.length > 0) {
              setMeetups(res.data.meetups);
              setMeetupModalVisible(true);
            } else {
              setMeetups([]);
            }
          } catch (err) {
            setMeetups([]);
          }
        }

        setLoading(false);
      };

      loadData();

      return () => {};
    }, [fetchConflicts])
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

  const safeConflicts = Array.isArray(conflicts) ? conflicts : [];
  let filteredConflicts =
    filter === "All"
      ? safeConflicts
      : safeConflicts.filter((conflict) => {
          if (!conflict.conflictstatus) return false;
          if (filter === "Pending")
            return conflict.conflictstatus.toLowerCase() === "pending";
          if (filter === "Resolved")
            return conflict.conflictstatus.toLowerCase() === "resolved";
          return true;
        });

  if (searchActive && searchText.trim()) {
    const lowerSearch = searchText.trim().toLowerCase();
    filteredConflicts = filteredConflicts.filter((conflict) => {
      return (
        (conflict.projectname &&
          conflict.projectname.toLowerCase().includes(lowerSearch)) ||
        (conflict.standnumber &&
          conflict.standnumber
            .toString()
            .toLowerCase()
            .includes(lowerSearch)) ||
        (conflict.description &&
          conflict.description.toLowerCase().includes(lowerSearch))
      );
    });
  }

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage} resizeMode="cover">
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
            <Text style={styles.screenTitle}>Conflicts</Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6C7A89" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search conflicts..."
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
                  You must join the event before accessing conflicts.
                </Text>
              </View>
            ) : loading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Loading conflicts...</Text>
              </View>
            ) : (
              <>
                {/* Filter Buttons */}
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

                {/* Location Button */}
                <View style={styles.locationButtonContainer}>
                  <TouchableOpacity
                    style={styles.locationButton}
                    onPress={() => router.push('/location')}
                  >
                    <Ionicons name="location-outline" size={20} color="#4F46E5" />
                    <Text style={styles.locationButtonText}>View Location</Text>
                  </TouchableOpacity>
                </View>

                {filteredConflicts.length === 0 ? (
                  <View style={styles.emptyListContainer}>
                    <Ionicons name="checkmark-done-circle-outline" size={48} color="#6C7A89" />
                    <Text style={styles.emptyListText}>No conflicts found</Text>
                    <Text style={styles.emptyListSubText}>Try adjusting your search criteria</Text>
                  </View>
                ) : (
                  filteredConflicts.map((conflict, idx) => (
                    userRole === 'convener' ? (
                        <TouchableOpacity
                          key={conflict.conflictid || idx}
                          style={[
                            styles.projectCard,
                            idx % 2 === 0 ? styles.projectCardEven : styles.projectCardOdd,
                            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
                          ]}
                          onPress={() => router.push({ pathname: '/about-conflict', params: { conflict: JSON.stringify(conflict) } })}
                        >
                          <View style={styles.projectCardInner}>
                            <Text style={styles.projectTitle}>{conflict.projectname || "Unnamed Project"}</Text>
                          
                            {/* Add null checks for judge1 and judge2 */}
                            {conflict.judge1 && (
                              <View style={styles.judgeDetailRow}>
                                <Ionicons name="person-outline" size={16} color="#4F46E5" />
                                <Text style={styles.judgeDetailText}>{conflict.judge1.name || "Judge 1"}</Text>
                                <Text style={styles.judgeMarkValue}>{conflict.judge1.initialmark ?? "-"}</Text>
                              </View>
                            )}
                            
                            {conflict.judge2 && (
                              <View style={styles.judgeDetailRow}>
                                <Ionicons name="person-outline" size={16} color="#4F46E5" />
                                <Text style={styles.judgeDetailText}>{conflict.judge2.name || "Judge 2"}</Text>
                                <Text style={styles.judgeMarkValue}>{conflict.judge2.initialmark ?? "-"}</Text>
                              </View>
                            )}
                            
                            <View style={styles.projectDetailRow}>
                              <Ionicons
                                name="pulse-outline"
                                size={16}
                                color={conflict.conflictstatus?.toLowerCase() === "resolved" ? "#10B981" : "#F59E0B"}
                              />
                              <Text style={[
                                styles.projectDetailText,
                                conflict.conflictstatus?.toLowerCase() === "resolved" ? styles.statusResolved : styles.statusPending
                              ]}>
                                Status: {conflict.conflictstatus}
                              </Text>
                            </View>
                          </View>
                          <Ionicons name="chevron-forward-outline" size={24} color="#9CA3AF" style={styles.chevronStyle} />
                        </TouchableOpacity>
                      ) : (
                      <TouchableOpacity
                        key={conflict.conflictid || idx}
                        style={[
                          styles.projectCard,
                          idx % 2 === 0 ? styles.projectCardEven : styles.projectCardOdd
                        ]}
                        onPress={() => {
                          setSelectedConflict(conflict);
                          setModalVisible(true);
                          setAgreedMark("");
                          setMeetRequested(false);
                        }}
                      >
                        <View style={styles.projectCardInner}>
                          <View style={styles.projectDetailRow}>
                            <Text style={styles.projectTitle}>
                              {conflict.projectname || "Unnamed Project"}
                            </Text>
                          </View>
                          <View style={styles.projectDetailRow}>
                            <Ionicons name="barcode-outline" size={16} color="#4F46E5" />
                            <Text style={styles.projectDetailText}>
                              Stand: {conflict.standnumber || "N/A"}
                            </Text>
                          </View>
                          <View style={styles.projectDetailRow}>
                            <Ionicons name="pricetag-outline" size={16} color="#9CA3AF" />
                            <Text style={styles.projectDetailText}>
                              Category: {conflict.category || "None"}
                            </Text>
                          </View>
                          <View style={styles.projectDetailRow}>
                            <Ionicons 
                              name="pulse-outline" 
                              size={16} 
                              color={
                                conflict.conflictstatus?.toLowerCase() === "resolved" 
                                  ? "#10B981" 
                                  : "#F59E0B"
                              } 
                            />
                            <Text style={[
                              styles.projectDetailText,
                              conflict.conflictstatus?.toLowerCase() === "resolved" 
                                ? styles.statusResolved 
                                : styles.statusPending
                            ]}>
                              Status: {conflict.conflictstatus}
                            </Text>
                          </View>
                          
                          {/* Judge Marks Container */}
                          <View style={styles.judgeMarksContainer}>
                            <View style={styles.judgeMarksBox}>
                              <Text style={styles.judgeMarkLabel}>Your Mark</Text>
                              <Text style={styles.judgeMarkValue}>
                                {String(judgeId) === String(conflict.judgeid1) 
                                  ? conflict.judge1mark ?? "-" 
                                  : conflict.judge2mark ?? "-"}
                              </Text>
                            </View>
                            <View style={styles.judgeMarksBox}>
                              <Text style={styles.judgeMarkLabel}>Co-Judge Mark</Text>
                              <Text style={styles.judgeMarkValue}>
                                {String(judgeId) === String(conflict.judgeid1) 
                                  ? conflict.judge2mark ?? "-" 
                                  : conflict.judge1mark ?? "-"}
                              </Text>
                            </View>
                            <View style={styles.judgeMarksBox}>
                              <Text style={styles.judgeMarkLabel}>Agreed Mark</Text>
                              <Text style={styles.agreedMarkValue}>
                                {conflict.agreedmark ?? "-"}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
                  ))
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Resolve Conflict Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resolve Conflict</Text>
            <Text style={styles.modalLabel}>Agreed Mark</Text>
            <TextInput
              style={styles.modalInput}
              value={agreedMark}
              onChangeText={setAgreedMark}
              keyboardType="numeric"
              placeholder="Enter agreed mark"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.meetButton}
              onPress={async () => {
                if (!selectedConflict) return;
                try {
                  await axios.put(`${API_URL}/conflicts/request-meet/${selectedConflict.conflictid}`);
                  setMeetRequested(true);
                } catch (err) {
                  console.error("Error requesting meet up:", err);
                }
              }}
            >
              <Text style={styles.meetButtonText}>
                {meetRequested ? "Meet Up Requested" : "Request Meet Up"}
              </Text>
            </TouchableOpacity>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.submitButton, (submitting || !agreedMark) && { backgroundColor: '#B0B0B0' }]}
                onPress={async () => {
                  if (!selectedConflict) return;
                  setSubmitting(true);
                  try {
                    await axios.put(`${API_URL}/conflicts/resolve/${selectedConflict.conflictid}`, { agreedMark });
                    setModalVisible(false);
                    await fetchConflicts(judgeId);
                  } catch (err) {
                    console.error("Error resolving conflict:", err);
                  } finally {
                    setSubmitting(false);
                  }
                }}
                disabled={submitting || !agreedMark}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? "Submitting..." : "Submit"}
                </Text>
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

      {/* Meetup Modal */}
      <Modal
        visible={meetupModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMeetupModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Meetup Requests</Text>
            {meetups.map((meetup, index) => {
              const coJudge = String(judgeId) === String(meetup.judgeid1) 
                ? `${meetup.judge2_name}` 
                : `${meetup.judge1_name}`;
              const location = meetup.meetup_location || "Judging Room";
              return (
                <View key={index} style={styles.meetupEntry}>
                  <Text style={styles.meetupText}>
                    {`${coJudge} • ${location} • ${meetup.projectname}`}
                  </Text>
                </View>
              );
            })}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setMeetupModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
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
  locationButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4F46E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
    marginLeft: 8,
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
    flex: 1,
  },
  projectDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  judgeDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: 'space-between',
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
  judgeDetailText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
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
  judgeMarksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E7FF",
  },
  judgeMarksBox: {
    alignItems: "center",
  },
  judgeMarkLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  judgeMarkValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  agreedMarkValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4F46E5",
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
  chevronStyle: {
    alignSelf: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: width * 0.9,
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
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#4B5563",
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
  modalCloseButton: {
    backgroundColor: "#6B7280",
    borderRadius: 8,
    paddingVertical: 12,
    width: '50%',
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  meetButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  meetButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  meetupEntry: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
    paddingVertical: 12,
  },
  meetupText: {
    fontSize: 16,
    color: "#4B5563",
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

export default ConflictsScreen;