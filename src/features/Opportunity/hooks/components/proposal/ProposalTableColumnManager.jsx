import { useState, useEffect } from 'react';
import { mapApiColumnConfigToTableColumns, validateColumnConfig } from '@OpportunityUtils/dynamicColumnMapper';
import { IsAdmin } from '@/constants/opportunityOptions';

export const useProposalTableColumns = (apiColumnConfig = null) => {
  // Initialize with empty column order - will be populated from API
  const [columnOrder, setColumnOrder] = useState([]);

  const [draggedColumn, setDraggedColumn] = useState(null);
  const [columnWidths, setColumnWidths] = useState(() => {
    const savedWidths = localStorage.getItem('proposalTableColumnWidths');
    return savedWidths ? JSON.parse(savedWidths) : {};
  });

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

  // Save column widths to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('proposalTableColumnWidths', JSON.stringify(columnWidths));
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
