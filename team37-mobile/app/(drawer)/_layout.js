import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../../src/hooks/useAuth";
//import SideMenu from "../../src/navigation/SideMenu";

export default function Layout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth" />;
  }

  return (
    <Drawer
     // drawerContent={() => <SideMenu />}
      screenOptions={{ headerShown: false }}
    />
  );
}
