import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

// Key for localStorage
const LOCAL_STORAGE_KEY = 'MMClientVars';

// Create the context
const GlobalContext = createContext();

// Provider component
export const GlobalProvider = ({ children }) => {
  const [clientVars, setClientVars] = useState(() => {
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });


  const value = useMemo(() => ({
    clientVars,
  }), [clientVars]);

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook for consuming the context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}; 