import axiosService from '../../../services/axiosService';
import { decrypt, authEncryptDecryptKey, logout } from '../../../utils/authHelpers';
import { NAVIGATION_API, STATIC_URLS, ADMIN_API } from '../../../utils/apiUrls';
import { getTopPath } from '@/utils/commonHelpers';
import { sessionValues } from '@/utils/developmentHelper';
import { CLIENT_TYPE, EMAIL_SENDER } from '@/utils/enums';

/**
 * Navigation service for fetching dynamic navigation menus from the API
 */
export const navigationService = {
  /**
   * Base domain for navigation URLs
   */
  

  /**
   * Cache for API response data
   */
   _apiDataCache: null,

  /**
   * Cache for sitewide settings to prevent duplicate API calls
   */
   _sitewideSettingsCache: null,

  /**
   * Promise cache for API data to prevent race conditions
   */
   _apiDataPromiseCache: null,

  /**
   * Promise cache for sitewide settings to prevent race conditions
   */
   _sitewideSettingsPromiseCache: null,



  /**
   * Verify sitewide settings in a single API call - combines email service and call disposition settings
   * @returns {Promise<Object>} Object with all sitewide settings
   */
  verifySitewideSettings: async () => {
    try {
      // Return cached data if available to prevent duplicate API calls
      if (navigationService._sitewideSettingsCache) {
        return navigationService._sitewideSettingsCache;
      }

      // Return existing promise if API call is already in progress
      if (navigationService._sitewideSettingsPromiseCache) {
        return navigationService._sitewideSettingsPromiseCache;
      }

      // Create new promise for API call
      navigationService._sitewideSettingsPromiseCache = (async () => {
        try {
          // Get all required settings in a single API call
          const response = await axiosService.post(ADMIN_API.SITEWIDE_SETTINGS_GET_COLUMNNAMES, "EmailSenderType,IsRepNotificationsEnabled,IsMirabelEmailTransSendEnabled,IsCallDispositionEnabled");
          
          if (response?.content?.JSONContent) {
            // Parse the JSONContent string to get the actual data
            const sitewideDefaults = JSON.parse(response.content.JSONContent);
            
            // Email service settings
            const isRepNotificationEnabled = sitewideDefaults.IsRepNotificationsEnabled === true || sitewideDefaults.IsRepNotificationsEnabled === 'True';
            const isMirabelEmailTransEnabled = sitewideDefaults.IsMirabelEmailTransSendEnabled === true || sitewideDefaults.IsMirabelEmailTransSendEnabled === 'True';
            
            // EmailSenderType logic - matches backend EmailSenderType function exactly
            const emailSenderType = parseInt(sitewideDefaults.EmailSenderType) || 0;
            const isMKM = true; // We're in MKM context
            
            let emailSender;
            if (isMKM) {
              emailSender = emailSenderType === EMAIL_SENDER.MAILCHIMP_PLUS_MKM ? EMAIL_SENDER.MIRABEL_EMAIL : emailSenderType;
            } else {
              emailSender = emailSenderType === EMAIL_SENDER.MAILCHIMP_PLUS_MKM ? EMAIL_SENDER.MAILCHIMP : emailSenderType;
            }
            
            // Determine if Mirabel Email Service is enabled - matches backend logic exactly
            const isMirabelEmailServiceEnabled = emailSender === EMAIL_SENDER.MIRABEL_EMAIL || isRepNotificationEnabled;
            
            // Call disposition settings
            const isCallDispositionEnabled = sitewideDefaults.IsCallDispositionEnabled === true || sitewideDefaults.IsCallDispositionEnabled === 'True';
            
            const result = {
              isMirabelEmailServiceEnabled,
              isRepNotificationEnabled,
              isMirabelEmailTransEnabled,
              isCallDispositionEnabled
            };
            
            // Update localStorage MMClientVars with all the new values in a single call
            navigationService.updateSessionData({
              isMirabelEmailServiceEnabled: isMirabelEmailServiceEnabled,
              isRepNotificationEnabled: isRepNotificationEnabled,
              isMirabelEmailTransEnabled: isMirabelEmailTransEnabled,
              isCallDispositionEnabled: isCallDispositionEnabled
            });
            
            // Cache the result to prevent duplicate API calls
            navigationService._sitewideSettingsCache = result;
            
            return result;
          } else {
            const defaultResult = {
              isMirabelEmailServiceEnabled: false,
              isRepNotificationEnabled: false,
              isMirabelEmailTransEnabled: false,
              isCallDispositionEnabled: false
            };
            
            // Cache the default result as well
            navigationService._sitewideSettingsCache = defaultResult;
            
            return defaultResult;
          }
        } finally {
          // Clear the promise cache after completion (success or error)
          navigationService._sitewideSettingsPromiseCache = null;
        }
      })();

      return navigationService._sitewideSettingsPromiseCache;
    } catch (error) {
      // Clear promise cache on error
      navigationService._sitewideSettingsPromiseCache = null;
      throw error;
    }
  },

  /**
   * Verify if Mirabel Email Service is enabled - matches backend VerifyIsMirabelEmailServiceEnabled exactly
   * @returns {Promise<Object>} Object with isMirabelEmailServiceEnabled, isRepNotificationEnabled, isMirabelEmailTransEnabled
   */
  verifyIsMirabelEmailServiceEnabled: async () => {
    const settings = await navigationService.verifySitewideSettings();
    return {
      isMirabelEmailServiceEnabled: settings.isMirabelEmailServiceEnabled,
      isRepNotificationEnabled: settings.isRepNotificationEnabled,
      isMirabelEmailTransEnabled: settings.isMirabelEmailTransEnabled
    };
  },

  /**
   * Verify if Call Disposition is enabled - matches backend IsCallDispositionEnabled property exactly
   * @returns {Promise<boolean>} Whether call disposition is enabled
   */
  verifyIsCallDispositionEnabled: async () => {
    const settings = await navigationService.verifySitewideSettings();
    return settings.isCallDispositionEnabled;
  },

  /**
   * Initialize session data with new keys if they don't exist
   * This ensures the new keys are available in localStorage
   */
  initializeSessionData: async () => {
    try {
      // Fetch all sitewide settings in a single API call
      await navigationService.verifySitewideSettings();
    } catch (error) {
      console.error('❌ Error initializing session data:', error);
    }
  },

  /**
   * Fetch and decrypt API data for MarketingManagerSiteURL and EmailServiceSiteURL
   * @returns {Promise<Object>} Decrypted API data
   */
  fetchApiData: async () => {
    try {
      // Return cached data if available
      if (navigationService._apiDataCache) {
        return navigationService._apiDataCache;
      }

      // Return existing promise if API call is already in progress
      if (navigationService._apiDataPromiseCache) {
        return navigationService._apiDataPromiseCache;
      }

      // Create new promise for API call
      navigationService._apiDataPromiseCache = (async () => {
        try {
          const response = await axiosService.get(NAVIGATION_API.ENCRYPTION_KEY);  
          if (response?.content?.Data) {       
            // Decrypt the response data
            const decryptedData = decrypt(response?.content?.Data, authEncryptDecryptKey);    
            if (decryptedData && decryptedData.trim() !== '') {
              try {
                const data = JSON.parse(decryptedData);
                // Cache the data
                navigationService._apiDataCache = data;
                
                return data;
              } catch (parseError) {
                throw new Error('Failed to parse decrypted data as JSON');
              }
            } else {
              throw new Error('Decryption failed - returned empty data');
            }
          } else {
            throw new Error('Invalid API response structure - missing content.Data');
          }
        } finally {
          // Clear the promise cache after completion (success or error)
          navigationService._apiDataPromiseCache = null;
        }
      })();

      return navigationService._apiDataPromiseCache;
    } catch (error) {
      // Clear promise cache on error
      navigationService._apiDataPromiseCache = null;
      throw error;
    }
  },


  /**
   * Fetch navigation data from the API
   * @param {number} userId - User ID (default: 1)
   * @param {number} siteId - Site ID (default: 0)
   * @returns {Promise<Array>} Array of navigation menu objects
   */
  fetchNavigationData: async (userId = 1, siteId = 0) => {
    try {     
      // Then fetch navigation menus
      const response = await axiosService.get(`${NAVIGATION_API.USER_MENUS}/${userId}/${siteId}`);        
    
      // Check if response has the expected structure
      if (response?.content?.List) {
        const menus = response.content.List;
        const processedMenus = await navigationService.processNavigationMenus(menus);      
        return processedMenus;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  },

  /**
   * Load session details and store in localStorage with transformed format
   * @returns {Promise<Object>} Session details response
   */
    loadSessionDetails: async () => {
        try {
            const response = await axiosService.get(NAVIGATION_API.SESSION_DETAILS, { withCredentials: true });          
            if (response && response.content?.SessionResponse) {
                const sessionDataResponse = response.content.SessionResponse;
                // Validate session data before storing
                if (typeof sessionDataResponse === 'object' && sessionDataResponse !== null) {
                    try {
                        // Store session data safely
                        localStorage.setItem('MMClientVars', JSON.stringify(sessionDataResponse));
                        return sessionDataResponse;
                    } catch (storageError) {
                        return sessionDataResponse; // Return data even if storage fails
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }         
        } catch (error) {           
            // Fallback to sessionValues if available
            if (typeof sessionValues !== 'undefined' && sessionValues) {
                try {
                    localStorage.setItem('MMClientVars', JSON.stringify(sessionValues));
                    return sessionValues;
                } catch (storageError) {
                    return sessionValues;
                }
            }
            return null;
        }
    },

  /**
   * Check job function condition for a user
   * @param {number} userId - User ID to check
   * @returns {Promise<boolean>} Whether job function notification should be shown
   */
  checkJobFunctionCondition: async (userId) => {
    try {
     
      const response = await axiosService.get(`/services/User/Accounts/CheckCondition/${userId}/-1`);
      console.log('CheckJobFunctionCondition Response:'+response?.content.Data);
      
      return !!(response?.content.Data);
    } catch (error) {
      console.log('error CheckJobFunctionCondition Response:'+response?.content);
      return false;
    }
  },

  /**
   * Get MarketingManagerSiteURL - matches backend logic exactly
   * @param {string} mkmSiteURL - Base MKM site URL
   * @param {Object} sessionVars - Optional session variables to reuse
   * @param {string} url - The menu URL to append
   * @returns {Promise<string>} Constructed MKM URL
   */
  getMarketingManagerSiteURL: async (mkmSiteURL='',sessionVars=null,url='') => {
    try {
      const isSiteMKMEnabled = sessionVars.IsSiteMKMEnabled === true || sessionVars.IsSiteMKMEnabled === 'True';
      const isUserHasMKMAccess = sessionVars.IsUserHasMKMAccess === true || sessionVars.IsUserHasMKMAccess === 'True';
      const isSiteDataPackEnabled = sessionVars.IsSiteDataPackEnabled === true || sessionVars.IsSiteDataPackEnabled === 'True';
      const isUserHasDataPackAccess = sessionVars.IsUserHasDataPackAccess === true || sessionVars.IsUserHasDataPackAccess === 'True';      
      const urlWithQuery = url + (url.includes("?") ? "&" : "?");
      const mkmURL = `${mkmSiteURL}${urlWithQuery}ISMKM=1&FE=${isSiteMKMEnabled ? "1" : "0"}&MKMFE=${isSiteMKMEnabled ? "1" : "0"}&MKMUA=${isUserHasMKMAccess ? "1" : "0"}&DPFE=${isSiteDataPackEnabled ? "1" : "0"}&DPUA=${isUserHasDataPackAccess ? "1" : "0"}`;
      return mkmURL;
    } catch (error) {
      console.error('❌ Error getting MarketingManagerSiteURL:', error);
      return '';
    }
  },


  /**
   * Get EmailServiceSiteURL - matches backend logic exactly
   * @param {string} emailServiceSiteURL - Base email service site URL
   * @param {Object} sessionVars - Optional session variables to reuse
   * @param {string} url - The menu URL to append
   * @returns {Promise<string>} Constructed MES URL
   */
  getEmailServiceSiteURL: async (emailServiceSiteURL='',sessionVars=null,url='') => {
    try {
      // Get email service settings from localStorage - matches backend IsMirabelEmailServiceEnabled property
      const isMirabelEmailServiceEnabled = sessionVars.isMirabelEmailServiceEnabled === true || sessionVars.isMirabelEmailServiceEnabled === 'True';
      
      const isUserHasMKMAccess = sessionVars.IsUserHasMKMAccess === true || sessionVars.IsUserHasMKMAccess === 'True';
      const urlWithQuery = url + (url.includes("?") ? "&" : "?");
      const mesSiteURL = `${emailServiceSiteURL}${urlWithQuery}ISMKM=1&ISMES=1&FE=${isMirabelEmailServiceEnabled ? "1" : "0"}&ESFE=${isMirabelEmailServiceEnabled ? "1" : "0"}&MKMUA=${isUserHasMKMAccess ? "1" : "0"}`;
      return mesSiteURL;
    } catch (error) {
      console.error('❌ Error getting EmailServiceSiteURL:', error);
      return '';
    }
  },

  /**
   * Recursively build menu tree for unlimited depth
   */
  processNavigationMenus: async (menus, apiData = null) => {
    if (!Array.isArray(menus) || menus.length === 0) {
      return [];
    }
    
    // Initialize session data with new keys if needed
    await navigationService.initializeSessionData();

    // Get session data from localStorage (MMClientVars)
    let sessionVars = {};
    try {
      const rawSessionData = localStorage.getItem('MMClientVars');     
      if (rawSessionData && rawSessionData !== 'null' && rawSessionData !== 'undefined') {
        try {
          sessionVars = JSON.parse(rawSessionData);
          if (typeof sessionVars !== 'object' || sessionVars === null || Array.isArray(sessionVars)) {
            sessionVars = {};
          }
        } catch (parseError) {
          sessionVars = {};
        }
      } else {
        sessionVars = {};
      }
    } catch (e) {      
      sessionVars = {};
    }

    // Fetch API data for MKM/MES URLs if not provided
    if (!apiData) {
      try {
        apiData = await navigationService.fetchApiData();
      } catch (error) {
        apiData = {};
      }
    }

    // Helper: Replace {{MM_SOMETHING}} in URL with sessionVars - matches backend logic exactly
    function replaceSessionVarsInUrl(url) {
      if (!url || typeof url !== 'string') return url;
      
      // Decode URL first as backend does
      let decodedURL = decodeURIComponent(url);
      
      // Find all {{MM_*}} placeholders
      const matches = decodedURL.match(/\{\{(MM_.*?)\}\}/g);
      if (!matches) return url;
      
      let processedURL = decodedURL;
      matches.forEach(match => {
        const sessionVarKey = match.replace('{{', '').replace('}}', '').replace('MM_', '');
        if (sessionVars[sessionVarKey] !== undefined) {
          processedURL = processedURL.replace(match, sessionVars[sessionVarKey]);
        }
      });
      
      return processedURL;
    }

    // Helper: Permission/lock icon logic - matches backend logic exactly
    async function getMenuLockStatus(menu) {
      let isLocked = false;
      let lockReason = '';
      
      // Call Disposition Report - check first as backend does
      if (menu.Caption === 'Call Disposition Report' || menu.URL === '/ui/Reports/CallDisposition') {
        // Get call disposition settings from localStorage - matches backend IsCallDispositionEnabled property
        const isCallDispositionEnabled = sessionVars.isCallDispositionEnabled === true || sessionVars.isCallDispositionEnabled === 'True';
        if (!isCallDispositionEnabled) {
          isLocked = true;
          lockReason = 'CallDisposition';
        }
      }
      
      // MKM and MKM-DATA logic - matches server-side exactly
      const urlSource = (menu.URLSource || '').toString().toUpperCase();
      if (urlSource === CLIENT_TYPE.MKM || urlSource === "MKM-DATA") {
        if ((urlSource === CLIENT_TYPE.MKM && (!sessionVars.IsSiteMKMEnabled || !sessionVars.IsUserHasMKMAccess)) ||
            (urlSource === "MKM-DATA" && (!sessionVars.IsSiteDataPackEnabled || !sessionVars.IsUserHasDataPackAccess))) {
          isLocked = true;
          lockReason = 'MKM';
        }
      }
      
      // MES logic - matches backend exactly
      if (urlSource === "MES") {
        // Get email service settings from localStorage - matches backend IsMirabelEmailServiceEnabled property
        const isMirabelEmailServiceEnabled = sessionVars.isMirabelEmailServiceEnabled === true || sessionVars.isMirabelEmailServiceEnabled === 'True';
        const isRepNotificationEnabled = sessionVars.isRepNotificationEnabled === true || sessionVars.isRepNotificationEnabled === 'True';
        
        // Matches server-side logic exactly: (IsMirabelEmailServiceEnabled == false || (isRepNotificationEnabled)) || SessionManager.IsUserHasMKMAccess == false
        if ((isMirabelEmailServiceEnabled === false || (isRepNotificationEnabled)) || !sessionVars.IsUserHasMKMAccess) {
          if (!(isRepNotificationEnabled && (menu.Caption === 'Email Builder' || menu.Caption === 'Workflows'))) {
            isLocked = true;
            lockReason = 'MES';
          }
        }
      }
      
      return { isLocked, lockReason };
    }

    // Helper: icon class logic - matches backend exactly
    function getIconClass(menu, isLocked) {
      if (isLocked) return 'mainMenuIcon lockIcon';
      if (menu.Icon === 'New') return 'mainMenuIcon newFeatureIcon';
      if (menu.Icon === 'Beta') return 'mainMenuIcon betaFeatureIcon';
      return menu.IconCls || '';
    }



   // Helper: recursively build children - matches server-side CreateMenu function exactly
    async function buildMenuTree(parentId) {
      const menuPromises = menus
        .filter(menu => menu.ParentID === parentId)
        .map(async menu => {
          // Lock/permission logic - matches server-side exactly
          const { isLocked } = await getMenuLockStatus(menu);
          
          // Icon class - matches server-side logic exactly
          const iconCls = getIconClass(menu, isLocked);
          
          // URL replacement
          let url = replaceSessionVarsInUrl(menu.URL);
          
          // Special URL handling for MKM/MES - matches backend exactly
          const urlSource = (menu.URLSource || '').toString().toUpperCase();
          if (urlSource === CLIENT_TYPE.MKM || urlSource === "MKM-DATA") {
            // URL construction matches server-side: URL = string.Format(MarketingManagerSiteURL, URL + (URL.Contains("?") ? "&" : "?"));
            const marketingManagerSiteURL = await navigationService.getMarketingManagerSiteURL(apiData.MarketingManagerURL, sessionVars, menu.URL);
            url = marketingManagerSiteURL;
          } else if (urlSource === "MES") {
            // URL construction matches server-side: URL = string.Format(EmailServiceSiteURL, URL + (URL.Contains("?") ? "&" : "?"));
            const emailServiceSiteURL = await navigationService.getEmailServiceSiteURL(apiData.EmailServiceSiteURL, sessionVars, menu.URL);
            url = emailServiceSiteURL;
          }               
          // Tooltip
          const toolTip = menu.ToolTip || '';
          // Special click handling
          const isNewWindow = !!menu.IsNewWindow;
          const isCalendar = url && url.toLowerCase().includes(STATIC_URLS.CALENDAR);
          
          // Children - recursively build submenus
          const children = await buildMenuTree(menu.ID);
          
          // Compose menu item - matches server-side CreateMenu function exactly
          return {
            id: menu.ID,
            title: menu.Caption,
            url,
            sortOrder: menu.SortOrder,
            isAdmin: menu.IsAdmin,
            isNewWindow: !!menu.IsNewWindow,
            isVisible: menu.IsVisible,
            icon: menu.Icon,
            iconCls,
            toolTip,
            isLocked,
            isCalendar,
            urlSource: menu.URLSource,
            children,
            fullUrl: navigationService.getFullUrl(url),
            // Additional properties to match server-side CreateMenu function
            caption: menu.Caption,
            toolTip: menu.ToolTip || '',
            iconClass: iconCls,
            hideOnClick: children.length > 0 ? false : true,
            menuHideDelay: children.length > 0 ? 0 : 1000
          };
        });
      
      return Promise.all(menuPromises);
    }

    const topLevelMenus1 = await buildMenuTree(-1);
    const topLevelMenus2 = await buildMenuTree(null);
    const finalMenus = topLevelMenus1.concat(topLevelMenus2);
    return finalMenus;
  },

  /**
   * Get full URL by combining base domain with relative URL
   * @param {string} relativeUrl - Relative URL from API
   * @returns {string} Full URL
   */
  getFullUrl: (relativeUrl) => {
    if (!relativeUrl || relativeUrl === '') {
      return '';
    }
    
    // If already a full URL, return as is
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl;
    }
    
    // Combine with base domain
    const baseUrl = getTopPath();
    const url = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
    return `${baseUrl}${url}`;
  },

  /**
   * Filter visible menus based on user permissions
   * @param {Array} menus - Navigation menus
   * @param {boolean} isAdmin - Whether user is admin
   * @returns {Array} Filtered menus
   */
  filterVisibleMenus: (menus, isAdmin = false) => {
    return menus.filter(menu => {
      if (!menu.IsVisible) return false;
      if (menu.IsAdmin && !isAdmin) return false;
      
      // Filter children as well
      if (menu.children) {
        menu.children = menu.children.filter(child => {
          if (!child.IsVisible) return false;
          if (child.IsAdmin && !isAdmin) return false;
          return true;
        });
      }
      
      return true;
    });
  },

  /**
   * Get session details from localStorage
   * @returns {Object|null} Session details or null
   */
  getSessionDetails: () => {
    try {
      const sessionData = localStorage.getItem('MMClientVars');
      
      if (!sessionData || sessionData === 'null' || sessionData === 'undefined') {
      
        return null;
      }
      
      try {
        const parsed = JSON.parse(sessionData);
        
        // Ensure parsed data is a valid object
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        
          return null;
        }
        
        return parsed;
      } catch (parseError) {
        console.error('⚠️ getSessionDetails: Error parsing session data JSON:', parseError);
        // Try to clear corrupted data
        localStorage.removeItem('MMClientVars');
        return null;
      }
    } catch (error) {
      console.error('⚠️ getSessionDetails: Error accessing localStorage:', error);
      return null;
    }
  },

  /**
   * Update session data in localStorage
   * @param {Object} updates - Updates to apply to session data
   * @returns {Object} Updated session data
   */
  updateSessionData: (updates) => {
    try {
      if (!updates || typeof updates !== 'object') {
        console.warn('⚠️ updateSessionData: Invalid updates provided');
        return null;
      }
      
      const existing = navigationService.getSessionDetails() || {};
      const updated = { ...existing, ...updates };
      
      try {
        localStorage.setItem('MMClientVars', JSON.stringify(updated));
       
        return updated;
      } catch (storageError) {
        console.error('❌ Error storing session data:', storageError);
        return null;
      }
    } catch (error) {
      console.error('❌ Error updating session data:', error);
      return null;
    }
  },

  /**
   * Menu click handlers - matches backend JavaScript functions
   */
  menuItemClick: (pageURL, caption) => {
    // Decode URL
    const decodedURL = decodeURIComponent(pageURL);
    
    // Check if it's a tablet/phone
    const isTabletOrPhone = navigationService.checkAndOpenPageForTablet(decodedURL, caption);
    
    if (!isTabletOrPhone) {
      // Add new tab to home panel
      navigationService.addNewTabToHomePanel(decodedURL, caption);
    }
  },

  menuItemClickNewWindow: (pageURL) => {
    // Decode URL
    const decodedURL = decodeURIComponent(pageURL);
    
    // Open in new window
    window.open(decodedURL, '_blank', '');
  },

  openCalendar: (url) => {
    // Decode URL
    const decodedURL = decodeURIComponent(url);
    
    // Check if it's a tablet/phone
    const isTabletOrPhone = navigationService.checkAndOpenPageForTablet(decodedURL, 'Calendar');
    
    if (!isTabletOrPhone) {
      // Check if calendar tab already exists using React tab system
      if (window.homeActions) {
        const existingTabs = window.homeActions.getTabs ? window.homeActions.getTabs() : [];
        const existingCalendarTab = existingTabs.find(tab => tab.id === 'TabCalendar');
        
        if (existingCalendarTab) {
          // Calendar tab already open - activate it
          window.homeActions.setActiveTab('TabCalendar');
          // Refresh the calendar content
          if (window.homeActions.refreshTab) {
            window.homeActions.refreshTab('TabCalendar');
          }
        } else {
          // Create new calendar tab
          const calendarTabData = {
            id: 'TabCalendar',
            title: 'Calendar',
            url: decodedURL,
            type: 'iframe',
            icon: '📅',
            closable: true
          };
          window.homeActions.addTab(calendarTabData);
          window.homeActions.setActiveTab('TabCalendar');
        }
      } else {
        // Fallback to opening in new window if home actions not available
        window.open(decodedURL, '_blank', '');
      }
    }
  },

  /**
   * Check if device is tablet/phone and handle accordingly
   * @param {string} url - URL to open
   * @param {string} caption - Page caption
   * @returns {boolean} True if handled for tablet/phone
   */
  checkAndOpenPageForTablet: (url, caption) => {
    // Get tablet/phone status from session or detect
    let isTabletOrPhone = false;
    
    try {
      const mmClientVars = JSON.parse(localStorage.getItem('MMClientVars') || '{}');
      isTabletOrPhone = mmClientVars.isTabletOrPhone === 'True' || mmClientVars.isTabletOrPhone === true;
    } catch (error) {
      // Fallback to user agent detection
      isTabletOrPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    if (isTabletOrPhone) {
      // For tablet/phone, open in new window
      window.open(url, '_blank', '');
      return true;
    }
    
    return false;
  },

  /**
   * Add new tab to home panel - integrates with React tab system
   * @param {string} url - URL to open
   * @param {string} caption - Tab caption
   */
  addNewTabToHomePanel: (url, caption) => {
    if (window.homeActions && window.homeActions.addTab) {
      // Use React tab system
      const tabData = {
        title: caption || 'New Tab',
        url: url,
        type: 'iframe',
        icon: '',
        closable: true
      };
      
      window.homeActions.addTab(tabData);
     
    } else {
      // Fallback to opening in new window
      console.warn('⚠️ Home actions not available, opening in new window');
      window.open(url, '_blank', '');
    }
  },

  /**
   * Get decoded URI - matches backend getDecodedURI function
   * @param {string} url - URL to decode
   * @returns {string} Decoded URL
   */
  getDecodedURI: (url) => {
    try {
      return decodeURIComponent(url);
    } catch (e) {
      console.warn('Error decoding URI:', e);
      return url;
    }
  },

   /**
   * Initialize navigation service with React tab system
   * This should be called when the Home component mounts
   * @param {Object} homeActions - The actions object from HomeContext
   */
  initializeWithReactTabs: (homeActions) => {
    // Store home actions globally for access by navigation functions
    window.homeActions = homeActions;
    
    // Expose navigation functions globally to match server-side behavior
    window.menuItemClick = navigationService.menuItemClick;
    window.menuItemClickNewWindow = navigationService.menuItemClickNewWindow;
    window.openCalendar = navigationService.openCalendar;
    window.checkAndOpenPageForTablet = navigationService.checkAndOpenPageForTablet;
    window.addNewTabToHomePanel = navigationService.addNewTabToHomePanel;
    window.getDecodedURI = navigationService.getDecodedURI;
    
    // Expose test function for URL construction verification
    window.testUrlConstruction = navigationService.testUrlConstruction;
      

  },

  /**
   * Clear sitewide settings cache
   * This can be called to force a refresh of sitewide settings
   */
  clearSitewideSettingsCache: () => {
    navigationService._sitewideSettingsCache = null;
    navigationService._sitewideSettingsPromiseCache = null;
  
  },

  /**
   * Clear API data cache
   * This can be called to force a refresh of API data
   */
  clearApiDataCache: () => {
    navigationService._apiDataCache = null;
    navigationService._apiDataPromiseCache = null;

  },

  /**
   * Cleanup navigation service
   * This should be called when the Home component unmounts
   */
  cleanup: () => {
    // Clear all caches
    navigationService._apiDataCache = null;
    navigationService._apiDataPromiseCache = null;
    navigationService._sitewideSettingsCache = null;
    navigationService._sitewideSettingsPromiseCache = null;
    
    // Remove global references
    delete window.homeActions;
    delete window.menuItemClick;
    delete window.menuItemClickNewWindow;
    delete window.openCalendar;
    delete window.checkAndOpenPageForTablet;
    delete window.addNewTabToHomePanel;
    delete window.getDecodedURI;
    
   
  },

getSessionValue: (key) => {
  try {
    const mmClientVarsRaw = JSON.parse(localStorage.getItem("MMClientVars"));
    if (!mmClientVarsRaw) return '';
    return mmClientVarsRaw && mmClientVarsRaw[key] !== undefined && mmClientVarsRaw[key] !== null ? String(mmClientVarsRaw[key]) : '';
  } catch {
    return '';
  }
  }
};

export default navigationService; 