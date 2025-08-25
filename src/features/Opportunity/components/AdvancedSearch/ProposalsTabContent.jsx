
import React from "react";
import DynamicFormRenderer from "./DynamicFormRenderer";
import { PROPOSAL_FORM_CONFIG } from "../../config/proposalFormConfig";

const ProposalsTabContent = ({ 
  searchParams, 
  handleInputChange, 
  handleSelectChange, 
  handleSearch, 
  openAccordions, 
  setOpenAccordions,
  isSearching = false,
  isLoadingRecentSearch = false
}) => {
  return (
    <DynamicFormRenderer
      config={PROPOSAL_FORM_CONFIG}
      searchParams={searchParams}
      handleInputChange={handleInputChange}
      handleSelectChange={handleSelectChange}
      handleSearch={handleSearch}
      openAccordions={openAccordions}
      setOpenAccordions={setOpenAccordions}
      isSearching={isSearching}
      isLoadingRecentSearch={isLoadingRecentSearch}
    />
  );
};

export default ProposalsTabContent;
