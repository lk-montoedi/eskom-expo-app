import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      return;
    }

    const checkNotifications = async () => {
      try {
        const response = await axios.get(`/api/notifications/${userId}`);
        if (response.data && response.data.length > 0) {
          setHasNewNotifications(true);
        }
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };

    checkNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{ hasNewNotifications, setHasNewNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};