import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Users, Target, Award, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '../../services/reports';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import ScrollToTopButton from '../../components/ui/ScrollToTopButton';
import HelpTooltip from '../../components/shared/HelpTooltip';
import { useTableColumnManager } from '../../hooks/useTableColumnManager';
import { useSorting } from '../../hooks/useSorting';
import { getDataTypeFromColumn } from '../../utils/sortingUtils';

interface SourcePromoPerformanceReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const SourcePromoPerformanceReport: React.FC<SourcePromoPerformanceReportProps> = ({ dateRange, selectedPeriod }) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real promo data from Supabase
  const { data: promoData, isLoading, error } = useQuery({
    queryKey: ['source-promo-performance', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getSourcePromoData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });
  if (isLoading) {
    return <div className="animate-fade-in">Loading source/promo performance data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading promo performance data</div>;
  }

  if (!promoData) {
    return <div className="text-gray-600">No promo data available</div>;
  }

  // Define table columns for the detailed performance table
  const tableColumns = [
    { id: 'code', label: 'Code', sortable: true, resizable: true },
    { id: 'type', label: 'Type', sortable: true, resizable: true },
    { id: 'impressions', label: 'Impressions', sortable: true, resizable: true },
    { id: 'conversions', label: 'Conversions', sortable: true, resizable: true },
    { id: 'conversionRate', label: 'Conv. Rate', sortable: true, resizable: true },
    { id: 'revenue', label: 'Revenue', sortable: true, resizable: true },
    { id: 'averageOrderValue', label: 'AOV', sortable: true, resizable: true },
    { id: 'retentionRate', label: '90-Day Retention', sortable: true, resizable: true },
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
    storageKey: 'source-promo-detailed-performance-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: promoData.detailedPerformance || [],
    initialSort: undefined
  });

  const chartConfig = {
    conversions: {
      label: "Conversions",
      color: "#8b5cf6"
    },
    revenue: {
      label: "Revenue",
      color: "#06b6d4"
    },
    retention: {
      label: "Retention Rate",
      color: "#10b981"
    }
  };
  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#84cc16'];
  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Active Codes
              <HelpTooltip helpId="promo-active-codes" />
            </CardTitle>
            <Award className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{promoData.summary.activeCodes}</div>
            <p className="text-xs text-gray-600">
              {promoData.summary.newCodesThisMonth} new this month
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Total Conversions
              <HelpTooltip helpId="promo-total-conversions" />
            </CardTitle>
            <Target className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">{promoData.summary.totalConversions.toLocaleString()}</div>
            <p className="text-xs text-gray-600">
              {promoData.summary.avgConversionRate}% average conversion rate
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Total Revenue
              <HelpTooltip helpId="promo-total-revenue" />
            </CardTitle>
            <DollarSign className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">${promoData.summary.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-600">
              ${promoData.summary.avgOrderValue} average order value
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Avg Retention
              <HelpTooltip helpId="promo-avg-retention" />
            </CardTitle>
            <Users className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 mb-1">{promoData.summary.avgRetentionRate}%</div>
            <p className="text-xs text-gray-600">
              90-day retention rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Codes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performing Codes
              <HelpTooltip helpId="top-performing-codes" />
            </CardTitle>
            <CardDescription>By total revenue generated</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={promoData.topPerformers}>
                  <XAxis dataKey="code" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Code Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Code Type Distribution
              <HelpTooltip helpId="code-type-distribution" />
            </CardTitle>
            <CardDescription>Revenue breakdown by code type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={promoData.typeDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="revenue" label={({
                  name,
                  percent
                }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {promoData.typeDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Performance Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Performance Trend
              <HelpTooltip helpId="monthly-performance-trend" />
            </CardTitle>
            <CardDescription>Conversion rates and revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={promoData.monthlyTrend}>
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line yAxisId="left" type="monotone" dataKey="conversionRate" stroke="var(--color-conversions)" name="Conversion Rate (%)" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="var(--color-revenue)" name="Revenue ($)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Code Performance Table */}
      <Card>
        <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Detailed Code Performance
              <HelpTooltip helpId="detailed-code-performance" />
            </CardTitle>
          <CardDescription>Complete performance metrics for all active codes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['impressions', 'conversions', 'conversionRate', 'revenue', 'averageOrderValue', 'retentionRate'].includes(column.id);
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
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          
                          const startX = e.pageX;
                          const currentWidth = columnWidths[column.id] || 150;
                          
                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            const width = Math.max(80, currentWidth + (moveEvent.pageX - startX));
                            handleColumnResize(column.id, width);
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
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
              {sortedData.map(code => (
                <TableRow key={code.id} className="hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['impressions', 'conversions', 'conversionRate', 'revenue', 'averageOrderValue', 'retentionRate'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {column.id === 'code' && <span className="font-medium">{code.code}</span>}
                        {column.id === 'type' && (
                          <Badge variant="outline" className="capitalize">
                            {code.type}
                          </Badge>
                        )}
                        {column.id === 'impressions' && code.impressions.toLocaleString()}
                        {column.id === 'conversions' && code.conversions.toLocaleString()}
                        {column.id === 'conversionRate' && (
                          <span className={`font-medium ${code.conversionRate >= 5 ? 'text-green-600' : code.conversionRate >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {code.conversionRate}%
                          </span>
                        )}
                        {column.id === 'revenue' && `$${code.revenue.toLocaleString()}`}
                        {column.id === 'averageOrderValue' && `$${code.averageOrderValue}`}
                        {column.id === 'retentionRate' && (
                          <span className={`font-medium ${code.retentionRate >= 70 ? 'text-green-600' : code.retentionRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {code.retentionRate}%
                          </span>
                        )}
                        {column.id === 'status' && (
                          <Badge variant={code.status === 'active' ? 'default' : 'secondary'}>
                            {code.status}
                          </Badge>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Channel Performance */}
      <Card>
        <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Channel Performance
              <HelpTooltip helpId="channel-performance" />
            </CardTitle>
          <CardDescription>Performance breakdown by marketing channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {promoData.channelPerformance.map(channel => <div key={channel.channel} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{channel.channel}</h4>
                  <Badge variant="outline">{channel.activeCodes} codes</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conv. Rate:</span>
                    <span className="font-medium">{channel.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="font-medium">${channel.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AOV:</span>
                    <span className="font-medium">${channel.averageOrderValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Retention:</span>
                    <span className="font-medium">{channel.retentionRate}%</span>
                  </div>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>
      
      <ScrollToTopButton />
    </div>
  );
};

export default SourcePromoPerformanceReport;
