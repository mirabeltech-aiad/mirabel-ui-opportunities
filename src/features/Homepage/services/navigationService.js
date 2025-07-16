import AxiosService from '@/services/AxiosService';
import { apiCall } from '@/services/httpClient';

/**
 * Navigation service for fetching dynamic navigation menus from the API
 */
export const navigationService = {
  /**
   * Base domain for navigation URLs
   */
  BASE_DOMAIN: 'https://smoke-feature13.magazinemanager.com',

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
      
      // Extract user ID - try multiple sources
      const userId = content.UserId || claims.LoggedInUserID || clientDetails.EmployeeId || 1;
      
      // Extract email - try multiple sources
      const email = sessionDetails.UserName || claims.Email || "sa@magazinemanager.com";
      
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
      const isAdmin = email.toLowerCase().includes('sa@') || email.toLowerCase().includes('admin');
      const isSA = isAdmin ? "true" : "false";
      const cultureUI = clientInfo.CultureUI || "en-US";
      const siteType = clientInfo.SiteType || "TMM";
      const isUserHasMKMAccess=clientInfo.IsUserHasMKMAccess || false;
      const isSiteDataPackEnabled=clientInfo.IsSiteDataPackEnabled || false;
      const isUserHasDataPackAccess=clientInfo.IsUserHasDataPackAccess || false;
      const isMirabelEmailServiceEnabled=clientInfo.IsMirabelEmailServiceEnabled || false;
      const isrepnotificationenabled=clientInfo.IsRepNotificationEnabled || false;
     
      // Create the transformed data object
      const transformedData = {
        "UserID": userId,
        "Email": email,
        "IsAdmin": isAdmin,
        "IsAuthenticated": true, // Add this for compatibility
        "Token": accessToken,
        "IsSA": isSA,
        "UserName": isAdmin ? "Administrator System" : "User",
        "DisplayName": isAdmin ? "Administrator,System" : "User,Name",
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
        "FullName": isAdmin ? "System Administrator" : "User Name",
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
        "IsRepNotificationEnabled": isrepnotificationenabled
      };
      
      console.log('🔄 Transformed session data:', transformedData);
      return transformedData;
      
    } catch (error) {
      console.error('❌ Error transforming session data:', error);
      
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
        return navigationService.processNavigationMenus(menus);
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
      console.log('🔄 Loading session details...');
      const response = await apiCall('/services/admin/common/SessionDetailsGet','GET');
      
      console.log('📊 Raw session API response:', response);
      
      // Transform the response data into the desired format
      const transformedData = navigationService.transformSessionData(response);
      
      // Store transformed data in localStorage with key 'MMnewclientvars'
      localStorage.setItem('MMClientVars', JSON.stringify(transformedData));
      console.log('✅ Session details transformed and stored in localStorage as MMnewclientvars');
      console.log('📝 Stored data:', transformedData);
      
      // Also update the existing MMClientVars for backward compatibility
      const existingClientVars = localStorage.getItem('MMClientVars');
      if (existingClientVars) {
        try {
          const existing = JSON.parse(existingClientVars);
          const updatedClientVars = { ...existing, ...transformedData };
          localStorage.setItem('MMClientVars', JSON.stringify(updatedClientVars));
          console.log('🔄 Updated MMClientVars for backward compatibility');
        } catch (e) {
          console.warn('⚠️ Could not update MMClientVars:', e);
        }
      } else {
        // Create MMClientVars if it doesn't exist
        localStorage.setItem('MMClientVars', JSON.stringify(transformedData));
        console.log('➕ Created MMClientVars with transformed data');
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
   * Recursively build menu tree for unlimited depth
   */
  processNavigationMenus: (menus) => {
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

    // Helper: Replace {{MM_SOMETHING}} in URL with sessionVars
    function replaceSessionVarsInUrl(url) {
      if (!url || typeof url !== 'string') return url;
      return url.replace(/\{\{MM_(.*?)\}\}/g, (match, key) => {
        return sessionVars[key] !== undefined ? sessionVars[key] : match;
      });
    }

    // Helper: Permission/lock icon logic (MKM, DataPack, MES, etc.)
    function getMenuLockStatus(menu) {
      // Default: not locked
      let isLocked = false;
      let lockReason = '';
      // MKM
      if ((menu.URLSource === 'MKM' && (!sessionVars.IsSiteMKMEnabled || !sessionVars.IsUserHasMKMAccess)) ||
          (menu.URLSource === 'MKM-DATA' && (!sessionVars.IsSiteDataPackEnabled || !sessionVars.IsUserHasDataPackAccess))) {
        isLocked = true;
        lockReason = 'MKM';
      }
      // MES
      if (menu.URLSource === 'MES') {
        if ((sessionVars.IsMirabelEmailServiceEnabled === false || sessionVars.IsRepNotificationEnabled) || !sessionVars.IsUserHasMKMAccess) {
          if (!(sessionVars.IsRepNotificationEnabled && (menu.Caption === 'Email Builder' || menu.Caption === 'Workflows'))) {
            isLocked = true;
            lockReason = 'MES';
          }
        }
      }
      // Call Disposition Report
      if (menu.Caption === 'Call Disposition Report' || menu.URL === '/ui/Reports/CallDisposition') {
        if (!sessionVars.IsCallDispositionEnabled) {
          isLocked = true;
          lockReason = 'CallDisposition';
        }
      }
      return { isLocked, lockReason };
    }

    // Helper: icon class logic
    function getIconClass(menu, isLocked) {
      if (isLocked) return 'mainMenuIcon lockIcon';
      if (menu.Icon === 'New') return 'mainMenuIcon newFeatureIcon';
      if (menu.Icon === 'Beta') return 'mainMenuIcon betaFeatureIcon';
      return menu.IconCls || '';
    }

    // Helper: Insert menu URL into base URL at {0} placeholder, with ? or & as needed
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
    function buildMenuTree(parentId) {
      return menus
        .filter(menu => menu.ParentID === parentId)
        .map(menu => {
          // Lock/permission logic
          const { isLocked } = getMenuLockStatus(menu);
          // Icon class
          const iconCls = getIconClass(menu, isLocked);
          // URL replacement
          let url = replaceSessionVarsInUrl(menu.URL);
          // Special URL handling for MKM/MES
          if ((menu.URLSource === 'MKM' || menu.URLSource === 'MKM-DATA') && url) {
            url = sessionVars.MarketingManagerSiteURL
              ? insertMenuUrlAtPlaceholder(sessionVars.MarketingManagerSiteURL, url)
              : url;
          } else if (menu.URLSource === 'MES' && url) {
            url = sessionVars.EmailServiceSiteURL
              ? insertMenuUrlAtPlaceholder(sessionVars.EmailServiceSiteURL, url)
              : url;
          }
          // Tooltip
          const toolTip = menu.ToolTip || '';
          // Special click handling
          const isNewWindow = !!menu.IsNewWindow;
          const isCalendar = url && url.toLowerCase().includes('calendar.aspx');
          // Children
          const children = buildMenuTree(menu.ID);
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
    }

    // Top-level menus have ParentID === -1 or null
    return buildMenuTree(-1).concat(buildMenuTree(null));
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
      
      console.log('✅ Session data updated:', updated);
      return updated;
    } catch (error) {
      console.error('❌ Error updating session data:', error);
      return null;
    }
  }
};

export default navigationService; 