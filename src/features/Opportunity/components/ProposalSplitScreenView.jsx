import React from "react";
import ProposalsTable from "./ProposalsTable";
import CompanySidebar from "./CompanySidebar";

const ProposalSplitScreenView = ({ 
  proposals, 
  view, 
  onViewChange, 
  filters, 
  onFilterChange, 
  onRefresh, 
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  selectedCompany,
  selectedCompanyData,
  onCompanySelect,
  onCloseSidebar,
  apiColumnConfig
}) => {
  console.log('ProposalSplitScreenView render:', {
    selectedCompany,
    proposalsCount: proposals?.length,
    onCompanySelect: !!onCompanySelect,
    onCloseSidebar: !!onCloseSidebar
  });

  return (
    <div className="flex h-full w-full">
      {/* Main Table View - Better responsive behavior */}
      <div className={`transition-all duration-300 ${selectedCompany ? 'flex-1 min-w-0' : 'w-full'} overflow-hidden`}>
        <div className="h-full">
          <ProposalsTable 
            proposals={proposals} 
            view={view} 
            onViewChange={onViewChange}
            onCompanySelect={onCompanySelect}
            selectedCompany={selectedCompany}
            filters={filters}
            onFilterChange={onFilterChange}
            onRefresh={onRefresh}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            apiColumnConfig={apiColumnConfig}
          />
        </div>
      </div>
      
      {/* Sidebar - Fixed width, better responsive behavior */}
      {selectedCompany && (
        <div className="w-[420px] flex-shrink-0 h-full min-h-screen border-l border-gray-200">
          <CompanySidebar 
            selectedCompany={selectedCompany}
            selectedCompanyData={selectedCompanyData}
            opportunities={proposals}
            onClose={onCloseSidebar}
          />
        </div>
      )}
    </div>
  );
};

export default ProposalSplitScreenView;
