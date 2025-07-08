import { useCallback } from 'react';
import type { Tab } from '../types/tab.types';

export const useTabManagement = (
  tabs: Tab[],
  activeTabId: string | null,
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>,
  setActiveTabId: React.Dispatch<React.SetStateAction<string>>
) => {
  const addTab = useCallback((tabData: Omit<Tab, 'id' | 'isActive'>): string => {
    const id = `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Check if tab already exists (for dynamic tabs)
    const existingTab = tabs.find(tab => 
      tab.title === tabData.title && 
      (tab.component === tabData.component || tab.iframeUrl === tabData.iframeUrl)
    );
    
    if (existingTab) {
      setActiveTab(existingTab.id);
      return existingTab.id;
    }

    const newTab: Tab = {
      ...tabData,
      id,
      isActive: false,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTab(id);
    
    return id;
  }, [tabs]);

  const removeTab = useCallback((tabId: string) => {
    const tabToRemove = tabs.find(tab => tab.id === tabId);
    if (!tabToRemove || !tabToRemove.isCloseable) return;

    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      
      // If removed tab was active, activate the last available tab
      if (tabId === activeTabId && newTabs.length > 0) {
        const newActiveTab = newTabs[newTabs.length - 1];
        setActiveTabId(newActiveTab.id);
        newActiveTab.isActive = true;
      }
      
      return newTabs;
    });
  }, [tabs, activeTabId, setTabs, setActiveTabId]);

  const setActiveTab = useCallback((tabId: string) => {
    setTabs(prev => prev.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));
    setActiveTabId(tabId);
  }, [setTabs, setActiveTabId]);

  const updateTab = useCallback((tabId: string, updates: Partial<Tab>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  }, [setTabs]);

  const getTabById = useCallback((tabId: string): Tab | undefined => {
    return tabs.find(tab => tab.id === tabId);
  }, [tabs]);

  const clearDynamicTabs = useCallback(() => {
    setTabs(prev => {
      const fixedTabs = prev.filter(tab => tab.type === 'fixed');
      const firstFixedTab = fixedTabs[0];
      
      if (firstFixedTab) {
        setActiveTabId(firstFixedTab.id);
        return fixedTabs.map(tab => ({
          ...tab,
          isActive: tab.id === firstFixedTab.id
        }));
      }
      
      return fixedTabs;
    });
  }, [setTabs, setActiveTabId]);

  const reorderTabs = useCallback((fromIndex: number, toIndex: number) => {
    setTabs(prev => {
      const newTabs = [...prev];
      const [movedTab] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, movedTab);
      return newTabs;
    });
  }, [setTabs]);

  const getTabOrder = useCallback((): string[] => {
    return tabs.map(tab => tab.id);
  }, [tabs]);

  return {
    addTab,
    removeTab,
    setActiveTab,
    updateTab,
    getTabById,
    clearDynamicTabs,
    reorderTabs,
    getTabOrder,
  };
};