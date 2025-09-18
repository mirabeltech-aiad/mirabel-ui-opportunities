import React, { useState, useEffect } from 'react';
import {
  Plus,
  RotateCcw,
  Settings,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Grid3X3,
  List,
  BarChart3,
  ExternalLink,
  ChevronDown,
  Edit
} from 'lucide-react';
import { EnhancedDataTable } from '../../../../components/ui/advanced-table';
import { useSearchResults } from '../../hooks/useSearchResults';
import { logger } from '../../../../components/shared/logger';
import { OpportunityStatsCards, ProposalStatsCards } from '../Stats';

// Define stable default outside component to prevent re-renders
const DEFAULT_SEARCH_PARAMS = {};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const TestSearchResults = ({ searchType = 'opportunities', searchParams = DEFAULT_SEARCH_PARAMS }) => {
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState({
    all: searchType === 'opportunities' ? 'All Opportunities' : 'All Proposals',
    probability: 'All Probability',
    reps: 'All Reps'
  });

  const isOpportunities = searchType === 'opportunities';
  const title = isOpportunities ? 'Opportunities' : 'Proposals';

  // Use the real API service
  const { data, loading, error, refetch } = useSearchResults(searchParams);

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

  // Check if edit should be shown (similar to old implementation)
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

  useEffect(() => {
    logger.info('TestSearchResults: Component mounted with searchParams:', searchParams);
    logger.info('TestSearchResults: Data received:', data);
    logger.info('TestSearchResults: Loading state:', loading);
    logger.info('TestSearchResults: Error state:', error);
  }, [searchParams, data, loading, error]);

  // Use real statistics from API or fallback to sample data
  const apiStats = data?.statistics || {};
  const statistics = isOpportunities ? {
    totalCount: apiStats.totalOpportunities?.toString() || data?.totalCount?.toString() || '0',
    totalAmount: `$${(apiStats.totalValue || 0).toLocaleString()}`,
    totalWon: apiStats.closedWon?.toString() || '0',
    totalOpen: apiStats.openOpportunities?.toString() || '0',
    totalLost: apiStats.closedLost?.toString() || '0',
    totalWinAmount: `$${(apiStats.totalValue || 0).toLocaleString()}`,
    winPercentage: apiStats.totalOpportunities > 0 ? `${Math.round((apiStats.closedWon / apiStats.totalOpportunities) * 100)}%` : '0%'
  } : {
    totalCount: apiStats.totalOpportunities?.toString() || data?.totalCount?.toString() || '0',
    totalAmount: `$${(apiStats.totalValue || 0).toLocaleString()}`,
    totalActive: apiStats.openOpportunities?.toString() || '0',
    totalPending: '0',
    totalConverted: apiStats.closedWon?.toString() || '0',
    totalConvertedAmount: `$${(apiStats.totalValue || 0).toLocaleString()}`,
    conversionRate: apiStats.totalOpportunities > 0 ? `${Math.round((apiStats.closedWon / apiStats.totalOpportunities) * 100)}%` : '0%'
  };

  // Use real data from API
  const tableData = data?.results || [];

  // Debug logging
  useEffect(() => {
    logger.info('TestSearchResults: tableData:', tableData);
    logger.info('TestSearchResults: tableData length:', tableData.length);
    logger.info('TestSearchResults: loading state:', loading);
    logger.info('TestSearchResults: data object:', data);
  }, [tableData, loading, data]);

  // Prepare stats data for the stats cards components
  const opportunityStatsData = {
    totalCount: statistics.totalCount,
    totalAmount: statistics.totalAmount,
    totalWon: statistics.totalWon,
    totalWinAmount: statistics.totalWinAmount,
    totalOpen: statistics.totalOpen,
    totalLost: statistics.totalLost,
    winPercentage: statistics.winPercentage
  };

  const proposalStatsData = {
    total: statistics.totalCount,
    amount: typeof statistics.totalAmount === 'string' ? statistics.totalAmount.replace('$', '') : statistics.totalAmount,
    activeProposals: statistics.totalActive,
    activeProposalsAmount: typeof statistics.totalConvertedAmount === 'string' ? statistics.totalConvertedAmount.replace('$', '') : statistics.totalConvertedAmount,
    sentProposals: statistics.totalPending,
    sentProposalsAmount: typeof statistics.totalConvertedAmount === 'string' ? statistics.totalConvertedAmount.replace('$', '') : statistics.totalConvertedAmount,
    approvedProposals: statistics.totalConverted,
    approvedProposalsAmount: typeof statistics.totalConvertedAmount === 'string' ? statistics.totalConvertedAmount.replace('$', '') : statistics.totalConvertedAmount,
    conversionRate: statistics.conversionRate
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
      id: 'assignedTo',
      header: 'Assigned Rep',
      accessor: 'AssignedTo',
      sortable: true,
      width: 120,
      render: (value) => {
        const initials = (value || 'UN').split(' ').map(n => n[0]).join('').substring(0, 2);
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
        const colorIndex = (value || '').length % colors.length;
        return (
          <div className={`w-8 h-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white text-sm font-medium`}>
            {initials}
          </div>
        );
      }
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
      id: 'name',
      header: `${title.slice(0, -1)} Name`,
      accessor: 'Name',
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
      id: 'probability',
      header: 'Probability (%)',
      accessor: 'Probability',
      sortable: true,
      type: 'percentage',
      width: 140,
      render: (value) => <span>{value || '0'}%</span>
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

  return (
    <>
      <style>{`
        .table-scroll-container {
          height: 100%;
          overflow: auto !important;
          position: relative;
        }
        
        .table-scroll-container .enhanced-data-table {
          overflow: visible !important;
          height: auto !important;
        }
        
        .table-scroll-container .enhanced-data-table > div {
          overflow: visible !important;
        }
        
        .table-scroll-container .overflow-x-auto {
          overflow: visible !important;
        }
        
        .table-scroll-container table {
          width: 100% !important;
        }
        
        /* Ensure table header stays visible during scroll */
        .table-scroll-container thead {
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

      {/* Combined Filter and Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All {title}</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Probability</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Reps</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {data?.pageInfo ?
                `${((data.pageInfo.currentPage - 1) * data.pageInfo.pageSize) + 1}-${Math.min(data.pageInfo.currentPage * data.pageInfo.pageSize, data.totalCount)} of ${data.totalCount}` :
                `1-${tableData.length} of ${tableData.length}`
              }
            </span>
            <div className="flex items-center space-x-1">
              <button className="p-1 rounded hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center space-x-1 ml-4">
              <button className="p-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                <Plus className="h-4 w-4" />
              </button>

              <button className="p-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                <RotateCcw className="h-4 w-4" />
              </button>

              <button className="p-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                <Settings className="h-4 w-4" />
              </button>

              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 border-l border-gray-300 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-2 border-l border-gray-300 ${viewMode === 'kanban' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
              </div>

              <button className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Filter className="h-4 w-4" />
              </button>

              <button className="p-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable Table Area */}
      <div className="flex-1 min-h-0 bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Error: {error.message}</div>
          </div>
        ) : (
          <div className="table-scroll-container">
            <EnhancedDataTable
              data={tableData}
              columns={columns}
              loading={loading}
              enableSelection={true}
              enablePagination={false}
              initialPageSize={1000}
              rowDensity="compact"
              className="table-content"
              id="opportunities-table"
              bulkActionContext={isOpportunities ? 'products' : 'schedules'}
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
        )}
      </div>
      </div>
    </>
  );
};

export default TestSearchResults;