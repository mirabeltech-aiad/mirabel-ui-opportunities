import React, { useState, useEffect } from 'react';
import CardViewNew from './CardViewNew';
import { EnhancedDataTable } from '../../../../components/ui/advanced-table';
import { EnhancedFilterBar } from '../../../../components/ui/EnhancedFilterBar';
import { useSearchResults } from '../../hooks/useSearchResults';
import { ExternalLink, MoreVertical, Edit } from 'lucide-react';
import { OpportunityStatsCards, ProposalStatsCards } from '../Stats';
import { logger } from '../../../../components/shared/logger';
import { useNavigate } from 'react-router-dom';
import { getDefaultColumnOrder } from '../../hooks/helperData';
import ViewsSidebar from '@/components/ui/views/ViewsSidebar';
import { NewLoader } from '@/components/ui/NewLoader';
import KanbanView from '../kanban/KanbanView';

const SearchResults = ({ searchParams, setShowResults, searchType = 'opportunities' }) => {
  const { data, loading, error, refetch } = useSearchResults(searchParams, searchType);
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState({
    all: searchType === 'opportunities' ? 'All Opportunities' : 'All Proposals',
    probability: 'All Probability',
    reps: 'All Reps'
  });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [isViewsSidebarOpen, setIsViewsSidebarOpen] = useState(false);

  const isOpportunities = searchType === 'opportunities';
  const title = isOpportunities ? 'Opportunities' : 'Proposals';

  // Filter definitions for EnhancedFilterBar
  const getFilterDefinitions = () => {
    if (searchType === 'proposals') {
      // For proposals, only show "All Proposal Reps" filter
      return [
        {
          id: 'proposalReps',
          placeholder: 'All Proposal Reps',
          options: [
            { value: 'all', label: 'All Proposal Reps' },
            // TODO: Add actual proposal reps from API
            { value: 'rep1', label: 'Rep 1' },
            { value: 'rep2', label: 'Rep 2' }
          ],
          value: 'all',
          onChange: (value) => {
            setFilters(prev => ({ ...prev, proposalReps: value === 'all' ? undefined : value }));
          }
        }
      ];
    } else {
      // For opportunities, show the original filters
      return [
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
    }
  };

  const filterDefinitions = getFilterDefinitions();

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

      const finalUrl = `/app/advanced-search-new`;
      logger.info(
        "Navigating to advanced search with opportunities tab:",
        finalUrl
      );
      logger.info("Quick Filter filters being passed:", filters);
      // window.open(finalUrl);
      setShowResults(false);
      // navigate(finalUrl);
    } catch (error) {
      logger.error("Navigation error:", error);
      // Fallback: just refresh the current data if navigation fails
      refetch?.();
    }
  };

  // Debug logging
  // useEffect(() => {
  //   logger.info('SearchResults: Component mounted with searchParams:', searchParams);
  //   logger.info('SearchResults: Data received:', data);
  //   logger.info('SearchResults: Loading state:', loading);
  //   logger.info('SearchResults: Error state:', error);
  // }, [searchParams, data, loading, error]);

  // Helper function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Generate columns from API ColumnConfig
  const generateColumnsFromConfig = (columnConfig) => {
    if (!columnConfig || !Array.isArray(columnConfig)) {
      logger.info('SearchResults: No column config found, using default columns');
      return getDefaultColumns();
    }

    logger.info('SearchResults: Generating columns from API config:', columnConfig);
    const columns = [];

    // Add edit column first
    columns.push({
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
    });

    // Generate columns from API config - process ALL columns (following old system pattern)
    logger.info('SearchResults: Processing ALL columns from API:', columnConfig.map(col => ({
      VisibleColumns: col.VisibleColumns,
      PropertyMappingName: col.PropertyMappingName,
      IsDefault: col.IsDefault
    })));

    // Debug: Check specifically for Product and Loss Reason columns
    const productColumn = columnConfig.find(col =>
      col.PropertyMappingName === 'ProductDetails.Name' ||
      col.VisibleColumns === 'Product'
    );
    const lossReasonColumn = columnConfig.find(col =>
      col.PropertyMappingName === 'OppLossReasonDetails.Name' ||
      col.VisibleColumns === 'Loss Reason'
    );

    logger.info('SearchResults: Product column found:', productColumn);
    logger.info('SearchResults: Loss Reason column found:', lossReasonColumn);

    columnConfig.forEach(col => {
      logger.info('SearchResults: Processing column config:', {
        VisibleColumns: col.VisibleColumns,
        PropertyMappingName: col.PropertyMappingName,
        DBColumnsNames: col.DBColumnsNames,
        IsDefault: col.IsDefault
      });

      const columnDef = createColumnFromConfig(col);
      if (columnDef) {
        logger.info('SearchResults: Created column definition:', {
          id: columnDef.id,
          header: columnDef.header,
          accessor: columnDef.accessor,
          columnType: columnDef.columnType || 'unknown'
        });
        columns.push(columnDef);
      } else {
        logger.error('SearchResults: Failed to create column for config:', {
          VisibleColumns: col.VisibleColumns,
          PropertyMappingName: col.PropertyMappingName,
          DBColumnsNames: col.DBColumnsNames,
          IsDefault: col.IsDefault
        });
      }
    });

    // Add actions column at the end
    columns.push({
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
    });

    logger.info('SearchResults: Final generated columns:', columns.map(col => ({
      id: col.id,
      header: col.header,
      accessor: col.accessor,
      columnType: col.columnType
    })));

    return columns;
  };

  // Create individual column from API config - following the old system's pattern
  const createColumnFromConfig = (config) => {
    // Use correct case for API fields (following old system pattern)
    const propertyMappingName = config.PropertyMappingName || config.propertyMappingName || config.propertyMapping || "";
    const visibleColumns = config.VisibleColumns || config.visibleColumns || config.label || config.displayName || "";
    const dbName = config.DBColumnsNames || config.dbName || config.DBName || "";

    // Helper function to get nested value using dot notation (same as old system)
    const getValueByPath = (obj, path) => {
      if (!path || typeof path !== "string") return null;
      if (path.includes(".")) {
        const parts = path.split(".");
        let current = obj;
        for (const part of parts) {
          if (current && typeof current === "object" && current[part] !== undefined) {
            current = current[part];
          } else {
            return null;
          }
        }
        // If the resolved value is an object with common display props, surface those
        if (current && typeof current === "object") {
          if (current.Name) return current.Name;
          if (current.Display) return current.Display;
          if (current.FullNameWithCompany) return current.FullNameWithCompany;
        }
        return current;
      }
      return obj[path] !== undefined ? obj[path] : null;
    };

    // Use the mapping path from API config to determine column type and rendering
    const mappingPath = propertyMappingName || dbName;
    const pathLc = String(mappingPath || "").toLowerCase();

    logger.info('SearchResults: Processing column mapping:', {
      visibleColumns,
      propertyMappingName,
      dbName,
      mappingPath,
      pathLc
    });

    // Helper function to get column width based on type
    const getColumnWidth = (type) => {
      const widths = {
        'status': 100,
        'assignedRep': 120,
        'stage': 140,
        'companyName': 160,
        'currency': 120,
        'percentage': 100,
        'date': 140,
        'contactName': 160,
        'opportunityName': 200,
        'product': 160,
        'lossReason': 120,
        'proposalId': 100,
        'text': 120
      };
      return widths[type] || 120;
    };

    // Determine column type based on mapping path (following old system logic)
    let columnType = 'text'; // default
    let renderId = mappingPath;

    // Use exact matching for the specific API column configurations first
    if (mappingPath === 'Status') {
      columnType = 'status';
      renderId = 'status';
    } else if (mappingPath === 'AssignedTo') {
      columnType = 'assignedRep';
      renderId = 'assignedRep';
    } else if (mappingPath === 'OppStageDetails.Stage') {
      columnType = 'stage';
      renderId = 'stage';
    } else if (mappingPath === 'ContactDetails.Name') {
      columnType = 'companyName';
      renderId = 'companyName';
    } else if (mappingPath === 'SubContactDetails.Name') {
      columnType = 'contactName';
      renderId = 'contactName';
    } else if (mappingPath === 'Amount') {
      columnType = 'currency';
      renderId = 'amount';
    } else if (mappingPath === 'Probability') {
      columnType = 'percentage';
      renderId = 'probability';
    } else if (mappingPath === 'CloseDate') {
      columnType = 'date';
      renderId = 'closeDate';
    } else if (mappingPath === 'Name') {
      columnType = 'opportunityName';
      renderId = 'opportunityName';
    } else if (mappingPath === 'ProductDetails.Name') {
      columnType = 'product';
      renderId = 'product';
      logger.info('SearchResults: FOUND Product column mapping!', { mappingPath, visibleColumns });
    } else if (mappingPath === 'OppLossReasonDetails.Name') {
      columnType = 'lossReason';
      renderId = 'lossReason';
      logger.info('SearchResults: FOUND Loss Reason column mapping!', { mappingPath, visibleColumns });
    } else if (mappingPath === 'ProposalID') {
      columnType = 'proposalId';
      renderId = 'proposalId';
    } else {
      // Fallback to regex patterns and intelligent detection for other cases
      if (/(^|\.)status$/.test(pathLc)) {
        columnType = 'status';
        renderId = 'status';
      } else if (/(^|\.)assignedto$/.test(pathLc)) {
        columnType = 'assignedRep';
        renderId = 'assignedRep';
      } else if (/oppstagedetails\.stage$/.test(pathLc) || /(^|\.)stage$/.test(pathLc)) {
        columnType = 'stage';
        renderId = 'stage';
      } else if (/(^|\.)customer(name)?$/.test(pathLc) || /contactdetails\.(fullnamewithcompany|name)$/.test(pathLc)) {
        columnType = 'companyName';
        renderId = 'companyName';
      } else if (/(^|\.)amount$/.test(pathLc)) {
        columnType = 'currency';
        renderId = 'amount';
      } else if (/(^|\.)probability$/.test(pathLc)) {
        columnType = 'percentage';
        renderId = 'probability';
      } else if (/(^|\.)closedate$/.test(pathLc)) {
        columnType = 'date';
        renderId = 'closeDate';
      } else if (/subcontactdetails\.name$/.test(pathLc)) {
        columnType = 'contactName';
        renderId = 'contactName';
      } else if (/(^|\.)name$/.test(pathLc)) {
        columnType = 'opportunityName';
        renderId = 'opportunityName';
      } else if (/productdetails\.name$/.test(pathLc)) {
        columnType = 'product';
        renderId = 'product';
      } else if (/opplossreasondetails\.name$/.test(pathLc)) {
        columnType = 'lossReason';
        renderId = 'lossReason';
      } else if (/(^|\.)proposalid$/.test(pathLc)) {
        columnType = 'proposalId';
        renderId = 'proposalId';
      } else {
        // For completely unknown columns, try to infer type from visible column name
        const visibleLc = String(visibleColumns || "").toLowerCase();
        if (visibleLc.includes('amount') || visibleLc.includes('total') || visibleLc.includes('revenue')) {
          columnType = 'currency';
          renderId = 'currency';
        } else if (visibleLc.includes('probability') || visibleLc.includes('%')) {
          columnType = 'percentage';
          renderId = 'percentage';
        } else if (visibleLc.includes('date')) {
          columnType = 'date';
          renderId = 'date';
        } else if (visibleLc.includes('status')) {
          columnType = 'status';
          renderId = 'status';
        } else {
          // Default to text for completely unknown columns
          columnType = 'text';
          renderId = mappingPath || 'unknown';
        }
      }
    }

    logger.info('SearchResults: Column type detection result:', {
      mappingPath,
      columnType,
      renderId,
      visibleColumns
    });

    // Create base column definition
    const baseColumn = {
      id: renderId || mappingPath || 'unknown',
      header: visibleColumns || propertyMappingName || dbName || 'Unknown',
      accessor: mappingPath,
      sortable: true,
      width: getColumnWidth(columnType),
      columnType: columnType, // Add for debugging
    };

    // Add type-specific rendering based on column type
    switch (columnType) {
      case 'opportunityName':
        return {
          ...baseColumn,
          render: (value, row) => {
            const displayName = getValueByPath(row, mappingPath) || row.Name || 'Untitled';
            return (
              <a href={`/${searchType}/${row.ID || row.id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center space-x-1">
                <span>{displayName}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            );
          }
        };

      case 'companyName':
        return {
          ...baseColumn,
          render: (value, row) => {
            const companyName = getValueByPath(row, mappingPath) ||
              getNestedValue(row, 'ContactDetails.Name') ||
              getNestedValue(row, 'ContactDetails.CompanyName') ||
              row.CompanyName || 'N/A';
            return <span className="font-medium">{companyName}</span>;
          }
        };

      case 'contactName':
        return {
          ...baseColumn,
          render: (value, row) => {
            const contactName = getValueByPath(row, mappingPath) ||
              getNestedValue(row, 'SubContactDetails.Name') ||
              getNestedValue(row, 'ContactDetails.ContactName') ||
              row.ContactName || 'N/A';
            return <span>{contactName}</span>;
          }
        };

      case 'assignedRep':
        return {
          ...baseColumn,
          render: (value, row) => {
            const assignedTo = getValueByPath(row, mappingPath) || row.AssignedTo;
            if (!assignedTo || assignedTo === 'Unassigned') {
              return <span className="text-sm text-gray-500">Unassigned</span>;
            }
            const initials = assignedTo.split(' ').map(n => n[0]).join('').substring(0, 2);
            const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
            const colorIndex = assignedTo.length % colors.length;
            return (
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white text-sm font-medium`}>
                  {initials}
                </div>
                <span className="text-sm">{assignedTo}</span>
              </div>
            );
          }
        };

      case 'stage':
        return {
          ...baseColumn,
          render: (value, row) => {
            const stage = getValueByPath(row, mappingPath) ||
              getNestedValue(row, 'OppStageDetails.Stage') ||
              row.Stage || 'Unknown';
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
        };

      case 'currency':
      case 'amount':
        return {
          ...baseColumn,
          type: 'currency',
          render: (value, row) => {
            const amount = parseFloat(getValueByPath(row, mappingPath) || row.Amount || 0);
            return <span className="font-medium">${amount.toLocaleString()}</span>;
          }
        };

      case 'status':
        return {
          ...baseColumn,
          render: (value, row) => {
            const status = getValueByPath(row, mappingPath) || row.Status || 'Unknown';

            const getStatusColor = (status) => {
              const statusLower = (status || '').toLowerCase();
              if (statusLower.includes('open') || statusLower.includes('active') || statusLower.includes('draft')) {
                return 'bg-green-100 text-green-800';
              } else if (statusLower.includes('won') || statusLower.includes('approved')) {
                return 'bg-blue-100 text-blue-800';
              } else if (statusLower.includes('lost') || statusLower.includes('rejected')) {
                return 'bg-red-100 text-red-800';
              } else if (statusLower.includes('sent') || statusLower.includes('pending')) {
                return 'bg-yellow-100 text-yellow-800';
              }
              return 'bg-gray-100 text-gray-800';
            };

            return (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
            );
          }
        };

      case 'percentage':
      case 'probability':
        return {
          ...baseColumn,
          type: 'percentage',
          render: (value, row) => {
            const probability = getValueByPath(row, mappingPath) || row.Probability || '0';
            return <span>{probability}%</span>;
          }
        };

      case 'date':
      case 'closeDate':
        return {
          ...baseColumn,
          type: 'date',
          render: (value, row) => {
            const dateValue = getValueByPath(row, mappingPath) || row.CloseDate;
            if (!dateValue) return <span className="text-sm">N/A</span>;
            const date = new Date(dateValue);
            return <span className="text-sm">{date.toLocaleDateString()}</span>;
          }
        };

      case 'product':
        return {
          ...baseColumn,
          render: (value, row) => {
            const productName = getValueByPath(row, mappingPath) ||
              getNestedValue(row, 'ProductDetails.Name') || 'N/A';
            return <span className="text-sm">{productName}</span>;
          }
        };

      case 'lossReason':
        return {
          ...baseColumn,
          render: (value, row) => {
            const lossReason = getValueByPath(row, mappingPath) ||
              getNestedValue(row, 'OppLossReasonDetails.Name') || '';
            return lossReason ? <span className="text-sm">{lossReason}</span> : <span className="text-sm text-gray-400">-</span>;
          }
        };

      case 'proposalId':
        return {
          ...baseColumn,
          render: (value, row) => {
            const proposalId = getValueByPath(row, mappingPath) || row.ProposalID || '';
            return proposalId && proposalId !== '0' ? <span className="font-medium">#{proposalId}</span> : <span className="text-sm text-gray-400">-</span>;
          }
        };

      default:
        // Generic text column for unmapped fields
        return {
          ...baseColumn,
          render: (value, row) => {
            const cellValue = getValueByPath(row, mappingPath) || value || '-';
            return <span className="text-sm">{cellValue}</span>;
          }
        };
    }
  };

  // Fallback to default columns if no API config
  const getDefaultColumns = () => {
    const baseColumns = [
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
        accessor: searchType === 'opportunities' ? 'Name' : 'Proposal',
        sortable: true,
        width: 200,
        render: (value, row) => {
          let displayName = '';
          if (searchType === 'proposals') {
            displayName = getNestedValue(row, 'Proposal.Name') || row.ProposalName || 'Untitled';
          } else {
            displayName = value || row.Name || 'Untitled';
          }
          return (
            <a href={`/${searchType}/${row.ID || row.id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center space-x-1">
              <span>{displayName}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          );
        }
      },
      {
        id: 'company',
        header: 'Company Name',
        accessor: 'ContactDetails',
        sortable: true,
        width: 160,
        render: (value, row) => {
          const companyName = getNestedValue(row, 'ContactDetails.Name') ||
            getNestedValue(row, 'ContactDetails.CompanyName') ||
            row.CompanyName || 'N/A';
          return <span className="font-medium">{companyName}</span>;
        }
      },
      {
        id: 'amount',
        header: searchType === 'proposals' ? 'Proposal Amount' : 'Amount',
        accessor: searchType === 'proposals' ? 'Proposal' : 'Amount',
        sortable: true,
        type: 'currency',
        width: 120,
        render: (value, row) => {
          let amount = 0;
          if (searchType === 'proposals') {
            amount = parseFloat(getNestedValue(row, 'Proposal.Amount') || row.ProposalTotal || 0);
          } else {
            amount = parseFloat(value || row.Amount || 0);
          }
          return <span className="font-medium">${amount.toLocaleString()}</span>;
        }
      },
      {
        id: 'status',
        header: searchType === 'proposals' ? 'Proposal Status' : 'Status',
        accessor: searchType === 'proposals' ? 'Proposal' : 'Status',
        sortable: true,
        width: 100,
        render: (value, row) => {
          let status = '';
          if (searchType === 'proposals') {
            status = getNestedValue(row, 'Proposal.Status') || row.ProposalStatus || 'Unknown';
          } else {
            status = value || row.Status || 'Unknown';
          }

          const getStatusColor = (status) => {
            const statusLower = (status || '').toLowerCase();
            if (statusLower.includes('open') || statusLower.includes('active') || statusLower.includes('draft')) {
              return 'bg-green-100 text-green-800';
            } else if (statusLower.includes('won') || statusLower.includes('approved')) {
              return 'bg-blue-100 text-blue-800';
            } else if (statusLower.includes('lost') || statusLower.includes('rejected')) {
              return 'bg-red-100 text-red-800';
            } else if (statusLower.includes('sent') || statusLower.includes('pending')) {
              return 'bg-yellow-100 text-yellow-800';
            }
            return 'bg-gray-100 text-gray-800';
          };

          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status}
            </span>
          );
        }
      }
    ];

    // Add opportunity-specific columns
    if (isOpportunities) {
      baseColumns.push(
        {
          id: 'stage',
          header: 'Stage',
          accessor: 'OppStageDetails',
          sortable: true,
          width: 140,
          render: (value, row) => {
            const stage = getNestedValue(row, 'OppStageDetails.Stage') || row.Stage || 'Unknown';
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
        }
      );
    } else {
      // Add proposal-specific columns
      baseColumns.push(
        {
          id: 'proposalId',
          header: 'Proposal ID',
          accessor: 'ProposalID',
          sortable: true,
          width: 100,
          render: (value, row) => {
            const proposalId = value || getNestedValue(row, 'Proposal.ID') || 'N/A';
            return <span className="font-medium">#{proposalId}</span>;
          }
        },
        {
          id: 'proposalRep',
          header: 'Proposal Rep',
          accessor: 'Proposal',
          sortable: true,
          width: 120,
          render: (value, row) => {
            const proposalRep = getNestedValue(row, 'Proposal.SalesRep.Name') || row.ProposalRep || 'Unassigned';
            if (!proposalRep || proposalRep === 'Unassigned') {
              return <span className="text-sm text-gray-500">Unassigned</span>;
            }
            const initials = proposalRep.split(' ').map(n => n[0]).join('').substring(0, 2);
            const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
            const colorIndex = proposalRep.length % colors.length;
            return (
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white text-sm font-medium`}>
                  {initials}
                </div>
                <span className="text-sm">{proposalRep}</span>
              </div>
            );
          }
        },
        {
          id: 'approvalStatus',
          header: 'Approval Status',
          accessor: 'Proposal',
          sortable: true,
          width: 140,
          render: (value, row) => {
            const approvalStatus = getNestedValue(row, 'Proposal.ApprovalStatus') || row.ApprovalStatus || 'N/A';

            const getApprovalColor = (status) => {
              const statusLower = (status || '').toLowerCase();
              if (statusLower.includes('approved')) {
                return 'bg-green-100 text-green-800';
              } else if (statusLower.includes('pending')) {
                return 'bg-yellow-100 text-yellow-800';
              } else if (statusLower.includes('rejected')) {
                return 'bg-red-100 text-red-800';
              } else if (statusLower.includes('blank')) {
                return 'bg-gray-100 text-gray-600';
              }
              return 'bg-gray-100 text-gray-800';
            };

            return (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalColor(approvalStatus)}`}>
                {approvalStatus}
              </span>
            );
          }
        },
        {
          id: 'proposalDate',
          header: 'Proposal Date',
          accessor: 'Proposal',
          sortable: true,
          type: 'date',
          width: 140,
          render: (value, row) => {
            const proposalDate = getNestedValue(row, 'Proposal.ProposalDate') || row.ProposalDate;
            if (!proposalDate) return <span className="text-sm">N/A</span>;
            const date = new Date(proposalDate);
            return <span className="text-sm">{date.toLocaleDateString()}</span>;
          }
        }
      );
    }

    // Add common columns
    baseColumns.push(
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
        id: 'contactName',
        header: 'Contact Name',
        accessor: 'ContactDetails',
        sortable: true,
        width: 160,
        render: (value, row) => {
          const contactName = getNestedValue(row, 'ContactDetails.ContactName') ||
            getNestedValue(row, 'ContactDetails.Name') ||
            row.ContactName || 'N/A';
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
    );

    return baseColumns;
  };

  // Define columns for EnhancedDataTable - fully API-driven
  const getColumns = () => {
    // Always try to use API column config first
    if (data?.apiColumnConfig && data.apiColumnConfig.length > 0) {
      logger.info('SearchResults: Using API column configuration');
      return generateColumnsFromConfig(data.apiColumnConfig);
    }

    // If no API config, return minimal columns to avoid conflicts
    logger.warn('SearchResults: No API column configuration available, using minimal columns');
    return [
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
        header: 'Name',
        accessor: 'Name',
        sortable: true,
        width: 200,
        render: (value, row) => {
          const displayName = value || row.Name || 'Untitled';
          return (
            <a href={`/${searchType}/${row.ID || row.id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center space-x-1">
              <span>{displayName}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          );
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
  };

  const columns = getColumns();

  // Prepare stats data from OpportunityResult array
  const opportunityResult = data?.opportunityResult || {};

  const opportunityStatsData = {
    totalCount: opportunityResult.TotIds || 0,
    totalAmount: `$${(opportunityResult.TotOppAmt || 0).toLocaleString()}`,
    totalWon: opportunityResult.Won || 0,
    totalWinAmount: `$${(opportunityResult.WinTotal || 0).toLocaleString()}`,
    totalOpen: opportunityResult.Open || 0,
    totalLost: opportunityResult.Lost || 0,
    winPercentage: `${opportunityResult.WinRatio || 0}%`
  };

  const proposalStatsData = {
    total: opportunityResult.Proposals || 0,
    amount: opportunityResult.ProposalsAmount || 0,
    activeProposals: opportunityResult.ActiveProposals || 0,
    activeProposalsAmount: opportunityResult.ActiveProposalsAmount || 0,
    sentProposals: opportunityResult.SentProposals || 0,
    sentProposalsAmount: opportunityResult.SentProposalsAmount || 0,
    approvedProposals: opportunityResult.ApprovedProposals || 0,
    approvedProposalsAmount: opportunityResult.ApprovedProposalsAmount || 0,
    conversionRate: opportunityResult.Proposals > 0 ?
      `${((opportunityResult.ConvertedToContracts / opportunityResult.Proposals) * 100 || 0).toFixed(1)}%` :
      '0%'
  };


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
              page={page}
              setPage={setPage}
              // Search
              searchQuery={''}
              searchPlaceholder={`Search ${title.toLowerCase()}...`}

              // Filters
              onFilterClick={handleFilterClick}
              filters={filterDefinitions}
              hasActiveFilters={Object.values(filters).some(value =>
                value && !value.toString().startsWith('All')
              )}

              // Actions
              onRefresh={refetch}
              onNextPage={refetch}
              // View controls
              activeView={viewMode}
              onViewChange={setViewMode}
              onViewsClick={() => setIsViewsSidebarOpen(true)}
              // Hide Kanban view for proposals
              hideViewIcons={searchType === 'proposals' ? ['kanban'] : []}
            />
          </div>
        </div>

        {/* Card View */}
        {loading && (
          <NewLoader />
        )}
        {!loading && viewMode === 'cards' && (
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

        {/* Kanban View - Only for opportunities */}
        {!loading && viewMode === 'kanban' && isOpportunities && (
          <div className="flex-1 min-h-0">
            <KanbanView
              opportunities={data?.results || []}
              view={viewMode}
              onViewChange={setViewMode}
              filters={filters}
              onFilterChange={setFilters}
              users={[]}
              onRefresh={refetch}
              totalCount={data?.totalCount || 0}
              currentPage={page}
              onNextPage={() => setPage(page + 1)}
              onPreviousPage={() => setPage(page - 1)}
              savedSearches={{
                allOpportunities: [],
                myOpportunities: [],
              }}
              onAddOpportunity={() => { }}
            />
          </div>
        )}

        {/* Table View */}
        {!loading && viewMode === 'table' && (
          <div className="flex-1 min-h-0">
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

      {/* Views Sidebar */}
      <ViewsSidebar
        isOpen={isViewsSidebarOpen}
        onClose={() => setIsViewsSidebarOpen(false)}
        columnOrder={getDefaultColumnOrder()}
        onColumnOrderChange={() => { }}
        onViewSelected={() => { }}
        pageType="opportunities"
      />
    </>
  );
};

export default SearchResults;