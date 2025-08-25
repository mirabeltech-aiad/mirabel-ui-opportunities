
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProposalSearch } from "@OpportunityContexts/ProposalSearchContext";
import { processProposalSearchParams } from "./proposalSearchHelpers";
import { buildSearchJson, getSearchSummary, validateSearchJson } from "../../utils/searchJsonBuilder";

export const useProposalAdvancedSearch = () => {
  const [openAccordions, setOpenAccordions] = useState(["primary-fields"]);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { activeFilters, updateFilters } = useProposalSearch();
  const searchParams = activeFilters;

  // Proposal-specific accordion items
  const proposalAccordionItems = ["primary-fields", "proposal-info", "sales-pipeline", "status-process", "financial-commercial", "proposal-details", "client-company", "contact-info", "geographic-territory"];

  const handleSearch = (e) => {
    if (e) e.preventDefault();

    try {
      // Build API payload instead of URL parameters
      const apiPayload = buildSearchJson(searchParams, 'proposal');
      
      // Validate the API payload
      const validation = validateSearchJson(apiPayload);
      if (!validation.isValid) {
        console.error('Proposal Advanced Search: Invalid API payload:', validation.errors);
        return;
      }
      
      // Get search summary for logging
      const searchSummary = getSearchSummary(apiPayload);
      
      console.log('Proposal Advanced Search: Generated API payload:', {
        apiPayload,
        summary: searchSummary,
        validation
      });
      
      // Update filters with the form data for context
      updateFilters(searchParams);
      
      // Navigate to proposals page but pass API payload in state
      // This allows the proposals page to access the complete API payload directly
      navigate('/proposals', { 
        state: { 
          apiPayload,
          searchJson: apiPayload, // Keep for backward compatibility
          fromAdvancedSearch: true,
          searchSummary
        } 
      });
      
    } catch (error) {
      console.error('Proposal Advanced Search: Error during search:', error);
    }
  };

  const handleClearFilters = () => {
    updateFilters({});
  };

  const handleInputChange = (e) => {
    updateFilters({
      ...searchParams,
      [e.target.name]: e.target.value
    }, { updateUrl: false });
  };

  const handleSelectChange = (name, value) => {
    updateFilters({
      ...searchParams,
      [name]: value
    }, { updateUrl: false });
  };

  const handleToggleExpandCollapse = () => {
    if (isExpanded) {
      setOpenAccordions([]);
      setIsExpanded(false);
    } else {
      setOpenAccordions(proposalAccordionItems);
      setIsExpanded(true);
    }
  };



  return {
    searchParams,
    openAccordions,
    setOpenAccordions,
    isExpanded,
    handleSearch,
    handleClearFilters,
    handleInputChange,
    handleSelectChange,
    handleToggleExpandCollapse
  };
};
