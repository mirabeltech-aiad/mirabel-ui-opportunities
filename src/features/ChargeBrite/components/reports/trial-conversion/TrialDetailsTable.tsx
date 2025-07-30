import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface TrialData {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  trialStartDate: string;
  trialEndDate: string;
  trialDuration: number;
  subscriptionType: string;
  acquisitionSource: string;
  trialStatus: string;
  conversionDate: string | null;
  conversionDays: number | null;
  paidStartDate: string | null;
  paidSubscriptionValue: number | null;
  retentionStatus90Days: string | null;
  currentStatus: string;
  totalRevenue: number;
  engagementScore: number;
}

interface TrialDetailsTableProps {
  trialData: TrialData[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedSource: string;
  setSelectedSource: (value: string) => void;
}

export const TrialDetailsTable = ({
  trialData,
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedSource,
  setSelectedSource
}: TrialDetailsTableProps) => {
  
  // Ensure data is an array and provide fallback
  const validData = Array.isArray(trialData) ? trialData : [];

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'customerDetails', label: 'Customer Details', sortable: true, resizable: true },
    { id: 'trialPeriod', label: 'Trial Period', sortable: true, resizable: true },
    { id: 'subscriptionType', label: 'Subscription Type', sortable: true, resizable: true },
    { id: 'acquisitionSource', label: 'Source', sortable: true, resizable: true },
    { id: 'trialStatus', label: 'Trial Status', sortable: true, resizable: true },
    { id: 'conversion', label: 'Conversion', sortable: true, resizable: true },
    { id: 'retention', label: 'Retention', sortable: true, resizable: true },
    { id: 'revenue', label: 'Revenue', sortable: true, resizable: true }
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
    storageKey: 'trial-details-table-columns'
  });

  // Filter data based on search and filters
  const filteredData = validData.filter(trial => {
    const matchesSearch = trial.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        trial.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        trial.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || trial.trialStatus.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSource = selectedSource === 'all' || trial.acquisitionSource === selectedSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: filteredData,
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Converted':
        return <Badge variant="green">Converted</Badge>;
      case 'Expired':
        return <Badge variant="red">Expired</Badge>;
      case 'Active':
        return <Badge variant="blue">Active</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCurrentStatusBadge = (status: string) => {
    switch (status) {
      case 'Active Paid':
        return <Badge variant="green">Active Paid</Badge>;
      case 'Active Trial':
        return <Badge variant="blue">Active Trial</Badge>;
      case 'Trial Expired':
        return <Badge variant="outline">Expired</Badge>;
      case 'Cancelled':
        return <Badge variant="red">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Render cell content
  const renderCellContent = (trial: TrialData, columnId: string) => {
    switch (columnId) {
      case 'customerDetails':
        return (
          <div>
            <div className="font-medium text-gray-900">{trial.customerName}</div>
            <div className="text-sm text-gray-600">{trial.email}</div>
            <div className="text-xs text-gray-500">{trial.id}</div>
          </div>
        );
      case 'trialPeriod':
        return (
          <div className="text-sm">
            <div className="text-gray-900">Start: {trial.trialStartDate}</div>
            <div className="text-gray-900">End: {trial.trialEndDate}</div>
            <div className="text-xs text-gray-500">{trial.trialDuration} days</div>
          </div>
        );
      case 'subscriptionType':
        return <div className="text-sm text-gray-900">{trial.subscriptionType}</div>;
      case 'acquisitionSource':
        return <div className="text-sm text-gray-900">{trial.acquisitionSource}</div>;
      case 'trialStatus':
        return getStatusBadge(trial.trialStatus);
      case 'conversion':
        return trial.conversionDate ? (
          <div className="text-sm">
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-600" />
              <span className="text-gray-900">{trial.conversionDate}</span>
            </div>
            <div className="text-xs text-gray-500">{trial.conversionDays} days</div>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <X className="h-3 w-3 text-red-600" />
            <span className="text-sm text-gray-500">No conversion</span>
          </div>
        );
      case 'retention':
        return trial.retentionStatus90Days ? (
          <Badge variant={trial.retentionStatus90Days === 'Retained' ? 'green' : 'red'}>
            {trial.retentionStatus90Days}
          </Badge>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        );
      case 'revenue':
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">${trial.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Score: {trial.engagementScore}</div>
          </div>
        );
      default:
        return '';
    }
  };

  // Create an array of unique sources from the trial data
  const sources = [...new Set(validData.map(trial => trial.acquisitionSource))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-ocean-800 flex items-center gap-1">
          Trial Subscription Details
          <HelpTooltip helpId="trial-details-table" />
        </CardTitle>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Trial Statuses</option>
            <option value="converted">Converted</option>
            <option value="expired">Expired</option>
            <option value="active">Active</option>
          </select>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columnOrder.map((column) => {
                const isCenterAligned = ['trialStatus', 'retention'].includes(column.id);
                const isRightAligned = ['revenue'].includes(column.id);
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
            {sortedData.length > 0 ? sortedData.map((trial) => (
              <TableRow key={trial.id} className="hover:bg-gray-50 transition-colors duration-200">
                {columnOrder.map((column) => {
                  const isCenterAligned = ['trialStatus', 'retention'].includes(column.id);
                  const isRightAligned = ['revenue'].includes(column.id);
                  return (
                    <TableCell 
                      key={column.id} 
                      className={`py-2.5 px-4 ${isCenterAligned ? 'text-center' : isRightAligned ? 'text-right' : ''}`}
                      style={{
                        width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                        minWidth: '80px'
                      }}
                    >
                      {renderCellContent(trial, column.id)}
                    </TableCell>
                  );
                })}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={columnOrder.length} className="p-8 text-center text-gray-500">
                  No trial data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
