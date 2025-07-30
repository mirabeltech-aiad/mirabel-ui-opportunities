

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useAcquisitionCosts } from '@/hooks/useCostAnalytics';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { HelpTooltip } from '@/components';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';

const AcquisitionCostsAnalysis = () => {
  const { data: acquisitionData, isLoading } = useAcquisitionCosts();

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'channel', label: 'Channel', sortable: true, resizable: true },
    { id: 'cost', label: 'Total Cost', sortable: true, resizable: true },
    { id: 'subscribers', label: 'Subscribers', sortable: true, resizable: true },
    { id: 'cac', label: 'CAC', sortable: true, resizable: true },
    { id: 'ltvCacRatio', label: 'LTV/CAC', sortable: true, resizable: true },
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
    storageKey: 'acquisition-costs-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: acquisitionData || [],
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

  if (isLoading || !acquisitionData) {
    return <div>Loading acquisition costs...</div>;
  }

  const chartConfig = {
    cac: {
      label: "CAC",
      color: "#ef4444",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-ocean-800">Acquisition Costs Analysis</h2>
        <HelpTooltip helpId="acquisition-costs" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Customer Acquisition Cost by Channel</CardTitle>
              <HelpTooltip helpId="cac-by-channel" />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={acquisitionData}>
                <XAxis dataKey="channel" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cac" fill="var(--color-cac)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">LTV/CAC Ratio by Channel</CardTitle>
              <HelpTooltip helpId="ltv-cac-ratio" />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ ltvCacRatio: { label: "LTV/CAC", color: "#10b981" } }}>
              <BarChart data={acquisitionData}>
                <XAxis dataKey="channel" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="ltvCacRatio" fill="#10b981" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Acquisition Cost Performance</CardTitle>
            <HelpTooltip helpId="acquisition-performance" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['cost', 'subscribers', 'cac', 'ltvCacRatio', 'trend'].includes(column.id);
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
                {sortedData.map((channel) => (
                  <tr key={channel.channel} className="border-b hover:bg-gray-50">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['cost', 'subscribers', 'cac', 'ltvCacRatio', 'trend'].includes(column.id);
                      return (
                        <td 
                          key={column.id} 
                          className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : 'font-medium'}`}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: '80px'
                          }}
                        >
                          {column.id === 'channel' && channel.channel}
                          {column.id === 'cost' && `$${channel.cost.toLocaleString()}`}
                          {column.id === 'subscribers' && channel.subscribers.toLocaleString()}
                          {column.id === 'cac' && `$${channel.cac.toFixed(2)}`}
                          {column.id === 'ltvCacRatio' && (
                            <span className={channel.ltvCacRatio >= 100 ? 'text-green-600' : 'text-red-600'}>
                              {channel.ltvCacRatio.toFixed(1)}x
                            </span>
                          )}
                          {column.id === 'trend' && (
                            <div className="flex items-center justify-end">
                              {channel.trend > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                              )}
                              <span className={channel.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                                {Math.abs(channel.trend).toFixed(1)}%
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

export default AcquisitionCostsAnalysis;
