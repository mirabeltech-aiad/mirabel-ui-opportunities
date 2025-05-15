import { createContext, useContext } from 'react';

// Create context for feature settings
export const FeatureSettingsContext = createContext();

// Custom hook for using the feature settings context
export const useFeatureSettings = () => {
  const context = useContext(FeatureSettingsContext);
  if (!context) {
    throw new Error('useFeatureSettings must be used within a FeatureSettingsProvider');
  }
  return context;
}; 