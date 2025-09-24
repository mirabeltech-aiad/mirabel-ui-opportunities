// Activity-related constants to avoid hardcoded values

// Activity Types
export const ACTIVITY_TYPES = {
  ALL: 4,
  NOTES: 5,
  CALLS: 2,
  MEETINGS: 3,
  EMAILS: 7,
  TASKS: 8
};

// Activity Source Types (User vs System filter)
export const ACTIVITY_SOURCE_TYPES = {
  USER_ONLY: 0,        // Show only user-created activities
  SYSTEM_ONLY: 1,      // Show only system-generated activities (not used in toggle)
  ALL_INCLUDING_SYSTEM: 2  // Show all activities including system-generated
};

// Activity Source Type User (Current User filter)
export const ACTIVITY_SOURCE_TYPE_USER = {
  ALL_USERS: 2,        // Show all users' activities
  CURRENT_USER_ONLY: 3 // Show only current logged-in user's activities
};

// API Configuration
export const API_CONFIG = {
  LIMIT_CHARS: "200",
  MAX_RETRIES: 3,
  BASE_RETRY_DELAY: 1000,
  REQUEST_TIMEOUT: 10000,
  DEBOUNCE_DELAY: 300,
  BUTTON_LOADING_DELAY: 500,
  REFRESH_LOADING_DELAY: 1000,
  RETRY_DELAY: 2000
};

// Filter State Keys
export const FILTER_KEYS = {
  CURRENT_USER_ONLY: 'currentUserOnly',
  USER_NOTES_ONLY: 'userNotesOnly',
  COMPANY_WIDE: 'companyWide',
  PINNED_ONLY: 'pinnedOnly'
};

// Activity Category Mappings for Pin/Unpin API
export const ACTIVITY_CATEGORY_MAPPINGS = {
  "All": ACTIVITY_TYPES.ALL,
  "Notes": ACTIVITY_TYPES.NOTES,
  "Calls": ACTIVITY_TYPES.CALLS,
  "Meetings": ACTIVITY_TYPES.MEETINGS,
  "Emails": ACTIVITY_TYPES.EMAILS,
  "Tasks": ACTIVITY_TYPES.TASKS
};

// Tab names that support User vs System filter
export const TABS_WITH_USER_SYSTEM_FILTER = ['all', 'notes', 'emails'];

// Default Filter Values
export const DEFAULT_FILTER_STATE = {
  [FILTER_KEYS.CURRENT_USER_ONLY]: false,    // Start with all users
  [FILTER_KEYS.USER_NOTES_ONLY]: false,      // Start with all activities including system
  [FILTER_KEYS.COMPANY_WIDE]: false,         // Start with contact view
  [FILTER_KEYS.PINNED_ONLY]: false           // Start with all activities
};

// Filter Interaction Rules
export const FILTER_AVAILABILITY_RULES = {
  // Tabs where User vs System Notes filter is available
  USER_SYSTEM_FILTER_TABS: ['all', 'notes', 'emails'],
  // Tabs where all other filters are available
  UNIVERSAL_FILTER_TABS: ['all', 'notes', 'calls', 'meetings', 'emails', 'tasks']
};

// API Response Status Values
export const API_STATUS = {
  SUCCESS: 'Success',
  ERROR: 'Error',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  BAD_REQUEST: 'BadRequest'
};

// Tooltip Messages
export const TOOLTIP_MESSAGES = {
  REFRESH: "Reload Activities",
  CURRENT_USER_ACTIVE: "View All User Notes",
  CURRENT_USER_INACTIVE: "View Current User Notes",
  USER_NOTES_ACTIVE: "User Notes Only",
  USER_NOTES_INACTIVE: "All Notes & System Activities",
  COMPANY_WIDE_ACTIVE: "View Contact Activities",
  COMPANY_WIDE_INACTIVE: "View Company Activities",
  PINNED_ACTIVE: "Show Only Pinned Activities",
  PINNED_INACTIVE: "Show All Activities"
};

// Filter Display Names
export const FILTER_DISPLAY_NAMES = {
  CURRENT_USER: "Current User",
  USER_NOTES: "User Notes",
  COMPANY_WIDE: "Company-wide",
  PINNED: "Pinned"
};

// Storage Keys
export const STORAGE_KEYS = {
  ACTIVITY_FILTERS: "activityIconBar_filters"
};

// UI Messages
export const UI_MESSAGES = {
  RESTRICTIVE_FILTERS_WARNING: "⚠️ Very restrictive filters",
  SESSION_STORAGE_LOAD_ERROR: "Failed to load filter state from sessionStorage:",
  SESSION_STORAGE_SAVE_ERROR: "Failed to save filter state to sessionStorage:"
};

// Error Messages
export const ERROR_MESSAGES = {
  CONTACT_ID_NOT_FOUND: "Contact ID not found",
  REQUEST_TIMEOUT: "Request timed out. Please try again.",
  PERMISSION_DENIED: "Permission denied. Please check your access rights.",
  NOT_FOUND: "Activities not found for this contact.",
  SERVER_ERROR: "Server error. Please try again later.",
  GENERIC_ERROR: "Failed to load activities",
  FILTER_APPLY_ERROR: "Failed to apply filter",
  AUTHENTICATION_ERROR: "Session expired. Please log in again.",
  VALIDATION_ERROR: "Invalid request parameters",
  NETWORK_ERROR: "Network connection failed. Please check your connection."
};

// API Endpoints
export const API_ENDPOINTS = {
  ACTIVITIES: '/services/Crm/Activities',
  TASKS_DETAILS: '/services/Crm/tasks/Details',
  ACTIVITIES_SAVE: '/services/crm/activities/save',
  PIN_ACTIVITY: '/services/Crm/Activities/Pin'
};

export default {
  ACTIVITY_TYPES,
  ACTIVITY_SOURCE_TYPES,
  ACTIVITY_SOURCE_TYPE_USER,
  API_CONFIG,
  FILTER_KEYS,
  ACTIVITY_CATEGORY_MAPPINGS,
  TABS_WITH_USER_SYSTEM_FILTER,
  DEFAULT_FILTER_STATE,
  FILTER_AVAILABILITY_RULES,
  API_STATUS,
  TOOLTIP_MESSAGES,
  FILTER_DISPLAY_NAMES,
  STORAGE_KEYS,
  UI_MESSAGES,
  ERROR_MESSAGES,
  API_ENDPOINTS
};