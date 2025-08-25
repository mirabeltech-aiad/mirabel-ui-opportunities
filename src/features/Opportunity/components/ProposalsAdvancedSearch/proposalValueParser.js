/**
 * Parse values for Proposal Advanced Search components
 * Handles SW= format and converts to user-friendly display values
 */

/**
 * Parse a value that might be in SW= format and return an array of clean values
 * @param {any} value - The value to parse
 * @returns {Array} - Array of clean values
 */
export const parseProposalValue = (value) => {
  if (!value) return [];
  
  // If it's already an array, return as is
  if (Array.isArray(value)) {
    return value;
  }
  
  // If it's a string, parse it
  if (typeof value === 'string') {
    // Handle SW= format (multiple values concatenated)
    if (value.includes('SW=')) {
      const parts = value.split('SW=').filter(part => part.trim() !== '');
      return parts.map(part => {
        // Remove the trailing ~ from each part
        return part.replace(/~$/, '');
      });
    }
    
    // Handle comma-separated values
    if (value.includes(',')) {
      return value.split(',').filter(v => v.trim());
    }
    
    // Single value
    return [value];
  }
  
  return [];
};

/**
 * Get display text for a value in Proposal Advanced Search
 * @param {any} value - The value to get display text for
 * @param {Array} predefinedOptions - Array of predefined options with value and label properties
 * @returns {string} - Display text
 */
export const getProposalDisplayText = (value, predefinedOptions = []) => {
  const parsedValues = parseProposalValue(value);
  
  if (parsedValues.length === 0) return '';
  if (parsedValues.length === 1) {
    const predefined = predefinedOptions.find(option => option.value === parsedValues[0]);
    if (predefined) return predefined.label;
    
    // For custom text, remove SW= and ~ to show user-friendly text
    if (parsedValues[0].startsWith('SW=') && parsedValues[0].endsWith('~')) {
      return parsedValues[0].slice(3, -1); // Remove SW= and ~
    }
    return parsedValues[0];
  }
  return `${parsedValues.length} selected`;
};

/**
 * Format values for backend compatibility (convert to SW= format)
 * @param {Array} values - Array of values to format
 * @returns {string} - Formatted string for backend
 */
export const formatProposalValuesForBackend = (values) => {
  if (!Array.isArray(values) || values.length === 0) return '';
  
  return values.map(value => {
    // If it's already formatted, keep as is
    if (value.startsWith('SW=') && value.endsWith('~')) {
      return value;
    }
    // If it's a predefined option, keep as is
    if (value === 'IN=Is Empty~' || value === 'INN=Is Not Empty~') {
      return value;
    }
    // Format custom text as SW=value~
    return `SW=${value}~`;
  }).join('');
}; 