import React, { useState, useEffect } from 'react';
import StatisticsCards from './StatisticsCards';
import FilterBar from './FilterBar';
import { EnhancedDataTable } from '../../../../components/ui/advanced-table';
import { useSearchResults } from '../../hooks/useSearchResults';
import { ExternalLink, MoreVertical, Edit } from 'lucide-react';
import { OpportunityStatsCards, ProposalStatsCards } from '../Stats';

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

  // Prepare stats data for the stats cards components
  const statistics = data?.statistics || {};
  const opportunityStatsData = {
    totalCount: statistics.totalCount || 0,
    totalAmount: statistics.totalAmount || '$0',
    totalWon: statistics.totalWon || 0,
    totalWinAmount: statistics.totalWinAmount || '$0',
    totalOpen: statistics.totalOpen || 0,
    totalLost: statistics.totalLost || 0,
    winPercentage: statistics.winPercentage || '0%'
  };

  const proposalStatsData = {
    total: statistics.totalCount || 0,
    amount: typeof statistics.totalAmount === 'string' ? statistics.totalAmount.replace('$', '') : statistics.totalAmount || 0,
    activeProposals: statistics.totalActive || 0,
    activeProposalsAmount: typeof statistics.totalConvertedAmount === 'string' ? statistics.totalConvertedAmount.replace('$', '') : statistics.totalConvertedAmount || 0,
    sentProposals: statistics.totalPending || 0,
    sentProposalsAmount: typeof statistics.totalConvertedAmount === 'string' ? statistics.totalConvertedAmount.replace('$', '') : statistics.totalConvertedAmount || 0,
    approvedProposals: statistics.totalConverted || 0,
    approvedProposalsAmount: typeof statistics.totalConvertedAmount === 'string' ? statistics.totalConvertedAmount.replace('$', '') : statistics.totalConvertedAmount || 0,
    conversionRate: statistics.conversionRate || '0%'
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading search results...</div></div>;
  if (error) return <div className="flex items-center justify-center h-64"><div className="text-red-500">Error: {error.message}</div></div>;

  return (
    <>
      <style>{`
        .search-results-scroll-container {
          height: 100%;
          overflow: auto !important;
          position: relative;
        }
        
        .search-results-scroll-container .enhanced-data-table {
          overflow: visible !important;
          height: auto !important;
        }
        
        .search-results-scroll-container .enhanced-data-table > div {
          overflow: visible !important;
        }
        
        .search-results-scroll-container .overflow-x-auto {
          overflow: visible !important;
        }
        
        .search-results-scroll-container table {
          width: 100% !important;
        }
        
        /* Ensure table header stays visible during scroll */
        .search-results-scroll-container thead {
          position: sticky !important;
          top: 0 !important;
          z-index: 10 !important;
          background-color: rgb(243, 244, 246) !important;
        }
      `}</style>
      <div className="h-screen bg-gray-50 flex flex-col">
        {/* Statistics Cards */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          {isOpportunities ? (
            <OpportunityStatsCards stats={opportunityStatsData} />
          ) : (
            <ProposalStatsCards stats={proposalStatsData} />
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
          />
        </div>

        {/* Main Content - Scrollable Table Area */}
        <div className="flex-1 min-h-0 bg-white">
          <div className="search-results-scroll-container">
            <EnhancedDataTable
              data={data?.results || []}
              columns={columns}
              loading={loading}
              enableSelection={true}
              enablePagination={false}
              initialPageSize={1000}
              rowDensity="compact"
              className="table-content"
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
        </div>
      </div>
    </>
  );
};

export default SearchResults;