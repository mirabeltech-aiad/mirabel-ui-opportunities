import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilters, setActiveFilters] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on a page that should use the generic search context
  const shouldUseGenericSearch =
    !location.pathname.includes("/opportunities") &&
    !location.pathname.includes("/proposals") &&
    !location.pathname.includes("/advanced-search");

  // Initialize filters from URL on mount
  useEffect(() => {
    // Only process generic search parameters when not on specific search pages
    if (!shouldUseGenericSearch) {
      setActiveFilters({});
      return;
    }

    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      // Only process generic parameters that don't conflict with specific contexts
      if (
        value &&
        value.trim() !== "" &&
        !key.startsWith("proposal_") &&
        !key.startsWith("opportunity_")
      ) {
        urlFilters[key] = value;
      }
    }
    if (Object.keys(urlFilters).length > 0) {
      setActiveFilters(urlFilters);
    }
  }, [searchParams, shouldUseGenericSearch]);

  // Update URL when filters change
  const updateFilters = (newFilters, options = { updateUrl: true }) => {
    setActiveFilters(newFilters);

    if (options.updateUrl && shouldUseGenericSearch) {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value.toString().trim() !== "") {
          params.set(key, value);
        }
      });

      // Use location.pathname from React Router instead of window.location.pathname
      // to avoid issues with the base path /ui60/
      const currentPath = location.pathname;
      const newUrl = params.toString()
        ? `${currentPath}?${params.toString()}`
        : currentPath;
      navigate(newUrl, { replace: true });
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    if (shouldUseGenericSearch) {
      // Use location.pathname from React Router instead of window.location.pathname
      // to avoid issues with the base path /ui60/
      navigate(location.pathname, { replace: true });
    }
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
      (value) => value && value.toString().trim() !== ""
    ).length;
  };

  const value = {
    activeFilters,
    updateFilters,
    clearAllFilters,
    addFilter,
    removeFilter,
    getActiveFilterCount,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
