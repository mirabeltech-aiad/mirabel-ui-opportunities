// Validation utilities for API responses and data structures

export const validateApiResponse = (apiData, expectedTables = []) => {
    if (!apiData) {
      return { isValid: false, message: 'No API data received', type: 'no_data' };
    }
    
    const dataSection = apiData?.content?.Data;
    if (!dataSection) {
      return { 
        isValid: false, 
        message: 'Invalid API response structure - missing Data section', 
        type: 'structure_error' 
      };
    }
    
    // Check for expected tables if specified
    const missingTables = [];
    for (const table of expectedTables) {
      if (!dataSection[table]) {
        missingTables.push(table);
      }
    }
    
    if (missingTables.length > 0) {
      console.warn(`Expected tables not found in API response:`, missingTables);
      return {
        isValid: false,
        message: `Missing expected data tables: ${missingTables.join(', ')}`,
        type: 'missing_tables',
        missingTables
      };
    }
    
    return { isValid: true, type: 'success' };
  };
  
  export const validateTableData = (tableData, tableName = 'data') => {
    if (!Array.isArray(tableData)) {
      return {
        isValid: false,
        message: `${tableName} is not an array`,
        type: 'type_error'
      };
    }
    
    if (tableData.length === 0) {
      return {
        isValid: false,
        message: `${tableName} is empty`,
        type: 'empty_data'
      };
    }
    
    return { isValid: true, type: 'success' };
  };
  
  export const validateFieldMapping = (item, requiredFields, tableName = 'item') => {
    const missingFields = [];
    const presentFields = [];
    
    for (const field of requiredFields) {
      if (item[field] === undefined || item[field] === null) {
        missingFields.push(field);
      } else {
        presentFields.push(field);
      }
    }
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      presentFields,
      message: missingFields.length > 0 ? 
        `${tableName} missing fields: ${missingFields.join(', ')}` : 
        'All fields present'
    };
  };
  
  export const sanitizeNumericValue = (value, defaultValue = 0) => {
    const numValue = Number(value);
    return isNaN(numValue) ? defaultValue : numValue;
  };
  
  export const sanitizeStringValue = (value, defaultValue = '') => {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    return String(value).trim() || defaultValue;
  };
  
  export const sanitizeDateValue = (value, defaultValue = null) => {
    if (!value) return defaultValue;
    
    const date = new Date(value);
    return isNaN(date.getTime()) ? defaultValue : date;
  };
  
  export const createEmptyDataStructure = (structure) => {
    if (Array.isArray(structure)) {
      return [];
    }
    
    if (typeof structure === 'object') {
      const result = {};
      for (const [key, value] of Object.entries(structure)) {
        if (typeof value === 'number') {
          result[key] = 0;
        } else if (typeof value === 'string') {
          result[key] = '';
        } else if (Array.isArray(value)) {
          result[key] = [];
        } else if (typeof value === 'object') {
          result[key] = createEmptyDataStructure(value);
        } else {
          result[key] = null;
        }
      }
      return result;
    }
    
    return null;
  };