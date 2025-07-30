
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface ChurnPrediction {
  customerId: string;
  customerName: string;
  churnRiskScore: number;
  currentMRR: number;
  predictionConfidence: number;
  keyRiskFactors: string[];
  timeToChurn: string;
  recommendedActions: string[];
  accountManager: string;
}

interface PredictiveNetChurnModelProps {
  data: ChurnPrediction[];
}

const PredictiveNetChurnModel: React.FC<PredictiveNetChurnModelProps> = ({ data }) => {
  // Ensure data is an array and provide fallback
  const validData = Array.isArray(data) ? data : [];
  
  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'customerName', label: 'Customer Name', sortable: true, resizable: true },
    { id: 'churnRiskScore', label: 'Risk Score', sortable: true, resizable: true },
    { id: 'currentMRR', label: 'Current MRR', sortable: true, resizable: true },
    { id: 'predictionConfidence', label: 'Confidence', sortable: true, resizable: true },
    { id: 'timeToChurn', label: 'Time to Churn', sortable: true, resizable: true },
    { id: 'keyRiskFactors', label: 'Risk Factors', sortable: false, resizable: true },
    { id: 'accountManager', label: 'Account Manager', sortable: true, resizable: true },
    { id: 'recommendedActions', label: 'Actions', sortable: false, resizable: true }
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
    storageKey: 'predictive-churn-model-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: validData,
    initialSort: { key: 'churnRiskScore', direction: 'desc', dataType: 'number' }
  });

  const getRiskBadgeVariant = (score: number) => {
    if (score >= 80) return 'destructive';
    if (score >= 60) return 'default';
    if (score >= 40) return 'secondary';
    return 'outline';
  };

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 85) return 'default';
    if (confidence >= 70) return 'secondary';
    return 'outline';
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

  const renderCellContent = (prediction: ChurnPrediction, columnId: string) => {
    switch (columnId) {
      case 'customerName':
        return <span className="font-medium">{prediction.customerName || 'N/A'}</span>;
      case 'churnRiskScore':
        return (
          <Badge variant={getRiskBadgeVariant(prediction.churnRiskScore || 0)}>
            {prediction.churnRiskScore || 0}%
          </Badge>
        );
      case 'currentMRR':
        return <span className="font-medium">${(prediction.currentMRR || 0).toLocaleString()}</span>;
      case 'predictionConfidence':
        return (
          <Badge variant={getConfidenceBadgeVariant(prediction.predictionConfidence || 0)}>
            {prediction.predictionConfidence || 0}%
          </Badge>
        );
      case 'timeToChurn':
        return <span className="text-sm">{prediction.timeToChurn || 'N/A'}</span>;
      case 'keyRiskFactors':
        const riskFactors = Array.isArray(prediction.keyRiskFactors) ? prediction.keyRiskFactors : [];
        return (
          <div className="flex flex-wrap gap-1">
            {riskFactors.slice(0, 2).map((factor, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {factor}
              </Badge>
            ))}
            {riskFactors.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{riskFactors.length - 2}
              </Badge>
            )}
            {riskFactors.length === 0 && (
              <span className="text-gray-400 text-xs">No factors</span>
            )}
          </div>
        );
      case 'accountManager':
        return <span className="text-sm">{prediction.accountManager || 'Unassigned'}</span>;
      case 'recommendedActions':
        const actions = Array.isArray(prediction.recommendedActions) ? prediction.recommendedActions : [];
        return (
          <div className="flex flex-wrap gap-1">
            {actions.slice(0, 1).map((action, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {action}
              </Badge>
            ))}
            {actions.length > 1 && (
              <Badge variant="secondary" className="text-xs">
                +{actions.length - 1}
              </Badge>
            )}
            {actions.length === 0 && (
              <span className="text-gray-400 text-xs">No actions</span>
            )}
          </div>
        );
      default:
        return '';
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Predictive Churn Model</CardTitle>
          <HelpTooltip helpId="predictive-churn-model" />
        </div>
        <div className="text-sm text-gray-600">
          AI-powered predictions identifying customers at risk of churning
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columnOrder.map((column) => {
                const isRightAligned = ['churnRiskScore', 'currentMRR', 'predictionConfidence'].includes(column.id);
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
            {sortedData.length > 0 ? sortedData.slice(0, 20).map((prediction) => (
              <TableRow key={prediction.customerId} className="hover:bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['churnRiskScore', 'currentMRR', 'predictionConfidence'].includes(column.id);
                  return (
                    <TableCell 
                      key={column.id} 
                      className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                      style={{
                        width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                        minWidth: '80px'
                      }}
                    >
                      {renderCellContent(prediction, column.id)}
                    </TableCell>
                  );
                })}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={columnOrder.length} className="p-8 text-center text-gray-500">
                  No predictive data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PredictiveNetChurnModel;
