
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface SubscriptionRenewalReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

interface RenewalAccount {
  id: string;
  customerName: string;
  email: string;
  renewalDate: string;
  previousMRR: number;
  newMRR: number;
  mrrImpact: number;
  action: 'renewed' | 'lost' | 'pending' | 'upgraded' | 'downgraded';
  segment: 'SMB' | 'Mid-Market' | 'Enterprise';
  daysToRenewal?: number;
  contractLength: number;
  product: string;
}

const SubscriptionRenewalReport: React.FC<SubscriptionRenewalReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real subscription renewal data from Supabase
  const { data: renewalReportData, isLoading, error } = useQuery({
    queryKey: ['subscription-renewal', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getSubscriptionRenewalData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'customerName', label: 'Customer', sortable: true, resizable: true },
    { id: 'renewalDate', label: 'Renewal Date', sortable: true, resizable: true },
    { id: 'product', label: 'Product', sortable: true, resizable: true },
    { id: 'segment', label: 'Segment', sortable: true, resizable: true },
    { id: 'action', label: 'Action', sortable: true, resizable: true },
    { id: 'previousMRR', label: 'Previous MRR', sortable: true, resizable: true },
    { id: 'newMRR', label: 'New MRR', sortable: true, resizable: true },
    { id: 'mrrImpact', label: 'MRR Impact', sortable: true, resizable: true }
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
    storageKey: 'subscription-renewal-columns'
  });

  // Extract data with safe defaults
  const {
    totalRenewals = 0,
    completedRenewals = 0,
    completionRate = 0,
    pendingRenewals = 0,
    totalMRRAtRisk = 0,
    mrrRetained = 0,
    mrrLost = 0,
    netMRRGrowth = 0,
    renewalAccounts = []
  } = renewalReportData || {};

  // Initialize sorting functionality - must be called before any conditional returns
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: renewalAccounts,
    initialSort: { key: 'renewalDate', direction: 'desc', dataType: 'date' }
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading subscription renewal data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading subscription renewal data</div>;
  }

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

  const getActionBadge = (action: string) => {
    const styles = {
      renewed: 'bg-green-100 text-green-800 border-green-200',
      upgraded: 'bg-blue-100 text-blue-800 border-blue-200',
      downgraded: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      lost: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return <Badge className={styles[action as keyof typeof styles]}>
        {action.charAt(0).toUpperCase() + action.slice(1)}
      </Badge>;
  };

  const formatMRRImpact = (impact: number) => {
    if (impact === 0) return '$0';
    const prefix = impact > 0 ? '+' : '';
    return `${prefix}$${impact.toLocaleString()}`;
  };

  const getMRRImpactColor = (impact: number) => {
    if (impact > 0) return 'text-green-600';
    if (impact < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const renderCellContent = (account: any, columnId: string) => {
    switch (columnId) {
      case 'customerName':
        return (
          <div>
            <div className="font-medium">{account.customerName}</div>
            <div className="text-sm text-gray-500">{account.email}</div>
          </div>
        );
      case 'renewalDate':
        return (
          <div>
            <div>{new Date(account.renewalDate).toLocaleDateString()}</div>
            {account.daysToRenewal && (
              <div className="text-sm text-orange-600">
                {account.daysToRenewal} days to go
              </div>
            )}
          </div>
        );
      case 'product':
        return account.product;
      case 'segment':
        return <Badge variant="outline">{account.segment}</Badge>;
      case 'action':
        return getActionBadge(account.action);
      case 'previousMRR':
        return `$${account.previousMRR.toLocaleString()}`;
      case 'newMRR':
        return account.action === 'lost' ? '-' : `$${account.newMRR.toLocaleString()}`;
      case 'mrrImpact':
        return (
          <span className={`font-medium ${getMRRImpactColor(account.mrrImpact)}`}>
            {formatMRRImpact(account.mrrImpact)}
          </span>
        );
      default:
        return '';
    }
  };

  return <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Renewal Completion Rate
              <HelpTooltip helpId="renewal-completion-rate" />
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-600">
              {completedRenewals} of {totalRenewals} renewals
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              MRR Retained
              <HelpTooltip helpId="mrr-retained" />
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">${(mrrRetained / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-600">from completed renewals</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Pending Renewals
              <HelpTooltip helpId="pending-renewals" />
            </CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">{pendingRenewals}</div>
            <p className="text-xs text-gray-600">
              ${(totalMRRAtRisk / 1000).toFixed(0)}K MRR at risk
            </p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Net MRR Impact
              <HelpTooltip helpId="net-mrr-impact" />
            </CardTitle>
            <DollarSign className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-1 ${netMRRGrowth >= 0 ? 'text-rose-600' : 'text-red-600'}`}>
              {netMRRGrowth >= 0 ? '+' : ''}${(netMRRGrowth / 1000).toFixed(1)}K
            </div>
            <p className="text-xs text-gray-600">net change this cycle</p>
          </CardContent>
        </Card>
      </div>

      {/* Renewal Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Successful Renewals</p>
                <p className="text-2xl font-bold text-green-600">
                  {renewalAccounts.filter(acc => acc.action === 'renewed' || acc.action === 'upgraded').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Lost Renewals</p>
                <p className="text-2xl font-bold text-red-600">
                  {renewalAccounts.filter(acc => acc.action === 'lost').length}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Pending Actions</p>
                <p className="text-2xl font-bold text-orange-600">
                  {renewalAccounts.filter(acc => acc.action === 'pending').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Renewal Accounts Table */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Renewal Account Details</CardTitle>
            <HelpTooltip helpId="renewal-account-details" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['previousMRR', 'newMRR', 'mrrImpact'].includes(column.id);
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
                {sortedData.map(account => (
                  <TableRow key={account.id} className="hover:bg-gray-50 transition-colors duration-200">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['previousMRR', 'newMRR', 'mrrImpact'].includes(column.id);
                      return (
                        <TableCell 
                          key={column.id} 
                          className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: '80px'
                          }}
                        >
                          {renderCellContent(account, column.id)}
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

      {/* Summary Analysis */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Renewal Analysis Summary</CardTitle>
            <HelpTooltip helpId="renewal-analysis-summary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Key Insights</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• Enterprise segment shows highest retention rate at 85%</li>
                <li>• 12% of renewals resulted in upgrades, adding $12.4K MRR</li>
                <li>• SMB segment accounts for 60% of lost renewals</li>
                <li>• Average contract length for renewed accounts: 18 months</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Action Items</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• Follow up on 118 pending renewals within next 7 days</li>
                <li>• Implement retention campaign for SMB segment</li>
                <li>• Analyze reasons for Enterprise churn cases</li>
                <li>• Prepare upsell proposals for successful renewals</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};

export default SubscriptionRenewalReport;
