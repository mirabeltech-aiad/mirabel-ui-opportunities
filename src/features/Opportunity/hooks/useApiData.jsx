import { useState, useEffect, useCallback } from "react";
import { opportunitiesService } from "../Services/opportunitiesService";
import { userService } from "../Services/userService";
import apiService from "@/features/Opportunity/Services/apiService";

export const useApiData = (preFetchedResults = null) => {
  const [opportunities, setOpportunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [savedSearches, setSavedSearches] = useState({
    allOpportunities: [],
    myOpportunities: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [opportunityResult, setOpportunityResult] = useState({});
  const [apiColumnConfig, setApiColumnConfig] = useState([]);

  const fetchData = useCallback(async (filters = {}, page = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const filtersWithPage = {
        ...filters,
        CurPage: page,
      };

      const [opportunitiesDataArray, usersData, savedSearchesData] =
        await Promise.all([
          opportunitiesService.getFormattedOpportunities(filtersWithPage),
          userService.getUsersForDropdown(),
          userService.getSavedSearches(),
        ]);

      const {
        opportunitiesData,
        totalCount,
        opportunityResult: apiOpportunityResult,
        apiColumnConfig: defaultApiColumnConfig,
      } = opportunitiesDataArray;

      setOpportunities(opportunitiesData || []);
      setTotalCount(totalCount);
      setOpportunityResult(apiOpportunityResult || {});
      // If a viewId is provided, fetch the column config for that view; otherwise use default
      const selectedViewId = filters?.viewId ?? -1;
      if (selectedViewId && selectedViewId !== -1) {
        try {
          const endpoint = `/services/AdvSearches/ResultViewColumn/1/1/${selectedViewId}`;
          const columnConfigResponse = await apiService.get(endpoint);
          const columnData = columnConfigResponse?.content || [];
          const mappedColumns = Array.isArray(columnData)
            ? columnData.map((item) => ({
                id: item.PropertyMappingName
                  ? item.PropertyMappingName.toLowerCase()
                  : item.DBName?.toLowerCase(),
                label:
                  item.DisplayName || item.PropertyMappingName || item.DBName,
                dbName: item.DBName,
                propertyMappingName: item.PropertyMappingName,
                isDefault: item.IsDefault,
                isRequired: item.IsRequired,
                groupBy: item.GroupBy,
              }))
            : [];
          setApiColumnConfig(mappedColumns);
        } catch (e) {
          setApiColumnConfig(defaultApiColumnConfig || []);
        }
      } else {
        setApiColumnConfig(defaultApiColumnConfig || []);
      }
      setUsers(usersData || []);
      setSavedSearches(
        savedSearchesData || { allOpportunities: [], myOpportunities: [] }
      );
      setCurrentPage(page);
      setCurrentFilters(filters);
    } catch (err) {
      setError(err.message);
      // Set empty arrays on error to avoid infinite loading
      setOpportunities([]);
      setTotalCount(0);
      setOpportunityResult({});
      setApiColumnConfig([]);
      setUsers([]);
      setSavedSearches({ allOpportunities: [], myOpportunities: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle pre-fetched results from Advanced Search
  useEffect(() => {
    if (preFetchedResults && preFetchedResults.success) {
      console.log(
        "useApiData: Processing pre-fetched results:",
        preFetchedResults
      );

      // Format the opportunities data for table display
      const formatOpportunities = async () => {
        try {
          const { opportunitiesService } = await import(
            "../Services/opportunitiesService"
          );

          if (Array.isArray(preFetchedResults.results)) {
            console.log(
              "useApiData: Formatting opportunities for table display"
            );
            const formattedOpportunities = preFetchedResults.results.map(
              (opportunity) =>
                opportunitiesService.formatOpportunityForTable(opportunity)
            );
            console.log(
              "useApiData: Formatted opportunities:",
              formattedOpportunities
            );

            setOpportunities(formattedOpportunities);
            setTotalCount(preFetchedResults.totalCount || 0);
            setCurrentPage(preFetchedResults.pageInfo?.currentPage || 1);

            // Set opportunityResult if available in pre-fetched results
            if (preFetchedResults.opportunityResult) {
              setOpportunityResult(preFetchedResults.opportunityResult);
            }

            // Set apiColumnConfig if available in pre-fetched results
            if (preFetchedResults.apiColumnConfig) {
              setApiColumnConfig(preFetchedResults.apiColumnConfig);
            } else {
              // If no column config in pre-fetched results, fetch it separately
              try {
                const { opportunitiesService } = await import(
                  "../Services/opportunitiesService"
                );
                const columnConfigResponse =
                  await opportunitiesService.getOpportunityColumnConfig();
                if (columnConfigResponse?.content) {
                  const columnData = columnConfigResponse.content;
                  const mappedColumns = Array.isArray(columnData)
                    ? columnData.map((item) => ({
                        id: item.PropertyMappingName
                          ? item.PropertyMappingName.toLowerCase()
                          : item.DBName?.toLowerCase(),
                        label:
                          item.DisplayName ||
                          item.PropertyMappingName ||
                          item.DBName,
                        dbName: item.DBName,
                        propertyMappingName: item.PropertyMappingName,
                        isDefault: item.IsDefault,
                        isRequired: item.IsRequired,
                        groupBy: item.GroupBy,
                      }))
                    : [];
                  setApiColumnConfig(mappedColumns);
                }
              } catch (error) {
                console.error(
                  "useApiData: Error fetching column config:",
                  error
                );
                setApiColumnConfig([]);
              }
            }
          } else {
            console.warn(
              "useApiData: Pre-fetched results is not an array:",
              preFetchedResults.results
            );
            setOpportunities([]);
            setTotalCount(0);
          }
        } catch (error) {
          console.error("useApiData: Error formatting opportunities:", error);
          setOpportunities([]);
          setTotalCount(0);
        }
      };

      formatOpportunities();

      // Still need to fetch users and saved searches
      const fetchSupplementaryData = async () => {
        try {
          const [usersData, savedSearchesData] = await Promise.all([
            userService.getUsersForDropdown(),
            userService.getSavedSearches(),
          ]);

          setUsers(usersData || []);
          setSavedSearches(
            savedSearchesData || { allOpportunities: [], myOpportunities: [] }
          );
        } catch (err) {
          setError(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSupplementaryData();
    }
  }, [preFetchedResults]);

  // Remove automatic initial fetch - let the parent component control when to fetch data
  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  const goToNextPage = useCallback(() => {
    const nextPage = currentPage + 1;
    fetchData(currentFilters, nextPage);
  }, [currentPage, currentFilters, fetchData]);

  const goToPreviousPage = useCallback(() => {
    const prevPage = Math.max(1, currentPage - 1);
    fetchData(currentFilters, prevPage);
  }, [currentPage, currentFilters, fetchData]);

  return {
    opportunities,
    users,
    savedSearches,
    isLoading,
    error,
    currentPage,
    totalCount,
    opportunityResult,
    refetchData: fetchData,
    goToNextPage,
    goToPreviousPage,
    apiColumnConfig,
  };
};
