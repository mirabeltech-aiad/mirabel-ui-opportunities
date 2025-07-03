
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { Badge } from "@OpportunityComponents/ui/badge";
import { Button } from "@OpportunityComponents/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@OpportunityComponents/ui/dropdown-menu";
import ViewToggle from "./ViewToggle";

const ProposalKanbanView = ({ proposals = [], view, onViewChange }) => {
  // Group proposals by stage
  const groupedProposals = proposals.reduce((acc, proposal) => {
    const stage = proposal.stage || 'No Stage';
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(proposal);
    return acc;
  }, {});

  const stages = ['Initial Draft', 'Technical Review', 'Client Review', 'Final Approval', 'Contract Review', 'Technical Evaluation', 'Closed Won', 'Closed Lost'];
  
  // Ensure all stages exist even if empty
  stages.forEach(stage => {
    if (!groupedProposals[stage]) {
      groupedProposals[stage] = [];
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Submitted': 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Negotiation': 'bg-orange-100 text-orange-800',
      'Accepted': 'bg-emerald-100 text-emerald-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Proposals Kanban Board</h2>
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map(stage => (
          <div key={stage} className="min-w-[300px] bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{stage}</h3>
                <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                  {groupedProposals[stage].length}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {groupedProposals[stage].map(proposal => (
                <Card key={proposal.id} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium text-gray-900 line-clamp-2">
                          {proposal.name}
                        </CardTitle>
                        <p className="text-xs text-gray-500 mt-1">{proposal.company}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status}
                        </Badge>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(proposal.amount)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                          {proposal.assignedRep?.substring(0, 1) || 'U'}
                        </div>
                        <span className="text-xs text-gray-500">{proposal.assignedRep}</span>
                      </div>
                      
                      {proposal.projCloseDate && (
                        <div className="text-xs text-gray-500">
                          Due: {proposal.projCloseDate}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalKanbanView;
