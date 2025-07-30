
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface ConversionBySourceTableProps {
  conversionBySource: Array<{
    source: string;
    trials: number;
    conversions: number;
    conversionRate: number;
    averageTime: number;
  }>;
}

const ConversionBySourceTable: React.FC<ConversionBySourceTableProps> = ({ conversionBySource }) => {
  // Define table columns for drag-and-drop functionality
  const tableColumns = useMemo(() => [
    { id: 'source', label: 'Traffic Source', sortable: true, resizable: true },
    { id: 'trials', label: 'Trial Starts', sortable: true, resizable: true },
    { id: 'conversions', label: 'Conversions', sortable: true, resizable: true },
    { id: 'conversionRate', label: 'Conversion Rate', sortable: true, resizable: true },
    { id: 'averageTime', label: 'Avg Time to Convert', sortable: true, resizable: true }
  ], []);

  // Initialize table column management
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
    storageKey: 'conversion-by-source-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: conversionBySource,
    initialSort: undefined
  });

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

  // Render cell content
  const renderCellContent = (source: any, columnId: string) => {
    switch (columnId) {
      case 'source':
        return <span className="font-medium">{source.source}</span>;
      case 'trials':
        return source.trials.toLocaleString();
      case 'conversions':
        return source.conversions.toLocaleString();
      case 'conversionRate':
        return (
          <Badge variant={
            source.conversionRate >= 30 ? 'default' :
            source.conversionRate >= 20 ? 'secondary' : 'destructive'
          }>
            {source.conversionRate.toFixed(1)}%
          </Badge>
        );
      case 'averageTime':
        return `${source.averageTime} days`;
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            <Target className="w-5 h-5 mr-2" />
            Conversion Performance by Source
            <HelpTooltip helpId="trial-conversion-by-source" />
          </CardTitle>
        </div>
        <CardDescription>Trial conversion rates broken down by traffic source</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['trials', 'conversions', 'conversionRate', 'averageTime'].includes(column.id);
                  return (
                    <TableHead
                      key={column.id}
                      className={`relative cursor-pointer hover:bg-gray-100 font-medium text-muted-foreground select-none h-11 py-2.5 px-4 ${
                        isRightAligned ? 'text-right' : 'text-left'
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
                        cursor: draggedColumn === column.id ? 'grabbing' : 'grab'
                      }}
                    >
                      <div className={`flex items-center gap-1 flex-1 ${
                        isRightAligned ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{column.label}</span>
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
              {sortedData.map((source, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['trials', 'conversions', 'conversionRate', 'averageTime'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 text-sm ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {renderCellContent(source, column.id)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionBySourceTable;
