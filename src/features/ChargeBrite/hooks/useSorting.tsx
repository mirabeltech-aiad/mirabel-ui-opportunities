import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;
export type DataType = 'string' | 'number' | 'date' | 'currency' | 'percentage';

export interface SortConfig {
  key: string | null;
  direction: SortDirection;
  dataType?: DataType;
}

export interface UseSortingProps<T> {
  data: T[];
  initialSort?: {
    key: string;
    direction: SortDirection;
    dataType?: DataType;
  };
}

export const useSorting = <T extends Record<string, any>>({
  data,
  initialSort
}: UseSortingProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: initialSort?.key || null,
    direction: initialSort?.direction || null,
    dataType: initialSort?.dataType || 'string'
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
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

      let comparison = 0;

      switch (sortConfig.dataType) {
        case 'number':
        case 'currency':
        case 'percentage':
          const numA = typeof aValue === 'number' ? aValue : parseFloat(String(aValue).replace(/[^0-9.-]/g, ''));
          const numB = typeof bValue === 'number' ? bValue : parseFloat(String(bValue).replace(/[^0-9.-]/g, ''));
          comparison = numA - numB;
          break;
        
        case 'date':
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        
        case 'string':
        default:
          comparison = String(aValue).localeCompare(String(bValue));
          break;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const requestSort = (key: string, dataType: DataType = 'string') => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      } else {
        direction = 'asc';
      }
    }

    setSortConfig({
      key: direction ? key : null,
      direction,
      dataType
    });
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) return null;
    if (sortConfig.direction === 'asc') return '↑';
    if (sortConfig.direction === 'desc') return '↓';
    return null;
  };

  return {
    sortedData,
    sortConfig,
    requestSort,
    getSortIcon
  };
};