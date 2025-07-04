
import React from "react";
import OpportunityCardView from "./OpportunityCardView";

const ProposalCardView = ({
  proposals = [],
  view,
  onViewChange,
  filters,
  onFilterChange,
  onRefresh,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  sortConfig,
  onSort
}) => {
  // Transform proposal data to match the exact structure that OpportunityCardView expects
  const transformToOpportunityFormat = (proposalData) => {
    return proposalData.map(item => {
      // Handle both direct proposal objects and nested proposal structures
      const proposal = item.Proposal || item;
      const opportunity = item.Opportunity || item;
      
      return {
        id: proposal.ProposalID || proposal.ID || item.OpportunityID || item.id || Math.random().toString(36).substr(2, 9),
        opportunityName: proposal.Name || opportunity.Name || item.Name || 'Unnamed Proposal',
        companyName: opportunity.Customer || proposal.Customer || item.Customer || item.CompanyName || 'Unknown Company',
        amount: proposal.Amount || opportunity.Amount || item.Amount || 0,
        status: proposal.Status || opportunity.Status || item.Status || 'Unknown',
        stage: proposal.Stage || opportunity.Stage || item.Stage || 'Unknown Stage',
        projCloseDate: proposal.CloseDate || opportunity.CloseDate || item.CloseDate || item.ProjCloseDate || '',
        assignedRep: proposal.AssignedTo || opportunity.AssignedTo || item.AssignedTo || 'Unassigned',
        createdDate: proposal.CreatedDate || opportunity.CreatedDate || item.CreatedDate || '',
        probability: proposal.Probability || opportunity.Probability || item.Probability || 0,
        // Additional fields that might be present
        actualCloseDate: proposal.ActualCloseDate || opportunity.ActualCloseDate || item.ActualCloseDate || '',
        createdBy: proposal.CreatedBy || opportunity.CreatedBy || item.CreatedBy || '',
        type: proposal.Type || opportunity.Type || item.Type || '',
        priority: proposal.Priority || opportunity.Priority || item.Priority || '',
        department: proposal.Department || opportunity.Department || item.Department || '',
        source: proposal.Source || opportunity.Source || item.Source || '',
        // Proposal-specific fields
        proposalNumber: proposal.ProposalNumber || proposal.ID || '',
        submissionDate: proposal.SubmissionDate || '',
        validUntil: proposal.ValidUntil || ''
      };
    });
  };

  const transformedOpportunities = transformToOpportunityFormat(proposals);

  // Pass all props directly to OpportunityCardView with transformed data
  return (
    <OpportunityCardView
      opportunities={transformedOpportunities}
      view={view}
      onViewChange={onViewChange}
      filters={filters}
      onFilterChange={onFilterChange}
      onRefresh={onRefresh}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      totalItems={totalItems}
      sortConfig={sortConfig}
      onSort={onSort}
    />
  );
};

export default ProposalCardView;
