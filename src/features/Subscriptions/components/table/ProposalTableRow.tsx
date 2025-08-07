
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import TableStatusBadge from "./TableStatusBadge";
import TableStageBadge from "./TableStageBadge";
import { designUtils } from "../../styles/designTokens";

interface ProposalTableRowProps {
  proposal: any;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  columnOrder: any[];
  columnWidths: Record<string, number>;
  onCompanySelect: (company: string) => void;
  selectedCompany: string;
  onEditProposal: (proposalId: string) => void;
}

const ProposalTableRow: React.FC<ProposalTableRowProps> = ({ 
  proposal, 
  isSelected, 
  onSelect, 
  columnOrder, 
  columnWidths, 
  onCompanySelect, 
  selectedCompany,
  onEditProposal
}) => {
  if (!proposal) return null;

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    if ((e.target as Element).closest('input, button, select, a, [role="button"], [role="checkbox"]')) {
      return;
    }
    
    // Single click selects/deselects the row
    onSelect(!isSelected);
  };

  const handleRowDoubleClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    if ((e.target as Element).closest('input, button, select, a, [role="button"], [role="checkbox"]')) {
      return;
    }
    
    // Double click opens edit
    onEditProposal(proposal.id);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCompanyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCompanySelect?.(proposal.company);
  };

  const getRepColor = (repName: string) => {
    if (!repName) return designUtils.generateAvatarColor("Unknown");
    return designUtils.generateAvatarColor(repName);
  };

  const renderCellContent = (columnId: string) => {
    switch (columnId) {
      case 'status':
        return <TableStatusBadge status={proposal.status} />;
      case 'name':
        return <span className="font-medium text-gray-900">{proposal.name}</span>;
      case 'company':
        return (
          <button
            className={`text-left font-medium cursor-pointer hover:text-ocean-600 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-1 rounded-sm px-1 ${
              selectedCompany === proposal.company ? 'font-bold text-ocean-600' : 'text-gray-900'
            }`}
            onClick={handleCompanyClick}
            title="Click to view company details"
            aria-label={`View details for ${proposal.company}`}
          >
            {proposal.company}
          </button>
        );
      case 'assignedRep':
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
              style={{ backgroundColor: getRepColor(proposal.assignedRep) }}
            >
              {proposal.assignedRep?.substring(0, 2)?.toUpperCase() || 'CK'}
            </div>
          </div>
        );
      case 'stage':
        return <TableStageBadge stage={proposal.stage} />;
      case 'amount':
        return <span className="font-medium text-gray-900">{typeof proposal.amount === 'number' ? `$${proposal.amount.toLocaleString()}.00` : proposal.amount}</span>;
      default:
        return <span className="text-gray-900">{proposal[columnId] || ''}</span>;
    }
  };

  return (
    <TableRow 
      className={`cursor-pointer transition-colors duration-200 ${
        isSelected 
          ? 'bg-blue-50 hover:bg-blue-100 border-blue-200' 
          : 'hover:bg-gray-50'
      }`}
      onClick={handleRowClick}
      onDoubleClick={handleRowDoubleClick}
      title="Click to select, double-click to edit"
      tabIndex={0}
      role="row"
      aria-selected={isSelected}
    >
      <TableCell className="w-8 py-2.5 px-4">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={onSelect}
          onClick={handleCheckboxClick}
          className="focus:ring-ocean-500"
          aria-label={`Select proposal ${proposal.name}`}
        />
      </TableCell>
      {columnOrder.map((column) => (
        <TableCell 
          key={column.id} 
          className="min-w-[80px] truncate py-2.5 px-4 text-sm"
          style={{
            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
            maxWidth: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined
          }}
        >
          {renderCellContent(column.id)}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default ProposalTableRow;
