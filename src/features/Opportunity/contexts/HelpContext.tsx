import React, { createContext, useContext } from 'react';

interface HelpItem {
  id: string;
  fieldName?: string;
  instruction: string;
}

interface HelpContextType {
  getHelpItem: (id: string) => HelpItem | null;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

const helpData: Record<string, HelpItem> = {
  'total-revenue': {
    id: 'total-revenue',
    fieldName: 'Total Revenue',
    instruction: 'Total revenue generated from closed deals during the selected time period. This represents actual closed business and recognized income.'
  },
  'deals-closed': {
    id: 'deals-closed',
    fieldName: 'Deals Closed',
    instruction: 'Number of deals successfully closed and won during the selected time period. This represents opportunities that have moved to a "Won" status.'
  },
  'pipeline-value': {
    id: 'pipeline-value',
    fieldName: 'Pipeline Value',
    instruction: 'Total monetary value of all open opportunities currently in the sales pipeline. This represents potential future revenue from active deals.'
  },
  'win-rate': {
    id: 'win-rate',
    fieldName: 'Win Rate',
    instruction: 'Percentage of opportunities that result in closed-won deals. Higher win rates indicate more effective sales processes and better qualification.'
  },
  'sales-cycle': {
    id: 'sales-cycle',
    fieldName: 'Average Sales Cycle',
    instruction: 'Average number of days it takes to close a deal from initial opportunity creation. Shorter cycles indicate more efficient sales processes.'
  },
  'active-reps': {
    id: 'active-reps',
    fieldName: 'Active Sales Reps',
    instruction: 'Number of sales representatives actively working on opportunities during the selected period. This represents your current sales force capacity.'
  },
  'sales-performance-total-revenue': {
    id: 'sales-performance-total-revenue',
    fieldName: 'Total Revenue',
    instruction: 'Total revenue generated from all won deals in the selected period. This represents actual closed business and recognized income from completed sales.'
  },
  'sales-performance-conversion-rate': {
    id: 'sales-performance-conversion-rate',
    fieldName: 'Conversion Rate',
    instruction: 'Percentage of closed opportunities that resulted in wins. Higher conversion rates indicate more effective sales processes and better lead qualification.'
  },
  'sales-performance-avg-deal-size': {
    id: 'sales-performance-avg-deal-size',
    fieldName: 'Average Deal Size',
    instruction: 'Average revenue value per won opportunity. Larger deal sizes indicate stronger value propositions and potentially better customer targeting strategies.'
  },
  'sales-performance-avg-sales-cycle': {
    id: 'sales-performance-avg-sales-cycle',
    fieldName: 'Average Sales Cycle',
    instruction: 'Average time from opportunity creation to deal closure. Shorter cycles indicate more efficient sales processes and faster revenue realization.'
  }
};

export const HelpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getHelpItem = (id: string): HelpItem | null => {
    return helpData[id] || null;
  };

  return (
    <HelpContext.Provider value={{ getHelpItem }}>
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = (): HelpContextType => {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};