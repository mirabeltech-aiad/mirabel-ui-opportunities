// Enums - Centralized enum-like objects for consistent values

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
  VIEWER: 'viewer'
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
};

// Request Status
export const REQUEST_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed'
};

// HTTP Status Codes (commonly used)
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// API Response Types
export const API_RESPONSE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Form Input Types
export const INPUT_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TEL: 'tel',
  URL: 'url',
  SEARCH: 'search',
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime-local',
  FILE: 'file'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Modal Sizes
export const MODAL_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
  EXTRA_LARGE: 'xl',
  FULL: 'full'
};

// Button Variants
export const BUTTON_VARIANTS = {
  DEFAULT: 'default',
  DESTRUCTIVE: 'destructive',
  OUTLINE: 'outline',
  SECONDARY: 'secondary',
  GHOST: 'ghost',
  LINK: 'link'
};

// Button Sizes
export const BUTTON_SIZES = {
  DEFAULT: 'default',
  SMALL: 'sm',
  LARGE: 'lg',
  ICON: 'icon'
};

// File Types
export const FILE_TYPES = {
  DOCUMENT: 'document',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  ARCHIVE: 'archive',
  OTHER: 'other'
};

// Sort Directions
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
};

// Environment Types
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
  TEST: 'test'
};

// Language Codes
export const LANGUAGES = {
  EN_US: 'en-US',
  EN_GB: 'en-GB',
  ES_ES: 'es-ES',
  FR_FR: 'fr-FR',
  DE_DE: 'de-DE'
};

// Currency Codes
export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  CAD: 'CAD',
  AUD: 'AUD'
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Support Ticket Categories
export const TICKET_CATEGORIES = {
  TECHNICAL: 'technical',
  BILLING: 'billing',
  FEATURE_REQUEST: 'feature_request',
  BUG_REPORT: 'bug_report',
  GENERAL: 'general'
};

// Help Desk Status
export const HELPDESK_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  WAITING_FOR_CUSTOMER: 'waiting_for_customer',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

// Dashboard Widget Types
export const WIDGET_TYPES = {
  CHART: 'chart',
  METRIC: 'metric',
  TABLE: 'table',
  LIST: 'list',
  CALENDAR: 'calendar'
};

// Chart Types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  DOUGHNUT: 'doughnut',
  AREA: 'area',
  SCATTER: 'scatter'
};

// Export all enums in a single object for convenience
export const ENUMS = {
  USER_ROLES,
  USER_STATUS,
  REQUEST_STATUS,
  HTTP_STATUS,
  API_RESPONSE_TYPES,
  INPUT_TYPES,
  NOTIFICATION_TYPES,
  MODAL_SIZES,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  FILE_TYPES,
  SORT_DIRECTIONS,
  ENVIRONMENTS,
  LANGUAGES,
  CURRENCIES,
  PRIORITY_LEVELS,
  TICKET_CATEGORIES,
  HELPDESK_STATUS,
  WIDGET_TYPES,
  CHART_TYPES
};

/**
 * Client Type Enum - matches server-side ClientType enum exactly
 */
export const CLIENT_TYPE = {
  /**
   * The Magazine Manager
   */
  TMM: 'TMM',
  /**
   * Marketing Manager
   */
  MKM: 'MKM',
  /**
   * News Paper Manager
   */
  NPM: 'NPM',
  /**
   * Mirabel Customer Portal
   */
  MCP: 'MCP',
  /**
   * Mirabel Subscription Checkout Page
   */
  MSCP: 'MSCP',
  /**
   * Mirabel Self Service Portal
   */
  MSSP: 'MSSP',
  /**
   * Mirabel Subscription Page (MM)
   */
  MSP: 'MSP'
};

// Package Types - matching C# PackageTypes enum
export const PACKAGE_TYPES = {
    CRM: 1,
    CRM_INT: 2,  // CRM_Int
    MM: 3,
    MES: 4,
    // Add other package types as needed
};