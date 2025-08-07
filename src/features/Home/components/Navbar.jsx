import React, { useState, useEffect, useRef } from 'react';
import { useHome } from '../contexts/HomeContext';
import navigationService from '../services/navigationService';
import { useAuth } from '@/contexts/AuthContext';
import { refreshIframeByTabId, printIframeByTabId } from '@/services/iframeService';
import { getUserPermissions } from '../../../services/userService';
import { getUserInfo, getSessionValue } from '@/utils/sessionHelpers';
import CustomerSearch from './CustomerSearch';
import AnnouncementsSidePanel from './AnnouncementsSidePanel';
import BellNotification from './BellNotification';
import { useAnnouncementCount } from '../hooks/useAnnouncementCount';
import {
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  HelpCircle,
  Loader2,
  RefreshCw,
  Printer,
  Users,
  Menu,
  Globe,
  MessageSquare,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

// Recursive menu renderer
const renderMenuItems = (items, openTabByUrl) => {
  return items.map((item) => {
    // Check if menu item is locked
    const isLocked = item.isLocked === true;
    
    // Debug logging for locked items
    if (isLocked) {
      console.log('🔒 Found locked menu item:', {
        title: item.title,
        url: item.url,
        urlSource: item.urlSource,
        iconCls: item.iconCls
      });
    }
    
    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenuSub key={item.id}>
          <DropdownMenuSubTrigger className="rounded-none text-gray-800 font-medium px-4 py-2 hover:bg-[#e6f0fa] focus:bg-[#e6f0fa] hover:text-ocean-900 focus:text-ocean-900 cursor-pointer flex items-center gap-2 transition-colors duration-150 whitespace-nowrap" style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5' }}>
            <span>{item.title}</span>
            {item.icon && (
              <Badge className="ml-2 text-xs align-middle" variant="secondary">
                {item.icon}
              </Badge>
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-auto min-w-56 max-w-xl mt-2 bg-white border border-gray-100 p-0 text-gray-800 font-medium" style={{ fontFamily: 'inherit', fontSize: '13px', lineHeight: '1.5' }}>
            {renderMenuItems(item.children, openTabByUrl)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    } else {
      // Handle click for locked items - show message instead of opening tab
      const handleClick = () => {
        openTabByUrl(item.title, item.url, item);
      };
      
      return (
        <DropdownMenuItem
          key={item.id}
          onClick={handleClick}
          className="rounded-none font-medium px-4 py-2 hover:bg-[#e6f0fa] focus:bg-[#e6f0fa] hover:text-ocean-900 focus:text-ocean-900 cursor-pointer text-gray-800 transition-colors duration-150 flex items-center gap-2 whitespace-nowrap"
          style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5' }}
        >
          <span>{item.title}</span>
          {item.icon && (
            <Badge className="ml-2 text-xs align-middle" variant="secondary">
              {item.icon}
            </Badge>
          )}
          {/* Show lock icon if item is locked */}
          {isLocked && (
            <span className="ml-auto">
              <i className="mainMenuIcon lockIcon">🔒</i>
            </span>
          )}
        </DropdownMenuItem>
      );
    }
  });
};

// Helper to render menu items with 'Show more' if needed
const renderMenuItemsWithShowMore = (items, openTabByUrl, expanded, setExpanded) => {
  const VISIBLE_COUNT = 10;
  if (!items || items.length <= VISIBLE_COUNT || expanded) {
    return (
      <div className={expanded ? 'overflow-y-auto max-h-[400px]' : ''}>
        {items.map((item) => renderMenuItemOrSub(item, openTabByUrl, expanded, setExpanded))}
      </div>
    );
  }
  return [
    ...items.slice(0, VISIBLE_COUNT).map((item) => renderMenuItemOrSub(item, openTabByUrl, expanded, setExpanded)),
    <div key="show-more" className="flex justify-center items-center cursor-pointer py-2 hover:bg-[#e6f0fa]" onClick={() => setExpanded(true)}>
      <ChevronDown className="h-4 w-4 mr-1" />
      <span className="text-xs font-medium text-ocean-900">Show more</span>
    </div>
  ];
};

// Helper to render a single menu item or submenu
const renderMenuItemOrSub = (item, openTabByUrl, expanded, setExpanded) => {
  // Check if menu item is locked
  const isLocked = item.isLocked === true;
  
  if (item.children && item.children.length > 0) {
    return (
      <DropdownMenuSub key={item.id}>
        <DropdownMenuSubTrigger className="rounded-none text-gray-800 font-medium px-4 py-2 hover:bg-[#e6f0fa] focus:bg-[#e6f0fa] hover:text-ocean-900 focus:text-ocean-900 cursor-pointer flex items-center gap-2 transition-colors duration-150 whitespace-nowrap" style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5' }}>
          <span>{item.title}</span>
          {item.icon && (
            <Badge className="ml-2 text-xs align-middle" variant="secondary">
              {item.icon}
            </Badge>
          )}
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-auto min-w-56 max-w-xl mt-2 bg-white border border-gray-100 p-0 text-gray-800 font-medium" style={{ fontFamily: 'inherit', fontSize: '13px', lineHeight: '1.5' }}>
          <SubMenuWithShowMore items={item.children} openTabByUrl={openTabByUrl} />
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  } else {
    // Handle click for locked items - show message instead of opening tab
    const handleClick = () => {
      openTabByUrl(item.title, item.url, item);
    };
    
    return (
      <DropdownMenuItem
        key={item.id}
        onClick={handleClick}
        className="rounded-none font-medium px-4 py-2 hover:bg-[#e6f0fa] focus:bg-[#e6f0fa] hover:text-ocean-900 focus:text-ocean-900 cursor-pointer text-gray-800 transition-colors duration-150 flex items-center gap-2 whitespace-nowrap"
        style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5' }}
      >
        <span>{item.title}</span>
        {item.icon && (
          <Badge className="ml-2 text-xs align-middle" variant="secondary">
            {item.icon}
          </Badge>
        )}
        {/* Show lock icon if item is locked */}
        {isLocked && (
          <span className="ml-auto">
            <i className="mainMenuIcon lockIcon">🔒</i>
          </span>
        )}
      </DropdownMenuItem>
    );
  }
};

// SubMenuWithShowMore component
const SubMenuWithShowMore = ({ items, openTabByUrl }) => {
  const [expanded, setExpanded] = React.useState(false);
  return <>{renderMenuItemsWithShowMore(items, openTabByUrl, expanded, setExpanded)}</>;
};

const Navbar = () => {
  const { actions, tabs, activeTabId, navigationMenus, navigationLoading, logoUrl, mmIntegrationSrc, crmProspectingUrl, isMMIntegration, isCRMProspecting } = useHome();
  const { logout: authLogout, user } = useAuth();
  const { toast } = useToast();
  const [isAnnouncementsPanelOpen, setIsAnnouncementsPanelOpen] = useState(false);
  const unreadCount = useAnnouncementCount();
  const [userPermissions, setUserPermissions] = useState({
    canManageUsers: false,
    canManageNavigation: false,
    canManageWebsite: false,
  });
  // Add state to track which parent menu is open
  const [openMenuId, setOpenMenuId] = useState(null);
  const [expandedMenus, setExpandedMenus] = React.useState({});
  
  // Add state to track if hover functionality should be enabled
  const [hoverEnabled, setHoverEnabled] = useState(false);
  
  // Scroll state for navigation menus
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const menuContainerRef = useRef(null);

  // Fallback user info if AuthContext user is null
  const [fallbackUser, setFallbackUser] = useState(null);

  // Get user info directly if AuthContext user is null
  useEffect(() => {
    if (!user) {
      try {
        const userInfo = getUserInfo();
        setFallbackUser(userInfo);
      } catch (error) {
        console.error('❌ Navbar: Error getting fallback user info:', error);
        setFallbackUser(null);
      }
    }
  }, [user]);

  // Use either AuthContext user or fallback user
  const currentUser = user || fallbackUser;

  // Check if user is admin (fallback for permission loading issues)
  const isAdmin = currentUser?.isAdmin || currentUser?.isSA || userPermissions.isAdmin || userPermissions.isSA || userPermissions.canManageUsers || userPermissions.canManageNavigation || userPermissions.canManageWebsite;

  // Dynamic profile menu items based on user permissions
  const getProfileMenus = () => {
    const baseMenus = [
      { title: 'My Account', id: 'myAccount', icon: User, url: '/ui/users/account' },
      { title: 'Refresh', id: 'refresh', icon: RefreshCw },
      { title: 'Print', id: 'print', icon: Printer },
    ];

    const adminMenus = [];
    
    // Add admin items based on specific permissions
    if (userPermissions.canManageUsers || isAdmin) {
      adminMenus.push({ title: 'User Setup', id: 'userSetup', icon: Users, url: '/ui/users/list' });
    }
    
    if (userPermissions.canManageNavigation || isAdmin) {
      adminMenus.push({ title: 'Nav Bar Setup', id: 'navBarSetup', icon: Menu, url: '/intranet/Members/Admin/NavigationSetup.aspx' });
    }
    
    if (userPermissions.canManageWebsite || isAdmin) {
      adminMenus.push({ title: 'Website Setup', id: 'websiteSetup', icon: Globe, url: '/ui/websitesetup' });
    }

    const logoutMenu = { title: 'Logout', id: 'logout', icon: LogOut };

    // Build final menu array
    const menus = [...baseMenus];
    
    // Add separator and admin menus if any exist
    if (adminMenus.length > 0) {
      menus.push({ separator: true });
      menus.push(...adminMenus);
    }
    
    // Add separator and logout
    menus.push({ separator: true });
    menus.push(logoutMenu);

    return menus;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Open command palette
      } else if (e.key === 'F5') {
        e.preventDefault();
        // Handle F5 refresh
        const activeTab = tabs.find(tab => tab.id === activeTabId);
        if (activeTab) {
          if (activeTab.id === 'dashboard') {
            actions.setNavigationLoading(true);
            setTimeout(() => {
              actions.setNavigationLoading(false);
            }, 1000);
            toast({
              title: "Dashboard refreshed",
              description: "Dashboard data has been refreshed.",
            });
          } else if (activeTab.type === 'iframe') {
            const success = refreshIframeByUrl(activeTab.url);
            if (success) {
              toast({
                title: "Page refreshed",
                description: "The current page has been refreshed.",
              });
            } else {
              toast({
                title: "Refresh failed",
                description: "Unable to refresh the current page.",
                variant: "destructive",
              });
            }
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tabs, activeTabId, actions, toast]);

  // Load user permissions on component mount
  useEffect(() => {
    const loadUserPermissions = async () => {
      try {
        const permissions = await getUserPermissions();
        setUserPermissions(permissions);
      } catch (error) {
        console.error('Error loading user permissions:', error);
        // Set default permissions if loading fails
        setUserPermissions({
          canManageUsers: false,
          canManageNavigation: false,
          canManageWebsite: false,
          isAdmin: false,
          isSA: false,
          hasAdminAccess: false
        });
      }
    };

    if (currentUser) {
      loadUserPermissions();
    }
  }, [currentUser]);

  const openTabByUrl = (title, url, menuItem = null) => {
    if (!url) return;
    
    // Use the same logic as server-side menuItemClick function
    const fullUrl = navigationService.getFullUrl(url);
    
    // Check if it's a calendar URL
    if (url.toLowerCase().indexOf('calendar.aspx') > -1) {
      navigationService.openCalendar(fullUrl);
      return;
    }
    
    // Check if it should open in new window (from menu item properties)
    const isNewWindow = menuItem?.isNewWindow || false;
    if (isNewWindow) {
      navigationService.menuItemClickNewWindow(fullUrl);
      return;
    }
    
    // Use the standard menuItemClick function
    navigationService.menuItemClick(fullUrl, title);
  };

  // Handle profile menu item clicks
  const handleProfileMenuClick = (item) => {
    switch (item.id) {
      case 'myAccount':
        openTabByUrl('My Account', item.url);
        break;
      
      case 'refresh':
        handleRefresh();
        break;
      
      case 'print':
        handlePrint();
        break;
      
      case 'userSetup':
        openTabByUrl('User Setup', item.url);
        break;
      
      case 'navBarSetup':
        openTabByUrl('Nav Bar Setup', item.url);
        break;
      
      case 'websiteSetup':
        openTabByUrl('Website Setup', item.url);
        break;
      
      case 'logout':
        handleLogout();
        break;
      
      default:
        break;
    }
  };

  // Refresh current tab
  const handleRefresh = () => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    
    if (activeTab) {
      if (activeTab.id === 'dashboard') {
        // Refresh dashboard by reloading navigation and dashboards
        actions.setNavigationLoading(true);
        // Trigger a reload of the dashboard data
        setTimeout(() => {
          actions.setNavigationLoading(false);
        }, 1000);
        toast({
          title: "Dashboard refreshed",
          description: "Dashboard data has been refreshed.",
        });
      } else if (activeTab.type === 'iframe') {
        // Refresh iframe content by tab ID
        const success = refreshIframeByTabId(activeTab.id);
        if (success) {
          toast({
            title: "Page refreshed",
            description: "The current page has been refreshed.",
          });
        } else {
          toast({
            title: "Refresh failed",
            description: "Unable to refresh the current page.",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Print current tab
  const handlePrint = () => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (activeTab) {
      if (activeTab.id === 'dashboard') {
        // Print the dashboard content
        window.print();
        toast({
          title: "Print initiated",
          description: "Dashboard content is being printed.",
        });
      } else if (activeTab.type === 'iframe') {
        // Print iframe content by tab ID
        const success = printIframeByTabId(activeTab.id);
        if (success) {
          toast({
            title: "Print initiated",
            description: "Page content is being printed.",
          });
        } else {
          // Fallback to printing the current window
          window.print();
          toast({
            title: "Print initiated",
            description: "Page content is being printed (fallback).",
          });
        }
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear session data
    actions.clearSession();
    
    // Call auth logout
    authLogout();
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Toggle announcements panel (matching legacy btnCustomPanel functionality)
  const toggleAnnouncementsPanel = () => {
    setIsAnnouncementsPanelOpen(!isAnnouncementsPanelOpen);
  };

  // Handle opening announcements panel from bell notification
  const handleOpenAnnouncementsPanel = () => {
    setIsAnnouncementsPanelOpen(true);
  };

  const handleExpandMenu = (menuId) => {
    setExpandedMenus((prev) => ({ ...prev, [menuId]: true }));
  };

  const handleCollapseMenu = (menuId) => {
    setExpandedMenus((prev) => ({ ...prev, [menuId]: false }));
  };

  // Handle menu open/close with hover functionality
  const handleMenuOpenChange = (menuId, isOpen) => {
    if (isOpen) {
      // Enable hover functionality when any menu is opened
      setHoverEnabled(true);
      setOpenMenuId(menuId);
    } else {
      setOpenMenuId(null);
    }
  };

  // Handle menu hover with conditional logic
  const handleMenuHover = (menuId) => {
    if (hoverEnabled) {
      setOpenMenuId(menuId);
    }
  };

  // Handle menu leave
  const handleMenuLeave = () => {
    if (hoverEnabled) {
      setOpenMenuId(null);
    }
  };

  // Handle menu content hover to keep menu open
  const handleMenuContentHover = (menuId) => {
    if (hoverEnabled) {
      setOpenMenuId(menuId);
    }
  };

  // Handle menu content leave
  const handleMenuContentLeave = () => {
    if (hoverEnabled) {
      setOpenMenuId(null);
    }
  };


  // Check if menus can scroll
  const checkScrollState = () => {
    if (menuContainerRef.current) {
      const container = menuContainerRef.current;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }
  };

  // Scroll menus left/right
  const scrollMenus = (direction) => {
    if (menuContainerRef.current) {
      const scrollAmount = 200; // pixels to scroll
      const currentScroll = menuContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      menuContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  // Check scroll state when menus change or window resizes
  useEffect(() => {
    checkScrollState();
    
    const handleResize = () => checkScrollState();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [navigationMenus]);

  // Add scroll event listener to update button states
  useEffect(() => {
    const container = menuContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollState);
      return () => container.removeEventListener('scroll', checkScrollState);
    }
  }, [navigationMenus]);

  return (
    <>
      <nav className="navbar bg-ocean-gradient shadow-md h-12 overflow-hidden">
        <div className="w-full px-2 sm:px-4 lg:px-6 min-w-0">
          <div className="flex items-center h-12 min-h-0 min-w-0">
            {/* Logo */}
            <div className="flex items-center min-h-0 flex-shrink-0">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <img src={logoUrl} alt="Logo" style={{ height: 32, marginRight:0 }} />
                </div>
              </div>
            </div>
            
            {/* Top Menus with Scrolling */}
            <div className="flex items-center min-h-0 flex-1 min-w-0">
              {navigationMenus && Array.isArray(navigationMenus) && navigationMenus.length > 0 && (
                <div className="flex items-center w-full min-w-0">
                  {/* Left Scroll Button */}
                  {canScrollLeft && (
                    <button
                      onClick={() => scrollMenus('left')}
                      className="flex-shrink-0 p-1 text-white hover:bg-ocean-700 rounded-md mr-1"
                      title="Scroll menus left"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  )}
                  
                  {/* Scrollable Menu Container */}
                  <div 
                    ref={menuContainerRef}
                    className="flex items-center space-x-1 overflow-x-auto flex-1 scrollbar-hide min-w-0"
                    style={{ 
                      scrollbarWidth: 'none', 
                      msOverflowStyle: 'none',
                      WebkitScrollbar: { display: 'none' }
                    }}
                  >
                    {navigationMenus.map((menu) => (
                  <DropdownMenu key={menu.id} open={openMenuId === menu.id} onOpenChange={(open) => handleMenuOpenChange(menu.id, open)}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`flex-shrink-0 px-2 py-1 rounded-md font-medium text-sm transition flex items-center h-8 min-h-0 whitespace-nowrap ${
                          openMenuId === menu.id
                            ? 'bg-blue-200 text-blue-900 shadow font-semibold' // Consistent active tab styling
                            : 'text-white hover:bg-ocean-700 hover:text-white focus:bg-ocean-800 focus:text-white'
                        }`}
                        style={{ fontSize: '13px' }}
                        onMouseEnter={() => handleMenuHover(menu.id)}
                        onMouseLeave={handleMenuLeave}
                      >
                        <span className="truncate">{menu.title}</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="start" 
                      className="w-auto min-w-56 max-w-xl mt-2 bg-white border border-gray-100 p-0 text-gray-800 font-medium" 
                      style={{ fontFamily: 'inherit', fontSize: '13px', lineHeight: '1.5' }}
                      onMouseEnter={() => handleMenuHover(menu.id)}
                      onMouseLeave={handleMenuLeave}
                    >
                      {menu.url && (
                        <DropdownMenuItem onClick={() => openTabByUrl(menu.title, menu.url, menu)} className="rounded-none font-medium px-4 py-2 hover:bg-[#e6f0fa] focus:bg-[#e6f0fa] hover:text-ocean-900 focus:text-ocean-900 cursor-pointer text-gray-800 transition-colors duration-150 flex items-center gap-2 whitespace-nowrap" style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5' }}>
                          <span>{menu.title} Home</span>
                        </DropdownMenuItem>
                      )}
                      {renderMenuItemsWithShowMore(menu.children, openTabByUrl, expandedMenus[menu.id], () => handleExpandMenu(menu.id))}
                      {menu.children && menu.children.length > 10 && expandedMenus[menu.id] && (
                        <div className="flex justify-center items-center cursor-pointer py-2 hover:bg-[#e6f0fa]" onClick={() => handleCollapseMenu(menu.id)}>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium text-ocean-900">Show less</span>
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                    ))}
                  </div>
                  
                  {/* Right Scroll Button */}
                  {canScrollRight && (
                    <button
                      onClick={() => scrollMenus('right')}
                      className="flex-shrink-0 p-1 text-white hover:bg-ocean-700 rounded-md ml-1"
                      title="Scroll menus right"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-1 sm:space-x-2 min-h-0 flex-shrink-0 ml-auto">            
              {!navigationLoading && (
                <div className="hidden sm:block">
                  <CustomerSearch />
                </div>
              )}
              {/* Help Icon */}
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-full p-0 hover:bg-ocean-700 text-white flex-shrink-0"
                onClick={actions.toggleHelp}
                title="Help & Support"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>

              {/* Bell Notification */}
              <div className="flex-shrink-0">
                <BellNotification 
                  onOpenAnnouncementsPanel={handleOpenAnnouncementsPanel} 
                  unreadCount={unreadCount}
                />
              </div>

              {/* User Menu - Professional round profile icon */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    data-testid="profile-menu-button"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-ocean-600 hover:bg-ocean-700 text-white font-semibold shadow border border-ocean-500 focus:outline-none focus:ring-0 transition-all duration-200 min-h-0 flex-shrink-0"
                  >
                    <User className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-lg shadow-lg border border-gray-200 p-0">
                  {/* Dark blue header section matching ASP.NET */}
                  <div className="bg-ocean-600 text-white px-4 py-3 rounded-t-lg">
                    <div className="font-bold text-base">Welcome</div>
                    <div className="text-sm text-ocean-100 mt-1">
                      {currentUser?.fullName || currentUser?.FullName || getSessionValue('FullName') || getSessionValue('UserName') || 'System Administrator'}
                    </div>
                  </div>
                  
                  {/* White background menu items */}
                  <div className="bg-white rounded-b-lg">
                    {getProfileMenus().map((item, idx) => {
                      return item.separator ? (
                        <DropdownMenuSeparator key={idx} className="my-1" />
                      ) : (
                        <DropdownMenuItem
                          key={item.id}
                          onClick={() => handleProfileMenuClick(item)}
                          className="rounded-none font-medium cursor-pointer flex items-center text-gray-800 hover:bg-ocean-50 hover:text-ocean-700 px-4 py-2 mx-0"
                          style={{ fontSize: '13px' }}
                        >
                          {item.icon && <item.icon className="h-4 w-4 mr-3 text-gray-600" />}
                          <span>{item.title}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Announcements Side Panel */}
      <AnnouncementsSidePanel 
        isOpen={isAnnouncementsPanelOpen} 
        onClose={() => setIsAnnouncementsPanelOpen(false)} 
      />
      
      {/* MM Integration Iframe (matching legacy ASP.NET) */}
      {isMMIntegration && mmIntegrationSrc && (
        <div>
          <iframe src={mmIntegrationSrc} title="MM Integration" style={{ width: 0, height: 0, border: 0, display: 'none' }} />
        </div>
      )}
      
      {/* CRM Prospecting Panel (matching legacy ASP.NET) */}
      {isCRMProspecting && crmProspectingUrl && (
        <div>
          <iframe src={crmProspectingUrl} title="Prospecting Dashboard" style={{ width: '100%', height: 400, border: '1px solid #ccc' }} />
        </div>
      )}
    </>
  );
};

export default Navbar; 