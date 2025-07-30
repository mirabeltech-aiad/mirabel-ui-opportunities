

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/enhanced-table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { usePricingSegmentData } from '@/hooks/usePricingData';
import { HelpTooltip } from '@/components';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';

const PricingSegmentAnalysis = () => {
  const { data, isLoading } = usePricingSegmentData();

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'segment', label: 'Segment', sortable: true, resizable: true },
    { id: 'size', label: 'Size', sortable: true, resizable: true },
    { id: 'avgPrice', label: 'Avg. Price Paid', sortable: true, resizable: true },
    { id: 'conversionRate', label: 'Conversion Rate', sortable: true, resizable: true },
    { id: 'sensitivity', label: 'Price Sensitivity', sortable: true, resizable: true },
    { id: 'optimalPrice', label: 'Optimal Price', sortable: true, resizable: true },
    { id: 'revenuePotential', label: 'Revenue Potential', sortable: true, resizable: true }
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
    storageKey: 'pricing-segment-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: data?.segmentMetrics || [],
    initialSort: undefined
  });

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

  if (isLoading || !data) {
    return <div>Loading pricing segment data...</div>;
  }

  const segmentConfig = {
    segment1: { label: "Budget Conscious", color: "#ef4444" },
    segment2: { label: "Value Seekers", color: "#f59e0b" },
    segment3: { label: "Premium Buyers", color: "#10b981" },
    segment4: { label: "Enterprise", color: "#3b82f6" }
  };

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  const getSensitivityBadgeVariant = (sensitivity: string) => {
    switch (sensitivity?.toLowerCase()) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Price Sensitivity by Segment</CardTitle>
              <HelpTooltip helpId="price-sensitivity-by-segment" />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={segmentConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.priceSensitivity}>
                  <XAxis dataKey="segment" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sensitivity" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Revenue Distribution by Segment</CardTitle>
              <HelpTooltip helpId="revenue-distribution-by-segment" />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={segmentConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.revenueDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                    label
                  >
                    {data.revenueDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Segment Performance Metrics</CardTitle>
            <HelpTooltip helpId="segment-performance-metrics" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['size', 'avgPrice', 'conversionRate', 'optimalPrice', 'revenuePotential'].includes(column.id);
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
                {sortedData.map((segment) => (
                  <tr key={segment.id} className="border-b hover:bg-gray-50">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['size', 'avgPrice', 'conversionRate', 'optimalPrice', 'revenuePotential'].includes(column.id);
                      return (
                        <td 
                          key={column.id} 
                          className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: '80px'
                          }}
                        >
                          {column.id === 'segment' && (
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[segment.id % COLORS.length] }}
                              />
                              <span className="font-medium text-gray-900">{segment.name}</span>
                            </div>
                          )}
                          {column.id === 'size' && segment.size.toLocaleString()}
                          {column.id === 'avgPrice' && `$${segment.avgPrice}`}
                          {column.id === 'conversionRate' && `${segment.conversionRate}%`}
                          {column.id === 'sensitivity' && (
                            <Badge variant={getSensitivityBadgeVariant(segment.sensitivity)}>
                              {segment.sensitivity}
                            </Badge>
                          )}
                          {column.id === 'optimalPrice' && `$${segment.optimalPrice}`}
                          {column.id === 'revenuePotential' && (
                            <span className="text-green-600">+{segment.revenuePotential}%</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Price vs Willingness to Pay</CardTitle>
              <HelpTooltip helpId="price-vs-willingness-to-pay" />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={segmentConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={data.priceWillingness}>
                  <XAxis dataKey="currentPrice" label={{ value: 'Current Price', position: 'insideBottom', offset: -5 }} />
                  <YAxis dataKey="willingnessToPay" label={{ value: 'Willingness to Pay', angle: -90, position: 'insideLeft' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter dataKey="willingnessToPay" fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Segment Recommendations</CardTitle>
              <HelpTooltip helpId="segment-recommendations" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recommendations.map((rec) => (
                <div key={rec.segment} className="border rounded-lg p-4 transition-all duration-200 hover:shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{rec.segment}</h4>
                    <Badge variant="outline">{rec.priority}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec.recommendation}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900">Expected Impact: <span className="text-green-600">+{rec.expectedImpact}%</span></span>
                    <span className="text-gray-900">Timeline: {rec.timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingSegmentAnalysis;

