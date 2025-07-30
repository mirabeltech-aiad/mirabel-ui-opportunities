
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HighValueChurn } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';

interface HighValueChurnTableProps {
  data: HighValueChurn[];
}

const HighValueChurnTable: React.FC<HighValueChurnTableProps> = ({ data }) => {
  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'customer', label: 'Customer', sortable: true, resizable: true },
    { id: 'mrrLost', label: 'Monthly MRR', sortable: true, resizable: true },
    { id: 'churnDate', label: 'Churn Date', sortable: true, resizable: true },
    { id: 'reason', label: 'Churn Reason', sortable: true, resizable: true },
    { id: 'recoveryOpportunity', label: 'Recovery Risk', sortable: true, resizable: true },
    { id: 'tenure', label: 'Tenure', sortable: true, resizable: true }
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
    storageKey: 'high-value-churn-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: data || [],
    initialSort: undefined
  });

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

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'orange';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">High-Value Customer Churn</CardTitle>
          <HelpTooltip helpId="high-value-churn" />
        </div>
        <CardDescription>Recently churned customers with highest revenue impact</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['mrrLost', 'tenure'].includes(column.id);
                  return (
                    <th
                      key={column.id}
                      className={`relative py-2.5 px-4 font-medium text-muted-foreground cursor-pointer hover:bg-gray-100 select-none ${
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
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((customer) => (
                <tr key={customer.customerId} className="border-b hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['mrrLost', 'tenure'].includes(column.id);
                    return (
                      <td 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {column.id === 'customer' && (
                          <span className="font-medium">{customer.customerName}</span>
                        )}
                        {column.id === 'mrrLost' && `$${customer.mrrLost.toLocaleString()}`}
                        {column.id === 'churnDate' && customer.churnDate}
                        {column.id === 'reason' && (
                          <span className="max-w-xs truncate block">{customer.reason}</span>
                        )}
                        {column.id === 'recoveryOpportunity' && (
                          <Badge variant={getRiskBadgeVariant(customer.recoveryOpportunity)}>
                            {customer.recoveryOpportunity}
                          </Badge>
                        )}
                        {column.id === 'tenure' && `${customer.tenure} months`}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HighValueChurnTable;
