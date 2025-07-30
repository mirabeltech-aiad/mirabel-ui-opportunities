
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CohortRevenueImpactData } from './types';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface CohortRevenueImpactProps {
  data: CohortRevenueImpactData[];
}

const CohortRevenueImpact: React.FC<CohortRevenueImpactProps> = ({ data }) => {
  // Ensure data is an array and provide fallback
  const validData = Array.isArray(data) ? data : [];

  const formatCurrency = (value?: number) => {
    if (!value) return '$0k';
    return `$${(value / 1000).toFixed(0)}k`;
  };

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'cohort', label: 'Cohort', sortable: true, resizable: true },
    { id: 'initialRevenue', label: 'Initial Revenue', sortable: true, resizable: true },
    { id: 'currentRevenue', label: 'Current Revenue', sortable: true, resizable: true },
    { id: 'revenueRetention', label: 'Retention %', sortable: true, resizable: true },
    { id: 'lostRevenue', label: 'Lost Revenue', sortable: true, resizable: true },
    { id: 'projectedLoss', label: 'Projected Loss', sortable: true, resizable: true }
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
    storageKey: 'cohort-revenue-impact-columns'
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

  // Render cell content
  const renderCellContent = (cohort: any, columnId: string) => {
    switch (columnId) {
      case 'cohort':
        return <span className="font-medium">{cohort.cohort}</span>;
      case 'initialRevenue':
        return <span>{formatCurrency(cohort.initialRevenue)}</span>;
      case 'currentRevenue':
        return <span className="font-medium text-blue-600">{formatCurrency(cohort.currentRevenue)}</span>;
      case 'revenueRetention':
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            (cohort.revenueRetention || 0) >= 80 ? 'bg-green-100 text-green-800' :
            (cohort.revenueRetention || 0) >= 70 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {cohort.revenueRetention?.toFixed(1) || '0.0'}%
          </span>
        );
      case 'lostRevenue':
        return <span className="text-red-600 font-medium">{formatCurrency(cohort.lostRevenue)}</span>;
      case 'projectedLoss':
        return <span className="text-orange-600">{formatCurrency(cohort.projectedLoss)}</span>;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-ocean-800">Revenue Impact by Cohort</CardTitle>
          <CardDescription>Current vs initial revenue and projected losses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={validData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cohort" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
              <Legend />
              <Bar dataKey="initialRevenue" fill="#94a3b8" name="Initial Revenue" />
              <Bar dataKey="currentRevenue" fill="#3b82f6" name="Current Revenue" />
              <Bar dataKey="lostRevenue" fill="#ef4444" name="Lost Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-ocean-800">Revenue Retention Analysis</CardTitle>
          <CardDescription>Detailed breakdown of revenue impact</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['initialRevenue', 'currentRevenue', 'lostRevenue', 'projectedLoss'].includes(column.id);
                  const isCenterAligned = ['revenueRetention'].includes(column.id);
                  return (
                    <TableHead
                      key={column.id}
                      className={`relative cursor-pointer hover:bg-gray-100 font-medium text-muted-foreground select-none h-11 py-2.5 px-4 ${
                        isRightAligned ? 'text-right' : isCenterAligned ? 'text-center' : 'text-left'
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
                        isRightAligned ? 'justify-end' : isCenterAligned ? 'justify-center' : 'justify-start'
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
              {sortedData.length > 0 ? sortedData.map((cohort, index) => (
                <TableRow key={cohort.cohort} className="hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['initialRevenue', 'currentRevenue', 'lostRevenue', 'projectedLoss'].includes(column.id);
                    const isCenterAligned = ['revenueRetention'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${
                          isRightAligned ? 'text-right' : isCenterAligned ? 'text-center' : ''
                        }`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {renderCellContent(cohort, column.id)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={columnOrder.length} className="p-8 text-center text-gray-500">
                    No revenue impact data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-800">Revenue Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-medium">Total Revenue at Risk:</span>
                <span className="ml-1 text-red-600 font-semibold">
                  {formatCurrency(validData.reduce((sum, cohort) => sum + (cohort.projectedLoss || 0), 0))}
                </span>
              </div>
              <div>
                <span className="font-medium">Average Revenue Retention:</span>
                <span className="ml-1 text-blue-600 font-semibold">
                  {validData.length > 0 ? 
                    (validData.reduce((sum, cohort) => sum + (cohort.revenueRetention || 0), 0) / validData.length).toFixed(1) : 
                    '0.0'
                  }%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CohortRevenueImpact;
