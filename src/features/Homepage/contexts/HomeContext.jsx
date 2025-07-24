import React, { createContext, useContext, useReducer, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import navigationService from '../services/navigationService';
import { termsAndConditionsService } from '../services/termsAndConditionsService';

const HomeContext = createContext();

// Action types
const ACTIONS = {
  ADD_TAB: 'ADD_TAB',
  REMOVE_TAB: 'REMOVE_TAB',
  REORDER_TABS: 'REORDER_TABS',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
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
  SET_CRM_PROSPECTING: 'SET_CRM_PROSPECTING'
};

// Initial state
const initialState = {
  tabs: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      component: 'Dashboard',
      type: 'component',
      closable: false,
      icon: '📊'
    },
    {
      id: 'inbox',
      title: 'Inbox',
      component: 'Inbox',
      type: 'iframe',
      url: (typeof window !== 'undefined' ? window.location.origin : '') + '/intranet/Members/Home/InboxNotifications.aspx',
      closable: false,
      icon: '📥'
    },
    {
      id: 'search',
      title: 'Search',
      component: 'Search',
      type: 'iframe',
      url:  (typeof window !== 'undefined' ? window.location.origin : '') + '/ui/Search',
      closable: false,
      icon: '🔍'
    }
  ],
  activeTabId: 'dashboard',
  helpVisible: false,
  helpPosition: { x: typeof window !== 'undefined' ? window.innerWidth - 100 : 1320, y: typeof window !== 'undefined' ? window.innerHeight - 100 : 620 },
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
  isCRMProspecting: false
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
      const newActiveTab = state.activeTabId === action.payload 
        ? (filteredTabs[filteredTabs.length - 1]?.id || 'dashboard')
        : state.activeTabId;
      
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
    
    default:
      return state;
  }
};

// Provider component
export const HomeProvider = ({ children }) => {
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

      // Helper to insert menu URL at {0} placeholder
      function insertMenuUrlAtPlaceholder(baseUrl, menuUrl) {
        if (!baseUrl || !menuUrl) return baseUrl || menuUrl;
        const urlWithQuery = menuUrl + (menuUrl.includes('?') ? '&' : '?');
        if (baseUrl.includes('{0}')) {
          return baseUrl.replace('{0}', urlWithQuery);
        }
        return baseUrl.replace(/\/$/, '') + '/' + menuUrl.replace(/^\//, '');
      }

      // MM Integration iframe src (matching legacy ASP.NET)
      let mmIntegrationSrc = null;
      if (showMMIntegration && mmClientVars.Token) {
        try {
          // Fetch MarketingManagerSiteURL from API (robust approach)
          const marketingManagerSiteURL = await navigationService.getMarketingManagerSiteURL();
          if (marketingManagerSiteURL) {
            mmIntegrationSrc = insertMenuUrlAtPlaceholder(marketingManagerSiteURL, '/AssignData.aspx?') + '&accesstoken=' + mmClientVars.Token;
          }
        } catch (error) {
          console.error('Error fetching MarketingManagerSiteURL:', error);
          // Fallback to localStorage if API fails
          if (mmClientVars.MarketingManagerSiteURL) {
            mmIntegrationSrc = insertMenuUrlAtPlaceholder(mmClientVars.MarketingManagerSiteURL, '/AssignData.aspx?') + '&accesstoken=' + mmClientVars.Token;
          }
        }
      }

      // CRM Prospecting panel (matching legacy ASP.NET)
      let crmProspectingUrl = null;
      const showProspecting = isCRM && mmClientVars.IsUserHasDataPackAccess === true;
      
      if (showProspecting) {
        try {
          // Fetch MarketingManagerSiteURL from API (robust approach)
          const marketingManagerSiteURL = await navigationService.getMarketingManagerSiteURL();
          if (marketingManagerSiteURL) {
            crmProspectingUrl = insertMenuUrlAtPlaceholder(marketingManagerSiteURL, '/midashboard.aspx?');
          }
        } catch (error) {
          console.error('Error fetching MarketingManagerSiteURL for prospecting:', error);
          // Fallback to localStorage if API fails
          if (mmClientVars.MarketingManagerSiteURL) {
            crmProspectingUrl = insertMenuUrlAtPlaceholder(mmClientVars.MarketingManagerSiteURL, '/midashboard.aspx?');
          }
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

  // Load navigation menus
  const loadNavigationMenus = async () => {
    try {
      const clientDetails = localStorage.getItem("MMClientVars");
      let cultureUI = "en-US"; // Default value
      let siteType = "TMM"; // Default value
      let navBarType = 0; // Default to General
      let userId = 1; // Default to General
      
      if (clientDetails) {
        try {
          const clientVars = JSON.parse(clientDetails);
          cultureUI = clientVars.cultureUI || cultureUI;
          siteType = clientVars.siteType || siteType;
          userId = clientVars.UserID || userId;
          
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
          console.error("Error parsing client variables:", error);
        }
      }
      const menus = await navigationService.fetchNavigationData(userId, navBarType);
      setNavigationMenus(menus);
      
      // Setup logo and MM/MKM integration after navigation (matching legacy ASP.NET pattern)
      await setupLogoAndMMIntegration();
      
      await checkTermsAndConditions();
    } catch (error) {
      console.error('Error loading navigation menus:', error);
    }
  };

  // Load dashboards
  const loadDashboards = async () => {
    try {
      setDashboardsLoading(true);
      const dashboards = await dashboardService.getDashboards();
      const activeDashboards = dashboardService.getActiveDashboards(dashboards);
      setDashboards(activeDashboards);
      
      // Set default dashboard
      const defaultDashboard = dashboardService.getDefaultDashboard(activeDashboards);
      if (defaultDashboard) {
        setSelectedDashboard(defaultDashboard);
      }
    } catch (error) {
      console.error('Failed to load dashboards:', error);
    } finally {
      setDashboardsLoading(false);
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

  // Main initialization effect - runs in sequence
  useEffect(() => {
    const initializeApp = async () => {
      // Clear localStorage first
      localStorage.removeItem('home-tabs');
      localStorage.removeItem('home-active-tab');
      
      // 1. Load navigation menus first (as requested)
      await loadNavigationMenus();
      
      // 2. Load dashboards
      await loadDashboards();
      
      // 3. Load tabs from localStorage last
      loadTabsFromStorage();
    };

    initializeApp();
  }, []);

  // Save tabs to localStorage when they change
  useEffect(() => {
    localStorage.setItem('home-tabs', JSON.stringify(state.tabs));
    localStorage.setItem('home-active-tab', state.activeTabId);
  }, [state.tabs, state.activeTabId]);

  // Actions
  const addTab = (tabData) => {
    // Handle URL based on whether it contains ui60 or not
    let processedUrl = tabData.url;
    if (tabData.url && tabData.type === 'iframe') {
      // For iframe tabs, use URL as provided
      // - URLs with 'ui60' are React app routes (keep as is)
      // - URLs without 'ui60' are legacy ASP.NET routes (use as is)
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
    const tab = state.tabs.find(t => t.id === tabId);
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

  const value = {
    ...state,
    actions: {
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
      setCRMProspecting
    }
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