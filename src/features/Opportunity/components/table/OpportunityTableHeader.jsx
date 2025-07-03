import React from "react";
import { TableHead, TableHeader, TableRow } from "@OpportunityComponents/ui/table";
import { Checkbox } from "@OpportunityComponents/ui/checkbox";

const OpportunityTableHeader = ({
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
    <TableHeader className="sticky top-0 z-10">
      <TableRow className="hover:bg-transparent border-b border-gray-200">
        <TableHead className="w-12 px-4 py-2.5 bg-gray-50 text-muted-foreground h-11">
          <Checkbox 
            checked={selectAll} 
            onCheckedChange={onSelectAll} 
          />
        </TableHead>
        {columnOrder.map((column) => (
          <TableHead
            key={column.id}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, column.id)}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragEnd={handleDragEnd}
            style={{
              width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
              minWidth: '120px'
            }}
            className="relative cursor-pointer text-sm font-medium text-muted-foreground bg-gray-50 px-4 py-2.5 text-left hover:bg-gray-100 transition-colors border-r border-gray-200 last:border-r-0 h-11"
          >
            <div className="flex items-center justify-between h-full" onClick={() => requestSort(column.id)}>
              <span className="font-medium text-muted-foreground text-sm">{column.label}</span>
              {sortConfig.key === column.id && (
                <span className="text-xs text-muted-foreground ml-1 flex-shrink-0">
                  {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                </span>
              )}
            </div>
            
            {/* Resize handle - positioned at the right edge */}
            <div 
              className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-300 transition-colors"
              onMouseDown={(e) => startResizing(e, column.id)}
              onClick={(e) => e.stopPropagation()}
              title="Drag to resize column"
            >
            </div>
            
            {draggedColumn === column.id && (
              <div className="absolute inset-0 bg-blue-100 opacity-50 border-2 border-blue-400 rounded pointer-events-none"></div>
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default OpportunityTableHeader;
