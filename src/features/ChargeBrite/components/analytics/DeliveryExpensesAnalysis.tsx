

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useDeliveryExpenses } from '@/hooks/useCostAnalytics';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { HelpTooltip } from '@/components';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';

import { PIE_CHART_COLORS } from '@/constants/chartColors';

const DeliveryExpensesAnalysis = () => {
  const { data: deliveryData, isLoading } = useDeliveryExpenses();

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'type', label: 'Type', sortable: true, resizable: true },
    { id: 'cost', label: 'Total Cost', sortable: true, resizable: true },
    { id: 'volume', label: 'Volume', sortable: true, resizable: true },
    { id: 'costPerUnit', label: 'Cost per Unit', sortable: true, resizable: true },
    { id: 'subscribers', label: 'Subscribers', sortable: true, resizable: true },
    { id: 'costPerSubscriber', label: 'Cost per Subscriber', sortable: true, resizable: true },
    { id: 'trend', label: 'Trend', sortable: true, resizable: true }
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
    storageKey: 'delivery-expenses-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: deliveryData || [],
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

  if (isLoading || !deliveryData) {
    return <div>Loading delivery expenses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-ocean-800">Delivery Expenses Analysis</h2>
        <HelpTooltip helpId="delivery-expenses-analysis" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Delivery Costs by Type</CardTitle>
              <HelpTooltip helpId="delivery-costs-by-type" />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ cost: { label: "Cost", color: "#3b82f6" } }}>
              <PieChart>
                <Pie
                  data={deliveryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="cost"
                  label={({ type, cost }) => `${type}: $${cost.toLocaleString()}`}
                >
                  {deliveryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Cost Efficiency Metrics</CardTitle>
              <HelpTooltip helpId="cost-efficiency-metrics" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveryData.map((item) => (
                <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium capitalize">{item.type}</div>
                    <div className="text-sm text-gray-600">
                      ${item.costPerSubscriber.toFixed(2)} per subscriber
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      {item.trend > 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                      )}
                      <span className={item.trend > 0 ? 'text-red-600' : 'text-green-600'}>
                        {Math.abs(item.trend).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Delivery Cost Breakdown</CardTitle>
            <HelpTooltip helpId="delivery-cost-breakdown" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['cost', 'volume', 'costPerUnit', 'subscribers', 'costPerSubscriber', 'trend'].includes(column.id);
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
                {sortedData.map((item) => (
                  <tr key={item.type} className="border-b hover:bg-gray-50">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['cost', 'volume', 'costPerUnit', 'subscribers', 'costPerSubscriber', 'trend'].includes(column.id);
                      return (
                        <td 
                          key={column.id} 
                          className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : 'font-medium capitalize'}`}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: '80px'
                          }}
                        >
                          {column.id === 'type' && item.type}
                          {column.id === 'cost' && `$${item.cost.toLocaleString()}`}
                          {column.id === 'volume' && item.volume.toLocaleString()}
                          {column.id === 'costPerUnit' && `$${item.costPerUnit.toFixed(2)}`}
                          {column.id === 'subscribers' && item.subscribers.toLocaleString()}
                          {column.id === 'costPerSubscriber' && `$${item.costPerSubscriber.toFixed(2)}`}
                          {column.id === 'trend' && (
                            <div className="flex items-center justify-end">
                              {item.trend > 0 ? (
                                <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                              )}
                              <span className={item.trend > 0 ? 'text-red-600' : 'text-green-600'}>
                                {Math.abs(item.trend).toFixed(1)}%
                              </span>
                            </div>
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
    </div>
  );
};

export default DeliveryExpensesAnalysis;
