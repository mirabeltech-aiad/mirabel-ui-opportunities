// Application Constants - Centralized constant values

// Application Configuration
export const APP_CONFIG = {
  NAME: 'Mirabel UI',
  VERSION: '3.0.0',
  BASE_PATH: '/app',
  API_TIMEOUT: 30000, // 30 seconds
  DEBOUNCE_DELAY: 300, // 300ms for search inputs
  PAGINATION_SIZE: 20,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.gif']
};

// Idle Detection Configuration
export const IDLE_CONFIG = {
  DEFAULT_TIMEOUT: 5 * 60 * 1000, // 1 minutes default
  THREE_HOURS: 3 * 60 * 60 * 1000, // 3 hours
};

// Local Storage Keys
export const STORAGE_KEYS = {
  MM_CLIENT_VARS: 'MMClientVars',
  CLIENT_ID: 'ClientID',
  TOKEN_DATA: 'TokenData',
  USER_PREFERENCES: 'UserPreferences',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Session Storage Keys
export const SESSION_KEYS = {
  CLIENT_ID: 'ClientID',
  SESSION_ID: 'SessionID',
  TEMP_DATA: 'TempData'
};

// API Configuration
export const API_CONFIG = {
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  TIMEOUT: 30000 // 30 seconds
};

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]{10,}$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  MAX_TEXT_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 1000
};

// UI Constants
export const UI_CONFIG = {
  TOAST_DURATION: 5000, // 5 seconds
  LOADING_SPINNER_DELAY: 500, // 500ms
  ANIMATION_DURATION: 300, // 300ms
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536
  }
};

// Date/Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'MM/dd/yyyy',
  API: 'yyyy-MM-dd',
  TIMESTAMP: 'yyyy-MM-dd HH:mm:ss',
  TIME_ONLY: 'HH:mm',
  FULL_DATE: 'EEEE, MMMM do, yyyy'
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size must be less than ${APP_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: `Supported file types: ${APP_CONFIG.SUPPORTED_FILE_TYPES.join(', ')}`
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE: 'Data saved successfully',
  UPDATE: 'Updated successfully',
  DELETE: 'Deleted successfully',
  CREATE: 'Created successfully',
  UPLOAD: 'File uploaded successfully',
  SEND: 'Message sent successfully'
};

// Loading Messages
export const LOADING_MESSAGES = {
  SAVING: 'Saving...',
  LOADING: 'Loading...',
  DELETING: 'Deleting...',
  UPLOADING: 'Uploading...',
  PROCESSING: 'Processing...'
};

// Development Configuration
export const DEV_CONFIG = {
  ENABLE_LOGGING: true,
  ENABLE_DEBUG_TOOLS: true,
  MOCK_API_DELAY: 1000, // 1 second delay for mock APIs
  DEFAULT_USER_ID: 23,
  DEFAULT_CLIENT_ID: '5'
};

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  AVAILABLE_THEMES: ['light', 'dark', 'system'],
  CSS_VARIABLES: {
    PRIMARY: '--color-primary',
    SECONDARY: '--color-secondary',
    BACKGROUND: '--color-background',
    FOREGROUND: '--color-foreground'
  }
};

// Export all constants in a single object for convenience
export const CONSTANTS = {
  APP_CONFIG,
  STORAGE_KEYS,
  SESSION_KEYS,
  API_CONFIG,
  VALIDATION,
  UI_CONFIG,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  DEV_CONFIG,
  THEME_CONFIG
};