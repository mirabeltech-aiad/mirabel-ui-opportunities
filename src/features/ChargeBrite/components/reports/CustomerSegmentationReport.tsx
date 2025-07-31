import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, TrendingDown, DollarSign, Target, Settings2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import { HelpTooltip } from '@/components';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
interface CustomerSegment {
  id: string;
  segmentName: string;
  customerCount: number;
  mrr: number;
  arpa: number;
  churnRate: number;
  growthRate: number;
  category: 'Plan-Based' | 'Lifecycle' | 'Behavioral' | 'Size-Based';
  characteristics: string[];
}
interface CustomerSegmentationReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const CustomerSegmentationReport: React.FC<CustomerSegmentationReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real customer segmentation data from Supabase
  const { data: segmentData, isLoading, error } = useQuery({
    queryKey: ['customer-segmentation', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getCustomerSegmentationData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  // Extract data with fallbacks
  const {
    overallMetrics = {
      totalCustomers: 0,
      totalMRR: 0,
      averageARPA: 0,
      overallChurnRate: 0,
      segmentCount: 0
    },
    customerSegments = [],
    chartData = []
  } = segmentData || {};

  // Initialize sorting functionality - MUST be called before any conditional returns
  const { sortedData: sortedSegments, sortConfig, requestSort, getSortIcon } = useSorting<CustomerSegment>({
    data: customerSegments,
    initialSort: {
      key: 'segmentName',
      direction: 'asc',
      dataType: 'string'
    }
  });

  // State for column visibility and compact mode
  const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>({
    segmentName: true,
    category: true,
    customerCount: true,
    mrr: true,
    arpa: true,
    churnRate: true,
    riskLevel: true,
    growthRate: true,
    characteristics: true
  });
  
  const [isCompactMode, setIsCompactMode] = React.useState(false);

  // Define column configuration for drag-and-drop and resizing
  const tableColumns = [
    { id: 'segmentName', label: 'Segment Name', sortable: true, resizable: true },
    { id: 'category', label: 'Category', sortable: true, resizable: true },
    { id: 'customerCount', label: 'Customer Count', sortable: true, resizable: true },
    { id: 'mrr', label: 'MRR', sortable: true, resizable: true },
    { id: 'arpa', label: 'ARPA', sortable: true, resizable: true },
    { id: 'churnRate', label: 'Churn Rate', sortable: true, resizable: true },
    { id: 'riskLevel', label: 'Risk Level', sortable: false, resizable: true },
    { id: 'growthRate', label: 'Growth Trend', sortable: true, resizable: true },
    { id: 'characteristics', label: 'Key Characteristics', sortable: false, resizable: true }
  ];

  // Initialize table column manager for drag-and-drop and resizing
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
    storageKey: 'customer-segmentation-table'
  });

  // Filter visible columns
  const visibleColumnOrder = columnOrder.filter(column => visibleColumns[column.id]);

  // Handle column visibility toggle
  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnId]: visible
    }));
  };

  // Column configuration for sorting (separate from drag-and-drop)
  const sortingColumns = [
    { key: 'segmentName', label: 'Segment Name', dataType: 'string' as const },
    { key: 'category', label: 'Category', dataType: 'string' as const },
    { key: 'customerCount', label: 'Customer Count', dataType: 'number' as const },
    { key: 'mrr', label: 'MRR', dataType: 'currency' as const },
    { key: 'arpa', label: 'ARPA', dataType: 'currency' as const },
    { key: 'churnRate', label: 'Churn Rate', dataType: 'percentage' as const },
    { key: 'growthRate', label: 'Growth Trend', dataType: 'percentage' as const }
  ];

  const handleSort = (columnKey: string, dataType: 'string' | 'number' | 'currency' | 'percentage') => {
    requestSort(columnKey, dataType);
  };

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

  // Render cell content based on column
  const renderCellContent = (segment: CustomerSegment, columnId: string) => {
    switch (columnId) {
      case 'segmentName':
        return <span className="font-medium">{segment.segmentName}</span>;
      case 'category':
        return getCategoryBadge(segment.category);
      case 'customerCount':
        return <span className="font-medium">{segment.customerCount.toLocaleString()}</span>;
      case 'mrr':
        return <span className="font-bold">{segment.mrr > 0 ? `$${(segment.mrr / 1000).toFixed(0)}K` : '-'}</span>;
      case 'arpa':
        return <span className="font-medium">{segment.arpa > 0 ? `$${segment.arpa.toFixed(2)}` : '-'}</span>;
      case 'churnRate':
        return `${segment.churnRate.toFixed(1)}%`;
      case 'riskLevel':
        return getChurnRiskBadge(segment.churnRate);
      case 'growthRate':
        return getGrowthTrend(segment.growthRate);
      case 'characteristics':
        return (
          <div className="max-w-xs">
            <div className="flex flex-wrap gap-1">
              {segment.characteristics.slice(0, 2).map((char, index) => (
                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {char}
                </span>
              ))}
              {segment.characteristics.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{segment.characteristics.length - 2} more
                </span>
              )}
            </div>
          </div>
        );
      default:
        return '';
    }
  };

  if (isLoading) {
    return <div className="animate-fade-in">Loading customer segmentation data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading customer segmentation data</div>;
  }
  const getCategoryBadge = (category: string) => {
    const styles = {
      'Plan-Based': 'bg-blue-100 text-blue-800 border-blue-200',
      'Lifecycle': 'bg-green-100 text-green-800 border-green-200',
      'Behavioral': 'bg-purple-100 text-purple-800 border-purple-200',
      'Size-Based': 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return <Badge variant="outline" className={styles[category as keyof typeof styles]}>
        {category}
      </Badge>;
  };
  const getChurnRiskBadge = (churnRate: number) => {
    if (churnRate < 3) return <Badge className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>;
    if (churnRate < 7) return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk</Badge>;
    if (churnRate < 15) return <Badge className="bg-orange-100 text-orange-800 border-orange-200">High Risk</Badge>;
    return <Badge className="bg-red-100 text-red-800 border-red-200">Critical</Badge>;
  };
  const getGrowthTrend = (growthRate: number) => {
    if (growthRate > 0) {
      return <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="h-3 w-3" />
          <span className="text-xs font-medium">+{growthRate}%</span>
        </div>;
    } else if (growthRate < 0) {
      return <div className="flex items-center gap-1 text-red-600">
          <TrendingDown className="h-3 w-3" />
          <span className="text-xs font-medium">{growthRate}%</span>
        </div>;
    } else {
      return <div className="flex items-center gap-1 text-gray-500">
          <span className="text-xs">0%</span>
        </div>;
    }
  };
  const chartConfig = {
    mrr: {
      label: 'MRR',
      color: 'hsl(var(--chart-1))'
    }
  };
  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}

      {/* Key Metrics Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Total Customers
              <HelpTooltip helpId="total-customers-segmentation" />
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{overallMetrics.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-gray-600">
              across {overallMetrics.segmentCount} segments
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Total MRR
              <HelpTooltip helpId="total-mrr-segmentation" />
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">${(overallMetrics.totalMRR / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-gray-600">
              monthly recurring revenue
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Average ARPA
              <HelpTooltip helpId="average-arpa" />
            </CardTitle>
            <Target className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">${overallMetrics.averageARPA}</div>
            <p className="text-xs text-gray-600">
              average revenue per account
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Overall Churn Rate
              <HelpTooltip helpId="overall-churn-rate" />
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 mb-1">{overallMetrics.overallChurnRate}%</div>
            <p className="text-xs text-gray-600">
              monthly churn rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MRR by Segment Chart */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">MRR by Customer Segment</CardTitle>
            <HelpTooltip helpId="mrr-by-customer-segment" />
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={chartData}>
              <XAxis dataKey="segment" tick={{
              fontSize: 12
            }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{
              fontSize: 12
            }} tickFormatter={value => `$${(value / 1000).toFixed(0)}K`} />
              <ChartTooltip content={<ChartTooltipContent />} formatter={value => [`$${(Number(value) / 1000).toFixed(0)}K`, 'MRR']} />
              <Bar dataKey="mrr" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Customer Segments Table */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Detailed Segment Analysis</CardTitle>
              <HelpTooltip helpId="detailed-segment-analysis" />
            </div>
            
            {/* Manage Columns Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50">
                  <Settings2 className="h-4 w-4 text-ocean-800" />
                  Manage Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg z-50">
                <div className="p-3">
                  <div className="text-sm font-medium text-gray-700 mb-3">Manage Columns</div>
                  <div className="space-y-2">
                    {tableColumns.map((column) => (
                      <div key={column.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={column.id}
                          checked={visibleColumns[column.id]}
                          onCheckedChange={(checked) => handleColumnVisibilityChange(column.id, checked as boolean)}
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={column.id}
                          className="text-sm text-gray-700 cursor-pointer flex-1"
                        >
                          {column.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <DropdownMenuSeparator className="my-3" />
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor="compact-mode" className="text-sm text-gray-700">
                      Compact Table
                    </label>
                    <Switch
                      id="compact-mode"
                      checked={isCompactMode}
                      onCheckedChange={setIsCompactMode}
                      className="h-5 w-9"
                    />
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {visibleColumnOrder.map((column) => {
                  const isSortable = column.id !== 'riskLevel' && column.id !== 'characteristics';
                  const sortDataType = 
                    column.id === 'segmentName' || column.id === 'category' ? 'string' :
                    column.id === 'customerCount' ? 'number' :
                    column.id === 'mrr' || column.id === 'arpa' ? 'currency' :
                    column.id === 'churnRate' || column.id === 'growthRate' ? 'percentage' : 'string';
                  
                  return (
                    <TableHead
                      key={column.id}
                      className={`relative ${isCompactMode ? 'h-9 py-1.5 px-2' : 'h-11 py-2.5 px-4'} font-medium text-muted-foreground select-none ${
                        isSortable ? 'cursor-pointer hover:bg-gray-100' : ''
                      } ${column.id === 'customerCount' || column.id === 'mrr' || column.id === 'arpa' || column.id === 'churnRate' ? 'text-right' : ''}`}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, column.id)}
                      onDragOver={(e) => handleDragOver(e, column.id)}
                      onDragEnd={handleDragEnd}
                      onClick={isSortable ? () => handleSort(column.id, sortDataType as any) : undefined}
                      style={{
                        width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                        minWidth: '80px',
                        cursor: draggedColumn === column.id ? 'grabbing' : (isSortable ? 'pointer' : 'grab')
                      }}
                    >
                      <div className={`flex items-center gap-1 flex-1 ${
                        column.id === 'customerCount' || column.id === 'mrr' || column.id === 'arpa' || column.id === 'churnRate' ? 'justify-end' : ''
                      }`}>
                        <span className={isCompactMode ? 'text-xs' : ''}>{column.label}</span>
                        {isSortable && getSortIcon(column.id) && (
                          <span className="text-ocean-500 font-normal">{getSortIcon(column.id)}</span>
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
              {sortedSegments.map(segment => (
                <TableRow key={segment.id} className="hover:bg-gray-50">
                  {visibleColumnOrder.map((column) => (
                    <TableCell 
                      key={column.id} 
                      className={`${isCompactMode ? 'py-1.5 px-2 text-xs' : 'py-2.5 px-4'} ${
                        column.id === 'customerCount' || column.id === 'mrr' || column.id === 'arpa' || column.id === 'churnRate' ? 'text-right' : ''
                      }`}
                      style={{
                        width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                        minWidth: '80px'
                      }}
                    >
                      {renderCellContent(segment, column.id)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Segmentation Insights */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Segmentation Insights</CardTitle>
            <HelpTooltip helpId="segmentation-insights" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">High-Value Segments</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• Enterprise customers drive 51% of total MRR with lowest churn (1.2%)</li>
                <li>• Champions segment shows exceptional retention (0.8% churn)</li>
                <li>• Power Users demonstrate strong engagement and advocacy</li>
                <li>• Mid-Market segment shows healthy growth (12.3%) and expansion potential</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Areas for Improvement</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• At-Risk segment needs immediate intervention (25.8% churn)</li>
                <li>• Trial Users require better conversion strategies (68.5% churn)</li>
                <li>• New Customers need enhanced onboarding (8.9% churn)</li>
                <li>• Basic Plan users show high churn potential (7.3%)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default CustomerSegmentationReport;