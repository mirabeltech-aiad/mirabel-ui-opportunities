
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ExpansionDeal } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface ExpansionDealsTableProps {
  data: ExpansionDeal[];
}

const ExpansionDealsTable: React.FC<ExpansionDealsTableProps> = ({ data }) => {
  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'dealId', label: 'Deal ID', sortable: false, resizable: true },
    { id: 'customerName', label: 'Customer', sortable: true, resizable: true },
    { id: 'expansionType', label: 'Type', sortable: true, resizable: true },
    { id: 'investment', label: 'Investment', sortable: true, resizable: true },
    { id: 'monthlyRevenue', label: 'Monthly Revenue', sortable: true, resizable: true },
    { id: 'paybackMonths', label: 'Payback Period', sortable: true, resizable: true },
    { id: 'currentROI', label: 'Current ROI', sortable: true, resizable: true },
    { id: 'status', label: 'Status', sortable: true, resizable: true }
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
    storageKey: 'expansion-deals-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data,
    initialSort: { key: 'currentROI', direction: 'desc', dataType: 'percentage' }
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'positive roi': return 'green';
      case 'payback pending': return 'orange';
      default: return 'secondary';
    }
  };

  const getROIColor = (roi: number) => {
    if (roi >= 100) return 'text-green-600';
    if (roi >= 50) return 'text-yellow-600';
    return 'text-red-600';
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

  const renderCellContent = (deal: ExpansionDeal, columnId: string, index: number) => {
    switch (columnId) {
      case 'dealId':
        return <span className="font-medium">EXP{String(index + 1).padStart(3, '0')}</span>;
      case 'customerName':
        return <span>{deal.customerName}</span>;
      case 'expansionType':
        return <span>{deal.expansionType}</span>;
      case 'investment':
        return <span>${deal.investment.toLocaleString()}</span>;
      case 'monthlyRevenue':
        return <span>${deal.monthlyRevenue.toLocaleString()}</span>;
      case 'paybackMonths':
        return <span>{deal.paybackMonths} months</span>;
      case 'currentROI':
        return (
          <span className={`font-semibold ${getROIColor(deal.currentROI)}`}>
            {deal.currentROI}%
          </span>
        );
      case 'status':
        return (
          <Badge variant={getStatusBadgeVariant(deal.status)}>
            {deal.status}
          </Badge>
        );
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Individual Expansion Deals</CardTitle>
          <HelpTooltip helpId="expansion-deals-table" />
        </div>
        <CardDescription>Detailed analysis of individual expansion deals and their performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['investment', 'monthlyRevenue', 'paybackMonths', 'currentROI'].includes(column.id);
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
              {sortedData.map((deal, index) => (
                <TableRow key={`${deal.customerId}-${index}`} className="hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['investment', 'monthlyRevenue', 'paybackMonths', 'currentROI'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {renderCellContent(deal, column.id, index)}
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

export default ExpansionDealsTable;
