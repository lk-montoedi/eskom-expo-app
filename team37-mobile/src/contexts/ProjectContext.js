import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { API_URL } from '../constants/api';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [uncompletedProjects, setUncompletedProjects] = useState(0);

  const fetchProjects = useCallback(async () => {
  try {
    const tokenStr = await AsyncStorage.getItem("userToken");
    if (!tokenStr) return;
    const { userid } = JSON.parse(tokenStr);
    const response = await fetch(`${API_URL}/projects/allocated/${userid}`);
    if (!response.ok) {
      if (response.status === 404) {
        console.log("No projects found for this judge.");
        setProjects([]);
        setUncompletedProjects(0);
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setProjects(data.projects);
    const uncompleted = data.projects.filter(p => p.score === 0).length;
    setUncompletedProjects(uncompleted);
  } catch (err) {
    console.error("Failed to fetch projects:", err);
  }
}, []);

  return (
    <ProjectContext.Provider value={{ projects, uncompletedProjects, fetchProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);
