
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Clock, Calendar, Users } from 'lucide-react';
import { HelpTooltip } from '../../components';
import { useTableColumnManager } from '../../hooks/useTableColumnManager';
import { useSorting } from '../../hooks/useSorting';
import { getDataTypeFromColumn } from '../../utils/sortingUtils';

const SubscriptionAgingReport = () => {
  // Mock aging data
  const agingMetrics = {
    expiring30Days: 2,
    expiring60Days: 1,
    expiring90Days: 2,
    totalExpiring: 5
  };

  const agingBuckets = [
    { period: '0-30 days', count: 2, autoRenew: 1, manual: 1, percentage: 40.0 },
    { period: '31-60 days', count: 1, autoRenew: 1, manual: 0, percentage: 20.0 },
    { period: '61-90 days', count: 2, autoRenew: 1, manual: 1, percentage: 40.0 }
  ];

  const subscriptionDetails = [
    {
      id: 'sub_001',
      customerName: 'John Smith',
      product: 'Daily Herald',
      startDate: '2023-01-15',
      expirationDate: '2024-07-15',
      daysUntilExpiry: 15,
      autoRenew: true,
      status: 'Active'
    },
    {
      id: 'sub_002',
      customerName: 'Jane Doe',
      product: 'Business Weekly',
      startDate: '2023-08-20',
      expirationDate: '2024-08-20',
      daysUntilExpiry: 51,
      autoRenew: false,
      status: 'Active'
    },
    {
      id: 'sub_003',
      customerName: 'Bob Johnson',
      product: 'Tech Digest',
      startDate: '2023-09-10',
      expirationDate: '2024-09-10',
      daysUntilExpiry: 72,
      autoRenew: true,
      status: 'Active'
    }
  ];

  // Define table columns for drag-and-drop functionality
  const tableColumns = useMemo(() => [
    { id: 'customerName', label: 'Customer', sortable: true, resizable: true },
    { id: 'product', label: 'Product', sortable: true, resizable: true },
    { id: 'startDate', label: 'Start Date', sortable: true, resizable: true },
    { id: 'expirationDate', label: 'Expiration Date', sortable: true, resizable: true },
    { id: 'daysUntilExpiry', label: 'Days Until Expiry', sortable: true, resizable: true },
    { id: 'autoRenew', label: 'Auto-Renew', sortable: true, resizable: true },
    { id: 'status', label: 'Status', sortable: true, resizable: true }
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
    storageKey: 'subscription-aging-details-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: subscriptionDetails,
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
      case 'customerName':
        return <span className="font-medium">{subscription.customerName}</span>;
      case 'product':
        return subscription.product;
      case 'startDate':
        return subscription.startDate;
      case 'expirationDate':
        return subscription.expirationDate;
      case 'daysUntilExpiry':
        return (
          <Badge variant={
            subscription.daysUntilExpiry <= 30 
              ? 'destructive' 
              : subscription.daysUntilExpiry <= 60 
                ? 'secondary' 
                : 'outline'
          }>
            {subscription.daysUntilExpiry} days
          </Badge>
        );
      case 'autoRenew':
        return (
          <Badge variant={subscription.autoRenew ? 'default' : 'destructive'}>
            {subscription.autoRenew ? 'Yes' : 'No'}
          </Badge>
        );
      case 'status':
        return <Badge variant="default">{subscription.status}</Badge>;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
                Expiring in 30 Days
                <HelpTooltip helpId="expiring-30-days" />
              </CardTitle>
            </div>
            <AlertTriangle className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 mb-1">{agingMetrics.expiring30Days}</div>
            <p className="text-xs text-gray-600">1 auto-renew, 1 manual</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
                Expiring in 60 Days
                <HelpTooltip helpId="expiring-60-days" />
              </CardTitle>
            </div>
            <Clock className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">{agingMetrics.expiring60Days}</div>
            <p className="text-xs text-gray-600">1 auto-renew, 0 manual</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
                Expiring in 90 Days
                <HelpTooltip helpId="expiring-90-days" />
              </CardTitle>
            </div>
            <Calendar className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{agingMetrics.expiring90Days}</div>
            <p className="text-xs text-gray-600">1 auto-renew, 1 manual</p>
          </CardContent>
        </Card>
      </div>

      {/* Aging Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            Expiration Timeline Distribution
            <HelpTooltip helpId="expiration-timeline-distribution" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agingBuckets}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="autoRenew" stackId="a" fill="#10b981" name="Auto-Renew" />
              <Bar dataKey="manual" stackId="a" fill="#f59e0b" name="Manual Renewal" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subscription Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            Subscription Aging Details
            <HelpTooltip helpId="subscription-aging-details" />
          </CardTitle>
        </CardHeader>
        <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['daysUntilExpiry'].includes(column.id);
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
              {sortedData.map((subscription) => (
                <TableRow key={subscription.id} className="hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['daysUntilExpiry'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 text-sm ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {renderCellContent(subscription, column.id)}
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
    </div>
  );
};

export default SubscriptionAgingReport;
