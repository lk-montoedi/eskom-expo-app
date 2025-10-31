import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { WebSocketProvider } from "../src/contexts/WebSocketContext";
import { ConflictProvider } from "../src/contexts/ConflictContext";
import { MarksheetProvider } from "../src/contexts/MarksheetContext";
import { ProjectProvider } from "../src/contexts/ProjectContext";
import { TimerProvider } from "../src/contexts/TimerContext";

export default function Layout() {
  const [fontsLoaded, error] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
    }
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <ConflictProvider>
      <WebSocketProvider>
        <MarksheetProvider>
          <ProjectProvider>
            <TimerProvider>
              <Stack>
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen name="events" options={{ headerShown: true }} />
                <Stack.Screen name="scan" options={{ headerShown: false }} />
                <Stack.Screen
                  name="assign-marksheet"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="marking" options={{ headerShown: false }} />
                <Stack.Screen
                  name="ethics-marksheet"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="absent-judge" options={{ headerShown: false }} />
                <Stack.Screen name="present-judge" options={{ headerShown: false }} />
                <Stack.Screen name="about-conflict" options={{ title: 'Conflict Details' }} />
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              </Stack>
            </TimerProvider>
          </ProjectProvider>
        </MarksheetProvider>
      </WebSocketProvider>
    </ConflictProvider>
  );
}
