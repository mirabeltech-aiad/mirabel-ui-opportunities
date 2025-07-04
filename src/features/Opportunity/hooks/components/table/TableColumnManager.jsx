
import { useState, useEffect } from 'react';
import { getDefaultColumnOrder } from '@/features/Opportunity/utils/columnMapping';

export const useTableColumns = () => {
  const [columnOrder, setColumnOrder] = useState(getDefaultColumnOrder());
  
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [columnWidths, setColumnWidths] = useState({});
  
  // Add debugging for column order changes
  useEffect(() => {
    console.log('TableColumnManager: Column order changed to:', columnOrder.map(col => col.id));
    console.log('TableColumnManager: Total columns:', columnOrder.length);
  }, [columnOrder]);
  
  useEffect(() => {
    if (Object.keys(columnWidths).length > 0) {
      localStorage.setItem('tableColumnWidths', JSON.stringify(columnWidths));
    }
  }, [columnWidths]);
  
  useEffect(() => {
    const savedWidths = localStorage.getItem('tableColumnWidths');
    if (savedWidths) {
      try {
        setColumnWidths(JSON.parse(savedWidths));
      } catch (e) {
        console.error("Failed to parse saved column widths", e);
      }
    }
  }, []);

  const handleColumnResize = (columnId, width) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: width
    }));
  };

  const handleDragStart = (e, columnId) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', columnId);
    
    const dragElement = e.target.cloneNode(true);
    dragElement.style.backgroundColor = '#3b82f6';
    dragElement.style.color = 'white';
    dragElement.style.opacity = '0.8';
    dragElement.style.transform = 'rotate(3deg)';
    dragElement.style.position = 'absolute';
    dragElement.style.top = '-1000px';
    document.body.appendChild(dragElement);
    e.dataTransfer.setDragImage(dragElement, 0, 0);
    
    setTimeout(() => document.body.removeChild(dragElement), 0);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedColumn && draggedColumn !== columnId) {
      const draggedIndex = columnOrder.findIndex(col => col.id === draggedColumn);
      const hoverIndex = columnOrder.findIndex(col => col.id === columnId);
      
      if (draggedIndex === -1 || hoverIndex === -1) return;
      
      const newColumnOrder = [...columnOrder];
      const [removed] = newColumnOrder.splice(draggedIndex, 1);
      newColumnOrder.splice(hoverIndex, 0, removed);
      
      setColumnOrder(newColumnOrder);
    }
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  // Enhanced setColumnOrder with debugging and forced update
  const updateColumnOrder = (newColumnOrder) => {
    console.log('TableColumnManager: updateColumnOrder called with:', newColumnOrder?.map(col => col.id));
    console.log('TableColumnManager: Previous column order:', columnOrder?.map(col => col.id));
    console.log('TableColumnManager: Setting new column order with', newColumnOrder?.length, 'columns');
    
    // Force the state update by creating a new array reference
    if (Array.isArray(newColumnOrder)) {
      const updatedColumns = [...newColumnOrder];
      setColumnOrder(updatedColumns);
      console.log('TableColumnManager: Column order state updated');
    } else {
      console.error('TableColumnManager: Invalid column order provided:', newColumnOrder);
    }
  };

  return {
    columnOrder,
    setColumnOrder: updateColumnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
};
