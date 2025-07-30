
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PredictiveRisk } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';

interface PredictiveRiskTableProps {
  data: PredictiveRisk[];
}

const PredictiveRiskTable: React.FC<PredictiveRiskTableProps> = ({ data }) => {
  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'customer', label: 'Customer', sortable: true, resizable: true },
    { id: 'currentMrr', label: 'Monthly MRR', sortable: true, resizable: true },
    { id: 'riskScore', label: 'Risk Score', sortable: true, resizable: true },
    { id: 'riskLevel', label: 'Risk Level', sortable: true, resizable: true },
    { id: 'primaryRiskFactor', label: 'Risk Factor', sortable: true, resizable: true },
    { id: 'daysToChurn', label: 'Days to Churn', sortable: true, resizable: true },
    { id: 'recommendations', label: 'Recommendations', sortable: true, resizable: true }
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
    storageKey: 'predictive-risk-columns'
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

  const getRiskBadgeVariant = (score: number) => {
    if (score >= 80) return 'destructive';
    if (score >= 60) return 'orange';
    if (score >= 40) return 'secondary';
    return 'outline';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Predictive Churn Risk Scoring</CardTitle>
          <HelpTooltip helpId="predictive-churn-risk" />
        </div>
        <CardDescription>AI-powered churn risk analysis for high-value customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['currentMrr', 'riskScore', 'daysToChurn'].includes(column.id);
                  return (
                    <th
                      key={column.id}
                      className={`relative py-2.5 px-4 font-medium text-muted-foreground cursor-pointer hover:bg-gray-100 select-none ${
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
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((customer) => (
                <tr key={customer.customerId} className="border-b hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['currentMrr', 'riskScore', 'daysToChurn'].includes(column.id);
                    return (
                      <td 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {column.id === 'customer' && (
                          <span className="font-medium">{customer.customerName}</span>
                        )}
                        {column.id === 'currentMrr' && `$${customer.currentMrr.toLocaleString()}`}
                        {column.id === 'riskScore' && (
                          <span className="font-bold">{customer.riskScore}</span>
                        )}
                        {column.id === 'riskLevel' && (
                          <Badge variant={getRiskBadgeVariant(customer.riskScore)}>
                            {getRiskLevel(customer.riskScore)}
                          </Badge>
                        )}
                        {column.id === 'primaryRiskFactor' && (
                          <span className="max-w-xs truncate block">{customer.primaryRiskFactor}</span>
                        )}
                        {column.id === 'daysToChurn' && customer.daysToChurn}
                        {column.id === 'recommendations' && (
                          <Badge variant="outline" className="text-xs">
                            {customer.recommendations}
                          </Badge>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-orange-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-orange-800">Risk Score Interpretation</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Badge variant="destructive" className="text-xs">Critical</Badge>
              <span className="text-gray-700">80+ Score</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="orange" className="text-xs">High</Badge>
              <span className="text-gray-700">60-79 Score</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">Medium</Badge>
              <span className="text-gray-700">40-59 Score</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">Low</Badge>
              <span className="text-gray-700">0-39 Score</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveRiskTable;
