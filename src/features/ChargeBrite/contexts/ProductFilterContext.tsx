
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  type: 'print' | 'digital' | 'both';
  businessUnit: string;
}

export interface BusinessUnit {
  id: string;
  name: string;
}

export interface SubscriptionType {
  id: string;
  name: string;
}

export interface CustomerStatus {
  id: string;
  name: string;
}

interface ProductFilterContextType {
  products: Product[];
  businessUnits: BusinessUnit[];
  subscriptionTypes: SubscriptionType[];
  customerStatuses: CustomerStatus[];
  selectedProducts: string[];
  selectedBusinessUnits: string[];
  selectedSubscriptionTypes: string[];
  selectedCustomerStatuses: string[];
  isAllProductsSelected: boolean;
  isAllBusinessUnitsSelected: boolean;
  isAllSubscriptionTypesSelected: boolean;
  isAllCustomerStatusesSelected: boolean;
  setSelectedProducts: (products: string[]) => void;
  setSelectedBusinessUnits: (units: string[]) => void;
  setSelectedSubscriptionTypes: (types: string[]) => void;
  setSelectedCustomerStatuses: (statuses: string[]) => void;
  toggleProduct: (productId: string) => void;
  toggleBusinessUnit: (unitId: string) => void;
  toggleSubscriptionType: (typeId: string) => void;
  toggleCustomerStatus: (statusId: string) => void;
  selectAllProducts: () => void;
  selectAllBusinessUnits: () => void;
  selectAllSubscriptionTypes: () => void;
  selectAllCustomerStatuses: () => void;
  clearSelection: () => void;
}

const ProductFilterContext = createContext<ProductFilterContextType | undefined>(undefined);

export const useProductFilter = () => {
  const context = useContext(ProductFilterContext);
  if (!context) {
    throw new Error('useProductFilter must be used within a ProductFilterProvider');
  }
  return context;
};

interface ProductFilterProviderProps {
  children: ReactNode;
}

export const ProductFilterProvider: React.FC<ProductFilterProviderProps> = ({ children }) => {
  // Business units
  const businessUnits: BusinessUnit[] = [
    { id: 'news', name: 'News Division' },
    { id: 'business', name: 'Business Publications' },
    { id: 'lifestyle', name: 'Lifestyle & Culture' },
    { id: 'sports', name: 'Sports Division' },
    { id: 'health', name: 'Health & Wellness' },
  ];

  // Subscription types
  const subscriptionTypes: SubscriptionType[] = [
    { id: 'print', name: 'Print Only' },
    { id: 'digital', name: 'Digital Only' },
    { id: 'combo', name: 'Print + Digital' },
  ];

  // Customer statuses
  const customerStatuses: CustomerStatus[] = [
    { id: 'active', name: 'Active' },
    { id: 'at-risk', name: 'At Risk' },
    { id: 'churned', name: 'Churned' },
    { id: 'paused', name: 'Paused' },
  ];

  // Ten products with business units assigned
  const products: Product[] = [
    { id: 'daily-herald', name: 'Daily Herald', type: 'both', businessUnit: 'news' },
    { id: 'business-weekly', name: 'Business Weekly', type: 'print', businessUnit: 'business' },
    { id: 'tech-digest', name: 'Tech Digest', type: 'digital', businessUnit: 'business' },
    { id: 'lifestyle-magazine', name: 'Lifestyle Magazine', type: 'both', businessUnit: 'lifestyle' },
    { id: 'sports-tribune', name: 'Sports Tribune', type: 'print', businessUnit: 'sports' },
    { id: 'health-today', name: 'Health Today', type: 'digital', businessUnit: 'health' },
    { id: 'financial-times', name: 'Financial Times', type: 'both', businessUnit: 'business' },
    { id: 'arts-culture', name: 'Arts & Culture Weekly', type: 'print', businessUnit: 'lifestyle' },
    { id: 'science-journal', name: 'Science Journal', type: 'digital', businessUnit: 'health' },
    { id: 'travel-guide', name: 'Travel Guide Monthly', type: 'both', businessUnit: 'lifestyle' },
  ];

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState<string[]>([]);
  const [selectedSubscriptionTypes, setSelectedSubscriptionTypes] = useState<string[]>([]);
  const [selectedCustomerStatuses, setSelectedCustomerStatuses] = useState<string[]>([]);
  
  const isAllProductsSelected = selectedProducts.length === 0;
  const isAllBusinessUnitsSelected = selectedBusinessUnits.length === 0;
  const isAllSubscriptionTypesSelected = selectedSubscriptionTypes.length === 0;
  const isAllCustomerStatusesSelected = selectedCustomerStatuses.length === 0;

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleBusinessUnit = (unitId: string) => {
    setSelectedBusinessUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const toggleSubscriptionType = (typeId: string) => {
    setSelectedSubscriptionTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const toggleCustomerStatus = (statusId: string) => {
    setSelectedCustomerStatuses(prev => 
      prev.includes(statusId) 
        ? prev.filter(id => id !== statusId)
        : [...prev, statusId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts([]);
  };

  const selectAllBusinessUnits = () => {
    setSelectedBusinessUnits([]);
  };

  const selectAllSubscriptionTypes = () => {
    setSelectedSubscriptionTypes([]);
  };

  const selectAllCustomerStatuses = () => {
    setSelectedCustomerStatuses([]);
  };

  const clearSelection = () => {
    setSelectedProducts([]);
    setSelectedBusinessUnits([]);
    setSelectedSubscriptionTypes([]);
    setSelectedCustomerStatuses([]);
  };

  return (
    <ProductFilterContext.Provider 
      value={{
        products,
        businessUnits,
        subscriptionTypes,
        customerStatuses,
        selectedProducts,
        selectedBusinessUnits,
        selectedSubscriptionTypes,
        selectedCustomerStatuses,
        isAllProductsSelected,
        isAllBusinessUnitsSelected,
        isAllSubscriptionTypesSelected,
        isAllCustomerStatusesSelected,
        setSelectedProducts,
        setSelectedBusinessUnits,
        setSelectedSubscriptionTypes,
        setSelectedCustomerStatuses,
        toggleProduct,
        toggleBusinessUnit,
        toggleSubscriptionType,
        toggleCustomerStatus,
        selectAllProducts,
        selectAllBusinessUnits,
        selectAllSubscriptionTypes,
        selectAllCustomerStatuses,
        clearSelection,
      }}
    >
      {children}
    </ProductFilterContext.Provider>
  );
};
