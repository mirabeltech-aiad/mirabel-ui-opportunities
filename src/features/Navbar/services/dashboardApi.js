import AxiosService from '../../../services/AxiosService';

/**
 * Fetch dashboard options from the API
 * @returns {Promise<Array>} Array of dashboard objects
 */
export const fetchDashboards = async () => {
  try {
    const response = await AxiosService.get('/services/User/Dashboards/false');
    

    
    // Check different possible response structures
    let dashboards = [];
    
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
      return [];
    }
    

    return dashboards;
    
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    return [];
  }
};

// Base domain for dashboard URLs - later this will come from localStorage or config
const DASHBOARD_BASE_DOMAIN = 'https://smoke-feature16.magazinemanager.com';

/**
 * Navigate to a dashboard URL in a new tab with iframe
 * @param {string} url - The URL to navigate to
 * @param {Object} context - Additional context like current tab system
 */
export const navigateToDashboard = (url, context = {}) => {
  if (!url) {
    console.error('No URL provided for dashboard navigation');
    return;
  }

  try {
    console.log('Navigating to dashboard:', url);
    
    // Construct full URL with domain prefix
    const fullUrl = url.startsWith('/') ? `${DASHBOARD_BASE_DOMAIN}${url}` : url;
    console.log('Full dashboard URL:', fullUrl);
    
    // Create iframe content for the new tab
    const iframeContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dashboard</title>
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
          </style>
        </head>
        <body>
          <iframe src="${fullUrl}" frameborder="0" allowfullscreen></iframe>
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
      window.open(fullUrl, '_blank');
    }
    
  } catch (error) {
    console.error('Error navigating to dashboard:', error);
  }
}; 