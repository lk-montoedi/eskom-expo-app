import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  GeoPoint,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { auth, db } from "../../firebase"; // Adjust the path to your firebase.js file
import { API_URL } from "../constants/api";

const getColorForUid = (uid) => {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
}

const FlashingSymbol = () => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [anim]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <Animated.View style={[styles.flashingSymbol, { opacity, transform: [{ scale }] }]} />
  );
};

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [user, setUser] = useState(null);
  const [asyncStorageUser, setAsyncStorageUser] = useState(null);
  const [allUsersLocations, setAllUsersLocations] = useState([]);
  const [coJudge, setCoJudge] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const mapViewRef = useRef(null);
  const params = useLocalSearchParams();
  const { projectId } = params;

  useEffect(() => {
    const getAsyncStorageUser = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        setAsyncStorageUser(JSON.parse(userToken));
      }
    };
    getAsyncStorageUser();
  }, []);

  useEffect(() => {
    const fetchCoJudge = async () => {
      if (projectId && asyncStorageUser) {
        try {
          const response = await axios.get(
            `${API_URL}/co-judge/${asyncStorageUser.userid}/${projectId}`
          );
          if (response.data && response.data.length > 0) {
            setCoJudge(response.data[0]);
          }
        } catch (error) {
          console.error("Error fetching co-judge:", error);
        }
      }
    };
    fetchCoJudge();
  }, [projectId, asyncStorageUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        signInAnonymously(auth).catch((error) => {
          setErrorMsg(`Anonymous sign-in failed: ${error.message}`);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, "locations"), (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.location) {
          // Check if data and location exist
          users.push({
            uid: doc.id,
            userId: data.userId,
            location: data.location,
            heading: data.heading,
            color: getColorForUid(doc.id),
          });
        }
      });
      setAllUsersLocations(users);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return; // Don't do anything if there is no user

    let subscription;

    const startWatching = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      Location.watchHeadingAsync((newHeading) => {
        if (newHeading.trueHeading !== -1) {
          setHeading(newHeading.trueHeading);
        }
      });

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 30000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
          const userLocationRef = doc(db, "locations", user.uid);
          setDoc(
            userLocationRef,
            {
              userId: asyncStorageUser?.userid,
              location: new GeoPoint(
                newLocation.coords.latitude,
                newLocation.coords.longitude
              ),
              heading: heading,
              timestamp: new Date(),
            },
            { merge: true }
          );
        }
      );
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [user, heading, asyncStorageUser]);

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg || "Waiting for location and user sign-in..."}</Text>
      </View>
    );
  }

  const filteredLocations = allUsersLocations.filter((userLocation) => {
    return (
      userLocation.userId === asyncStorageUser?.userid ||
      userLocation.userId === coJudge?.userid
    );
  });

  const coJudgeLocation = allUsersLocations.find(
    (l) => l.userId === coJudge?.userid
  );

  let distance = 0;
  let midpoint = null;
  if (location && coJudgeLocation) {
    distance = getDistance(
      location.coords.latitude,
      location.coords.longitude,
      coJudgeLocation.location.latitude,
      coJudgeLocation.location.longitude
    );
    midpoint = {
      latitude:
        (location.coords.latitude + coJudgeLocation.location.latitude) / 2,
      longitude:
        (location.coords.longitude + coJudgeLocation.location.longitude) / 2,
    };
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {filteredLocations.map((userLocation) => {
          if (!userLocation || !userLocation.location) return null;
          if (userLocation.uid === user?.uid) {
            // Render the current user with the arrow
            return (
              <Marker
                key={userLocation.uid}
                coordinate={{
                  latitude: userLocation.location.latitude,
                  longitude: userLocation.location.longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
                rotation={heading || 0}
              >
                <Image
                  source={require("../../assets/images/navigation-arrow.png")}
                  style={styles.arrowImage}
                />
              </Marker>
            );
          } else {
            // Render other users as colored circles
            return (
              <Marker
                key={userLocation.uid}
                coordinate={{
                  latitude: userLocation.location.latitude,
                  longitude: userLocation.location.longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={40}
                  color={'#FFA500'}
                />
              </Marker>
            );
          }
        })}
        {showDirections && location && coJudgeLocation && (
          <>
            <Polyline
              coordinates={[
                {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                },
                {
                  latitude: coJudgeLocation.location.latitude,
                  longitude: coJudgeLocation.location.longitude,
                },
              ]}
              strokeColor="#0000FF" // blue
              strokeWidth={5}
              lineDashPattern={[10, 10]} // Dotted line pattern
            />
            {midpoint && (
              <Marker coordinate={midpoint} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.distanceContainer}>
                  <Text style={styles.distanceText}>
                    {distance.toFixed(0)} m
                  </Text>
                </View>
              </Marker>
            )}
          </>
        )}
      </MapView>
      {coJudge && (
        <View style={styles.coJudgeContainer}>
          <Text style={styles.coJudgeText}>
            Tracking {coJudge.name} {coJudge.surname}
          </Text>
          <FlashingSymbol />
        </View>
      )}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <Image
            source={require("../../assets/images/navigation-arrow.png")}
            style={styles.legendArrow}
          />
          <Text style={styles.legendText}>You</Text>
        </View>
        <View style={styles.legendItem}>
        <Ionicons name="person-circle-outline" size={45} color="#FFA500" />
        {coJudge ? (
          <Text style={styles.legendText}>{coJudge.name}</Text>
        ) : (
          <Text style={styles.legendText}>Co-judge</Text>
        )}
      </View>
      </View>
      <TouchableOpacity
        style={styles.centerLocationButton}
        onPress={() => {
          if (location) {
            mapViewRef.current.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0,
              longitudeDelta: 0.0,
            });
          }
        }}
      >
        <Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.directionsButton}
        onPress={() => setShowDirections(!showDirections)}
      >
        <MaterialIcons name="directions-walk" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  arrowImage: {
    width: 40,
    height: 40,
  },
  userDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  legendContainer: {
    position: "absolute",
    bottom: 30,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendArrow: {
    width: 50,
    height: 50,
    marginRight: 5,
  },

  legendText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  coJudgeContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  coJudgeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  centerLocationButton: {
    position: "absolute",
    bottom: 200,
    right: 20,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(200, 162, 200, 1)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  directionsButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(200, 162, 200, 1)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  distanceContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 1,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  distanceText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  flashingSymbol: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'green',
    marginLeft: 10,
  },
});