
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/enhanced-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Clock, Calendar, FileText } from 'lucide-react';
import HelpTooltip from '../../../components/shared/HelpTooltip';
import { useTableColumnManager } from '../../../hooks/useTableColumnManager';
import { useSorting } from '../../../hooks/useSorting';
import { getDataTypeFromColumn } from '../../../utils/sortingUtils';

interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  type: string;
  term: string;
  autoRenew: boolean;
  region: string;
  expirationDate: string;
  daysUntilExpiry: number;
}

interface ExpirationDetailsTableProps {
  subscriptions: Subscription[];
}

const ExpirationDetailsTable: React.FC<ExpirationDetailsTableProps> = ({ subscriptions }) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const getUrgencyColor = (days: number) => {
    if (days <= 30) return 'text-red-600 bg-red-50';
    if (days <= 60) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getUrgencyIcon = (days: number) => {
    if (days <= 30) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (days <= 60) return <Clock className="h-4 w-4 text-orange-600" />;
    return <Calendar className="h-4 w-4 text-yellow-600" />;
  };

  const getTypeBadgeVariant = (type: string) => {
    return type === 'both' ? 'green' : 'blue';
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleRowClick = (e: React.MouseEvent, id: string) => {
    if ((e.target as Element).closest('input, button, select, a, [role="button"], [role="checkbox"]')) {
      return;
    }
    
    const isSelected = selectedRows.has(id);
    handleRowSelect(id, !isSelected);
  };

  const handleRowDoubleClick = (e: React.MouseEvent, subscription: Subscription) => {
    if ((e.target as Element).closest('input, button, select, a, [role="button"], [role="checkbox"]')) {
      return;
    }
    
    // Handle edit subscription functionality
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCustomerClick = (e: React.MouseEvent, customerName: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle view customer details functionality
  };

  // Define table columns for drag-and-drop functionality
  const tableColumns = useMemo(() => [
    { id: 'checkbox', label: '', sortable: false, resizable: false },
    { id: 'status', label: 'Status', sortable: false, resizable: true },
    { id: 'id', label: 'Subscriber ID', sortable: true, resizable: true },
    { id: 'customerName', label: 'Customer Name', sortable: true, resizable: true },
    { id: 'productName', label: 'Product', sortable: true, resizable: true },
    { id: 'type', label: 'Format', sortable: true, resizable: true },
    { id: 'term', label: 'Term', sortable: true, resizable: true },
    { id: 'autoRenew', label: 'Auto-Renew', sortable: true, resizable: true },
    { id: 'region', label: 'Region', sortable: true, resizable: true },
    { id: 'expirationDate', label: 'Expiration Date', sortable: true, resizable: true },
    { id: 'daysUntilExpiry', label: 'Days Until Expiry', sortable: true, resizable: true }
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
    storageKey: 'expiration-details-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: subscriptions,
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
  const renderCellContent = (subscription: any, columnId: string) => {
    switch (columnId) {
      case 'checkbox':
        const isSelected = selectedRows.has(subscription.id);
        return (
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => handleRowSelect(subscription.id, checked as boolean)}
            onClick={handleCheckboxClick}
            className="focus:ring-ocean-500"
            aria-label={`Select subscription ${subscription.id}`}
          />
        );
      case 'status':
        return getUrgencyIcon(subscription.daysUntilExpiry);
      case 'id':
        return <span className="font-mono text-xs text-gray-900">{subscription.id}</span>;
      case 'customerName':
        return (
          <button
            className="text-left font-medium cursor-pointer hover:text-ocean-600 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-1 rounded-sm px-1 text-gray-900"
            onClick={(e) => handleCustomerClick(e, subscription.customerName)}
            title="Click to view customer details"
            aria-label={`View details for ${subscription.customerName}`}
          >
            {subscription.customerName}
          </button>
        );
      case 'productName':
        return <span className="text-gray-900">{subscription.productName}</span>;
      case 'type':
        return (
          <Badge variant={getTypeBadgeVariant(subscription.type)}>
            {subscription.type}
          </Badge>
        );
      case 'term':
        return <span className="text-gray-900">{subscription.term}</span>;
      case 'autoRenew':
        return (
          <Badge variant={subscription.autoRenew ? "green" : "red"}>
            {subscription.autoRenew ? "Yes" : "No"}
          </Badge>
        );
      case 'region':
        return <span className="text-gray-900">{subscription.region}</span>;
      case 'expirationDate':
        return <span className="text-gray-900">{subscription.expirationDate}</span>;
      case 'daysUntilExpiry':
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(subscription.daysUntilExpiry)}`}>
            {subscription.daysUntilExpiry} days
          </span>
        );
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-ocean-800 flex items-center gap-1">
          <FileText className="h-5 w-5 mr-1" />
          Detailed Expiration List
          <HelpTooltip helpId="expiration-details-table" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['daysUntilExpiry'].includes(column.id);
                  const isCheckboxColumn = column.id === 'checkbox';
                  return (
                    <TableHead
                      key={column.id}
                      className={`relative font-medium text-muted-foreground select-none h-11 py-2.5 px-4 ${
                        isCheckboxColumn ? 'w-8' : ''
                      } ${
                        isRightAligned ? 'text-right' : 'text-left'
                      } ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                      }`}
                      draggable={column.id !== 'checkbox'}
                      onDragStart={column.id !== 'checkbox' ? (e) => handleDragStart(e, column.id) : undefined}
                      onDragOver={column.id !== 'checkbox' ? (e) => handleDragOver(e, column.id) : undefined}
                      onDragEnd={column.id !== 'checkbox' ? handleDragEnd : undefined}
                      onClick={(e) => {
                        if (!e.defaultPrevented && column.sortable) {
                          const dataType = getDataTypeFromColumn(column.id);
                          requestSort(column.id, dataType);
                        }
                      }}
                      style={{
                        width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                        minWidth: isCheckboxColumn ? '40px' : '80px',
                        cursor: draggedColumn === column.id ? 'grabbing' : (column.id !== 'checkbox' ? 'grab' : 'default')
                      }}
                    >
                      <div className={`flex items-center gap-1 flex-1 ${
                        isRightAligned ? 'justify-end' : 'justify-start'
                      }`}>
                        {column.label && <span>{column.label}</span>}
                        {column.sortable && sortConfig.key === column.id && (
                          <span className="text-xs text-ocean-500">
                            {getSortIcon(column.id)}
                          </span>
                        )}
                      </div>
                      {column.resizable && column.id !== 'checkbox' && (
                        <div 
                          className="absolute right-0 top-0 h-full w-4 cursor-col-resize group"
                          onMouseDown={(e) => startResizing(e, column.id)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="h-full w-1 bg-ocean-300 opacity-0 group-hover:opacity-100 mx-auto"></div>
                        </div>
                      )}
                      {draggedColumn === column.id && (
                        <div className="absolute inset-0 bg-ocean-100 opacity-30 border-2 border-ocean-400 rounded pointer-events-none"></div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((subscription) => {
                const isSelected = selectedRows.has(subscription.id);
                return (
                  <TableRow 
                    key={subscription.id} 
                    className={`cursor-pointer transition-colors duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 hover:bg-blue-100 border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={(e) => handleRowClick(e, subscription.id)}
                    onDoubleClick={(e) => handleRowDoubleClick(e, subscription)}
                    title="Click to select, double-click to edit"
                    tabIndex={0}
                    role="row"
                    aria-selected={isSelected}
                  >
                    {columnOrder.map((column) => {
                      const isRightAligned = ['daysUntilExpiry'].includes(column.id);
                      const isCheckboxColumn = column.id === 'checkbox';
                      return (
                        <TableCell 
                          key={column.id} 
                          className={`py-2.5 px-4 text-sm ${
                            isCheckboxColumn ? 'w-8' : ''
                          } ${
                            isRightAligned ? 'text-right' : ''
                          }`}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: isCheckboxColumn ? '40px' : '80px'
                          }}
                        >
                          {renderCellContent(subscription, column.id)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpirationDetailsTable;
