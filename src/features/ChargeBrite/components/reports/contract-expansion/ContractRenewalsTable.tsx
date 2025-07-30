
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ContractRenewal } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface ContractRenewalsTableProps {
  data: ContractRenewal[];
}

const ContractRenewalsTable: React.FC<ContractRenewalsTableProps> = ({ data }) => {
  // Define column configuration
  const columns = [
    { id: 'customer', label: 'Customer', sortable: true, resizable: true },
    { id: 'originalValue', label: 'Original Value', sortable: true, resizable: true },
    { id: 'renewalDate', label: 'Renewal Date', sortable: true, resizable: true },
    { id: 'renewalValue', label: 'Renewal Value', sortable: true, resizable: true },
    { id: 'expansionAmount', label: 'Expansion Amount', sortable: true, resizable: true },
    { id: 'expansionPercentage', label: 'Expansion %', sortable: true, resizable: true },
    { id: 'outcome', label: 'Outcome', sortable: true, resizable: true },
    { id: 'healthScore', label: 'Health Score', sortable: true, resizable: true }
  ];

  // Initialize column manager
  const {
    columnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useTableColumnManager({
    columns,
    storageKey: 'contract-renewals-table'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: data || [],
    initialSort: undefined
  });

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'secondary';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

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

  // Render cell content based on column
  const renderCellContent = (contract: ContractRenewal, columnId: string) => {
    switch (columnId) {
      case 'customer':
        return <span className="font-medium">{contract.customerName}</span>;
      case 'originalValue':
        return `$${contract.originalValue.toLocaleString()}`;
      case 'renewalDate':
        return contract.renewalDate;
      case 'renewalValue':
        return `$${contract.renewalValue.toLocaleString()}`;
      case 'expansionAmount':
        return `$${contract.expansionAmount.toLocaleString()}`;
      case 'expansionPercentage':
        return `${contract.expansionPercentage}%`;
      case 'outcome':
        return (
          <Badge variant={contract.outcome === 'expanded' ? 'green' : contract.outcome === 'churned' ? 'destructive' : 'secondary'}>
            {contract.outcome}
          </Badge>
        );
      case 'healthScore':
        return (
          <span className={`font-semibold ${getHealthScoreColor(contract.healthScore)}`}>
            {contract.healthScore}
          </span>
        );
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Contract Renewals Analysis</CardTitle>
          <HelpTooltip helpId="contract-renewals-table" />
        </div>
        <CardDescription>Detailed analysis of upcoming contract renewals with expansion opportunities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['originalValue', 'renewalValue', 'expansionAmount', 'expansionPercentage', 'healthScore'].includes(column.id);
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
              {sortedData.map((contract, index) => (
                <TableRow key={contract.id} className="hover:bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['originalValue', 'renewalValue', 'expansionAmount', 'expansionPercentage', 'healthScore'].includes(column.id);
                    return (
                      <TableCell 
                        key={column.id} 
                        className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px'
                        }}
                      >
                        {renderCellContent(contract, column.id)}
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

export default ContractRenewalsTable;
