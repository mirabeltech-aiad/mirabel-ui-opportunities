import { useState } from 'react';

/**
 * Generic hook for managing side panel state
 * Can be used across different modules for consistent panel behavior
 * 
 * @param {Object} initialState - Initial state for the panel
 * @returns {Object} Panel state and control functions
 */
export const useSidePanel = (initialState = {}) => {
  const [isOpen, setIsOpen] = useState(initialState.isOpen || false);
  const [data, setData] = useState(initialState.data || null);
  const [metadata, setMetadata] = useState(initialState.metadata || {});

  /**
   * Open the panel with optional data and metadata
   * @param {*} panelData - Data to pass to the panel content
   * @param {Object} panelMetadata - Additional metadata for the panel
   */
  const openPanel = (panelData = null, panelMetadata = {}) => {
    setData(panelData);
    setMetadata(panelMetadata);
    setIsOpen(true);
  };

  /**
   * Close the panel and clear data
   */
  const closePanel = () => {
    setIsOpen(false);
    setData(null);
    setMetadata({});
  };

  /**
   * Update panel data without closing
   * @param {*} newData - New data to set
   */
  const updatePanelData = (newData) => {
    setData(newData);
  };

  /**
   * Update panel metadata without closing
   * @param {Object} newMetadata - New metadata to set
   */
  const updatePanelMetadata = (newMetadata) => {
    setMetadata(prev => ({ ...prev, ...newMetadata }));
  };

  /**
   * Toggle panel open/closed state
   * @param {*} panelData - Optional data to set when opening
   * @param {Object} panelMetadata - Optional metadata to set when opening
   */
  const togglePanel = (panelData = null, panelMetadata = {}) => {
    if (isOpen) {
      closePanel();
    } else {
      openPanel(panelData, panelMetadata);
    }
  };

  return {
    // State
    isOpen,
    data,
    metadata,
    
    // Actions
    openPanel,
    closePanel,
    updatePanelData,
    updatePanelMetadata,
    togglePanel
  };
};