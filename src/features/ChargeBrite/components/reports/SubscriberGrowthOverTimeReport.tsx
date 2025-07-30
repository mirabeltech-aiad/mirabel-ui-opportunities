import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/enhanced-table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Users, UserPlus, Filter } from 'lucide-react';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '../../services/reports';
import HelpTooltip from '../../components/shared/HelpTooltip';
import { useTableColumnManager } from '../../hooks/useTableColumnManager';
import { useSorting } from '../../hooks/useSorting';
import { getDataTypeFromColumn } from '../../utils/sortingUtils';

const SubscriberGrowthOverTimeReport = () => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected,
    products,
    businessUnits
  } = useProductFilter();

  // Use React Query to fetch real subscriber growth data from Supabase
  const { data: growthData, isLoading, error } = useQuery({
    queryKey: ['subscriber-growth', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits
    }],
    queryFn: () => supabaseReportsService.getSubscriberGrowthData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading subscriber growth data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading subscriber growth data</div>;
  }

  const {
    growthData: monthlyData = [],
    currentMonthData = { totalActive: 0, netGrowth: 0, churnRate: 0 },
    previousMonthData = { totalActive: 0, netGrowth: 0, churnRate: 0 },
    yearOverYearData = { totalActive: 0, netGrowth: 0, churnRate: 0 }
  } = growthData || {};

  // Get filtered product and business unit names for display
  const getFilteredNames = () => {
    const productNames = isAllProductsSelected ? 'All Products' : selectedProducts.map(id => products.find(p => p.id === id)?.name).join(', ');
    const unitNames = isAllBusinessUnitsSelected ? 'All Business Units' : selectedBusinessUnits.map(id => businessUnits.find(bu => bu.id === id)?.name).join(', ');
    return {
      productNames,
      unitNames
    };
  };
  const {
    productNames,
    unitNames
  } = getFilteredNames();

  const netGrowthChange = currentMonthData.netGrowth - previousMonthData.netGrowth;
  const churnRateChange = currentMonthData.churnRate - previousMonthData.churnRate;
  const yoyGrowth = yearOverYearData.totalActive > 0 ? 
    ((currentMonthData.totalActive - yearOverYearData.totalActive) / yearOverYearData.totalActive * 100) : 0;

  // Define table columns for drag-and-drop functionality
  const tableColumns = useMemo(() => [
    { id: 'month', label: 'Month', sortable: true, resizable: true },
    { id: 'newStarts', label: 'New Starts', sortable: true, resizable: true },
    { id: 'renewals', label: 'Renewals', sortable: true, resizable: true },
    { id: 'reactivations', label: 'Reactivations', sortable: true, resizable: true },
    { id: 'expirations', label: 'Expirations', sortable: true, resizable: true },
    { id: 'netGrowth', label: 'Net Growth', sortable: true, resizable: true },
    { id: 'churnRate', label: 'Churn Rate', sortable: true, resizable: true },
    { id: 'totalActive', label: 'Total Active', sortable: true, resizable: true }
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
    storageKey: 'subscriber-growth-details-columns'
  });

  // Prepare data for sorting (reverse order)
  const reversedMonthlyData = useMemo(() => monthlyData.slice().reverse(), [monthlyData]);

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: reversedMonthlyData,
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

  // Handle sorting
  const handleSort = (columnKey: string) => {
    const dataType = getDataTypeFromColumn(columnKey);
    requestSort(columnKey, dataType);
  };

  // Render cell content
  const renderCellContent = (month: any, columnId: string) => {
    switch (columnId) {
      case 'month':
        return <span className="font-medium">{month.month}</span>;
      case 'newStarts':
        return <span className="text-green-600">{month.newStarts.toLocaleString()}</span>;
      case 'renewals':
        return <span className="text-blue-600">{month.renewals.toLocaleString()}</span>;
      case 'reactivations':
        return <span className="text-purple-600">{month.reactivations.toLocaleString()}</span>;
      case 'expirations':
        return <span className="text-red-600">{month.expirations.toLocaleString()}</span>;
      case 'netGrowth':
        return <span className="font-medium">{month.netGrowth.toLocaleString()}</span>;
      case 'churnRate':
        return <span>{month.churnRate}%</span>;
      case 'totalActive':
        return <span className="font-bold">{month.totalActive.toLocaleString()}</span>;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        {(!isAllProductsSelected || !isAllBusinessUnitsSelected) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Active Filters:</span>
            </div>
            <div className="mt-1 text-sm text-blue-700">
              <div>Products: {productNames}</div>
              <div>Business Units: {unitNames}</div>
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Current Active Subscribers
              <HelpTooltip helpId="subscriber-growth-current-active" />
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{currentMonthData.totalActive.toLocaleString()}</div>
            <p className="text-xs text-gray-600">as of {currentMonthData.month}</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Net Growth (Monthly)
              <HelpTooltip helpId="subscriber-growth-net-monthly" />
            </CardTitle>
            <UserPlus className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">{currentMonthData.netGrowth.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              {netGrowthChange >= 0 ? <TrendingUp className="h-3 w-3 text-green-600" /> : <TrendingDown className="h-3 w-3 text-red-600" />}
              <span className={netGrowthChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                {netGrowthChange >= 0 ? '+' : ''}{netGrowthChange.toLocaleString()} vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Current Churn Rate
              <HelpTooltip helpId="subscriber-growth-churn-rate" />
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">{currentMonthData.churnRate}%</div>
            <div className="flex items-center gap-1 text-xs">
              {churnRateChange <= 0 ? <TrendingDown className="h-3 w-3 text-green-600" /> : <TrendingUp className="h-3 w-3 text-red-600" />}
              <span className={churnRateChange <= 0 ? 'text-green-600' : 'text-red-600'}>
                {churnRateChange <= 0 ? '' : '+'}{churnRateChange.toFixed(1)}% vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Year-over-Year Growth
              <HelpTooltip helpId="subscriber-growth-yoy" />
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 mb-1">{yoyGrowth.toFixed(1)}%</div>
            <p className="text-xs text-gray-600">vs same month last year</p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-1">
              Subscriber Growth Trend
              <HelpTooltip helpId="subscriber-growth-trends" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalActive" stroke="#0284c7" strokeWidth={3} name="Total Active Subscribers" />
                <Line type="monotone" dataKey="netGrowth" stroke="#10b981" strokeWidth={2} name="Net Monthly Growth" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-1">
              Monthly Activity Breakdown
              <HelpTooltip helpId="subscriber-growth-activity-breakdown" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData.slice(-6)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="newStarts" stackId="a" fill="#10b981" name="New Starts" />
                <Bar dataKey="renewals" stackId="a" fill="#3b82f6" name="Renewals" />
                <Bar dataKey="reactivations" stackId="a" fill="#8b5cf6" name="Reactivations" />
                <Bar dataKey="expirations" stackId="b" fill="#ef4444" name="Expirations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Growth Table */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            Monthly Growth Details
            <HelpTooltip helpId="subscriber-growth-details-table" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['newStarts', 'renewals', 'reactivations', 'expirations', 'netGrowth', 'churnRate', 'totalActive'].includes(column.id);
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
              {sortedData.length > 0 ? sortedData.map((month, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['newStarts', 'renewals', 'reactivations', 'expirations', 'netGrowth', 'churnRate', 'totalActive'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {renderCellContent(month, column.id)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={columnOrder.length} className="p-8 text-center text-gray-500">
                    No monthly data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
export default SubscriberGrowthOverTimeReport;