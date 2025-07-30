
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingDown, Users, DollarSign, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import { HelpTooltip } from '@/components';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface CustomerChurnReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const CustomerChurnReport: React.FC<CustomerChurnReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real customer churn data from Supabase
  const { data: churnData, isLoading, error } = useQuery({
    queryKey: ['customer-churn', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getCustomerChurnData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'customerName', label: 'Customer', sortable: true, resizable: true },
    { id: 'email', label: 'Email', sortable: true, resizable: true },
    { id: 'cancellationReason', label: 'Cancellation Reason', sortable: true, resizable: true },
    { id: 'mrrLost', label: 'MRR Lost', sortable: true, resizable: true },
    { id: 'tenure', label: 'Tenure (months)', sortable: true, resizable: true },
    { id: 'cancellationDate', label: 'Cancellation Date', sortable: true, resizable: true }
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
    storageKey: 'customer-churn-table-columns'
  });

  // Extract data with safe defaults
  const {
    monthlyChurnData = {
      churnRate: 0,
      churnedMRR: 0,
      previousMonthChurnRate: 0,
      previousMonthChurnedMRR: 0
    },
    churnedCustomers = []
  } = churnData || {};

  // Initialize sorting functionality - must be called before any conditional returns
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: churnedCustomers || [],
    initialSort: undefined
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading customer churn data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading customer churn data</div>;
  }

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'Price too high':
        return 'red';
      case 'Switching to competitor':
        return 'orange';
      case 'No longer needed':
        return 'neutral';
      case 'Budget cuts':
        return 'yellow';
      case 'Poor customer service':
        return 'purple';
      default:
        return 'neutral';
    }
  };

  // Handle column resizing - MOVED TO TOP LEVEL
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

  // Handle sorting - MOVED TO TOP LEVEL
  const handleSort = (columnKey: string) => {
    const dataType = getDataTypeFromColumn(columnKey);
    requestSort(columnKey, dataType);
  };

  // Render cell content - MOVED TO TOP LEVEL
  const renderCellContent = (customer: any, columnId: string) => {
    switch (columnId) {
      case 'customerName':
        return (
          <div>
            <div className="font-medium text-gray-900">{customer.customerName}</div>
            <div className="text-xs text-gray-500">ID: {customer.id}</div>
          </div>
        );
      case 'email':
        return <span className="text-gray-600">{customer.email}</span>;
      case 'cancellationReason':
        return (
          <Badge variant={getReasonColor(customer.cancellationReason) as any}>
            {customer.cancellationReason}
          </Badge>
        );
      case 'mrrLost':
        return <span className="font-medium text-red-600">${customer.mrrLost}</span>;
      case 'tenure':
        return (
          <div className="flex items-center justify-end">
            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
            <span className="text-gray-700">{customer.tenure}</span>
          </div>
        );
      case 'cancellationDate':
        return <span className="text-gray-600">{customer.cancellationDate}</span>;
      default:
        return '';
    }
  };

  const churnRateChange = monthlyChurnData.churnRate - monthlyChurnData.previousMonthChurnRate;
  const mrrChange = monthlyChurnData.churnedMRR - monthlyChurnData.previousMonthChurnedMRR;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="space-y-6 animate-fade-in">
        {/* Dashboard Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card size="large" className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                Monthly Churn Rate
                <HelpTooltip helpId="monthly-churn-rate" />
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{monthlyChurnData.churnRate}%</div>
              <p className="text-xs text-muted-foreground">
                {churnRateChange > 0 ? '+' : ''}{churnRateChange.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>

          <Card size="large" className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                Churned MRR
                <HelpTooltip helpId="churned-mrr" />
              </CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${monthlyChurnData.churnedMRR.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {mrrChange > 0 ? '+' : ''}${mrrChange.toLocaleString()} from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Churned Customers Table */}
        <Card size="large" className="bg-white">
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="flex items-center text-ocean-800 gap-2">
                <Users className="w-5 h-5 mr-2" />
                Churned Customers This Month
                <HelpTooltip helpId="churned-customers-this-month" />
              </CardTitle>
            </div>
            <CardDescription>
              Detailed breakdown of customers who cancelled their subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['mrrLost', 'tenure'].includes(column.id);
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
                {sortedData.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['mrrLost', 'tenure'].includes(column.id);
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
            
            {/* Summary */}
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Customers Churned:</span>
                  <span className="ml-2 font-semibold text-red-600">{churnedCustomers.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total MRR Lost:</span>
                  <span className="ml-2 font-semibold text-red-600">
                    ${churnedCustomers.reduce((sum, customer) => sum + customer.mrrLost, 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Avg. Customer Tenure:</span>
                  <span className="ml-2 font-semibold text-red-600">
                    {Math.round(churnedCustomers.reduce((sum, customer) => sum + customer.tenure, 0) / churnedCustomers.length)} months
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerChurnReport;
