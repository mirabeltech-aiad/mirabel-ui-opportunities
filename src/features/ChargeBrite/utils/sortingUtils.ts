import { DataType } from '@/hooks/useSorting';

/**
 * Utility function to extract numeric value from currency strings
 * @param value - Currency string like "$1,234.56" or number
 * @returns Numeric value
 */
export const parseCurrency = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  
  // Remove currency symbols, commas, and spaces
  const cleaned = value.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Utility function to extract numeric value from percentage strings
 * @param value - Percentage string like "15.5%" or number
 * @returns Numeric value
 */
export const parsePercentage = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  
  // Remove percentage symbol and spaces
  const cleaned = value.replace(/[%\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Utility function to parse date strings and return Date objects
 * @param value - Date string or Date object
 * @returns Date object
 */
export const parseDate = (value: any): Date => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date(0) : parsed;
  }
  return new Date(0);
};

/**
 * Generic comparison function for different data types
 * @param a - First value to compare
 * @param b - Second value to compare
 * @param dataType - Type of data being compared
 * @returns Comparison result (-1, 0, 1)
 */
export const compareValues = (a: any, b: any, dataType: DataType): number => {
  // Handle null/undefined values
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  switch (dataType) {
    case 'number':
      const numA = typeof a === 'number' ? a : parseFloat(String(a));
      const numB = typeof b === 'number' ? b : parseFloat(String(b));
      if (isNaN(numA) && isNaN(numB)) return 0;
      if (isNaN(numA)) return -1;
      if (isNaN(numB)) return 1;
      return numA - numB;

    case 'currency':
      return parseCurrency(a) - parseCurrency(b);

    case 'percentage':
      return parsePercentage(a) - parsePercentage(b);

    case 'date':
      const dateA = parseDate(a);
      const dateB = parseDate(b);
      return dateA.getTime() - dateB.getTime();

    case 'string':
    default:
      return String(a).localeCompare(String(b), undefined, {
        numeric: true,
        sensitivity: 'base'
      });
  }
};

/**
 * Utility function to determine data type from column key
 * @param columnKey - The column identifier
 * @returns Suggested data type
 */
export const getDataTypeFromColumn = (columnKey: string): DataType => {
  const lowerKey = columnKey.toLowerCase();
  
  if (lowerKey.includes('date') || lowerKey.includes('time')) {
    return 'date';
  }
  
  if (lowerKey.includes('rate') || lowerKey.includes('percent') || lowerKey.includes('growth')) {
    return 'percentage';
  }
  
  if (lowerKey.includes('mrr') || lowerKey.includes('arpa') || lowerKey.includes('revenue') || lowerKey.includes('price') || lowerKey.includes('cost')) {
    return 'currency';
  }
  
  if (lowerKey.includes('count') || lowerKey.includes('number') || lowerKey.includes('score')) {
    return 'number';
  }
  
  return 'string';
};