import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import bgImage from "../../assets/images/webbg.png"; // Import the background image
import { API_URL } from "../constants/api";

const { width } = Dimensions.get("screen");

const EventsScreen = () => {
  const [judgeName, setJudgeName] = useState("");
  const [judgeId, setJudgeId] = useState("");
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [allEvents, setAllEvents] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);
  const router = useRouter();

  const attendEvent = async () => {
    const status = await AsyncStorage.getItem("status");
    const attended = await AsyncStorage.getItem("attended");
    if (status && status === "late" || attended === "true") {
      router.replace('/(drawer)/(tabs)/marksheets');
    }
    if (attended === "false") {
      router.push({
        pathname: '/scan',
        params: { eventid: upcomingEvent?.eventid },
      });
    }
  };

  useEffect(() => {
    const fetchAllAndCheckAttendance = async () => {
      try {
        const tokenStr = await AsyncStorage.getItem("userToken");
        if (!tokenStr) return;

        const { name, userid } = JSON.parse(tokenStr);
        setJudgeName(name);
        setJudgeId(userid);

        const { data: eventsData } = await axios.get(
          `${API_URL}/events/getAll?judgeId=${userid}`
        );
        if (!eventsData || eventsData.length === 0) {
            setUpcomingEvent(null);
            setAllEvents([]);
            return;
        };

        const upcomingEvent = eventsData[0];
        setAllEvents(eventsData);
        setUpcomingEvent(upcomingEvent);

        // Start timer
        const eventDate = new Date(upcomingEvent.start_date);
        timerRef.current = setInterval(() => {
            setTimeLeft(getTimeLeft(eventDate));
        }, 1000);

        // Check attendance
        try {
            const attendanceRes = await axios.get(`${API_URL}/attendance/${userid}/${upcomingEvent.eventid}`);
            // store judge category in async storage
            await AsyncStorage.setItem("category", attendanceRes.data.category || "");
            await AsyncStorage.setItem("eventid", String(upcomingEvent.eventid));
            if (attendanceRes.data && attendanceRes.data.status === 'present') {
                await AsyncStorage.setItem("attended", "true");
            } else {
              // call is late using judgeid and eventid to check if they are late
              const lateRes = await axios.get(`${API_URL}/attendance/is-late/${userid}/${upcomingEvent.eventid}`);
              let status = lateRes.data.isLate;
              if (status === true) {
                  await AsyncStorage.setItem("status", "late");
              }
              await AsyncStorage.setItem("attended", "false");
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Do nothing, stay on page
            } else {
                console.error("Error checking attendance:", error);
            }
        }

      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchAllAndCheckAttendance();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);


  function getTimeLeft(eventDate) {
    const now = new Date();
    const diff = Math.max(0, eventDate - now) / 1000;
    const days = Math.floor(diff / (3600 * 24));
    const hours = Math.floor((diff % (3600 * 24)) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = Math.floor(diff % 60);
    return { days, hours, minutes, seconds };
  }

  // Defensive fallback for timeLeft
  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = timeLeft || {};
  const timeRemaining = days + hours + minutes + seconds;
  const canJoin = timeRemaining <= 0;

  const renderUpcomingEvent = () => {
    if (!upcomingEvent) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No upcoming events found.</Text>
        </View>
      );
    }
  
    return (
      <View style={styles.mainEventCard}>
        <Text style={styles.mainTitle}>Welcome {judgeName}!</Text>
        <Text style={styles.subtitle}>
          You are invited to the {upcomingEvent?.name}
        </Text>
        <View style={styles.countdownRow}>
          {renderCountdownBlock(days, "Days")}
          {renderCountdownBlock(hours, "Hours")}
          {renderCountdownBlock(minutes, "Minutes")}
          {renderCountdownBlock(seconds, "Seconds")}
        </View>
        <Text style={styles.venueName}>{upcomingEvent?.venue}</Text>
        <Text style={styles.venueAddress}>{upcomingEvent?.region}</Text>
        <TouchableOpacity
          style={[styles.button, !canJoin && styles.buttonDisabled]}
          onPress={attendEvent}
          disabled={!canJoin}
        >
          <Text style={styles.buttonText}>
            {canJoin ? "Attend Event" : "Event Upcoming"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderCountdownBlock = (value, label) => (
    <View style={styles.countdownBlock}>
      <Text style={styles.countdownValue}>{value}</Text>
      <Text style={styles.countdownLabel}>{label}</Text>
    </View>
  );

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage} resizeMode="cover">
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.card}>
          <LinearGradient
            colors={["#E3F2FD", "#E8EAF6"]}
            style={styles.cardHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.screenTitle}>Events</Text>
            <Text style={styles.roleIndicator}>
              {judgeName} | Judge
            </Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            {renderUpcomingEvent()}

            <Text style={styles.sectionTitle}>All Upcoming Events</Text>
            {Array.isArray(allEvents) && allEvents.length > 0 ? (
              allEvents.map((event, index) => (
                <View
                  key={event.eventid}
                  style={[
                    styles.projectCard,
                    index % 2 === 0 ? styles.projectCardEven : styles.projectCardOdd,
                  ]}
                >
                  <Text style={styles.projectTitle}>{event.name}</Text>
                  <View style={styles.projectDetailRow}>
                    <Ionicons name="location-outline" size={16} color="#4B5563" />
                    <Text style={styles.projectDetailText}>{event.venue}</Text>
                  </View>
                  <View style={styles.projectDetailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#4B5563" />
                    <Text style={styles.projectDetailText}>
                      {new Date(event.start_date).toLocaleDateString()} @ {event.start_time}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyListContainer}>
                <Ionicons name="calendar-outline" size={48} color="#6C7A89" />
                <Text style={styles.emptyListText}>No other upcoming events.</Text>
              </View>
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  mainEventCard: {
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mainTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 4,
    color: "#1F2937",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 16,
    color: "#4B5563",
    fontSize: 14,
  },
  countdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    width: "100%",
  },
  countdownBlock: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E9F2",
  },
  countdownValue: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#4F46E5",
  },
  countdownLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "600",
    marginTop: 4,
    textTransform: "uppercase",
  },
  venueName: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    color: "#1F2937",
  },
  venueAddress: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A3B3C8",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    marginTop: 8,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  projectDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  projectDetailText: {
    fontSize: 12,
    color: "#4B5563",
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  emptyListContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyListText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
    marginTop: 16,
    textAlign: "center",
  },
});

export default EventsScreen;