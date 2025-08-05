/**
 * Service for managing iframe operations in tabs
 */

// Refresh an iframe by its URL
export const refreshIframeByUrl = (url) => {
  try {
    // Get all iframes in the document
    const iframes = document.querySelectorAll('iframe');
    
    // Find the iframe that matches the URL (check both full URL and partial matches)
    for (const iframe of iframes) {
      const iframeSrc = iframe.src;
      const fullUrl = url.startsWith('http') ? url : `http://localhost:3001${url}`;
      
      // Check if the iframe src contains the URL or vice versa
      if (iframeSrc.includes(url) || iframeSrc.includes(fullUrl) || 
          url.includes(iframeSrc) || fullUrl.includes(iframeSrc)) {
        iframe.src = iframe.src;
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error refreshing iframe:', error);
    return false;
  }
};

// Print an iframe by its URL
export const printIframeByUrl = (url) => {
  try {
    const iframe = document.querySelector(`iframe[src*="${url}"]`);
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error printing iframe:', error);
    return false;
  }
};

// Get iframe element by tab ID
export const getIframeByTabId = (tabId) => {
  try {
    const iframe = document.querySelector(`iframe[data-tab-id="${tabId}"]`);
    return iframe;
  } catch (error) {
    console.error('Error getting iframe by tab ID:', error);
    return null;
  }
};

// Refresh iframe by tab ID
export const refreshIframeByTabId = (tabId) => {
  try {
    const iframe = getIframeByTabId(tabId);
    if (iframe && iframe.contentWindow) {
      iframe.src = iframe.src;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error refreshing iframe by tab ID:', error);
    return false;
  }
};

// Print iframe by tab ID
export const printIframeByTabId = (tabId) => {
  try {
    const iframe = getIframeByTabId(tabId);
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error printing iframe by tab ID:', error);
    return false;
  }
};

// Check if iframe is loaded
export const isIframeLoaded = (iframe) => {
  try {
    return iframe && iframe.contentWindow && iframe.contentWindow.document.readyState === 'complete';
  } catch (error) {
    // Cross-origin iframe will throw an error, so we assume it's loaded
    return true;
  }
};

// Wait for iframe to load
export const waitForIframeLoad = (iframe, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    if (!iframe) {
      reject(new Error('No iframe provided'));
      return;
    }

    const checkLoaded = () => {
      if (isIframeLoaded(iframe)) {
        resolve(true);
      }
    };

    // Check immediately
    checkLoaded();

    // Set up event listener
    iframe.addEventListener('load', checkLoaded);

    // Set timeout
    setTimeout(() => {
      iframe.removeEventListener('load', checkLoaded);
      reject(new Error('Iframe load timeout'));
    }, timeout);
  });
}; 