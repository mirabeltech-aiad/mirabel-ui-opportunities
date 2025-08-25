/**
 * Utility function to format field values for display in active filters
 * Handles special cases like SW format for opportunity names and multiselect fields
 */

export const formatFieldValueForDisplay = (key, value) => {
  // Special handling for opportunity name basic - handle predefined options
  if (key === "opportunityNameBasic") {
    if (value === "IN=Is Empty~") {
      return "Is Empty";
    }
    if (value === "INN=Is Not Empty~") {
      return "Is Not Empty";
    }
    // For custom text, handle multiple SW= values concatenated together
    if (value && value.includes('SW=')) {
      // Split by SW= and process each part
      const parts = value.split('SW=').filter(part => part.trim() !== '');
      const cleanValues = parts.map(part => {
        // Remove the trailing ~ from each part
        return part.replace(/~$/, '');
      });
      return cleanValues.join(', ');
    }
    return value;
  }

  // Special handling for opportunity name - handle predefined options
  if (key === "opportunityName") {
    if (value === "IN=Is Empty~") {
      return "Is Empty";
    }
    if (value === "INN=Is Not Empty~") {
      return "Is Not Empty";
    }
    // For custom text, handle multiple SW= values concatenated together
    if (value && value.includes('SW=')) {
      // Split by SW= and process each part
      const parts = value.split('SW=').filter(part => part.trim() !== '');
      const cleanValues = parts.map(part => {
        // Remove the trailing ~ from each part
        return part.replace(/~$/, '');
      });
      return cleanValues.join(', ');
    }
    return value;
  }

  // Handle multiselect location fields (City, State, County, Country)
  if (["city", "state", "county", "country"].includes(key)) {
    if (!value) return '';
    
    // Handle comma-separated values
    if (typeof value === 'string' && value.includes(',')) {
      return value.split(',').map(v => v.trim()).filter(v => v).join(', ');
    }
    
    // Handle single value
    return value.toString();
  }

  // For other fields, just truncate if too long
  const str = value.toString();
  return str.length > 25 ? `${str.substring(0, 25)}...` : str;
}; 