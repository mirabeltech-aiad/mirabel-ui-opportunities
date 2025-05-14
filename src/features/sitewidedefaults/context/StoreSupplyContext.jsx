import React, { createContext, useContext, useReducer } from 'react';
import { useSiteWideList } from '../hooks/useSiteWideList';

// Create context
const StoreSupplyContext = createContext(null);

// Default initial state for store supply
const initialStoreSupplyState = {
  inventory: {
    trackInventory: false,
    lowStockAlert: false,
    lowStockThreshold: 10,
    autoReorder: false,
    reorderThreshold: 5,
  },
  suppliers: {
    preferredSuppliers: [],
    leadTimes: {},
    minimumOrderQuantities: {},
  },
  products: {
    categories: [],
    status: {},
  },
  orders: {
    pendingOrders: [],
    orderHistory: [],
    autoApproval: false,
  }
};

// Action types
const INITIALIZE_FROM_API = 'INITIALIZE_FROM_API';
const UPDATE_INVENTORY = 'UPDATE_INVENTORY';
const UPDATE_SUPPLIERS = 'UPDATE_SUPPLIERS';
const UPDATE_PRODUCTS = 'UPDATE_PRODUCTS';
const UPDATE_ORDERS = 'UPDATE_ORDERS';

// Reducer function
const storeSupplyReducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE_FROM_API:
      const { data } = action.payload;
      return {
        ...state,
        inventory: {
          ...state.inventory,
          trackInventory: data.InvCheck || false,
          lowStockAlert: data.InvPropCheck || false,
          lowStockThreshold: data.CheckCreditLimitOnAddDays || 10,
          autoReorder: data.StopInvFail || false,
        },
        suppliers: {
          ...state.suppliers,
          preferredSuppliers: data.PickupFromSettings ? 
            [data.PickupFromSettings.PickupFrom1, data.PickupFromSettings.PickupFrom2].filter(Boolean) : 
            [],
        },
        products: {
          ...state.products,
          categories: data.IsMultiplePubsEnabled ? ['Publications', 'Digital', 'Services'] : ['General'],
          status: {
            active: true,
            discontinued: !data.IsShowAmountOnInventoryReport,
          }
        },
        orders: {
          ...state.orders,
          autoApproval: data.IsProposalConvertToOrderOnApproval || false,
        }
      };
    case UPDATE_INVENTORY:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          ...action.payload
        }
      };
    case UPDATE_SUPPLIERS:
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          ...action.payload
        }
      };
    case UPDATE_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          ...action.payload
        }
      };
    case UPDATE_ORDERS:
      return {
        ...state,
        orders: {
          ...state.orders,
          ...action.payload
        }
      };
    default:
      return state;
  }
};

export const StoreSupplyProvider = ({ children }) => {
  const [storeSupply, dispatch] = useReducer(storeSupplyReducer, initialStoreSupplyState);
  const { data, isLoading, error } = useSiteWideList();

  // Initialize from API data when it's available
  if (data && storeSupply.products.categories.length === 0) {
    dispatch({ 
      type: INITIALIZE_FROM_API, 
      payload: { data } 
    });
  }

  // Action creator functions
  const updateInventory = (inventoryUpdates) => {
    dispatch({ 
      type: UPDATE_INVENTORY, 
      payload: inventoryUpdates 
    });
  };

  const updateSuppliers = (supplierUpdates) => {
    dispatch({ 
      type: UPDATE_SUPPLIERS, 
      payload: supplierUpdates 
    });
  };

  const updateProducts = (productUpdates) => {
    dispatch({ 
      type: UPDATE_PRODUCTS, 
      payload: productUpdates 
    });
  };

  const updateOrders = (orderUpdates) => {
    dispatch({ 
      type: UPDATE_ORDERS, 
      payload: orderUpdates 
    });
  };

  // The context value that will be provided
  const contextValue = {
    storeSupply,
    updateInventory,
    updateSuppliers,
    updateProducts,
    updateOrders,
    dispatch,
    isLoading,
    error
  };

  return (
    <StoreSupplyContext.Provider value={contextValue}>
      {children}
    </StoreSupplyContext.Provider>
  );
};

// Custom hook to use the store supply context
export const useStoreSupply = () => {
  const context = useContext(StoreSupplyContext);
  if (context === null) {
    throw new Error('useStoreSupply must be used within a StoreSupplyProvider');
  }
  return context;
}; 