
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CohortRetention } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';

interface CohortRevenueRetentionProps {
  data: CohortRetention[];
}

const CohortRevenueRetention: React.FC<CohortRevenueRetentionProps> = ({ data }) => {
  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'cohort', label: 'Cohort', sortable: true, resizable: true },
    { id: 'month1', label: 'Month 1', sortable: true, resizable: true },
    { id: 'month3', label: 'Month 3', sortable: true, resizable: true },
    { id: 'month6', label: 'Month 6', sortable: true, resizable: true },
    { id: 'month12', label: 'Month 12', sortable: true, resizable: true },
    { id: 'averageMrr', label: 'Avg MRR', sortable: true, resizable: true }
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
    storageKey: 'cohort-retention-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: data || [],
    initialSort: undefined
  });

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

  const getCellColor = (value: number) => {
    if (value >= 80) return 'bg-green-100 text-green-800';
    if (value >= 70) return 'bg-yellow-100 text-yellow-800';
    if (value >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Cohort Revenue Retention Analysis</CardTitle>
          <HelpTooltip helpId="cohort-revenue-retention" />
        </div>
        <CardDescription>Revenue retention rates by customer acquisition cohort</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['averageMrr'].includes(column.id);
                  const isCenterAligned = ['month1', 'month3', 'month6', 'month12'].includes(column.id);
                  return (
                    <th
                      key={column.id}
                      className={`relative py-2.5 px-4 font-medium text-muted-foreground cursor-pointer hover:bg-gray-100 select-none ${
                        isRightAligned ? 'text-right' : isCenterAligned ? 'text-center' : 'text-left'
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
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((cohort, index) => (
                <tr key={cohort.cohort} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  {columnOrder.map((column) => {
                    const isRightAligned = ['averageMrr'].includes(column.id);
                    const isCenterAligned = ['month1', 'month3', 'month6', 'month12'].includes(column.id);
                    return (
                      <td 
                        key={column.id} 
                        className={`py-2.5 px-4 ${
                          isRightAligned ? 'text-right font-medium text-gray-900' : 
                          isCenterAligned ? 'text-center' : 'font-medium text-gray-900'
                        }`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {column.id === 'cohort' && cohort.cohort}
                        {column.id === 'month1' && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getCellColor(cohort.month1)}`}>
                            {cohort.month1}%
                          </span>
                        )}
                        {column.id === 'month3' && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getCellColor(cohort.month3)}`}>
                            {cohort.month3}%
                          </span>
                        )}
                        {column.id === 'month6' && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getCellColor(cohort.month6)}`}>
                            {cohort.month6}%
                          </span>
                        )}
                        {column.id === 'month12' && (
                          cohort.month12 > 0 ? (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCellColor(cohort.month12)}`}>
                              {cohort.month12}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )
                        )}
                        {column.id === 'averageMrr' && `$${cohort.averageMrr}`}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800">Cohort Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">Best Performing Cohort:</span>
              <span className="ml-1">Jan 2024 (95.2% Month 1 retention)</span>
            </div>
            <div>
              <span className="font-medium">Highest MRR Cohort:</span>
              <span className="ml-1">Jan 2024 ($285 average)</span>
            </div>
            <div>
              <span className="font-medium">12-Month Retention Range:</span>
              <span className="ml-1">63.1% - 68.4%</span>
            </div>
            <div>
              <span className="font-medium">Revenue Retention Trend:</span>
              <span className="ml-1">Improving over time</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CohortRevenueRetention;
