import AxiosService from '../../../services/AxiosService';
import { getSessionValue, getUserInfo } from '../../../utils/sessionHelpers';
import { isDevelopmentMode } from '../../../utils/developmentHelper';

/**
 * Package Types enum (matching .NET implementation)
 */
const PACKAGE_TYPES = {
  CRM_INT: 'CRM_Int'
};

/**
 * Get Marketing Manager URL domain based on server configuration
 * This matches the .NET Connection.GetMarketingManagerURL method
 * @returns {string} The MKM domain URL
 */
const getMarketingManagerURL = () => {
  // In development mode, return a test domain
  if (isDevelopmentMode()) {
    return 'https://smoke-feature13.magazinemanager.com';
  }

  // Get domain from session - this would match the server variable logic in .NET
  const sessionData = getUserInfo();
  const domain = sessionData.domain || getSessionValue('Domain');
  
  if (domain) {
    return `https://${domain}.magazinemanager.com`;
  }

  // Default fallback domain
  return 'https://smoke-feature13.magazinemanager.com';
};

/**
 * Enhanced dashboard fetch with SetupDashboard logic from .NET
 * @returns {Promise<Object>} Dashboard setup result with processed dashboards and selected dashboard
 */
export const setupDashboard = async () => {
  try {
    console.log('🔧 Setting up dashboard with .NET logic...');
    
    // Step 1: Get MKM Domain (equivalent to Connection.GetMarketingManagerURL)
    const mkmDomain = getMarketingManagerURL();
    console.log('📍 MKM Domain:', mkmDomain);

    // Step 2: Fetch dashboards from API (equivalent to WebClient.Get<DashboardDTO>)
    const response = await AxiosService.get('/services/User/Dashboards/false');
    
    let dashboards = [];
    
    // Handle different response structures
    if (response?.content?.Status === 'Success' && response?.content?.List) {
      dashboards = response.content.List;
    } else if (response?.data?.content?.Status === 'Success' && response?.data?.content?.List) {
      dashboards = response.data.content.List;
    } else if (response?.responseHeader === null && response?.content?.List) {
      dashboards = response.content.List;
    } else if (response?.data?.responseHeader === null && response?.data?.content?.List) {
      dashboards = response.data.content.List;
    } else {
      console.error('Failed to fetch dashboards - unexpected response structure:', response);
      dashboards = [];
    }

    console.log('📊 Raw dashboards fetched:', dashboards.length);

    // Step 3: Process MKM URLs - Update URLs with MKMDomain for MKM URLs and add access token
    const sessionToken = getSessionValue('Token');
    console.log('🔑 Session token available:', !!sessionToken);

    const processedDashboards = dashboards.map(dashboard => {
      const processedDashboard = { ...dashboard };
      
      // Check if URL contains ISMKM=1 (case insensitive)
      if (dashboard.URL && dashboard.URL.toUpperCase().includes('ISMKM=1')) {
        console.log(`🔗 Processing MKM URL for dashboard: ${dashboard.DashBoardName}`);
        
        // Prepend MKM domain and add access token
        let processedURL = dashboard.URL;
        
        // Add domain if URL is relative
        if (!processedURL.startsWith('http')) {
          processedURL = mkmDomain + (processedURL.startsWith('/') ? '' : '/') + processedURL;
        }
        
        // Add access token
        if (sessionToken) {
          const separator = processedURL.includes('?') ? '&' : '?';
          processedURL += `${separator}accesstoken=${encodeURIComponent(sessionToken)}`;
        }
        
        processedDashboard.URL = processedURL;
        processedDashboard.isProcessedMKM = true;
      } else {
        // For non-MKM URLs, ensure they have the base domain
        if (dashboard.URL && !dashboard.URL.startsWith('http')) {
          processedDashboard.URL = mkmDomain + (dashboard.URL.startsWith('/') ? '' : '/') + dashboard.URL;
        }
        processedDashboard.isProcessedMKM = false;
      }
      
      return processedDashboard;
    });

    console.log('✅ Processed dashboards:', processedDashboards.length);

    // Step 4: Select default dashboard (equivalent to selectedDashboard logic)
    let selectedDashboard = processedDashboards.find(d => d.IsDefault === true);
    if (!selectedDashboard && processedDashboards.length > 0) {
      selectedDashboard = processedDashboards[0];
      console.log('📌 No default dashboard found, selecting first available');
    }

    console.log('🎯 Selected dashboard:', selectedDashboard?.DashBoardName);

    // Step 5: Handle CRM_Int package type - Add MKM Dashboard/Settings
    const additionalMenuItems = [];
    const packageTypeID = getSessionValue('PackageTypeID') || getSessionValue('ProductType');
    const isAdmin = getSessionValue('IsAdmin') === 'true' || getSessionValue('IsAdmin') === true;
    
    console.log('📦 Package Type ID:', packageTypeID);
    console.log('👑 Is Admin:', isAdmin);

    // Check if package type is CRM_Int (matching .NET logic)
    if (packageTypeID === PACKAGE_TYPES.CRM_INT || packageTypeID === '10178') { // 10178 might be the numeric ID
      console.log('🔧 Adding CRM_Int specific menu items...');
      
      const mkmSetupUrl = isAdmin 
        ? `${mkmDomain}/WebsiteSetup.aspx?ISMKM=1`
        : `${mkmDomain}/DataUsageReport.aspx?ISMKM=1`;

      // Add access token to MKM setup URL
      const finalMkmUrl = sessionToken 
        ? `${mkmSetupUrl}&accesstoken=${encodeURIComponent(sessionToken)}`
        : mkmSetupUrl;

      additionalMenuItems.push({
        ID: 'MKM_Dashboard',
        DashBoardName: isAdmin ? 'Settings' : 'MKM Dashboard',
        URL: finalMkmUrl,
        IsDefault: false,
        isMKMSpecial: true,
        isProcessedMKM: true
      });
    }

    // Step 6: Combine processed dashboards with additional items
    const allDashboards = [...processedDashboards, ...additionalMenuItems];

    const result = {
      dashboards: allDashboards,
      processedDashboards: processedDashboards,
      selectedDashboard: selectedDashboard,
      additionalMenuItems: additionalMenuItems,
      mkmDomain: mkmDomain,
      packageType: packageTypeID,
      isAdmin: isAdmin,
      hasToken: !!sessionToken,
      setup: {
        totalDashboards: allDashboards.length,
        mkmDashboards: allDashboards.filter(d => d.isProcessedMKM).length,
        defaultSelected: !!selectedDashboard?.IsDefault
      }
    };

    console.log('🏁 Dashboard setup complete:', result.setup);
    return result;

  } catch (error) {
    console.error('❌ Error in setupDashboard:', error);
    
    // Return fallback data structure
    return {
      dashboards: [],
      processedDashboards: [],
      selectedDashboard: null,
      additionalMenuItems: [],
      mkmDomain: getMarketingManagerURL(),
      packageType: null,
      isAdmin: false,
      hasToken: false,
      setup: {
        totalDashboards: 0,
        mkmDashboards: 0,
        defaultSelected: false,
        error: error.message
      }
    };
  }
};

/**
 * Legacy fetch dashboards function (maintained for backward compatibility)
 * @returns {Promise<Array>} Array of dashboard objects
 */
export const fetchDashboards = async () => {
  try {
    const result = await setupDashboard();
    return result.dashboards;
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    return [];
  }
};

/**
 * Navigate to a dashboard URL with enhanced logic
 * @param {string} url - The URL to navigate to
 * @param {Object} context - Additional context like current tab system
 * @param {Object} dashboard - Dashboard object with metadata
 */
export const navigateToDashboard = (url, context = {}, dashboard = null) => {
  if (!url) {
    console.error('No URL provided for dashboard navigation');
    return;
  }

  try {
    console.log('🧭 Navigating to dashboard:', url);
    console.log('📊 Dashboard metadata:', dashboard);
    
    // The URL should already be processed by setupDashboard, so use it directly
    let finalUrl = url;
    
    // If URL is still relative, add base domain
    if (!finalUrl.startsWith('http')) {
      const mkmDomain = getMarketingManagerURL();
      finalUrl = mkmDomain + (finalUrl.startsWith('/') ? '' : '/') + finalUrl;
    }
    
    console.log('🔗 Final dashboard URL:', finalUrl);
    
    // Create iframe content for the new tab
    const iframeContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${dashboard?.DashBoardName || 'Dashboard'}</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
            }
            iframe {
              width: 100%;
              height: 100vh;
              border: none;
            }
            .loading {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-family: Arial, sans-serif;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="loading">Loading dashboard...</div>
          <iframe 
            src="${finalUrl}" 
            frameborder="0" 
            allowfullscreen
            onload="document.querySelector('.loading').style.display='none'"
            onerror="document.querySelector('.loading').innerHTML='Failed to load dashboard'"
          ></iframe>
        </body>
      </html>
    `;
    
    // Open new tab and write iframe content
    const newTab = window.open('', '_blank');
    if (newTab) {
      newTab.document.write(iframeContent);
      newTab.document.close();
    } else {
      console.error('Failed to open new tab - popup might be blocked');
      // Fallback: try direct navigation
      window.open(finalUrl, '_blank');
    }
    
  } catch (error) {
    console.error('Error navigating to dashboard:', error);
  }
};

/**
 * Get the current dashboard configuration
 * @returns {Promise<Object>} Current dashboard setup
 */
export const getCurrentDashboardSetup = async () => {
  try {
    return await setupDashboard();
  } catch (error) {
    console.error('Error getting current dashboard setup:', error);
    return null;
  }
};

/**
 * Reload dashboard setup (equivalent to SetupDashboard with isReload = true)
 * @returns {Promise<Object>} Refreshed dashboard setup
 */
export const reloadDashboardSetup = async () => {
  try {
    console.log('🔄 Reloading dashboard setup...');
    const result = await setupDashboard();
    console.log('✅ Dashboard setup reloaded');
    return result;
  } catch (error) {
    console.error('❌ Error reloading dashboard setup:', error);
    throw error;
  }
}; 