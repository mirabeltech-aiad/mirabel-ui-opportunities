
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AffinityMatrixItem } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface CrossSellAffinityMatrixProps {
  data: AffinityMatrixItem[];
}

const CrossSellAffinityMatrix: React.FC<CrossSellAffinityMatrixProps> = ({ data }) => {
  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'product', label: 'Product', sortable: true, resizable: true },
    { id: 'basicRate', label: 'Basic Plan Rate', sortable: true, resizable: true },
    { id: 'proRate', label: 'Professional Rate', sortable: true, resizable: true },
    { id: 'enterpriseRate', label: 'Enterprise Rate', sortable: true, resizable: true }
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
    storageKey: 'cross-sell-affinity-matrix-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data,
    initialSort: { key: 'enterpriseRate', direction: 'desc', dataType: 'percentage' }
  });

  const getBadgeVariant = (rate: number) => {
    if (rate >= 70) return 'green';    // High success rate
    if (rate >= 50) return 'blue';     // Good success rate
    if (rate >= 30) return 'yellow';   // Moderate success rate
    if (rate >= 15) return 'orange';   // Low success rate
    return 'red';                      // Very low success rate
  };

  const handleSort = (columnKey: string) => {
    const dataType = getDataTypeFromColumn(columnKey);
    requestSort(columnKey, dataType);
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

  const renderCellContent = (item: AffinityMatrixItem, columnId: string) => {
    switch (columnId) {
      case 'product':
        return <span className="font-medium text-gray-900">{item.product || 'Unknown Product'}</span>;
      case 'basicRate':
        return (
          <Badge variant={getBadgeVariant(item.basicRate || 0)}>
            {item.basicRate || 0}%
          </Badge>
        );
      case 'proRate':
        return (
          <Badge variant={getBadgeVariant(item.proRate || 0)}>
            {item.proRate || 0}%
          </Badge>
        );
      case 'enterpriseRate':
        return (
          <Badge variant={getBadgeVariant(item.enterpriseRate || 0)}>
            {item.enterpriseRate || 0}%
          </Badge>
        );
      default:
        return '';
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Product Affinity Matrix</CardTitle>
          <HelpTooltip helpId="product-affinity-matrix" />
        </div>
        <CardDescription>Cross-sell success rates by initial product type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['basicRate', 'proRate', 'enterpriseRate'].includes(column.id);
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
                        if (!e.defaultPrevented && column.sortable) {
                          handleSort(column.id);
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
                        {column.sortable && sortConfig.key === column.id && (
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
              {sortedData.map((item, index) => (
                <TableRow key={`${item.product || 'product'}-${index}`} className="hover:bg-gray-50 transition-colors duration-200">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['basicRate', 'proRate', 'enterpriseRate'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {renderCellContent(item, column.id)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
              {sortedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columnOrder.length} className="text-center text-gray-500 py-8">
                    No affinity matrix data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrossSellAffinityMatrix;
