// API Endpoints - Centralized API URL management
// Import and use these constants in your service classes

// Base API paths
export const API_BASE = {
  SERVICES: '/services',
  ADMIN: '/services/Admin',
  CRM: '/services/crm',
  HELPDESK: '/services/helpdesk',
  USER: '/services/User',
  MM: '/services/mm',
  API: '/services/api',
  REPORT: '/services/Report'
};

// Admin APIs
export const ADMIN_API = {
  SITEWIDE_SETTINGS_GET: `${API_BASE.ADMIN}/SiteSettings/All`,
  SITEWIDE_SETTINGS_SAVE: `${API_BASE.ADMIN}/SiteSettings/DetailsSave`,
  CIRCULATION_TYPES: `${API_BASE.ADMIN}/Circulations/Types`,
  NAVIGATION_SETUP_GET: `${API_BASE.ADMIN}/Navigation/Setup/`,
  NAVIGATION_SETUP_UPDATE: `${API_BASE.ADMIN}/Navigation/Setup/Update`,
  WEBSITE_SETUP_GET: `${API_BASE.ADMIN}/Website/Setup/`,
  WEBSITE_SETUP_UPDATE: `${API_BASE.ADMIN}/Website/Setup/Update`,
  USER_LIST_GET: `${API_BASE.ADMIN}/Users/`,
  USER_CREATE: `${API_BASE.ADMIN}/Users/Create`,
  USER_UPDATE: `${API_BASE.ADMIN}/Users/Update`,
  USER_DELETE: `${API_BASE.ADMIN}/Users/Delete/`
};

// CRM APIs
export const CRM_API = {
  CONTACTS_SEARCH_QUICK: `${API_BASE.CRM}/contacts/search/Quick`,
  CONSULTANTS_GET: `${API_BASE.CRM}/consultants/`,
  SALESREPS_GET: `${API_BASE.CRM}/salesreps/`
};

// Helpdesk APIs
export const HELPDESK_API = {
  ERROR_CATEGORY: `${API_BASE.HELPDESK}/techsupport/errorcategory`,
  TECHSUPPORT_CREATE: `${API_BASE.HELPDESK}/techsupport/create/`,
  SALESREP_CREATE: `${API_BASE.HELPDESK}/salesrep/create/`,
  CONSULTANT_CREATE_EMAIL: `${API_BASE.HELPDESK}/contactconsultant/createemail/`,
  ATTACH_TEMPORARY_FILE: `${API_BASE.HELPDESK}/attachmentsTemporarily/upload`
};

// User Management APIs
export const USER_API = {
  ACCOUNT_GET: `${API_BASE.USER}/Account/`,
  ACCOUNT_UPDATE: `${API_BASE.USER}/Account/Update`
};

// Magazine Manager APIs
export const MM_API = {
  AGREEMENTS_GET: `${API_BASE.MM}/agreements/`,
  AGREEMENTS_ACCEPT: `${API_BASE.MM}/agreements/accept/`
};

// General APIs
export const GENERAL_API = {
  FRONTCHAT_CONFIG: `${API_BASE.API}/frontchat/config`,
  FRONTCHAT_HMAC: `${API_BASE.API}/frontchat/hmac`,
  FRONTCHAT_INIT: `${API_BASE.API}/frontchat/init`,
  REPORTS_DASHBOARD: `${API_BASE.REPORT}/Categories`
};

// Home/Dashboard specific APIs
export const HOME_API = {
  DASHBOARD_DATA: '/services/dashboard/data',
  ANNOUNCEMENTS: '/services/dashboard/announcements',
  USER_PREFERENCES: '/services/user/preferences',
  NOTIFICATIONS: '/services/user/notifications'
};

// Authentication APIs
export const AUTH_API = {
  LOGIN: '/services/auth/login',
  LOGOUT: '/services/auth/logout',
  REFRESH_TOKEN: '/services/auth/refresh',
  VALIDATE_SESSION: '/services/auth/validate'
};

// Export all APIs in a single object for convenience
export const API_ENDPOINTS = {
  ...ADMIN_API,
  ...CRM_API,
  ...HELPDESK_API,
  ...USER_API,
  ...MM_API,
  ...GENERAL_API,
  ...HOME_API,
  ...AUTH_API
};