import React, { useState, useEffect } from 'react';
import StatisticsCards from './StatisticsCards';
import FilterBar from './FilterBar';
import { EnhancedDataTable } from '../../../../components/ui/advanced-table';
import { useSearchResults } from '../../hooks/useSearchResults';
import { ExternalLink, MoreVertical } from 'lucide-react';

const SearchResults = ({ searchParams, searchType = 'opportunities' }) => {
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

  // Define columns for EnhancedDataTable
  const columns = [
    {
      id: 'name',
      header: searchType === 'opportunities' ? 'Opportunity Name' : 'Proposal Name',
      accessor: 'name',
      sortable: true,
      width: 200,
      render: (value, row) => (
        <a href={`/${searchType}/${row.id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center space-x-1">
          <span>{value}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      )
    },
    {
      id: 'company',
      header: 'Company Name',
      accessor: 'company',
      sortable: true,
      width: 160,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: 'amount',
      sortable: true,
      type: 'currency',
      width: 120,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      width: 100,
      render: (value, row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.statusColor || 'bg-gray-100 text-gray-800'}`}>
          {value}
        </span>
      )
    },
    {
      id: 'stage',
      header: 'Stage',
      accessor: 'stage',
      sortable: true,
      width: 140,
      render: (value, row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${row.stageColor || 'bg-gray-500'}`}>
          {value}
        </span>
      )
    },
    {
      id: 'date',
      header: 'Date',
      accessor: 'date',
      sortable: true,
      type: 'date',
      width: 120,
      render: (value) => <span className="text-sm">{value}</span>
    },
    {
      id: 'actions',
      header: '',
      accessor: () => null,
      sortable: false,
      width: 50,
      render: () => (
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      )
    }
  ];

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
      <EnhancedDataTable
        data={data?.results || []}
        columns={columns}
        loading={loading}
        enableSelection={true}
        enablePagination={true}
        initialPageSize={25}
        rowDensity="compact"
        className="mt-4"
        id="search-results-table"
        bulkActionContext={searchType === 'opportunities' ? 'products' : 'schedules'}
        onRowClick={(row) => {
          console.log('Row clicked:', row);
        }}
        onRowDoubleClick={(row) => {
          window.location.href = `/${searchType}/${row.id}`;
        }}
        onRowSelect={(selectedRows) => {
          console.log('Selected rows:', selectedRows);
        }}
        onBulkAction={(action, rows) => {
          console.log('Bulk action:', action, rows);
        }}
        onSort={(sortConfig) => {
          console.log('Sort config:', sortConfig);
        }}
      />
    </div>
  );
};

export default SearchResults;