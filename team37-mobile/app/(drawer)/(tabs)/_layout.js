import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useConflicts } from "../../../src/contexts/ConflictContext";
import { useMarksheets } from "../../../src/contexts/MarksheetContext";
import { useProjects } from "../../../src/contexts/ProjectContext";
import { useAuth } from "../../../src/hooks/useAuth";

const routeTitleMap = {
  home: "Home",
  projects: "Projects",
  marksheets: "Marksheets",
  conflicts: "Conflicts",
  events: "Events",
  ethics: "Ethics",
  location: "Location",
  judges: "Judges",
};

const CustomHeader = () => {
  const router = useRouter();
  const route = useRoute();
  const title = routeTitleMap[route.name] || "Expo Judging Platform";
  return (
    <SafeAreaView style={styles.headerSafeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function Layout() {
  const { user } = useAuth();
  const { conflictCount, fetchConflicts } = useConflicts();
  const { unassignedCount, fetchMarksheets } = useMarksheets();
  const { uncompletedProjects, fetchProjects } = useProjects();

  useEffect(() => {
    if (user?.userid) {
      fetchConflicts(user.userid);
      fetchMarksheets();
      fetchProjects();
    }
  }, [user, fetchConflicts, fetchMarksheets, fetchProjects]);

  const TabIconWithBadge = ({ count, focused, iconName, color }) => (
    <View>
      <Ionicons name={iconName} size={24} color={color} />
      {count > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </View>
  );

  const TabIcon = ({ iconName, color }) => (
    <Ionicons name={iconName} size={24} color={color} />
  );

  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarActiveTintColor: "dodgerblue",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarStyle: styles.tabBar,
        tabBarIconStyle: {
          transform: [{ scale: 1.3 }],
          marginTop: 13,
        },
      }}
    >
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ focused, color }) => (
            <TabIconWithBadge
              count={uncompletedProjects}
              focused={focused}
              iconName="car-outline"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="marksheets"
        options={{
          title: "Marksheets",
          tabBarIcon: ({ focused, color }) => (
            <TabIconWithBadge
              count={unassignedCount}
              focused={focused}
              iconName="book-outline"
              color={color}
            />
          ),
          href: user?.role === "judge" || user?.role === "convener" ? "/marksheets" : null,
        }}
      />
      <Tabs.Screen
        name="conflicts"
        options={{
          title: "Conflicts",
          tabBarIcon: ({ focused, color }) => (
            <TabIconWithBadge
              count={conflictCount}
              focused={focused}
              iconName="warning-outline"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ethics"
        options={{
          title: "Ethics",
          tabBarIcon: ({ color }) => (
            <TabIcon iconName="shield-checkmark-outline" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="location"
        options={{
          title: "Location",
          tabBarIcon: ({ color }) => (
            <TabIcon iconName="location-outline" color={color} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="judges"
        options={{
          title: "Judges",
          tabBarIcon: ({ color }) => (
            <TabIcon iconName="people-outline" color={color} />
          ),
          href: user?.role === "convener" || user?.role === "judge" ? "/judges" : null,
        }}
      />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerSafeArea: {
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffffff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  tabBar: {
    height: 80,
    marginBottom: 5,
    borderRadius: 20,
    marginHorizontal: 10,
    boxShadowColor: "#000",
    boxShadowOffset: {
      width: 0,
      height: 2,
    },
    boxShadowOpacity: 0.25,
    boxShadowRadius: 3.84,
    elevation: 5,
    position: "absolute",
  },
  tabIcon: {
    marginTop: 8,
  },
  badgeContainer: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
