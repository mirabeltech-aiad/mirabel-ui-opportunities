import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@OpportunityComponents/ui/button";
import { X, Plus, Copy } from "lucide-react";
import MainNavbar from "@OpportunityComponents/MainNavbar";
import ProposalsTable from "@/features/Opportunity/components/ProposalsTable";
import ProposalStatsCards from "@/features/Opportunity/components/ProposalStatsCards";
import ProposalCardView from "@/features/Opportunity/components/ProposalCardView";
import ProposalKanbanView from "@/features/Opportunity/components/ProposalKanbanView";
import ProposalSplitScreenView from "@/features/Opportunity/components/ProposalSplitScreenView";
import ActiveFiltersDisplay from "@/features/Opportunity/components/table/ActiveFiltersDisplay";
import { proposalService } from "../services/proposalService";

const Proposals = () => {
  const [view, setView] = useState("table");
  const [proposals, setProposals] = useState([]);
  const [filters, setFilters] = useState({
    proposalRep: "all"
  });
  const [stats, setStats] = useState({
    total: 0,
    amount: 0,
    approved: 0,
    underReview: 0,
    rejected: 0,
    winTotal: 0,
    winPercentage: 0,
    avgValue: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [apiColumnConfig, setApiColumnConfig] = useState(null);
  
  // Split screen state management - exactly like Pipeline.jsx
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);
  
  const pageSize = 25;
  
  const location = useLocation();
  const navigate = useNavigate();

  // Parse search parameters from URL
  const searchParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    console.log('Proposals: Parsed search params from URL:', result);
    return result;
  }, [location.search]);

  // Handle company selection for split screen - exactly like Pipeline.jsx
  const handleCompanySelect = (companyName, companyData = null) => {
    console.log('Proposals: Company selected:', companyName, 'with data:', companyData);
    setSelectedCompany(companyName);
    setSelectedCompanyData(companyData);
    
    // Automatically switch to split screen view when company is selected
    console.log('Proposals: Switching to split view');
    setView('split');
  };

  // Handle closing the sidebar - exactly like Pipeline.jsx
  const handleCloseSidebar = () => {
    console.log('Proposals: Closing sidebar');
    setSelectedCompany(null);
    setSelectedCompanyData(null);
    
    // Return to table view when sidebar is closed
    console.log('Proposals: Returning to table view');
    setView('table');
  };

  // Load column configuration from API
  const loadColumnConfig = async () => {
    try {
      console.log('Proposals: Loading column configuration from API');
      
      // Call the column config API: services/AdvSearches/ResultViewColumn/1/2/-1
      const response = await proposalService.getColumnConfig();
      
      console.log('Proposals: Column config API response:', response);
      
      if (response?.content?.Status === 'Success' && response?.content?.List) {
        const columnConfig = response.content.List;
        console.log('Proposals: Setting column config:', columnConfig);
        setApiColumnConfig(columnConfig);
        return columnConfig;
      } else {
        console.error('Proposals: Invalid column config response:', response);
        setApiColumnConfig(null);
        return null;
      }
    } catch (error) {
      console.error('Proposals: Failed to load column config:', error);
      setApiColumnConfig(null);
      return null;
    }
  };

  // Load proposals data using API
  const loadProposalsData = async (searchFilters = {}, page = 1) => {
    try {
      setIsLoading(true);
      console.log('Proposals: Loading data with filters:', searchFilters, 'page:', page);
      
      // First, load column configuration
      const columnConfig = await loadColumnConfig();
      
      if (!columnConfig) {
        console.error('Proposals: No column config available, cannot load proposals');
        setProposals([]);
        setTotalItems(0);
        setTotalPages(1);
        return;
      }
      
      // Then, call the proposal data API
      const response = await proposalService.searchProposals({
        ...searchFilters,
        CurPage: page
      });
      
      console.log('Proposals: Proposal data API response:', response);
      
      // Process the API response and update proposals state
      const apiOpportunities = response.content?.Data?.Opportunities || [];
      const apiResult = response.content?.Data?.OpportunityResult?.[0] || {};
      
      // Extract total count from API response - use "Total" key as mentioned
      const totalCount = response.content?.Data?.Total || apiResult.TotIds || apiOpportunities.length;
      
      console.log('Proposals: API opportunities:', apiOpportunities);
      console.log('Proposals: Total count from API:', totalCount);
      
      if (apiOpportunities.length > 0) {
        // Use original API data structure without transformation
        console.log('Proposals: Using original API data structure');
        setProposals(apiOpportunities);
        
        // Use API result stats if available
        const amount = apiResult.TotOppAmt || apiOpportunities.reduce((sum, opp) => {
          const proposalAmount = opp.Proposal?.Amount || opp.Amount || 0;
          return sum + proposalAmount;
        }, 0);
        const approved = apiResult.ApprovedProposals || 0;
        const activeProposals = apiResult.ActiveProposals || 0;
        const sentProposals = apiResult.SentProposals || 0;
        const winTotal = apiResult.WinTotal || 0;
        const winPercentage = apiResult.WinRatio || 0;
        const avgValue = totalCount > 0 ? Math.round(amount / totalCount) : 0;
        
        // Set total items from API response using "Total" key
        setTotalItems(totalCount);
        
        // Calculate total pages based on total items and page size
        const calculatedTotalPages = Math.ceil(totalCount / pageSize) || 1;
        setTotalPages(calculatedTotalPages);
        
        console.log('Proposals: Calculated total pages:', calculatedTotalPages, 'for total count:', totalCount);
        
        setStats({
          total: totalCount,
          amount,
          approved,
          underReview: activeProposals,
          rejected: 0, // Not directly available in API response
          winTotal,
          winPercentage: Math.round(winPercentage),
          avgValue
        });
      } else {
        // No results from API, set empty state
        console.log('Proposals: No results from API');
        setProposals([]);
        setTotalItems(0);
        setTotalPages(1);
        setStats({
          total: 0,
          amount: 0,
          approved: 0,
          underReview: 0,
          rejected: 0,
          winTotal: 0,
          winPercentage: 0,
          avgValue: 0
        });
      }
      
    } catch (error) {
      console.error('Proposals: Failed to load data:', error);
      // Set empty state on error
      setProposals([]);
      setTotalItems(0);
      setTotalPages(1);
      setStats({
        total: 0,
        amount: 0,
        approved: 0,
        underReview: 0,
        rejected: 0,
        winTotal: 0,
        winPercentage: 0,
        avgValue: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view selection for proposals - this will refresh the grid
  const handleViewSelected = (selectedView) => {
    console.log('Proposals: View selected, refreshing proposal grid for view:', selectedView.NameOfView);
    // Reset to first page and reload data with current filters
    setCurrentPage(1);
    loadProposalsData({ ...searchParams, ...filters }, 1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    console.log('Proposals: Changing to page', newPage);
    setCurrentPage(newPage);
    // Updated to match API expectation of 1-indexed pages
    loadProposalsData({ ...searchParams, ...filters }, newPage);
  };

  useEffect(() => {
    // Load proposals when component mounts with page 1 (first page)
    loadProposalsData({ ...searchParams, ...filters }, 1);
  }, [location.search]); // Depend on location.search to trigger when URL changes

  // Filter proposals based on search parameters and filters
  const filteredProposals = useMemo(() => {
    // Add your filtering logic here if needed, or just return proposals if no filters
    // For now, just return proposals as is
    return proposals;
  }, [proposals, filters]);

  const handleFilterChange = (filterType, value) => {
    console.log('Proposals: Filter changed:', filterType, 'value:', value);
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    // Reset to first page and reload data with new filters
    setCurrentPage(1);
    const newFilters = { ...filters, [filterType]: value };
    loadProposalsData(newFilters, 1);
  };

  const handleRefresh = () => {
    console.log('Refreshing proposals data...');
    // Reset to first page (API expects 1-indexed pages)
    setCurrentPage(1);
    loadProposalsData({ ...searchParams, ...filters }, 1);
  };

  const handleClose = () => {
    console.log('Close button clicked, navigating to /');
    navigate('/');
  };

  const handleAddProposal = () => {
    console.log('Add proposal button clicked - redirecting to Add Opportunity');
    navigate('/add-opportunity');
  };

  const renderView = () => {
    switch (view) {
      case 'kanban':
        return <ProposalKanbanView proposals={filteredProposals} view={view} onViewChange={setView} />;
      case 'cards':
        return (
          <ProposalCardView 
            proposals={filteredProposals} 
            view={view} 
            onViewChange={setView}
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            sortConfig={null}
            onSort={() => {}}
          />
        );
      case 'split':
        return (
          <ProposalSplitScreenView 
            proposals={filteredProposals} 
            view={view} 
            onViewChange={setView}
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            selectedCompany={selectedCompany}
            selectedCompanyData={selectedCompanyData}
            onCompanySelect={handleCompanySelect}
            onCloseSidebar={handleCloseSidebar}
            apiColumnConfig={apiColumnConfig}
          />
        );
      default:
        return (
          <ProposalsTable 
            proposals={filteredProposals} 
            view={view} 
            onViewChange={setView}
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            apiColumnConfig={apiColumnConfig}
            onViewSelected={handleViewSelected}
            onCompanySelect={handleCompanySelect}
            selectedCompany={selectedCompany}
          />
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white w-full overflow-x-hidden relative">
      <MainNavbar />
      
      {/* Close Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 z-50 h-10 w-10 hover:bg-gray-100"
        onClick={handleClose}
        type="button"
      >
        <X className="h-6 w-6 text-gray-600" />
      </Button>
      
      <div className="w-full px-4 py-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-[#1a4d80]">Proposals Dashboard</h1>
          <div className="flex gap-2">
            <Button 
              onClick={handleAddProposal}
              className="bg-[#4fb3ff] hover:bg-[#4fb3ff]/90 text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Opportunity
            </Button>
          </div>
        </div>
        
        {view !== 'kanban' && view !== 'split' && <ProposalStatsCards stats={stats} />}
        
        {renderView()}
      </div>
    </div>
  );
};

export default Proposals;
