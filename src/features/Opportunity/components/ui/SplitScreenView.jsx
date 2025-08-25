import React from "react";
import OpportunitiesTable from "./OpportunitiesTable";
import CompanySidebar from "./CompanySidebar";

const SplitScreenView = ({
  opportunities,
  view,
  onViewChange,
  filters,
  onFilterChange,
  users = [],
  onRefresh,
  selectedCompany,
  selectedCompanyData,
  onCompanySelect,
  onCloseSidebar,
  totalCount = 0,
  currentPage = 1,
  onNextPage,
  onPreviousPage,
  savedSearches = {
    allOpportunities: [],
    myOpportunities: [],
  },
  stages = [],
  onAddOpportunity,
  apiColumnConfig,
}) => {
  // Get unique companies from opportunities
  const companies = [...new Set(opportunities.map((opp) => opp.companyName))];

  const handleCompanySelect = (company, companyData = null) => {
    console.log("SplitScreenView: Company selected:", company);
    if (onCompanySelect) {
      onCompanySelect(company, companyData);
    }
  };

  const handleCloseSidebar = () => {
    console.log("SplitScreenView: handleCloseSidebar called");
    if (onCloseSidebar) {
      onCloseSidebar();
    }
  };

  console.log(
    "SplitScreenView render, selectedCompany:",
    selectedCompany,
    "companies:",
    companies
  );

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Main Table View */}
      <div
        className={`transition-all duration-300 ${
          selectedCompany ? "flex-1 min-w-0" : "w-full"
        } overflow-hidden flex flex-col bg-white`}
      >
        <div className="h-full flex flex-col min-h-0 overflow-hidden">
          <OpportunitiesTable
            opportunities={opportunities}
            view={view}
            onViewChange={onViewChange}
            onCompanySelect={handleCompanySelect}
            selectedCompany={selectedCompany}
            filters={filters}
            onFilterChange={onFilterChange}
            users={users}
            onRefresh={onRefresh}
            totalCount={totalCount}
            currentPage={currentPage}
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            savedSearches={savedSearches}
            stages={stages}
            onAddOpportunity={onAddOpportunity}
            apiColumnConfig={apiColumnConfig} // Pass opportunityResult to access ColumnConfig
            isSplitScreenMode={!!selectedCompany}
          />
        </div>
      </div>

      {/* Sidebar */}
      {selectedCompany && (
        <div className="w-[420px] flex-shrink-0 h-full border-l border-gray-200 bg-white overflow-hidden">
          <CompanySidebar
            key={selectedCompany}
            selectedCompany={selectedCompany}
            selectedCompanyData={selectedCompanyData}
            opportunities={opportunities}
            onClose={handleCloseSidebar}
          />
        </div>
      )}
    </div>
  );
};

export default SplitScreenView;
