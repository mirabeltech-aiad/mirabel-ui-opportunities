import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SettingsPanel from "@/components/ui/SettingsPanel";
import SearchHeader from "@/features/Opportunity/components/AdvancedSearch/SearchHeader";
import AdvancedSearchTabs from "@/features/Opportunity/components/AdvancedSearch/AdvancedSearchTabs";
import FloatingActionPanel from "@/features/Opportunity/components/AdvancedSearch/FloatingActionPanel";
import ProposalsFloatingActionPanel from "@/features/Opportunity/components/ProposalsAdvancedSearch/FloatingActionPanel";
import { useOpportunityAdvancedSearch, useProposalAdvancedSearch } from "@/features/Opportunity/components/AdvancedSearch/useAdvancedSearch";
import {
  OpportunitySearchProvider,
  useOpportunitySearch,
} from "@/features/Opportunity/contexts/OpportunitySearchContext";
import {
  ProposalSearchProvider,
  useProposalSearch,
} from "@/features/Opportunity/contexts/ProposalSearchContext";

// Component for Opportunity Advanced Search
const OpportunityAdvancedSearch = ({
  isSettingsPanelOpen,
  handleOpenSettings,
  handleCloseSettings,
  activeTab,
  handleTabChange,
}) => {
  const {
    searchParams: searchParamsState,
    openAccordions,
    setOpenAccordions,
    isExpanded,
    handleSearch,
    handleClearFilters,
    handleInputChange,
    handleSelectChange,
    handleToggleExpandCollapse,
    isSearching,
    searchJSON,
    isLoadingRecentSearch,
    tabKey
  } = useOpportunityAdvancedSearch();

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader
        onSearch={handleSearch}
        isExpanded={isExpanded}
        onToggle={handleToggleExpandCollapse}
        activeTab={activeTab}
        onReset={handleClearFilters}
        onOpenSettings={handleOpenSettings}
      />
      <div className="container mx-auto px-4 pb-6 max-w-7xl">
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-ocean-800 mb-6">
              Advanced Search
            </CardTitle>

            <AdvancedSearchTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              searchParams={searchParamsState}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleSearch={handleSearch}
              openAccordions={openAccordions}
              setOpenAccordions={setOpenAccordions}
              useProposalSpecificComponent={false}
              isSearching={isSearching}
              searchJSON={searchJSON}
              isLoadingRecentSearch={isLoadingRecentSearch}
              tabKey={tabKey}
            />
          </CardHeader>
        </Card>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={handleCloseSettings}
      />

      {/* Floating Action Panel */}
      <FloatingActionPanel
        searchParams={searchParamsState}
        onSearch={handleSearch}
        onClear={handleClearFilters}
        openAccordions={openAccordions}
        onAccordionChange={setOpenAccordions}
        showAdvancedFilters={true}
      />
    </div>
  );
};

// Component for Proposal Advanced Search
const ProposalAdvancedSearch = ({
  isSettingsPanelOpen,
  handleOpenSettings,
  handleCloseSettings,
  activeTab,
  handleTabChange,
}) => {
  const {
    searchParams: searchParamsState,
    openAccordions,
    setOpenAccordions,
    isExpanded,
    handleSearch,
    handleClearFilters,
    handleInputChange,
    handleSelectChange,
    handleToggleExpandCollapse,
    isSearching,
    searchJSON,
    isLoadingRecentSearch,
    tabKey
  } = useProposalAdvancedSearch();

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader
        onSearch={handleSearch}
        isExpanded={isExpanded}
        onToggle={handleToggleExpandCollapse}
        activeTab={activeTab}
        onReset={handleClearFilters}
        onOpenSettings={handleOpenSettings}
      />
      <div className="container mx-auto px-4 pb-6 max-w-7xl">
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-ocean-800 mb-6">
              Advanced Search
            </CardTitle>

            <AdvancedSearchTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              searchParams={searchParamsState}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleSearch={handleSearch}
              openAccordions={openAccordions}
              setOpenAccordions={setOpenAccordions}
              useProposalSpecificComponent={true}
              isSearching={isSearching}
              searchJSON={searchJSON}
              isLoadingRecentSearch={isLoadingRecentSearch}
              tabKey={tabKey}
            />
          </CardHeader>
        </Card>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={handleCloseSettings}
      />

      {/* Floating Action Panel */}
      <ProposalsFloatingActionPanel
        searchParams={searchParamsState}
        onSearch={handleSearch}
        onClear={handleClearFilters}
        openAccordions={openAccordions}
        onAccordionChange={setOpenAccordions}
        showAdvancedFilters={true}
      />
    </div>
  );
};

// Context clearing components
const OpportunityContextWrapper = ({ children, onTabChange }) => {
  const { clearAllFilters } = useOpportunitySearch();

  // Always clear filters when this component mounts (when switching to opportunities)
  useEffect(() => {
    console.log("OpportunityContextWrapper: Component mounted - clearing all filters");
    clearAllFilters();
    // Force a small delay to ensure clearing is processed
    setTimeout(() => {
      console.log("OpportunityContextWrapper: Forcing additional clear after delay");
      clearAllFilters();
    }, 100);
  }, []);

  const handleTabChangeWithClear = (newTab) => {
    console.log("OpportunityContextWrapper: Tab change requested to:", newTab);
    if (newTab === "proposals") {
      console.log(
        "OpportunityContextWrapper: Clearing opportunity filters and switching to proposals"
      );
      // Clear opportunity filters when switching to proposals
      clearAllFilters();
    } else if (newTab === "opportunities") {
      console.log(
        "OpportunityContextWrapper: Switching to opportunities tab - ensuring clean state"
      );
      // Clear any existing filters when switching to opportunities tab
      clearAllFilters();
    }
    onTabChange(newTab);
  };

  return React.cloneElement(children, {
    handleTabChange: handleTabChangeWithClear,
  });
};

const ProposalContextWrapper = ({ children, onTabChange }) => {
  const { clearAllFilters } = useProposalSearch();

  // Always clear filters when this component mounts (when switching to proposals)
  useEffect(() => {
    console.log("ProposalContextWrapper: Component mounted - clearing all filters");
    clearAllFilters();
    // Force a small delay to ensure clearing is processed
    setTimeout(() => {
      console.log("ProposalContextWrapper: Forcing additional clear after delay");
      clearAllFilters();
    }, 100);
  }, []);

  const handleTabChangeWithClear = (newTab) => {
    console.log("ProposalContextWrapper: Tab change requested to:", newTab);
    if (newTab === "opportunities") {
      console.log(
        "ProposalContextWrapper: Clearing proposal filters and switching to opportunities"
      );
      // Clear proposal filters when switching to opportunities
      clearAllFilters();
    } else if (newTab === "proposals") {
      console.log(
        "ProposalContextWrapper: Switching to proposals tab - ensuring clean state"
      );
      // Clear any existing filters when switching to proposals tab
      clearAllFilters();
    }
    onTabChange(newTab);
  };

  return React.cloneElement(children, {
    handleTabChange: handleTabChangeWithClear,
  });
};

export const AdvancedSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("opportunities");
  const [tabKey, setTabKey] = useState(0);
  const navigate = useNavigate();

  // Handle URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "proposals" && activeTab !== "proposals") {
      console.log("AdvancedSearch: Switching to proposals tab based on URL");
      setActiveTab("proposals");
    } else if (tabParam !== "proposals" && activeTab !== "opportunities") {
      console.log("AdvancedSearch: Switching to opportunities tab based on URL");
      setActiveTab("opportunities");
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (newTab) => {
    console.log("AdvancedSearch: Tab change requested to:", newTab);
    
    // Clear all URL parameters when switching tabs to ensure clean state
    const newSearchParams = new URLSearchParams();
    if (newTab === "proposals") {
      newSearchParams.set("tab", "proposals");
    }
    // For opportunities tab, no tab parameter needed (it's the default)
    
    setSearchParams(newSearchParams, { replace: true });
    setActiveTab(newTab);
  };

  // Global tab change handler that clears both contexts
  const handleGlobalTabChange = (newTab) => {
    console.log("AdvancedSearch: Global tab change to:", newTab);
    
    // Clear all URL parameters when switching tabs to ensure clean state
    const newSearchParams = new URLSearchParams();
    if (newTab === "proposals") {
      newSearchParams.set("tab", "proposals");
    }
    // For opportunities tab, no tab parameter needed (it's the default)
    
    setSearchParams(newSearchParams, { replace: true });
    setActiveTab(newTab);
    setTabKey(prev => prev + 1); // Force re-render by changing key
  };

  // Handle settings panel
  const handleOpenSettings = () => {
    setIsSettingsPanelOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsPanelOpen(false);
  };

  // Render the appropriate component based on active tab
  if (activeTab === "proposals") {
    return (
      <ProposalSearchProvider key={`proposals-${tabKey}`}>
        <ProposalContextWrapper onTabChange={handleGlobalTabChange}>
          <ProposalAdvancedSearch
            key={`proposal-search-${tabKey}`}
            isSettingsPanelOpen={isSettingsPanelOpen}
            handleOpenSettings={handleOpenSettings}
            handleCloseSettings={handleCloseSettings}
            activeTab={activeTab}
            handleTabChange={handleGlobalTabChange}
          />
        </ProposalContextWrapper>
      </ProposalSearchProvider>
    );
  }

  return (
    <OpportunitySearchProvider key={`opportunities-${tabKey}`}>
      <OpportunityContextWrapper onTabChange={handleGlobalTabChange}>
        <OpportunityAdvancedSearch
          key={`opportunity-search-${tabKey}`}
          isSettingsPanelOpen={isSettingsPanelOpen}
          handleOpenSettings={handleOpenSettings}
          handleCloseSettings={handleCloseSettings}
          activeTab={activeTab}
          handleTabChange={handleGlobalTabChange}
        />
      </OpportunityContextWrapper>
    </OpportunitySearchProvider>
  );
};

export default function WrappedAdvancedSearch() {
  return <AdvancedSearch />;
}
