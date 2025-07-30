import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users } from 'lucide-react';
import { useTableColumnManager } from '../../../hooks/useTableColumnManager';
import { useSorting } from '../../../hooks/useSorting';
import { getDataTypeFromColumn } from '../../../utils/sortingUtils';
import HelpTooltip from '../../../components/shared/HelpTooltip';

interface TrialData {
  id: string;
  userEmail: string;
  trialStartDate: string;
  conversionDate: string | null;
  channel: string;
  behaviorScore: number;
  resultingPlan: string | null;
  revenue: number;
}

interface TrialConversionDetailsTableProps {
  trialData: TrialData[];
}

const TrialConversionDetailsTable: React.FC<TrialConversionDetailsTableProps> = ({
  trialData
}) => {
  // Ensure data is an array and provide fallback
  const validData = Array.isArray(trialData) ? trialData : [];

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'id', label: 'Trial ID', sortable: true, resizable: true },
    { id: 'userEmail', label: 'User Email', sortable: true, resizable: true },
    { id: 'trialStartDate', label: 'Trial Start', sortable: true, resizable: true },
    { id: 'conversionDate', label: 'Conversion Date', sortable: true, resizable: true },
    { id: 'channel', label: 'Channel', sortable: true, resizable: true },
    { id: 'behaviorScore', label: 'Behavior Score', sortable: true, resizable: true },
    { id: 'resultingPlan', label: 'Resulting Plan', sortable: true, resizable: true },
    { id: 'revenue', label: 'Revenue', sortable: true, resizable: true },
    { id: 'status', label: 'Status', sortable: false, resizable: true }
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
    storageKey: 'trial-conversion-details-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: validData,
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

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusBadge = (conversionDate: string | null) => {
    if (conversionDate) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Converted</span>;
    }
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Trial Expired</span>;
  };

  // Render cell content
  const renderCellContent = (trial: TrialData, columnId: string) => {
    switch (columnId) {
      case 'id':
        return <span className="font-medium text-blue-600">{trial.id}</span>;
      case 'userEmail':
        return <span className="text-gray-900">{trial.userEmail}</span>;
      case 'trialStartDate':
        return <span className="text-gray-600">{trial.trialStartDate}</span>;
      case 'conversionDate':
        return <span className="text-gray-600">{trial.conversionDate || 'Not converted'}</span>;
      case 'channel':
        return <span className="text-gray-900">{trial.channel}</span>;
      case 'behaviorScore':
        return <span className={`font-medium ${getScoreColor(trial.behaviorScore)}`}>{trial.behaviorScore}</span>;
      case 'resultingPlan':
        return <span className="text-gray-900">{trial.resultingPlan || 'N/A'}</span>;
      case 'revenue':
        return <span className="font-medium text-green-600">${trial.revenue.toFixed(2)}</span>;
      case 'status':
        return getStatusBadge(trial.conversionDate);
      default:
        return '';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="flex items-center text-ocean-800">
            <Users className="w-5 h-5 mr-2" />
            Trial Conversion Details
          </CardTitle>
          <HelpTooltip helpId="trial-conversion-details" />
        </div>
        <CardDescription>
          Individual trial performance with behavior scores and conversion outcomes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columnOrder.map((column) => {
                const isCenterAligned = ['behaviorScore', 'status'].includes(column.id);
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
            {sortedData.length > 0 ? sortedData.map((trial, index) => (
              <TableRow key={trial.id} className="hover:bg-gray-50">
                {columnOrder.map((column) => {
                  const isCenterAligned = ['behaviorScore', 'status'].includes(column.id);
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
                  No trial conversion data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TrialConversionDetailsTable;