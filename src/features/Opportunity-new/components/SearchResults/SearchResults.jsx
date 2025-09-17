import React, { useState, useEffect } from 'react';
import StatisticsCards from './StatisticsCards';
import FilterBar from './FilterBar';
import DataTable from './DataTable';
import { useSearchResults } from '../../hooks/useSearchResults';

const SearchResults = ({ searchParams }) => {
  const { data, loading, error, refetch } = useSearchResults(searchParams);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: null,
    sortBy: 'relevance'
  });

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting data...');
  };

  if (loading) return <div className="loading">Loading search results...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="search-results">
      <StatisticsCards data={data?.statistics} />
      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
      />
      <DataTable 
        data={data?.results || []}
        filters={filters}
        loading={loading}
      />
    </div>
  );
};

export default SearchResults;