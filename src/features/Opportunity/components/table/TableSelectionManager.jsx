
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing table row selection state
 * 
 * Provides functionality for selecting individual rows and bulk selection operations.
 * Automatically updates select-all state based on current selection status.
 * 
 * @param {Array} displayedItems - Array of items currently displayed in the table
 * @param {string} [idField='id'] - Field name to use as unique identifier for items
 * 
 * @returns {Object} Selection state and handlers
 * @returns {Set} selectedRows - Set containing IDs of selected rows
 * @returns {boolean} selectAll - Whether all displayed rows are selected
 * @returns {Function} handleSelectAll - Handler for select all checkbox
 * @returns {Function} handleRowSelect - Handler for individual row selection
 * 
 * @example
 * const { selectedRows, selectAll, handleSelectAll, handleRowSelect } = useTableSelection(opportunities);
 * 
 * // Use in table header
 * <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
 * 
 * // Use in table rows
 * <Checkbox 
 *   checked={selectedRows.has(item.id)} 
 *   onCheckedChange={(checked) => handleRowSelect(item.id, checked)} 
 * />
 */
export const useTableSelection = (displayedItems, idField = 'id') => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  /**
   * Handles bulk selection/deselection of all displayed items
   * 
   * @param {boolean} checked - Whether to select or deselect all items
   */
  const handleSelectAll = (checked) => {
    console.log('TableSelectionManager: handleSelectAll called with checked:', checked);
    console.log('TableSelectionManager: displayedItems length:', displayedItems.length);
    console.log('TableSelectionManager: displayedItems sample:', displayedItems.slice(0, 3));
    
    setSelectAll(checked);
    if (checked) {
      // Select all currently displayed items
      const allIds = new Set(displayedItems.map(item => item[idField]));
      console.log('TableSelectionManager: selecting all IDs:', Array.from(allIds));
      setSelectedRows(allIds);
    } else {
      // Clear all selections
      console.log('TableSelectionManager: clearing all selections');
      setSelectedRows(new Set());
    }
  };

  /**
   * Handles selection state change for individual rows
   * 
   * @param {string|number} itemId - Unique identifier of the item
   * @param {boolean} checked - Whether the item should be selected
   */
  const handleRowSelect = (itemId, checked) => {
    console.log('TableSelectionManager: handleRowSelect called with itemId:', itemId, 'checked:', checked);
    
    const newSelectedRows = new Set(selectedRows);
    
    if (checked) {
      newSelectedRows.add(itemId);
    } else {
      newSelectedRows.delete(itemId);
    }
    
    console.log('TableSelectionManager: new selectedRows size:', newSelectedRows.size);
    setSelectedRows(newSelectedRows);
    
    // Update select-all state based on current selection
    // Select-all is checked only when all displayed items are selected
    const newSelectAll = newSelectedRows.size === displayedItems.length && displayedItems.length > 0;
    console.log('TableSelectionManager: setting selectAll to:', newSelectAll);
    setSelectAll(newSelectAll);
  };

  // Reset selections when displayed items change (e.g., filtering, pagination)
  useEffect(() => {
    console.log('TableSelectionManager: displayedItems changed, resetting selections');
    setSelectedRows(new Set());
    setSelectAll(false);
  }, [displayedItems.length]);

  // Log current state
  useEffect(() => {
    console.log('TableSelectionManager: selectedRows size:', selectedRows.size);
    console.log('TableSelectionManager: selectAll state:', selectAll);
  }, [selectedRows, selectAll]);

  return {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleRowSelect
  };
};
