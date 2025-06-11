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
      console.log('data', data);
      
      // Process the data directly without sectioning
      const processedData = {
       storeSupply: {
          trackInventory: false,
          lowStockAlert: false,
          lowStockThreshold: 5,
          autoReorder: false,
          preferredSuppliers: [],
          ...(data.storeSupply || {})
        },
        ...data
      };
      
      dispatch({ 
        type: Actions.LOAD_SETTINGS, 
        payload: processedData 
      });
    }
  }, [data]);

  // Handle toggle setting
  const handleToggle = (key) => {
    dispatch({ 
      type: Actions.TOGGLE_SETTING, 
      payload: { key } 
    });
  };

  // Handle input change
  const handleInput = (key, value) => {
    dispatch({ 
      type: Actions.UPDATE_SETTING, 
      payload: { key, value } 
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