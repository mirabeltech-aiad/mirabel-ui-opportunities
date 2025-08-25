import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import OpportunityStatsCards from "../../features/Opportunity/components/ui/OpportunityStatsCards";
import OpportunitiesTable from "../../features/Opportunity/components/ui/OpportunitiesTable";
import OpportunityCardView from "../../features/Opportunity/components/ui/OpportunityCardView";
import KanbanView from "../../features/Opportunity/components/ui/KanbanView";
import SplitScreenView from "../../features/Opportunity/components/ui/SplitScreenView";
import ViewToggle from "@/components/ui/ViewToggle";
import { useApiData } from "@/features/Opportunity/hooks/useApiData";
import { useOpportunitySearch } from "@/features/Opportunity/contexts/OpportunitySearchContext";
import { processOpportunitySearchParams } from "@/features/Opportunity/components/AdvancedSearch/searchHelpers";
import Loader from "@/components/ui/loader";
import { opportunitiesService } from "@/features/Opportunity/Services/opportunitiesService";
import apiService from "@/features/Opportunity/Services/apiService";
import contactsApi from "@/services/contactsApi";

const Pipeline = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { activeFilters } = useOpportunitySearch();

  // Extract pre-fetched search results from navigation state
  const preFetchedResults = location.state?.searchResults || null;

  const {
    opportunities,
    users,
    savedSearches,
    isLoading,
    error,
    currentPage,
    totalCount,
    opportunityResult, // <-- now available from useApiData
    refetchData,
    goToNextPage,
    goToPreviousPage,
    apiColumnConfig,
  } = useApiData(preFetchedResults);

  const [view, setView] = useState("table");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [stages, setStages] = useState([]);
  const [stagesLoading, setStagesLoading] = useState(true);
  const [leadSourcesMaster, setLeadSourcesMaster] = useState([]);
  const [leadTypesMaster, setLeadTypesMaster] = useState([]);
  const [prospectingStages, setProspectingStages] = useState([]);
  const [selectedView, setSelectedView] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);

  const [filters, setFilters] = useState({
    quickStatus: "All Opportunities",
    probability: [], // Always default to empty array for correct UI/checkbox sync
    assignedRep: [], // Default to empty array for "All Reps" selection
  });

  // Debounce mechanism to prevent rapid API calls
  const debounceTimeoutRef = useRef(null);
  const lastApiCallRef = useRef({
    filters: null,
    selectedView: null,
    searchParams: null,
  });
  const hasInitialApiCallRef = useRef(false);
  const isFromAdvancedSearchRef = useRef(false);

  // Sync filters state with URL query parameters, Advanced Search filters, and searchJson
  useEffect(() => {
    const urlFilters = {};

    // First, get all URL parameters
    for (const [key, value] of searchParams.entries()) {
      if (value && value.trim() !== "") {
        urlFilters[key] = value;
      }
    }

    // Check for API payload in navigation state (new approach)
    const navigationState = location.state;
    let apiPayloadFilters = {};

    if (navigationState?.apiPayload && navigationState?.fromAdvancedSearch) {
      console.log(
        "Pipeline: Detected API payload from Advanced Search:",
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
        stage: payload.Stage?.replace(/IE=|~/g, "") || "",
        status: payload.Status || "",
        probability: payload.Probability?.replace(/IE=|~/g, "") || "",
      };

      isFromAdvancedSearchRef.current = true;

      // Log search summary for debugging
      if (navigationState.searchSummary) {
        console.log("Pipeline: Search summary:", navigationState.searchSummary);
      }

      // Check if we have pre-fetched search results
      if (navigationState.searchResults) {
        console.log(
          "Pipeline: Detected pre-fetched search results:",
          navigationState.searchResults
        );
        // The search results are already available and will be used by the grid
        // The useApiData hook will need to be updated to handle these results
      }
    }

    // Also check for legacy searchJson format
    if (
      navigationState?.searchJson &&
      navigationState?.fromAdvancedSearch &&
      !navigationState?.apiPayload
    ) {
      console.log(
        "Pipeline: Detected legacy searchJson from Advanced Search:",
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
    }

    // Then, merge filters with priority: apiPayload > activeFilters > urlFilters
    // Use activeFilters as the base, override with URL filters for Quick Filters, and prioritize API payload filters
    // But preserve Advanced Search status if it exists
    const mergedFilters = {
      ...activeFilters,
      ...urlFilters,
      ...apiPayloadFilters,
    };

    // If we have Advanced Search status, ensure it's not overridden by URL parameters
    if (
      activeFilters.status &&
      activeFilters.status !== "All" &&
      activeFilters.status !== "All Opportunities"
    ) {
      mergedFilters.status = activeFilters.status;
    }

    if (Object.keys(mergedFilters).length > 0) {
      setFilters(mergedFilters);
    } else {
      // Reset to default filters if no URL or active filters
      // But preserve status from Advanced Search if we're coming from there
      const defaultStatus =
        isFromAdvancedSearch && activeFilters.status
          ? activeFilters.status
          : "All Opportunities";
      setFilters({
        quickStatus: defaultStatus,
        probability: [],
        assignedRep: [],
      });
    }
  }, [searchParams, location.state, activeFilters]);

  const [stats, setStats] = useState({
    total: 0,
    amount: 0,
    won: 0,
    open: 0,
    lost: 0,
    winTotal: 0,
    winPercentage: 0,
  });

  // Fetch stages once for the entire page
  useEffect(() => {
    const fetchStages = async () => {
      try {
        setStagesLoading(true);
        const response = await opportunitiesService.getOpportunityStages();

        if (response?.content?.List) {
          const sortedStages = response.content.List.sort(
            (a, b) => a.SortOrder - b.SortOrder
          ).map((stageData) => ({
            id: stageData.ID,
            name: stageData.Stage,
            colorCode: stageData.ColorCode,
            description: stageData.Description,
            sortOrder: stageData.SortOrder,
          }));
          setStages(sortedStages);
        }
      } catch (error) {
        console.error("Error fetching stages:", error);
      } finally {
        setStagesLoading(false);
      }
    };
    fetchStages();
  }, []);

  // Check settings on initial load
  useEffect(() => {
    const CHECK_INITIAL_SETTINGS = async () => {
      if (isInitialLoad) {
        try {
          console.log("Checking initial settings for first-time load...");

          // Check if there are search parameters in the URL
          const urlParams = new URLSearchParams(window.location.search);
          const hasSearchParams = urlParams.toString().length > 0;

          if (hasSearchParams) {
            console.log(
              "Search parameters detected in URL, skipping settings redirect:",
              urlParams.toString()
            );
            // Don't set isInitialLoad(false) here - let the data fetching effect handle it
            return;
          }

          const response = await apiService.get(
            "/services/Reports/Settings/1/-1"
          );
          console.log("Initial settings response:", response);
          if (response?.content?.Data?.ShowType !== undefined) {
            const showType = response.content.Data.ShowType;
            console.log("ShowType value:", showType);

            if (showType === 0) {
              console.log("Navigating to Advanced Search based on ShowType 0");
              // Navigate to advanced search with opportunities tab and preserve current filters
              const advancedSearchParams = new URLSearchParams();

              // Copy all current filters to preserve them, but exclude default "All Opportunities" status
              for (const [key, value] of Object.entries(filters)) {
                if (
                  value &&
                  value.toString().trim() !== "" &&
                  !(key === "status" && value === "All Opportunities")
                ) {
                  advancedSearchParams.set(key, value);
                }
              }

              // Set the tab parameter to opportunities
              advancedSearchParams.set("tab", "opportunities");

              const finalUrl = `/advanced-search?${advancedSearchParams.toString()}`;
              console.log(
                "Navigating to advanced search with opportunities tab:",
                finalUrl
              );
              navigate(finalUrl);
              return;
            } else {
              console.log("Staying on Opportunities table based on ShowType 1");
            }
          }
        } catch (error) {
          console.error("Error fetching initial settings:", error);
        }
        // Note: Don't set isInitialLoad(false) here as it interferes with data loading
      }
    };
    // CHECK_INITIAL_SETTINGS();
  }, [isInitialLoad, navigate, filters]);

  // Load masters for Lead Source, Lead Type, and Prospecting Stages (API-driven)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [srcRes, typeRes, prospectingRes] = await Promise.all([
          contactsApi.getLeadSources().catch((err) => {
            console.warn("Pipeline: Lead Sources API failed:", err.message);
            return [];
          }),
          contactsApi.getLeadTypes().catch((err) => {
            console.warn("Pipeline: Lead Types API failed:", err.message);
            return [];
          }),
          contactsApi.getProspectingStages().catch((err) => {
            console.warn(
              "Pipeline: Prospecting Stages API failed:",
              err.message
            );
            return [];
          }),
        ]);

        const mapToOptions = (res) => {
          const root =
            res?.data?.content ?? res?.content ?? res?.data ?? res ?? {};
          const list =
            root?.Data?.List ?? root?.List ?? root?.data ?? root?.items ?? [];
          return Array.isArray(list)
            ? list.map((item) => ({
                value:
                  item.ID ??
                  item.Id ??
                  item.Value ??
                  item.value ??
                  item.Name ??
                  item.Display ??
                  String(item),
                label:
                  item.Display ??
                  item.Name ??
                  item.Label ??
                  item.label ??
                  String(item),
              }))
            : [];
        };

        const mapProspectingStages = (res) => {
          const root =
            res?.data?.content ?? res?.content ?? res?.data ?? res ?? {};
          const list =
            root?.Data?.List ?? root?.List ?? root?.data ?? root?.items ?? [];
          return Array.isArray(list)
            ? list.map((item) => ({
                StageName:
                  item.Display ??
                  item.Name ??
                  item.Label ??
                  item.label ??
                  String(item),
                StageId: item.ID ?? item.Id ?? item.Value ?? item.value,
                ColorCode: item.ColorCode ?? item.colorCode ?? "#4fb3ff",
              }))
            : [];
        };

        if (isMounted) {
          // contactsApi now returns formatted data directly
          const leadSources = srcRes || [];
          const leadTypes = typeRes || [];
          const prospectingStages = prospectingRes || [];

          // Log only if data is empty to help with debugging
          if (leadSources.length === 0)
            console.warn("Pipeline: No lead sources loaded");
          if (leadTypes.length === 0)
            console.warn("Pipeline: No lead types loaded");
          if (prospectingStages.length === 0)
            console.warn("Pipeline: No prospecting stages loaded");

          setLeadSourcesMaster(leadSources);
          setLeadTypesMaster(leadTypes);
          setProspectingStages(prospectingStages);
        }
      } catch (error) {
        console.error("Pipeline: Failed to load master data:", error);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Consolidated data fetching effect - handles all filter changes in one place
  useEffect(() => {
    console.log("Pipeline: Data fetching triggered");
    console.log("Current state:", {
      filters,
      activeFilters,
      selectedView,
      searchParams: Array.from(searchParams.entries()),
      isInitialLoad,
      preFetchedResults: !!preFetchedResults,
    });

    // Check if we have pre-fetched results from Advanced Search
    if (preFetchedResults && preFetchedResults.success) {
      console.log(
        "Pipeline: Using pre-fetched results from Advanced Search, skipping API call"
      );

      // Mark that we've handled the initial data
      if (isInitialLoad) {
        hasInitialApiCallRef.current = true;
        setIsInitialLoad(false);
      }

      // Reset the Advanced Search flag
      if (isFromAdvancedSearchRef.current) {
        isFromAdvancedSearchRef.current = false;
      }

      return; // Skip the API call since we have pre-fetched results
    }

    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Create a unique key for this API call to prevent duplicates
    const currentCallKey = JSON.stringify({
      filters: filters,
      selectedView: selectedView?.ID,
    });

    // Check if this is the same as the last API call (but allow initial load)
    if (!isInitialLoad && lastApiCallRef.current.filters === currentCallKey) {
      console.log("Pipeline: Skipping duplicate API call");
      return;
    }

    // Debounce the API call to prevent rapid successive calls
    debounceTimeoutRef.current = setTimeout(
      () => {
        let apiFilters = {};

        // Priority 1: If a saved view is selected, use view filters combined with current filter state
        if (selectedView) {
          console.log("Using saved view filters:", selectedView.NameOfView);

          // Start with view-specific filters (for column config)
          let viewApiFilters = {
            viewId: selectedView.ID,
            visibleColumns: selectedView.VisibleColumns,
          };

          // Check if we have filters state (which should contain search criteria if view was processed)
          if (Object.keys(filters).length > 0) {
            console.log(
              "Pipeline: Processing current filters state for view:",
              filters
            );

            // Use the current filters state to build API filters
            // This should contain the search criteria that was extracted during view selection
            const processedFilters = processOpportunitySearchParams(filters);
            console.log(
              "Pipeline: Processed filters for view:",
              processedFilters
            );

            const criteriaApiFilters = buildApiFiltersFromUIFilters(
              processedFilters,
              savedSearches,
              users
            );

            // Merge view-specific filters with search criteria filters
            viewApiFilters = { ...viewApiFilters, ...criteriaApiFilters };
            console.log(
              "Pipeline: Merged view API filters with filters state:",
              viewApiFilters
            );
          } else {
            console.log(
              "Pipeline: No filters state available, using view ID only"
            );
          }

          apiFilters = viewApiFilters;
        }
        // Priority 2: If there are active filters (from Advanced Search or Quick Filters), use them
        else if (Object.keys(filters).length > 0) {
          console.log("Using merged filters:", filters);

          // Use the same processing as Advanced Search to ensure consistency
          const processedFilters = processOpportunitySearchParams(filters);
          console.log(
            "Processed filters using Advanced Search logic:",
            processedFilters
          );

          // Build API filters using the processed filters
          apiFilters = buildApiFiltersFromUIFilters(
            processedFilters,
            savedSearches,
            users
          );
        }
        // Priority 3: If there are URL parameters but no processed filters, use URL params directly
        else {
          const urlFilters = {};
          for (const [key, value] of searchParams.entries()) {
            if (value && value.trim() !== "") {
              urlFilters[key] = value;
            }
          }
          if (Object.keys(urlFilters).length > 0) {
            console.log("Using URL filters:", urlFilters);
            apiFilters = urlFilters;
          }
        }

        // If no filters at all, ensure we still fetch data (default view)
        if (Object.keys(apiFilters).length === 0) {
          console.log(
            "Pipeline: No filters found, using default filters for initial load"
          );
          apiFilters = { quickStatus: "" }; // Empty quickStatus means "All Opportunities"
        }

        // Update the last call reference
        lastApiCallRef.current.filters = currentCallKey;

        // Mark that we've made the initial API call
        if (isInitialLoad) {
          hasInitialApiCallRef.current = true;
        }

        // Reset the Advanced Search flag after the first API call
        if (isFromAdvancedSearchRef.current) {
          isFromAdvancedSearchRef.current = false;
        }

        refetchData(apiFilters);

        // Reset isInitialLoad after making the API call
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      },
      isInitialLoad || selectedView ? 0 : 300
    ); // No debounce for initial load or view changes, 300ms for filter changes
  }, [
    filters,
    selectedView?.ID, // Include selectedView ID to trigger data fetch when view changes
    searchParams.toString(), // Convert to string to stabilize dependency
    isInitialLoad,
    preFetchedResults, // Add preFetchedResults as dependency
    refetchData,
    savedSearches?.allOpportunities?.length, // Only depend on length to reduce re-renders
    savedSearches?.myOpportunities?.length,
    users?.length, // Only depend on length to reduce re-renders
  ]);

  // Failsafe useEffect to ensure initial data fetch on component mount
  useEffect(() => {
    // Skip if we have pre-fetched results from Advanced Search
    if (preFetchedResults && preFetchedResults.success) {
      console.log(
        "Pipeline: Skipping failsafe data fetch - pre-fetched results available"
      );
      return;
    }

    // Only run on initial mount if no API call has been made yet
    if (isInitialLoad && !hasInitialApiCallRef.current) {
      console.log("Pipeline: Failsafe initial data fetch triggered");
      const timer = setTimeout(() => {
        if (!hasInitialApiCallRef.current) {
          console.log("Pipeline: Executing failsafe data fetch");
          refetchData({ quickStatus: "" }); // Fetch all opportunities
          hasInitialApiCallRef.current = true;
          setIsInitialLoad(false);
        }
      }, 100); // Small delay to let other effects run first

      return () => clearTimeout(timer);
    }
  }, [preFetchedResults]); // Add preFetchedResults as dependency

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle company selection from table row click
  const handleCompanySelect = (company, companyData = null) => {
    console.log("Pipeline: Company selected:", company);
    setSelectedCompany(company);
    setSelectedCompanyData(companyData);
    setView("split"); // Switch to split-screen view
  };

  // Handle view change with auto-selection for split view - memoized to prevent re-renders
  const handleViewChange = useCallback(
    (newView) => {
      setView(newView);

      // Auto-select first company when switching to split view
      if (newView === "split" && opportunities.length > 0 && !selectedCompany) {
        const firstOpportunity = opportunities[0];
        const firstCompany =
          firstOpportunity.companyName || firstOpportunity.company;
        if (firstCompany) {
          console.log(
            "Pipeline: Auto-selecting first company for split view:",
            firstCompany
          );
          setSelectedCompany(firstCompany);
          setSelectedCompanyData(firstOpportunity);
        }
      }
    },
    [opportunities, selectedCompany]
  ); // Dependencies for useCallback

  // Handle closing the company sidebar
  const handleCloseSidebar = () => {
    console.log("Pipeline: Closing sidebar, returning to table view");
    setSelectedCompany(null);
    setSelectedCompanyData(null);
    setView("table"); // Return to full table view
  };

  // Auto-update selected company when opportunities change in split view
  useEffect(() => {
    if (view === "split") {
      if (opportunities.length > 0) {
        // Check if currently selected company still exists in filtered results
        const currentCompanyExists = opportunities.some(
          (opp) => (opp.companyName || opp.company) === selectedCompany
        );

        if (!currentCompanyExists || !selectedCompany) {
          // Auto-select first company from filtered results
          const firstOpportunity = opportunities[0];
          const firstCompany =
            firstOpportunity.companyName || firstOpportunity.company;

          if (firstCompany) {
            console.log(
              "Pipeline: Auto-updating selected company in split view due to filter change:",
              firstCompany
            );
            setSelectedCompany(firstCompany);
            setSelectedCompanyData(firstOpportunity);
          }
        } else {
          // Update selectedCompanyData with current data for the same company
          const updatedCompanyData = opportunities.find(
            (opp) => (opp.companyName || opp.company) === selectedCompany
          );
          if (updatedCompanyData) {
            console.log(
              "Pipeline: Updating company data for existing selected company:",
              selectedCompany
            );
            setSelectedCompanyData(updatedCompanyData);
          }
        }
      } else {
        // No opportunities available, clear selection
        console.log(
          "Pipeline: No opportunities available, clearing company selection"
        );
        setSelectedCompany(null);
        setSelectedCompanyData(null);
      }
    }
  }, [opportunities, view, selectedCompany]);

  useEffect(() => {
    // Update stats from opportunityResult when it changes
    setStats({
      total: opportunityResult.TotIds || 0,
      amount: opportunityResult.TotOppAmt || 0,
      won: opportunityResult.Won || 0,
      open: opportunityResult.Open || 0,
      lost: opportunityResult.Lost || 0,
      winTotal: opportunityResult.WinTotal || 0,
      winPercentage: opportunityResult.WinRatio || 0,
    });
  }, [opportunityResult]);

  // Helper to build API filters from UI filters
  function buildApiFiltersFromUIFilters(filters, savedSearches, users) {
    const apiFilters = {};

    // Quick Status (Quick Filter)
    if (filters.quickStatus && filters.quickStatus !== "All Opportunities") {
      const statusValue = filters.quickStatus;
      if (
        statusValue !== "All Opportunities" &&
        statusValue !== "Open Opportunities" &&
        statusValue !== "Won Opportunities" &&
        statusValue !== "Lost Opportunities"
      ) {
        let selectedSearch = null;
        if (savedSearches.allOpportunities) {
          selectedSearch = savedSearches.allOpportunities.find(
            (search) => search.Name === statusValue
          );
        }
        if (!selectedSearch && savedSearches.myOpportunities) {
          selectedSearch = savedSearches.myOpportunities.find(
            (search) => search.Name === statusValue
          );
        }
        if (selectedSearch) {
          apiFilters.ListID = selectedSearch.ID;
          if (
            selectedSearch.SearchCriteriaJSON &&
            selectedSearch.SearchCriteriaJSON.trim() !== ""
          ) {
            try {
              const searchCriteria = JSON.parse(
                selectedSearch.SearchCriteriaJSON
              );
              if (searchCriteria.Status && searchCriteria.Status !== "") {
                apiFilters.status = searchCriteria.Status;
              }
              if (
                searchCriteria.AssignedTo &&
                searchCriteria.AssignedTo !== ""
              ) {
                apiFilters.assignedRepId = searchCriteria.AssignedTo;
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      } else {
        const standardStatusValue =
          statusValue === "All Opportunities"
            ? ""
            : statusValue === "Open Opportunities"
            ? "Open"
            : statusValue === "Won Opportunities"
            ? "Won"
            : statusValue === "Lost Opportunities"
            ? "Lost"
            : "";
        if (standardStatusValue !== "") {
          apiFilters.quickStatus = standardStatusValue;
        }
      }
    }

    // Advanced Search Status (from Advanced Search)
    if (
      filters.status &&
      filters.status !== "All" &&
      filters.status !== "All Opportunities"
    ) {
      const statusValue = String(filters.status).trim();
      if (
        statusValue &&
        statusValue !== "All" &&
        statusValue !== "All Opportunities"
      ) {
        apiFilters.status = statusValue;
        console.log("Pipeline: Setting Advanced Search status:", statusValue);
      }
    }

    // Assigned Rep - handle both array and single value
    if (
      filters.assignedRep &&
      filters.assignedRep !== "All Reps" &&
      (!Array.isArray(filters.assignedRep) || filters.assignedRep.length > 0)
    ) {
      // Handle array of assigned reps
      if (Array.isArray(filters.assignedRep)) {
        if (filters.assignedRep.length > 0) {
          apiFilters.assignedRep = filters.assignedRep;
          console.log(
            "Pipeline: Setting assignedRep array:",
            filters.assignedRep
          );
        }
      } else if (typeof filters.assignedRep === "string") {
        // Handle IE format (e.g., "IE=178~IE=170~")
        if (filters.assignedRep.includes("IE=")) {
          const repIds = filters.assignedRep
            .split("~")
            .filter(Boolean)
            .map((item) => item.replace("IE=", ""))
            .filter(Boolean);
          if (repIds.length > 0) {
            apiFilters.assignedRep = repIds;
            console.log("Pipeline: Converting IE format to array:", repIds);
          }
        } else {
          // Handle single assigned rep value (backward compatibility)
          const selectedUser = users.find(
            (user) => user.display === filters.assignedRep
          );
          if (selectedUser) {
            apiFilters.assignedRepId = selectedUser.id;
            apiFilters.assignedRep = filters.assignedRep;
          }
        }
      }
    }

    // Probability
    if (
      filters.probability &&
      filters.probability !== "All Probability" &&
      filters.probability !== "All"
    ) {
      // Handle array of probabilities
      if (Array.isArray(filters.probability)) {
        if (filters.probability.length > 0) {
          apiFilters.probability = filters.probability;
          console.log(
            "Pipeline: Setting probability array:",
            filters.probability
          );
        }
      } else if (typeof filters.probability === "string") {
        // Handle IE format (e.g., "IE=20~IE=30~")
        if (filters.probability.includes("IE=")) {
          const probValues = filters.probability
            .split("~")
            .filter(Boolean)
            .map((item) => item.replace("IE=", ""))
            .filter(Boolean);
          if (probValues.length > 0) {
            apiFilters.probability = probValues;
            console.log(
              "Pipeline: Converting probability IE format to array:",
              probValues
            );
          }
        } else {
          // Handle single probability value (backward compatibility)
          apiFilters.probability = filters.probability;
        }
      }
    }

    // Handle Advanced Search fields that might be present in URL
    // Company Name Basic
    if (filters.companyNameBasic) {
      apiFilters.companyNameBasic = filters.companyNameBasic;
      console.log(
        "Pipeline: Adding companyNameBasic filter:",
        filters.companyNameBasic
      );
    }
    // since Company name and company name basic are same field, we need to handle both
    if (filters.companyName) {
      if (apiFilters.companyNameBasic) {
        apiFilters.companyNameBasic += `${filters.companyName}`;
      } else {
        apiFilters.companyNameBasic = `${filters.companyName}`;
      }
    }

    // Created Rep
    if (filters.createdRep) {
      apiFilters.createdRep = filters.createdRep;
      console.log("Pipeline: Adding createdRep filter:", filters.createdRep);
    }

    // Opportunity Name Basic
    if (filters.opportunityNameBasic) {
      apiFilters.opportunityNameBasic = filters.opportunityNameBasic;
      console.log(
        "Pipeline: Adding opportunityNameBasic filter:",
        filters.opportunityNameBasic
      );
    }

    // Business Unit
    if (filters.businessUnit) {
      apiFilters.businessUnit = filters.businessUnit;
      console.log(
        "Pipeline: Adding businessUnit filter:",
        filters.businessUnit
      );
    }

    // Product
    if (filters.product) {
      apiFilters.product = filters.product;
      console.log("Pipeline: Adding product filter:", filters.product);
    }

    // Source
    if (filters.source) {
      apiFilters.source = filters.source;
      console.log("Pipeline: Adding source filter:", filters.source);
    }

    // Sales Presenter
    if (filters.salesPresenter) {
      apiFilters.salesPresenter = filters.salesPresenter;
      console.log(
        "Pipeline: Adding salesPresenter filter:",
        filters.salesPresenter
      );
    }

    // Primary Campaign
    if (filters.primaryCampaign) {
      apiFilters.primaryCampaign = filters.primaryCampaign;
      console.log(
        "Pipeline: Adding primaryCampaign filter:",
        filters.primaryCampaign
      );
    }

    // Lead Status
    if (filters.leadStatus) {
      apiFilters.leadStatus = filters.leadStatus;
      console.log("Pipeline: Adding leadStatus filter:", filters.leadStatus);
    }

    // Lead Type
    if (filters.leadType) {
      apiFilters.leadType = filters.leadType;
      console.log("Pipeline: Adding leadType filter:", filters.leadType);
    }

    // Lead Source
    if (filters.leadSource) {
      apiFilters.leadSource = filters.leadSource;
      console.log("Pipeline: Adding leadSource filter:", filters.leadSource);
    }

    // Stage
    if (filters.stage) {
      apiFilters.stage = filters.stage;
      console.log("Pipeline: Adding stage filter:", filters.stage);
    }

    // Confidence Level
    if (filters.confidenceLevel) {
      apiFilters.confidenceLevel = filters.confidenceLevel;
      console.log(
        "Pipeline: Adding confidenceLevel filter:",
        filters.confidenceLevel
      );
    }

    // Contact fields
    if (filters.contactName) {
      apiFilters.contactName = filters.contactName;
      console.log("Pipeline: Adding contactName filter:", filters.contactName);
    }

    if (filters.contactEmail) {
      apiFilters.contactEmail = filters.contactEmail;
      console.log(
        "Pipeline: Adding contactEmail filter:",
        filters.contactEmail
      );
    }

    if (filters.contactPhone) {
      apiFilters.contactPhone = filters.contactPhone;
      console.log(
        "Pipeline: Adding contactPhone filter:",
        filters.contactPhone
      );
    }

    // Geographic fields
    if (filters.country) {
      apiFilters.country = filters.country;
      console.log("Pipeline: Adding country filter:", filters.country);
    }

    if (filters.state) {
      apiFilters.state = filters.state;
      console.log("Pipeline: Adding state filter:", filters.state);
    }

    if (filters.city) {
      apiFilters.city = filters.city;
      console.log("Pipeline: Adding city filter:", filters.city);
    }

    if (filters.postalCode) {
      apiFilters.postalCode = filters.postalCode;
      console.log("Pipeline: Adding postalCode filter:", filters.postalCode);
    }

    // Date fields
    if (filters.createdDateFrom) {
      apiFilters.createdDateFrom = filters.createdDateFrom;
      console.log(
        "Pipeline: Adding createdDateFrom filter:",
        filters.createdDateFrom
      );
    }

    if (filters.createdDateTo) {
      apiFilters.createdDateTo = filters.createdDateTo;
      console.log(
        "Pipeline: Adding createdDateTo filter:",
        filters.createdDateTo
      );
    }

    if (filters.closeDateFrom) {
      apiFilters.closeDateFrom = filters.closeDateFrom;
      console.log(
        "Pipeline: Adding closeDateFrom filter:",
        filters.closeDateFrom
      );
    }

    if (filters.closeDateTo) {
      apiFilters.closeDateTo = filters.closeDateTo;
      console.log("Pipeline: Adding closeDateTo filter:", filters.closeDateTo);
    }

    // Amount fields
    if (filters.amountFrom) {
      apiFilters.amountFrom = filters.amountFrom;
      console.log("Pipeline: Adding amountFrom filter:", filters.amountFrom);
    }

    if (filters.amountTo) {
      apiFilters.amountTo = filters.amountTo;
      console.log("Pipeline: Adding amountTo filter:", filters.amountTo);
    }

    return apiFilters;
  }

  // Handle filter change - memoized to prevent re-renders
  const handleFilterChange = useCallback((filterType, value) => {
    console.log("Filter changed:", filterType, value);
    console.log(
      "Filter type:",
      typeof value,
      "Is array:",
      Array.isArray(value)
    );

    // Create new filters by merging current filters with the new filter value
    const newFilters = {
      ...filters,
      [filterType]: value,
    };

    // Update local filters state - this will trigger the consolidated useEffect
    setFilters(newFilters);

    // Update URL to preserve filters (including Advanced Search filters)
    const urlParams = new URLSearchParams(window.location.search);

    // Handle different value types for URL storage
    if (value && value.toString().trim() !== "") {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          // For arrays, join with commas
          urlParams.set(filterType, value.join(","));
        } else {
          // Remove empty arrays
          urlParams.delete(filterType);
        }
      } else {
        // For single values, store as is
        urlParams.set(filterType, value.toString());
      }
    } else {
      // Remove empty values
      urlParams.delete(filterType);
    }

    // Update URL without triggering a page reload
    // Use location.pathname from React Router instead of window.location.pathname
    // to avoid issues with the base path /ui60/
    const newUrl = urlParams.toString()
      ? `${location.pathname}?${urlParams.toString()}`
      : location.pathname;
    window.history.replaceState({}, "", newUrl);

    console.log("Pipeline: Updated URL with new filters:", newUrl);
    console.log("Pipeline: Updated filters state:", newFilters);

    // Note: API call will be triggered by the consolidated useEffect when filters state changes
  }, []); // No dependencies needed as this function only updates state

  // Handle add opportunity
  const handleAddOpportunity = () => {
    console.log("Add Opportunity clicked - navigating to new opportunity form");
    navigate("/add-opportunity");
  };

  // Simplified pagination handlers that directly call the hook functions
  const handleNextPage = () => {
    console.log("Next page clicked, current page:", currentPage);
    goToNextPage();
  };

  const handlePreviousPage = () => {
    console.log("Previous page clicked, current page:", currentPage);
    goToPreviousPage();
  };

  // IMPORTANT: All hooks must be called before any early returns to avoid hooks order violations
  const handleViewSelected = useCallback(
    (view) => {
      console.log(
        "Pipeline: Handling view selection:",
        view?.NameOfView || "null"
      );

      // Debug: Log the complete view object to understand its structure
      console.log(
        "Pipeline: Complete view object:",
        JSON.stringify(view, null, 2)
      );

      // Update the selected view state
      setSelectedView(view);

      // Try to find search criteria for this view and trigger immediate refresh
      if (view) {
        let searchCriteriaFound = false;
        let finalFilters = {};

        // Method 1: Check if the view has SearchCriteriaJSON directly
        if (view.SearchCriteriaJSON && view.SearchCriteriaJSON.trim() !== "") {
          try {
            const searchCriteria = JSON.parse(view.SearchCriteriaJSON);
            console.log(
              "Pipeline: Found search criteria on view object:",
              searchCriteria
            );

            finalFilters = { ...filters, ...searchCriteria };
            searchCriteriaFound = true;
          } catch (error) {
            console.error(
              "Pipeline: Failed to parse view SearchCriteriaJSON:",
              error
            );
          }
        }

        // Method 2: Check if the view name matches a saved search
        if (!searchCriteriaFound && savedSearches) {
          let matchingSavedSearch = null;

          // Search in allOpportunities saved searches
          if (savedSearches.allOpportunities) {
            matchingSavedSearch = savedSearches.allOpportunities.find(
              (search) => search.Name === view.NameOfView
            );
          }

          // Search in myOpportunities saved searches if not found
          if (!matchingSavedSearch && savedSearches.myOpportunities) {
            matchingSavedSearch = savedSearches.myOpportunities.find(
              (search) => search.Name === view.NameOfView
            );
          }

          if (matchingSavedSearch && matchingSavedSearch.SearchCriteriaJSON) {
            try {
              const searchCriteria = JSON.parse(
                matchingSavedSearch.SearchCriteriaJSON
              );
              console.log(
                "Pipeline: Found matching saved search criteria:",
                searchCriteria
              );

              finalFilters = { ...filters, ...searchCriteria };
              searchCriteriaFound = true;
            } catch (error) {
              console.error(
                "Pipeline: Failed to parse saved search criteria:",
                error
              );
            }
          }
        }

        // Method 3: If view name matches a Quick Status option, set that filter
        if (!searchCriteriaFound) {
          console.log(
            "Pipeline: No search criteria found, setting view name as quickStatus filter"
          );
          finalFilters = { ...filters, quickStatus: view.NameOfView };
          searchCriteriaFound = true;
        }

        // Update filters state
        if (searchCriteriaFound) {
          setFilters(finalFilters);
          console.log("Pipeline: Updated filters state:", finalFilters);

          // Immediately trigger data refresh with the new filters and view
          console.log(
            "Pipeline: Triggering immediate data refresh for view selection"
          );
          setTimeout(() => {
            // Process the filters using the same logic as refresh button
            const processedFilters =
              processOpportunitySearchParams(finalFilters);
            console.log(
              "Pipeline: Processed filters for immediate refresh:",
              processedFilters
            );

            // Build API filters
            const apiFilters = buildApiFiltersFromUIFilters(
              processedFilters,
              savedSearches,
              users
            );

            // Add view-specific parameters
            const viewApiFilters = {
              viewId: view.ID,
              visibleColumns: view.VisibleColumns,
              ...apiFilters,
            };

            console.log(
              "Pipeline: Making immediate API call with filters:",
              viewApiFilters
            );
            refetchData(viewApiFilters);
          }, 50); // Small delay to ensure state updates are complete
        } else {
          console.log(
            "Pipeline: View has no associated search criteria, keeping current filters"
          );
        }
      } else {
        console.log(
          "Pipeline: View cleared, resetting to default filters and refreshing"
        );
        // If view is cleared, reset to default filters and refresh
        const defaultFilters = {
          quickStatus: "All Opportunities",
          probability: [],
          assignedRep: [],
        };
        setFilters(defaultFilters);

        // Trigger immediate refresh with default filters
        setTimeout(() => {
          refetchData({ quickStatus: "" }); // Empty quickStatus means "All Opportunities"
        }, 50);
      }

      console.log("Pipeline: View selection processing complete");
    },
    [savedSearches, filters, users, refetchData]
  ); // Include all dependencies

  // Build common props object to pass to all views - memoized to prevent re-renders
  const commonProps = useMemo(
    () => ({
      opportunities: opportunities.map((o) => ({
        ...o,
        _leadSourceOptions: leadSourcesMaster,
        _leadTypeOptions: leadTypesMaster,
      })),
      view,
      onViewChange: handleViewChange,
      filters,
      onFilterChange: handleFilterChange,
      users,
      onRefresh: () => {
        console.log(
          "Pipeline: Refresh triggered - will use current filters with Advanced Search processing"
        );

        // Process filters using the same logic as Advanced Search
        const processedFilters = processOpportunitySearchParams(filters);
        console.log("Refresh: Processed filters:", processedFilters);

        // Build API filters and make the call directly (same as Advanced Search)
        const apiFilters = buildApiFiltersFromUIFilters(
          processedFilters,
          savedSearches,
          users
        );
        console.log(
          "Refresh: Making API call with processed filters:",
          apiFilters
        );

        // Make the API call directly to ensure it uses the same function as Advanced Search
        // This ensures the same API function is called as when clicking "Search Opportunities" in Advanced Search
        refetchData(apiFilters);
      },
      totalCount,
      currentPage,
      onNextPage: handleNextPage,
      onPreviousPage: handlePreviousPage,
      savedSearches, // Ensure savedSearches is included in commonProps
      stages, // Add stages to commonProps so all views receive stage data
      prospectingStages, // Add prospecting stages for dropdown binding
      onAddOpportunity: handleAddOpportunity, // Add the add opportunity handler
      onViewSelected: handleViewSelected, // Add the view selection handler
      apiColumnConfig, // Pass the opportunityResult which contains ColumnConfig
    }),
    [
      opportunities,
      view,
      handleViewChange,
      filters,
      handleFilterChange,
      users,
      savedSearches,
      totalCount,
      currentPage,
      stages,
      handleViewSelected,
      apiColumnConfig,
      refetchData,
      leadSourcesMaster,
      leadTypesMaster,
      prospectingStages,
    ]
  );

  // Show loading during initial settings check - moved after all hooks to avoid hooks order violation
  if (isInitialLoad || stagesLoading) {
    return (
      <div className="flex-1 flex flex-col bg-white w-full overflow-x-hidden">
        <div className="flex justify-center items-center h-64">
          <Loader text="Loading..." />
        </div>
      </div>
    );
  }

  const renderView = () => {
    console.log("Pipeline: Rendering view:", view);
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader text="Loading opportunities..." />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex justify-center items-center h-64 text-red-500">
          Error loading data:{" "}
          {error.message || error.toString() || "Unknown error occurred"}
        </div>
      );
    }

    switch (view) {
      case "kanban":
        return <KanbanView {...commonProps} />;
      case "cards":
        return <OpportunityCardView {...commonProps} />;
      case "split":
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
      <div className="w-full px-2 py-2 flex-1 overflow-auto mx-0">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-[#1a4d80]"></h1>
        </div>

        {view !== "kanban" && view !== "split" && (
          <OpportunityStatsCards stats={stats} />
        )}

        {/* Only render real API data; show loader or empty when appropriate */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No opportunities to display
          </div>
        ) : (
          renderView()
        )}
      </div>
    </div>
  );
};

export default Pipeline;
