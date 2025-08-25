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
    isLoadingRecentSearch
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
    isLoadingRecentSearch
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
  const [searchParams, setSearchParams] = useSearchParams();

  const handleTabChangeWithClear = (newTab) => {
    console.log("OpportunityContextWrapper: Tab change requested to:", newTab);
    if (newTab === "proposals") {
      console.log(
        "OpportunityContextWrapper: Clearing opportunity filters and switching to proposals"
      );
      // Clear opportunity filters and URL parameters when switching to proposals
      clearAllFilters();

      // Ensure URL is clean with only the tab parameter
      const newSearchParams = new URLSearchParams();
      newSearchParams.set("tab", "proposals");
      setSearchParams(newSearchParams, { replace: true });
    }
    onTabChange(newTab);
  };

  return React.cloneElement(children, {
    handleTabChange: handleTabChangeWithClear,
  });
};

const ProposalContextWrapper = ({ children, onTabChange }) => {
  const { clearAllFilters } = useProposalSearch();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleTabChangeWithClear = (newTab) => {
    console.log("ProposalContextWrapper: Tab change requested to:", newTab);
    if (newTab === "opportunities") {
      console.log(
        "ProposalContextWrapper: Clearing proposal filters and switching to opportunities"
      );
      // Clear proposal filters and URL parameters when switching to opportunities
      clearAllFilters();

      // Ensure URL is clean with no tab parameter (opportunities is default)
      const newSearchParams = new URLSearchParams();
      setSearchParams(newSearchParams, { replace: true });
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
  const navigate = useNavigate();

  // Handle URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "proposals" && activeTab !== "proposals") {
      setActiveTab("proposals");
    } else if (tabParam !== "proposals" && activeTab !== "opportunities") {
      setActiveTab("opportunities");
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);

    // The context clearing components will handle the URL parameter clearing
    // This function just updates the active tab state
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
      <ProposalSearchProvider>
        <ProposalContextWrapper onTabChange={handleTabChange}>
          <ProposalAdvancedSearch
            isSettingsPanelOpen={isSettingsPanelOpen}
            handleOpenSettings={handleOpenSettings}
            handleCloseSettings={handleCloseSettings}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
        </ProposalContextWrapper>
      </ProposalSearchProvider>
    );
  }

  return (
    <OpportunitySearchProvider>
      <OpportunityContextWrapper onTabChange={handleTabChange}>
        <OpportunityAdvancedSearch
          isSettingsPanelOpen={isSettingsPanelOpen}
          handleOpenSettings={handleOpenSettings}
          handleCloseSettings={handleCloseSettings}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
      </OpportunityContextWrapper>
    </OpportunitySearchProvider>
  );
};

export default function WrappedAdvancedSearch() {
  return <AdvancedSearch />;
}
