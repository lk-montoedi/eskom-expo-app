import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useState } from "react";
import { API_URL } from "../constants/api";

const MarksheetContext = createContext();

export const MarksheetProvider = ({ children }) => {
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMarksheets = useCallback(async () => {
    setLoading(true);
    try {
      const tokenStr = await AsyncStorage.getItem("userToken");
      if (!tokenStr) {
        setLoading(false);
        return;
      }
      const { userid } = JSON.parse(tokenStr);
      const response = await fetch(`${API_URL}/project-judges/all-projects?judgeId=${userid}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.log("No projects found for this judge.");
          setProjects([]);
          setUnassignedCount(0);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        const projectsArray = Array.isArray(data) ? data : [];
        setProjects(projectsArray);
        const unassigned = projectsArray.filter(
          (p) => !p.assignedmarksheettype || p.assignedmarksheettype === "none"
        ).length;
        setUnassignedCount(unassigned);
      }
    } catch (err) {
      console.error("Failed to fetch marksheets:", err);
      setProjects([]);
      setUnassignedCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <MarksheetContext.Provider
      value={{ projects, unassignedCount, loading, fetchMarksheets }}
    >
      {children}
    </MarksheetContext.Provider>
  );
};

export const useMarksheets = () => useContext(MarksheetContext);
