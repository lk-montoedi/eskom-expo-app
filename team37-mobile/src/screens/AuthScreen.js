import axios from "axios";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import bgImage from "../../assets/images/webbg.png";
import { API_URL } from "../constants/api";
import { useWebSocket } from "../contexts/WebSocketContext";

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { connect } = useWebSocket();

  const handleLogin = async () => {
    setLoading(true);
    let hasError = false;
    setLoginError("");
    if (!email) {
      setEmailError("Required");
      hasError = true;
    } else {
      setEmailError("");
    }
    if (!password) {
      setPasswordError("Required");
      hasError = true;
    } else {
      setPasswordError("");
    }
    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/user/login`, {
        email,
        password,
      });
      setLoginError("");
      // save user
      const user = response.data.user;
      await AsyncStorage.setItem("userToken", JSON.stringify(user));
      connect();
      router.replace("/events");
    } catch (error) {
      console.log("Error encountered:", error);
      setLoginError("Incorrect email or password");
    } finally {
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage} resizeMode="cover">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={60}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <LinearGradient
              colors={["#E3F2FD", "#E8EAF6"]}
              style={styles.cardHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.screenTitle}>Welcome Back</Text>
            </LinearGradient>

            <View style={styles.cardBody}>
              <Image
                source={require("../../assets/images/expo.jpg")}
                style={styles.logo}
                resizeMode="contain"
              />

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color="#6C7A89" />
                  <TextInput
                    style={[styles.input, emailError ? styles.inputError : null]}
                    placeholder="Email"
                    placeholderTextColor="#6C7A89"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (text) setEmailError("");
                    }}
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={18} color="#6C7A89" />
                  <TextInput
                    style={[styles.input, passwordError ? styles.inputError : null]}
                    placeholder="Password"
                    placeholderTextColor="#6C7A89"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (text) setPasswordError("");
                    }}
                  />
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
              </TouchableOpacity>

              {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: "center",
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
    textAlign: "center",
  },
  cardBody: {
    padding: 20,
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 120,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A3B3C8",
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    marginLeft: 8,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AuthScreen;