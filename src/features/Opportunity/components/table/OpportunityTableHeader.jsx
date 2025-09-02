import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

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
  onColumnResize,
  isSplitScreenMode = false,
}) => {
  const startResizing = (e, columnId) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.pageX;
    const currentWidth = columnWidths[columnId] || 150;

    const handleMouseMove = (moveEvent) => {
      let minWidth = 80;
      if (columnId === 'Status') {
        minWidth = 70;
      } else if (columnId === 'AssignedTo') {
        minWidth = 90;
      } else if (columnId === 'Probability') {
        minWidth = 90;
      } else if (columnId === 'Amount') {
        minWidth = 90;
      }
      const width = Math.max(minWidth, currentWidth + (moveEvent.pageX - startX));
      onColumnResize(columnId, width);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <TableHeader className="sticky top-0 z-30 bg-white">
      <TableRow className="hover:bg-transparent border-b-2 border-gray-300">
        {!isSplitScreenMode && (
          <TableHead className="sticky top-0 z-20 w-12 px-4 py-1.5 bg-gray-50 text-muted-foreground h-11 border-b-2 border-gray-300">
            <Checkbox checked={selectAll} onCheckedChange={onSelectAll} />
          </TableHead>
        )}
        <TableHead className="sticky top-0 z-20 w-12 px-2 py-1.5 bg-gray-50 text-muted-foreground h-11 border-b-2 border-gray-300"></TableHead>
        {columnOrder.map((column) => (
          <TableHead
            key={column.id}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, column.id)}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragEnd={handleDragEnd}
            style={{
              width: columnWidths[column.id]
                ? `${columnWidths[column.id]}px`
                : undefined,
              minWidth: column.id === 'Status' ? "70px" : column.id === 'AssignedTo' ? "90px" : column.id === 'Probability' ? "90px" : column.id === 'Amount' ? "90px" : "120px",
            }}
            className={`sticky top-0 z-20 cursor-pointer text-sm font-medium text-muted-foreground bg-gray-50 px-4 py-1.5 hover:bg-gray-100 transition-colors border-r border-gray-200 last:border-r-0 h-11 border-b-2 border-gray-300 ${
              column.id === 'AssignedTo' ? 'text-center' : 'text-left'
            }`}
          >
            <div
              className="flex items-center justify-between h-full"
              onClick={() => requestSort(column.id)}
            >
              <span className="font-medium text-muted-foreground text-sm truncate flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                {column.label}
              </span>
              {sortConfig.key === column.id && (
                <span className="text-xs text-muted-foreground ml-1 flex-shrink-0">
                  {sortConfig.direction === "ascending" ? "↑" : "↓"}
                </span>
              )}
            </div>

            {/* Resize handle - positioned at the right edge */}
            <div
              className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-300 transition-colors"
              onMouseDown={(e) => startResizing(e, column.id)}
              onClick={(e) => e.stopPropagation()}
              title="Drag to resize column"
            ></div>

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
