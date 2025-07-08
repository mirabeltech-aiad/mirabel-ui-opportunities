import React from 'react';

export interface TabComponentProps {
  tabId: string;
  isActive: boolean;
  isAuthenticated: boolean;
  userInfo: any;
  getValidToken: () => Promise<string | null>;
  updateTab: (updates: Partial<Tab>) => void;
  sendMessage: (type: string, payload?: any) => void;
}

export interface Tab {
  id: string;
  title: string;
  type: 'fixed' | 'dynamic';
  component?: React.ComponentType<TabComponentProps> | string;
  iframeUrl?: string;
  isCloseable: boolean;
  isActive: boolean;
}

export interface TabContextType {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Omit<Tab, 'id' | 'isActive'>) => string;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<Tab>) => void;
  getTabById: (tabId: string) => Tab | undefined;
  clearDynamicTabs: () => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
  getTabOrder: () => string[];
}

export interface TabProviderProps {
  children: React.ReactNode;
}

export interface TabState {
  tabs: Tab[];
  activeTabId: string;
  tabOrder: string[];
  timestamp: number;
}