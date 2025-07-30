
import { useMemo, useState, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
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
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '../../services/reports';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import { Users, FileText, Globe, RefreshCw } from 'lucide-react';
import ProductFilter from '../filters/ProductFilter';
import { HelpTooltip } from '../../components';
import { useTableColumnManager } from '../../hooks/useTableColumnManager';
import { useSorting } from '../../hooks/useSorting';
import { getDataTypeFromColumn } from '../../utils/sortingUtils';

const ActiveSubscriberSummaryReport = () => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  const [dateRange, setDateRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  const handleDateRangeChange = useCallback((startDate?: Date, endDate?: Date) => {
    setDateRange({
      startDate,
      endDate
    });
  }, []);

  // Use React Query to fetch real data from Supabase
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['active-subscriptions', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getSubscriptions({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  // Calculate summary metrics from real data
  const activeSubscriptions = subscriptions?.filter((sub: any) => sub.status === 'active') || [];
  const totalActive = activeSubscriptions.length;

  // Subscription type breakdown
  const subscriptionTypes = {
    paid: activeSubscriptions.filter((sub: any) => sub.status === 'active' && sub.monthly_revenue > 0).length,
    comp: activeSubscriptions.filter((sub: any) => sub.monthly_revenue === 0).length,
    trial: subscriptions?.filter((sub: any) => sub.status === 'trial').length || 0
  };

  // Format breakdown based on product type
  const formatBreakdown = {
    print: activeSubscriptions.filter((sub: any) => sub.products?.product_type === 'Print Only').length,
    digital: activeSubscriptions.filter((sub: any) => sub.products?.product_type === 'Digital Only').length,
    combo: activeSubscriptions.filter((sub: any) => sub.products?.product_type === 'Print + Digital').length
  };

  // Source breakdown from customer acquisition channel
  const sourceBreakdown = activeSubscriptions.reduce((acc: any, sub: any) => {
    const channel = sub.customers?.acquisition_channel || 'Unknown';
    acc[channel] = (acc[channel] || 0) + 1;
    return acc;
  }, {});

  // Auto-renewal breakdown from subscription data
  const renewalBreakdown = {
    autoRenewal: activeSubscriptions.filter((sub: any) => sub.auto_renew === true).length,
    manual: activeSubscriptions.filter((sub: any) => sub.auto_renew === false).length
  };

  // Prepare data for the table with sorting functionality - moved before conditional returns
  const tableData = useMemo(() => [
    { metric: 'Total Active Subscribers', count: totalActive, percentage: 100.0, isParent: true },
    { metric: 'Print Format', count: formatBreakdown.print, percentage: (formatBreakdown.print / totalActive * 100), isParent: false },
    { metric: 'Digital Format', count: formatBreakdown.digital, percentage: (formatBreakdown.digital / totalActive * 100), isParent: false },
    { metric: 'Combo Format', count: formatBreakdown.combo, percentage: (formatBreakdown.combo / totalActive * 100), isParent: false }
  ], [totalActive, formatBreakdown.print, formatBreakdown.digital, formatBreakdown.combo]);

  // Define table columns - moved before conditional returns
  const tableColumns = useMemo(() => [
    { id: 'metric', label: 'Metric', sortable: true, resizable: true },
    { id: 'count', label: 'Count', sortable: true, resizable: true },
    { id: 'percentage', label: 'Percentage', sortable: true, resizable: true }
  ], []);

  // Initialize table column management - moved before conditional returns
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
    storageKey: 'active-subscribers-breakdown-columns'
  });

  // Initialize sorting functionality - moved before conditional returns
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: tableData,
    initialSort: undefined
  });

  if (isLoading) {
    return <div>Loading active subscriber summary...</div>;
  }

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
  const renderCellContent = (row: any, columnId: string) => {
    switch (columnId) {
      case 'metric':
        return (
          <span className={`text-sm ${row.isParent ? 'font-medium' : 'pl-4'}`}>
            {row.metric}
          </span>
        );
      case 'count':
        return <span className="text-sm text-right">{row.count.toLocaleString()}</span>;
      case 'percentage':
        return <span className="text-sm text-right">{row.percentage.toFixed(1)}%</span>;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <ProductFilter dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Total Active Subscribers: <span className="font-bold text-lg">{totalActive.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-ocean-800">By Subscription Type</CardTitle>
              <HelpTooltip helpId="active-subscribers-by-type" />
            </div>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="py-2.5 text-sm font-medium">Paid</TableCell>
                  <TableCell className="py-2.5 text-sm text-right">{subscriptionTypes.paid.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2.5 text-sm font-medium">Comp</TableCell>
                  <TableCell className="py-2.5 text-sm text-right">{subscriptionTypes.comp.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2.5 text-sm font-medium">Trial</TableCell>
                  <TableCell className="py-2.5 text-sm text-right">{subscriptionTypes.trial.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-ocean-800">By Format</CardTitle>
              <HelpTooltip helpId="active-subscribers-by-format" />
            </div>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="py-2.5 text-sm font-medium">Print</TableCell>
                  <TableCell className="py-2.5 text-sm text-right">{formatBreakdown.print.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2.5 text-sm font-medium">Digital</TableCell>
                  <TableCell className="py-2.5 text-sm text-right">{formatBreakdown.digital.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2.5 text-sm font-medium">Combo</TableCell>
                  <TableCell className="py-2.5 text-sm text-right">{formatBreakdown.combo.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-ocean-800">By Source</CardTitle>
              <HelpTooltip helpId="active-subscribers-by-source" />
            </div>
            <Globe className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {Object.entries(sourceBreakdown).slice(0, 5).map(([source, count]) => (
                  <TableRow key={source}>
                    <TableCell className="py-2.5 text-sm font-medium capitalize">{source.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                    <TableCell className="py-2.5 text-sm text-right">{(count as number).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-ocean-800">By Auto-Renewal</CardTitle>
              <HelpTooltip helpId="active-subscribers-by-renewal" />
            </div>
            <RefreshCw className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="py-2.5 text-sm font-medium">Auto-Renewal</TableCell>
                  <TableCell className="py-2.5 text-sm text-right">{renewalBreakdown.autoRenewal.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-2.5 text-sm font-medium">Manual</TableCell>
                  <TableCell className="py-2.5 text-sm text-right">{renewalBreakdown.manual.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Detailed Breakdown</CardTitle>
            <HelpTooltip helpId="active-subscribers-detailed-breakdown" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['count', 'percentage'].includes(column.id);
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
              {sortedData.map((row, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['count', 'percentage'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {renderCellContent(row, column.id)}
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

export default ActiveSubscriberSummaryReport;
