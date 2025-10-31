import React, { createContext, useCallback, useContext, useState } from "react";
import { WS_URL } from "../constants/api";
import { useConflicts } from "./ConflictContext";

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const { setConflicts, setConflictCount } = useConflicts();

  const connect = useCallback((userId) => {
    if (ws) {
      return;
    }
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("WebSocket connected to:", WS_URL);
      socket.send(JSON.stringify({ type: "register", userid: userId }));
    };

    socket.onmessage = (event) => {
  try {
    if (!event || !event.data) return; // prevent undefined error

    const data = JSON.parse(event.data);

    if (data.type === 'conflict_update' && Array.isArray(data.conflicts)) {
      const pendingConflicts = data.conflicts.filter(c => c.status === 'pending');
      setConflicts(pendingConflicts);
      setConflictCount(pendingConflicts.length);
    }
  } catch (err) {
    console.error("Error parsing WebSocket message:", err, event.data);
  }
};


    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setWs(null);
    };

    setWs(socket);
  }, [ws, setConflicts, setConflictCount]);

  const disconnect = useCallback(() => {
    if (ws) {
      ws.close();
    }
  }, [ws]);

  const value = {
    ws,
    connect,
    disconnect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
