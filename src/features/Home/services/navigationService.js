import axiosService from '../../../services/axiosService';
import { decrypt, authEncryptDecryptKey, logout } from '../../../utils/authHelpers';
import { NAVIGATION_API, STATIC_URLS } from '../../../utils/apiUrls';
import { getTopPath } from '@/utils/commonHelpers';
import { sessionValues } from '@/utils/developmentHelper';

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
      if (response?.content?.Data) {       
        // Decrypt the response data
        const decryptedData = decrypt(response.content.Data, authEncryptDecryptKey);    
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
      console.log('🔍 Fetching navigation data for userId:', userId, 'siteId:', siteId);
      
      // Then fetch navigation menus
      const response = await axiosService.get(`${NAVIGATION_API.USER_MENUS}/${userId}/${siteId}`);        
      console.log('🔍 Navigation API response:', response);
      
      // Check if response has the expected structure
      if (response?.List) {
        const menus = response.List;
        console.log('🔍 Raw navigation menus from API:', menus.length, menus);
        console.log('🔍 First few menu items:', menus.slice(0, 3));
        
        const processedMenus = await navigationService.processNavigationMenus(menus);
        console.log('🔍 Processed navigation menus:', processedMenus.length, processedMenus);
        console.log('🔍 First processed menu:', processedMenus[0]);
        
        return processedMenus;
      } else {
        console.warn('⚠️ Navigation API response missing content.List:', response);
        console.log('🔍 Full response structure:', JSON.stringify(response, null, 2));
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching navigation data:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
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
   * @returns {Promise<string>} Constructed MKM URL
   */
  getMarketingManagerSiteURL: async () => {
    try {
      // Get API data for base URL
      const apiData = await navigationService.fetchApiData();
      const marketingManagerURL = apiData.MarketingManagerURL || '';
      
      // Get session data for parameters
      const sessionVars = navigationService.getSessionDetails() || {};
      const isSiteMKMEnabled = sessionVars.IsSiteMKMEnabled === true || sessionVars.IsSiteMKMEnabled === 'True';
      const isUserHasMKMAccess = sessionVars.IsUserHasMKMAccess === true || sessionVars.IsUserHasMKMAccess === 'True';
      const isSiteDataPackEnabled = sessionVars.IsSiteDataPackEnabled === true || sessionVars.IsSiteDataPackEnabled === 'True';
      const isUserHasDataPackAccess = sessionVars.IsUserHasDataPackAccess === true || sessionVars.IsUserHasDataPackAccess === 'True';
      
      // Construct URL exactly as backend does
      const mkmSiteURL = `${marketingManagerURL}{0}ISMKM=1&FE=${isSiteMKMEnabled ? "1" : "0"}&MKMFE=${isSiteMKMEnabled ? "1" : "0"}&MKMUA=${isUserHasMKMAccess ? "1" : "0"}&DPFE=${isSiteDataPackEnabled ? "1" : "0"}&DPUA=${isUserHasDataPackAccess ? "1" : "0"}`;

      return mkmSiteURL;
    } catch (error) {
      console.error('❌ Error getting MarketingManagerSiteURL:', error);
      return '';
    }
  },

  /**
   * Get EmailServiceSiteURL - matches backend logic exactly
   * @returns {Promise<string>} Constructed MES URL
   */
  getEmailServiceSiteURL: async () => {
    try {
      // Get API data for base URL
      const apiData = await navigationService.fetchApiData();
      const emailServiceSiteURL = apiData.EmailServiceSiteURL || '';
      
      // Get session data for parameters
      const sessionVars = navigationService.getSessionDetails() || {};
      const isMirabelEmailServiceEnabled = sessionVars.IsMirabelEmailServiceEnabled === true || sessionVars.IsMirabelEmailServiceEnabled === 'True';
      const isUserHasMKMAccess = sessionVars.IsUserHasMKMAccess === true || sessionVars.IsUserHasMKMAccess === 'True';
      
      // Construct URL exactly as backend does
      const mesSiteURL = `${emailServiceSiteURL}{0}ISMKM=1&ISMES=1&FE=${isMirabelEmailServiceEnabled ? "1" : "0"}&ESFE=${isMirabelEmailServiceEnabled ? "1" : "0"}&MKMUA=${isUserHasMKMAccess ? "1" : "0"}`;
      
      return mesSiteURL;
    } catch (error) {
      return '';
    }
  },

  /**
   * Recursively build menu tree for unlimited depth
   */
  processNavigationMenus: async (menus, apiData = null) => {
    console.log('🔍 processNavigationMenus called with:', menus?.length, 'menus');
    
    if (!Array.isArray(menus)) {
      console.warn('⚠️ processNavigationMenus: menus is not an array:', typeof menus, menus);
      return [];
    }
    
    if (menus.length === 0) {
      console.warn('⚠️ processNavigationMenus: menus array is empty');
      return [];
    }

    // Get session data from localStorage (MMClientVars)
    let sessionVars = {};
    try {
      const rawSessionData = localStorage.getItem('MMClientVars');
      console.log('🔍 Raw session data from localStorage:', rawSessionData);
      
      if (rawSessionData && rawSessionData !== 'null' && rawSessionData !== 'undefined') {
        try {
          sessionVars = JSON.parse(rawSessionData);
          // Ensure sessionVars is an object
          if (typeof sessionVars !== 'object' || sessionVars === null || Array.isArray(sessionVars)) {
            console.warn('⚠️ Session data is not a valid object, using empty object');
            sessionVars = {};
          }
        } catch (parseError) {
          console.warn('⚠️ Error parsing session data JSON:', parseError);
          sessionVars = {};
        }
      } else {
        console.warn('⚠️ No valid session data found in localStorage');
        sessionVars = {};
      }
      
      console.log('🔍 Final parsed session vars:', sessionVars);
    } catch (e) {
      console.error('⚠️ Error accessing localStorage:', e);
      sessionVars = {};
    }

    // Fetch API data for MKM/MES URLs if not provided
    if (!apiData) {
      try {
        apiData = await navigationService.fetchApiData();
      } catch (error) {
        console.warn('⚠️ Failed to fetch API data for navigation URLs:', error);
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
    function getMenuLockStatus(menu) {
      let isLocked = false;
      let lockReason = '';
      
      // Call Disposition Report - check first as backend does
      if (menu.Caption === 'Call Disposition Report' || menu.URL === '/ui/Reports/CallDisposition') {
        if (!sessionVars.IsCallDispositionEnabled) {
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
        if ((sessionVars.IsMirabelEmailServiceEnabled === false || sessionVars.IsRepNotificationEnabled) || !sessionVars.IsUserHasMKMAccess) {
          if (!(sessionVars.IsRepNotificationEnabled && (menu.Caption === 'Email Builder' || menu.Caption === 'Workflows'))) {
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

    // Helper: Insert menu URL into base URL at {0} placeholder - matches backend exactly
    function insertMenuUrlAtPlaceholder(baseUrl, menuUrl) {
      if (!baseUrl || !menuUrl) return baseUrl || menuUrl;
      // Add ? or & as in C# logic
      const urlWithQuery = menuUrl + (menuUrl.includes('?') ? '&' : '?');
      if (baseUrl.includes('{0}')) {
        return baseUrl.replace('{0}', urlWithQuery);
      }
      // fallback: just concatenate
      return baseUrl.replace(/\/$/, '') + '/' + menuUrl.replace(/^\//, '');
    }

    // Helper: recursively build children
    async function buildMenuTree(parentId) {
      const menuPromises = menus
        .filter(menu => menu.ParentID === parentId)
        .map(async menu => {
          // Lock/permission logic
          const { isLocked } = getMenuLockStatus(menu);
          // Icon class
          const iconCls = getIconClass(menu, isLocked);
          // URL replacement
          let url = replaceSessionVarsInUrl(menu.URL);
          
          // Special URL handling for MKM/MES - matches backend exactly
          // if ((menu.URLSource === 'MKM' || menu.URLSource === 'MKM-DATA') && url) {
          //   const marketingManagerSiteURL = await navigationService.getMarketingManagerSiteURL();
          //   url = insertMenuUrlAtPlaceholder(marketingManagerSiteURL, url);
          // } else if (menu.URLSource === 'MES' && url) {
          //   const emailServiceSiteURL = await navigationService.getEmailServiceSiteURL();
          //   url = insertMenuUrlAtPlaceholder(emailServiceSiteURL, url);
          // }
          
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
            isNewWindow,
            isVisible: menu.IsVisible,
            icon: menu.Icon,
            iconCls,
            toolTip,
            isLocked,
            isCalendar,
            urlSource: menu.URLSource,
            children,
            fullUrl: navigationService.getFullUrl(url)
          };
        });
      
      return Promise.all(menuPromises);
    }

    // Top-level menus have ParentID === -1 or null
    console.log('🔍 Building menu tree for ParentID -1 and null');
    const topLevelMenus1 = await buildMenuTree(-1);
    const topLevelMenus2 = await buildMenuTree(null);
    
    console.log('🔍 Top-level menus with ParentID -1:', topLevelMenus1.length, topLevelMenus1);
    console.log('🔍 Top-level menus with ParentID null:', topLevelMenus2.length, topLevelMenus2);
    
    const finalMenus = topLevelMenus1.concat(topLevelMenus2);
    console.log('🔍 Final combined menus:', finalMenus.length, finalMenus);
    
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
    
    // Check if it's a tablet/phone (you'll need to implement this)
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
      // Check if calendar tab already exists
      const existingCalendarTab = document.getElementById('TabCalendar');
      if (existingCalendarTab) {
        // Calendar tab already open - activate it
        // TODO: Implement tab activation logic
      } else {
        // Create new calendar tab
        // TODO: Implement calendar tab creation logic
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
    // Detect if device is tablet or phone
    const isTabletOrPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isTabletOrPhone) {
      // For tablet/phone, open in new window
      window.open(url, '_blank', '');
      return true;
    }
    
    return false;
  },

  /**
   * Add new tab to home panel
   * @param {string} url - URL to open
   * @param {string} caption - Tab caption
   */
  addNewTabToHomePanel: (url, caption) => {
    // TODO: Implement tab management logic
    // This should integrate with your React tab system
    
    // For now, just open in new window
    window.open(url, '_blank', '');
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