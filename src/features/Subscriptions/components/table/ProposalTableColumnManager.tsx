
import { useState } from 'react';

export const useProposalTableColumns = () => {
  const [columnOrder, setColumnOrder] = useState([
    { id: 'status', label: 'Status' },
    { id: 'name', label: 'Proposal Name' },
    { id: 'company', label: 'Company Name' },
    { id: 'createdDate', label: 'Created Date' },
    { id: 'assignedRep', label: 'Assigned Rep' },
    { id: 'stage', label: 'Stage' },
    { id: 'amount', label: 'Amount' },
    { id: 'projCloseDate', label: 'Proj Close Date' }
  ]);
  
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  
  const handleColumnResize = (columnId: string, width: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: width
    }));
  };

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', columnId);
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

  const handleDragEnd = () => {
    setDraggedColumn(null);
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
