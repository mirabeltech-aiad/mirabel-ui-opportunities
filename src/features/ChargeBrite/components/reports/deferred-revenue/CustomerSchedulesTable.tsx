
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface CustomerSchedule {
  id: string;
  customerName: string;
  email: string;
  contractLength: number;
  contractStart: string;
  contractEnd: string;
  totalContractValue: number;
  deferredAmount: number;
  recognizedAmount: number;
  monthlyRecognition: number;
  status: string;
}

interface CustomerSchedulesTableProps {
  data: CustomerSchedule[];
}

const CustomerSchedulesTable: React.FC<CustomerSchedulesTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'customerName', label: 'Customer', sortable: true, resizable: true },
    { id: 'contractLength', label: 'Contract Length', sortable: true, resizable: true },
    { id: 'contractEnd', label: 'Contract End', sortable: true, resizable: true },
    { id: 'totalContractValue', label: 'Total Value', sortable: true, resizable: true },
    { id: 'deferredAmount', label: 'Deferred', sortable: true, resizable: true },
    { id: 'recognizedAmount', label: 'Recognized', sortable: true, resizable: true },
    { id: 'monthlyRecognition', label: 'Monthly', sortable: true, resizable: true },
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
    storageKey: 'customer-schedules-columns'
  });

  // Filter data based on search term
  const filteredData = data.filter(customer => 
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: filteredData,
    initialSort: { key: 'customerName', direction: 'asc', dataType: 'string' }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const renderCellContent = (customer: CustomerSchedule, columnId: string) => {
    switch (columnId) {
      case 'customerName':
        return (
          <div>
            <div className="font-medium text-gray-900">{customer.customerName}</div>
            <div className="text-sm text-gray-500">{customer.email}</div>
          </div>
        );
      case 'contractLength':
        return <span className="text-gray-900">{customer.contractLength} months</span>;
      case 'contractEnd':
        return <span className="text-gray-900">{new Date(customer.contractEnd).toLocaleDateString()}</span>;
      case 'totalContractValue':
        return <span className="font-medium text-gray-900">{formatCurrency(customer.totalContractValue)}</span>;
      case 'deferredAmount':
        return <span className="text-blue-600 font-medium">{formatCurrency(customer.deferredAmount)}</span>;
      case 'recognizedAmount':
        return <span className="text-green-600 font-medium">{formatCurrency(customer.recognizedAmount)}</span>;
      case 'monthlyRecognition':
        return <span className="text-gray-900">{formatCurrency(customer.monthlyRecognition)}</span>;
      case 'status':
        return (
          <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
            {customer.status}
          </Badge>
        );
      default:
        return '';
    }
  };

  return (
    <Card className="bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Customer Revenue Schedules</CardTitle>
          <HelpTooltip helpId="customer-schedules-table" />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['totalContractValue', 'deferredAmount', 'recognizedAmount', 'monthlyRecognition'].includes(column.id);
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
                <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors duration-200">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['totalContractValue', 'deferredAmount', 'recognizedAmount', 'monthlyRecognition'].includes(column.id);
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

export default CustomerSchedulesTable;
