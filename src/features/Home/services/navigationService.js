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
   * Verify if Mirabel Email Service is enabled - matches backend VerifyIsMirabelEmailServiceEnabled exactly
   * @returns {Promise<Object>} Object with isMirabelEmailServiceEnabled, isRepNotificationEnabled, isMirabelEmailTransEnabled
   */
  verifyIsMirabelEmailServiceEnabled: async () => {
    try {
      // Get EmailSenderType, IsRepNotificationsEnabled, IsMirabelEmailTransSendEnabled from sitewide defaults
      const response = await axiosService.post(ADMIN_API.SITEWIDE_SETTINGS_GET_COLUMNNAMES, "EmailSenderType,IsRepNotificationsEnabled,IsMirabelEmailTransSendEnabled");
      if (response?.JSONContent) {
        // Parse the JSONContent string to get the actual data
        const sitewideDefaults = JSON.parse(response.JSONContent);
        
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
        
        const result = {
          isMirabelEmailServiceEnabled,
          isRepNotificationEnabled,
          isMirabelEmailTransEnabled
        };
        
        // Update localStorage MMClientVars with the new values
        navigationService.updateSessionData({
          isMirabelEmailServiceEnabled: isMirabelEmailServiceEnabled,
          isRepNotificationEnabled: isRepNotificationEnabled,
          isMirabelEmailTransEnabled: isMirabelEmailTransEnabled
        });
        
        return result;
      } else {
        return {
          isMirabelEmailServiceEnabled: false,
          isRepNotificationEnabled: false,
          isMirabelEmailTransEnabled: false
        };
      }
    } catch (error) {
      return {
        isMirabelEmailServiceEnabled: false,
        isRepNotificationEnabled: false,
        isMirabelEmailTransEnabled: false
      };
    }
  },

  /**
   * Verify if Call Disposition is enabled - matches backend IsCallDispositionEnabled property exactly
   * @returns {Promise<boolean>} Whether call disposition is enabled
   */
  verifyIsCallDispositionEnabled: async () => {
    try {
      // Get IsCallDispositionEnabled from sitewide defaults
      const response = await axiosService.post(ADMIN_API.SITEWIDE_SETTINGS_GET_COLUMNNAMES, "IsCallDispositionEnabled");
      if (response?.content?.JSONContent) {
        const sitewideDefaults = JSON.parse(response.content.JSONContent);
        const isCallDispositionEnabled = sitewideDefaults.IsCallDispositionEnabled === true || sitewideDefaults.IsCallDispositionEnabled === 'True';
        
        // Update localStorage MMClientVars with the new value
        navigationService.updateSessionData({
          isCallDispositionEnabled: isCallDispositionEnabled
        });
        
        return isCallDispositionEnabled;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  },

  /**
   * Initialize session data with new keys if they don't exist
   * This ensures the new keys are available in localStorage
   */
  initializeSessionData: async () => {
    try {
     
        // Fetch email service settings
        await navigationService.verifyIsMirabelEmailServiceEnabled();
        
        // Fetch call disposition settings
        await navigationService.verifyIsCallDispositionEnabled();
        
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
      const response = await axiosService.get(NAVIGATION_API.ENCRYPTION_KEY);  
      if (response?.Data) {       
        // Decrypt the response data
        const decryptedData = decrypt(response?.Data, authEncryptDecryptKey);    
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
    } catch (error) {
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
      if (response?.List) {
        const menus = response.List;
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
            if (response && response.SessionResponse) {
                const sessionDataResponse = response.SessionResponse;
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
      return !!(response?.Data || response?.content?.Data);
    } catch (error) {
      console.log('Job function check failed:', error);
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
      
      // MKM and MKM-DATA logic
      if (menu.URLSource === 'MKM' || menu.URLSource === 'MKM-DATA') {
        if ((menu.URLSource === 'MKM' && (!sessionVars.IsSiteMKMEnabled || !sessionVars.IsUserHasMKMAccess)) ||
            (menu.URLSource === 'MKM-DATA' && (!sessionVars.IsSiteDataPackEnabled || !sessionVars.IsUserHasDataPackAccess))) {
          isLocked = true;
          lockReason = 'MKM';
        }
      }
      
      // MES logic - matches backend exactly
      if (menu.URLSource === 'MES') {
        // Get email service settings from localStorage - matches backend IsMirabelEmailServiceEnabled property
        const isMirabelEmailServiceEnabled = sessionVars.isMirabelEmailServiceEnabled === true || sessionVars.isMirabelEmailServiceEnabled === 'True';
        const isRepNotificationEnabled = sessionVars.isRepNotificationEnabled === true || sessionVars.isRepNotificationEnabled === 'True';
        
        if ((isMirabelEmailServiceEnabled === false || isRepNotificationEnabled) || !sessionVars.IsUserHasMKMAccess) {
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

   // Helper: recursively build children
    async function buildMenuTree(parentId) {
      const menuPromises = menus
        .filter(menu => menu.ParentID === parentId)
        .map(async menu => {
          // Lock/permission logic
          const { isLocked } = await getMenuLockStatus(menu);
          // Icon class
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
            //Show the Lock Icon for MES links if MES is NOT Enabled OR logged in user has NO access to MKM
            // Get email service settings from localStorage - matches backend IsMirabelEmailServiceEnabled property
            const isMirabelEmailServiceEnabled = sessionVars.isMirabelEmailServiceEnabled === true || sessionVars.isMirabelEmailServiceEnabled === 'True';
            const isRepNotificationEnabled = sessionVars.isRepNotificationEnabled === true || sessionVars.isRepNotificationEnabled === 'True';
            
            if ((isMirabelEmailServiceEnabled === false || isRepNotificationEnabled) || !sessionVars.IsUserHasMKMAccess) {
              if (!(isRepNotificationEnabled && (menu.Caption === 'Email Builder' || menu.Caption === 'Workflows'))) {
                // Lock icon is already handled in getMenuLockStatus
              }
            }
            // URL construction matches server-side: URL = string.Format(EmailServiceSiteURL, URL + (URL.Contains("?") ? "&" : "?"));
            const emailServiceSiteURL = await navigationService.getEmailServiceSiteURL(apiData.EmailServiceSiteURL, sessionVars, menu.URL);
            url = emailServiceSiteURL;
          }           
          // Tooltip
          const toolTip = menu.ToolTip || '';
          // Special click handling
          const isNewWindow = !!menu.IsNewWindow;
          const isCalendar = url && url.toLowerCase().includes(STATIC_URLS.CALENDAR);
          // Children
          const children = await buildMenuTree(menu.ID);
          // Compose menu item
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
        console.warn('⚠️ getSessionDetails: No valid session data found');
        return null;
      }
      
      try {
        const parsed = JSON.parse(sessionData);
        
        // Ensure parsed data is a valid object
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          console.warn('⚠️ getSessionDetails: Session data is not a valid object');
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
        console.log('✅ Session data updated successfully');
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
      console.log('✅ Added tab to home panel:', tabData);
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
    
    console.log('✅ Navigation service initialized with React tab system');
    console.log('🧪 To test URL construction, run: testUrlConstruction()');
  },

  /**
   * Cleanup navigation service
   * This should be called when the Home component unmounts
   */
  cleanup: () => {
    // Remove global references
    delete window.homeActions;
    delete window.menuItemClick;
    delete window.menuItemClickNewWindow;
    delete window.openCalendar;
    delete window.checkAndOpenPageForTablet;
    delete window.addNewTabToHomePanel;
    delete window.getDecodedURI;
    
    console.log('✅ Navigation service cleaned up');
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