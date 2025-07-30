
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface GrossNetChurnBreakdownReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const GrossNetChurnBreakdownReport: React.FC<GrossNetChurnBreakdownReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real gross/net churn breakdown data from Supabase
  const { data: churnData, isLoading, error } = useQuery({
    queryKey: ['gross-net-churn-breakdown', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getGrossNetChurnBreakdownData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'customerName', label: 'Customer Name', sortable: true, resizable: true },
    { id: 'churnDate', label: 'Churn Date', sortable: true, resizable: true },
    { id: 'reason', label: 'Reason', sortable: false, resizable: true },
    { id: 'mrrLost', label: 'MRR Lost', sortable: true, resizable: true },
    { id: 'segment', label: 'Segment', sortable: true, resizable: true },
    { id: 'daysActive', label: 'Days Active', sortable: true, resizable: true },
    { id: 'lastActivity', label: 'Last Activity', sortable: false, resizable: true }
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
    storageKey: 'churn-breakdown-columns'
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading gross & net churn breakdown data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading gross & net churn breakdown data</div>;
  }

  const {
    churnTrends = [],
    churnedAccounts = [],
    totalMrrLost = 0,
    currentGrossChurn = 0,
    currentNetChurn = 0
  } = churnData || {};

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: churnedAccounts,
    initialSort: { key: 'mrrLost', direction: 'desc', dataType: 'currency' }
  });

  // Calculate summary metrics from data
  const previousGrossChurn = churnTrends.length > 1 ? churnTrends[churnTrends.length - 2].grossChurn : currentGrossChurn;
  const previousNetChurn = churnTrends.length > 1 ? churnTrends[churnTrends.length - 2].netChurn : currentNetChurn;
  
  const grossChurnChange = currentGrossChurn - previousGrossChurn;
  const netChurnChange = currentNetChurn - previousNetChurn;
  
  const avgMrrLost = churnedAccounts.length > 0 ? totalMrrLost / churnedAccounts.length : 0;

  // Segment breakdown
  const segmentBreakdown = churnedAccounts.reduce((acc: Record<string, { count: number; mrrLost: number }>, account: any) => {
    if (!acc[account.segment]) {
      acc[account.segment] = { count: 0, mrrLost: 0 };
    }
    acc[account.segment].count++;
    acc[account.segment].mrrLost += account.mrrLost;
    return acc;
  }, {} as Record<string, { count: number; mrrLost: number }>);

  const chartConfig = {
    grossChurn: {
      label: "Gross Churn %",
      color: "#ef4444",
    },
    netChurn: {
      label: "Net Churn %",
      color: "#f97316",
    },
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

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'Mid-Market':
        return 'bg-blue-100 text-blue-800';
      case 'SMB':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'Budget constraints':
        return 'bg-red-100 text-red-800';
      case 'Found cheaper alternative':
        return 'bg-orange-100 text-orange-800';
      case 'Lack of feature usage':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor customer support':
        return 'bg-red-100 text-red-800';
      case 'Too complex for needs':
        return 'bg-blue-100 text-blue-800';
      case 'Company closure':
        return 'bg-gray-100 text-gray-800';
      case 'Internal solution developed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCellContent = (account: any, columnId: string) => {
    switch (columnId) {
      case 'customerName':
        return (
          <div>
            <div className="font-medium">{account.customerName}</div>
            <div className="text-sm text-muted-foreground">{account.email}</div>
          </div>
        );
      case 'churnDate':
        return new Date(account.churnDate).toLocaleDateString();
      case 'reason':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReasonColor(account.reason)}`}>
            {account.reason}
          </span>
        );
      case 'mrrLost':
        return <span className="font-medium text-red-600">${account.mrrLost.toLocaleString()}</span>;
      case 'segment':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSegmentColor(account.segment)}`}>
            {account.segment}
          </span>
        );
      case 'daysActive':
        return (
          <div>
            <div className="font-medium">{account.daysActive} days</div>
            <div className="text-sm text-muted-foreground">
              {account.contractLength} mo contract
            </div>
          </div>
        );
      case 'lastActivity':
        return (
          <div>
            <div className="text-sm">
              {new Date(account.lastLoginDate).toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {account.supportTickets} support tickets
            </div>
          </div>
        );
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      {/* Dashboard Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Gross Churn Rate
              <HelpTooltip helpId="gross-revenue-churn" />
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-1">{currentGrossChurn.toFixed(1)}%</div>
            <p className="text-xs text-gray-600">
              {grossChurnChange <= 0 ? '↗' : '↘'} {Math.abs(grossChurnChange).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Net Churn Rate
              <HelpTooltip helpId="net-revenue-churn-rate" />
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-1">{currentNetChurn.toFixed(1)}%</div>
            <p className="text-xs text-gray-600">
              {netChurnChange <= 0 ? '↗' : '↘'} {Math.abs(netChurnChange).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Total MRR Lost
              <HelpTooltip helpId="mrr-lost" />
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">${(totalMrrLost / 1000).toFixed(1)}K</div>
            <p className="text-xs text-gray-600">this month</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Churned Customers
              <HelpTooltip helpId="avg-revenue-per-lost-customer" />
            </CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">{churnedAccounts.length}</div>
            <p className="text-xs text-gray-600">avg MRR: ${avgMrrLost.toFixed(0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Churn Trends Chart */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Gross vs Net Churn Trends</CardTitle>
            <HelpTooltip helpId="revenue-churn-trend" />
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart data={churnTrends}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}%`, 
                  name === 'grossChurn' ? 'Gross Churn' : 'Net Churn'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="grossChurn" 
                stroke="var(--color-grossChurn)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-grossChurn)", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="netChurn" 
                stroke="var(--color-netChurn)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-netChurn)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Segment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(segmentBreakdown).map(([segment, data]: [string, { count: number; mrrLost: number }]) => (
          <Card key={segment} className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 text-black">{segment}</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-2xl font-bold text-red-600">{data.count}</p>
                    <p className="text-xs text-gray-600">customers churned</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-green-600">${(data.mrrLost / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-gray-600">MRR lost</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Churned Accounts Table */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Churned Accounts Detail</CardTitle>
            <HelpTooltip helpId="high-value-churn" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['mrrLost', 'daysActive'].includes(column.id);
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
                {sortedData.map((account) => (
                  <TableRow key={account.id} className="hover:bg-gray-50 transition-colors duration-200">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['mrrLost', 'daysActive'].includes(column.id);
                      return (
                        <TableCell 
                          key={column.id} 
                          className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: '80px'
                          }}
                        >
                          {renderCellContent(account, column.id)}
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

export default GrossNetChurnBreakdownReport;
