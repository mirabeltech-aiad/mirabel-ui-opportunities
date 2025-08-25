import { useState, useEffect } from 'react';
import { mapApiColumnConfigToTableColumns, validateColumnConfig } from '@OpportunityUtils/dynamicColumnMapper';
import { IsAdmin } from '@OpportunityConstants/opportunityOptions';
import { calculateAllColumnWidths, mergeColumnWidths } from '@/utils/columnWidthUtils';

export const useProposalTableColumns = (apiColumnConfig = null, data = []) => {
  // Initialize with empty column order - will be populated from API
  const [columnOrder, setColumnOrder] = useState([]);

  const [draggedColumn, setDraggedColumn] = useState(null);
  const [columnWidths, setColumnWidths] = useState({});
  const [initialWidthsCalculated, setInitialWidthsCalculated] = useState(false);

  // Update column order when API config changes
  useEffect(() => {
    if (apiColumnConfig && validateColumnConfig(apiColumnConfig)) {
      console.log('Setting column order from API config:', apiColumnConfig);
      const mappedColumns = mapApiColumnConfigToTableColumns(apiColumnConfig);
      
      // Add Edit Icon column to the mapped columns
      const editIconColumn = {
        id: 'editIcon',
        label: 'Edit',
        type: 'editIcon',
        width: 60,
        sortable: false,
        propertyMapping: null // This column doesn't map to any data property
      };
      
      // Insert the edit icon column after the checkbox column (at the beginning)
      const columnsWithEditIcon = [editIconColumn, ...mappedColumns];
      setColumnOrder(columnsWithEditIcon);
    } else {
      console.log('No valid API column config provided, keeping empty column order');
    }
  }, [apiColumnConfig]);

  // Calculate initial column widths based on data content
  useEffect(() => {
    if (columnOrder.length > 0 && data.length > 0 && !initialWidthsCalculated) {
      console.log('ProposalTableColumnManager: Calculating initial column widths based on data');
      
      // Calculate optimal widths based on content
      const calculatedWidths = calculateAllColumnWidths(columnOrder, data);
      
      // Get saved widths from localStorage
      const savedWidthsString = localStorage.getItem('proposalTableColumnWidths');
      let savedWidths = {};
      if (savedWidthsString) {
        try {
          savedWidths = JSON.parse(savedWidthsString);
        } catch (e) {
          console.error("Failed to parse saved column widths", e);
        }
      }
      
      // Merge calculated and saved widths (saved widths take precedence)
      const finalWidths = mergeColumnWidths(calculatedWidths, savedWidths);
      
      // Ensure minimum widths to prevent overlap
      Object.keys(finalWidths).forEach(columnId => {
        if (columnId !== 'editIcon' && finalWidths[columnId] < 150) {
          finalWidths[columnId] = 150;
        }
      });
      
      console.log('ProposalTableColumnManager: Setting initial column widths:', finalWidths);
      setColumnWidths(finalWidths);
      setInitialWidthsCalculated(true);
    }
  }, [columnOrder, data, initialWidthsCalculated]);

  // Load saved widths on mount (fallback for when no data is available)
  useEffect(() => {
    if (data.length === 0) {
      const savedWidths = localStorage.getItem('proposalTableColumnWidths');
      if (savedWidths) {
        try {
          setColumnWidths(JSON.parse(savedWidths));
        } catch (e) {
          console.error("Failed to parse saved column widths", e);
        }
      }
    }
  }, [data]);

  // Save column widths to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(columnWidths).length > 0) {
      localStorage.setItem('proposalTableColumnWidths', JSON.stringify(columnWidths));
    }
  }, [columnWidths]);

  const handleDragStart = (columnId) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
  };

  const handleDragEnd = (e, targetColumnId) => {
    e.preventDefault();
    
    if (draggedColumn && draggedColumn !== targetColumnId) {
      const draggedIndex = columnOrder.findIndex(col => col.id === draggedColumn);
      const targetIndex = columnOrder.findIndex(col => col.id === targetColumnId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newColumnOrder = [...columnOrder];
        const [draggedCol] = newColumnOrder.splice(draggedIndex, 1);
        newColumnOrder.splice(targetIndex, 0, draggedCol);
        setColumnOrder(newColumnOrder);
      }
    }
    
    setDraggedColumn(null);
  };

  const handleColumnResize = (columnId, newWidth) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: Math.max(100, newWidth) // Minimum width of 100px
    }));
  };

  return {
    columnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    setColumnOrder
  };
};
