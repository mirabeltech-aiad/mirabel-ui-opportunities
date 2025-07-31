
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { useTableColumnManager } from '../../hooks/useTableColumnManager';
import { useSorting } from '../../hooks/useSorting';
import { getDataTypeFromColumn } from '../../utils/sortingUtils';
import HelpTooltip from '../../components/shared/HelpTooltip';

const SalesFunnelConversionReport = () => {
  // Funnel data with conversion rates
  const funnelData = useMemo(() => [
    { stage: 'Prospects', count: 10000, conversionRate: 65.0, fill: '#3b82f6' },
    { stage: 'Qualified Leads', count: 6500, conversionRate: 49.2, fill: '#8b5cf6' },
    { stage: 'Opportunities', count: 3200, conversionRate: 57.8, fill: '#10b981' },
    { stage: 'Proposals Sent', count: 1850, conversionRate: 75.7, fill: '#f59e0b' },
    { stage: 'Closed Won', count: 1400, conversionRate: null, fill: '#22c55e' }
  ], []);

  // Opportunities by stage data
  const opportunitiesData = useMemo(() => [
    {
      id: 'OPP-001',
      company: 'TechCorp Solutions',
      stage: 'Qualified Leads',
      assignedRep: 'Sarah Johnson',
      dealSize: 45000,
      conversionAge: 12,
      probability: 25,
      lastActivity: '2024-01-15'
    },
    {
      id: 'OPP-002',
      company: 'Global Manufacturing Inc',
      stage: 'Opportunities',
      assignedRep: 'Mike Chen',
      dealSize: 125000,
      conversionAge: 8,
      probability: 60,
      lastActivity: '2024-01-18'
    },
    {
      id: 'OPP-003',
      company: 'StartupVenture Ltd',
      stage: 'Proposals Sent',
      assignedRep: 'Emily Rodriguez',
      dealSize: 28000,
      conversionAge: 4,
      probability: 85,
      lastActivity: '2024-01-20'
    },
    {
      id: 'OPP-004',
      company: 'Enterprise Systems Co',
      stage: 'Opportunities',
      assignedRep: 'David Wilson',
      dealSize: 85000,
      conversionAge: 18,
      probability: 45,
      lastActivity: '2024-01-14'
    },
    {
      id: 'OPP-005',
      company: 'Innovation Labs',
      stage: 'Qualified Leads',
      assignedRep: 'Lisa Thompson',
      dealSize: 65000,
      conversionAge: 6,
      probability: 30,
      lastActivity: '2024-01-19'
    },
    {
      id: 'OPP-006',
      company: 'MediaGroup Holdings',
      stage: 'Proposals Sent',
      assignedRep: 'Sarah Johnson',
      dealSize: 95000,
      conversionAge: 2,
      probability: 90,
      lastActivity: '2024-01-21'
    },
    {
      id: 'OPP-007',
      company: 'FinTech Innovations',
      stage: 'Opportunities',
      assignedRep: 'Mike Chen',
      dealSize: 150000,
      conversionAge: 14,
      probability: 55,
      lastActivity: '2024-01-16'
    },
    {
      id: 'OPP-008',
      company: 'HealthCare Plus',
      stage: 'Qualified Leads',
      assignedRep: 'Emily Rodriguez',
      dealSize: 75000,
      conversionAge: 10,
      probability: 35,
      lastActivity: '2024-01-17'
    }
  ], []);

  // Define table columns for drag-and-drop functionality
  const tableColumns = useMemo(() => [
    { id: 'id', label: 'Opportunity ID', sortable: true, resizable: true },
    { id: 'company', label: 'Company', sortable: true, resizable: true },
    { id: 'stage', label: 'Stage', sortable: true, resizable: true },
    { id: 'assignedRep', label: 'Assigned Rep', sortable: true, resizable: true },
    { id: 'dealSize', label: 'Deal Size', sortable: true, resizable: true },
    { id: 'probability', label: 'Probability', sortable: true, resizable: true },
    { id: 'conversionAge', label: 'Age (Days)', sortable: true, resizable: true },
    { id: 'lastActivity', label: 'Last Activity', sortable: true, resizable: true }
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
    storageKey: 'sales-funnel-opportunities-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: opportunitiesData,
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

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(221, 83%, 53%)",
    },
  };

  const getStageColor = (stage: string) => {
    const stageColors = {
      'Qualified Leads': 'text-purple-600 bg-purple-50',
      'Opportunities': 'text-green-600 bg-green-50',
      'Proposals Sent': 'text-orange-600 bg-orange-50'
    };
    return stageColors[stage as keyof typeof stageColors] || 'text-gray-600 bg-gray-50';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return 'text-green-600';
    if (probability >= 50) return 'text-yellow-600';
    if (probability >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const getAgeColor = (age: number) => {
    if (age <= 7) return 'text-green-600';
    if (age <= 14) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Render cell content
  const renderCellContent = (opportunity: any, columnId: string) => {
    switch (columnId) {
      case 'id':
        return <span className="font-medium text-blue-600">{opportunity.id}</span>;
      case 'company':
        return <div className="font-medium text-gray-900">{opportunity.company}</div>;
      case 'stage':
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStageColor(opportunity.stage)}`}>
            {opportunity.stage}
          </span>
        );
      case 'assignedRep':
        return <span className="text-gray-900">{opportunity.assignedRep}</span>;
      case 'dealSize':
        return <span className="font-bold text-green-600">${opportunity.dealSize.toLocaleString()}</span>;
      case 'probability':
        return (
          <span className={`font-medium ${getProbabilityColor(opportunity.probability)}`}>
            {opportunity.probability}%
          </span>
        );
      case 'conversionAge':
        return (
          <span className={`font-medium ${getAgeColor(opportunity.conversionAge)}`}>
            {opportunity.conversionAge}
          </span>
        );
      case 'lastActivity':
        return <span className="text-gray-600">{opportunity.lastActivity}</span>;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Total Prospects
              <HelpTooltip helpId="sales-funnel-total-prospects" />
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">10,000</div>
            <p className="text-xs text-muted-foreground">
              In sales funnel
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Overall Conversion
              <HelpTooltip helpId="sales-funnel-overall-conversion" />
            </CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">14%</div>
            <p className="text-xs text-muted-foreground">
              Prospect to closed won
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Active Opportunities
              <HelpTooltip helpId="sales-funnel-active-opportunities" />
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">3,200</div>
            <p className="text-xs text-muted-foreground">
              In pipeline
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Pipeline Value
              <HelpTooltip helpId="sales-funnel-pipeline-value" />
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">$2.1M</div>
            <p className="text-xs text-muted-foreground">
              Total opportunity value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="flex items-center text-ocean-800">
              <TrendingUp className="w-5 h-5 mr-2" />
              Sales Funnel Conversion Rates
            </CardTitle>
            <HelpTooltip helpId="sales-funnel-conversion-rates" />
          </div>
          <CardDescription>
            Conversion rates between each stage of the sales funnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="stage" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p className="text-blue-600">
                            Count: {data.count.toLocaleString()}
                          </p>
                          {data.conversionRate && (
                            <p className="text-green-600">
                              Conversion Rate: {data.conversionRate}%
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          {/* Conversion Rate Labels */}
          <div className="mt-4 flex justify-center flex-wrap gap-4 text-sm">
            {funnelData.map((stage, index) => (
              index < funnelData.length - 1 && (
                <div key={stage.stage} className="text-center">
                  <span className="text-gray-600">{stage.stage} → {funnelData[index + 1].stage}:</span>
                  <span className="ml-1 font-semibold text-green-600">{stage.conversionRate}%</span>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="flex items-center text-ocean-800">
              <Target className="w-5 h-5 mr-2" />
              Active Opportunities by Stage
            </CardTitle>
            <HelpTooltip helpId="sales-funnel-opportunities-table" />
          </div>
          <CardDescription>
            Detailed breakdown of opportunities with assigned reps, deal sizes, and conversion metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isCenterAligned = ['probability', 'conversionAge'].includes(column.id);
                  const isRightAligned = ['dealSize'].includes(column.id);
                  return (
                    <TableHead
                      key={column.id}
                      className={`relative cursor-pointer hover:bg-gray-100 font-medium text-muted-foreground select-none h-11 py-2.5 px-4 ${
                        isCenterAligned ? 'text-center' : isRightAligned ? 'text-right' : 'text-left'
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
                        isCenterAligned ? 'justify-center' : isRightAligned ? 'justify-end' : 'justify-start'
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
              {sortedData.length > 0 ? sortedData.map((opportunity, index) => (
                <TableRow key={opportunity.id} className="hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isCenterAligned = ['probability', 'conversionAge'].includes(column.id);
                    const isRightAligned = ['dealSize'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isCenterAligned ? 'text-center' : isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {renderCellContent(opportunity, column.id)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={columnOrder.length} className="p-8 text-center text-gray-500">
                    No opportunities data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Opportunities:</span>
                <span className="ml-2 font-semibold text-blue-600">{sortedData.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Pipeline Value:</span>
                <span className="ml-2 font-semibold text-blue-600">
                  ${sortedData.reduce((sum, opp) => sum + opp.dealSize, 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Average Deal Size:</span>
                <span className="ml-2 font-semibold text-blue-600">
                  ${Math.round(sortedData.reduce((sum, opp) => sum + opp.dealSize, 0) / sortedData.length).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Weighted Pipeline:</span>
                <span className="ml-2 font-semibold text-blue-600">
                  ${Math.round(sortedData.reduce((sum, opp) => sum + (opp.dealSize * opp.probability / 100), 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesFunnelConversionReport;
