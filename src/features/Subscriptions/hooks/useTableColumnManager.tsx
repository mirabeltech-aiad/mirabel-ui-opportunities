
import { useState, useEffect, useMemo } from 'react';

export interface TableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  resizable?: boolean;
}

export interface UseTableColumnManagerProps {
  columns: TableColumn[];
  storageKey: string;
}

export const useTableColumnManager = ({ columns, storageKey }: UseTableColumnManagerProps) => {
  const [columnOrder, setColumnOrder] = useState<TableColumn[]>(columns);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  // Memoize columns to prevent infinite re-renders
  const memoizedColumns = useMemo(() => columns, [JSON.stringify(columns.map(col => ({ id: col.id, label: col.label })))]);

  // Load saved preferences on mount
  useEffect(() => {
    console.log('useTableColumnManager: Loading saved preferences');
    const savedOrder = localStorage.getItem(`${storageKey}-column-order`);
    const savedWidths = localStorage.getItem(`${storageKey}-column-widths`);

    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        // Ensure all columns from the current config exist
        const validOrder = parsedOrder.filter((col: TableColumn) => 
          memoizedColumns.some(c => c.id === col.id)
        );
        if (validOrder.length === memoizedColumns.length) {
          setColumnOrder(validOrder);
        }
      } catch (error) {
        console.warn('Failed to parse saved column order:', error);
      }
    }

    if (savedWidths) {
      try {
        const parsedWidths = JSON.parse(savedWidths);
        setColumnWidths(parsedWidths);
      } catch (error) {
        console.warn('Failed to parse saved column widths:', error);
      }
    }
  }, [storageKey, memoizedColumns]);

  const handleColumnResize = (columnId: string, width: number) => {
    const newWidths = {
      ...columnWidths,
      [columnId]: Math.max(80, width) // Minimum 80px width
    };
    setColumnWidths(newWidths);
    localStorage.setItem(`${storageKey}-column-widths`, JSON.stringify(newWidths));
  };

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', columnId);
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.cursor = 'grabbing';
    }
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
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

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedColumn(null);
    
    // Reset cursor
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.cursor = 'grab';
    }
    
    // Save the new order
    localStorage.setItem(`${storageKey}-column-order`, JSON.stringify(columnOrder));
  };

  return {
    columnOrder,
    setColumnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
};
