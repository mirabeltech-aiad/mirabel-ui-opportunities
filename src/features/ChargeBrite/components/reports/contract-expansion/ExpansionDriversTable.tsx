import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface ExpansionDriversTableProps {
  data: any[];
}

const ExpansionDriversTable: React.FC<ExpansionDriversTableProps> = ({ data }) => {
  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'driver', label: 'Driver', sortable: true, resizable: true },
    { id: 'impact', label: 'Impact Score', sortable: true, resizable: true },
    { id: 'frequency', label: 'Frequency', sortable: true, resizable: true },
    { id: 'averageIncrease', label: 'Avg Increase', sortable: true, resizable: true }
  ];

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
    storageKey: 'expansion-drivers-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: data || [],
    initialSort: undefined
  });

  const getImpactColor = (impact: number) => {
    if (impact >= 0.8) return 'text-green-600';
    if (impact >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

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

  const renderCellContent = (driver: any, columnId: string) => {
    switch (columnId) {
      case 'driver':
        return <span className="font-medium">{driver.driver}</span>;
      case 'impact':
        const impactValue = driver.impact || (driver.percentage ? driver.percentage / 100 : 0);
        return (
          <span className={`font-semibold ${getImpactColor(impactValue)}`}>
            {driver.impact ? (driver.impact * 100).toFixed(1) : (driver.percentage ? driver.percentage.toFixed(1) : 0)}%
          </span>
        );
      case 'frequency':
        return driver.frequency || driver.count || 0;
      case 'averageIncrease':
        return `$${(driver.averageIncrease || driver.avgExpansion || 0).toLocaleString()}`;
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Expansion Drivers Analysis</CardTitle>
          <HelpTooltip helpId="expansion-drivers" />
        </div>
        <CardDescription>Analysis of factors driving contract expansions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['impact', 'frequency', 'averageIncrease'].includes(column.id);
                  return (
                    <TableHead
                      key={column.id}
                      className={`relative py-2.5 px-4 font-medium text-muted-foreground cursor-pointer hover:bg-gray-100 select-none h-11 ${
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
              {sortedData.map((driver, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['impact', 'frequency', 'averageIncrease'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {renderCellContent(driver, column.id)}
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

export default ExpansionDriversTable;