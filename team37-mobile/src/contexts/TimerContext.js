
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [timeControlButtonClicks, setTimeControlButtonClicks] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        if (newTime === 300) { // 5 minutes
          Alert.alert("Reminder", "You have 5 minutes remaining.");
        } else if (newTime === 60) { // 1 minute
          Alert.alert("Reminder", "You have 1 minute remaining.");
        } else if (newTime === 0) {
          Alert.alert("Time's Up!", "Your time is up.");
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  const value = {
    timeLeft,
    setTimeLeft,
    timeControlButtonClicks,
    setTimeControlButtonClicks,
    setTimerActive,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};
