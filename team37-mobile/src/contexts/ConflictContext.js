import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

const ConflictContext = createContext();

export const useConflicts = () => {
  return useContext(ConflictContext);
};

export const ConflictProvider = ({ children }) => {
  const [conflicts, setConflicts] = useState([]);
  const [conflictCount, setConflictCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchConflicts = useCallback(async (userId, userRole, eventId) => {
    setLoading(true);
    try {
      let data;
      if (userRole === 'convener' && eventId) {
        const response = await axios.get(`${API_URL}/conflicts/category/${eventId}/${userId}`);
        data = response.data.map(c => ({
          ...c,
          conflictstatus: c.status,
          judge1mark: c.judge1.initialmark,
          judge2mark: c.judge2.initialmark,
        }));
        setConflicts(data);
        const pendingConflicts = data.filter(c => c.status === 'pending');
        setConflictCount(pendingConflicts.length);
      } else {
        const response = await axios.get(`${API_URL}/conflicts/all/${userId}`);
        data = response.data.conflicts;
        const pendingConflicts = data.filter(
          (c) => c.conflictstatus === "pending"
        );
        setConflicts(data);
        setConflictCount(pendingConflicts.length);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setConflicts([]);
        setConflictCount(0);
      } else {
        console.error("Error fetching conflicts:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    conflicts,
    conflictCount,
    loading,
    fetchConflicts,
    setConflicts,
    setConflictCount,
  };

  return (
    <ConflictContext.Provider value={value}>
      {children}
    </ConflictContext.Provider>
  );
};
