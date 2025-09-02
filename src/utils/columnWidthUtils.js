/**
 * Utility functions for calculating dynamic column widths based on content
 */

// Character width estimation (approximate pixel width per character)
const CHAR_WIDTH_PX = 8;
const MIN_COLUMN_WIDTH = 150; // Increased minimum to prevent overlap
const MAX_COLUMN_WIDTH = 250; // Reduced maximum to encourage truncation
const HEADER_PADDING = 32; // px for padding, borders, etc.
const CELL_PADDING = 24; // px for cell padding

/**
 * Calculate the pixel width needed for a string of text
 * @param {string} text - The text to measure
 * @param {number} fontSize - Font size multiplier (default 1)
 * @returns {number} Estimated pixel width
 */
const getTextWidth = (text, fontSize = 1) => {
  if (!text || typeof text !== 'string') return 0;
  return Math.ceil(text.length * CHAR_WIDTH_PX * fontSize);
};

/**
 * Get the display value for a data field
 * @param {any} value - The raw data value
 * @param {string} columnId - The column identifier
 * @returns {string} The display string
 */
const getDisplayValue = (value, columnId) => {
  if (value === null || value === undefined) return '';
  
  // Handle currency fields
  if (columnId.toLowerCase().includes('amount') || columnId.toLowerCase().includes('revenue')) {
    if (typeof value === 'number') {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
  }
  
  // Handle percentage fields
  if (columnId.toLowerCase().includes('probability')) {
    if (typeof value === 'number') {
      return `${value}%`;
    }
  }
  
  // Handle date fields
  if (columnId.toLowerCase().includes('date')) {
    if (value instanceof Date || (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/))) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return String(value);
      }
    }
  }
  
  return String(value);
};

/**
 * Calculate optimal width for a column based on its header and data content
 * @param {string} headerText - The column header text
 * @param {Array} data - Array of data rows
 * @param {Object} column - Column configuration object
 * @returns {number} Optimal width in pixels
 */
export const calculateColumnWidth = (headerText, data, column) => {
  // Start with header width
  let maxWidth = getTextWidth(headerText, 1.1) + HEADER_PADDING; // Headers are slightly larger
  
  // Sample data to avoid performance issues with large datasets
  const sampleSize = Math.min(data.length, 100);
  const sampleData = data.slice(0, sampleSize);
  
  // Calculate width based on content
  for (const row of sampleData) {
    let cellValue = '';
    
    // Handle nested property access (e.g., "ContactDetails.Name")
    if (column.propertyMapping && column.propertyMapping.includes('.')) {
      const parts = column.propertyMapping.split('.');
      let value = row;
      for (const part of parts) {
        if (value && typeof value === 'object' && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      cellValue = getDisplayValue(value, column.id);
    } else {
      // Direct property access
      const propertyName = column.propertyMapping || column.id;
      const value = row[propertyName] || row[column.id];
      cellValue = getDisplayValue(value, column.id);
    }
    
    const cellWidth = getTextWidth(cellValue) + CELL_PADDING;
    maxWidth = Math.max(maxWidth, cellWidth);
  }
  
  // Apply min/max constraints (Status column can be 70px, Assigned Rep can be 90px)
  let minWidth = MIN_COLUMN_WIDTH;
  if (column.id === 'Status') {
    minWidth = 70;
  } else if (column.id === 'AssignedTo') {
    minWidth = 90;
  } else if (column.id === 'Probability') {
    minWidth = 90;
  } else if (column.id === 'Amount') {
    minWidth = 90;
  }
  return Math.max(minWidth, Math.min(MAX_COLUMN_WIDTH, maxWidth));
};

/**
 * Calculate optimal widths for all columns in a dataset
 * @param {Array} columns - Array of column configuration objects
 * @param {Array} data - Array of data rows
 * @returns {Object} Map of columnId to optimal width in pixels
 */
export const calculateAllColumnWidths = (columns, data) => {
  const widths = {};
  
  if (!Array.isArray(columns) || !Array.isArray(data) || data.length === 0) {
    // Return default widths if no data
    columns?.forEach(column => {
      if (column.id === 'editIcon') {
        widths[column.id] = 60;
      } else if (column.id === 'Status') {
        widths[column.id] = 70; // Set Status column default width to 70px
      } else if (column.id === 'AssignedTo') {
        widths[column.id] = 90; // Set Assigned Rep column default width to 90px
      } else if (column.id === 'Probability') {
        widths[column.id] = 90; // Set Probability column default width to 90px
      } else if (column.id === 'Amount') {
        widths[column.id] = 90; // Set Amount column default width to 90px
      } else {
        widths[column.id] = MIN_COLUMN_WIDTH;
      }
    });
    return widths;
  }
  
  columns.forEach(column => {
    if (column.id === 'editIcon') {
      widths[column.id] = 60;
    } else if (column.id === 'Status') {
      widths[column.id] = 70; // Set Status column default width to 70px
    } else if (column.id === 'AssignedTo') {
      widths[column.id] = 90; // Set Assigned Rep column default width to 90px
    } else if (column.id === 'Probability') {
      widths[column.id] = 90; // Set Probability column default width to 90px
    } else if (column.id === 'Amount') {
      widths[column.id] = 90; // Set Amount column default width to 90px
    } else {
      widths[column.id] = calculateColumnWidth(column.label, data, column);
    }
  });
  
  return widths;
};

/**
 * Merge calculated widths with saved user preferences
 * @param {Object} calculatedWidths - Widths based on content
 * @param {Object} savedWidths - User's saved column widths
 * @returns {Object} Final column widths
 */
export const mergeColumnWidths = (calculatedWidths, savedWidths = {}) => {
  const finalWidths = { ...calculatedWidths };
  
  // Override with saved widths where they exist
  Object.keys(savedWidths).forEach(columnId => {
    let minWidth = MIN_COLUMN_WIDTH;
    if (columnId === 'Status') {
      minWidth = 70;
    } else if (columnId === 'AssignedTo') {
      minWidth = 90;
    } else if (columnId === 'Probability') {
      minWidth = 90;
    } else if (columnId === 'Amount') {
      minWidth = 90;
    }
    if (savedWidths[columnId] && savedWidths[columnId] >= minWidth) {
      finalWidths[columnId] = savedWidths[columnId];
    }
  });
  
  return finalWidths;
};