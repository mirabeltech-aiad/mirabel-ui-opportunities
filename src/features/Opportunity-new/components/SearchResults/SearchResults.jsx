import React, { useState, useEffect } from 'react';
import StatisticsCards from './StatisticsCards';
import FilterBar from './FilterBar';
import { EnhancedDataTable } from '../../../../components/ui/advanced-table';
import { useSearchResults } from '../../hooks/useSearchResults';
import { ExternalLink, MoreVertical, Edit } from 'lucide-react';

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const SearchResults = ({ searchParams, searchType = 'opportunities' }) => {
  const { data, loading, error, refetch } = useSearchResults(searchParams);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: null,
    sortBy: 'relevance'
  });

  const isOpportunities = searchType === 'opportunities';

  // Edit functionality
  const handleEditClick = (e, row) => {
    e.stopPropagation();
    const id = row.ID || row.id;
    if (id) {
      if (isOpportunities) {
        window.location.href = `/edit-opportunity/${id}`;
      } else {
        // For proposals, we navigate to edit opportunity with the opportunity ID
        window.location.href = `/edit-opportunity/${id}`;
      }
    }
  };

  // Check if edit should be shown
  const shouldShowEdit = (row) => {
    const id = row.ID || row.id;
    if (!id || id === 0 || id === '0') {
      return false;
    }

    // Don't show edit for certain statuses
    const status = (row.Status || '').toLowerCase();
    if (status.includes('closed') || status.includes('locked') || status.includes('archived')) {
      return false;
    }

    return true;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting data...');
  };

  // Define columns for EnhancedDataTable based on real API data structure
  const columns = [
    {
      id: 'edit',
      header: '',
      accessor: () => null,
      sortable: false,
      width: 50,
      render: (value, row) => (
        shouldShowEdit(row) ? (
          <button
            onClick={(e) => handleEditClick(e, row)}
            className="h-8 w-8 p-0 rounded hover:bg-gray-50 flex items-center justify-center"
            title={`Edit ${isOpportunities ? 'Opportunity' : 'Proposal'}`}
          >
            <Edit className="h-4 w-4 text-gray-600 hover:text-black" />
          </button>
        ) : (
          <div className="h-8 w-8 flex items-center justify-center">
            {/* Empty space to maintain alignment */}
          </div>
        )
      )
    },
    {
      id: 'name',
      header: searchType === 'opportunities' ? 'Opportunity Name' : 'Proposal Name',
      accessor: searchType === 'opportunities' ? 'Name' : 'ProposalName',
      sortable: true,
      width: 200,
      render: (value, row) => (
        <a href={`/${searchType}/${row.ID || row.id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center space-x-1">
          <span>{value || 'Untitled'}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      )
    },
    {
      id: 'company',
      header: 'Company Name',
      accessor: 'ContactDetails',
      sortable: true,
      width: 160,
      render: (value, row) => {
        const companyName = getNestedValue(row, 'ContactDetails.Name') || 'N/A';
        return <span className="font-medium">{companyName}</span>;
      }
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: 'Amount',
      sortable: true,
      type: 'currency',
      width: 120,
      render: (value) => {
        const amount = parseFloat(value || 0);
        return <span className="font-medium">${amount.toLocaleString()}</span>;
      }
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'Status',
      sortable: true,
      width: 100,
      render: (value, row) => {
        const getStatusColor = (status) => {
          const statusLower = (status || '').toLowerCase();
          if (statusLower.includes('open') || statusLower.includes('active')) {
            return 'bg-green-100 text-green-800';
          } else if (statusLower.includes('won')) {
            return 'bg-blue-100 text-blue-800';
          } else if (statusLower.includes('lost')) {
            return 'bg-red-100 text-red-800';
          }
          return 'bg-gray-100 text-gray-800';
        };

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
            {value || 'Unknown'}
          </span>
        );
      }
    },
    {
      id: 'stage',
      header: 'Stage',
      accessor: 'OppStageDetails',
      sortable: true,
      width: 140,
      render: (value, row) => {
        const stage = getNestedValue(row, 'OppStageDetails.Stage') || 'Unknown';
        const getStageColor = (stage) => {
          const stageColors = {
            'prospecting': 'bg-purple-500',
            'qualification': 'bg-blue-500',
            'proposal': 'bg-yellow-500',
            'negotiation': 'bg-orange-500',
            'closed won': 'bg-green-500',
            'closed': 'bg-green-500'
          };
          const stageLower = (stage || '').toLowerCase();
          return stageColors[stageLower] || 'bg-gray-500';
        };

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStageColor(stage)}`}>
            {stage}
          </span>
        );
      }
    },
    {
      id: 'assignedTo',
      header: 'Assigned To',
      accessor: 'AssignedTo',
      sortable: true,
      width: 140,
      render: (value) => <span className="text-sm">{value || 'Unassigned'}</span>
    },
    {
      id: 'createdDate',
      header: 'Created Date',
      accessor: 'CreatedDate',
      sortable: true,
      type: 'date',
      width: 120,
      render: (value) => {
        if (!value) return <span className="text-sm">N/A</span>;
        const date = new Date(value);
        return <span className="text-sm">{date.toLocaleDateString()}</span>;
      }
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
          window.location.href = `/${searchType}/${row.ID || row.id}`;
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