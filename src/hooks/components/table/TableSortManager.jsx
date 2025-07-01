
import { useState, useMemo } from 'react';

// Extracted sorting logic for clarity
export const useTableSort = (opportunities) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  // Handle sorting with key and direction parameters
  const requestSort = (key, direction = null) => {
    console.log('TableSortManager: requestSort called with key:', key, 'direction:', direction);
    
    if (key === null) {
      console.log('TableSortManager: Clearing sort');
      setSortConfig({ key: null, direction: 'ascending' });
      return;
    }
    
    let newDirection = direction;
    if (!direction) {
      // Only use toggle logic when no explicit direction is provided
      newDirection = 'ascending';
      if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        newDirection = 'descending';
      }
    }
    
    console.log('TableSortManager: Setting sort config -', { key, direction: newDirection });
    setSortConfig({ key, direction: newDirection });
  };

  // Use useMemo to prevent unnecessary re-sorting and array recreation
  const sortedOpportunities = useMemo(() => {
    if (sortConfig.key === null) {
      console.log('TableSortManager: No sorting applied, returning original array');
      return opportunities;
    }

    console.log('TableSortManager: Sorting opportunities by', sortConfig.key, sortConfig.direction);
    
    return [...opportunities].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested proposal data
      if (sortConfig.key === 'proposalName') {
        aValue = a.Proposal?.Name || a.name || '';
        bValue = b.Proposal?.Name || b.name || '';
      } else if (sortConfig.key === 'companyName') {
        aValue = a.ContactDetails?.Name || a.company || '';
        bValue = b.ContactDetails?.Name || b.company || '';
      } else if (sortConfig.key === 'amount') {
        aValue = parseFloat(a.Proposal?.Amount || a.amount || 0);
        bValue = parseFloat(b.Proposal?.Amount || b.amount || 0);
      } else if (sortConfig.key === 'status') {
        aValue = (a.Proposal?.Status || a.status || '').toLowerCase();
        bValue = (b.Proposal?.Status || b.status || '').toLowerCase();
      } else if (sortConfig.key === 'stage') {
        aValue = (a.Proposal?.InternalApproval?.StageName || a.stage || '').toLowerCase();
        bValue = (b.Proposal?.InternalApproval?.StageName || b.stage || '').toLowerCase();
      } else if (sortConfig.key === 'assignedRep') {
        aValue = (a.Proposal?.SalesRep?.Name || a.assignedRep || '').toLowerCase();
        bValue = (b.Proposal?.SalesRep?.Name || b.assignedRep || '').toLowerCase();
      } else if (sortConfig.key === 'createdDate' || sortConfig.key === 'projCloseDate' || sortConfig.key === 'actualCloseDate') {
        // Handle both API date format and display format
        const parseDate = (dateStr) => {
          if (!dateStr || dateStr === '0001-01-01T00:00:00') return new Date(0);
          if (dateStr.includes('/')) {
            // MM/DD/YYYY format
            const parts = dateStr.split('/');
            return new Date(parts[2], parts[0] - 1, parts[1]);
          }
          return new Date(dateStr);
        };
        aValue = parseDate(aValue);
        bValue = parseDate(bValue);
      } else {
        // Handle special cases
        if (sortConfig.key === 'status' || sortConfig.key === 'stage') {
          aValue = (aValue || '').toLowerCase();
          bValue = (bValue || '').toLowerCase();
        } else if (sortConfig.key === 'assignedRep' || sortConfig.key === 'createdBy') {
          aValue = (aValue || '').toLowerCase();
          bValue = (bValue || '').toLowerCase();
        }
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [opportunities, sortConfig.key, sortConfig.direction]);

  console.log('TableSortManager: Current sortConfig:', sortConfig);
  console.log('TableSortManager: Sorted opportunities count:', sortedOpportunities.length);

  return {
    sortConfig,
    sortedOpportunities,
    requestSort
  };
};
