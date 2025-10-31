import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { connect, disconnect } = useWebSocket();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken) {
          const currentUser = JSON.parse(userToken);
          setUser(currentUser);
          if (currentUser?.userid) {
            connect(currentUser.userid);
          }
        }
      } catch (e) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [connect]);

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("attended");
    setUser(null);
    disconnect();
  };

  return { user, loading, logout };
};
