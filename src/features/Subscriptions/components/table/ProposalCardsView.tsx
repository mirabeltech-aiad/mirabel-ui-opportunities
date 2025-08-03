
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil } from "lucide-react";
import TableStatusBadge from "./TableStatusBadge";
import TableStageBadge from "./TableStageBadge";

interface ProposalCardsViewProps {
  proposals: any[];
  selectedRows: Set<string>;
  onRowSelect: (id: string, checked: boolean) => void;
  onCompanySelect: (company: string) => void;
  selectedCompany: string;
}

const ProposalCardsView: React.FC<ProposalCardsViewProps> = ({
  proposals,
  selectedRows,
  onRowSelect,
  onCompanySelect,
  selectedCompany
}) => {
  const getRepColor = (repName: string) => {
    if (!repName) return "bg-gray-500";
    
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
      "bg-orange-500", "bg-cyan-500", "bg-lime-500", "bg-rose-500"
    ];
    
    const colorIndex = repName.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const handleEditClick = (proposalId: string) => {
    // Edit proposal functionality
  };

  const handleCompanyClick = (e: React.MouseEvent, company: string) => {
    e.preventDefault();
    e.stopPropagation();
    onCompanySelect?.(company);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedRows.has(proposal.id)}
                    onCheckedChange={(checked) => onRowSelect(proposal.id, !!checked)}
                  />
                  <button 
                    onClick={() => handleEditClick(proposal.id)}
                    className="hover:bg-gray-100 p-1 rounded"
                  >
                    <Pencil className="h-4 w-4 text-yellow-500 hover:text-yellow-600" />
                  </button>
                </div>
                <TableStatusBadge status={proposal.status} />
              </div>
              <CardTitle className="text-lg font-medium text-blue-600 hover:underline cursor-pointer">
                {proposal.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Company:</span>
                <div 
                  className={`font-medium cursor-pointer hover:text-blue-600 ${
                    selectedCompany === proposal.company ? 'font-bold text-blue-600' : ''
                  }`}
                  onClick={(e) => handleCompanyClick(e, proposal.company)}
                >
                  {proposal.company}
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Amount:</span>
                <div className="font-medium text-lg">
                  {typeof proposal.amount === 'number' ? `$${proposal.amount.toLocaleString()}.00` : proposal.amount}
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Created:</span>
                <div>{proposal.createdDate}</div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Stage:</span>
                <div className="mt-1">
                  <TableStageBadge stage={proposal.stage} />
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Assigned Rep:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-6 h-6 ${getRepColor(proposal.assignedRep)} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                    {proposal.assignedRep?.substring(0, 2)?.toUpperCase() || 'CK'}
                  </div>
                  <span className="text-sm">{proposal.assignedRep}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProposalCardsView;
