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
  SITEWIDE_SETTINGS_GET_COLUMNNAMES: `${API_BASE.ADMIN}/SiteSettings/ColumnNames/`,
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
  REFRESH_TOKEN: '/intranet/Members/Home/Home.aspx/auth/refresh',
  CHECK_ANOTHER_SESSION: '/services/User/Logins/CheckSession',
  UPDATE_LOGOUT_TIME: '/services/User/Logins/LogOut'
};

// Navigation APIs
export const NAVIGATION_API = {
  ENCRYPTION_KEY: '/services/admin/common/k/8',
  USER_MENUS: '/services/admin/navigations/users',
  SESSION_DETAILS: '/services/admin/common/SessionDetailsGet'
};

// Dashboard APIs
export const DASHBOARD_API = {
  USER_DASHBOARDS: '/services/User/Dashboards/false',
  SAVE_ACTIVE_DASHBOARD: '/services/User/Dashboards/Active/'
};

// Portal/Widget APIs
export const PORTAL_API = {
  USER_WIDGETS_GET_DETAILS: '/services/User/Widgets/',
  GET_TITLES: 'GetTitles', // SPACTION_GETTITLES
  PORTAL_INDEX_ALL: '-1' // For all portals
};

// FrontChat APIs
export const FRONTCHAT_API = {
  CONFIG: '/services/api/frontchat/config',
  HMAC: '/services/api/frontchat/hmac',
  INIT: '/services/api/frontchat/init'
};

// Consultant APIs
export const CONSULTANT_API = {
  INFO_GET: '/services/crm/consultants/',
  CREATE_EMAIL: '/services/helpdesk/contactconsultant/createemail/'
};

// Terms and Conditions APIs
export const TERMS_API = {
  AGREEMENTS_BY_USER: '/services/mm/agreements/',
  AGREEMENTS_ACCEPT: '/services/mm/agreements/accept/'
};

// Static Page URLs
export const STATIC_URLS = {
  CHANGE_PASSWORD: '/Intranet/Members/Account/ChangePassword.aspx',
  LOGOUT: '/intranet/home/logout.aspx',
  SESSION_OUT: '/sessionout',
  CALENDAR: 'calendar.aspx',
  LOGIN_ENDED: '/intranet/Members/User/UserLoginEnded.aspx'
};

// Legacy API constants for backward compatibility (used by userService.js)
export const API_USER_ACCOUNT_GET = USER_API.ACCOUNT_GET;
export const API_USER_ACCOUNT_UPDATE = USER_API.ACCOUNT_UPDATE;
export const API_USER_LIST_GET = ADMIN_API.USER_LIST_GET;
export const API_USER_CREATE = ADMIN_API.USER_CREATE;
export const API_USER_UPDATE = ADMIN_API.USER_UPDATE;
export const API_USER_DELETE = ADMIN_API.USER_DELETE;

// CRM legacy constants
export const API_CRM_CONTACTS_SEARCH_QUICK = CRM_API.CONTACTS_SEARCH_QUICK;

// Helpdesk legacy constants
export const HELPDESK_API_ERROR_CATEGORY = HELPDESK_API.ERROR_CATEGORY;
export const HELPDESK_API_TECHSUPPORT_CREATEREQUEST = HELPDESK_API.TECHSUPPORT_CREATE;
export const HELPDESK_API_SALESREP_CREATEREQUEST = HELPDESK_API.SALESREP_CREATE;
export const HELPDESK_API_ATTACHTEMPORARY_FILE = HELPDESK_API.ATTACH_TEMPORARY_FILE;

// Consultant legacy constants
export const API_CONSULTANT_INFO_GET = CONSULTANT_API.INFO_GET;

// Export all APIs in a single object for convenience
export const API_ENDPOINTS = {
  ...ADMIN_API,
  ...CRM_API,
  ...HELPDESK_API,
  ...USER_API,
  ...MM_API,
  ...GENERAL_API,
  ...HOME_API,
  ...AUTH_API,
  ...NAVIGATION_API,
  ...DASHBOARD_API,
  ...FRONTCHAT_API,
  ...CONSULTANT_API,
  ...TERMS_API,
  ...STATIC_URLS
};

export const API_URLS = {
    // Activities
    ACTIVITIES: '/services/Crm/Activities',
  
    // Admin
    ADMIN: {
      BUSINESS_UNITS: '/services/admin/BusinessUnits/ByCriteria/true/-1',
      PRODUCTS_MASTER: '/services/Admin/Products/Master/-1/true/-1/1',
      PRODUCTS_BY_CRITERIA: '/services/Admin/Products/ByCriteria/',
      OPPORTUNITY_STAGES: '/services/Admin/Opportunities/Stage/',
      OPPORTUNITY_TYPES: '/services/Admin/Opportunities/Type',
      OPPORTUNITY_LOSS_REASONS: '/services/Admin/Opportunities/lossreason/',
    },
  
    // Contacts & CRM
    CONTACTS: {
      EDIT_DETAILS: (contactId) => `/services/Crm/Contacts/EditDetails/${contactId}/1`,
      CONTACT_DETAILS: (contactId) => `/services/Crm/Contacts/Contacts/${contactId}`,
      DISTINCT_CUSTOMERS: '/services/crm/contacts/GetDistinctCustomers/1/false/false/false/false',
      DISTINCT_CUSTOMER_EMAILS: '/services/crm/contacts/GetCustomerEmails',
    },
  
    // Opportunities
    OPPORTUNITIES: {
      BASE: '/services/Opportunities',
      DETAILS: (opportunityId) => `/services/Opportunities/${opportunityId}`,
      HISTORY: (opportunityId) => `/services/Opportunities/History/${opportunityId}/10/1`,
      UPDATE_STAGE: (opportunityId, userId) => `/Services/Opportunities/Field/PipelineStageID/${opportunityId}/0/${userId}/Insert`,
      REPORT_ALL: '/services/opportunities/report/all/',
    },
  
    // Proposals
    PROPOSALS: {
      BY_CRITERIA: '/services/production/proposals/bycriteria/ALL',
    },
  
    // User Management
    USER: {
      ACCOUNTS_MASTER: (userId) => `/services/User/Accounts/Master/${userId}/false/true`,
    },
  
    // Reports & Analytics
    REPORTS: {
      SETTINGS: (userId, viewId) => `Reports/Settings/${userId}/${viewId}`,
      SETTINGS_UPDATE: 'Reports/Settings/',
      EXECUTIVE_DASHBOARD: 'services/admin/common/production/executesp/',
      STORED_PROCEDURE: 'services/admin/common/production/executesp/',
      OPPORTUNITY_STATS: '/services/admin/common/production/executesp/',
    },
  
    // Advanced Search
    ADVANCED_SEARCH: {
      RESULT_VIEW_COLUMN_OPPORTUNITIES: '/services/AdvSearches/ResultViewColumn/1/1/-1',
      RESULT_VIEW_COLUMN_PROPOSALS: '/services/AdvSearches/ResultViewColumn/1/2/-1',
    },
  
    // Views
    VIEWS: {
      SAVED_VIEWS: '/services/AdvSearches/Views//1/0/1',
      PROPOSAL_VIEWS: '/services/AdvSearches/Views//1/0/2',
      AVAILABLE_COLUMNS: '/services/AdvSearches/Views/Column/EMPTY/1',
      PROPOSAL_AVAILABLE_COLUMNS: '/services/AdvSearches/Views/Column/Production/1',
      VIEW_DETAILS: (viewId) => `/services/AdvSearches/Views/1/${viewId}`,
      SAVE_CUSTOM_VIEW: '/services/AdvSearches/Views/',
      UPDATE_VIEW: '/services/AdvSearches/Views/Update',
      DELETE_PROPOSAL_VIEW: (viewId, userId) => `/services/crm/contacts/search/ListViewItem/${viewId}/${userId}/1`,
    },
  
    // Masters & Dropdowns
    MASTERS: {
      LEAD_SOURCES: '/services/Admin/Masters/MasterData/LeadSources',
      LEAD_TYPES: '/services/Admin/Masters/MasterData/LeadTypes',
      LEAD_STATUS: '/services/Admin/Masters/MasterData/LeadStatus',
      PROSPECTING_STAGES: '/services/Admin/Masters/MasterData/ProspectingStages',
      OPPORTUNITY_LOSS_REASON: '/services/Masters/opportunitylossreason',
      CONTACT_COUNTRIES: '/services/Admin/Masters/MasterData/ContactCountries',
      CONTACT_STATES: '/services/Admin/Masters/MasterData/ContactStates',
      CONTACT_CITIES: '/services/Admin/Masters/MasterData/ContactCities',
      CONTACT_COUNTIES: '/services/Admin/Masters/MasterData/ContactCounties',
      OPPORTUNITY_SOURCE: '/services/Admin/Opportunities/Opportunity/Source/',
      OPPORTUNITY_STATUS: '/services/Admin/Opportunities/Status/',
      OPPORTUNITY_PROBABILITY: '/services/Admin/Opportunities/Probability/',
      PROPOSAL_STAGES: '/services/production/stages/proposal',
      SAVED_SEARCHES: '/services/crm/contacts/search/SavedSearchesList/22/-1/1',
    },
  
    // CRM & General
    CRM: {
      OPPORTUNITIES_BY_CRITERIA: '/services/CRM/Opportunities/ByCriteria/0/0/0/false/false/1/25',
      ACTIVITIES_SAVE: '/services/crm/activities/save',
      CONTACTS_UPDATE: '/services/Crm/Contacts/Update',
    },

    // Saved Searches
    SAVED_SEARCH: {
      BASE: '/services/SavedSearch/',
      RECENT_OPPORTUNITIES: '/services/SavedSearch/RecentView/1/Recent Search/-1',
      RECENT_PROPOSALS: '/services/SavedSearch/RecentView/1/Recent Search/2',
    },

    // Additional Masters & Admin
    ADMIN_EXTENDED: {
      TASK_LIST_PRIORITY: '/services/Admin/Masters/TaskListPriority',
      ACTIVITY_TYPES: '/services/Admin/Masters/MasterData/ActivityTypes',
      PROSPECTING_STAGES_COLORS: '/services/prospectingstages',
    },

    // User & Views
    USER_EXTENDED: {
      PAGE_VIEW_SAVE: '/bl/rep/saveUserPageView',
    },
  
    // Import/Export
    IMPORT_EXPORT: {
      EXPORT_OPPORTUNITIES: '/services/ImportExport/Opportunities/export/',
      IMPORT_OPPORTUNITIES: '/services/ImportExport/Opportunities/import/',
    },
  };
  
  export default API_URLS;