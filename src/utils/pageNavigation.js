/**
 * Page Navigation Helpers
 * These functions are exposed on window.top for use by other React applications (Feature apps)
 * to open pages either in new browser tabs or in the Shell app's tab system
 */

import { isWindowTopAccessible } from './windowHelpers';

/**
 * Opens a page in a new browser tab
 * @param {string} url - The URL to open
 * @param {string} pageTitle - Title for the page (not used for browser tabs)
 * @param {boolean} isQueryStrValEncoded - Whether query string values are encoded (not used)
 * @param {boolean} addTabAfterActiveTab - Whether to add tab after active tab (not used)
 * @returns {Window} The new window object
 */
export const openPage = (url, pageTitle, isQueryStrValEncoded, addTabAfterActiveTab) => {
  console.log('openPage called with:', { url, pageTitle, isQueryStrValEncoded, addTabAfterActiveTab });
  
  if (!url) {
    console.warn('openPage: No URL provided');
    return null;
  }
  
  // Simple window.open for new browser tab
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  
  if (!newWindow) {
    console.error('openPage: Failed to open new window (popup blocked?)');
  }
  
  return newWindow;
};

/**
 * Opens a page in the Shell app's tab system using IframeContainer
 * @param {string} url - The URL to open in iframe
 * @param {string} pageTitle - Title for the tab
 * @param {boolean} isQueryStrValEncoded - Whether query string values are encoded (not used)
 * @param {boolean} addTabAfterActiveTab - Whether to add tab after active tab (future enhancement)
 * @returns {Object} Tab information
 */
export const openPageInNextTab = (url, pageTitle, isQueryStrValEncoded, addTabAfterActiveTab) => {
  console.log('openPageInNextTab called with:', { url, pageTitle, isQueryStrValEncoded, addTabAfterActiveTab });
  
  if (!url) {
    console.warn('openPageInNextTab: No URL provided');
    return null;
  }
  
  // Get the tab system actions from the global context
  if (window.homeActions && window.homeActions.addTab) {
    const tabData = {
      title: pageTitle || 'New Tab',
      url: url,
      type: 'iframe',
      icon: '🌐',
      closable: true
    };
    
    // Add the tab using the home context actions
    window.homeActions.addTab(tabData);
    
    console.log('openPageInNextTab: Added tab successfully:', tabData);
    
    return {
      success: true,
      tabId: tabData.id,
      title: tabData.title,
      url: tabData.url
    };
  } else {
    console.error('openPageInNextTab: Home actions not available, falling back to openPage');
    // Fallback to opening in new browser tab
    return openPage(url, pageTitle, isQueryStrValEncoded, addTabAfterActiveTab);
  }
};

/**
 * Initializes the page navigation helpers by exposing them on window.top
 * This should be called when the Shell app loads
 * @param {Object} homeActions - The actions object from HomeContext
 */
export const initializePageNavigation = (homeActions) => {
  console.log('Initializing page navigation helpers');

  // Store home actions globally for access by the helper functions
  window.homeActions = homeActions;
  
  // Expose functions on window.top for Feature apps to use
  if (window.top) {
    window.top.openPage = openPage;
    window.top.openPageInNextTab = openPageInNextTab;
    window.top.isWindowTopAccessible = isWindowTopAccessible;
    
    console.log('Page navigation helpers exposed on window.top');
  } else {
    console.warn('window.top not available, cannot expose navigation helpers');
  }
};

/**
 * Cleans up the page navigation helpers
 * This should be called when the Shell app unmounts
 */
export const cleanupPageNavigation = () => {
  console.log('Cleaning up page navigation helpers');
  
  if (window.top) {
    delete window.top.openPage;
    delete window.top.openPageInNextTab;
    delete window.top.isWindowTopAccessible;
  }
  
  delete window.homeActions;
}; 

