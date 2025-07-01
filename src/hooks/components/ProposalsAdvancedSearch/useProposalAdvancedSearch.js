
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/contexts/SearchContext";

export const useProposalAdvancedSearch = () => {
  const [searchParams, setSearchParams] = useState({});
  const [openAccordions, setOpenAccordions] = useState(["primary-fields"]);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { updateFilters } = useSearch();

  // Proposal-specific accordion items
  const proposalAccordionItems = ["primary-fields", "proposal-info", "status-process", "financial-commercial", "proposal-details", "client-company", "contact-info", "geographic-territory"];

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    console.log('Executing proposal search with params:', searchParams);

    // Process search parameters for proposals
    const processedParams = processProposalSearchParams(searchParams);

    // Update search context with processed parameters
    updateFilters(processedParams);

    // Create URL with search parameters and navigate to proposals
    const searchParamsString = new URLSearchParams(processedParams).toString();
    const finalUrl = searchParamsString ? `/proposals?${searchParamsString}` : '/proposals';
    console.log(`Navigating to: ${finalUrl}`);
    navigate(finalUrl);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name, value) => {
    setSearchParams({
      ...searchParams,
      [name]: value
    });
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

  // Process search parameters for proposals API
  const processProposalSearchParams = (searchParams) => {
    let processedParams = { ...searchParams };

    // For Proposals, ensure opportunityName is passed as is
    if (searchParams.opportunityName) {
      processedParams.opportunityName = searchParams.opportunityName;
      console.log('Setting opportunityName for Proposals:', searchParams.opportunityName);
    }

    // Add any other proposal-specific processing here
    console.log('Processed proposal search params:', processedParams);
    return processedParams;
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
