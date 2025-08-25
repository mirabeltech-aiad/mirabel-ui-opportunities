
import React from "react";
import DynamicFormRenderer from "./DynamicFormRenderer";
import { OPPORTUNITY_FORM_CONFIG } from "../../config/opportunityFormConfig";

const OpportunitiesTabContent = ({ 
  searchParams, 
  handleInputChange, 
  handleSelectChange, 
  handleSearch, 
  openAccordions, 
  setOpenAccordions,
  isSearching = false,
  searchJSON = {},
  isLoadingRecentSearch = false
}) => {
  return (
    <DynamicFormRenderer
      config={OPPORTUNITY_FORM_CONFIG}
      searchParams={searchParams}
      handleInputChange={handleInputChange}
      handleSelectChange={handleSelectChange}
      handleSearch={handleSearch}
      openAccordions={openAccordions}
      setOpenAccordions={setOpenAccordions}
      isSearching={isSearching}
      searchJSON={searchJSON}
      isLoadingRecentSearch={isLoadingRecentSearch}
    />
  );
};

export default OpportunitiesTabContent;
