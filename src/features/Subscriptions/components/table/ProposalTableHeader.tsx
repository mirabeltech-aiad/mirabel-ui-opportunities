
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { colorTokens } from "../../styles/designTokens";

interface ProposalTableHeaderProps {
  columnOrder: any[];
  sortConfig: any;
  requestSort: (key: string) => void;
  draggedColumn: string | null;
  handleDragStart: (e: React.DragEvent, columnId: string) => void;
  handleDragOver: (e: React.DragEvent, columnId: string) => void;
  handleDragEnd: () => void;
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
  columnWidths: Record<string, number>;
  onColumnResize: (columnId: string, width: number) => void;
}

const ProposalTableHeader: React.FC<ProposalTableHeaderProps> = ({ 
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
  const startResizing = (e: React.MouseEvent, columnId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.pageX;
    const currentWidth = columnWidths[columnId] || 150;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
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
        <TableHead className="w-8 h-11">
          <Checkbox 
            checked={selectAll}
            onCheckedChange={onSelectAll}
          />
        </TableHead>
        <TableHead className="w-8 h-11"></TableHead>
        {columnOrder.map((column) => (
          <TableHead
            key={column.id}
            className="relative cursor-pointer hover:bg-gray-100 font-medium text-muted-foreground select-none h-11"
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
                <span className="text-xs" style={{ color: colorTokens.ocean[500] }}>
                  {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                </span>
              )}
            </div>
            <div 
              className="absolute right-0 top-0 h-full w-4 cursor-col-resize group"
              onMouseDown={(e) => startResizing(e, column.id)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full w-1 bg-ocean-300 opacity-0 group-hover:opacity-100 mx-auto"></div>
            </div>
            {draggedColumn === column.id && (
              <div className="absolute inset-0 bg-ocean-100 opacity-30 border-2 border-ocean-400 rounded pointer-events-none"></div>
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default ProposalTableHeader;
