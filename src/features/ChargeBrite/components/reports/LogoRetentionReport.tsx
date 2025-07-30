
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, TrendingDown, UserRound } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface LogoRetentionReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

interface RetentionSegment {
  id: string;
  segment: string;
  cohort: string;
  tenure: string;
  totalLogos: number;
  retainedLogos: number;
  lostLogos: number;
  retentionRate: number;
  status: 'strong' | 'stable' | 'at-risk';
}

const LogoRetentionReport: React.FC<LogoRetentionReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real logo retention data from Supabase
  const { data: logoRetentionData, isLoading, error } = useQuery({
    queryKey: ['logo-retention', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getLogoRetentionData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'segment', label: 'Segment', sortable: true, resizable: true },
    { id: 'cohort', label: 'Cohort', sortable: true, resizable: true },
    { id: 'tenure', label: 'Tenure', sortable: true, resizable: true },
    { id: 'totalLogos', label: 'Total Logos', sortable: true, resizable: true },
    { id: 'retainedLogos', label: 'Retained', sortable: true, resizable: true },
    { id: 'lostLogos', label: 'Lost', sortable: true, resizable: true },
    { id: 'retentionRate', label: 'Retention Rate', sortable: true, resizable: true },
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
    storageKey: 'logo-retention-columns'
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading logo retention data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading logo retention data</div>;
  }

  const {
    currentRetentionRate = 0,
    totalActiveLogos = 0,
    retainedThisMonth = 0,
    lostThisMonth = 0,
    netLogoChange = 0,
    previousMonthRate = 0,
    retentionData = []
  } = logoRetentionData || {};

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: retentionData,
    initialSort: { key: 'retentionRate', direction: 'desc', dataType: 'percentage' }
  });

  const handleSort = (columnKey: string) => {
    const dataType = getDataTypeFromColumn(columnKey);
    requestSort(columnKey, dataType);
  };

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

  const getStatusBadge = (status: string) => {
    const styles = {
      strong: 'bg-green-100 text-green-800 border-green-200',
      stable: 'bg-blue-100 text-blue-800 border-blue-200',
      'at-risk': 'bg-red-100 text-red-800 border-red-200'
    };
    const labels = {
      strong: 'Strong',
      stable: 'Stable',
      'at-risk': 'At Risk'
    };
    return <Badge className={styles[status as keyof typeof styles]}>
        {labels[status as keyof typeof labels]}
      </Badge>;
  };

  const getRetentionColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-blue-600';
    return 'text-red-600';
  };

  const renderCellContent = (segment: any, columnId: string) => {
    switch (columnId) {
      case 'segment':
        return <Badge variant="outline">{segment.segment}</Badge>;
      case 'cohort':
        return segment.cohort;
      case 'tenure':
        return segment.tenure;
      case 'totalLogos':
        return segment.totalLogos.toLocaleString();
      case 'retainedLogos':
        return segment.retainedLogos.toLocaleString();
      case 'lostLogos':
        return segment.lostLogos.toLocaleString();
      case 'retentionRate':
        return `${segment.retentionRate.toFixed(1)}%`;
      case 'status':
        return getStatusBadge(segment.status);
      default:
        return '';
    }
  };

  const retentionChange = currentRetentionRate - previousMonthRate;

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Logo Retention Rate
              <HelpTooltip helpId="logo-retention-rate" />
            </CardTitle>
            <UserRound className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{currentRetentionRate}%</div>
            <div className="flex items-center gap-1 text-xs">
              {retentionChange >= 0 ? <TrendingUp className="h-3 w-3 text-green-600" /> : <TrendingDown className="h-3 w-3 text-red-600" />}
              <span className={retentionChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                {retentionChange >= 0 ? '+' : ''}{retentionChange.toFixed(1)}% vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Active Logos
              <HelpTooltip helpId="active-logos" />
            </CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">{totalActiveLogos.toLocaleString()}</div>
            <p className="text-xs text-gray-600">total customer count</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Logos Retained
              <HelpTooltip helpId="logos-retained" />
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">{retainedThisMonth.toLocaleString()}</div>
            <p className="text-xs text-gray-600">this month</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Logos Lost
              <HelpTooltip helpId="logos-lost" />
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 mb-1">{lostThisMonth}</div>
            <p className="text-xs text-gray-600">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Retention Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Strong Retention</p>
                <p className="text-2xl font-bold text-green-600">
                  {retentionData.filter(seg => seg.status === 'strong').length} segments
                </p>
                <p className="text-xs text-gray-600">90%+ retention rate</p>
              </div>
              <UserRound className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Stable Retention</p>
                <p className="text-2xl font-bold text-blue-600">
                  {retentionData.filter(seg => seg.status === 'stable').length} segments
                </p>
                <p className="text-xs text-gray-600">80-90% retention rate</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">At-Risk Segments</p>
                <p className="text-2xl font-bold text-red-600">
                  {retentionData.filter(seg => seg.status === 'at-risk').length} segments
                </p>
                <p className="text-xs text-gray-600">&lt;80% retention rate</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Retention Details Table */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Logo Retention by Segment, Cohort & Tenure</CardTitle>
            <HelpTooltip helpId="logo-retention-by-segment" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['totalLogos', 'retainedLogos', 'lostLogos', 'retentionRate'].includes(column.id);
                    return (
                      <TableHead
                        key={column.id}
                        className={`relative font-medium text-muted-foreground select-none h-11 py-2.5 px-4 ${
                          column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                        } ${isRightAligned ? 'text-right' : 'text-left'}`}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, column.id)}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => {
                          if (!e.defaultPrevented && column.sortable) {
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
                          {column.sortable && sortConfig.key === column.id && (
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
                {sortedData.map(segment => (
                  <TableRow key={segment.id} className="hover:bg-gray-50 transition-colors duration-200">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['totalLogos', 'retainedLogos', 'lostLogos', 'retentionRate'].includes(column.id);
                      return (
                        <TableCell 
                          key={column.id} 
                          className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''} ${
                            column.id === 'retentionRate' ? `font-bold ${getRetentionColor(segment.retentionRate)}` : ''
                          } ${
                            column.id === 'retainedLogos' ? 'text-green-600' : ''
                          } ${
                            column.id === 'lostLogos' ? 'text-red-600' : ''
                          } ${
                            column.id === 'totalLogos' ? 'font-medium' : ''
                          }`}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: '80px'
                          }}
                        >
                          {renderCellContent(segment, column.id)}
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

      {/* Analysis Summary */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Logo Retention Analysis</CardTitle>
            <HelpTooltip helpId="logo-retention-analysis" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Key Insights</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• Enterprise customers show strongest retention across all tenure periods</li>
                <li>• Logo retention improves significantly after 12+ months tenure</li>
                <li>• SMB segment requires attention in early months (3-6 month cohorts)</li>
                <li>• Overall retention rate improved by {retentionChange.toFixed(1)}% this month</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Recommended Actions</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• Implement enhanced onboarding for SMB 3-6 month cohorts</li>
                <li>• Focus retention efforts on customers with &lt;12 months tenure</li>
                <li>• Investigate success factors from strong Enterprise retention</li>
                <li>• Create early warning system for at-risk segments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoRetentionReport;
