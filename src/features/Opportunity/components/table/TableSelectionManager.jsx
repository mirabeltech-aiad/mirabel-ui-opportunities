
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
    console.log('TableSelectionManager: idField:', idField);
    
    if (checked) {
      // Select all currently displayed items
      const allIds = new Set(displayedItems.map(item => {
        const id = item[idField];
        // Convert to integer for consistency with checkbox logic
        const parsedId = typeof id === 'string' ? parseInt(id) : id;
        console.log(`TableSelectionManager: processing item ID: ${id} -> ${parsedId}`);
        return parsedId;
      }));
      console.log('TableSelectionManager: selecting all IDs:', Array.from(allIds));
      setSelectedRows(allIds);
      setSelectAll(true);
    } else {
      // Clear all selections
      console.log('TableSelectionManager: clearing all selections');
      setSelectedRows(new Set());
      setSelectAll(false);
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
      console.log('TableSelectionManager: added itemId to selection:', itemId);
    } else {
      newSelectedRows.delete(itemId);
      console.log('TableSelectionManager: removed itemId from selection:', itemId);
    }
    
    console.log('TableSelectionManager: new selectedRows size:', newSelectedRows.size);
    console.log('TableSelectionManager: new selectedRows content:', Array.from(newSelectedRows));
    setSelectedRows(newSelectedRows);
    
    // Update select-all state based on current selection
    // Select-all is checked only when all displayed items are selected
    const allDisplayedIds = new Set(displayedItems.map(item => {
      const id = item[idField];
      return typeof id === 'string' ? parseInt(id) : id;
    }));
    
    console.log('TableSelectionManager: allDisplayedIds:', Array.from(allDisplayedIds));
    
    // Check if all displayed items are in the selected set
    const allSelected = allDisplayedIds.size > 0 && 
      Array.from(allDisplayedIds).every(id => newSelectedRows.has(id));
    
    console.log('TableSelectionManager: allSelected check:', allSelected);
    console.log('TableSelectionManager: setting selectAll to:', allSelected);
    setSelectAll(allSelected);
  };

  // Reset selections when displayed items change (e.g., filtering, pagination)
  useEffect(() => {
    console.log('TableSelectionManager: displayedItems changed, resetting selections');
    console.log('TableSelectionManager: new displayedItems length:', displayedItems.length);
    setSelectedRows(new Set());
    setSelectAll(false);
  }, [displayedItems.length]);

  // Validate selection state consistency
  useEffect(() => {
    console.log('TableSelectionManager: State validation:');
    console.log('  - selectedRows size:', selectedRows.size);
    console.log('  - selectedRows content:', Array.from(selectedRows));
    console.log('  - selectAll state:', selectAll);
    console.log('  - displayedItems length:', displayedItems.length);
    console.log('  - idField:', idField);
    
    // Validate that selectAll state is consistent with actual selections
    if (displayedItems.length > 0) {
      const allDisplayedIds = displayedItems.map(item => {
        const id = item[idField];
        return typeof id === 'string' ? parseInt(id) : id;
      });
      const actuallyAllSelected = allDisplayedIds.every(id => selectedRows.has(id));
      
      if (selectAll !== actuallyAllSelected) {
        console.warn('TableSelectionManager: selectAll state inconsistency detected!');
        console.warn('  - selectAll:', selectAll);
        console.warn('  - actuallyAllSelected:', actuallyAllSelected);
        console.warn('  - allDisplayedIds:', allDisplayedIds);
      }
    }
  }, [selectedRows, selectAll, displayedItems, idField]);

  return {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleRowSelect
  };
};
