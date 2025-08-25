import React, { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Plus, Copy } from "lucide-react";

import ProposalsTable from "@/components/ui/ProposalsTable";
import ProposalStatsCards from "@/components/ui/ProposalStatsCards";
import ProposalCardView from "@/components/ui/ProposalCardView";
import ProposalKanbanView from "@/components/ui/ProposalKanbanView";
import ProposalSplitScreenView from "@/components/ui/ProposalSplitScreenView";
import ActiveFiltersDisplay from "@/features/Opportunity/components/table/ActiveFiltersDisplay";
import { proposalService } from "../../features/Opportunity/Services/proposalService";
import { useProposalSearch } from "@/features/Opportunity/contexts/ProposalSearchContext";

const Proposals = () => {
  const [view, setView] = useState("table");
  const [proposals, setProposals] = useState([]);
  const [filters, setFilters] = useState({
    proposalRep: "all",
  });
  const [stats, setStats] = useState({
    total: 0,
    amount: 0,
    activeProposals: 0,
    activeProposalsAmount: 0,
    sentProposals: 0,
    sentProposalsAmount : 0,
    approvedProposals: 0,
    approvedProposalsAmount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [apiColumnConfig, setApiColumnConfig] = useState(null);

  // Split screen state management - exactly like Pipeline.jsx
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);

  // Add opportunityResult state to match opportunities pattern
  const [opportunityResult, setOpportunityResult] = useState({});

  const pageSize = 25;

  const location = useLocation();
  const navigate = useNavigate();

  // Add ProposalSearchContext integration
  const { activeFilters } = useProposalSearch();

  // Add refs for tracking state
  const isFromAdvancedSearchRef = useRef(false);
  const isLoadingRef = useRef(false);
  const loadTimeoutRef = useRef(null);
  const lastApiCallRef = useRef({ filters: null, page: null, timestamp: null });

  // Parse search parameters from URL
  const searchParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    console.log("Proposals: Parsed search params from URL:", result);
    return result;
  }, [location.search]);

  // Sync filters state with URL query parameters, Advanced Search filters, and searchJson
  useEffect(() => {
    const urlFilters = {};

    // First, get all URL parameters using URLSearchParams directly
    const urlSearchParams = new URLSearchParams(location.search);
    for (const [key, value] of urlSearchParams.entries()) {
      if (value && value.trim() !== "") {
        urlFilters[key] = value;
      }
    }

    // Check for API payload in navigation state (new approach)
    const navigationState = location.state;
    let apiPayloadFilters = {};

    if (navigationState?.apiPayload && navigationState?.fromAdvancedSearch) {
      console.log(
        "Proposals: Detected API payload from Advanced Search:",
        navigationState.apiPayload
      );

      // Extract filters from API payload for UI display
      const payload = navigationState.apiPayload;
      apiPayloadFilters = {
        // Map API fields back to form field names for UI consistency
        opportunityName: payload.OppName?.replace(/SW=|~/g, "") || "",
        companyName: payload.CustomerName?.replace(/SW=|~/g, "") || "",
        businessUnit: payload.BusinessUnit?.replace(/IE=|~/g, "") || "",
        assignedRep: payload.AssignedTo?.replace(/IE=|~/g, "") || "",
        createdRep: payload.CreatedBy?.replace(/IE=|~/g, "") || "",
        salesPresenter: payload.SalesPresenter?.replace(/IE=|~/g, "") || "",
        source: payload.Source?.replace(/IE=|~/g, "") || "",
        products: payload.Products?.replace(/IE=|~/g, "") || "",
        proposalRep: payload.ProposalRep?.replace(/IE=|~/g, "") || "",
        proposalName: Array.isArray(payload.ProposalName) 
          ? payload.ProposalName.map(val => val.replace(/SW=|~/g, "")).join(", ")
          : payload.ProposalName?.replace(/SW=|~/g, "") || "",
        proposalStatus: payload.ProposalStatus?.replace(/IE=|~/g, "") || "",
        proposalApprovalStatus:
          payload.ProposalApprovalStatus?.replace(/IE=|~/g, "") || "",
      };

      isFromAdvancedSearchRef.current = true;

      // Log search summary for debugging
      if (navigationState.searchSummary) {
        console.log(
          "Proposals: Search summary:",
          navigationState.searchSummary
        );
      }
    }

    // Also check for legacy searchJson format
    if (
      navigationState?.searchJson &&
      navigationState?.fromAdvancedSearch &&
      !navigationState?.apiPayload
    ) {
      console.log(
        "Proposals: Detected legacy searchJson from Advanced Search:",
        navigationState.searchJson
      );
      apiPayloadFilters = navigationState.searchJson.criteria || {};
      isFromAdvancedSearchRef.current = true;
    }

    // Check if we're coming from Advanced Search (legacy approach or direct flag)
    const isFromAdvancedSearch =
      urlFilters.fromAdvancedSearch === "true" ||
      activeFilters.fromAdvancedSearch === "true" ||
      navigationState?.fromAdvancedSearch === true;
    if (isFromAdvancedSearch) {
      isFromAdvancedSearchRef.current = true;
      console.log("Proposals: Detected navigation from Advanced Search");
    }

    // Then, merge filters with priority: apiPayload > activeFilters > urlFilters
    // Use activeFilters as the base, override with URL filters for Quick Filters, and prioritize API payload filters
    const mergedFilters = {
      ...activeFilters,
      ...urlFilters,
      ...apiPayloadFilters,
    };

    // Special handling for proposalRep field to ensure synchronization
    if (activeFilters.proposalRep && activeFilters.proposalRep !== "all") {
      // If we have proposalRep from Advanced Search, preserve it
      let proposalRepValue = activeFilters.proposalRep;
      if (Array.isArray(proposalRepValue)) {
        // Convert array to IE format
        proposalRepValue = proposalRepValue
          .filter((v) => v && v.toString().trim() !== "")
          .map((v) => `IE=${v.toString().trim()}~`)
          .join("");
      } else if (
        typeof proposalRepValue === "string" &&
        !proposalRepValue.includes("IE=")
      ) {
        // Convert to IE format if not already
        proposalRepValue = `IE=${proposalRepValue.trim()}~`;
      }
      mergedFilters.proposalRep = proposalRepValue;
      console.log("Proposals: Converting Advanced Search proposalRep:", {
        original: activeFilters.proposalRep,
        converted: proposalRepValue,
      });
    } else if (urlFilters.proposalRep && urlFilters.proposalRep !== "all") {
      // If we have proposalRep from URL (Quick Filters), use it
      mergedFilters.proposalRep = urlFilters.proposalRep;
      console.log("Proposals: Using URL proposalRep:", urlFilters.proposalRep);
    }
    // Also check if proposalRep is in URL filters (from Advanced Search navigation)
    if (
      urlFilters.proposalRep &&
      urlFilters.proposalRep !== "all" &&
      !mergedFilters.proposalRep
    ) {
      let proposalRepValue = urlFilters.proposalRep;
      if (
        typeof proposalRepValue === "string" &&
        !proposalRepValue.includes("IE=")
      ) {
        // Convert to IE format if not already
        proposalRepValue = `IE=${proposalRepValue.trim()}~`;
      }
      mergedFilters.proposalRep = proposalRepValue;
      console.log(
        "Proposals: Converting URL proposalRep from Advanced Search:",
        {
          original: urlFilters.proposalRep,
          converted: proposalRepValue,
        }
      );
    }

    if (Object.keys(mergedFilters).length > 0) {
      console.log("Proposals: Merging filters from all sources:", {
        urlFilters,
        activeFilters,
        apiPayloadFilters,
        mergedFilters,
        isFromAdvancedSearch,
        hasApiPayload: !!navigationState?.apiPayload,
        hasLegacySearchJson: !!navigationState?.searchJson,
        "activeFilters.proposalRep": activeFilters.proposalRep,
        "urlFilters.proposalRep": urlFilters.proposalRep,
        "apiPayloadFilters.proposalRep": apiPayloadFilters.proposalRep,
        "mergedFilters.proposalRep": mergedFilters.proposalRep,
      });
      setFilters(mergedFilters);
    } else {
      // Reset to default filters if no URL or active filters
      setFilters({
        proposalRep: "all",
      });
    }
  }, [location.search, location.state, activeFilters]);

  // Handle company selection for split screen - exactly like Pipeline.jsx
  const handleCompanySelect = (companyName, companyData = null) => {
    console.log(
      "Proposals: Company selected:",
      companyName,
      "with data:",
      companyData
    );
    setSelectedCompany(companyName);
    setSelectedCompanyData(companyData);

    // Automatically switch to split screen view when company is selected
    console.log("Proposals: Switching to split view");
    setView("split");
  };

  // Handle closing the sidebar - exactly like Pipeline.jsx
  const handleCloseSidebar = () => {
    console.log("Proposals: Closing sidebar");
    setSelectedCompany(null);
    setSelectedCompanyData(null);

    // Return to table view when sidebar is closed
    console.log("Proposals: Returning to table view");
    setView("table");
  };

  // Load column configuration from API
  const loadColumnConfig = async () => {
    try {
      console.log("Proposals: Loading column configuration from API");

      // Call the column config API: services/AdvSearches/ResultViewColumn/1/2/-1
      const response = await proposalService.getColumnConfig();

      console.log("Proposals: Column config API response:", response);

      if (response?.content?.Status === "Success" && response?.content?.List) {
        const columnConfig = response.content.List;
        console.log("Proposals: Setting column config:", columnConfig);
        setApiColumnConfig(columnConfig);
        return columnConfig;
      } else {
        console.error("Proposals: Invalid column config response:", response);
        setApiColumnConfig(null);
        return null;
      }
    } catch (error) {
      console.error("Proposals: Failed to load column config:", error);
      setApiColumnConfig(null);
      return null;
    }
  };

  // Load proposals data using API
  const loadProposalsData = async (searchFilters = {}, page = 1) => {
    // Prevent duplicate API calls
    if (isLoadingRef.current) {
      console.log("🔍 DEBUG - Proposals: Skipping duplicate API call - already loading");
      return;
    }

    // Create a unique key for this API call to prevent duplicates
    // const currentCallKey = JSON.stringify({
    //   filters: searchFilters,
    //   page: page,
    // });

    // // Check if this is the same as the last API call (but allow initial load)
    // if (lastApiCallRef.current.filters === currentCallKey && lastApiCallRef.current.timestamp) {
    //   const timeSinceLastCall = Date.now() - lastApiCallRef.current.timestamp;
    //   if (timeSinceLastCall < 1000) { // Prevent duplicate calls within 1 second
    //     console.log("🔍 DEBUG - Proposals: Skipping duplicate API call - same parameters within 1 second");
    //     return;
    //   }
    // }

    try {
      console.log("🔍 DEBUG - Proposals: loadProposalsData called:", {
        searchFilters,
        page,
        proposalRep: searchFilters.proposalRep,
        type: typeof searchFilters.proposalRep,
        timestamp: new Date().toISOString(),
      });

      // Update the last API call reference
      // lastApiCallRef.current = {
      //   filters: currentCallKey,
      //   page: page,
      //   timestamp: Date.now()
      // };

      // console.log("🔍 DEBUG - Proposals: Making API call with parameters:", {
      //   searchFilters,
      //   page,
      //   callKey: currentCallKey,
      //   timestamp: new Date().toISOString()
      // });

      isLoadingRef.current = true;
      setIsLoading(true);

      // First, load column configuration
      const columnConfig = await loadColumnConfig();

      if (!columnConfig) {
        console.error(
          "Proposals: No column config available, cannot load proposals"
        );
        setProposals([]);
        setTotalItems(0);
        setTotalPages(1);
        return;
      }

      // Check if we have an API payload from Advanced Search
      const navigationState = location.state;
      let apiPayload = null;

      if (navigationState?.apiPayload && navigationState?.fromAdvancedSearch) {
        console.log("🔍 DEBUG - Proposals: Using API payload from Advanced Search:", navigationState.apiPayload);
        apiPayload = navigationState.apiPayload;
        
        // Add page information to the API payload
        apiPayload = {
          ...apiPayload,
          CurPage: page
        };
      } else {
        // Use the proposalService to build the payload from individual filters
        console.log("🔍 DEBUG - Proposals: Building API payload from individual filters");
        const response = await proposalService.searchProposals({
          ...searchFilters,
          CurPage: page,
        });

        console.log("Proposals: Proposal data API response:", response);

        // Process the API response and update proposals state
        const apiOpportunities = response.content?.Data?.Opportunities || [];
        const apiResult = response.content?.Data?.OpportunityResult?.[0] || {};

        // Extract total count from API response - use "Total" key as mentioned
        const totalCount =
          response.content?.Data?.Total ||
          apiResult.TotIds ||
          apiOpportunities.length;

        console.log("Proposals: API opportunities:", apiOpportunities);
        console.log("Proposals: Total count from API:", totalCount);
        console.log("Proposals: API result:", apiResult);

        // Store the opportunity result to match opportunities pattern
        setOpportunityResult(apiResult);

        if (apiOpportunities.length > 0) {
          // Use original API data structure without transformation
          console.log("Proposals: Using original API data structure");
          setProposals(apiOpportunities);

          // Set total items from API response using "Total" key
          setTotalItems(totalCount);

          // Calculate total pages based on total items and page size
          const calculatedTotalPages = Math.ceil(totalCount / pageSize) || 1;
          setTotalPages(calculatedTotalPages);

          console.log(
            "Proposals: Calculated total pages:",
            calculatedTotalPages,
            "for total count:",
            totalCount
          );
        } else {
          // No results from API, set empty state
          console.log("Proposals: No results from API");
          setProposals([]);
          setTotalItems(0);
          setTotalPages(1);
        }

        return; // Exit early since we've already processed the response
      }

      // If we have an API payload from Advanced Search, make the API call directly
      if (apiPayload) {
        console.log("🔍 DEBUG - Proposals: Making direct API call with payload from Advanced Search");
        
        // Import apiService to make the direct API call
        const { default: apiService } = await import('@/features/Opportunity/Services/apiService');
        
        const response = await apiService.post('/services/opportunities/report/all/', apiPayload);

        console.log("Proposals: Direct API response:", response);

        // Process the API response and update proposals state
        const apiOpportunities = response.content?.Data?.Opportunities || [];
        const apiResult = response.content?.Data?.OpportunityResult?.[0] || {};

        // Extract total count from API response - use "Total" key as mentioned
        const totalCount =
          response.content?.Data?.Total ||
          apiResult.TotIds ||
          apiOpportunities.length;

        console.log("Proposals: API opportunities:", apiOpportunities);
        console.log("Proposals: Total count from API:", totalCount);
        console.log("Proposals: API result:", apiResult);

        // Store the opportunity result to match opportunities pattern
        setOpportunityResult(apiResult);

        if (apiOpportunities.length > 0) {
          // Use original API data structure without transformation
          console.log("Proposals: Using original API data structure");
          setProposals(apiOpportunities);

          // Set total items from API response using "Total" key
          setTotalItems(totalCount);

          // Calculate total pages based on total items and page size
          const calculatedTotalPages = Math.ceil(totalCount / pageSize) || 1;
          setTotalPages(calculatedTotalPages);

          console.log(
            "Proposals: Calculated total pages:",
            calculatedTotalPages,
            "for total count:",
            totalCount
          );
        } else {
          // No results from API, set empty state
          console.log("Proposals: No results from API");
          setProposals([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      }

    } catch (error) {
      console.error("Proposals: Failed to load data:", error);
      // Set empty state on error
      setProposals([]);
      setTotalItems(0);
      setTotalPages(1);
      setOpportunityResult({});
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false; // Reset the ref after loading
    }
  };

  // Handle view selection for proposals - this will refresh the grid
  const handleViewSelected = (selectedView) => {
    console.log(
      "Proposals: View selected, refreshing proposal grid for view:",
      selectedView.NameOfView
    );
    // Reset to first page and reload data with current filters
    setCurrentPage(1);
    loadProposalsData({ ...filters, ...searchParams }, 1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    console.log("Proposals: Changing to page", newPage);
    setCurrentPage(newPage);
    // Updated to match API expectation of 1-indexed pages
    loadProposalsData({ ...filters, ...searchParams }, newPage);
  };

  useEffect(() => {
    // Clear any existing timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    // Debounce the API call to prevent multiple rapid calls
    loadTimeoutRef.current = setTimeout(() => {
      console.log("🔍 DEBUG - Proposals: Debounced loadProposalsData call:", {
        filters,
        searchParams,
        location: location.pathname,
      });
      loadProposalsData({ ...filters, ...searchParams }, 1);
    }, 100); // 100ms debounce

    // Cleanup timeout on unmount
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [location.search, filters]); // Added currentPage to dependencies

  // Filter proposals based on search parameters and filters
  const filteredProposals = useMemo(() => {
    // Add your filtering logic here if needed, or just return proposals if no filters
    // For now, just return proposals as is
    return proposals;
  }, [proposals, filters]);

  const handleFilterChange = (filterType, value) => {
    console.log("Proposals: Filter changed:", filterType, "value:", value);

    // Update local filters state
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));

    // Update URL parameters for Quick Filters (similar to Pipeline.jsx)
    const currentParams = new URLSearchParams(location.search);

    // Special handling for proposalRep field
    if (filterType === "proposalRep") {
      if (value === "all" || (Array.isArray(value) && value.length === 0)) {
        currentParams.delete("proposalRep");
      } else if (Array.isArray(value)) {
        // Convert array to IE format for URL
        const ieFormat = value
          .filter((v) => v && v.toString().trim() !== "")
          .map((v) => `IE=${v.toString().trim()}~`)
          .join("");
        currentParams.set("proposalRep", ieFormat);
      } else if (typeof value === "string" && value.includes("IE=")) {
        // Already in IE format, use as is
        currentParams.set("proposalRep", value);
      } else {
        // Convert to IE format
        currentParams.set("proposalRep", `IE=${value.trim()}~`);
      }
    } else {
      // For other filter types
      if (
        value === "all" ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        currentParams.delete(filterType);
      } else if (Array.isArray(value)) {
        currentParams.set(filterType, value.join(","));
      } else {
        currentParams.set(filterType, value);
      }
    }

    // Update URL without triggering a page reload
    navigate(`${location.pathname}?${currentParams.toString()}`, {
      replace: true,
    });

    // Reset to first page and let the useEffect handle the API call
    setCurrentPage(1);
    // Don't call loadProposalsData directly - let the useEffect handle it
    loadProposalsData(newFilters, 1);
  };

  const handleRefresh = () => {
    console.log("Refreshing proposals data...");
    // Reset to first page (API expects 1-indexed pages)
    setCurrentPage(1);
    // Don't call loadProposalsData directly - let the useEffect handle it
    loadProposalsData({ ...filters, ...searchParams }, 1);
  };

  const handleClose = () => {
    console.log("Close button clicked, navigating to /");
    navigate("/");
  };

  const handleAddProposal = () => {
    console.log("Add proposal button clicked - redirecting to Add Opportunity");
    navigate("/add-opportunity");
  };

  // Update stats from opportunityResult when it changes - exactly like Pipeline.jsx
  useEffect(() => {
    console.log(
      "Proposals: Updating stats from opportunityResult:",
      opportunityResult
    );


    // Use exact field names from the API response - no hardcoding
    debugger;
    const total = opportunityResult.Proposals ?? 0;
    const amount = opportunityResult.ProposalsAmount ?? 0;
    // const activeProposals = opportunityResult.ActiveProposals ?? 0;
    // const activeAmount = opportunityResult.ActiveProposalsAmount ?? 0;
    // const sentProposals = opportunityResult.SentProposals ?? 0;
    // const sentAmount = opportunityResult.SentProposalsAmount ?? 0;
    // const approved = opportunityResult.ApprovedProposals ?? 0;
    // const approvedAmount = opportunityResult.ApprovedProposalsAmount ?? 0;
    // const open = opportunityResult.Open ?? 0;
    // const won = opportunityResult.Won ?? 0;
    // const lost = opportunityResult.Lost ?? 0;
    // const winTotal = opportunityResult.WinTotal ?? 0;
    // const avgValue = opportunityResult.AvgValue ?? 0;
    const activeProposals = opportunityResult.ActiveProposals ?? 0;
    const activeProposalsAmount = opportunityResult.ActiveProposalsAmount ?? 0;
    const sentProposals = opportunityResult.SentProposals ?? 0;
    const sentProposalsAmount = opportunityResult.SentProposalsAmount ?? 0;
    const approvedProposals = opportunityResult.ApprovedProposals ?? 0;
    const approvedProposalsAmount = opportunityResult.ApprovedProposalsAmount ?? 0;

    // Calculate win percentage based on approved vs total proposals
    // const winPercentage = total > 0 ? Math.round((approved / total) * 100) : 0;
     setStats({
      total,
      amount,
      activeProposals,
    activeProposalsAmount,
    sentProposals,
    sentProposalsAmount,
    approvedProposals,
    approvedProposalsAmount
    });

   
    // console.log("Proposals: Updated stats from API response:", {
    //   total,
    //   amount,
    //   activeProposals,
    //   activeAmount,
    //   sentProposals,
    //   sentAmount,
    //   approved,
    //   approvedAmount,
    //   winPercentage,
    //   avgValue,
    // });
  }, [opportunityResult]);

  const renderView = () => {
    switch (view) {
      case "kanban":
        return (
          <ProposalKanbanView
            proposals={filteredProposals}
            view={view}
            onViewChange={setView}
          />
        );
      case "cards":
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
      case "split":
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
          <h1 className="text-2xl font-bold text-[#1a4d80]">
            Proposals Dashboard
          </h1>
          {/* Removed top-right Add button; it will be shown inside filters like Opportunities */}
        </div>

        {view !== "kanban" && view !== "split" && (
          <ProposalStatsCards stats={stats} />
        )}

        {renderView()}
      </div>
    </div>
  );
};

export default Proposals;
