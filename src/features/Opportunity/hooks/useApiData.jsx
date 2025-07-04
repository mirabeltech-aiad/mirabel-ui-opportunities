
import { useState, useEffect, useCallback } from 'react';
import { opportunitiesService } from '../Services/opportunitiesService';
import { userService } from '../Services/userService';

export const useApiData = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [savedSearches, setSavedSearches] = useState({ allOpportunities: [], myOpportunities: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async (filters = {}, page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching data with filters:', filters, 'and page:', page);
      
      const filtersWithPage = {
        ...filters,
        CurPage: page
      };
      
      const [opportunitiesDataArray, usersData, savedSearchesData] = await Promise.all([
        opportunitiesService.getFormattedOpportunities(filtersWithPage),
        userService.getUsersForDropdown(),
        userService.getSavedSearches()
      ]);

      const {opportunitiesData, totalCount} = opportunitiesDataArray;
      
      console.log('Fetched opportunities data:', opportunitiesData, " Total Count", totalCount);
      console.log('Fetched users data:', usersData);
      console.log('Fetched saved searches data:', savedSearchesData);
      
      setOpportunities(opportunitiesData || []);
      setTotalCount(totalCount);
      setUsers(usersData || []);
      setSavedSearches(savedSearchesData || { allOpportunities: [], myOpportunities: [] });
      setCurrentPage(page);
      setCurrentFilters(filters);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err.message);
      // Set empty arrays on error to avoid infinite loading
      setOpportunities([]);
      setTotalCount(0);
      setUsers([]);
      setSavedSearches({ allOpportunities: [], myOpportunities: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToNextPage = useCallback(() => {
    const nextPage = currentPage + 1;
    console.log('Going to next page:', nextPage, 'with filters:', currentFilters);
    fetchData(currentFilters, nextPage);
  }, [currentPage, currentFilters, fetchData]);

  const goToPreviousPage = useCallback(() => {
    const prevPage = Math.max(1, currentPage - 1);
    console.log('Going to previous page:', prevPage, 'with filters:', currentFilters);
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
    refetchData: fetchData,
    goToNextPage,
    goToPreviousPage
  };
};
