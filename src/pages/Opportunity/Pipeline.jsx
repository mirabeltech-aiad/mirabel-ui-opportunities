import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MainNavbar from "@/components/ui/MainNavbar";
import OpportunityStatsCards from "@/components/ui/OpportunityStatsCards";
import OpportunitiesTable from "@/components/ui/OpportunitiesTable";
import OpportunityCardView from "@/components/ui/OpportunityCardView";
import KanbanView from "@/components/ui/KanbanView";
import SplitScreenView from "@/components/ui/SplitScreenView";
import ViewToggle from "@/components/ui/ViewToggle";
import { useApiData } from "@/features/Opportunity/hooks/useApiData";
import { useSearch } from "@/features/Opportunity/contexts/SearchContext";
import Loader from "@/components/ui/loader";
import apiService from "@/features/Opportunity/Services/apiService";

const Pipeline = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeFilters } = useSearch();
  const {
    opportunities,
    users,
    savedSearches,
    isLoading,
    error,
    currentPage,
    totalCount,
    refetchData,
    goToNextPage,
    goToPreviousPage
  } = useApiData();
  
  const [view, setView] = useState('table');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [stages, setStages] = useState([]);
  const [stagesLoading, setStagesLoading] = useState(true);
  const [selectedView, setSelectedView] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);
  
  const [filters, setFilters] = useState({
    status: "All Opportunities",
    probability: "All Probability",
    assignedRep: "All Reps"
  });
  
  const [stats, setStats] = useState({
    total: 0,
    amount: 0,
    won: 0,
    open: 0,
    lost: 0,
    winTotal: 0,
    winPercentage: 0
  });

  // Fetch stages once for the entire page
  useEffect(() => {
    const fetchStages = async () => {
      try {
        setStagesLoading(true);
        const response = await apiService.getOpportunityStages();
        console.log('Stages API response:', response);
        if (response?.content?.List) {
          const sortedStages = response.content.List.sort((a, b) => a.SortOrder - b.SortOrder).map(stageData => ({
            id: stageData.ID,
            name: stageData.Stage,
            colorCode: stageData.ColorCode,
            description: stageData.Description,
            sortOrder: stageData.SortOrder
          }));
          setStages(sortedStages);
        }
      } catch (error) {
        console.error('Error fetching stages:', error);
        setStages([{
          id: 10,
          name: "Lead Assigned",
          colorCode: "#CC3366"
        }, {
          id: 2,
          name: "Qualification",
          colorCode: "#FFCC00"
        }, {
          id: 1,
          name: "Initial contact",
          colorCode: "#CC3366"
        }, {
          id: 3,
          name: "Meeting",
          colorCode: "#FF9933"
        }, {
          id: 4,
          name: "Proposal",
          colorCode: "#CC6600"
        }, {
          id: 9,
          name: "2nd Meeting",
          colorCode: "#00CC33"
        }, {
          id: 11,
          name: "3rd Meeting",
          colorCode: "#CC3366"
        }, {
          id: 12,
          name: "July meeting",
          colorCode: "#FFCC00"
        }, {
          id: 7,
          name: "Closed Won",
          colorCode: "#669966"
        }, {
          id: 8,
          name: "Closed Lost",
          colorCode: "#CC0000"
        }]);
      } finally {
        setStagesLoading(false);
      }
    };
    fetchStages();
  }, []);

  // Check settings on initial load
  useEffect(() => {
    const checkInitialSettings = async () => {
      if (isInitialLoad) {
        try {
          console.log('Checking initial settings for first-time load...');
          const response = await apiService.getReportSettings(1, -1);
          console.log('Initial settings response:', response);
          if (response?.content?.Data?.ShowType !== undefined) {
            const showType = response.content.Data.ShowType;
            console.log('ShowType value:', showType);

            if (showType === 0) {
              console.log('Navigating to Advanced Search based on ShowType 0');
              navigate('/advanced-search');
              return;
            } else {
              console.log('Staying on Opportunities table based on ShowType 1');
            }
          }
        } catch (error) {
          console.error('Error fetching initial settings:', error);
        } finally {
          setIsInitialLoad(false);
        }
      }
    };
    checkInitialSettings();
  }, [isInitialLoad, navigate]);

  // Fetch data when active filters change
  useEffect(() => {
    if (!isInitialLoad) {
      console.log('Active filters changed:', activeFilters);
      if (Object.keys(activeFilters).length > 0) {
        refetchData(activeFilters);
      } else {
        refetchData();
      }
    }
  }, [activeFilters, refetchData, isInitialLoad]);

  // Handle view selection - refetch data when a saved view is selected
  useEffect(() => {
    if (selectedView && !isInitialLoad) {
      console.log('Selected view changed, fetching opportunities data for view:', selectedView.NameOfView);

      // Create API filters based on the selected view
      const viewFilters = {
        viewId: selectedView.ID,
        visibleColumns: selectedView.VisibleColumns
      };
      console.log('Fetching data with view filters:', viewFilters);
      refetchData(viewFilters);
    }
  }, [selectedView, refetchData, isInitialLoad]);

  // Parse URL parameters and convert them to API filters
  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = {};

      // Extract all search parameters from URL
      for (const [key, value] of searchParams.entries()) {
        if (value && value.trim() !== '') {
          urlFilters[key] = value;
        }
      }
      console.log('URL search parameters:', urlFilters);

      // Only fetch data if there are URL filters
      if (Object.keys(urlFilters).length > 0) {
        refetchData(urlFilters);
      }
    }
  }, [searchParams, isInitialLoad]);

  // Handle company selection from table row click
  const handleCompanySelect = (company, companyData = null) => {
    console.log('Pipeline: Company selected:', company);
    setSelectedCompany(company);
    setSelectedCompanyData(companyData);
    setView('split'); // Switch to split-screen view
  };

  // Handle closing the company sidebar
  const handleCloseSidebar = () => {
    console.log('Pipeline: Closing sidebar, returning to table view');
    setSelectedCompany(null);
    setSelectedCompanyData(null);
    setView('table'); // Return to full table view
  };

  useEffect(() => {
    if (opportunities.length > 0) {
      // Calculate stats from API data
      const total = opportunities.length;
      const amount = opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0);
      const won = opportunities.filter(opp => opp.status === "Closed" || opp.status === "Won").length;
      const open = opportunities.filter(opp => opp.status === "Open").length;
      const lost = opportunities.filter(opp => opp.status === "Lost").length;
      const winTotal = opportunities.filter(opp => opp.status === "Closed" || opp.status === "Won").reduce((sum, opp) => sum + (opp.amount || 0), 0);
      const winPercentage = total > 0 ? Math.round(won / total * 100) : 0;
      setStats({
        total,
        amount,
        won,
        open,
        lost,
        winTotal,
        winPercentage
      });
    }
  }, [opportunities]);

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    console.log('Filter changed:', filterType, value);
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);

    const apiFilters = {};

    if (filterType === 'status' || newFilters.status !== "All Opportunities") {
      const statusValue = newFilters.status;

      if (statusValue !== "All Opportunities" && statusValue !== "Open Opportunities" && statusValue !== "Won Opportunities" && statusValue !== "Lost Opportunities") {
        let selectedSearch = null;
        if (savedSearches.allOpportunities) {
          selectedSearch = savedSearches.allOpportunities.find(search => search.Name === statusValue);
        }
        if (!selectedSearch && savedSearches.myOpportunities) {
          selectedSearch = savedSearches.myOpportunities.find(search => search.Name === statusValue);
        }
        if (selectedSearch) {
          console.log('Selected saved search:', selectedSearch);
          apiFilters.ListID = selectedSearch.ID;

          if (selectedSearch.SearchCriteriaJSON && selectedSearch.SearchCriteriaJSON.trim() !== '') {
            try {
              const searchCriteria = JSON.parse(selectedSearch.SearchCriteriaJSON);
              console.log('Parsed search criteria:', searchCriteria);

              if (searchCriteria.Status && searchCriteria.Status !== '') {
                apiFilters.status = searchCriteria.Status;
              }
              if (searchCriteria.AssignedTo && searchCriteria.AssignedTo !== '') {
                apiFilters.assignedRepId = searchCriteria.AssignedTo;
              }
            } catch (error) {
              console.error('Error parsing SearchCriteriaJSON:', error);
            }
          }
        } else {
          console.warn('Saved search not found:', statusValue);
        }
      } else {
        const standardStatusValue = statusValue === "All Opportunities" ? "-1" : statusValue === "Open Opportunities" ? "Open" : statusValue === "Won Opportunities" ? "Won" : statusValue === "Lost Opportunities" ? "Lost" : "-1";
        if (standardStatusValue !== "-1") {
          apiFilters.status = standardStatusValue;
        }
      }
    }

    if (filterType === 'assignedRep' || newFilters.assignedRep !== "All Reps") {
      const repValue = filterType === 'assignedRep' ? value : newFilters.assignedRep;
      if (repValue && repValue !== "All Reps") {
        const selectedUser = users.find(user => user.display === repValue);
        if (selectedUser) {
          apiFilters.assignedRepId = selectedUser.id;
          apiFilters.assignedRep = repValue;
          console.log('Sales rep filter - Selected user:', selectedUser);
          console.log('Sales rep filter - Setting assignedRepId:', selectedUser.id);
        } else {
          console.warn('Sales rep not found in users list:', repValue);
        }
      }
    }

    if (filterType === 'probability' || newFilters.probability !== "All Probability") {
      const probValue = filterType === 'probability' ? value : newFilters.probability;
      if (probValue && probValue !== "All Probability") {
        apiFilters.probability = probValue;
      }
    }
    console.log('API filters being sent:', apiFilters);

    // Trigger API call with new filters - this ensures consistent behavior across all views
    refetchData(apiFilters);
  };

  // Handle add opportunity
  const handleAddOpportunity = () => {
    console.log('Add Opportunity clicked - navigating to new opportunity form');
    navigate('/add-opportunity');
  };

  // Simplified pagination handlers that directly call the hook functions
  const handleNextPage = () => {
    console.log('Next page clicked, current page:', currentPage);
    goToNextPage();
  };

  const handlePreviousPage = () => {
    console.log('Previous page clicked, current page:', currentPage);
    goToPreviousPage();
  };

  // Show loading during initial settings check
  if (isInitialLoad || stagesLoading) {
    return <div className="flex-1 flex flex-col bg-white w-full overflow-x-hidden">
        <MainNavbar />
        <div className="flex justify-center items-center h-64">
          <Loader text="Loading..." />
        </div>
      </div>;
  }

  const handleViewSelected = view => {
    console.log('Pipeline: Handling view selection:', view.NameOfView);
    setSelectedView(view);
  };

  const renderView = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64">
          <Loader text="Loading opportunities..." />
        </div>;
    }
    if (error) {
      return <div className="flex justify-center items-center h-64 text-red-500">Error loading data: {error}</div>;
    }

    const commonProps = {
      opportunities,
      view,
      onViewChange: setView,
      filters,
      onFilterChange: handleFilterChange,
      users,
      savedSearches,
      onRefresh: () => refetchData(activeFilters),
      currentPage,
      onNextPage: handleNextPage,
      onPreviousPage: handlePreviousPage,
      totalCount,
      stages,
      onViewSelected: handleViewSelected
    };

    switch (view) {
      case 'kanban':
        return <KanbanView {...commonProps} />;
      case 'cards':
        return <OpportunityCardView {...commonProps} />;
      case 'split':
        return (
          <SplitScreenView 
            {...commonProps}
            onCompanySelect={handleCompanySelect}
            selectedCompany={selectedCompany}
            selectedCompanyData={selectedCompanyData}
            onCloseSidebar={handleCloseSidebar}
          />
        );
      default:
        return (
          <OpportunitiesTable 
            {...commonProps} 
            onCompanySelect={handleCompanySelect}
            selectedCompany={selectedCompany}
          />
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white w-full overflow-x-hidden">
      <MainNavbar />
      
      <div className="w-full px-4 py-6 flex-1 overflow-auto mx-0">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-[#1a4d80]">Opportunities Table</h1>
          <Button onClick={handleAddOpportunity} className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500">
            <Plus className="h-4 w-4" />
            Add Opportunity
          </Button>
        </div>
        
        {view !== 'kanban' && view !== 'split' && <OpportunityStatsCards stats={stats} />}
        
        {renderView()}
      </div>
    </div>
  );
};

export default Pipeline;
