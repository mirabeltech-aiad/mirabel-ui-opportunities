import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import dashboardService from '../services/dashboardService';
import navigationService from '../services/navigationService';
import { termsAndConditionsService } from '../services/termsAndConditionsService';
import { getSessionData } from '@/utils/sessionHelpers';
import { getTopPath } from '@/utils/commonHelpers';
import { PACKAGE_TYPES } from '@/utils/enums';
import { DASHBOARD_API } from '@/utils/apiUrls';
import portalService from '../services/portalService';
const HomeContext = createContext();

// Action types
const ACTIONS = {
  ADD_TAB: 'ADD_TAB',
  REMOVE_TAB: 'REMOVE_TAB',
  REORDER_TABS: 'REORDER_TABS',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_TABS: 'SET_TABS',
  UPDATE_TAB: 'UPDATE_TAB',
  TOGGLE_HELP: 'TOGGLE_HELP',
  SET_HELP_POSITION: 'SET_HELP_POSITION',
  SET_SESSION_DATA: 'SET_SESSION_DATA',
  CLEAR_SESSION: 'CLEAR_SESSION',
  SET_DASHBOARDS: 'SET_DASHBOARDS',
  SET_SELECTED_DASHBOARD: 'SET_SELECTED_DASHBOARD',
  SET_DASHBOARDS_LOADING: 'SET_DASHBOARDS_LOADING',
  SET_NAVIGATION_MENUS: 'SET_NAVIGATION_MENUS',
  SET_NAVIGATION_LOADING: 'SET_NAVIGATION_LOADING',
  SHOW_TERMS_MODAL: 'SHOW_TERMS_MODAL',
  HIDE_TERMS_MODAL: 'HIDE_TERMS_MODAL',
  SET_LOGO_URL: 'SET_LOGO_URL',
  SET_MM_INTEGRATION: 'SET_MM_INTEGRATION',
  SET_CRM_PROSPECTING: 'SET_CRM_PROSPECTING',
  SET_MKM_MENU_VISIBLE: 'SET_MKM_MENU_VISIBLE',
  SET_PORTALS: 'SET_PORTALS',
  SET_PORTALS_LOADING: 'SET_PORTALS_LOADING',
  SET_DASHBOARD_MENU_ITEMS: 'SET_DASHBOARD_MENU_ITEMS'
};

// Initial state
const initialState = {
  tabs: [
    {
      id: 'dashboard',
      title: 'Sales Dashboard',
      component: 'Dashboard',
      type: 'component',
      closable: false,
      icon: '' // Optionally add an icon for the dashboard tab
    },
    {
      id: 'inbox',
      title: 'Inbox',
      component: 'InboxPage',
      type: 'component',
      closable: false,
      icon: ''
    },
    {
      id: 'search',
      title: 'Search',
      component: 'Search',
      type: 'iframe',
      url: null, // Lazy-loaded - will be set when tab is clicked
      closable: false,
      icon: ''
    },
    {
      id: 'prospecting',
      title: 'Prospecting',
      component: 'Prospecting',
      type: 'iframe',
      url: null, // Will be set when CRM prospecting is enabled
      closable: false,
      icon: ''
    }
  ],
  activeTabId: 'dashboard', // Set default to 'dashboard' (not in tabs array)
  helpVisible: false,
  helpPosition: { 
    x: typeof window !== 'undefined' ? window.innerWidth - 100 : 1320, 
    y: typeof window !== 'undefined' ? window.innerHeight - 35 : 620 
  },
  sessionData: null,
  isAuthenticated: false,
  dashboards: [],
  selectedDashboard: null,
  dashboardsLoading: true, // Start with loading true to prevent showing dummy dashboard
  navigationMenus: [],
  navigationLoading: false,
  showTermsModal: false,
  logoUrl: null,
  mmIntegrationSrc: null,
  crmProspectingUrl: null,
  isMMIntegration: false,
  isCRMProspecting: false,
  isMKMMenuVisible: false,
  portals: [],
  portalsLoading: false,
  dashboardMenuItems: [] // Store dashboard menu items (similar to C# menuDashboard.Items)
};

// Reducer
const homeReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TAB:
      return {
        ...state,
        tabs: [...state.tabs, action.payload],
        activeTabId: action.payload.id
      };
    
    case ACTIONS.REMOVE_TAB:
      const filteredTabs = state.tabs.filter(tab => tab.id !== action.payload);
      let newActiveTab = state.activeTabId;
      
      // If we're removing the currently active tab, find the next best tab
      if (state.activeTabId === action.payload) {
        // Count active dynamic tabs BEFORE removal (excluding fixed tabs and inactive prospecting)
        const currentActiveDynamicTabs = state.tabs.filter(tab => {
          // Exclude fixed tabs
          if (tab.id === 'dashboard' || tab.id === 'inbox' || tab.id === 'search') {
            return false;
          }
          // Exclude inactive prospecting tab
          if (tab.id === 'prospecting' && !tab.url) {
            return false;
          }
          // Include only tabs with content
          return tab.url || tab.component;
        });
        
        // If only 1 dynamic tab remains BEFORE removal, go to Search tab
        if (currentActiveDynamicTabs.length <= 1) {
          if (filteredTabs.some(tab => tab.id === 'search')) {
            newActiveTab = 'search';
          } else if (filteredTabs.some(tab => tab.id === 'inbox')) {
            newActiveTab = 'inbox';
          } else if (filteredTabs.some(tab => tab.id === 'dashboard')) {
            newActiveTab = 'dashboard';
          }
        } else {
          // Find the index of the tab being removed
          const removedTabIndex = state.tabs.findIndex(tab => tab.id === action.payload);
          
          // Try to go to the tab to the right first, then left
          if (removedTabIndex < state.tabs.length - 1) {
            // Try to go to the tab to the right
            const rightTab = state.tabs[removedTabIndex + 1];
            if (rightTab && filteredTabs.some(tab => tab.id === rightTab.id)) {
              newActiveTab = rightTab.id;
            } else if (removedTabIndex > 0) {
              // Try to go to the tab to the left
              const leftTab = state.tabs[removedTabIndex - 1];
              if (leftTab && filteredTabs.some(tab => tab.id === leftTab.id)) {
                newActiveTab = leftTab.id;
              }
            }
          } else if (removedTabIndex > 0) {
            // If it's the last tab, go to the left
            const leftTab = state.tabs[removedTabIndex - 1];
            if (leftTab && filteredTabs.some(tab => tab.id === leftTab.id)) {
              newActiveTab = leftTab.id;
            }
          }
          
          // If we still don't have a valid tab, fallback to priority system
          if (!filteredTabs.some(tab => tab.id === newActiveTab)) {
            if (filteredTabs.some(tab => tab.id === 'search')) {
              newActiveTab = 'search';
            } else if (filteredTabs.some(tab => tab.id === 'inbox')) {
              newActiveTab = 'inbox';
            } else if (filteredTabs.some(tab => tab.id === 'dashboard')) {
              newActiveTab = 'dashboard';
            } else {
              // Final fallback to last available tab
              newActiveTab = filteredTabs[filteredTabs.length - 1]?.id || 'dashboard';
            }
          }
        }
      }
      
      return {
        ...state,
        tabs: filteredTabs,
        activeTabId: newActiveTab
      };
    
    case ACTIONS.REORDER_TABS:
      return {
        ...state,
        tabs: action.payload
      };
    
    case ACTIONS.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTabId: action.payload
      };
    
    case ACTIONS.SET_TABS:
      return {
        ...state,
        tabs: action.payload
      };
    
    case ACTIONS.UPDATE_TAB:
      return {
        ...state,
        tabs: state.tabs.map(tab => 
          tab.id === action.payload.id ? { ...tab, ...action.payload } : tab
        )
      };
    
    case ACTIONS.TOGGLE_HELP:
      return {
        ...state,
        helpVisible: !state.helpVisible
      };
    
    case ACTIONS.SET_HELP_POSITION:
      return {
        ...state,
        helpPosition: action.payload
      };
    
    case ACTIONS.SET_SESSION_DATA:
      return {
        ...state,
        sessionData: action.payload,
        isAuthenticated: true
      };
    
    case ACTIONS.CLEAR_SESSION:
      return {
        ...state,
        sessionData: null,
        isAuthenticated: false
      };
    
    case ACTIONS.SET_DASHBOARDS:
      return {
        ...state,
        dashboards: action.payload
      };
    
    case ACTIONS.SET_SELECTED_DASHBOARD:
      const selectedDashboard = action.payload;
      return {
        ...state,
        selectedDashboard,
        tabs: state.tabs.map(tab => 
          tab.id === 'dashboard' 
            ? { ...tab, title: selectedDashboard?.DashBoardName || 'Dashboard' }
            : tab
        )
      };
    
    case ACTIONS.SET_DASHBOARDS_LOADING:
      return {
        ...state,
        dashboardsLoading: action.payload
      };
    
    case ACTIONS.SET_NAVIGATION_MENUS:
      return {
        ...state,
        navigationMenus: action.payload
      };
    
    case ACTIONS.SET_NAVIGATION_LOADING:
      return {
        ...state,
        navigationLoading: action.payload
      };
    
    case ACTIONS.SHOW_TERMS_MODAL:
      return {
        ...state,
        showTermsModal: true
      };
    
    case ACTIONS.HIDE_TERMS_MODAL:
      return {
        ...state,
        showTermsModal: false
      };
    
    case ACTIONS.SET_LOGO_URL:
      return {
        ...state,
        logoUrl: action.payload
      };
    
    case ACTIONS.SET_MM_INTEGRATION:
      return {
        ...state,
        mmIntegrationSrc: action.payload.mmIntegrationSrc,
        isMMIntegration: action.payload.isMMIntegration
      };
    
    case ACTIONS.SET_CRM_PROSPECTING:
      return {
        ...state,
        crmProspectingUrl: action.payload.crmProspectingUrl,
        isCRMProspecting: action.payload.isCRMProspecting
      };
    
    case ACTIONS.SET_MKM_MENU_VISIBLE:
      return {
        ...state,
        isMKMMenuVisible: action.payload
      };
    
    case ACTIONS.SET_PORTALS:
      return {
        ...state,
        portals: action.payload
      };
    
    case ACTIONS.SET_PORTALS_LOADING:
      return {
        ...state,
        portalsLoading: action.payload
      };
    
    case ACTIONS.SET_DASHBOARD_MENU_ITEMS:
      return {
        ...state,
        dashboardMenuItems: action.payload
      };
    
       default:
      return state;
  }
};

// Provider component
export const HomeProvider = ({ children, sessionLoaded = false }) => {
  const [state, dispatch] = useReducer(homeReducer, initialState);
  
  // Check for Terms and Conditions
  const checkTermsAndConditions = async () => {
    try {
      const agreementText = await termsAndConditionsService.getAgreementText();
      if (agreementText && agreementText.trim()) {
        showTermsModal();
      }
    } catch (error) {
      console.error('Error checking Terms and Conditions:', error);
    }
  };

  // Setup logo and MM/MKM integration (matching legacy ASP.NET SetupHeaderToolbar)
  const setupLogoAndMMIntegration = async () => {
    try {
      const clientDetails = localStorage.getItem("MMClientVars");
      const apiData = await navigationService.fetchApiData();
      let mmClientVars = {};
      
      if (clientDetails) {
        try {
          mmClientVars = JSON.parse(clientDetails);
        } catch (error) {
          console.error("Error parsing client variables:", error);
        }
      }
      // Hostname and SiteType logic for logo selection (matching legacy ASP.NET)
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const isNewspaperManager = hostname.includes('.newspapermanager');
      const isCRM = mmClientVars.SiteType === 'CRM';

      // Logo selection logic (matching legacy ASP.NET)
      let logoUrl = "/intranet/NewImages/Logo-MM.svg";
      if (isNewspaperManager) {
        logoUrl = "/Intranet/NewImages/Logo-NM.svg";
      }
      if (isCRM) {
        logoUrl = "/intranet/NewImages/Logo-MKM.svg";
      }
      
      setLogoUrl(logoUrl);

      // Feature flags for MM/MKM integration (matching legacy ASP.NET)
      const showMMIntegration = (
        mmClientVars.IsMKMEnabled === 'True' ||
        mmClientVars.IsMirabelEmailServiceEnabled === true ||
        mmClientVars.IsUserHasDataPackAccess === true ||
        mmClientVars.isMirableEmailTransEnabled === true
      );

      // MM Integration iframe src (matching legacy ASP.NET)
      let mmIntegrationSrc = null;
        if (showMMIntegration && mmClientVars.Token) {
        try {
          const mkmSite=apiData.MarketingManagerURL;
          // Construct URL exactly as server-side: frmMMIntegration.Src = string.Format(MarketingManagerSiteURL, "/AssignData.aspx?") + "&accesstoken=" + SessionManager.Token;
          // Expected result: https://t1mrktapp.mirabeltechnologies.com/AssignData.aspx?ISMKM=1&FE=1&MKMFE=1&MKMUA=1&DPFE=0&DPUA=0&accesstoken=...
          const marketingManagerSiteURL = await navigationService.getMarketingManagerSiteURL(mkmSite,mmClientVars,'/AssignData.aspx');
          if (marketingManagerSiteURL) {
            mmIntegrationSrc = marketingManagerSiteURL + '&accesstoken=' + mmClientVars.Token;
            console.log('🔗 MM Integration URL constructed:', mmIntegrationSrc);
          }
        } catch (error) {
          console.error('Error fetching MarketingManagerSiteURL:', error);
        }
      }

      // CRM Prospecting panel (matching legacy ASP.NET)
      let crmProspectingUrl = null;
      const showProspecting = isCRM && mmClientVars.IsUserHasDataPackAccess === true;
      
        if (showProspecting) {
        try {
          const mkmsiteurl=apiData.MarketingManagerURL;
          // Construct URL exactly as server-side: pnlProspecting.Loader.Url = string.Format(MarketingManagerSiteURL, "/midashboard.aspx?");
          // Expected result: https://t1mrktapp.mirabeltechnologies.com/midashboard.aspx?ISMKM=1&FE=1&MKMFE=1&MKMUA=1&DPFE=0&DPUA=0
          const marketingManagerSiteURL = await navigationService.getMarketingManagerSiteURL(mkmsiteurl,mmClientVars,'/midashboard.aspx');
          if (marketingManagerSiteURL) {
            crmProspectingUrl = marketingManagerSiteURL;
            console.log('🔗 CRM Prospecting URL constructed:', crmProspectingUrl);
          }
        } catch (error) {
          console.error('Error fetching MarketingManagerSiteURL for prospecting:', error);
        }
      }

      // Set MM integration state
      setMMIntegration({
        mmIntegrationSrc,
        isMMIntegration: !!mmIntegrationSrc
      });

      // Set CRM prospecting state
      setCRMProspecting({
        crmProspectingUrl,
        isCRMProspecting: !!crmProspectingUrl
      });

    } catch (error) {
      console.error('Error setting up logo and MM integration:', error);
    }
  };

  // Load navigation menus (optimized - no caching)
  const SetupNavigation = async () => {
    try {      
      const clientDetails = getSessionData();
      let cultureUI = "en-US"; // Default value
      let siteType = "TMM"; // Default value
      let navBarType = 0; // Default to General
      let userId = 1; // Default to General
      
      if (clientDetails) {
        try {
          // clientDetails is already a parsed object from getSessionData()
          const clientVars = clientDetails;
          cultureUI = clientVars.CultureUI || clientVars.cultureUI || cultureUI;
          siteType = clientVars.SiteType || clientVars.siteType || siteType;
          userId = clientVars.UserID || clientVars.userId || userId;
          
          // Determine NavBarType based on culture and site type
          if (cultureUI === "de-DE" && siteType === "CRM") {
            navBarType = 3; // GermanCRM
          } else if (siteType === "CRM") {
            navBarType = 1; // CRM
          } else if (cultureUI === "de-DE") {
            navBarType = 2; // German
          } else {
            navBarType = 0; // General
          }
          
        } catch (error) {
          console.error("Error processing client variables:", error);
        }
      }
      
      const menus = await navigationService.fetchNavigationData(userId, navBarType);
      console.log('🔗 Navigation menus:', menus);
      // Ensure we always set some menu data, even if empty
      setNavigationMenus(menus || []);
    } catch (error) {
      console.error('Error loading navigation menus:', error);
      // Set empty array on error to prevent undefined state
      setNavigationMenus([]);
    } finally {
      setNavigationLoading(false);
    }
  };

  /**
   * Setup Dashboard - mirrors C# SetupDashboard logic
   * @param {string} source - Source of the setup call (e.g., "AD" for admin)
   * @param {boolean} isReload - Whether this is a reload operation
   */
  const setupDashboard = async (source = "", isReload = false) => {
    try {
      setDashboardsLoading(true);
      
      // Get session data for MKM domain and package type
      const sessionData = getSessionData();
      const apiData = await navigationService.fetchApiData();
      const mkmDomain = apiData.MarketingManagerURL;
      const packageTypeId = sessionData?.PackageTypeID || 0;
      const isAdmin = sessionData?.IsAdmin || false;
      const accessToken = sessionData?.Token || '';
      const employeeId = sessionData?.EmployeeID || 1;
      
      // Fetch dashboards from API (matching C# API call)
      const dashboards = await dashboardService.getDashboards();
      
      // Update URLs for MKM dashboards (matching C# logic)
      const updatedDashboards = dashboards.map(dashboard => {
        if (dashboard.URL && dashboard.URL.toUpperCase().includes('ISMKM=1')) {
          // Check if URL is already a complete URL (starts with http:// or https://)
          const isCompleteUrl = dashboard.URL.startsWith('http://') || dashboard.URL.startsWith('https://');
          const baseUrl = isCompleteUrl ? '' : mkmDomain;
          const hasAccessToken = dashboard.URL.toLowerCase().includes('accesstoken=');
          const accessTokenParam = hasAccessToken ? '' : `&accesstoken=${accessToken}`;
          const updatedUrl = `${baseUrl}${dashboard.URL}${accessTokenParam}`;
      
          return {
            ...dashboard,
            URL: updatedUrl
          };
        }
        return dashboard;
      });
      
      // Set active dashboards
      const activeDashboards = updatedDashboards.filter(dashboard => dashboard.IsActive === true);
      setDashboards(activeDashboards);
      
        // Select default dashboard (matching C# logic)
        let selectedDashboard = activeDashboards.find(dashboard => dashboard.IsDefault === true);
        if (!selectedDashboard) {
          selectedDashboard = activeDashboards[0];
        }
      
      if (selectedDashboard) {
        setSelectedDashboard(selectedDashboard);
               
        // Update dashboard tab with selected dashboard info (matching C# pnlDashboard.Loader.Url and pnlDashboard.Title)
        const dashboardTab = {
          id: 'dashboard',
          title: selectedDashboard.DashBoardName || 'Sales Dashboard',
          component: 'Dashboard',
          type: 'component',
          closable: false,
          icon: '',
          dashboardUrl: selectedDashboard.URL,
          dashboardId: selectedDashboard.ID
        };
        
        // Update the dashboard tab in the tabs array
        const updatedTabs = state.tabs.map(tab => 
          tab.id === 'dashboard' ? dashboardTab : tab
        );
        dispatch({ type: ACTIONS.SET_TABS, payload: updatedTabs });
      }

      // Create dashboard menu items (matching C# menuDashboard.Items.Add logic)
      const dashboardMenuItems = activeDashboards.map(dashboard => ({
        id: `DashBoard_${dashboard.ID}`,
        text: dashboard.DashBoardName,
        title: dashboard.DashBoardName,
        url: dashboard.URL,
        type: 'dashboard',
        isDefault: dashboard.IsDefault
      }));

      // Add MKM dashboard menu item for CRM_Int package type (matching C# logic)
      if ([PACKAGE_TYPES.CRM_MKM, PACKAGE_TYPES.CRM_MKM_DATA, PACKAGE_TYPES.CRM_INT].includes(packageTypeId)) {
        const mkmDashboardUrl = isAdmin 
          ? `${mkmDomain}/WebsiteSetup.aspx&ISMKM=1`
          : `${mkmDomain}/DataUsageReport.aspx&ISMKM=1`;
        
        const mkmMenuItem = {
          id: 'MKM_Dashboard',
          text: 'Settings', // GetClassGlobalResourceObject("Settings")
          title: 'MKM Settings',
          url: mkmDashboardUrl,
          type: 'mkm'
        };
        
        dashboardMenuItems.push(mkmMenuItem);
      }

      // Store dashboard menu items in state (similar to C# menuDashboard.Items)
      dispatch({ type: ACTIONS.SET_DASHBOARD_MENU_ITEMS, payload: dashboardMenuItems });
      
      // Create portals (mirrors C# CreateAllPortals logic)
      await createAllPortals(employeeId);
      
      // Handle source-specific logic
      if (source.toUpperCase() === 'AD') {
        if (isReload) {
          // Reload dashboard content by refreshing the dashboard tab
          const dashboardTab = state.tabs.find(tab => tab.id === 'dashboard');
          if (dashboardTab) {
            const updatedTab = {
              ...dashboardTab,
              key: Date.now() // Force reload by changing key
            };
            dispatch({ type: ACTIONS.UPDATE_TAB, payload: updatedTab });
          }
        }
        // Update dashboard menu items to reflect any changes
        dispatch({ type: ACTIONS.SET_DASHBOARD_MENU_ITEMS, payload: dashboardMenuItems });
      } else {
        // Set active tab to dashboard
        dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: 'dashboard' });
      }
      
    } catch (error) {
      console.error('Failed to setup dashboard:', error);
    } finally {
      setDashboardsLoading(false);
    }
  };

  /**
   * Show Dashboard - mirrors C# showDashboard function
   * @param {Object} dashboardItem - Dashboard item with id, title, URL
   * @param {string} loadUrl - URL to load in dashboard
   */
  const showDashboard = async (dashboardItem, loadUrl) => {
    try {
      // Update default dashboard as Selected (only Dashboards)
      if (dashboardItem.id && dashboardItem.id.indexOf("DashBoard_") > -1) {
        const id = dashboardItem.id.replace("DashBoard_", '');
        let refID = null;
        
        if (parseInt(id) < 0) {
          // Find dashboard by ID to get RefID
          const dashboard = state.dashboards.find(d => d.ID.toString() === id);
          if (dashboard) {
            refID = dashboard.RefID;
          }
          if (!refID) {
            console.error("Invalid Analytics Dashboard ID.");
            return;
          }
        }
        
        // Save active dashboard to API
        try {
          const endpoint = `${DASHBOARD_API.SAVE_ACTIVE_DASHBOARD}${id}/${refID || ''}`;
          await dashboardService.saveActiveDashboard(endpoint);
        } catch (error) {
          console.error('Failed to save active dashboard:', error);
        }
      }

      // Don't load the page if the last selection and current URLs are same
      const currentDashboardTab = state.tabs.find(tab => tab.id === 'dashboard');
      if (currentDashboardTab && currentDashboardTab.dashboardUrl === loadUrl) {
        return;
      }

      // Update dashboard tab title and URL
      const updatedDashboardTab = {
        id: 'dashboard',
        title: dashboardItem.title || dashboardItem.DashBoardName || 'Dashboard',
        component: 'Dashboard',
        type: 'component',
        closable: false,
        icon: '',
        dashboardUrl: loadUrl,
        dashboardId: dashboardItem.ID || dashboardItem.id
      };

      // Update the dashboard tab
      const updatedTabs = state.tabs.map(tab => 
        tab.id === 'dashboard' ? updatedDashboardTab : tab
      );
      dispatch({ type: ACTIONS.SET_TABS, payload: updatedTabs });

      // Set dashboard as active tab
      dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: 'dashboard' });

      // Toggle MKM website menu based on URL
      toggleMKMWebsiteMenu(loadUrl);

    } catch (error) {
      console.error('Failed to show dashboard:', error);
    }
  };

  /**
   * Toggle MKM Website Menu - mirrors C# toggleMKMWebsiteMenu function
   * @param {string} currentURL - Current URL to check for MKM
   */
  const toggleMKMWebsiteMenu = (currentURL) => {
    try {
      if (!currentURL) {
        // Hide MKM menu if no URL
        dispatch({ type: ACTIONS.SET_MKM_MENU_VISIBLE, payload: false });
        return;
      }

      const urlLower = currentURL.toLowerCase();
      const isMKM = urlLower.indexOf("ismkm=1") > -1;
      
      // Show/hide MKM menu based on URL
      dispatch({ type: ACTIONS.SET_MKM_MENU_VISIBLE, payload: isMKM });
      
    } catch (error) {
      console.error('Error toggling MKM menu:', error);
      // Hide MKM menu on error
      dispatch({ type: ACTIONS.SET_MKM_MENU_VISIBLE, payload: false });
    }
  };

  /**
   * Create All Portals - mirrors C# CreateAllPortals function
   */
  const createAllPortals = async (employeeId) => {
    try {
      dispatch({ type: ACTIONS.SET_PORTALS_LOADING, payload: true });
      
      // Get all portal information for this user
      const availablePortals = await portalService.getPortalDetails(employeeId);
      
      if (!availablePortals || availablePortals.length <= 0) {
        console.log('No portals available for user');
        return;
      }

      // Store portals in state
      dispatch({ type: ACTIONS.SET_PORTALS, payload: availablePortals });

      // Create portal menu items (matching C# menuDashboard.Items.Add logic)
      const portalMenuItems = availablePortals.map(portal => ({
        id: `portal${portal.PortalIndex}`,
        text: portal.Title,
        title: portal.Title,
        url: `/intranet/Members/Home/Dashboard.aspx?PortalIndex=${portal.PortalIndex}`,
        type: 'portal',
        portalIndex: portal.PortalIndex
      }));
      // Add portal menu items to existing dashboard menu items (matching C# logic)
      const currentMenuItems = state.dashboardMenuItems;      
      // Add separator if there are existing menu items (matching C# MenuSeparator)
      const updatedMenuItems = [...currentMenuItems];
      if (currentMenuItems.length > 0 && portalMenuItems.length > 0) {
        updatedMenuItems.push({
          id: 'separator',
          type: 'separator'
        });
      }      
      // Add portal menu items
      updatedMenuItems.push(...portalMenuItems);      
      // Update dashboard menu items in state
      dispatch({ type: ACTIONS.SET_DASHBOARD_MENU_ITEMS, payload: updatedMenuItems });      
    } catch (error) {
      console.error('Failed to create portals:', error);
    } finally {
      dispatch({ type: ACTIONS.SET_PORTALS_LOADING, payload: false });
    }
  };

  // Load tabs from localStorage
  const loadTabsFromStorage = () => {
    const savedTabs = localStorage.getItem('home-tabs');
    const savedActiveTab = localStorage.getItem('home-active-tab');
    
    if (savedTabs) {
      try {
        const tabs = JSON.parse(savedTabs);
        tabs.forEach(tab => {
          // Only add if not already present (by id)
          if (!state.tabs.some(t => t.id === tab.id)) {
            // Ensure closable property is set correctly for restored tabs
            const restoredTab = {
              ...tab,
              closable: tab.closable !== false // Default to true unless explicitly false
            };
            dispatch({ type: ACTIONS.ADD_TAB, payload: restoredTab });
          }
        });
      } catch (error) {
        console.error('Error loading saved tabs:', error);
      }
    }
    
    if (savedActiveTab) {
      dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: savedActiveTab });
    }
  };

  // Main initialization effect - runs in parallel for speed
  useEffect(() => {
    // Only initialize if session is loaded
    if (!sessionLoaded) return;
    
    const initializeApp = async () => {
      // Clear localStorage first
      localStorage.removeItem('home-tabs');
      localStorage.removeItem('home-active-tab');
      
      // Run all initialization tasks in parallel for faster loading
      await Promise.all([
        SetupNavigation(),     // Load menu data immediately
        setupDashboard(),          // Setup dashboard (replaces loadDashboards)
        setupLogoAndMMIntegration(), // Load logo/MM setup in parallel
        checkTermsAndConditions()   // Check terms in parallel
      ]);
      
      // Load tabs from localStorage after main data is loaded
      loadTabsFromStorage();
      
      // Initialize navigation service with React tab system
      navigationService.initializeWithReactTabs(actions);
    };
    initializeApp();
    
    // Cleanup function
    return () => {
      navigationService.cleanup();
    };
  }, [sessionLoaded]);

  // Save tabs to localStorage when they change
  useEffect(() => {
    localStorage.setItem('home-tabs', JSON.stringify(state.tabs));
    localStorage.setItem('home-active-tab', state.activeTabId);
  }, [state.tabs, state.activeTabId]);

   // Actions
  const addTab = (tabData) => {
    // Handle URL based on whether it contains app or not
    let processedUrl = tabData.url;
    if (tabData.url && tabData.type === 'iframe') {
      // For iframe tabs, use URL as provided
      // - URLs with 'app' are React app routes (keep as is)
      // - URLs without 'app' are legacy ASP.NET routes (use as is)
      processedUrl = tabData.url;
    }

    const newTab = {
      id: tabData.id || `${tabData.type}-${Date.now()}`,
      title: tabData.title,
      component: tabData.component,
      type: tabData.type || 'component',
      closable: tabData.closable !== false,
      icon: tabData.icon || '📄',
      url: processedUrl,
      content: tabData.content
    };
    
    dispatch({ type: ACTIONS.ADD_TAB, payload: newTab });
  };


  const removeTab = (tabId) => {
    dispatch({ type: ACTIONS.REMOVE_TAB, payload: tabId });
  };

  const reorderTabs = (newOrder) => {
    dispatch({ type: ACTIONS.REORDER_TABS, payload: newOrder });
  };

  const setActiveTab = (tabId) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tabId });
  };

  const updateTab = (tabId, updates) => {
    dispatch({ type: ACTIONS.UPDATE_TAB, payload: { id: tabId, ...updates } });
  };

  const toggleHelp = () => {
    dispatch({ type: ACTIONS.TOGGLE_HELP });
  };

  const setHelpPosition = (position) => {
    dispatch({ type: ACTIONS.SET_HELP_POSITION, payload: position });
  };

  const setSessionData = (data) => {
    dispatch({ type: ACTIONS.SET_SESSION_DATA, payload: data });
  };

  const clearSession = () => {
    dispatch({ type: ACTIONS.CLEAR_SESSION });
  };

  const setDashboards = (dashboards) => {
    dispatch({ type: ACTIONS.SET_DASHBOARDS, payload: dashboards });
  };

  const setSelectedDashboard = (dashboard) => {
    dispatch({ type: ACTIONS.SET_SELECTED_DASHBOARD, payload: dashboard });
  };

  const setDashboardsLoading = (loading) => {
    dispatch({ type: ACTIONS.SET_DASHBOARDS_LOADING, payload: loading });
  };

  const setNavigationMenus = (menus) => {
    dispatch({ type: ACTIONS.SET_NAVIGATION_MENUS, payload: menus });
  };

  const setNavigationLoading = (loading) => {
    dispatch({ type: ACTIONS.SET_NAVIGATION_LOADING, payload: loading });
  };

  const showTermsModal = () => {
    dispatch({ type: ACTIONS.SHOW_TERMS_MODAL });
  };

  const hideTermsModal = () => {
    dispatch({ type: ACTIONS.HIDE_TERMS_MODAL });
  };

  const setLogoUrl = (url) => {
    dispatch({ type: ACTIONS.SET_LOGO_URL, payload: url });
  };

  const setMMIntegration = (isMMIntegration) => {
    dispatch({ type: ACTIONS.SET_MM_INTEGRATION, payload: isMMIntegration });
  };

  const setCRMProspecting = (isCRMProspecting) => {
    dispatch({ type: ACTIONS.SET_CRM_PROSPECTING, payload: isCRMProspecting });
  };

  const setPortals = (portals) => {
    dispatch({ type: ACTIONS.SET_PORTALS, payload: portals });
  };

  const setPortalsLoading = (loading) => {
    dispatch({ type: ACTIONS.SET_PORTALS_LOADING, payload: loading });
  };

  const setDashboardMenuItems = (menuItems) => {
    dispatch({ type: ACTIONS.SET_DASHBOARD_MENU_ITEMS, payload: menuItems });
  };

  // Force reload navigation menus
  const reloadNavigationMenus = async () => {
    console.log('🔄 Manually reloading navigation menus...');
    await SetupNavigation();
  };

  // Force full context refresh
  const refreshHomeContext = async () => {
    console.log('🔄 Refreshing entire HomeContext...');
    
    // Run all initialization tasks again
    await Promise.all([
      SetupNavigation(),
      setupDashboard(),
      setupLogoAndMMIntegration(),
      checkTermsAndConditions()
    ]);
  };

  // Get current tabs (for navigation service integration)
  const getTabs = () => {
    return state.tabs;
  };

  // Refresh specific tab (for navigation service integration)
  const refreshTab = (tabId) => {
    const tab = state.tabs.find(t => t.id === tabId);
    if (tab) {
      const updatedTab = {
        ...tab,
        key: Date.now() // Force reload by changing key
      };
      dispatch({ type: ACTIONS.UPDATE_TAB, payload: updatedTab });
    }
  };

  // Close active tab (for navigation service integration)
  const closeActiveTab = () => {
    const activeTab = state.tabs.find(tab => tab.id === state.activeTabId);
    if (activeTab && activeTab.closable !== false) {
      removeTab(state.activeTabId);
    } else {
      console.warn('closeActiveTab: Active tab is not closable or no active tab found');
    }
  };

  const actions = useMemo(() => ({
    addTab,
    removeTab,
    reorderTabs,
    setActiveTab,
    updateTab,
    toggleHelp,
    setHelpPosition,
    setSessionData,
    clearSession,
    setDashboards,
    setSelectedDashboard,
    setDashboardsLoading,
    setNavigationMenus,
    setNavigationLoading,
    showTermsModal,
    hideTermsModal,
    setLogoUrl,
    setMMIntegration,
    setCRMProspecting,
    setPortals,
    setPortalsLoading,
    setDashboardMenuItems,
    reloadNavigationMenus,
    refreshHomeContext,
    setupDashboard,
    showDashboard,
    toggleMKMWebsiteMenu,
    createAllPortals,
    getTabs,
    refreshTab,
    closeActiveTab
  }), [
    addTab,
    removeTab,
    reorderTabs,
    setActiveTab,
    updateTab,
    toggleHelp,
    setHelpPosition,
    setSessionData,
    clearSession,
    setDashboards,
    setSelectedDashboard,
    setDashboardsLoading,
    setNavigationMenus,
    setNavigationLoading,
    showTermsModal,
    hideTermsModal,
    setLogoUrl,
    setMMIntegration,
    setCRMProspecting,
    setPortals,
    setPortalsLoading,
    setDashboardMenuItems,
    reloadNavigationMenus,
    refreshHomeContext,
    setupDashboard,
    showDashboard,
    toggleMKMWebsiteMenu,
    createAllPortals,
    getTabs,
    refreshTab,
    closeActiveTab
  ]);

  const value = {
    ...state,
    actions: actions
  };

  return (
    <HomeContext.Provider value={value}>
      {children}
    </HomeContext.Provider>
  );
};

// Custom hook
export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
}; 