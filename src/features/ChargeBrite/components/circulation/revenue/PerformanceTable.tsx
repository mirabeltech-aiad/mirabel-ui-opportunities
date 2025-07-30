
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Settings2 } from 'lucide-react';
import { HelpTooltip } from '@/components';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface TableColumn {
  key: string;
  label: string;
  align: 'left' | 'center' | 'right';
}

interface PerformanceTableProps {
  title: string;
  columns: TableColumn[];
  data: Array<Record<string, any>>;
  renderCell?: (value: any, key: string, row: Record<string, any>) => React.ReactNode;
  isLoading?: boolean;
  className?: string;
  helpId?: string;
}

const PerformanceTable: React.FC<PerformanceTableProps> = ({
  title,
  columns,
  data,
  renderCell,
  isLoading,
  className = "",
  helpId
}) => {
  // State for column visibility and compact mode
  const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    columns.forEach(col => {
      initial[col.key] = true;
    });
    return initial;
  });
  
  const [isCompactMode, setIsCompactMode] = React.useState(false);

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: data || [],
    initialSort: undefined
  });

  // Transform columns for table column manager
  const tableColumns = columns.map(col => ({
    id: col.key,
    label: col.label,
    sortable: true,
    resizable: true
  }));

  // Initialize table column manager for drag-and-drop and resizing
  const {
    columnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useTableColumnManager({
    columns: tableColumns,
    storageKey: `performance-table-${title.toLowerCase().replace(/\s+/g, '-')}`
  });

  // Filter visible columns
  const visibleColumnOrder = columnOrder.filter(column => visibleColumns[column.id]);

  // Handle column visibility toggle
  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnId]: visible
    }));
  };

  // Handle column resizing
  const startResizing = (e: React.MouseEvent, columnId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.pageX;
    const currentWidth = columnWidths[columnId] || 150;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const width = Math.max(80, currentWidth + (moveEvent.pageX - startX));
      handleColumnResize(columnId, width);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Get column alignment
  const getColumnAlign = (columnId: string) => {
    const originalColumn = columns.find(col => col.key === columnId);
    return originalColumn?.align || 'left';
  };
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">{title}</CardTitle>
            {helpId && <HelpTooltip helpId={helpId} />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">{title}</CardTitle>
            {helpId && <HelpTooltip helpId={helpId} />}
          </div>
          
          {/* Manage Columns Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500">
                <Settings2 className="h-4 w-4 text-white" />
                Manage Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg z-50">
              <div className="p-3">
                <div className="text-sm font-medium text-gray-700 mb-3">Manage Columns</div>
                <div className="space-y-2">
                  {tableColumns.map((column) => (
                    <div key={column.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={column.id}
                        checked={visibleColumns[column.id]}
                        onCheckedChange={(checked) => handleColumnVisibilityChange(column.id, checked as boolean)}
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor={column.id}
                        className="text-sm text-gray-700 cursor-pointer flex-1"
                      >
                        {column.label}
                      </label>
                    </div>
                  ))}
                </div>
                
                <DropdownMenuSeparator className="my-3" />
                
                <div className="flex items-center justify-between">
                  <label htmlFor="compact-mode" className="text-sm text-gray-700">
                    Compact Table
                  </label>
                  <Switch
                    id="compact-mode"
                    checked={isCompactMode}
                    onCheckedChange={setIsCompactMode}
                    className="h-5 w-9"
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {visibleColumnOrder.map((column) => {
                const align = getColumnAlign(column.id);
                return (
                  <TableHead
                    key={column.id}
                    className={`relative ${isCompactMode ? 'h-9 py-1.5 px-2' : 'h-11 py-2.5 px-4'} font-medium text-muted-foreground select-none cursor-pointer hover:bg-gray-100 ${
                      align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
                    }`}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, column.id)}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => {
                      if (!e.defaultPrevented) {
                        const dataType = getDataTypeFromColumn(column.id);
                        requestSort(column.id, dataType);
                      }
                    }}
                    style={{
                      width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                      minWidth: '80px',
                      cursor: draggedColumn === column.id ? 'grabbing' : 'pointer'
                    }}
                  >
                    <div className={`flex items-center gap-1 flex-1 ${
                      align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className={isCompactMode ? 'text-xs' : ''}>{column.label}</span>
                      {sortConfig.key === column.id && (
                        <span className="text-xs text-ocean-500">
                          {getSortIcon(column.id)}
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
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                {visibleColumnOrder.map((column) => {
                  const align = getColumnAlign(column.id);
                  return (
                    <TableCell 
                      key={column.id} 
                      className={`${isCompactMode ? 'py-1.5 px-2 text-xs' : 'py-2.5 px-4'} ${
                        align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
                      }`}
                      style={{
                        width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                        minWidth: '80px'
                      }}
                    >
                      {renderCell ? renderCell(row[column.id], column.id, row) : row[column.id]}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PerformanceTable;
