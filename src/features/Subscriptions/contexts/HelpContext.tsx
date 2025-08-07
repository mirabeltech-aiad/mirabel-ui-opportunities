
import React, { createContext, useContext, useState } from 'react';
import { HelpItem } from './help/types';
import { getAllHelpItems } from './help/helpItemsRegistry';

interface HelpContextType {
  helpItems: HelpItem[];
  getHelpItem: (id: string) => HelpItem | undefined;
  updateHelpItem: (id: string, instruction: string) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const HelpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [helpItems, setHelpItems] = useState<HelpItem[]>(getAllHelpItems());

  const getHelpItem = (id: string): HelpItem | undefined => {
    return helpItems.find(item => item.id === id);
  };

  const updateHelpItem = (id: string, instruction: string): void => {
    setHelpItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, instruction } : item
      )
    );
  };

  return (
    <HelpContext.Provider value={{ helpItems, getHelpItem, updateHelpItem }}>
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = (): HelpContextType => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};
