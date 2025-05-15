import React, { useReducer, useEffect } from 'react';
import { FeatureSettingsContext } from './Context';
import { settingsReducer } from './Reducer';
import { initialStoreSupplyState } from './initialState';
import { useSiteWideList } from '../hooks/useSiteWideList';
import * as Actions from './Actions';

export const FeatureSettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialStoreSupplyState);
  const { data, isLoading, error } = useSiteWideList();

  // Load settings from API when data is available
  useEffect(() => {
    if (data && !isLoading && !error) {
      // Process the data directly, initialize missing values with defaults
      const processedData = {
        // Initialize storeSupply section if needed
        storeSupply: {
          trackInventory: false,
          lowStockAlert: false,
          lowStockThreshold: 5,
          autoReorder: false,
          preferredSuppliers: [],
          ...(data.storeSupply || {})
        },
        
        // Include any other sections from API data
        ...(data.adManagement && { adManagement: data.adManagement }),
        ...(data.accountReceivable && { accountReceivable: data.accountReceivable }),
        ...(data.production && { production: data.production }),
        ...(data.contact && { contact: data.contact }),
        ...(data.customerPortal && { customerPortal: data.customerPortal }),
        ...(data.userSettings && { userSettings: data.userSettings }),
        ...(data.communications && { communications: data.communications }),
        ...(data.googleCalendar && { googleCalendar: data.googleCalendar }),
        ...(data.helpdesk && { helpdesk: data.helpdesk }),
        ...(data.mediaMailKit && { mediaMailKit: data.mediaMailKit })
      };
      
      dispatch({ 
        type: Actions.LOAD_SETTINGS, 
        payload: processedData 
      });
    }
  }, [data]);

  // Handle toggle setting
  const handleToggle = (section, key) => {
    dispatch({ 
      type: Actions.TOGGLE_SETTING, 
      payload: { section, key } 
    });
  };

  // Handle input change
  const handleInput = (section, key, value) => {
    dispatch({ 
      type: Actions.UPDATE_SETTING, 
      payload: { section, key, value } 
    });
  };

  // Handle new supplier input
  const setNewSupplier = (value) => {
    dispatch({
      type: Actions.SET_NEW_SUPPLIER,
      payload: value
    });
  };

  // Handle add supplier
  const handleAddSupplier = () => {
    if (state.newSupplier && state.newSupplier.trim() !== '') {
      dispatch({
        type: Actions.ADD_SUPPLIER,
        payload: state.newSupplier.trim()
      });
    }
  };

  // Handle remove supplier
  const handleRemoveSupplier = (supplier) => {
    dispatch({
      type: Actions.REMOVE_SUPPLIER,
      payload: supplier
    });
  };

  // Handle inventory update
  const updateInventory = (inventoryData) => {
    dispatch({
      type: Actions.UPDATE_INVENTORY,
      payload: inventoryData
    });
  };

  // Value to be provided to consumers
  const value = {
    state,
    handleToggle,
    handleInput,
    setNewSupplier,
    handleAddSupplier,
    handleRemoveSupplier,
    updateInventory,
    isLoading,
    error
  };

  return (
    <FeatureSettingsContext.Provider value={value}>
      {children}
    </FeatureSettingsContext.Provider>
  );
}; 