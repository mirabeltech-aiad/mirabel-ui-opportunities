
import React from 'react';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface EnhancedTableHeaderProps {
  column: {
    id: string;
    label: string;
    sortable?: boolean;
    resizable?: boolean;
  };
  sortConfig: {
    key: string | null;
    direction: 'ascending' | 'descending' | null;
  };
  draggedColumn: string | null;
  columnWidth?: number;
  onSort?: (key: string) => void;
  onDragStart: (e: React.DragEvent, columnId: string) => void;
  onDragOver: (e: React.DragEvent, columnId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onResize: (columnId: string, width: number) => void;
  className?: string;
}

const EnhancedTableHeader: React.FC<EnhancedTableHeaderProps> = ({
  column,
  sortConfig,
  draggedColumn,
  columnWidth,
  onSort,
  onDragStart,
  onDragOver,
  onDragEnd,
  onResize,
  className
}) => {
  const startResizing = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.pageX;
    const currentWidth = columnWidth || 150;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const width = Math.max(80, currentWidth + (moveEvent.pageX - startX));
      onResize(column.id, width);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <TableHead
      className={cn(
        "relative select-none transition-colors",
        column.sortable && "cursor-pointer hover:bg-gray-100",
        draggedColumn === column.id && "bg-ocean-100 opacity-30 border-2 border-ocean-400 rounded",
        className
      )}
      draggable={true}
      onDragStart={(e) => onDragStart(e, column.id)}
      onDragOver={(e) => onDragOver(e, column.id)}
      onDragEnd={onDragEnd}
      style={{
        width: columnWidth ? `${columnWidth}px` : undefined,
        minWidth: '80px',
        cursor: draggedColumn === column.id ? 'grabbing' : 'grab'
      }}
    >
      <div 
        className="flex items-center gap-1 flex-1"
        onClick={() => column.sortable && onSort?.(column.id)}
      >
        {column.label}
        {column.sortable && sortConfig.key === column.id && (
          <span className="text-xs text-ocean-500">
            {sortConfig.direction === 'ascending' ? '↑' : '↓'}
          </span>
        )}
      </div>
      
      {column.resizable !== false && (
        <div 
          className="absolute right-0 top-0 h-full w-4 cursor-col-resize group"
          onMouseDown={startResizing}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full w-1 bg-ocean-300 opacity-0 group-hover:opacity-100 mx-auto"></div>
        </div>
      )}
    </TableHead>
  );
};

export default EnhancedTableHeader;
