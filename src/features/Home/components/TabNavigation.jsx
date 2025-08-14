import React, { useEffect, useState, useRef, memo } from 'react';
import { useHome } from '../contexts/HomeContext';
import { initializePageNavigation, cleanupPageNavigation } from '@/utils/pageNavigation';
import { dashboardService } from '../services/dashboardService';
import navigationService from '../services/navigationService';
import Navbar from './Navbar';
import TabContent from './TabContent';
import DashboardTab from './DashboardTab';
import { Plus, X, ChevronDown, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getSessionValue } from '@/utils/sessionHelpers';
import axios from 'axios';

const TabNavigation = memo(() => {
  const { tabs, activeTabId, actions, dashboards, selectedDashboard, dashboardsLoading, crmProspectingUrl, isCRMProspecting} = useHome();

  // Debug logging to track component lifecycle

  // Floating button dropdown state
  const [isFloatingDropdownOpen, setIsFloatingDropdownOpen] = useState(false);
  const [websites, setWebsites] = useState([]);
  const [websitesLoading, setWebsitesLoading] = useState(false);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);
  const [isWebsiteButtonVisible, setIsWebsiteButtonVisible] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, tabId: null });
  const contextMenuRef = useRef(null);
  const tabBarRef = useRef(null);
  const [availableWidth, setAvailableWidth] = useState(0);

  // Function to check if current tab should show website button
  const checkWebsiteButtonVisibility = () => {
    try {
      // Get the current active tab
      const activeTab = tabs.find(tab => tab.id === activeTabId);
      
      if (activeTab && activeTab.url) {
        const currentURL = activeTab.url.toLowerCase();
        // Show button only if current tab contains "ismkm=1" in URL
        const shouldShow = currentURL.indexOf('ismkm=1') > -1;
        setIsWebsiteButtonVisible(shouldShow);
        
        if (shouldShow) {
          console.log('Website button visible - MKM tab detected:', currentURL);
        } else {
          console.log('Website button hidden - regular MM tab:', currentURL);
        }
      } else {
        // Hide button if no active tab or no URL
        setIsWebsiteButtonVisible(false);
      }
    } catch (error) {
      console.error('Error checking website button visibility:', error);
      setIsWebsiteButtonVisible(false);
    }
  };

  // Check visibility when active tab changes
  useEffect(() => {
    checkWebsiteButtonVisibility();
  }, [activeTabId, tabs]);

  // Check visibility when tabs array changes
  useEffect(() => {
    checkWebsiteButtonVisibility();
  }, [tabs]);

  // Fetch websites from API
  useEffect(() => {
    const fetchWebsites = async () => {
      setWebsitesLoading(true);
      try {
        // Get API URLs from configuration
        const apiData = await navigationService.fetchApiData();
        const baseUrl = apiData.MKMBlastServiceRestURL;
        
        // Get domain from current URL and extract subdomain
        const domain = window.location.hostname;
        const subdomain = domain.split('.')[0];
        
        // Use mirabeldev-qa as fallback for localhost
        const siteName = domain === 'localhost' ? 'mirabeldev-qa' : subdomain;
        
        const response = await axios.get(`${baseUrl}GetClientWebSites/${siteName}`);
        const data = response.data;
        
        // Transform the API data to match our component structure
        const transformedWebsites = data.map(site => ({
          id: site.WebsiteID,
          url: site.WebsiteUrl,
          name: site.WebsiteName,
          selected: false, // Default to false, will be set based on selectedWebsiteId
          isVerified: site.IsVerified,
          currency: site.Currency,
          timeZone: site.TimeZone,
          isWebMasterAccess: site.IsWebMasterAccess,
          trackEU: site.TrackEU,
          visitsCount: site.VisitsCount,
          webmasterSiteURL: site.WebmasterSiteURL,
          websiteCrawlsStatus: site.WebsiteCrawlsStatus,
          letterCategoryID: site.LetterCategoryID,
          createdBy: site.CreatedBy,
          urlIsValid: site.UrlIsvalid,
          faviconUrl: site.FaviconUrl,
          description: site.Description,
          category: site.Category
        }));
        
        setWebsites(transformedWebsites);
        
        // Set the first website as selected by default
        if (transformedWebsites.length > 0) {
          setSelectedWebsiteId(transformedWebsites[0].id);
          // Update the selected state for the first website
          setWebsites(prev => prev.map(site => ({
            ...site,
            selected: site.id === transformedWebsites[0].id
          })));
        }
      } catch (error) {
        console.error('Failed to fetch websites:', error);
        // Fallback to empty array if API fails
        setWebsites([]);
      } finally {
        setWebsitesLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  // Handle website selection
  const handleWebsiteSelect = (websiteId) => {
    try {
      // Find the selected website data
      const selectedWebsite = websites.find(site => site.id === websiteId);
      
      if (selectedWebsite) {
        // Prepare the message object like in the original implementation
        const jsonObj = {
          Action: "WebsiteChange",
          Data: {
            WebsiteID: selectedWebsite.id,
            WebsiteName: selectedWebsite.name,
            WebsiteUrl: selectedWebsite.url
          }
        };
        
        console.log('Sending message to iframes:', jsonObj);
        
        // Send message to all iframes with 'ismkm=1' in their src (like original implementation)
        document.querySelectorAll("iframe").forEach(function (el) {
          if (el.src.toLowerCase().indexOf('ismkm=1') > -1) {
            el.contentWindow.postMessage(jsonObj, "*");
          }
        });
        
        // Update local state
        setSelectedWebsiteId(websiteId);
        setWebsites(prev => prev.map(site => ({
          ...site,
          selected: site.id === websiteId
        })));
        
        // Close the dropdown
        setIsFloatingDropdownOpen(false);
        
        console.log(`Website ID ${websiteId} selected and message sent to iframes`);
      }
    } catch (error) {
      console.error('Failed to send message to iframes:', error);
    }
  };

  // Calculate available width for tabs
  useEffect(() => {
    const updateAvailableWidth = () => {
      if (tabBarRef.current) {
        const tabBarWidth = tabBarRef.current.offsetWidth;
        // Reserve space for fixed tabs, overflow menu, and padding
        // Responsive reserved space based on screen size
        const isSmallScreen = window.innerWidth < 768;
        const reservedSpace = isSmallScreen ? 200 : 300; // Less space reserved on small screens
        setAvailableWidth(Math.max(0, tabBarWidth - reservedSpace));
      }
    };

    updateAvailableWidth();
    window.addEventListener('resize', updateAvailableWidth);
    return () => window.removeEventListener('resize', updateAvailableWidth);
  }, []);

  // Hide context menu on click outside, scroll, or blur
  useEffect(() => {
    const handleCloseMenu = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };
    const handleScrollOrBlur = () => {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    };
    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleCloseMenu);
      window.addEventListener('scroll', handleScrollOrBlur, true);
      window.addEventListener('blur', handleScrollOrBlur);
    }
    return () => {
      document.removeEventListener('mousedown', handleCloseMenu);
      window.removeEventListener('scroll', handleScrollOrBlur, true);
      window.removeEventListener('blur', handleScrollOrBlur);
    };
  }, [contextMenu.visible]);

  // // Initialize page navigation helpers when component mounts
  useEffect(() => {
  
    // Pass both actions and state with activeTabId
    initializePageNavigation(actions, { activeTabId, tabs });

    // Cleanup function
    return () => {
  
      cleanupPageNavigation();
    };
  }, [actions, activeTabId, tabs]); // Add dependencies to update when state changes

  // First four tabs: dropdown (dashboard), Inbox, Search, Prospecting are fixed
  const fixedTabsCount = 4; // Dropdown, Inbox, Search, Prospecting
  const fixedTabs = tabs.slice(0, fixedTabsCount); // first four tabs are fixed
  const draggableTabs = tabs.slice(fixedTabsCount); // tabs after the first four are draggable

  // Calculate which draggable tabs should be visible based on available space
  const isSmallScreen = window.innerWidth < 768;
  const estimatedTabWidth = isSmallScreen ? 100 : 120; // Smaller tabs on small screens
  const maxVisibleDraggableTabs = Math.floor(availableWidth / estimatedTabWidth);
  
  // Ensure the active tab is always visible
  let visibleDraggableTabs = draggableTabs.slice(0, maxVisibleDraggableTabs);
  let overflowDraggableTabs = draggableTabs.slice(maxVisibleDraggableTabs);
  
  // If the active tab is in overflow, move it to visible area
  const activeTabIndex = draggableTabs.findIndex(tab => tab.id === activeTabId);
  if (activeTabIndex >= maxVisibleDraggableTabs && activeTabIndex !== -1) {
    // Remove the active tab from overflow and add it to visible
    const activeTab = draggableTabs[activeTabIndex];
    overflowDraggableTabs = overflowDraggableTabs.filter(tab => tab.id !== activeTabId);
    visibleDraggableTabs = [...visibleDraggableTabs.slice(0, maxVisibleDraggableTabs - 1), activeTab];
  }

  // Add keyboard navigation effect
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle arrow keys when no input fields are focused
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      // Handle left arrow key (previous tab)
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToPreviousTab();
      }
      
      // Handle right arrow key (next tab)
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToNextTab();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tabs, activeTabId, actions]);

  // Navigate to previous tab
  const navigateToPreviousTab = () => {
    // Create a list of navigable tabs (only visible and active tabs)
    const navigableTabs = tabs.filter(tab => {
      // Include dashboard, inbox, search (always available)
      if (tab.id === 'dashboard' || tab.id === 'inbox' || tab.id === 'search') {
        return true;
      }
      // Include prospecting only if it's actually available and has content
      if (tab.id === 'prospecting') {
        return tab.url && crmProspectingUrl;
      }
      // Include only tabs that are actually visible and have content
      return tab.url || tab.component;
    });
    
    if (navigableTabs.length <= 1) return;
    
    const currentIndex = navigableTabs.findIndex(tab => tab.id === activeTabId);
    if (currentIndex === -1) return;
    
    let previousIndex = currentIndex - 1;
    
    // Wrap around to the last tab if we're at the first tab
    if (previousIndex < 0) {
      previousIndex = navigableTabs.length - 1;
    }
    
    const previousTab = navigableTabs[previousIndex];
    if (previousTab) {
      handleTabClick(previousTab.id);
    }
  };

  // Navigate to next tab
  const navigateToNextTab = () => {
    // Create a list of navigable tabs (only visible and active tabs)
    const navigableTabs = tabs.filter(tab => {
      // Include dashboard, inbox, search (always available)
      if (tab.id === 'dashboard' || tab.id === 'inbox' || tab.id === 'search') {
        return true;
      }
      // Include prospecting only if it's actually available and has content
      if (tab.id === 'prospecting') {
        return tab.url && crmProspectingUrl;
      }
      // Include only tabs that are actually visible and have content
      return tab.url || tab.component;
    });
    
    if (navigableTabs.length <= 1) return;
    
    const currentIndex = navigableTabs.findIndex(tab => tab.id === activeTabId);
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex + 1;
    
    // Wrap around to the first tab if we're at the last tab
    if (nextIndex >= navigableTabs.length) {
      nextIndex = 0;
    }
    
    const nextTab = navigableTabs[nextIndex];
    if (nextTab) {
      handleTabClick(nextTab.id);
    }
  };


  const handleTabClick = (tabId) => {
    // Check if this is the Inbox tab and trigger reload of both iframes
    if (tabId === 'inbox' && window.reloadInboxIframes) {
      window.reloadInboxIframes();
    }
    
    // Handle lazy loading for search tab
    if (tabId === 'search') {
      const searchTab = tabs.find(tab => tab.id === 'search');
      if (searchTab && !searchTab.url) {
        // Lazy load the search tab URL
        const searchUrl = '/ui/Search';
        const fullUrl = navigationService.getFullUrl(searchUrl);
        actions.updateTab('search', { url: fullUrl });
      }
    }
     // Handle lazy loading for prospecting tab
     if (tabId === 'prospecting') {
      const prospectingTab = tabs.find(tab => tab.id === 'prospecting');
      if (prospectingTab && !prospectingTab.url) {
        // Lazy load the prospecting tab URL from CRM prospecting URL
        if (crmProspectingUrl) {
          actions.updateTab('prospecting', { url: crmProspectingUrl });
        }
      }
    }
    actions.setActiveTab(tabId);
  };

  const handleTabClose = (e, tabId) => {
    e.stopPropagation();
    e.preventDefault();
    actions.removeTab(tabId);
  };

  const addNewTab = () => {
    actions.addTab({
      title: 'New Tab',
      component: 'NewTab',
      type: 'component',
      icon: '',
      closable: true
    });
  };

  // Context menu actions
  const handleContextMenu = (e, tabId) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, tabId });
  };

  // Helper: is tab fixed?
  const isFixedTab = (tabId) => {
    return tabs.findIndex((tab) => tab.id === tabId) < fixedTabsCount;
  };
  // Helper: non-fixed tabs
  const nonFixedTabs = tabs.slice(fixedTabsCount);
  const nonFixedTabsCount = nonFixedTabs.length;
  const isRightClickFixed = isFixedTab(contextMenu.tabId);
  const onlyFixedTabs = nonFixedTabsCount === 0;
  const onlyOneNonFixedTab = nonFixedTabsCount === 1 && !isRightClickFixed;
  const moreThanOneNonFixedTab = nonFixedTabsCount > 1 && !isRightClickFixed;

  const handleCloseTab = () => {
    actions.removeTab(contextMenu.tabId);
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };
  const handleCloseOtherTabs = () => {
    tabs.forEach((tab) => {
      if (tab.id !== contextMenu.tabId && tab.closable !== false) {
        actions.removeTab(tab.id);
      }
    });
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };
  const handleCloseAllTabs = () => {
    tabs.forEach((tab) => {
      if (tab.closable !== false) {
        actions.removeTab(tab.id);
      }
    });
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleDashboardSelect = async (dashboard) => {
    if (!dashboard) return;
    
    try {
      // Save the active dashboard to backend first
      await dashboardService.saveActiveDashboard(dashboard.ID, dashboard.RefID); 

    } catch (error) {
      console.error('Failed to save active dashboard:', error);
    }
          // Update URL with token if needed
          let url = dashboard.URL;
          if (url && url.toUpperCase().includes('ISMKM=1')) {
            const token = getSessionValue('Token');
            url += (url.includes('?') ? '&' : '?') + 'accesstoken=' + token;
          }
          
          // Update local state after successful API call
          actions.setSelectedDashboard({ ...dashboard, URL: url });
          actions.setActiveTab('dashboard');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      {/* Tab Bar */}
      <div 
        ref={tabBarRef}
        className="bg-white border-b border-gray-200 flex items-center px-1 sm:px-2 py-0 h-11 min-h-0 overflow-hidden w-full" 
        style={{ 
          boxShadow: '0 1px 0 0 #e5e7eb', 
          height: '34px', 
          minHeight: '34px', 
          fontFamily: 'inherit', 
          fontSize: '13px', 
          fontWeight: 500, 
          lineHeight: '1.5',
          maxWidth: '100vw'
        }}
      >
        {/* Sales Dashboard Dropdown as first fixed tab */}
        {fixedTabs.length > 0 && (
          <div
            key={fixedTabs[0].id}
            onContextMenu={(e) => handleContextMenu(e, fixedTabs[0].id)}
            className={`flex items-center rounded transition-all duration-200 h-8 min-h-0 px-1 text-xs flex-shrink-0 ${
              activeTabId === fixedTabs[0].id
                ? 'bg-blue-100 text-blue-900 font-bold shadow-sm'
                : 'bg-transparent hover:bg-gray-100 text-gray-700'
            }`}
            style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5', border: 'none', boxShadow: activeTabId === fixedTabs[0].id ? '0 2px 8px rgba(0,0,0,0.04)' : 'none', marginRight: '1px', height: '24px', minHeight: '24px', paddingTop: '0', paddingBottom: '0' }}
          >
            <DropdownMenu>
              <div
                className={`px-2 py-1 rounded font-medium text-xs transition flex items-center h-8 min-h-0 ${
                  activeTabId === 'dashboard' ? 'bg-blue-100 text-blue-900 font-bold shadow-sm' : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
                style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5', minWidth: 120, border: 'none', boxShadow: activeTabId === 'dashboard' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none', height: '24px', minHeight: '24px', paddingTop: '0', paddingBottom: '0' }}
              >
                                 <span
                   className="flex-1 cursor-pointer"
                   onClick={() => handleTabClick('dashboard')}
                   title={selectedDashboard ? selectedDashboard.DashBoardName : 'Sales Dashboard'}
                   style={{ cursor: 'pointer' }}
                 >
                   {selectedDashboard ? selectedDashboard.DashBoardName : 'Sales Dashboard'}
                 </span>
                                 <div className="relative flex items-center">
                   <DropdownMenuTrigger asChild>
                     <button
                       className="ml-2 p-0 hover:bg-gray-200 rounded transition-colors flex items-center justify-center"
                       style={{ background: 'none', border: 'none', height: '16px', width: '16px', outline: 'none' }}
                     >
                       <ChevronDown className="h-3 w-3 text-gray-600" />
                     </button>
                   </DropdownMenuTrigger>
                 </div>
              </div>
              <DropdownMenuContent align="end" side="bottom" className="w-56 mt-1 bg-white border border-gray-100 p-0 text-gray-800 font-medium">
                {dashboardsLoading ? (
                  <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                ) : (
                  dashboards.map((dashboard) => (
                    <DropdownMenuItem
                      key={dashboard.ID}
                      onClick={() => handleDashboardSelect(dashboard)}
                      className={
                        selectedDashboard && selectedDashboard.ID === dashboard.ID
                          ? 'bg-blue-100 text-blue-900 font-semibold'
                          : ''
                      }
                    >
                      {dashboard.DashBoardName}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {/* Render remaining fixed tabs (Inbox, Search) */}
        {fixedTabs.slice(1).map((tab, index) => {
             // Skip prospecting tab if not visible
             if (tab.id === 'prospecting' && !isCRMProspecting) {
              return null;
            }
            return (
          <div
            key={tab.id}
            onContextMenu={(e) => handleContextMenu(e, tab.id)}
            className={`flex items-center rounded transition-all duration-200 h-8 min-h-0 px-1 text-xs flex-shrink-0 ${
              activeTabId === tab.id
                ? 'bg-blue-100 text-blue-900 font-bold shadow-sm'
                : 'bg-transparent hover:bg-gray-100 text-gray-700'
            }`}
                                      style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5', border: 'none', boxShadow: activeTabId === tab.id ? '0 2px 8px rgba(0,0,0,0.04)' : 'none', marginRight: '0px', height: '24px', minHeight: '24px', paddingTop: '0', paddingBottom: '0' }}
          >
            <div
              className="flex items-center px-1 py-0 cursor-pointer flex-1 h-8 min-h-0"
              onClick={() => handleTabClick(tab.id)}
              style={{ fontSize: '13px', cursor: 'pointer' }}
            >
              <span 
                className="text-xs font-medium truncate max-w-32 flex items-center" 
                style={{ fontSize: '13px', marginRight: '2px' }}
                title={tab.title}
              >
                {tab.title.length > 8 ? `${tab.title.substring(0, 8)}...` : tab.title}
              </span>
            </div>
            {/* Close button (not draggable, but should not appear for fixed tabs) */}
            {tab.closable !== false && (
              <button
                onClick={(e) => handleTabClose(e, tab.id)}
                className="mr-1 p-0 rounded hover:bg-gray-200 transition-colors flex-shrink-0 h-5 w-5 min-h-0 flex items-center justify-center"
                title="Close tab"
                type="button"
                style={{ display: 'none' }} // Hide close for fixed tabs visually
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        );
      })}

        {/* Static tabs container with proper overflow handling */}
        <div className="flex items-center flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center space-x-0.5 min-w-0 overflow-hidden" style={{ gap: '0px' }}>
            {visibleDraggableTabs.map((tab, index) => (
              <div
                key={tab.id}
                onContextMenu={(e) => handleContextMenu(e, tab.id)}
                className={`flex items-center rounded transition-all duration-100 h-8 min-h-0 px-1 text-xs flex-shrink-0 ${
                  activeTabId === tab.id
                    ? 'bg-blue-100 text-blue-900 font-bold shadow-sm'
                    : 'bg-transparent hover:bg-gray-100 text-gray-700'
                }`}
                style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5', border: 'none', boxShadow: activeTabId === tab.id ? '0 2px 8px rgba(0,0,0,0.04)' : 'none', marginRight: '0px', height: '24px', minHeight: '24px', paddingTop: '0', paddingBottom: '0', width: isSmallScreen ? '100px' : '120px', minWidth: isSmallScreen ? '100px' : '120px', maxWidth: isSmallScreen ? '100px' : '120px' }}
              >
                <div
                  className="flex items-center px-1 py-0 cursor-pointer flex-1 h-8 min-h-0 min-w-0"
                  onClick={() => handleTabClick(tab.id)}
                  style={{ fontSize: '13px', cursor: 'pointer' }}
                >
                  <span 
                    className="text-xs font-medium truncate flex items-center" 
                    style={{ fontSize: isSmallScreen ? '11px' : '12px', marginRight: '2px' }}
                    title={tab.title}
                  >
                    {tab.title.length > 8 ? `${tab.title.substring(0, 8)}...` : tab.title}
                  </span>
                </div>
                {tab.closable !== false && (
                  <button
                    onClick={(e) => handleTabClose(e, tab.id)}
                    className="mr-1 p-0 rounded hover:bg-gray-200 transition-colors flex-shrink-0 h-5 w-5 min-h-0 flex items-center justify-center"
                    title="Close tab"
                    type="button"
                    style={{ marginLeft: '-4px' }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Overflow Menu */}
        {overflowDraggableTabs.length > 0 && (
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center px-2 py-1 rounded transition-colors ${
                  overflowDraggableTabs.some(tab => tab.id === activeTabId)
                    ? 'bg-blue-100 text-blue-900 font-semibold'
                    : 'hover:bg-gray-100 text-gray-600 bg-transparent'
                }`} style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5', height: '24px', minHeight: '24px', paddingTop: '0', paddingBottom: '0' }}>
                  <ChevronDown className="h-4 w-4" />
                  <span className="ml-1 text-xs" style={{ fontSize: '13px' }}>
                    +{overflowDraggableTabs.length}
                  </span>
                </button>
              </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-64 max-w-xs">
                 {overflowDraggableTabs.map((tab) => (
                   <DropdownMenuItem
                     key={tab.id}
                     onClick={() => handleTabClick(tab.id)}
                     className={`flex items-center justify-between w-full px-3 py-2 text-sm ${
                       activeTabId === tab.id
                         ? 'bg-blue-100 text-blue-900 font-semibold'
                         : 'hover:bg-blue-100'
                     }`}
                   >
                     <div className="flex items-center min-w-0 flex-1">
                       <span 
                         className="truncate text-left" 
                         title={tab.title}
                         style={{ 
                           maxWidth: 'calc(100% - 40px)', // Account for close button width only
                           overflow: 'hidden',
                           textOverflow: 'ellipsis',
                           whiteSpace: 'nowrap'
                         }}
                       >
                         {tab.title}
                       </span>
                     </div>
                     {tab.closable !== false && (
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           e.preventDefault();
                           handleTabClose(e, tab.id);
                         }}
                         className="ml-2 p-1 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
                         type="button"
                         title="Close tab"
                       >
                         <X className="h-3 w-3" />
                       </button>
                     )}
                   </DropdownMenuItem>
                 ))}
               </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Globe Button with Dropdown - positioned next to overflow menu */}
        {(isWebsiteButtonVisible || (selectedDashboard && selectedDashboard.URL && selectedDashboard.URL.toLowerCase().includes('ismkm=1'))) && (
          <div className="flex-shrink-0 ml-1">
            <DropdownMenu open={isFloatingDropdownOpen} onOpenChange={setIsFloatingDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center px-2 py-1 rounded transition-colors hover:bg-gray-100 text-gray-600 bg-transparent"
                  style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5', height: '24px', minHeight: '24px', paddingTop: '0', paddingBottom: '0' }}
                  onClick={() => setIsFloatingDropdownOpen(!isFloatingDropdownOpen)}
                >
                  <Monitor className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                side="bottom" 
                className="w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl p-0"
                style={{ marginTop: '4px' }}
              >
                {/* Header */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                  <h3 className="text-sm font-semibold text-gray-800 text-center">Select Website</h3>
                </div>
                
                {/* Website List */}
                <div className="py-2">
                  {websitesLoading ? (
                    <div className="px-4 py-3 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      Loading websites...
                    </div>
                  ) : websites.length === 0 ? (
                    <div className="px-4 py-3 text-center text-gray-500">
                      No websites found.
                    </div>
                  ) : (
                    websites.map((website) => (
                      <DropdownMenuItem
                        key={website.id}
                        onClick={() => handleWebsiteSelect(website.id)}
                        className={`px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${
                          selectedWebsiteId === website.id ? 'bg-blue-100' : ''
                        }`}
                      >
                        <div className="flex items-center w-full">
                          {/* Selection Indicator */}
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                            selectedWebsiteId === website.id 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300'
                          }`}>
                            {selectedWebsiteId === website.id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          
                          {/* Website Info */}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${
                              selectedWebsiteId === website.id ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {website.url.startsWith('http') ? website.url : `https://${website.url}`}
                            </div>
                            <div className={`text-xs truncate ${
                              selectedWebsiteId === website.id ? 'text-blue-700' : 'text-gray-500'
                            }`}>
                              {website.name}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 9999, minWidth: 180, background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          className="rounded shadow-md text-sm"
        >
          <div
            className={`px-4 py-1.5 cursor-pointer hover:bg-blue-100 ${((onlyFixedTabs || isRightClickFixed) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900')}`}
            onClick={(!onlyFixedTabs && !isRightClickFixed) ? handleCloseTab : undefined}
            style={{ pointerEvents: (onlyFixedTabs || isRightClickFixed) ? 'none' : 'auto', lineHeight: 1.5 }}
          >
            Close Tab
          </div>
          <div className="border-t border-gray-200 mx-2" />
          <div
            className={`px-4 py-1.5 cursor-pointer hover:bg-blue-100 ${((onlyFixedTabs || onlyOneNonFixedTab || isRightClickFixed) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900')}`}
            onClick={(moreThanOneNonFixedTab ? handleCloseOtherTabs : undefined)}
            style={{ pointerEvents: (onlyFixedTabs || onlyOneNonFixedTab || isRightClickFixed) ? 'none' : 'auto', lineHeight: 1.5 }}
          >
            Close Other Tabs
          </div>
          <div className="border-t border-gray-200 mx-2" />
          <div
            className={`px-4 py-1.5 cursor-pointer hover:bg-blue-100 ${((onlyFixedTabs || isRightClickFixed) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900')}`}
            onClick={(!onlyFixedTabs && !isRightClickFixed) ? handleCloseAllTabs : undefined}
            style={{ pointerEvents: (onlyFixedTabs || isRightClickFixed) ? 'none' : 'auto', lineHeight: 1.5 }}
          >
            Close All Tabs
          </div>
        </div>
      )}
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <TabContent />
      </div>
    </div>
  );
});

// Add display name for debugging
TabNavigation.displayName = 'TabNavigation';

export default TabNavigation; 