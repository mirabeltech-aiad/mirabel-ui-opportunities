import { useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserX, Calendar, DollarSign, AlertTriangle, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '../../services/subscriptionService';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import ScrollToTopButton from '../../components/ui/ScrollToTopButton';
import { HelpTooltip } from '../../components';
import { useTableColumnManager } from '../../hooks/useTableColumnManager';
import { useSorting } from '../../hooks/useSorting';
import { getDataTypeFromColumn } from '../../utils/sortingUtils';

interface ChurnCancellationReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const ChurnCancellationReport: React.FC<ChurnCancellationReportProps> = ({ 
  dateRange, 
  selectedPeriod 
}) => {
  const { 
    selectedProducts, 
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  const {
    data: churnData,
    isLoading,
    error
  } = useQuery({
    queryKey: [
      'churn-cancellation-report', 
      selectedProducts, 
      selectedBusinessUnits, 
      dateRange,
      selectedPeriod
    ],
    queryFn: () => subscriptionService.getChurnCancellationData(
      isAllProductsSelected ? undefined : selectedProducts,
      isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    ),
    staleTime: 5 * 60 * 1000
  });

  // Define table columns for drag-and-drop functionality
  const tableColumns = useMemo(() => [
    { id: 'customerId', label: 'Customer ID', sortable: true, resizable: true },
    { id: 'productName', label: 'Product', sortable: true, resizable: true },
    { id: 'cancellationDate', label: 'Cancellation Date', sortable: true, resizable: true },
    { id: 'reason', label: 'Reason', sortable: true, resizable: true },
    { id: 'daysActive', label: 'Days Active', sortable: true, resizable: true },
    { id: 'autoRenewEnabled', label: 'Auto-Renew', sortable: true, resizable: true },
    { id: 'firstIssueReceived', label: 'First Issue Received', sortable: true, resizable: true },
    { id: 'refundAmount', label: 'Refund Amount', sortable: true, resizable: true }
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
    storageKey: 'churn-cancellation-details-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: churnData?.cancellations || [],
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

  // Render cell content
  const renderCellContent = (cancellation: any, columnId: string) => {
    switch (columnId) {
      case 'customerId':
        return <span className="font-medium">{cancellation.customerId}</span>;
      case 'productName':
        return cancellation.productName;
      case 'cancellationDate':
        return cancellation.cancellationDate;
      case 'reason':
        return (
          <Badge variant="outline" className="text-xs">
            {cancellation.reason}
          </Badge>
        );
      case 'daysActive':
        return cancellation.daysActive;
      case 'autoRenewEnabled':
        return (
          <Badge 
            variant={cancellation.autoRenewEnabled ? "success" : "error"} 
            className="text-xs"
          >
            {cancellation.autoRenewEnabled ? 'Yes' : 'No'}
          </Badge>
        );
      case 'firstIssueReceived':
        return (
          <Badge 
            variant={cancellation.firstIssueReceived ? "success" : "error"} 
            className="text-xs"
          >
            {cancellation.firstIssueReceived ? 'Yes' : 'No'}
          </Badge>
        );
      case 'refundAmount':
        return cancellation.refundAmount > 0 ? (
          <span className="text-red-600 font-medium">
            ${cancellation.refundAmount.toFixed(2)}
          </span>
        ) : (
          <span className="text-gray-400">$0.00</span>
        );
      default:
        return '';
    }
  };

  const chartConfig = {
    count: {
      label: "Cancellations",
      color: "#ef4444"
    },
    refunds: {
      label: "Refunds",
      color: "#f97316"
    }
  };

  const reasonColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4', '#8b5cf6'];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <UserX className="h-5 w-5" />
              Churn & Cancellation Report
            </CardTitle>
            <HelpTooltip helpId="churn-cancellation-report" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !churnData) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <UserX className="h-5 w-5" />
              Churn & Cancellation Report
            </CardTitle>
            <HelpTooltip helpId="churn-cancellation-report" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            Error loading churn data
          </div>
        </CardContent>
      </Card>
    );
  }

  const { summary, cancellations, reasonBreakdown, monthlyTrend } = churnData;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        {/* Page heading already exists - no changes needed */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Total Cancellations
              <HelpTooltip helpId="churn-total-cancellations" />
            </CardTitle>
            <UserX className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-1">{summary.totalCancellations.toLocaleString()}</div>
            <p className="text-xs text-gray-600">Last 12 months</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Avg Days to Cancel
              <HelpTooltip helpId="churn-avg-days-to-cancel" />
            </CardTitle>
            <Calendar className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-1">{summary.avgDaysToCancel}</div>
            <p className="text-xs text-gray-600">From acquisition</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Total Refunds
              <HelpTooltip helpId="churn-total-refunds" />
            </CardTitle>
            <DollarSign className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 mb-1">${summary.totalRefunds.toLocaleString()}</div>
            <p className="text-xs text-gray-600">{summary.refundRate}% refund rate</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Early Cancellations
              <HelpTooltip helpId="churn-early-cancellations" />
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">{summary.earlyCancellations}</div>
            <p className="text-xs text-gray-600">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-1">
              <TrendingDown className="h-5 w-5" />
              Monthly Cancellation Trend
              <HelpTooltip helpId="churn-monthly-trend" />
            </CardTitle>
            <p className="text-sm text-gray-600">Cancellations over the last 12 months</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    fontSize={12} 
                    tick={{ fill: '#0369a1' }} 
                  />
                  <YAxis 
                    fontSize={12} 
                    tick={{ fill: '#0369a1' }} 
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="cancellations" 
                    fill="var(--color-count)" 
                    radius={[2, 2, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Cancellation Reasons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-1">
              <AlertTriangle className="h-5 w-5" />
              Top Cancellation Reasons
              <HelpTooltip helpId="churn-cancellation-reasons" />
            </CardTitle>
            <p className="text-sm text-gray-600">Why subscribers are leaving</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reasonBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {reasonBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={reasonColors[index % reasonColors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Cancellations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            <UserX className="h-5 w-5" />
            Recent Cancellations Details
            <HelpTooltip helpId="churn-cancellation-details" />
          </CardTitle>
          <p className="text-sm text-gray-600">Detailed view of individual cancellations</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['daysActive', 'refundAmount'].includes(column.id);
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
                {sortedData.slice(0, 15).map((cancellation) => (
                  <TableRow key={cancellation.id} className="hover:bg-gray-50">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['daysActive', 'refundAmount'].includes(column.id);
                      return (
                        <TableCell 
                          key={column.id} 
                          className={`py-2.5 px-4 text-sm ${isRightAligned ? 'text-right' : ''}`}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: '80px'
                          }}
                        >
                          {renderCellContent(cancellation, column.id)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-sm text-gray-600 px-4 pb-4">
              Showing 15 of {summary.totalCancellations} total cancellations
            </div>
          </div>
        </CardContent>
      </Card>

      <ScrollToTopButton />
    </div>
  );
};

export default ChurnCancellationReport;