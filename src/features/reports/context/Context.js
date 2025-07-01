import { createContext, useContext } from 'react';

/**
 * Context for managing reports state
 */
export const ReportsContext = createContext();

/**
 * Custom hook for using the reports context
 */
export const useReportsContext = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReportsContext must be used within a ReportsProvider');
  }
  return context;
}; 