
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainNavbar from "@/components/ui/MainNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchHeader from "@/features/Opportunity/components/AdvancedSearch/SearchHeader";
import AdvancedSearchTabs from "@/features/Opportunity/components/AdvancedSearch/AdvancedSearchTabs";
import FloatingActionPanel from "@/features/Opportunity/components/AdvancedSearch/FloatingActionPanel";
import ProposalsFloatingActionPanel from "@/features/Opportunity/components/ProposalsAdvancedSearch/FloatingActionPanel";
import { useAdvancedSearch } from "@/features/Opportunity/components/AdvancedSearch/useAdvancedSearch";
import { useProposalAdvancedSearch } from "@/features/Opportunity/components/ProposalsAdvancedSearch/useProposalAdvancedSearch";

const AdvancedSearch = () => {
  const [searchParams] = useSearchParams();
  
  // Always call both hooks to avoid conditional hook usage
  const originalHook = useAdvancedSearch();
  const proposalHook = useProposalAdvancedSearch();
  
  // Feature flag to enable proposal-specific functionality
  const useProposalSpecificHook = false; // Set to true to enable new proposal functionality
  
  // Choose which hook data to use based on conditions, but don't conditionally call hooks
  const shouldUseProposalHook = useProposalSpecificHook && originalHook.activeTab === "proposals";
  
  const activeHook = shouldUseProposalHook ? proposalHook : originalHook;
  
  const {
    searchParams: searchParamsState,
    openAccordions,
    setOpenAccordions,
    isExpanded,
    handleSearch,
    handleClearFilters,
    handleInputChange,
    handleSelectChange,
    handleToggleExpandCollapse
  } = activeHook;

  // Always use the original hook's tab management
  const { activeTab, handleTabChange } = originalHook;

  // Handle URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'proposals' && activeTab !== 'proposals') {
      handleTabChange('proposals');
    }
  }, [searchParams, activeTab, handleTabChange]);

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <SearchHeader 
        onSearch={handleSearch} 
        isExpanded={isExpanded} 
        onToggle={handleToggleExpandCollapse} 
        activeTab={activeTab} 
      />
      <div className="container mx-auto px-4 pb-6 max-w-7xl">
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-ocean-800 mb-6">Advanced Search</CardTitle>
            
            <AdvancedSearchTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              searchParams={searchParamsState}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleSearch={handleSearch}
              openAccordions={openAccordions}
              setOpenAccordions={setOpenAccordions}
              useProposalSpecificComponent={useProposalSpecificHook && activeTab === "proposals"}
            />
          </CardHeader>
        </Card>
      </div>

      {/* Floating Action Panel - conditionally render based on active tab */}
      {activeTab === "opportunities" ? (
        <FloatingActionPanel 
          searchParams={searchParamsState} 
          onSearch={handleSearch} 
          onClear={handleClearFilters} 
          openAccordions={openAccordions} 
          onAccordionChange={setOpenAccordions} 
          showAdvancedFilters={true} 
        />
      ) : (
        <ProposalsFloatingActionPanel 
          searchParams={searchParamsState} 
          onSearch={handleSearch} 
          onClear={handleClearFilters} 
          openAccordions={openAccordions} 
          onAccordionChange={setOpenAccordions} 
          showAdvancedFilters={true} 
        />
      )}
    </div>
  );
};

export default AdvancedSearch;
