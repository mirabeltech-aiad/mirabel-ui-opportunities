/**
 * Page Navigation Helpers
 * These functions are exposed on window.top for use by other React applications (Feature apps)
 * to open pages either in new browser tabs or in the Shell app's tab system
 */


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
  const time = new Date();
  const index = "_" + time.getYear() + time.getMonth() + time.getDay() + time.getHours() + time.getMinutes() + time.getSeconds() + "";
  
  // Get page title from MMClientMessage if empty
  if (pageTitle == '' || pageTitle == undefined) {
    const messageWindow =  window.top ;
    const magazineManagerText = (messageWindow.MMClientMessage && messageWindow.MMClientMessage.MagazineManager);
    pageTitle = magazineManagerText + " " + index;
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

  // Load the localizer script
  loadLocalizerScript();
  
  // Initialize message event listeners for iframe communication
  initializeMessageListeners();
};

/**
 * Loads the localizer script with the correct domain path
 */
const loadLocalizerScript = async () => {
  try {
    // Get ContentVersion from MMClientVars in localStorage
    let version = '638896304468465380'; // fallback version
    try {
      const mmClientVars = JSON.parse(localStorage.getItem('MMClientVars') || '{}');
      if (mmClientVars.ContentVersion) {
        version = mmClientVars.ContentVersion;
      }
    } catch (error) {
      console.warn('Failed to get ContentVersion from MMClientVars, using fallback:', error);
    }
    
    console.log("📦 Loading localizer script with Content Version:", version);

    const script = document.createElement("script");
    
    // Get the complete domain and remove everything after /app
    const currentUrl = window.location.href;
    const appIndex = currentUrl.indexOf('/app');
    // Remove '/app' from the URL if present, to get the base domain path
    const baseUrl = appIndex !== -1 ? currentUrl.substring(0, appIndex) : window.location.origin;
    script.src = `${baseUrl}/intranet/localizer.js.axd?v=${version}`;
    script.async = true;
    console.log('script', script);
    
    document.head.appendChild(script);
    console.log("✅ Localizer script loaded successfully");

  } catch (err) {
    console.error("❌ Failed to load localizer script:", err);
  }
};

/**
 * Initialize message event listeners for iframe communication
 */
export const initializeMessageListeners = () => {
  console.log('Initializing message event listeners');
  
  if (window.addEventListener) {
    window.addEventListener("message", displayMessage, false);
  } else {
    window.attachEvent("onmessage", displayMessage);
  }
};

/**
 * Display and handle messages from iframes
 * @param {MessageEvent} evt - The message event
 */
function displayMessage(evt) {
  const validOrigins = ["localhost", ".magazinemanager.", ".mirabelsmarketingmanager.", ".newspapermanager.", ".mirabeltechnologies.", ".chargebrite."];

  if (validOrigins.some(origin => evt.origin.includes(origin))) {
    const eventData = evt.data;
    if (eventData === "pasteClicked") {
      handlePasteClicked(evt);
    } else if (eventData && eventData.Source && eventData.Source.toUpperCase() == "AD") {
      //If the request from Analytics Dashboard, refresh Home Dashboard list
      if (window.App && window.App.direct && window.App.direct.SetupDashboard) {
        window.App.direct.SetupDashboard(eventData.Source.toUpperCase(), eventData.isReload);
      }
    } else if (eventData === "closeActTab") {
      //Close active tab
      closeTab();
    } else if (eventData && JSON.stringify(eventData).indexOf("MKM_Page_Reload") > -1) {
      //send passed data to MKM website pages
      document.querySelectorAll("iframe").forEach(function (el) {
        if (el.src.toLocaleLowerCase().indexOf('ismkm=1') > -1) {
          el.contentWindow.postMessage(eventData, "*")
        }
      });
    } else {
      openAPageFromMKM(eventData);
    }
  } else {
    return false;
  }
}

/**
 * Handle paste clicked event from iframes
 * @param {MessageEvent} evt - The message event
 */
async function handlePasteClicked(evt) {
  try {
    const clipBoardAccess = await navigator.permissions.query({
      name: "clipboard-read"
    });

    if (clipBoardAccess.state == "prompt" || clipBoardAccess.state == "granted") {
      const clipBoardData = await navigator.clipboard.readText();
      const updatedClipBoardAccess = await navigator.permissions.query({ name: "clipboard-read" });
      if (updatedClipBoardAccess.state == "granted") {
        const sendDataToPasteSection = {
          source: "pasteClicked",
          clipBoardData
        };
        evt.source.postMessage(sendDataToPasteSection, "*");
      }
    } else {
      throw new Error("Clipboard permissions denied");
    }
  } catch (error) {
    // Handle the error gracefully, e.g., display a notification or log the error.
    showMsg('Denying the "Copy Clipboard" permission will prevent copying a section from one landing page and pasting it into other landing pages.');
  }
}

/**
 * Close the active tab
 */
function closeTab() {
  if (window.homeActions && window.homeActions.closeActiveTab) {
    window.homeActions.closeActiveTab();
  } else if (window.App && window.App.tabpnlMain) {
    var activeIndex = window.App.tabpnlMain.items.indexOf(window.App.tabpnlMain.getActiveTab());
    window.App.tabpnlMain.remove(activeIndex);
  }
}

/**
 * Open a page from MKM (Mirabel Knowledge Management)
 * @param {Object} recvData - The received data containing page information
 */
function openAPageFromMKM(recvData) {
  if (!isNullOrEmpty(recvData) && !isNullOrEmpty(recvData.pgUrl)) {
    if (!(recvData.hasOwnProperty('isMM') || recvData.hasOwnProperty('isMKM'))) {
      const pageTitle = isNullOrEmpty(recvData.pgTitle) ? "Contact Details" : recvData.pgTitle;
      
      // Use the existing openPageInNextTab function
      openPageInNextTab(recvData.pgUrl, pageTitle, false, true);
    }
  }
}

/**
 * Utility function to check if a value is null or empty
 * @param {*} value - The value to check
 * @returns {boolean} - True if null or empty, false otherwise
 */
function isNullOrEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Show a message to the user (placeholder for now)
 * @param {string} message - The message to display
 */
function showMsg(message) {
  console.warn('Message:', message);
  // TODO: Implement proper message display mechanism
  // This could be integrated with a toast notification system or modal
}

export const isWindowTopAccessible = () => {
  try {
    // Try to access window.top and a property on it
    if (window.top && window.top !== window) {
      // Try to access a property to test if it's really accessible
      window.top.location.href;
      return true;
    }
    return false;
  } catch (error) {
    // If we get a security error, window.top is not accessible
    return false;
  }
};

/**
 * Safely gets window.top if accessible
 * @returns {Window|null} window.top if accessible, null otherwise
 */
export const getTopWindow = () => {
  if (isWindowTopAccessible()) {
    return window.top;
  }
  return null;
}; 
/**
 * Cleans up the page navigation helpers
 * This should be called when the Shell app unmounts
 */
export const cleanupPageNavigation = () => {
  console.log('Cleaning up page navigation helpers');
  
  // Remove message event listeners
  if (window.removeEventListener) {
    window.removeEventListener("message", displayMessage, false);
  } else {
    window.detachEvent("onmessage", displayMessage);
  }
  
  if (window.top) {
    delete window.top.openPage;
    delete window.top.openPageInNextTab;
    delete window.top.isWindowTopAccessible;
  }
  
  delete window.homeActions;
}; 

