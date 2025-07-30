
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Gift, Users, DollarSign, TrendingUp, Search, Filter, Calendar, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface GiftSubscriptionsReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const GiftSubscriptionsReport: React.FC<GiftSubscriptionsReportProps> = ({ dateRange, selectedPeriod }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedConversion, setSelectedConversion] = useState('all');

  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'giftDetails', label: 'Gift Details', sortable: true, resizable: true },
    { id: 'purchaser', label: 'Purchaser', sortable: true, resizable: true },
    { id: 'recipient', label: 'Recipient', sortable: true, resizable: true },
    { id: 'subscription', label: 'Subscription', sortable: true, resizable: true },
    { id: 'giftPeriod', label: 'Gift Period', sortable: true, resizable: true },
    { id: 'activation', label: 'Activation', sortable: true, resizable: true },
    { id: 'conversion', label: 'Conversion', sortable: true, resizable: true },
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
    storageKey: 'gift-subscriptions-columns'
  });

  // Use React Query to fetch real gift subscription data from Supabase
  const { data: giftData, isLoading, error } = useQuery({
    queryKey: ['gift-subscriptions', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getGiftSubscriptionsData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  // Extract data with defaults to prevent undefined errors
  const {
    giftSummary = {
      totalGiftSubscriptions: 0,
      activeGifts: 0,
      convertedToReturning: 0,
      conversionRate: 0,
      totalGiftRevenue: 0,
      averageGiftValue: 0
    },
    conversionData = [],
    monthlyGiftTrends = [],
    subscriptionTypeBreakdown = [],
    giftSubscriptions = []
  } = giftData || {};

  // Initialize sorting functionality - always with safe data
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: giftSubscriptions,
    initialSort: { key: 'purchaseDate', direction: 'desc', dataType: 'date' }
  });

  // Early returns AFTER all hooks are defined
  if (isLoading) {
    return <div className="animate-fade-in">Loading gift subscriptions data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading gift subscriptions data</div>;
  }

  // Filter data based on search and filters
  const filteredData = sortedData.filter(gift => {
    const matchesSearch = gift.purchaserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gift.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gift.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || gift.giftStatus.toLowerCase() === selectedStatus.toLowerCase();
    const matchesConversion = selectedConversion === 'all' || 
                             (selectedConversion === 'converted' && gift.convertedToPaid) ||
                             (selectedConversion === 'not-converted' && !gift.convertedToPaid);
    
    return matchesSearch && matchesStatus && matchesConversion;
  });

  // Handle sorting
  const handleSort = (columnKey: string) => {
    const dataType = getDataTypeFromColumn(columnKey);
    requestSort(columnKey, dataType);
  };

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'Expired':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Expired</Badge>;
      case 'Converted':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Converted</Badge>;
      case 'Pending Activation':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'Active Gift':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Active Gift</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderCellContent = (gift: any, columnId: string) => {
    switch (columnId) {
      case 'giftDetails':
        return (
          <div>
            <div className="font-medium">{gift.id}</div>
            <div className="text-sm text-gray-600">${gift.giftValue}</div>
            <div className="text-xs text-gray-500">Purchased: {gift.purchaseDate}</div>
          </div>
        );
      case 'purchaser':
        return (
          <div>
            <div className="font-medium">{gift.purchaserName}</div>
            <div className="text-sm text-gray-600">{gift.purchaserEmail}</div>
          </div>
        );
      case 'recipient':
        return (
          <div>
            <div className="font-medium">{gift.recipientName}</div>
            <div className="text-sm text-gray-600">{gift.recipientEmail}</div>
          </div>
        );
      case 'subscription':
        return <div className="text-sm">{gift.subscriptionType}</div>;
      case 'giftPeriod':
        return (
          <div className="text-sm">
            <div>Start: {gift.giftStartDate}</div>
            <div>End: {gift.giftEndDate}</div>
          </div>
        );
      case 'activation':
        return gift.recipientActivated ? (
          <div className="text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <Check className="h-3 w-3" />
              Activated
            </div>
            <div className="text-xs text-gray-500">{gift.activationDate}</div>
          </div>
        ) : (
          <div className="text-sm">
            <div className="flex items-center gap-1 text-red-600">
              <X className="h-3 w-3" />
              Pending
            </div>
          </div>
        );
      case 'conversion':
        return gift.convertedToPaid ? (
          <div className="text-sm">
            <div className="flex items-center gap-1 text-blue-600">
              <Check className="h-3 w-3" />
              Converted
            </div>
            <div className="text-xs text-gray-500">{gift.conversionDate}</div>
            <div className="text-xs text-gray-500">{gift.renewalType}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Not converted
          </div>
        );
      case 'status':
        return getStatusBadge(gift.currentStatus);
      default:
        return '';
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Total Gift Subscriptions
              <HelpTooltip helpId="gift-total-subscriptions" />
            </CardTitle>
            <Gift className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{giftSummary.totalGiftSubscriptions.toLocaleString()}</div>
            <p className="text-xs text-gray-600">total subscriptions</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Active Gifts
              <HelpTooltip helpId="gift-active-gifts" />
            </CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">{giftSummary.activeGifts.toLocaleString()}</div>
            <p className="text-xs text-gray-600">currently active</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Conversion Rate
              <HelpTooltip helpId="gift-conversion-rate" />
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">{giftSummary.conversionRate}%</div>
            <p className="text-xs text-gray-600">gift to paid</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Gift Revenue
              <HelpTooltip helpId="gift-revenue" />
            </CardTitle>
            <DollarSign className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 mb-1">${(giftSummary.totalGiftRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-600">total revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-1">
              Gift Subscription Status
              <HelpTooltip helpId="gift-subscription-status" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, percentage }) => `${status}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Subscriptions']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {conversionData.map((item, index) => (
                <div key={item.status} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                    <span>{item.status}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.count.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-1">
              Monthly Gift Trends
              <HelpTooltip helpId="gift-monthly-trends" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyGiftTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="gifts" fill="#3b82f6" name="Gift Subscriptions" />
                  <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Type Breakdown */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            Gift Subscription Types
            <HelpTooltip helpId="gift-subscription-types" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionTypeBreakdown.map((type, index) => (
              <div key={type.type} className="p-4 border rounded-lg">
                <h4 className="font-medium text-lg mb-2">{type.type}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Count:</span>
                    <span className="font-medium">{type.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Value:</span>
                    <span className="font-medium">${type.avgValue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-ocean-800">Gift Subscription Details</CardTitle>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by purchaser, recipient, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={selectedConversion}
              onChange={(e) => setSelectedConversion(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Conversions</option>
              <option value="converted">Converted</option>
              <option value="not-converted">Not Converted</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['giftPeriod', 'activation', 'conversion'].includes(column.id);
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
                {filteredData.map((gift) => (
                  <TableRow key={gift.id} className="hover:bg-gray-50 transition-colors duration-200">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['giftPeriod', 'activation', 'conversion'].includes(column.id);
                      return (
                        <TableCell 
                          key={column.id} 
                          className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: '80px'
                          }}
                        >
                          {renderCellContent(gift, column.id)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No gift subscriptions found matching your search criteria.
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredData.length} of {giftSubscriptions.length} gift subscriptions
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-ocean-800">Gift Subscription Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800">High Conversion Success</h4>
                <p className="text-sm text-blue-700 mt-1">
                  37.4% of gift recipients convert to paid subscriptions, indicating strong gift satisfaction.
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">Popular Gift Choice</h4>
                <p className="text-sm text-green-700 mt-1">
                  Print + Digital subscriptions are the most popular gift option at 45.5% of all gifts.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800">Seasonal Patterns</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Gift purchases peak in December and February, correlating with holidays and Valentine's Day.
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800">Average Gift Value</h4>
                <p className="text-sm text-purple-700 mt-1">
                  The average gift subscription value is $71.92, with Print + Digital gifts averaging $94.50.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftSubscriptionsReport;
