
import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { reportsReducer } from './reducer.js';
import { initialState } from './initialState.js';

/**
 * Context for managing reports state
 */
const ReportsContext = createContext();

/**
 * Provider component for reports context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ReportsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reportsReducer, initialState);

  const value = {
    state,
    dispatch
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

ReportsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Hook to use reports context
 * @returns {Object} Context value with state and dispatch
 */
export const useReportsContext = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReportsContext must be used within a ReportsProvider');
  }
  return context;
};
