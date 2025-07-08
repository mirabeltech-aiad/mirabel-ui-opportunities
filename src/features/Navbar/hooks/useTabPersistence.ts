import { useEffect } from 'react';
import type { Tab, TabState } from '../types/tab.types';
import { DEFAULT_TABS, DEFAULT_ACTIVE_TAB_ID } from '../helpers/constants';
import { TAB_STORAGE_KEY } from '../services/tabStorage';

export const useTabPersistence = (
  tabs: Tab[],
  activeTabId: string | null,
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>,
  setActiveTabId: React.Dispatch<React.SetStateAction<string>>
) => {
  // Helper function to reorder tabs based on stored order
  const reorderTabsByStoredOrder = (tabs: Tab[], storedOrder: string[]): Tab[] => {
    const orderedTabs: Tab[] = [];
    const unorderedTabs: Tab[] = [];
    
    // First, add tabs in stored order
    storedOrder.forEach(tabId => {
      const tab = tabs.find(t => t.id === tabId);
      if (tab) {
        orderedTabs.push(tab);
      }
    });
    
    // Then add any new tabs that weren't in the stored order
    tabs.forEach(tab => {
      if (!storedOrder.includes(tab.id)) {
        unorderedTabs.push(tab);
      }
    });
    
    return [...orderedTabs, ...unorderedTabs];
  };

  // Load tab state from localStorage on mount
  useEffect(() => {
    const storedTabState = localStorage.getItem(TAB_STORAGE_KEY);
    if (storedTabState) {
      try {
        const { tabs: storedTabs, activeTabId: storedActiveId, tabOrder }: TabState = JSON.parse(storedTabState);
        
        // Merge with default tabs, keeping fixed tabs and adding dynamic ones
        const fixedTabs = DEFAULT_TABS;
        const dynamicTabs = storedTabs.filter((tab: Tab) => tab.type === 'dynamic');
        
        // Restore tab order if available
        let mergedTabs = [...fixedTabs, ...dynamicTabs];
        if (tabOrder && Array.isArray(tabOrder)) {
          mergedTabs = reorderTabsByStoredOrder(mergedTabs, tabOrder);
        }
        
        setTabs(mergedTabs);
        
        // Set active tab if it exists in merged tabs
        const activeTabExists = mergedTabs.some(tab => tab.id === storedActiveId);
        if (activeTabExists) {
          setActiveTabId(storedActiveId);
          setTabs(prev => prev.map(tab => ({
            ...tab,
            isActive: tab.id === storedActiveId
          })));
        } else {
          // Fallback to first tab if stored active tab doesn't exist
          const firstTab = mergedTabs[0];
          if (firstTab) {
            setActiveTabId(firstTab.id);
            setTabs(prev => prev.map(tab => ({
              ...tab,
              isActive: tab.id === firstTab.id
            })));
          }
        }
      } catch (error) {
        console.error('Error parsing stored tab state:', error);
        // Fallback to default state
        setTabs(DEFAULT_TABS);
        setActiveTabId(DEFAULT_ACTIVE_TAB_ID);
      }
    }
  }, [setTabs, setActiveTabId]);

  // Save tab state to localStorage whenever it changes
  useEffect(() => {
    if (activeTabId) {
      const tabState: TabState = {
        tabs: tabs.filter(tab => tab.type === 'dynamic'), // Only persist dynamic tabs
        activeTabId,
        tabOrder: tabs.map(tab => tab.id), // Save current tab order
        timestamp: Date.now() // Add timestamp for debugging
      };
      localStorage.setItem(TAB_STORAGE_KEY, JSON.stringify(tabState));
    }
  }, [tabs, activeTabId]);
};
