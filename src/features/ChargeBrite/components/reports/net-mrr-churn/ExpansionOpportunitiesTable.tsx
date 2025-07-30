
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

interface ExpansionOpportunity {
  customerId: string;
  customerName: string;
  currentMRR: number;
  expansionPotential: number;
  riskScore: number;
  lastActivity: string;
  accountManager: string;
  industry: string;
  upsellOpportunity: string;
}

interface ExpansionOpportunitiesTableProps {
  data: ExpansionOpportunity[];
}

const ExpansionOpportunitiesTable: React.FC<ExpansionOpportunitiesTableProps> = ({ data = [] }) => {
  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'customerName', label: 'Customer', sortable: true, resizable: true },
    { id: 'currentMRR', label: 'Current MRR', sortable: true, resizable: true },
    { id: 'expansionPotential', label: 'Expansion Potential', sortable: true, resizable: true },
    { id: 'riskScore', label: 'Risk Score', sortable: true, resizable: true },
    { id: 'upsellOpportunity', label: 'Opportunity', sortable: true, resizable: true },
    { id: 'accountManager', label: 'Account Manager', sortable: true, resizable: true }
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
    storageKey: 'expansion-opportunities-columns'
  });

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data,
    initialSort: { key: 'expansionPotential', direction: 'desc', dataType: 'currency' }
  });

  const getRiskBadgeVariant = (score: number) => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'default';
    return 'secondary';
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

  const renderCellContent = (opportunity: ExpansionOpportunity, columnId: string) => {
    switch (columnId) {
      case 'customerName':
        return (
          <div>
            <div className="font-medium">{opportunity.customerName}</div>
            <div className="text-sm text-gray-500">{opportunity.industry}</div>
          </div>
        );
      case 'currentMRR':
        return <span className="font-medium">${opportunity.currentMRR.toLocaleString()}</span>;
      case 'expansionPotential':
        return (
          <div className="text-green-600 font-medium">
            ${opportunity.expansionPotential.toLocaleString()}
          </div>
        );
      case 'riskScore':
        return (
          <Badge variant={getRiskBadgeVariant(opportunity.riskScore)}>
            {opportunity.riskScore}%
          </Badge>
        );
      case 'upsellOpportunity':
        return <span className="text-sm">{opportunity.upsellOpportunity}</span>;
      case 'accountManager':
        return <span className="text-sm">{opportunity.accountManager}</span>;
      default:
        return '';
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Expansion Opportunities</CardTitle>
          <HelpTooltip helpId="expansion-opportunities" />
        </div>
        <CardDescription>High-potential customers for upselling and expansion</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columnOrder.map((column) => {
                const isRightAligned = ['currentMRR', 'expansionPotential', 'riskScore'].includes(column.id);
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
            {sortedData.slice(0, 10).map((opportunity) => (
              <TableRow key={opportunity.customerId} className="hover:bg-gray-50">
                {columnOrder.map((column) => {
                  const isRightAligned = ['currentMRR', 'expansionPotential', 'riskScore'].includes(column.id);
                  return (
                    <TableCell 
                      key={column.id} 
                      className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                      style={{
                        width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                        minWidth: '80px'
                      }}
                    >
                      {renderCellContent(opportunity, column.id)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExpansionOpportunitiesTable;
