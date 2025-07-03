
import React from 'react';
import { TableCell, TableRow } from "@OpportunityComponents/ui/table";
import { Checkbox } from "@OpportunityComponents/ui/checkbox";
import { Button } from "@OpportunityComponents/ui/button";
import { useNavigate } from "react-router-dom";
import ProposalTableBadges from './ProposalTableBadges';

const ProposalTableRow = ({ proposal, isSelected, onSelect, onCompanySelect, selectedCompany }) => {
  const navigate = useNavigate();

  const handleRowClick = (e) => {
    // Prevent navigation when clicking on interactive elements
    if (e.target.closest('input, button, [role="button"], [data-radix-select-trigger]')) {
      return;
    }
    
    // Single click selects the row for bulk actions
    onSelect(!isSelected);
  };

  const handleRowDoubleClick = (e) => {
    // Prevent navigation when double-clicking on interactive elements
    if (e.target.closest('input, button, [role="button"], [data-radix-select-trigger]')) {
      return;
    }
    // Double click opens edit proposal
    navigate(`/edit-proposal/${proposal.id || proposal.ProposalID}`);
  };

  const handleCompanyClick = (e) => {
    e.stopPropagation();
    if (onCompanySelect) {
      onCompanySelect(proposal.company || proposal.Customer, proposal);
    }
  };

  const getRepColor = (repName) => {
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
    ];
    const colorIndex = repName ? repName.charCodeAt(0) % colors.length : 0;
    return colors[colorIndex];
  };

  return (
    <TableRow 
      className={`transition-colors border-b border-gray-100 cursor-pointer select-none ${
        isSelected 
          ? 'bg-blue-50 hover:bg-blue-100' 
          : 'hover:bg-gray-50'
      }`}
      onClick={handleRowClick}
      onDoubleClick={handleRowDoubleClick}
      title="Click to select, double-click to edit"
    >
      <TableCell className="w-12 px-4 py-2.5">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(checked)}
          onClick={(e) => e.stopPropagation()}
          className="focus:ring-ocean-500"
        />
      </TableCell>
      <TableCell className="px-4 py-2.5">
        <ProposalTableBadges.Status status={proposal.status} />
      </TableCell>
      <TableCell className="px-4 py-2.5">
        <div className="font-medium text-blue-600 text-sm cursor-pointer hover:text-blue-700 transition-colors">
          {proposal.name}
        </div>
      </TableCell>
      <TableCell className="px-4 py-2.5">
        <Button
          variant="link"
          className={`p-0 h-auto font-medium text-sm hover:underline transition-colors ${
            selectedCompany === (proposal.company || proposal.Customer) ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
          }`}
          onClick={handleCompanyClick}
        >
          {proposal.company || proposal.Customer}
        </Button>
      </TableCell>
      <TableCell className="px-4 py-2.5 text-sm text-gray-700">{proposal.createdDate}</TableCell>
      <TableCell className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${getRepColor(proposal.assignedRep)}`}>
            {proposal.assignedRep?.substring(0, 2)?.toUpperCase()}
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-2.5">
        <ProposalTableBadges.Stage stage={proposal.stage} />
      </TableCell>
      <TableCell className="px-4 py-2.5">
        <span className="font-medium text-sm text-gray-900">
          ${proposal.amount?.toLocaleString()}.00
        </span>
      </TableCell>
      <TableCell className="px-4 py-2.5 text-sm text-gray-700">{proposal.projCloseDate}</TableCell>
    </TableRow>
  );
};

export default ProposalTableRow;
