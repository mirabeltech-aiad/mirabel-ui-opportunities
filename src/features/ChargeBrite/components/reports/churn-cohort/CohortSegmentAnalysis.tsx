
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CohortSegmentData } from './types';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface CohortSegmentAnalysisProps {
  data: CohortSegmentData[];
}

const CohortSegmentAnalysis: React.FC<CohortSegmentAnalysisProps> = ({ data }) => {
  // Ensure data is an array and provide fallback
  const validData = Array.isArray(data) ? data : [];

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'segment', label: 'Segment', sortable: true, resizable: true },
    { id: 'cohortCount', label: 'Cohort Count', sortable: true, resizable: true },
    { id: 'avgRetention12m', label: 'Avg Retention', sortable: true, resizable: true },
    { id: 'churnVelocity', label: 'Churn Velocity', sortable: true, resizable: true },
    { id: 'topPerformingCohort', label: 'Top Cohort', sortable: true, resizable: true },
    { id: 'bottomPerformingCohort', label: 'Bottom Cohort', sortable: true, resizable: true }
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
    storageKey: 'cohort-segment-analysis-columns'
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
  const renderCellContent = (segment: any, columnId: string) => {
    switch (columnId) {
      case 'segment':
        return <span className="font-medium">{segment.segment}</span>;
      case 'cohortCount':
        return <span>{segment.cohortCount || 0}</span>;
      case 'avgRetention12m':
        return <span className="font-medium text-blue-600">{segment.avgRetention12m?.toFixed(1) || '0.0'}%</span>;
      case 'churnVelocity':
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            (segment.churnVelocity || 0) < 0.15 ? 'bg-green-100 text-green-800' :
            (segment.churnVelocity || 0) < 0.20 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {segment.churnVelocity?.toFixed(2) || '0.00'}
          </span>
        );
      case 'topPerformingCohort':
        return <span className="text-green-600 font-medium">{segment.topPerformingCohort || 'N/A'}</span>;
      case 'bottomPerformingCohort':
        return <span className="text-red-600 font-medium">{segment.bottomPerformingCohort || 'N/A'}</span>;
      default:
        return '';
    }
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800">Cohort Performance by Segment</CardTitle>
          <CardDescription>Retention comparison across customer segments</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={validData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" fontSize={12} />
              <YAxis fontSize={12} label={{ value: 'Retention %', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Avg 12M Retention']} />
              <Bar dataKey="avgRetention12m" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800">Segment Cohort Details</CardTitle>
          <CardDescription>Best and worst performing cohorts by segment</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isCenterAligned = ['cohortCount', 'avgRetention12m', 'churnVelocity', 'topPerformingCohort', 'bottomPerformingCohort'].includes(column.id);
                  return (
                    <TableHead
                      key={column.id}
                      className={`relative cursor-pointer hover:bg-gray-100 font-medium text-muted-foreground select-none h-11 py-2.5 px-4 ${
                        isCenterAligned ? 'text-center' : 'text-left'
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
                        isCenterAligned ? 'justify-center' : 'justify-start'
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
              {sortedData.length > 0 ? sortedData.map((segment, index) => (
                <TableRow key={segment.segment} className="hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isCenterAligned = ['cohortCount', 'avgRetention12m', 'churnVelocity', 'topPerformingCohort', 'bottomPerformingCohort'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isCenterAligned ? 'text-center' : ''}`}
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
              )) : (
                <TableRow>
                  <TableCell colSpan={columnOrder.length} className="p-8 text-center text-gray-500">
                    No segment analysis data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CohortSegmentAnalysis;
