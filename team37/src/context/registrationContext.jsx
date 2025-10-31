import { createContext, useEffect, useState } from 'react';

export const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  const [registrationData, setRegistrationData] = useState(() => {
    // Load from localStorage initially
    const saved = localStorage.getItem('registrationData');
    return saved ? JSON.parse(saved) : {};
  });

  const updateData = (data) => {
    setRegistrationData((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('registrationData', JSON.stringify(updated)); // Save to localStorage
      return updated;
    });
  };

  // Optional: clear localStorage when component unmounts (not typical unless needed)
  // useEffect(() => () => localStorage.removeItem('registrationData'), []);

  return (
    <RegistrationContext.Provider value={{ registrationData, updateData }}>
      {children}
    </RegistrationContext.Provider>
  );
}
