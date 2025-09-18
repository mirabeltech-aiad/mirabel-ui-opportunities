// Centralized tooltip content following the comprehensive guide
export const TOOLTIPS = {
  // Filter and Search Components
  FILTER_DROPDOWN: {
    TRIGGER: 'Filter columns by category, data type, usage, or custom criteria',
    QUICK_FILTERS: {
      HIGH_IMPORTANCE: 'Show only columns marked as high importance for common workflows',
      REQUIRED_ONLY: 'Display only columns that are required for data entry',
      MOST_USED_CATEGORY: 'Filter to the category with the most available columns'
    },
    CATEGORY_SEARCH: 'Search through available categories to quickly find specific column groups',
    ACTIVE_FILTER_BADGE: 'Click to remove this active filter',
    CLEAR_ALL_FILTERS: 'Remove all active filters and show all columns'
  },

  COLUMN_SELECTOR: {
    SEARCH_INPUT: 'Search columns by name, description, category, or tags',
    FUZZY_SEARCH_BADGE: 'Fuzzy search enabled - matches similar terms and handles typos',
    SEARCH_HISTORY: 'View and reuse previous search terms',
    CLEAR_SEARCH: 'Clear current search term and show all columns',
    COLUMN_ITEM: {
      LOCKED: 'This column is locked and cannot be removed from the view',
      MOVE_UP: 'Move this column up in the display order',
      MOVE_DOWN: 'Move this column down in the display order',
      ADD_COLUMN: 'Add this column to the visible columns list',
      REMOVE_COLUMN: 'Remove this column from the visible columns list',
      CATEGORY_BADGE: 'Column category - groups related columns together',
      DATA_TYPE_BADGE: 'Data type - indicates the kind of data this column contains',
      IMPORTANCE_BADGE: 'Usage importance - how critical this column is for typical workflows',
      MATCH_SCORE: 'Fuzzy search match score - higher percentages indicate better matches'
    },
    BULK_ACTIONS: {
      SELECT_ALL: 'Add all visible available columns to the selected columns list',
      CLEAR_ALL: 'Remove all non-locked columns from the selected columns list'
    },
    STATS: {
      SELECTED_COUNT: 'Number of columns currently visible in the table',
      TOTAL_COUNT: 'Total number of columns available for this table',
      FILTERED_COUNT: 'Number of columns shown after applying search and filters'
    }
  },

  RESET_BUTTON: {
    FILTERS: 'Remove all active filters and show all items',
    COLUMNS: 'Reset column selection to default configuration',
    SELECTION: 'Clear all selected items',
    SORTING: 'Remove all sorting and return to default order',
    DISABLED: 'No active items to reset'
  },

  BULK_UPDATE_DIALOG: {
    TABS: {
      UPDATE_FIELDS: 'Configure which fields to update and their new values',
      PREVIEW: 'Review changes before applying them to selected items',
      TEMPLATES: 'Save and reuse common bulk update configurations',
      HISTORY: 'View previous bulk operations and undo if needed',
      ERRORS: 'Review and retry any failed update operations'
    },
    FIELD_UPDATES: {
      ENABLE_FIELD: 'Check to include this field in the bulk update operation',
      FIELD_INPUT: 'Enter the new value that will be applied to all selected items',
      CONDITION_INPUT: 'Optional: JavaScript condition to determine which items get updated'
    },
    PREVIEW: {
      CHANGES_COUNT: 'Number of items that will be modified by this operation',
      FIELD_CHANGE: 'Shows the current value changing to the new value',
      WARNING_ICON: 'Potential issue that should be reviewed before proceeding',
      CONFLICT_ICON: 'Data conflict that may prevent the update from succeeding'
    },
    TEMPLATES: {
      SAVE_TEMPLATE: 'Save current field configuration as a reusable template',
      APPLY_TEMPLATE: 'Apply this saved configuration to the selected items',
      DELETE_TEMPLATE: 'Permanently remove this template',
      USAGE_COUNT: 'Number of times this template has been used'
    },
    PROGRESS: {
      CURRENT_ITEM: 'Item currently being processed',
      CHUNK_INFO: 'Large datasets are processed in chunks for better performance',
      CANCEL_BUTTON: 'Stop the bulk operation (changes already made will remain)'
    },
    LARGE_DATASET_WARNING: 'Processing many items at once - operation will be chunked for optimal performance'
  },

  IMPORT_DIALOG: {
    FILE_UPLOAD: {
      DROP_ZONE: 'Drag and drop your CSV or Excel file here, or click to browse',
      FILE_FORMATS: 'Supported formats: CSV, Excel (.xlsx, .xls) files up to 10MB',
      TEMPLATE_DOWNLOAD: 'Download a sample file with the correct column format and data types',
      REMOVE_FILE: 'Remove the selected file and choose a different one'
    },
    VALIDATION: {
      TOTAL_ROWS: 'Total number of data rows found in the uploaded file',
      VALID_ROWS: 'Number of rows that passed validation and can be imported',
      ERROR_COUNT: 'Number of rows with validation errors that need to be fixed',
      ERROR_DETAILS: 'Specific validation error for this row and column'
    },
    PROCESSING: {
      PROGRESS_BAR: 'File processing progress - parsing and validating data',
      IMPORT_BUTTON: 'Import the validated data into the system'
    }
  },

  PRODUCT_FORM: {
    BASIC_FIELDS: {
      PRODUCT_NAME: 'Enter a descriptive name for this product (required, max 100 characters)',
      PRODUCT_CODE: 'Unique identifier/SKU for this product (required, must be unique)',
      DESCRIPTION: 'Detailed description of the product features and benefits',
      CATEGORY: 'Product category for organization and filtering',
      ACTIVE_STATUS: 'Whether this product is currently available for use',
      SCHEDULE: 'How frequently this product is published or delivered'
    },
    SKU_VALIDATION: {
      CHECKING: 'Verifying that this SKU is not already in use',
      AVAILABLE: 'This SKU is available and can be used',
      UNAVAILABLE: 'This SKU is already in use - please choose a different one'
    },
    PRODUCT_TYPE_SPECIFIC: {
      PRINT_SPECS: 'Physical specifications for print products (dimensions, margins, etc.)',
      EVENT_DATE: 'Date and time when this event will take place',
      EVENT_LOCATION: 'Physical or virtual location where the event will be held',
      EVENT_DURATION: 'How long the event will last (hours, days, etc.)',
      SERVICE_TYPE: 'Category of service being offered',
      BILLING_CYCLE: 'How frequently customers will be charged for this product',
      CIRCULATION: 'Number of copies distributed for print publications',
      PAGE_RATE: 'Average cost per page for advertising placement',
      NEP: 'Net Effective Price - final price after discounts and adjustments',
      DIGITAL_STUDIO: 'Whether this product appears in the digital design studio'
    },
    PRINT_SPECIFICATIONS: {
      PAGE_SIZE: 'Physical dimensions of the printed page',
      PAGE_WIDTH: 'Width of the page in the selected unit of measurement',
      PAGE_HEIGHT: 'Height of the page in the selected unit of measurement',
      UNIT_SELECTOR: 'Unit of measurement for all dimensions (inches, mm, cm, points)',
      PAGE_MARGINS: 'Non-printable border area around the page edges',
      MARGIN_LEFT: 'Left margin - distance from left edge to printable area',
      MARGIN_TOP: 'Top margin - distance from top edge to printable area',
      MARGIN_RIGHT: 'Right margin - distance from right edge to printable area',
      MARGIN_BOTTOM: 'Bottom margin - distance from bottom edge to printable area',
      LIVE_AREA: 'Safe printable area within the page margins',
      LIVE_AREA_WIDTH: 'Width of the safe printable area',
      LIVE_AREA_HEIGHT: 'Height of the safe printable area',
      BLEED: 'Extra area beyond trim edge to ensure full coverage after cutting'
    },
    ADVANCED_FIELDS: {
      TAGS: 'Keywords for searching and categorizing this product',
      FEATURES: 'Specific features and capabilities included with this product',
      TARGET_AUDIENCE: 'Primary customer segments for this product',
      RATE_CARDS: 'Pricing structures associated with this product',
      MAGAZINES: 'Publications associated with this product',
      CONTENT_TYPE: 'Type of content this product will contain'
    },
    FORM_ACTIONS: {
      SAVE_BUTTON: 'Save all changes and create/update this product',
      CANCEL_BUTTON: 'Discard changes and close this form',
      RESET_BUTTON: 'Reset all fields to their original values',
      UNSAVED_CHANGES: 'You have unsaved changes that will be lost if you close this form'
    },
    COLLAPSIBLE_SECTIONS: {
      EXPAND: 'Click to expand this section and view additional options',
      COLLAPSE: 'Click to collapse this section and hide these options'
    }
  },

  // Technical Terms and Abbreviations
  TECHNICAL_TERMS: {
    SKU: 'Stock Keeping Unit - unique identifier for each product variant',
    NEP: 'Net Effective Price - final price after all discounts and adjustments',
    CIRCULATION: 'Number of copies distributed for print publications',
    PAGE_RATE: 'Cost per page for advertising or content placement',
    LIVE_AREA: 'Printable area within page margins where content can be placed',
    BLEED: 'Extra area beyond trim edge to ensure full coverage after cutting',
    RATE_CARD: 'Standardized pricing structure for advertising or services',
    BILLING_CYCLE: 'Frequency of recurring charges (monthly, quarterly, yearly)',
    FUZZY_SEARCH: 'Search that finds matches even with typos or partial terms'
  },

  // Status Indicators and Badges
  STATUS_INDICATORS: {
    ACTIVE: 'This item is currently active and available for use',
    INACTIVE: 'This item is disabled and not available for use',
    PROCESSING: 'Operation is currently in progress',
    SUCCESS: 'Operation completed successfully',
    ERROR: 'Operation failed - click for details',
    WARNING: 'Potential issue that should be reviewed',
    PENDING: 'Waiting to be processed',
    LOCKED: 'This item is protected and cannot be modified'
  },

  // Data Visualization
  DATA_VIZ: {
    PROGRESS_BAR: 'Visual representation of completion percentage',
    MATCH_SCORE: 'How closely this result matches your search criteria',
    USAGE_FREQUENCY: 'How often this item is used relative to others',
    FILTER_COUNT: 'Number of active filters currently applied',
    SELECTION_COUNT: 'Number of items currently selected'
  },

  // Navigation and Interface
  NAVIGATION: {
    DROPDOWN_TOGGLE: 'Click to expand or collapse this menu',
    SORT_ASCENDING: 'Sort items from lowest to highest value',
    SORT_DESCENDING: 'Sort items from highest to lowest value',
    PAGINATION: 'Navigate between pages of results',
    CLOSE_DIALOG: 'Close this dialog and return to the previous view',
    MINIMIZE_PANEL: 'Collapse this panel to save screen space',
    EXPAND_PANEL: 'Expand this panel to show more options'
  },

  // Form Validation
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required and must be filled in',
    INVALID_FORMAT: 'Please enter a value in the correct format',
    DUPLICATE_VALUE: 'This value is already in use - please choose a different one',
    OUT_OF_RANGE: 'Value must be within the specified range',
    TOO_LONG: 'Text is too long - please shorten to fit the limit',
    CHECKING_AVAILABILITY: 'Verifying that this value is available for use'
  }
} as const

import { logger } from '../../shared/logger'

// Helper function to get tooltip content safely
export const getTooltip = (path: string): string => {

  const keys = path.split('.')
  let current: any = TOOLTIPS
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      logger.warn(`Tooltip path not found: ${path}`)
      return ''
    }
  }
  
  return typeof current === 'string' ? current : ''
}

export default TOOLTIPS