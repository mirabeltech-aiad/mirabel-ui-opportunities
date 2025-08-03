
import { useState, useMemo } from 'react';

export type SortDirection = 'ascending' | 'descending' | null;

export interface SortConfig {
  key: string | null;
  direction: SortDirection;
}

export const useTableSorting = <T extends Record<string, any>>(data: T[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null
  });

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Convert to strings for comparison if needed
      const aString = String(aValue);
      const bString = String(bValue);

      // Try to parse as numbers first
      const aNum = parseFloat(aString.replace(/[^0-9.-]/g, ''));
      const bNum = parseFloat(bString.replace(/[^0-9.-]/g, ''));

      let comparison = 0;
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        // Numeric comparison
        comparison = aNum - bNum;
      } else {
        // String comparison
        comparison = aString.localeCompare(bString);
      }

      return sortConfig.direction === 'ascending' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const requestSort = (key: string) => {
    let direction: SortDirection = 'ascending';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = null;
      }
    }
    
    setSortConfig({ key: direction ? key : null, direction });
  };

  return {
    sortedData,
    sortConfig,
    requestSort
  };
};
