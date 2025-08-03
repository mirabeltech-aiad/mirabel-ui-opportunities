
import { useState, useMemo } from "react";

export const useProposalsTableState = (proposals: any[]) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set<string>());
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentSort, setCurrentSort] = useState('');
  
  const sortedProposals = useMemo(() => {
    if (!currentSort) return proposals;

    const sorted = [...proposals].sort((a, b) => {
      switch (currentSort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-newest':
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        case 'date-oldest':
          return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
        case 'amount-high':
          return b.amount - a.amount;
        case 'amount-low':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [proposals, currentSort]);

  const handleSort = (sortOption: string) => {
    setCurrentSort(sortOption);
  };

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    // Convert column sort to dropdown sort format
    const sortMap = {
      'name': direction === 'ascending' ? 'name-asc' : 'name-desc',
      'createdDate': direction === 'ascending' ? 'date-oldest' : 'date-newest',
      'amount': direction === 'ascending' ? 'amount-low' : 'amount-high'
    };
    
    if (sortMap[key]) {
      setCurrentSort(sortMap[key]);
    }
  };

  return {
    selectedRows,
    setSelectedRows,
    selectAll,
    setSelectAll,
    sortConfig,
    setSortConfig,
    currentSort,
    setCurrentSort,
    sortedProposals,
    handleSort,
    requestSort
  };
};
