
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface CampaignData {
  channel: string;
  code: string;
  attempts: number;
  successes: number;
  rate: number;
}

interface CampaignPerformanceTableProps {
  campaignData: CampaignData[];
}

const CampaignPerformanceTable = ({ campaignData }: CampaignPerformanceTableProps) => {
  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'channel', label: 'Channel', sortable: true, resizable: true },
    { id: 'code', label: 'Campaign Code', sortable: true, resizable: true },
    { id: 'attempts', label: 'Attempts', sortable: true, resizable: true },
    { id: 'successes', label: 'Successes', sortable: true, resizable: true },
    { id: 'rate', label: 'Success Rate', sortable: true, resizable: true },
    { id: 'performance', label: 'Performance', sortable: false, resizable: true }
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
    storageKey: 'campaign-performance-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: campaignData,
    initialSort: { key: 'rate', direction: 'desc', dataType: 'percentage' }
  });

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 75) return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>;
    if (rate >= 65) return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Good</Badge>;
    if (rate >= 50) return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Average</Badge>;
    return <Badge className="bg-red-100 text-red-800 border-red-200">Needs Improvement</Badge>;
  };

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

  const renderCellContent = (campaign: CampaignData, columnId: string) => {
    switch (columnId) {
      case 'channel':
        return <span className="font-medium text-gray-900">{campaign.channel}</span>;
      case 'code':
        return <span className="text-gray-900">{campaign.code}</span>;
      case 'attempts':
        return <span className="text-gray-900">{campaign.attempts.toLocaleString()}</span>;
      case 'successes':
        return <span className="text-gray-900">{campaign.successes.toLocaleString()}</span>;
      case 'rate':
        return <span className="font-medium text-gray-900">{campaign.rate.toFixed(1)}%</span>;
      case 'performance':
        return getPerformanceBadge(campaign.rate);
      default:
        return '';
    }
  };

  return (
    <Card className="bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Campaign Performance Analysis</CardTitle>
          <HelpTooltip helpId="renewal-campaigns" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['attempts', 'successes', 'rate'].includes(column.id);
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
              {sortedData.map((campaign, index) => (
                <TableRow key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['attempts', 'successes', 'rate'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {renderCellContent(campaign, column.id)}
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
  );
};

export default CampaignPerformanceTable;
