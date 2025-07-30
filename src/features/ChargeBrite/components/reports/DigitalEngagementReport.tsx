import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Smartphone, Eye, MousePointer, Clock, Users, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '../../services/reports';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import { HelpTooltip } from '../../components';
import { useTableColumnManager } from '../../hooks/useTableColumnManager';
import { useSorting } from '../../hooks/useSorting';
import { getDataTypeFromColumn } from '../../utils/sortingUtils';

interface DigitalEngagementReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const DigitalEngagementReport: React.FC<DigitalEngagementReportProps> = ({ dateRange, selectedPeriod }) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real engagement data from Supabase
  const { data: engagementData, isLoading, error } = useQuery({
    queryKey: ['digital-engagement', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getDigitalEngagementData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading digital engagement data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading engagement data</div>;
  }

  const engagementMetrics = engagementData || {
    digitalSubscribers: 0,
    avgOpenRate: 0,
    avgClickRate: 0,
    avgTimeOnPage: 0,
    topDevice: 'Mobile',
    loginFrequency: 0
  };

  const monthlyEngagement = engagementData?.monthlyEngagement || [];
  const deviceBreakdown = engagementData?.deviceBreakdown || [];

  // Define table columns
  const tableColumns = [
    { id: 'device', label: 'Device Type', sortable: true, resizable: true },
    { id: 'users', label: 'Active Users', sortable: true, resizable: true },
    { id: 'percentage', label: 'Percentage', sortable: true, resizable: true },
    { id: 'sessionTime', label: 'Avg Session Time', sortable: true, resizable: true }
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
    storageKey: 'digital-engagement-device-details-columns'
  });

  // Prepare data with session time for sorting
  const tableData = deviceBreakdown.map((device) => ({
    ...device,
    sessionTime: device.device === 'Mobile' ? '6.2m' : device.device === 'Desktop' ? '12.8m' : '8.9m'
  }));

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: tableData,
    initialSort: undefined
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Digital Subscribers</CardTitle>
              <HelpTooltip helpId="digital-circulation" />
            </div>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{engagementMetrics.digitalSubscribers.toLocaleString()}</div>
            <p className="text-xs text-gray-600">active users</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Avg Open Rate</CardTitle>
              <HelpTooltip helpId="engagement-score" />
            </div>
            <Eye className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">{engagementMetrics.avgOpenRate}%</div>
            <p className="text-xs text-gray-600">email opens</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Avg Click Rate</CardTitle>
              <HelpTooltip helpId="engagement-score" />
            </div>
            <MousePointer className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">{engagementMetrics.avgClickRate}%</div>
            <p className="text-xs text-gray-600">email clicks</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Avg Time on Page</CardTitle>
              <HelpTooltip helpId="engagement-score" />
            </div>
            <Clock className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 mb-1">{engagementMetrics.avgTimeOnPage}m</div>
            <p className="text-xs text-gray-600">session duration</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Top Device</CardTitle>
              <HelpTooltip helpId="engagement-score" />
            </div>
            <Smartphone className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{engagementMetrics.topDevice}</div>
            <p className="text-xs text-gray-600">primary access</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Login Frequency</CardTitle>
              <HelpTooltip helpId="engagement-score" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">{engagementMetrics.loginFrequency}/week</div>
            <p className="text-xs text-gray-600">avg sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800">Monthly Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="opens" stroke="#10b981" strokeWidth={2} name="Email Opens" />
                <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} name="Email Clicks" />
                <Line type="monotone" dataKey="sessions" stroke="#8b5cf6" strokeWidth={2} name="Website Sessions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800">Device Usage Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deviceBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="device" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#0284c7" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800">Device Usage Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['users', 'percentage', 'sessionTime'].includes(column.id);
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
              {sortedData.map((device) => (
                <TableRow key={device.device} className="hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['users', 'percentage', 'sessionTime'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {column.id === 'device' && <span className="font-medium">{device.device}</span>}
                        {column.id === 'users' && device.users.toLocaleString()}
                        {column.id === 'percentage' && `${device.percentage}%`}
                        {column.id === 'sessionTime' && (
                          <Badge variant="outline">
                            {device.sessionTime}
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
    </div>
  );
};

export default DigitalEngagementReport;
