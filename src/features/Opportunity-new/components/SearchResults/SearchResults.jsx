import React, { useState, useEffect } from 'react';
import CardViewNew from './CardViewNew';
import { EnhancedDataTable } from '../../../../components/ui/advanced-table';
import { EnhancedFilterBar } from '../../../../components/ui/EnhancedFilterBar';
import { useSearchResults } from '../../hooks/useSearchResults';
import { ExternalLink, MoreVertical, Edit } from 'lucide-react';
import { OpportunityStatsCards, ProposalStatsCards } from '../Stats';
import { logger } from '../../../../components/shared/logger';
import { useNavigate } from 'react-router-dom';

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const SearchResults = ({ searchParams, searchType = 'opportunities' }) => {
  const { data, loading, error, refetch } = useSearchResults(searchParams);
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState({
    all: searchType === 'opportunities' ? 'All Opportunities' : 'All Proposals',
    probability: 'All Probability',
    reps: 'All Reps'
  });
  const navigate = useNavigate();

  const isOpportunities = searchType === 'opportunities';
  const title = isOpportunities ? 'Opportunities' : 'Proposals';

  // Filter definitions for EnhancedFilterBar
  const filterDefinitions = [
    {
      id: 'opportunities',
      placeholder: 'All Opportunities',
      options: [
        { value: 'all', label: 'All Opportunities' },
        { value: 'active', label: 'Active Opportunities' },
        { value: 'won', label: 'Won Opportunities' },
        { value: 'lost', label: 'Lost Opportunities' }
      ],
      value: 'all',
      onChange: (value) => {
        setFilters(prev => ({ ...prev, opportunities: value === 'all' ? undefined : value }));
      }
    },
    {
      id: 'probability',
      placeholder: 'All Probability',
      options: [
        { value: 'all', label: 'All Probability' },
        { value: 'high', label: 'High (80-100%)' },
        { value: 'medium', label: 'Medium (40-79%)' },
        { value: 'low', label: 'Low (0-39%)' }
      ],
      value: 'all',
      onChange: (value) => {
        setFilters(prev => ({ ...prev, probability: value === 'all' ? undefined : value }));
      }
    },
    {
      id: 'reps',
      placeholder: 'All Reps',
      options: [
        { value: 'all', label: 'All Reps' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'unassigned', label: 'Unassigned' }
      ],
      value: 'all',
      onChange: (value) => {
        setFilters(prev => ({ ...prev, reps: value === 'all' ? undefined : value }));
      }
    }
  ];

  // Edit functionality
  const handleEditClick = (e, row) => {
    e.stopPropagation();
    const id = row.ID || row.id;
    if (id) {
      if (isOpportunities) {
        window.location.href = `/edit-opportunity/${id}`;
      } else {
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

    const status = (row.Status || '').toLowerCase();
    if (status.includes('closed') || status.includes('locked') || status.includes('archived')) {
      return false;
    }

    return true;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleFilterClick = () => {
    logger.info("Filter button clicked, navigating to /advanced-search");
    try {
      // Navigate to advanced search with opportunities tab and preserve current filters
      const advancedSearchParams = new URLSearchParams();

      // Copy all current filters to preserve them, but exclude default "All Opportunities" status
      for (const [key, value] of Object.entries(filters)) {
        // Skip empty values, empty arrays, "All" selections, and default "All Opportunities" status
        if (
          value &&
          value.toString().trim() !== "" &&
          !(key === "status" && value === "All Opportunities")
        ) {
          // Handle array values properly for Advanced Search
          if (Array.isArray(value)) {
            if (value.length > 0) {
              // For multi-select fields, join with commas
              advancedSearchParams.set(key, value.join(","));
            }
            // Skip empty arrays (like when "All Reps" is selected)
          } else {
            // For single values, pass as is
            advancedSearchParams.set(key, value);
          }
        }
      }

      // Set the tab parameter to opportunities
      advancedSearchParams.set("tab", "opportunities");

      const finalUrl = `/advanced-search?${advancedSearchParams.toString()}`;
      logger.info(
        "Navigating to advanced search with opportunities tab:",
        finalUrl
      );
      logger.info("Quick Filter filters being passed:", filters);
      navigate(finalUrl);
    } catch (error) {
      logger.error("Navigation error:", error);
      // Fallback: just refresh the current data if navigation fails
      refetch?.();
    }
  };

  // Debug logging
  useEffect(() => {
    logger.info('SearchResults: Component mounted with searchParams:', searchParams);
    logger.info('SearchResults: Data received:', data);
    logger.info('SearchResults: Loading state:', loading);
    logger.info('SearchResults: Error state:', error);
  }, [searchParams, data, loading, error]);

  // Define columns for EnhancedDataTable
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
      render: (value) => {
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
      header: 'Assigned Rep',
      accessor: 'AssignedTo',
      sortable: true,
      width: 120,
      render: (value) => {
        if (!value || value === 'Unassigned') {
          return <span className="text-sm text-gray-500">Unassigned</span>;
        }
        const initials = value.split(' ').map(n => n[0]).join('').substring(0, 2);
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
        const colorIndex = value.length % colors.length;
        return (
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white text-sm font-medium`}>
              {initials}
            </div>
            <span className="text-sm">{value}</span>
          </div>
        );
      }
    },
    {
      id: 'probability',
      header: 'Probability (%)',
      accessor: 'Probability',
      sortable: true,
      type: 'percentage',
      width: 140,
      render: (value) => <span>{value || '0'}%</span>
    },
    {
      id: 'projCloseDate',
      header: 'Proj Close Date',
      accessor: 'CloseDate',
      sortable: true,
      type: 'date',
      width: 140,
      render: (value) => {
        if (!value) return <span className="text-sm">N/A</span>;
        const date = new Date(value);
        return <span className="text-sm">{date.toLocaleDateString()}</span>;
      }
    },
    {
      id: 'contactName',
      header: 'Contact Name',
      accessor: 'ContactDetails',
      sortable: true,
      width: 160,
      render: (value, row) => {
        const contactName = getNestedValue(row, 'ContactDetails.ContactName') || 'N/A';
        return <span>{contactName}</span>;
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

  // Prepare stats data
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
    amount: statistics.totalAmount || 0,
    activeProposals: statistics.totalActive || 0,
    activeProposalsAmount: statistics.totalConvertedAmount || 0,
    sentProposals: statistics.totalPending || 0,
    sentProposalsAmount: statistics.totalConvertedAmount || 0,
    approvedProposals: statistics.totalConverted || 0,
    approvedProposalsAmount: statistics.totalConvertedAmount || 0,
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

        {/* Enhanced Filter Bar */}
        <div className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="px-2">
            <EnhancedFilterBar
              // Data and pagination
              total={data?.totalCount || 0}

              // Search
              searchQuery={''}
              searchPlaceholder={`Search ${title.toLowerCase()}...`}

              // Filters
              onFilterClick={handleFilterClick}
              filters={filterDefinitions}
              onResetFilters={() => {
                setFilters({
                  all: searchType === 'opportunities' ? 'All Opportunities' : 'All Proposals',
                  probability: 'All Probability',
                  reps: 'All Reps'
                });
              }}
              hasActiveFilters={Object.values(filters).some(value =>
                value && !value.toString().startsWith('All')
              )}

              // Actions
              onRefresh={refetch}

              // View controls
              activeView={viewMode}
              onViewChange={setViewMode}
              onViewsClick={() => setViewMode('table')}
            />
          </div>
        </div>

        {/* Card View */}
        {viewMode === 'cards' && (
          <CardViewNew
            opportunities={data?.results || []}
            view={viewMode}
            onViewChange={setViewMode}
            filters={filters}
            onFilterChange={setFilters}
            users={[]}
            savedSearches={[]}
            sortConfig={[]}
            onSort={() => { }}
            onRefresh={refetch}
            currentPage={1}
            onNextPage={() => { }}
            onPreviousPage={() => { }}
            totalCount={data?.totalCount || 0}
            onCardClick={() => { }}
            onEditOpportunity={() => { }}
          />
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="flex-1 min-h-0 mt-6">
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
                  logger.info('Row clicked:', row);
                }}
                onRowDoubleClick={(row) => {
                  window.location.href = `/${searchType}/${row.ID || row.id}`;
                }}
                onRowSelect={(selectedRows) => {
                  logger.info('Selected rows:', selectedRows);
                }}
                onBulkAction={(action, rows) => {
                  logger.info('Bulk action:', action, rows);
                }}
                onSort={(sortConfig) => {
                  logger.info('Sort config:', sortConfig);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults;