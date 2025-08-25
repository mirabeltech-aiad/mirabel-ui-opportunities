import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronUp, ChevronDown, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { renderCellContent } from '@OpportunityUtils/dynamicColumnMapper';
import { IsAdmin } from '@OpportunityConstants/opportunityOptions';
import { openPageInNextTab } from '@/utils/pageNavigation';
import ProposalTableHeader from './ProposalTableHeader';
import TruncatedText from '@/components/ui/TruncatedText';

const ProposalTableContent = ({
  columnOrder,
  sortConfig,
  requestSort,
  draggedColumn,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  selectAll,
  onSelectAll,
  columnWidths,
  onColumnResize,
  displayedItems,
  selectedRows,
  handleRowSelect,
  isLoading,
  observerRef,
  onCompanySelect,
  selectedCompany
}) => {
  const navigate = useNavigate();


  const getRepColor = (repName) => {
    if (!repName) return "bg-gray-500";
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
    ];
    const colorIndex = repName.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const getStatusBadgeVariant = (status) => {
    if (!status) return "blue";
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('accepted')) return "green";
    if (statusLower.includes('rejected') || statusLower.includes('lost')) return "red";
    if (statusLower.includes('review') || statusLower.includes('submitted')) return "blue";
    if (statusLower.includes('negotiation') || statusLower.includes('draft')) return "orange";
    return "blue";
  };

  const getStageBadgeVariant = (stage) => {
    if (!stage) return "blue";
    const stageLower = stage.toLowerCase();
    if (stageLower.includes('won') || stageLower.includes('approval') || stageLower.includes('approved')) return "green";
    if (stageLower.includes('lost') || stageLower.includes('closed') || stageLower.includes('rejected')) return "red";
    if (stageLower.includes('review') || stageLower.includes('evaluation')) return "blue";
    if (stageLower.includes('proposal') || stageLower.includes('milestone')) return "purple";
    if (stageLower.includes('draft') || stageLower.includes('initial') || stageLower.includes('negotiation')) return "orange";
    return "blue";
  };

  // Handle company click - navigate to Company Detail Page
  const handleCompanyClick = (proposal) => {
    // Extract customer ID and company name from proposal data
    const proposalData = proposal.Proposal || proposal;
    const opportunityData = proposal.Opportunity || proposal;
    
    const customerID = proposalData?.SalesContact?.ID;
    const companyName = opportunityData.Customer || proposalData.Customer || proposal.Customer || 
                       proposal.CompanyName || proposal.ContactDetails?.Name || 'Unknown Company';
    
    const url = `/ui/contactedit?edit=1&Search=&gsCustomersID=${customerID}`;
    openPageInNextTab(url, companyName || 'Company Details');
  };

  // Handle proposal click - navigate to Proposal Detail Page
  const handleProposalClick = (proposal) => {
    // Extract proposal ID from proposal data
    const proposalID = proposal.ProposalID || proposal.ID || proposal.id;
    
    if (proposalID) {
      const url = `/ui/production/proposal?ProposalID=${proposalID}`;
      openPageInNextTab(url, `Proposal ${proposalID}`);
    } else {
      console.warn('ProposalID not found in proposal data:', proposal);
    }
  };

  // Handle row click to open split screen
  const handleRowClick = (e, proposal) => {
    // Prevent navigation when clicking on interactive elements
    if (e.target.closest('input, button, [role="button"], [data-radix-select-trigger]')) {
      return;
    }
    
    // Trigger company selection to switch to split view
    if (onCompanySelect) {
      // Extract company name using the same pattern as ProposalCardView
      // const proposalData = proposal.Proposal || proposal;
      // const opportunityData = proposal.Opportunity || proposal;
      // const companyName = opportunityData.Customer || proposalData.Customer || proposal.Customer || proposal.CompanyName || proposal.ContactDetails.Name|| 'Unknown Company';
      
      // console.log('ProposalTableContent: Row clicked, company:', companyName, 'proposal data:', proposal);
      // onCompanySelect(companyName, proposal);
    }
  };

  // Handle edit icon click - navigate to Edit Opportunity page
  const handleEditClick = (e, proposal) => {
    e.stopPropagation();
    // Get the opportunity ID from the proposal data
    const opportunityId = proposal.ID || proposal.id;
    if (opportunityId) {
      navigate(`/edit-opportunity/${opportunityId}`);
    }
  };

  // Check if edit icon should be shown for a proposal
  const shouldShowEditIcon = (proposal) => {
    // Check if user has admin permissions
    if (!IsAdmin) {
      return false;
    }

    // Check if proposal has a valid ID - this is the main condition
    const proposalId = proposal.ID;
    if (!proposalId || proposalId === 0 || proposalId === '0') {
      return false;
    }

    // Check proposal status - don't show edit for certain statuses
    const status = proposal.status || proposal.Proposal?.Status || proposal.Status;
    const statusLower = status?.toLowerCase() || '';
    
    // Don't show edit icon for closed/locked statuses
    if (statusLower.includes('closed') || statusLower.includes('locked') || statusLower.includes('archived')) {
      return false;
    }

    return true;
  };

  // Extract company name for display
  const getCompanyName = (proposal) => {
    const proposalData = proposal.Proposal || proposal;
    const opportunityData = proposal.Opportunity || proposal;
    return opportunityData.Customer || proposalData.Customer || proposal.Customer || proposal.CompanyName || 'Unknown Company';
  };

  // Wrapper function to render cell content with proper text handling
  const renderCellContentWithTruncation = (proposal, column) => {
    const content = renderCellContent(proposal, column);
    
    // If content is a simple string, wrap it in TruncatedText
    if (typeof content === 'string') {
      return (
        <TruncatedText 
          text={content} 
          maxLength={25}
          className=""
          expandable={true}
          showTooltip={true}
        />
      );
    }
    
    // For React elements, return as-is (they should handle their own truncation)
    return content;
  };

  return (
    <div className="overflow-x-auto max-h-600px">
      {columnOrder.length === 0 ? (
        <div className="p-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Loading columns...
          </div>
        </div>
      ) : (
        <Table style={{tableLayout: 'fixed'}}>
          <ProposalTableHeader
            columnOrder={columnOrder}
            sortConfig={sortConfig}
            requestSort={requestSort}
            draggedColumn={draggedColumn}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragEnd={handleDragEnd}
            selectAll={selectAll}
            onSelectAll={onSelectAll}
            columnWidths={columnWidths}
            onColumnResize={onColumnResize}
          />
          
          <TableBody>
            {displayedItems.map((proposal, index) => (
              <TableRow 
                key={proposal.id || index} 
                className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                onClick={(e) => handleRowClick(e, proposal)}
              >
                {/* Checkbox cell */}
                <TableCell className="py-2.5">
                  <Checkbox
                    checked={selectedRows.has(parseInt(proposal.ProposalID))}
                    onCheckedChange={(checked) => handleRowSelect(parseInt(proposal.ProposalID), checked)}
                    aria-label={`Select ${proposal.name || proposal.Proposal?.Name || 'proposal'}`}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                
                {/* Dynamic cells based on columnOrder */}
                {columnOrder.map((column) => (
                  <TableCell 
                    key={column.id} 
                    className="py-2.5 text-sm overflow-hidden"
                    style={{
                      width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                      minWidth: column.id === 'editIcon' ? '60px' : '150px',
                      maxWidth: columnWidths[column.id] 
                        ? `${columnWidths[column.id]}px` 
                        : column.id === 'editIcon' ? '60px' : '250px'
                    }}
                  >
                    {/* Special handling for Edit Icon column */}
                    {column.id === 'editIcon' ? (
                      shouldShowEditIcon(proposal) ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleEditClick(e, proposal)}
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                          title="Edit Proposal"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                      ) : (
                        <div className="h-8 w-8 flex items-center justify-center">
                          {/* Empty space to maintain alignment */}
                        </div>
                      )
                    ) : (
                      /* Use dynamic cell rendering for API-based columns */
                      column.propertyMapping ? (
                        /* Check if this is a ProposalID column and wrap with click handler */
                        (column.id === 'ProposalID' || 
                         column.propertyMapping === 'ProposalID' ||
                         column.id === 'proposalID' ||
                         column.propertyMapping === 'proposalID' ||
                         column.id === 'proposalId' ||
                         column.propertyMapping === 'proposalId' ||
                         column.id?.toLowerCase().includes('proposalid') ||
                         column.propertyMapping?.toLowerCase().includes('proposalid')) ? (
                          <span 
                            className="cursor-pointer hover:text-blue-600 transition-colors text-blue-500 underline hover:underline-offset-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProposalClick(proposal);
                            }}
                            title={`View Proposal ${renderCellContent(proposal, column)}`}
                          >
                            <TruncatedText 
                              text={String(renderCellContent(proposal, column))} 
                              maxLength={15}
                              className="text-blue-500"
                              expandable={false}
                              showTooltip={false}
                            />
                          </span>
                        ) : 
                        /* Check if this is a company/customer column and wrap with click handler */
                        (column.id === 'ContactDetails.Name' || 
                         column.propertyMapping === 'ContactDetails.Name' ||
                         column.id === 'CustomerName' ||
                         column.propertyMapping === 'CustomerName' ||
                         column.id?.toLowerCase().includes('customer') ||
                         column.propertyMapping?.toLowerCase().includes('customer') ||
                         column.id?.toLowerCase().includes('company') ||
                         column.propertyMapping?.toLowerCase().includes('company')) ? (
                          <span 
                            className={`cursor-pointer hover:text-blue-600 transition-colors ${selectedCompany === getCompanyName(proposal) ? 'font-bold text-blue-600' : 'text-blue-500'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompanyClick(proposal);
                            }}
                          >
                            <span className="truncate block">
                              {renderCellContent(proposal, column)}
                            </span>
                          </span>
                        ) : (
                          renderCellContentWithTruncation(proposal, column)
                        )
                      ) : (
                        /* Fallback to legacy rendering for backward compatibility */
                        renderLegacyCell(proposal, column, {
                          getStatusBadgeVariant,
                          getStageBadgeVariant,
                          getRepColor,
                          handleCompanyClick,
                          handleProposalClick,
                          selectedCompany,
                          getCompanyName
                        })
                      )
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columnOrder.length + 1} className="text-center py-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Loading more proposals...
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      
      {/* Infinite scroll observer */}
      <div ref={observerRef} className="h-4" />
    </div>
  );
};

// Legacy cell rendering for backward compatibility
const renderLegacyCell = (proposal, column, helpers) => {
  const { getStatusBadgeVariant, getStageBadgeVariant, getRepColor, handleCompanyClick, handleProposalClick, selectedCompany, getCompanyName } = helpers;
  
  switch (column.id) {
    case 'status':
      return (
        <Badge variant={getStatusBadgeVariant(proposal.status)}>
          {proposal.status}
        </Badge>
      );
    
    case 'name':
      return (
        <TruncatedText 
          text={proposal.name || ""} 
          maxLength={30}
          className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
          expandable={true}
          showTooltip={true}
        />
      );
    
    case 'company':
      const companyName = getCompanyName(proposal);
      return (
        <span 
          className={`cursor-pointer hover:text-blue-600 transition-colors truncate block ${selectedCompany === companyName ? 'font-bold text-blue-600' : 'text-blue-500'}`}
          onClick={(e) => {
            e.stopPropagation();
            handleCompanyClick(proposal);
          }}
          title={companyName}
        >
          {companyName}
        </span>
      );
    
    case 'assignedRep':
      return (
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getRepColor(proposal.assignedRep)}`}>
            {proposal.assignedRep?.substring(0, 2)?.toUpperCase() || 'UN'}
          </div>
          <span className="text-sm">{proposal.assignedRep}</span>
        </div>
      );
    
    case 'stage':
      return (
        <Badge 
          variant={getStageBadgeVariant(proposal.stage)}
          className="font-medium"
        >
          {proposal.stage}
        </Badge>
      );
    
    case 'amount':
      return (
        <span className="font-medium">
          ${proposal.amount?.toLocaleString()}.00
        </span>
      );
    
    case 'createdDate':
    case 'projCloseDate':
    case 'actualCloseDate':
      return proposal[column.id] || '';
    
    case 'ProposalID':
    case 'proposalID':
    case 'proposalId':
      const proposalID = proposal.ProposalID || proposal.ID || proposal.id;
      return (
        <span 
          className="cursor-pointer hover:text-blue-600 transition-colors text-blue-500 underline hover:underline-offset-2"
          onClick={(e) => {
            e.stopPropagation();
            handleProposalClick(proposal);
          }}
        >
          {proposalID}
        </span>
      );
    
    default:
      const value = proposal[column.id] || '';
      return (
        <TruncatedText 
          text={String(value)} 
          maxLength={25}
          className="text-gray-700 text-sm"
          expandable={true}
          showTooltip={true}
        />
      );
  }
};

export default ProposalTableContent;
