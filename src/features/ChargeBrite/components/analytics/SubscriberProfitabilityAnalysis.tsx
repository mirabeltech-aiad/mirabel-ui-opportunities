
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/enhanced-table';
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useSubscriberProfitability } from '@/hooks/useCostAnalytics';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HelpTooltip } from '@/components';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';

const SubscriberProfitabilityAnalysis = () => {
  const { data: profitabilityData, isLoading } = useSubscriberProfitability();

  // Define table columns for segment table
  const segmentTableColumns = [
    { id: 'segment', label: 'Segment', sortable: true, resizable: true },
    { id: 'subscribers', label: 'Subscribers', sortable: true, resizable: true },
    { id: 'totalRevenue', label: 'Total Revenue', sortable: true, resizable: true },
    { id: 'totalProfit', label: 'Total Profit', sortable: true, resizable: true },
    { id: 'avgProfit', label: 'Avg Profit', sortable: true, resizable: true },
    { id: 'profitMargin', label: 'Profit Margin', sortable: true, resizable: true }
  ];

  // Define table columns for subscriber table
  const subscriberTableColumns = [
    { id: 'subscriberId', label: 'Subscriber ID', sortable: true, resizable: true },
    { id: 'revenue', label: 'Revenue', sortable: true, resizable: true },
    { id: 'costs', label: 'Costs', sortable: true, resizable: true },
    { id: 'profit', label: 'Profit', sortable: true, resizable: true },
    { id: 'profitMargin', label: 'Margin', sortable: true, resizable: true },
    { id: 'segment', label: 'Segment', sortable: true, resizable: true },
    { id: 'acquisitionChannel', label: 'Channel', sortable: true, resizable: true },
    { id: 'subscriptionType', label: 'Type', sortable: true, resizable: true },
    { id: 'status', label: 'Status', sortable: false, resizable: true }
  ];

  // Initialize table column management for segment table
  const {
    columnOrder: segmentColumnOrder,
    draggedColumn: draggedSegmentColumn,
    columnWidths: segmentColumnWidths,
    handleColumnResize: handleSegmentColumnResize,
    handleDragStart: handleSegmentDragStart,
    handleDragOver: handleSegmentDragOver,
    handleDragEnd: handleSegmentDragEnd
  } = useTableColumnManager({
    columns: segmentTableColumns,
    storageKey: 'profitability-segment-columns'
  });

  // Initialize table column management for subscriber table
  const {
    columnOrder: subscriberColumnOrder,
    draggedColumn: draggedSubscriberColumn,
    columnWidths: subscriberColumnWidths,
    handleColumnResize: handleSubscriberColumnResize,
    handleDragStart: handleSubscriberDragStart,
    handleDragOver: handleSubscriberDragOver,
    handleDragEnd: handleSubscriberDragEnd
  } = useTableColumnManager({
    columns: subscriberTableColumns,
    storageKey: 'profitability-subscriber-columns'
  });

  // Initialize sorting functionality for segment table
  const segmentSummary = useMemo(() => {
    if (!profitabilityData) return {};
    return profitabilityData.reduce((acc, sub) => {
      if (!acc[sub.segment]) {
        acc[sub.segment] = { count: 0, totalProfit: 0, totalRevenue: 0 };
      }
      acc[sub.segment].count++;
      acc[sub.segment].totalProfit += sub.profit;
      acc[sub.segment].totalRevenue += sub.revenue;
      return acc;
    }, {} as Record<string, { count: number; totalProfit: number; totalRevenue: number }>);
  }, [profitabilityData]);

  const segmentData = useMemo(() => {
    return Object.entries(segmentSummary).map(([segment, data]) => ({
      segment,
      subscribers: data.count,
      totalRevenue: data.totalRevenue,
      totalProfit: data.totalProfit,
      avgProfit: data.totalProfit / data.count,
      profitMargin: (data.totalProfit / data.totalRevenue) * 100
    }));
  }, [segmentSummary]);

  const { sortedData: sortedSegmentData, sortConfig: segmentSortConfig, requestSort: requestSegmentSort, getSortIcon: getSegmentSortIcon } = useSorting({
    data: segmentData,
    initialSort: undefined
  });

  const { sortedData: sortedSubscriberData, sortConfig: subscriberSortConfig, requestSort: requestSubscriberSort, getSortIcon: getSubscriberSortIcon } = useSorting({
    data: profitabilityData || [],
    initialSort: undefined
  });

  // Resizing handlers
  const startSegmentResizing = (e: React.MouseEvent, columnId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.pageX;
    const currentWidth = segmentColumnWidths[columnId] || 150;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const width = Math.max(80, currentWidth + (moveEvent.pageX - startX));
      handleSegmentColumnResize(columnId, width);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const startSubscriberResizing = (e: React.MouseEvent, columnId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.pageX;
    const currentWidth = subscriberColumnWidths[columnId] || 150;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const width = Math.max(80, currentWidth + (moveEvent.pageX - startX));
      handleSubscriberColumnResize(columnId, width);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (isLoading || !profitabilityData) {
    return <div>Loading subscriber profitability...</div>;
  }

  const averageProfit = profitabilityData.reduce((sum, sub) => sum + sub.profit, 0) / profitabilityData.length;
  const averageMargin = profitabilityData.reduce((sum, sub) => sum + sub.profitMargin, 0) / profitabilityData.length;

  // Helper function to get status based on profit margin
  const getSubscriberStatus = (profitMargin: number) => {
    if (profitMargin >= 60) return 'active';
    if (profitMargin >= 40) return 'under review';
    return 'rejected';
  };

  // Helper function to get subscription type badge variant
  const getSubscriptionTypeBadge = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'premium':
      case 'enterprise':
        return 'green';
      case 'standard':
      case 'basic':
        return 'blue';
      case 'trial':
        return 'yellow';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-ocean-800">Subscriber Profitability Analysis</h2>
        <HelpTooltip helpId="subscriber-profitability-analysis" />
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Average Profit</CardTitle>
              <HelpTooltip helpId="average-profit" />
            </div>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${averageProfit.toFixed(2)}
            </div>
            <p className="text-xs text-green-300">Per subscriber</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Average Margin</CardTitle>
              <HelpTooltip helpId="average-margin" />
            </div>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {averageMargin.toFixed(1)}%
            </div>
            <p className="text-xs text-blue-300">Profit margin</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Total Subscribers</CardTitle>
              <HelpTooltip helpId="total-subscribers-profitability" />
            </div>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {profitabilityData.length}
            </div>
            <p className="text-xs text-purple-300">Analyzed</p>
          </CardContent>
        </Card>
      </div>

      {/* Scatter Chart */}
      <Card size="large" className="bg-white">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Revenue vs Profit Scatter</CardTitle>
            <HelpTooltip helpId="revenue-vs-profit-scatter" />
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ profit: { label: "Profit", color: "#10b981" } }}>
            <ScatterChart data={profitabilityData}>
              <XAxis dataKey="revenue" name="Revenue" />
              <YAxis dataKey="profit" name="Profit" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Scatter dataKey="profit" fill="#10b981" />
            </ScatterChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Profitability by Segment Table */}
      <Card size="large" className="bg-white">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Profitability by Segment</CardTitle>
            <HelpTooltip helpId="profitability-by-segment" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {segmentColumnOrder.map((column) => {
                  const isRightAligned = ['subscribers', 'totalRevenue', 'totalProfit', 'avgProfit', 'profitMargin'].includes(column.id);
                  return (
                    <th
                      key={column.id}
                      className={`relative py-2.5 px-4 font-medium text-muted-foreground cursor-pointer hover:bg-gray-100 select-none ${
                        isRightAligned ? 'text-right' : 'text-left'
                      }`}
                      draggable="true"
                      onDragStart={(e) => handleSegmentDragStart(e, column.id)}
                      onDragOver={(e) => handleSegmentDragOver(e, column.id)}
                      onDragEnd={handleSegmentDragEnd}
                      onClick={(e) => {
                        if (!e.defaultPrevented) {
                          const dataType = getDataTypeFromColumn(column.id);
                          requestSegmentSort(column.id, dataType);
                        }
                      }}
                      style={{
                        width: segmentColumnWidths[column.id] ? `${segmentColumnWidths[column.id]}px` : undefined,
                        minWidth: '80px',
                        cursor: draggedSegmentColumn === column.id ? 'grabbing' : 'grab'
                      }}
                    >
                      <div className={`flex items-center gap-1 flex-1 ${
                        isRightAligned ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{column.label}</span>
                        {segmentSortConfig.key === column.id && (
                          <span className="text-xs text-ocean-500">
                            {getSegmentSortIcon(column.id)}
                          </span>
                        )}
                      </div>
                      <div 
                        className="absolute right-0 top-0 h-full w-4 cursor-col-resize group"
                        onMouseDown={(e) => startSegmentResizing(e, column.id)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="h-full w-1 bg-ocean-300 opacity-0 group-hover:opacity-100 mx-auto"></div>
                      </div>
                      {draggedSegmentColumn === column.id && (
                        <div className="absolute inset-0 bg-ocean-100 opacity-30 border-2 border-ocean-400 rounded pointer-events-none"></div>
                      )}
                    </th>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSegmentData.map((item) => (
                <TableRow key={item.segment} className="hover:bg-gray-50 transition-colors duration-200">
                  {segmentColumnOrder.map((column) => {
                    const isRightAligned = ['subscribers', 'totalRevenue', 'totalProfit', 'avgProfit', 'profitMargin'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`${isRightAligned ? 'text-right' : 'font-medium'} text-gray-900`}
                        style={{
                          width: segmentColumnWidths[column.id] ? `${segmentColumnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {column.id === 'segment' && item.segment}
                        {column.id === 'subscribers' && item.subscribers}
                        {column.id === 'totalRevenue' && `$${item.totalRevenue.toFixed(2)}`}
                        {column.id === 'totalProfit' && `$${item.totalProfit.toFixed(2)}`}
                        {column.id === 'avgProfit' && `$${item.avgProfit.toFixed(2)}`}
                        {column.id === 'profitMargin' && (
                          <span className={item.profitMargin >= 60 ? 'text-green-600' : item.profitMargin >= 40 ? 'text-yellow-600' : 'text-red-600'}>
                            {item.profitMargin.toFixed(1)}%
                          </span>
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

      {/* Individual Subscriber Performance Table */}
      <Card size="large" className="bg-white">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Individual Subscriber Performance</CardTitle>
            <HelpTooltip helpId="individual-subscriber-performance" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {subscriberColumnOrder.map((column) => {
                    const isRightAligned = ['revenue', 'costs', 'profit', 'profitMargin'].includes(column.id);
                    if (column.id === 'status') {
                      return (
                        <th key="status" className="text-left py-2.5 px-4 font-medium text-muted-foreground">
                          Status
                        </th>
                      );
                    }
                    return (
                      <th
                        key={column.id}
                        className={`relative py-2.5 px-4 font-medium text-muted-foreground cursor-pointer hover:bg-gray-100 select-none ${
                          isRightAligned ? 'text-right' : 'text-left'
                        }`}
                        draggable="true"
                        onDragStart={(e) => handleSubscriberDragStart(e, column.id)}
                        onDragOver={(e) => handleSubscriberDragOver(e, column.id)}
                        onDragEnd={handleSubscriberDragEnd}
                        onClick={(e) => {
                          if (!e.defaultPrevented) {
                            const dataType = getDataTypeFromColumn(column.id);
                            requestSubscriberSort(column.id, dataType);
                          }
                        }}
                        style={{
                          width: subscriberColumnWidths[column.id] ? `${subscriberColumnWidths[column.id]}px` : undefined,
                          minWidth: '80px',
                          cursor: draggedSubscriberColumn === column.id ? 'grabbing' : 'grab'
                        }}
                      >
                        <div className={`flex items-center gap-1 flex-1 ${
                          isRightAligned ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{column.label}</span>
                          {subscriberSortConfig.key === column.id && (
                            <span className="text-xs text-ocean-500">
                              {getSubscriberSortIcon(column.id)}
                            </span>
                          )}
                        </div>
                        <div 
                          className="absolute right-0 top-0 h-full w-4 cursor-col-resize group"
                          onMouseDown={(e) => startSubscriberResizing(e, column.id)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="h-full w-1 bg-ocean-300 opacity-0 group-hover:opacity-100 mx-auto"></div>
                        </div>
                        {draggedSubscriberColumn === column.id && (
                          <div className="absolute inset-0 bg-ocean-100 opacity-30 border-2 border-ocean-400 rounded pointer-events-none"></div>
                        )}
                      </th>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSubscriberData.map((subscriber) => (
                  <TableRow key={subscriber.subscriberId} className="hover:bg-gray-50 transition-colors duration-200">
                    {subscriberColumnOrder.map((column) => {
                      const isRightAligned = ['revenue', 'costs', 'profit', 'profitMargin'].includes(column.id);
                      return (
                        <TableCell 
                          key={column.id} 
                          className={`${isRightAligned ? 'text-right' : column.id === 'subscriberId' ? 'font-medium' : ''} text-gray-900`}
                          style={{
                            width: subscriberColumnWidths[column.id] ? `${subscriberColumnWidths[column.id]}px` : undefined,
                            minWidth: '80px'
                          }}
                        >
                          {column.id === 'subscriberId' && subscriber.subscriberId}
                          {column.id === 'revenue' && `$${subscriber.revenue.toFixed(2)}`}
                          {column.id === 'costs' && `$${subscriber.costs.toFixed(2)}`}
                          {column.id === 'profit' && `$${subscriber.profit.toFixed(2)}`}
                          {column.id === 'profitMargin' && (
                            <span className={subscriber.profitMargin >= 60 ? 'text-green-600' : subscriber.profitMargin >= 40 ? 'text-yellow-600' : 'text-red-600'}>
                              {subscriber.profitMargin.toFixed(1)}%
                            </span>
                          )}
                          {column.id === 'segment' && subscriber.segment}
                          {column.id === 'acquisitionChannel' && subscriber.acquisitionChannel}
                          {column.id === 'subscriptionType' && (
                            <Badge variant={getSubscriptionTypeBadge(subscriber.subscriptionType)}>
                              {subscriber.subscriptionType}
                            </Badge>
                          )}
                          {column.id === 'status' && (
                            <Badge variant={getSubscriberStatus(subscriber.profitMargin) === 'active' ? 'green' : getSubscriberStatus(subscriber.profitMargin) === 'under review' ? 'yellow' : 'red'}>
                              {getSubscriberStatus(subscriber.profitMargin) === 'active' ? 'Profitable' : getSubscriberStatus(subscriber.profitMargin) === 'under review' ? 'Marginal' : 'Loss'}
                            </Badge>
                          )}
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

export default SubscriberProfitabilityAnalysis;
