
import React, { useState } from "react";
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
  onCloseSidebar
}) => {
  // Get unique companies from opportunities
  const companies = [...new Set(opportunities.map(opp => opp.companyName))];

  const handleCompanySelect = (company, companyData = null) => {
    console.log('SplitScreenView: Company selected:', company);
    if (onCompanySelect) {
      onCompanySelect(company, companyData);
    }
  };

  const handleCloseSidebar = () => {
    console.log('SplitScreenView: handleCloseSidebar called');
    if (onCloseSidebar) {
      onCloseSidebar();
    }
  };

  console.log('SplitScreenView render, selectedCompany:', selectedCompany, 'companies:', companies);

  return (
    <div className="flex h-full w-full">
      {/* Main Table View */}
      <div className={`transition-all duration-300 ${selectedCompany ? 'flex-1 min-w-0' : 'w-full'} overflow-hidden`}>
        <div className="h-full">
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
          />
        </div>
      </div>
      
      {/* Sidebar */}
      {selectedCompany && (
        <div className="w-[420px] flex-shrink-0 h-full min-h-screen border-l border-gray-200">
          <CompanySidebar 
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
