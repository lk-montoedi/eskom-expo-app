import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationState } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const routeTitleMap = {
  projects: "Projects",
  conflicts: "",
  marksheets: "Marksheets",
  events: "Events",
};

const SideMenu = () => {
  // Get the current route name from navigation state
  const state = useNavigationState((state) => state);
  let currentRoute = "Home";
  if (state && state.routes && state.index != null) {
    const route = state.routes[state.index];
    if (route && route.name && routeTitleMap[route.name]) {
      currentRoute = routeTitleMap[route.name];
    }
  }
  // Example settings info (replace with actual user info as needed)
  const userInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Judge",
  };

  const handleLogout = async () => {
    // Clear user token and navigate to login (replace with your logic)
    try {
      await AsyncStorage.removeItem("userToken");
      // Optionally clear other user info
      // Navigate to login screen (replace with your navigation logic)
      // For expo-router, you might use router.replace("/login")
      // For react-navigation, use navigation.navigate("Login")
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentRoute}</Text>
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Settings</Text>
        <Text style={styles.settingsItem}>Name: {userInfo.name}</Text>
        <Text style={styles.settingsItem}>Email: {userInfo.email}</Text>
        <Text style={styles.settingsItem}>Role: {userInfo.role}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingsSection: {
    marginBottom: 24,
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  settingsItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SideMenu;
