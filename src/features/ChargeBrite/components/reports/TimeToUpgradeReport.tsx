
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, Users, ArrowUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface TimeToUpgradeReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const TimeToUpgradeReport: React.FC<TimeToUpgradeReportProps> = ({ 
  dateRange, 
  selectedPeriod 
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real Time to Upgrade data from Supabase
  const { data: upgradeData, isLoading, error } = useQuery({
    queryKey: ['time-to-upgrade', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getTimeToUpgradeData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'customerName', label: 'Customer', sortable: true, resizable: true },
    { id: 'initialDate', label: 'Initial Date', sortable: true, resizable: true },
    { id: 'upgradeDate', label: 'Upgrade Date', sortable: true, resizable: true },
    { id: 'daysToUpgrade', label: 'Days to Upgrade', sortable: true, resizable: true },
    { id: 'initialPlan', label: 'Initial Plan', sortable: true, resizable: true },
    { id: 'upgradedPlan', label: 'Upgraded Plan', sortable: true, resizable: true },
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
    storageKey: 'time-to-upgrade-journey-columns'
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading Time to Upgrade data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading Time to Upgrade data</div>;
  }

  const {
    upgradeJourneyData = [],
    averageTimeToUpgrade = 0,
    totalCustomersUpgraded = 0,
    fastestUpgrade = 0,
    slowestUpgrade = 0,
    upgradeRate = 74,
    timeDistributionData = [],
    trendData = [],
    segmentData = []
  } = upgradeData || {};

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: upgradeJourneyData,
    initialSort: { key: 'daysToUpgrade', direction: 'asc', dataType: 'number' }
  });

  // Helper function to get proper badge variant for days to upgrade
  const getDaysToUpgradeBadge = (days: number) => {
    if (days <= 30) return 'green'; // Fast upgrade - success
    if (days <= 60) return 'blue'; // Medium upgrade - informational
    if (days <= 90) return 'yellow'; // Slow upgrade - warning
    return 'red'; // Very slow upgrade - attention needed
  };

  // Helper function to get segment badge variant
  const getSegmentBadge = (segment: string) => {
    switch (segment?.toLowerCase()) {
      case 'startup':
        return 'purple'; // Key milestone
      case 'smb':
        return 'blue'; // Standard business
      case 'enterprise':
        return 'green'; // Premium tier
      default:
        return 'outline'; // Default
    }
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

  const renderCellContent = (customer: any, columnId: string) => {
    switch (columnId) {
      case 'customerName':
        return <span className="font-medium text-gray-900">{customer.customerName}</span>;
      case 'initialDate':
        return <span className="text-gray-900">{customer.initialDate}</span>;
      case 'upgradeDate':
        return <span className="text-gray-900">{customer.upgradeDate}</span>;
      case 'daysToUpgrade':
        return (
          <Badge variant={getDaysToUpgradeBadge(customer.daysToUpgrade)}>
            {customer.daysToUpgrade} days
          </Badge>
        );
      case 'initialPlan':
        return <span className="text-gray-900">{customer.initialPlan}</span>;
      case 'upgradedPlan':
        return <span className="text-gray-900">{customer.upgradedPlan}</span>;
      case 'segment':
        return <Badge variant={getSegmentBadge(customer.segment)}>{customer.segment}</Badge>;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Average Time to Upgrade</CardTitle>
              <HelpTooltip helpId="avg-time-to-upgrade" />
            </div>
            <Clock className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{averageTimeToUpgrade} days</div>
            <p className="text-xs text-rose-300">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                5% faster than last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Customers Upgraded</CardTitle>
              <HelpTooltip helpId="customers-upgraded" />
            </div>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalCustomersUpgraded}</div>
            <p className="text-xs text-purple-300">
              This period
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Fastest Upgrade</CardTitle>
              <HelpTooltip helpId="fastest-upgrade" />
            </div>
            <ArrowUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fastestUpgrade} days</div>
            <p className="text-xs text-green-300">
              Quick Upgrade LLC
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Upgrade Rate</CardTitle>
              <HelpTooltip helpId="upgrade-rate" />
            </div>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upgradeRate}%</div>
            <p className="text-xs text-blue-300">
              Of customers eventually upgrade
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Distribution Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Time to Upgrade Distribution</CardTitle>
              <HelpTooltip helpId="time-distribution-chart" />
            </div>
            <CardDescription>How customers are distributed across upgrade timeframes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend Over Time */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Average Time to Upgrade Trend</CardTitle>
              <HelpTooltip helpId="upgrade-trend-chart" />
            </div>
            <CardDescription>Monthly trend showing upgrade timing patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => [`${value} days`, 'Average Days']} />
                <Line type="monotone" dataKey="avgDays" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Segment Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Upgrade Timing by Customer Segment</CardTitle>
            <HelpTooltip helpId="segment-upgrade-analysis" />
          </div>
          <CardDescription>Compare upgrade patterns across different customer types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {segmentData.map((segment, index) => {
              const configs = [
                { 
                  number: 'text-purple-600', 
                  subtitle: 'text-purple-500', 
                  badge: 'purple',
                  icon: 'text-purple-500'
                },
                { 
                  number: 'text-green-600', 
                  subtitle: 'text-green-500', 
                  badge: 'green',
                  icon: 'text-green-500'
                },
                { 
                  number: 'text-blue-600', 
                  subtitle: 'text-blue-500', 
                  badge: 'blue',
                  icon: 'text-blue-500'
                }
              ];
              const config = configs[index % configs.length];
              
              return (
                <div key={segment.segment} className="text-center p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="text-lg font-semibold text-black">{segment.segment}</div>
                  <div className={`text-2xl font-bold ${config.number}`}>{segment.avgDays} days</div>
                  <div className={`text-sm ${config.subtitle} mb-2`}>{segment.count} customers</div>
                  <Badge variant={config.badge as any}>
                    {segment.upgradeRate}% upgrade rate
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Customer Upgrade Journey Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Customer Upgrade Journey Details</CardTitle>
            <HelpTooltip helpId="upgrade-journey-table" />
          </div>
          <CardDescription>Individual customer upgrade timelines and patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['daysToUpgrade'].includes(column.id);
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
                      const isRightAligned = ['daysToUpgrade'].includes(column.id);
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

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Key Insights</CardTitle>
            <HelpTooltip helpId="upgrade-insights" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700">
                <strong>Startup customers upgrade fastest:</strong> Average of 34 days compared to 111 days for Enterprise customers
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700">
                <strong>37.5% of customers upgrade within 30 days</strong> of their initial subscription
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700">
                <strong>Upgrade timing is improving:</strong> Average time to upgrade has decreased by 5% this month
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700">
                <strong>Enterprise customers take longer but have steady upgrade patterns</strong> with higher contract values
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeToUpgradeReport;
