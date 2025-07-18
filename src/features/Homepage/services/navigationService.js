import AxiosService from '@/services/AxiosService';
import { apiCall } from '@/services/httpClient';
import { decrypt, authEncryptDecryptKey } from '@/utils/authHelpers';

/**
 * Navigation service for fetching dynamic navigation menus from the API
 */
export const navigationService = {
  /**
   * Base domain for navigation URLs
   */
  BASE_DOMAIN: 'https://smoke-feature13.magazinemanager.com',

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
      const response = await apiCall('/services/admin/common/k/8', 'GET');      
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
   * Transform API response data into MMnewclientvars format
   * @param {Object} apiResponse - The raw API response
   * @returns {Object} Transformed data in the desired format
   */
  transformSessionData: (apiResponse) => {
    try {
      const content = apiResponse.content || apiResponse;
      
      // Extract data from various nested objects
      const sessionDetails = content.SessionDetails || {};
      const authInfo = content.AuthenticationInfo || {};
      const claims = authInfo.Claims || {};
      const clientDetails = sessionDetails.ClientsDetails?.[0] || {};
      const clientInfo = clientDetails.ClientInformation || {};
      const dataPackDetails = clientDetails.DataPackDetails || {};
      const tokenInfo = sessionDetails.Token || {};
      const employeeDetails = content.EmployeeDetails || {};
      
      // Extract user ID - try multiple sources
      const userId = content.UserId || claims.LoggedInUserID || clientDetails.EmployeeId || 1;
      
      // Extract email - try multiple sources
      const email = sessionDetails.UserName || claims.Email || employeeDetails.Email || "sa@magazinemanager.com";
      
      // Extract domain information
      const domain = claims.Domain || clientInfo.ClientSubDomain || "smoke-feature13";
      const host = clientInfo.ClientAddress || `${domain}.magazinemanager.com`;
      
      // Extract token information
      const accessToken = tokenInfo.AccessToken || "";
      const tokenExpiry = tokenInfo.AccessTokenExpiredTime || "";
      
      // Extract client information
      const clientId = content.ClientId || claims.LoggedInSiteClientID || clientInfo.ClientID || "10007";
      const companyName = clientInfo.Name || "Mirabel Development | Home Page Migration to ReactJs | Test site";
      
      // Extract package information
      const packageTypeId = dataPackDetails.PackageTypeID || 1;
      const isMKMEnabled = dataPackDetails.IsMKMEnabled || false;
      
      // Determine admin status - could be derived from various sources
      // For now, we'll default to true for SA users, false otherwise
      const isAdmin = email.toLowerCase().includes('sa@') || email.toLowerCase().includes('admin') || employeeDetails.IsSA;
      const isSA = isAdmin ? "true" : "false";
      const cultureUI = clientInfo.CultureUI || "en-US";
      const siteType = clientInfo.SiteType || "TMM";
      const isUserHasMKMAccess=dataPackDetails.IsUserHasMKMAccess || false;
      const isSiteDataPackEnabled=dataPackDetails.IsDataPackEnabled || false;
      const isUserHasDataPackAccess=dataPackDetails.IsUserHasDataPackAccess || false;
      const isMirabelEmailServiceEnabled=clientInfo.IsMirabelEmailServiceEnabled || false;
      const isRepNotificationEnabled=clientInfo.IsRepNotificationEnabled || false;
      const isCallDispositionEnabled = clientInfo.IsCallDispositionEnabled || false;
     
      // Extract user's full name from EmployeeDetails
      const fullName = employeeDetails.Name || employeeDetails.SalesRepName || 
                      (employeeDetails.FirstName && employeeDetails.LastName ? 
                       `${employeeDetails.FirstName} ${employeeDetails.LastName}` : null) ||
                      "User";
     
      // Create the transformed data object
      const transformedData = {
        "UserID": userId,
        "Email": email,
        "IsAdmin": isAdmin,
        "IsAuthenticated": true, // Add this for compatibility
        "Token": accessToken,
        "IsSA": isSA,
        "UserName": isAdmin ? "System Administrator" : fullName,
        "DisplayName": isAdmin ? "System Administrator" : fullName,
        "UserNameID": isAdmin ? "sadministrator" : "user",
        "ClientID": clientId.toString(),
        "Host": host,
        "Domain": domain,
        "ContentVersion": Date.now().toString(), // Use current timestamp
        "AccessTokenTimeOut": tokenExpiry,
        "IsMKMEnabled": isMKMEnabled ? "True" : "False",
        "CompanyName": companyName,
        "ProductType": packageTypeId === 1 ? "10178" : packageTypeId.toString(),
        "PackageTypeID": packageTypeId.toString(), // Add this for dashboard logic
        "TimeAdd": (clientInfo.TimeAdd || 0).toString(),
        "PageList": "", // Default empty
        "HelpSite": "https://helpwp.emailnow.info",
        "FullName": fullName,
        "DepartmentID": "1",
        "PASubProductTypeId": "0",
        "PASubProductTypeName": "",
        "BSASubProductTypeId": "21",
        "BSASubProductTypeName": "Broadstreet",
        "CustomerPortalUrl": "http://tier1-portal.mirabeltechnologies.com",
        "CanSendCRMEmail": "true",
        "cultureUI": cultureUI,
        "siteType": siteType,
        "IsUserHasMKMAccess": isUserHasMKMAccess,
        "IsSiteDataPackEnabled": isSiteDataPackEnabled,
        "IsUserHasDataPackAccess": isUserHasDataPackAccess,
        "IsMirabelEmailServiceEnabled": isMirabelEmailServiceEnabled,
        "IsRepNotificationEnabled": isRepNotificationEnabled
      };
      
      return transformedData;
      
    } catch (error) {
      // Return fallback data structure
     
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
      const response = await apiCall(`/services/admin/navigations/users/${userId}/${siteId}`, 'GET');        
      // Check if response has the expected structure
      if (response?.content?.List) {
        const menus = response.content.List;
        return await navigationService.processNavigationMenus(menus);
      }
    } catch (error) {
      console.error('❌ Error fetching navigation data:', error);
      return [];
    }
  },

  /**
   * Load session details and store in localStorage with transformed format
   * @returns {Promise<Object>} Session details response
   */
    loadSessionDetails: async () => {
        try {
            const response = await apiCall('/services/admin/common/SessionDetailsGet','GET');

            // Transform the response data into the desired format
            const transformedData = navigationService.transformSessionData(response);

            // Store transformed data in localStorage with key 'MMnewclientvars'
            localStorage.setItem('MMClientVars', JSON.stringify(transformedData));

            // Also update the existing MMClientVars for backward compatibility
            const existingClientVars = localStorage.getItem('MMClientVars');
            if (existingClientVars) {
                try {
                    const existing = JSON.parse(existingClientVars);
                    const updatedClientVars = { ...existing, ...transformedData };
                    localStorage.setItem('MMClientVars', JSON.stringify(updatedClientVars));
                } catch (e) {
                    console.warn('⚠️ Could not update MMClientVars:', e);
                }
            } else {
                // Create MMClientVars if it doesn't exist
                localStorage.setItem('MMClientVars', JSON.stringify(transformedData));
            }

            return transformedData;
        } catch (error) {
            console.error('❌ Failed to load session details:', error);

            // Store fallback data
            const fallbackData = navigationService.transformSessionData({});
            localStorage.setItem('MMClientVars', JSON.stringify(fallbackData));
            console.log('🔄 Stored fallback session data');

            throw error;
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
    if (!Array.isArray(menus)) {
      return [];
    }

    // Get session data from localStorage (MMClientVars)
    let sessionVars = {};
    try {
      sessionVars = JSON.parse(localStorage.getItem('MMClientVars')) || {};
    } catch (e) {
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
          if ((menu.URLSource === 'MKM' || menu.URLSource === 'MKM-DATA') && url) {
            const marketingManagerSiteURL = await navigationService.getMarketingManagerSiteURL();
            url = insertMenuUrlAtPlaceholder(marketingManagerSiteURL, url);
          } else if (menu.URLSource === 'MES' && url) {
            const emailServiceSiteURL = await navigationService.getEmailServiceSiteURL();
            url = insertMenuUrlAtPlaceholder(emailServiceSiteURL, url);
          }
          
          // Tooltip
          const toolTip = menu.ToolTip || '';
          // Special click handling
          const isNewWindow = !!menu.IsNewWindow;
          const isCalendar = url && url.toLowerCase().includes('calendar.aspx');
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
    const topLevelMenus1 = await buildMenuTree(-1);
    const topLevelMenus2 = await buildMenuTree(null);
    return topLevelMenus1.concat(topLevelMenus2);
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
    const baseUrl = navigationService.BASE_DOMAIN;
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
   * Get session details from localStorage (MMnewclientvars)
   * @returns {Object|null} Session details or null
   */
  getSessionDetails: () => {
    try {
      const sessionData = localStorage.getItem('MMClientVars');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error parsing session data:', error);
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
      const existing = navigationService.getSessionDetails() || {};
      const updated = { ...existing, ...updates };
      localStorage.setItem('MMClientVars', JSON.stringify(updated));
      
      // Also update MMClientVars for backward compatibility
      localStorage.setItem('MMClientVars', JSON.stringify(updated));
      
      return updated;
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
  }
};

export default navigationService; 