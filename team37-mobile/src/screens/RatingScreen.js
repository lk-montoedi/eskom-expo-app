import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { API_URL } from "../constants/api";
import { useAuth } from "../hooks/useAuth";

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

const top5Reasons = [
  "Disagreement on Scoring",
  "Personal Bias",
  "Lacked Communication",
  "Time Management",
  "Dominating or Passive Behavior",
  "Other",
];

const CommentBubble = ({ reason, isSelected, onPress }) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const [bubbleWidth, setBubbleWidth] = useState(0);

  const handlePress = () => {
    onPress();
    animValue.setValue(0);
    Animated.timing(animValue, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = {
    transform: [
      {
        translateX: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-bubbleWidth, bubbleWidth],
        }),
      },
    ],
    opacity: animValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1, 0],
    }),
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLayout={(event) => setBubbleWidth(event.nativeEvent.layout.width)}
      style={[styles.commentBubble, isSelected && styles.selectedCommentBubble]}
    >
      {isSelected && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View style={[styles.wipe, animatedStyle]}>
            <LinearGradient
              colors={["#4F46E5", "#2563EB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.wipeGradient}
            />
          </Animated.View>
        </View>
      )}
      <Text style={[styles.commentText, isSelected && styles.selectedCommentText]}>
        {reason}
      </Text>
    </TouchableOpacity>
  );
};

const RatingScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const judge = JSON.parse(params.judge);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clear comment if rating is 5 stars or no rating is selected
    if (rating === 5 || rating === 0) {
      setComment("");
      setSelectedReason("");
    }
  }, [rating]);

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    if (reason !== "Other") {
      setComment(reason);
    } else {
      setComment(""); // Clear comment to allow user input
    }
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert("Please select a rating");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          forJudgeId: judge.userid,
          fromJudgeId: user.userid,
          rating: rating,
          comments: comment,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Rating submitted successfully.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to submit rating.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      Alert.alert("Error", "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={["#F8F9FA", "#E9ECEF"]} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.judgeInfoContainer}>
          {judge.profilephoto ? (
            <Image
              source={{ uri: judge.profilephoto }}
              style={styles.profilePic}
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={80}
              color="#6C757D"
              style={styles.profilePicPlaceholder}
            />
          )}
          <Text style={styles.judgeName}>
            {judge.name} {judge.surname}
          </Text>
        </View>

        <StarRating rating={rating} onRatingChange={setRating} />

        {rating > 0 && rating < 5 && (
          <View style={styles.commentsSection}>
            <Text style={styles.commentsHeader}>Comment</Text>
            <View style={styles.commentsContainer}>
              {top5Reasons.map((reason, index) => (
                <CommentBubble
                  key={index}
                  reason={reason}
                  isSelected={selectedReason === reason}
                  onPress={() => handleReasonSelect(reason)}
                />
              ))}
            </View>
            {selectedReason === "Other" && (
              <TextInput
                style={styles.otherCommentInput}
                placeholder="Please specify your reasons..."
                value={comment}
                onChangeText={setComment}
                maxLength={250}
                multiline
              />
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={handleSubmitRating}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={isSubmitting ? ["#A4A4A4", "#8A8A8A"] : ["#2563EB", "#4F46E5"]}
            style={styles.button}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Submit Rating</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  judgeInfoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  profilePicPlaceholder: {
    marginBottom: 15,
  },
  judgeName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#343A40",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  star: {
    fontSize: 40,
    color: "#D1D5DB",
    marginHorizontal: 5,
  },
  starSelected: {
    color: "#FFD700",
  },
  commentsSection: {
    marginBottom: 40,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#495057",
    textAlign: "center",
    marginBottom: 20,
  },
  commentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  commentBubble: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: "#DEE2E6",
    overflow: "hidden",
  },
  selectedCommentBubble: {
    borderColor: "#4F46E5",
    borderWidth: 2,
  },
  wipe: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
  },
  wipeGradient: {
    ...StyleSheet.absoluteFillObject,
    transform: [{ rotate: "-15deg" }, { scaleX: 2 }],
  },
  commentText: {
    color: "#495057",
    fontWeight: "500",
    backgroundColor: "transparent",
  },
  selectedCommentText: {
    color: "#495057", // Text color does not change
    fontWeight: "bold",
  },
  otherCommentInput: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#DEE2E6",
    minHeight: 80,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#495057",
  },
  buttonWrapper: {
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

export default RatingScreen;