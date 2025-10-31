import Constants from "expo-constants";
export const API_URL =
  Constants.expoConfig?.extra?.API_URL || "http://host.docker.internal:3001";
export const WS_URL =
  Constants.expoConfig?.extra?.WS_URL || "ws://host.docker.internal:3001";
