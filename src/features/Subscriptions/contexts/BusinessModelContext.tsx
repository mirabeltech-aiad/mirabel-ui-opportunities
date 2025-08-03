import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type BusinessModel = 'saas' | 'media';

interface BusinessModelContextType {
  businessModel: BusinessModel;
  setBusinessModel: (model: BusinessModel) => void;
  isLoading: boolean;
}

const BusinessModelContext = createContext<BusinessModelContextType | undefined>(undefined);

interface BusinessModelProviderProps {
  children: ReactNode;
}

export const BusinessModelProvider: React.FC<BusinessModelProviderProps> = ({ children }) => {
  const [businessModel, setBusinessModelState] = useState<BusinessModel>('media'); // Default to media
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedModel = localStorage.getItem('businessModel') as BusinessModel;
    if (savedModel && (savedModel === 'saas' || savedModel === 'media')) {
      setBusinessModelState(savedModel);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage when changed
  const setBusinessModel = (model: BusinessModel) => {
    setBusinessModelState(model);
    localStorage.setItem('businessModel', model);
  };

  return (
    <BusinessModelContext.Provider 
      value={{ 
        businessModel, 
        setBusinessModel, 
        isLoading 
      }}
    >
      {children}
    </BusinessModelContext.Provider>
  );
};

export const useBusinessModel = (): BusinessModelContextType => {
  const context = useContext(BusinessModelContext);
  if (!context) {
    throw new Error('useBusinessModel must be used within a BusinessModelProvider');
  }
  return context;
};