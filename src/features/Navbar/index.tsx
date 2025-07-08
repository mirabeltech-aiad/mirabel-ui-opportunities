import React from 'react';
import { TabProvider } from './context/TabContext';
import { NavigationConfigProvider } from './context/NavigationConfigContext';
import Navbar from './components/Navbar/Navbar';

// Main Navigation Feature Entry Point
export const NavigationFeature: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <NavigationConfigProvider>
      <TabProvider>
        <Navbar />
        {children}
      </TabProvider>
    </NavigationConfigProvider>
  );
};

// Re-export core components and hooks for external use
export { default as Navbar } from './components/Navbar/Navbar';
export { default as TabContent } from './components/TabSystem/TabContent';
export { default as TabNavigation } from './components/TabSystem/TabNavigation';

// Re-export contexts and hooks
export { TabProvider, useTabs } from './context/TabContext';
export { NavigationConfigProvider, useNavigationConfig } from './context/NavigationConfigContext';
export { useTabManagement } from './hooks/useTabManagement';
export { useTabPersistence } from './hooks/useTabPersistence';

// Re-export types
export type * from './types/tab.types';
export type * from './types/navigation.types';

export default NavigationFeature;