/**
 * Utility functions for safe handling of search parameters
 */

/**
 * Safely converts a value to an array, handling various input types
 * @param {any} value - The value to convert
 * @returns {Array} - Array of values
 */
export const safeStringToArray = (value) => {
  if (!value) return [];
  
  // If it's already an array, return as is
  if (Array.isArray(value)) {
    return value;
  }
  
  // If it's a string, split by comma
  if (typeof value === 'string') {
    return value.split(',').filter(v => v.trim());
  }
  
  // If it's a single value, convert to array
  return [String(value)];
};

/**
 * Safely gets an array value for multi-select components
 * @param {any} value - The value to process
 * @returns {Array} - Array suitable for multi-select components
 */
export const getMultiSelectValue = (value) => {
  if (!value) return [];
  
  // If it's already an array, return as is
  if (Array.isArray(value)) {
    return value;
  }
  
  // If it's a string, check if it contains commas
  if (typeof value === 'string') {
    if (value.includes(',')) {
      return value.split(',').filter(Boolean);
    }
    return [value];
  }
  
  // If it's a single value, convert to array
  return [String(value)];
};

/**
 * Safely gets an array value for autocomplete components
 * @param {any} value - The value to process
 * @returns {Array} - Array suitable for autocomplete components
 */
export const getAutocompleteValue = (value) => {
  if (!value) return [];
  
  // If it's already an array, return as is
  if (Array.isArray(value)) {
    return value;
  }
  
  // If it's a string, split by comma and filter empty values
  if (typeof value === 'string') {
    return value.split(',').filter(v => v.trim());
  }
  
  // If it's a single value, convert to array
  return [String(value)];
};

/**
 * Safely converts an array back to a comma-separated string
 * @param {Array} value - The array to convert
 * @returns {string} - Comma-separated string
 */
export const arrayToString = (value) => {
  if (!value) return '';
  
  if (Array.isArray(value)) {
    return value.filter(v => v).join(',');
  }
  
  return String(value);
}; 