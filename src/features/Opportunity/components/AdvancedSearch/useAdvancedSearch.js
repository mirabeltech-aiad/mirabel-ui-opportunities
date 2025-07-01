
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@OpportunityContexts/SearchContext";
import { processOpportunitySearchParams, processProposalSearchParams } from "./searchHelpers";

export const useAdvancedSearch = () => {
  const [searchParams, setSearchParams] = useState({});
  const [openAccordions, setOpenAccordions] = useState(["primary-fields"]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("opportunities");
  const navigate = useNavigate();
  const { updateFilters } = useSearch();

  // Accordion items for different tabs
  const opportunitiesItems = ["primary-fields", "sales-pipeline", "financial-commercial", "opportunity-details", "account-company", "contact-info", "product-solution", "geographic-territory"];
  const proposalsItems = ["primary-fields", "opportunity-info", "contact-address-info", "proposal-info"];

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    console.log(`Executing ${activeTab} search with params:`, searchParams);

    // Process search parameters based on active tab
    let processedParams;
    if (activeTab === "opportunities") {
      processedParams = processOpportunitySearchParams(searchParams);
    } else if (activeTab === "proposals") {
      processedParams = processProposalSearchParams(searchParams);
    }

    // Update search context with processed parameters
    updateFilters(processedParams);

    // Create URL with search parameters
    const searchParamsString = new URLSearchParams(processedParams).toString();
    const targetRoute = activeTab === "opportunities" ? "/opportunities" : "/proposals";
    const finalUrl = searchParamsString ? `${targetRoute}?${searchParamsString}` : targetRoute;
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
    const currentItems = activeTab === "opportunities" ? opportunitiesItems : proposalsItems;
    if (isExpanded) {
      setOpenAccordions([]);
      setIsExpanded(false);
    } else {
      setOpenAccordions(currentItems);
      setIsExpanded(true);
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({});
    setOpenAccordions(["primary-fields"]);
    setIsExpanded(false);
  };

  return {
    searchParams,
    openAccordions,
    setOpenAccordions,
    isExpanded,
    activeTab,
    handleSearch,
    handleClearFilters,
    handleInputChange,
    handleSelectChange,
    handleToggleExpandCollapse,
    handleTabChange
  };
};
