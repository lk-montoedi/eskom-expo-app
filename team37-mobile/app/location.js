import { Stack } from "expo-router";
import { View } from "react-native";
import LocationScreen from "../src/screens/LocationScreen";

export default function Location() {
  return (
    <>
      <Stack.Screen options={{ title: "Co-Judge Location" }} />
      <View style={{ flex: 1 }}>
        <LocationScreen />
      </View>
    </>
  );
}
