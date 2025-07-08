import React, { createContext, useContext, useState } from 'react';
import type { Tab, TabContextType, TabProviderProps } from '../types/tab.types';
import { DEFAULT_TABS, DEFAULT_ACTIVE_TAB_ID } from '../helpers/constants';
import { useTabPersistence } from '../hooks/useTabPersistence';
import { useTabManagement } from '../hooks/useTabManagement';

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider: React.FC<TabProviderProps> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState<string>(DEFAULT_ACTIVE_TAB_ID);

  // Initialize tab persistence
  useTabPersistence(tabs, activeTabId, setTabs, setActiveTabId);

  // Initialize tab management functions
  const tabManagement = useTabManagement(tabs, activeTabId, setTabs, setActiveTabId);

  const value: TabContextType = {
    tabs,
    activeTabId,
    ...tabManagement,
  };

  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabs = (): TabContextType => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabProvider');
  }
  return context;
};