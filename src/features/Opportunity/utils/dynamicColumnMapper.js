// Dynamic column mapper for proposal tables based on API ColumnConfig
// This utility maps API column configurations to table column structures

/**
 * Maps API ColumnConfig to table column structure
 * @param {Array} columnConfig - Array of column config objects from API
 * @returns {Array} Array of column objects for the table
 */
export const mapApiColumnConfigToTableColumns = (columnConfig) => {
  if (!Array.isArray(columnConfig) || columnConfig.length === 0) {
    console.warn('No column config provided');
    return [];
  }

  console.log('Mapping API column config to table columns:', columnConfig);

  return columnConfig.map(config => {
    const column = {
      id: config.DBName || config.ID?.toString(),
      label: config.DisplayName || 'Unknown',
      propertyMapping: config.PropertyMappingName || config.DBName,
      groupBy: config.GroupBy || '',
      isDefault: config.IsDefault || false,
      isRequired: config.IsRequired || false
    };

    // Ensure we have a valid ID
    if (!column.id) {
      column.id = column.label.toLowerCase().replace(/\s+/g, '');
    }

    return column;
  }).filter(column => column.id && column.label); // Filter out invalid columns
};

/**
 * Gets the value from a nested object using dot notation
 * @param {Object} obj - The object to search in
 * @param {String} path - The dot notation path (e.g., 'ContactDetails.Name')
 * @returns {*} The value at the path or empty string if not found
 */
export const getNestedValue = (obj, path) => {
  if (!obj || !path) return '';
  
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : '';
  }, obj) || '';
};

/**
 * Formats a value based on its type and context
 * @param {*} value - The value to format
 * @param {String} columnId - The column identifier for context
 * @returns {String} The formatted value
 */
export const formatColumnValue = (value, columnId) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  // Handle different column types
  switch (columnId) {
    case 'ProposalID':
      return `#${value}`;
    
    case 'Amount':
    case 'Proposal.Amount':
      return typeof value === 'number' ? `$${value.toLocaleString()}.00` : value;
    
    case 'ProposalDate':
    case 'CreatedDate':
    case 'CloseDate':
    case 'ActualCloseDate':
      if (value && value !== '0001-01-01T00:00:00') {
        try {
          return new Date(value).toLocaleDateString();
        } catch (e) {
          return value;
        }
      }
      return '';
    
    case 'Proposal.Status':
    case 'Status':
      return value || 'Unknown';
    
    case 'Proposal.ApprovalStatus':
      return value || 'Unknown';
    
    case 'ContactDetails.Name':
    case 'CustomerName':
      return value || 'Unknown Company';
    
    case 'Proposal.SalesRep.Name':
    case 'AssignedTo':
      return value || 'Unknown Rep';
    
    case 'Proposal.SalesContact.Name':
      return value || 'Unknown Contact';
    
    case 'Proposal.InternalApproval.StageName':
      return value || 'Unknown Stage';
    
    default:
      return value;
  }
};

/**
 * Renders cell content based on column type
 * @param {Object} proposal - The proposal data object (original API structure)
 * @param {Object} column - The column configuration
 * @returns {String} The rendered cell content
 */
export const renderCellContent = (proposal, column) => {
  // Use PropertyMappingName to access nested data from original API structure
  const value = getNestedValue(proposal, column.propertyMapping);
  return formatColumnValue(value, column.id);
};

/**
 * Validates column configuration from API
 * @param {Array} columnConfig - The column config from API
 * @returns {Boolean} True if valid, false otherwise
 */
export const validateColumnConfig = (columnConfig) => {
  if (!Array.isArray(columnConfig)) {
    console.error('Column config is not an array:', columnConfig);
    return false;
  }

  const requiredFields = ['DisplayName', 'DBName', 'PropertyMappingName'];
  const hasRequiredFields = columnConfig.every(config => 
    requiredFields.some(field => config[field])
  );

  if (!hasRequiredFields) {
    console.warn('Some column config items are missing required fields');
  }

  return hasRequiredFields;
}; 