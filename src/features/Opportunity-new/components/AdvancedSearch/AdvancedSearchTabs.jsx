
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OpportunitiesTabContent from "./OpportunitiesTabContent";
import ProposalsTabContent from "./ProposalsTabContent";
// import ProposalsAdvancedSearchTabContent from "../ProposalsAdvancedSearch/ProposalsAdvancedSearchTabContent";

const AdvancedSearchTabs = ({ 
  activeTab, 
  onTabChange, 
  searchParams, 
  handleInputChange, 
  handleSelectChange, 
  handleSearch, 
  openAccordions, 
  setOpenAccordions,
  // New props for proposal-specific functionality
  useProposalSpecificComponent = false,
  isSearching = false,
  searchJSON = {},
  isLoadingRecentSearch = false,
  tabKey = 0 // Add tabKey prop to force re-render
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="mb-6">
        <TabsList className="inline-flex h-10 p-1 bg-blue-50 rounded-md">
          <TabsTrigger 
            value="opportunities" 
            className="px-3 py-1.5 text-sm font-medium whitespace-nowrap rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-white data-[state=active]:shadow-sm hover:data-[state=active]:opacity-90 data-[state=active]:bg-ocean-gradient"
          >
            Opportunities
          </TabsTrigger>
          <TabsTrigger 
            value="proposals" 
            className="px-3 py-1.5 text-sm font-medium whitespace-nowrap rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-white data-[state=active]:shadow-sm hover:data-[state=active]:opacity-90 data-[state=active]:bg-ocean-gradient"
          >
            Proposals
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="opportunities" className="mt-0">
        <OpportunitiesTabContent
          key={`opportunities-content-${tabKey}`}
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
      </TabsContent>
      
      <TabsContent value="proposals" className="mt-0">
        {/* {useProposalSpecificComponent ? (
          <ProposalsAdvancedSearchTabContent
            key={`proposals-advanced-content-${tabKey}`}
            searchParams={searchParams}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSearch={handleSearch}
            openAccordions={openAccordions}
            setOpenAccordions={setOpenAccordions}
            isSearching={isSearching}
            isLoadingRecentSearch={isLoadingRecentSearch}
          />
        ) : (
          <ProposalsTabContent
            key={`proposals-content-${tabKey}`}
            searchParams={searchParams}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSearch={handleSearch}
            openAccordions={openAccordions}
            setOpenAccordions={setOpenAccordions}
            isSearching={isSearching}
            isLoadingRecentSearch={isLoadingRecentSearch}
          />
        )} */}
      </TabsContent>
    </Tabs>
  );
};

export default AdvancedSearchTabs;
