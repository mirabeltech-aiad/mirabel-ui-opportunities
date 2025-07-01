
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilters, setActiveFilters] = useState({});
  const navigate = useNavigate();

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      if (value && value.trim() !== '') {
        urlFilters[key] = value;
      }
    }
    if (Object.keys(urlFilters).length > 0) {
      setActiveFilters(urlFilters);
    }
  }, []);

  // Update URL when filters change
  const updateFilters = (newFilters, options = { updateUrl: true }) => {
    setActiveFilters(newFilters);
    
    if (options.updateUrl) {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value.toString().trim() !== '') {
          params.set(key, value);
        }
      });
      
      const currentPath = window.location.pathname;
      const newUrl = params.toString() ? `${currentPath}?${params.toString()}` : currentPath;
      navigate(newUrl, { replace: true });
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    navigate(window.location.pathname, { replace: true });
  };

  const addFilter = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    updateFilters(newFilters);
  };

  const removeFilter = (key) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    updateFilters(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(
      value => value && value.toString().trim() !== ''
    ).length;
  };

  const value = {
    activeFilters,
    updateFilters,
    clearAllFilters,
    addFilter,
    removeFilter,
    getActiveFilterCount
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
