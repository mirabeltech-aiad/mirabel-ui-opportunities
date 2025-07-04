import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const ProposalTableHeader = ({ 
  columnOrder, 
  sortConfig, 
  requestSort, 
  draggedColumn, 
  handleDragStart, 
  handleDragOver, 
  handleDragEnd,
  selectAll,
  onSelectAll,
  columnWidths,
  onColumnResize
}) => {
  const startResizing = (e, columnId) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.pageX;
    const currentWidth = columnWidths[columnId] || 150;
    
    const handleMouseMove = (moveEvent) => {
      const width = Math.max(80, currentWidth + (moveEvent.pageX - startX));
      onColumnResize(columnId, width);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  return (
    <TableHeader>
      <TableRow className="bg-gray-50">
        <TableHead className="w-8">
          <Checkbox 
            checked={selectAll}
            onCheckedChange={onSelectAll}
          />
        </TableHead>
        <TableHead className="w-8"></TableHead>
        {columnOrder.map((column) => (
          <TableHead
            key={column.id}
            className="relative cursor-pointer hover:bg-gray-100 font-medium text-gray-700 select-none"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, column.id)}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragEnd={handleDragEnd}
            style={{
              width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
              minWidth: '80px'
            }}
          >
            <div 
              className="flex items-center gap-1 flex-1"
              onClick={() => requestSort(column.id)}
            >
              {column.label}
              {sortConfig.key === column.id && (
                <span className="text-xs">
                  {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                </span>
              )}
            </div>
            {/* Resize handle */}
            <div 
              className="absolute right-0 top-0 h-full w-4 cursor-col-resize group"
              onMouseDown={(e) => startResizing(e, column.id)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full w-1 bg-gray-300 opacity-0 group-hover:opacity-100 mx-auto"></div>
            </div>
            {draggedColumn === column.id && (
              <div className="absolute inset-0 bg-blue-100 opacity-30 border-2 border-blue-400 rounded pointer-events-none"></div>
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default ProposalTableHeader;
