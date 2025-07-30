import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, TrendingUp, TrendingDown, Users, Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';

interface TopCustomerRevenueReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

interface TopCustomer {
  id: string;
  companyName: string;
  plan: string;
  mrr: number;
  tenure: string;
  expansionHistory: {
    totalExpansions: number;
    lastExpansion: string;
    expansionRevenue: number;
  };
  segment: 'Enterprise' | 'Mid-Market' | 'SMB';
  revenueShare: number;
}

const TopCustomerRevenueReport: React.FC<TopCustomerRevenueReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'companyName', label: 'Company Name', sortable: true, resizable: true },
    { id: 'segment', label: 'Segment', sortable: true, resizable: true },
    { id: 'plan', label: 'Plan', sortable: true, resizable: true },
    { id: 'mrr', label: 'MRR', sortable: true, resizable: true },
    { id: 'revenueShare', label: 'Revenue Share', sortable: true, resizable: true },
    { id: 'tenure', label: 'Tenure', sortable: true, resizable: true },
    { id: 'expansionHistory', label: 'Expansion History', sortable: true, resizable: true },
    { id: 'lastExpansionRevenue', label: 'Last Expansion Revenue', sortable: true, resizable: true }
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
    storageKey: 'top-customer-revenue-columns'
  });

  // Use React Query to fetch real top customer revenue data from Supabase
  const { data: topCustomerData, isLoading, error } = useQuery({
    queryKey: ['top-customer-revenue', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getTopCustomerRevenueData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  const {
    topCustomers = [],
    overallMetrics = {
      top10PercentShare: 0,
      totalCustomers: 0,
      top10PercentCount: 0,
      averageMrrTop10: 0,
      totalRevenue: 0
    }
  } = topCustomerData || {};
  
  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: topCustomers || [],
    initialSort: undefined
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading top customer revenue data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading top customer revenue data</div>;
  }

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

  const getPlanBadge = (plan: string) => {
    const styles = {
      'Enterprise Plus': 'bg-purple-100 text-purple-800 border-purple-200',
      'Enterprise': 'bg-blue-100 text-blue-800 border-blue-200',
      'Professional Plus': 'bg-green-100 text-green-800 border-green-200',
      'Professional': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return <Badge className={styles[plan as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {plan}
      </Badge>;
  };
  const getSegmentBadge = (segment: string) => {
    const styles = {
      Enterprise: 'bg-purple-100 text-purple-800 border-purple-200',
      'Mid-Market': 'bg-blue-100 text-blue-800 border-blue-200',
      SMB: 'bg-green-100 text-green-800 border-green-200'
    };
    return <Badge variant="outline" className={styles[segment as keyof typeof styles]}>
        {segment}
      </Badge>;
  };
  const getExpansionTrend = (totalExpansions: number, lastExpansion: string) => {
    const isRecent = new Date(lastExpansion + ' 01, 2024').getTime() > new Date('2024-02-01').getTime();
    return <div className="flex items-center gap-1">
        {isRecent ? <TrendingUp className="h-3 w-3 text-green-600" /> : <TrendingDown className="h-3 w-3 text-gray-400" />}
        <span className="text-xs text-gray-600">{totalExpansions} expansions</span>
      </div>;
  };
  return (
    <div className="space-y-6">
      {/* Summary Cards */}

      {/* Key Metrics Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Top 10% Revenue Share
              <HelpTooltip helpId="top-10-percent-revenue-share" />
            </CardTitle>
            <Crown className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">{overallMetrics.top10PercentShare}%</div>
            <p className="text-xs text-gray-600">
              of total revenue from {overallMetrics.top10PercentCount} customers
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Top 10% Count
              <HelpTooltip helpId="top-10-percent-count" />
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{overallMetrics.top10PercentCount}</div>
            <p className="text-xs text-gray-600">
              out of {overallMetrics.totalCustomers.toLocaleString()} total customers
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Average MRR (Top 10%)
              <HelpTooltip helpId="average-mrr-top-10" />
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">${overallMetrics.averageMrrTop10.toLocaleString()}</div>
            <p className="text-xs text-gray-600">monthly recurring revenue</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Total Revenue
              <HelpTooltip helpId="total-revenue-top-customers" />
            </CardTitle>
            <Crown className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 mb-1">${(overallMetrics.totalRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-600">monthly recurring revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Concentration Summary */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Revenue Concentration Analysis</CardTitle>
            <HelpTooltip helpId="revenue-concentration-analysis" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">68.5%</div>
              <p className="text-xs text-gray-600">Top 10% Customer Share</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">42.3%</div>
              <p className="text-xs text-gray-600">Top 5% Customer Share</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">23.1%</div>
              <p className="text-xs text-gray-600">Top 1% Customer Share</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Customers Table */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Top Customers by MRR</CardTitle>
            <HelpTooltip helpId="top-customers-by-mrr" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['mrr', 'revenueShare', 'lastExpansionRevenue'].includes(column.id);
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
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['mrr', 'revenueShare', 'lastExpansionRevenue'].includes(column.id);
                      return (
                        <td 
                          key={column.id} 
                          className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: '80px'
                          }}
                        >
                          {column.id === 'companyName' && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{customer.companyName}</span>
                            </div>
                          )}
                          {column.id === 'segment' && getSegmentBadge(customer.segment)}
                          {column.id === 'plan' && getPlanBadge(customer.plan)}
                          {column.id === 'mrr' && (
                            <span className="font-bold">${customer.mrr.toLocaleString()}</span>
                          )}
                          {column.id === 'revenueShare' && (
                            <span className="font-medium text-purple-600">{customer.revenueShare}%</span>
                          )}
                          {column.id === 'tenure' && customer.tenure}
                          {column.id === 'expansionHistory' && (
                            <div className="space-y-1">
                              {getExpansionTrend(customer.expansionHistory.totalExpansions, customer.expansionHistory.lastExpansion)}
                              <div className="text-xs text-gray-500">
                                Last: {customer.expansionHistory.lastExpansion}
                              </div>
                            </div>
                          )}
                          {column.id === 'lastExpansionRevenue' && (
                            <span className="font-medium text-green-600">
                              ${customer.expansionHistory.expansionRevenue.toLocaleString()}
                            </span>
                          )}
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

      {/* Analysis Summary */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Revenue Concentration Insights</CardTitle>
            <HelpTooltip helpId="revenue-concentration-insights" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Key Findings</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• Top 10% of customers contribute 68.5% of total revenue</li>
                <li>• Enterprise customers dominate the highest revenue segments</li>
                <li>• Strong expansion activity with recent growth from top accounts</li>
                <li>• Revenue concentration indicates healthy account management focus</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Risk Management</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• Monitor top 10 accounts closely for retention risks</li>
                <li>• Diversify revenue base to reduce concentration risk</li>
                <li>• Focus on expanding mid-tier customers to Enterprise level</li>
                <li>• Implement dedicated success management for top accounts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopCustomerRevenueReport;
