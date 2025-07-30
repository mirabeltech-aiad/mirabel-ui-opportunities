
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CrossSellCustomer } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface CrossSellCustomerJourneyProps {
  data: CrossSellCustomer[];
}

const CrossSellCustomerJourney: React.FC<CrossSellCustomerJourneyProps> = ({ data }) => {
  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'customerName', label: 'Customer', sortable: true, resizable: true },
    { id: 'initialProduct', label: 'Initial Product', sortable: true, resizable: true },
    { id: 'initialDate', label: 'Initial Date', sortable: true, resizable: true },
    { id: 'crossSellProducts', label: 'Cross-sell Products', sortable: false, resizable: true },
    { id: 'totalProducts', label: 'Total Products', sortable: true, resizable: true },
    { id: 'segment', label: 'Segment', sortable: true, resizable: true }
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
    storageKey: 'cross-sell-customer-journey-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data,
    initialSort: { key: 'totalProducts', direction: 'desc', dataType: 'number' }
  });

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

  const renderCellContent = (customer: CrossSellCustomer, columnId: string) => {
    switch (columnId) {
      case 'customerName':
        return <span className="font-medium text-gray-900">{customer.customerName}</span>;
      case 'initialProduct':
        return <span className="text-gray-900">{customer.initialProduct}</span>;
      case 'initialDate':
        return <span className="text-gray-900">{customer.initialDate}</span>;
      case 'crossSellProducts':
        return customer.crossSellProducts.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {customer.crossSellProducts.map((product, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {product}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">None</span>
        );
      case 'totalProducts':
        return (
          <Badge variant={customer.totalProducts > 1 ? "green" : "blue"}>
            {customer.totalProducts}
          </Badge>
        );
      case 'segment':
        return <Badge variant="outline">{customer.segment}</Badge>;
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Customer Cross-sell Journey</CardTitle>
          <HelpTooltip helpId="cross-sell-customer-journey" />
        </div>
        <CardDescription>Individual customer product adoption timelines</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['totalProducts'].includes(column.id);
                  return (
                    <TableHead
                      key={column.id}
                      className={`relative font-medium text-muted-foreground select-none h-11 py-2.5 px-4 ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                      } ${isRightAligned ? 'text-right' : 'text-left'}`}
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
              {sortedData.map((customer) => (
                <TableRow key={customer.customerId} className="hover:bg-gray-50 transition-colors duration-200">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['totalProducts'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {renderCellContent(customer, column.id)}
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

export default CrossSellCustomerJourney;
