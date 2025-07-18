import React, { useState, useEffect } from 'react';
import { useHome } from '../contexts/HomeContext';
import navigationService from '../services/navigationService';
import { useAuth } from '@/contexts/AuthContext';
import { refreshIframeByTabId, printIframeByTabId } from '@/services/iframeService';
import { getUserPermissions } from '@/services/userService';
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
import { useToast } from '@/features/Opportunity/hooks/use-toast';

// Recursive menu renderer
const renderMenuItems = (items, openTabByUrl) => {
  return items.map((item) => {
    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenuSub key={item.id}>
          <DropdownMenuSubTrigger className="rounded-md text-white font-medium text-sm hover:!bg-ocean-100 hover:!text-black focus:!bg-ocean-100 focus:!text-black data-[state=open]:!bg-ocean-100 data-[state=open]:!text-black cursor-pointer flex items-center transition-colors duration-150" style={{ fontSize: '13px' }}>
            <span>{item.title}</span>
            {item.icon && (
              <Badge className="ml-2 text-xs" variant="secondary">
                {item.icon}
              </Badge>
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56 mt-2 rounded-lg shadow-lg bg-ocean-gradient border border-gray-100 p-1 text-white">
            {renderMenuItems(item.children, openTabByUrl)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    } else {
      return (
        <DropdownMenuItem
          key={item.id}
          onClick={() => openTabByUrl(item.title, item.url)}
          className="rounded-md font-medium text-sm hover:!bg-ocean-100 hover:!text-black focus:!bg-ocean-100 focus:!text-black cursor-pointer flex items-center text-white transition-colors duration-150"
          style={{ fontSize: '13px' }}
        >
          <span>{item.title}</span>
          {item.icon && (
            <Badge className="ml-2 text-xs" variant="secondary">
              {item.icon}
            </Badge>
          )}
        </DropdownMenuItem>
      );
    }
  });
};

const Navbar = () => {
  const { actions, tabs, activeTabId, navigationMenus, navigationLoading } = useHome();
  const { logout: authLogout, user } = useAuth();
  const { toast } = useToast();
  const [isAnnouncementsPanelOpen, setIsAnnouncementsPanelOpen] = useState(false);
  const unreadCount = useAnnouncementCount();
  const [userPermissions, setUserPermissions] = useState({
    canManageUsers: false,
    canManageNavigation: false,
    canManageWebsite: false,
  });

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

  const openTabByUrl = (title, url) => {
    if (!url) return;
    
    const fullUrl = navigationService.getFullUrl(url);
    const existingTab = tabs.find(tab => tab.url === fullUrl);
    if (existingTab) {
      actions.setActiveTab(existingTab.id);
    } else {
      actions.addTab({
        title,
        url: fullUrl,
        type: 'iframe',
        icon: '🌐',
        closable: true,
      });
    }
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

  return (
      <nav className="navbar bg-ocean-gradient shadow-md h-12">
      <div className="max-w-full px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12 min-h-0">
          {/* Logo */}
          <div className="flex items-center min-h-0">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-2">
                  <span className="text-ocean-600 font-bold text-lg">M</span>
                </div>
              </div>
            </div>
            {/* Top Menus */}
            <div className="ml-4 flex items-center space-x-1 min-h-0">
              {navigationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                navigationMenus.map((menu) => (
                  <DropdownMenu key={menu.id}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="px-2 py-1 rounded-md font-medium text-sm text-white hover:bg-ocean-700 hover:text-black focus:bg-ocean-800 transition flex items-center h-8 min-h-0"
                        style={{ fontSize: '13px' }}
                      >
                        <span>{menu.title}</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 mt-2 rounded-lg shadow-lg bg-ocean-gradient border border-gray-100 p-1 text-white">
                      {menu.url && (
                        <DropdownMenuItem onClick={() => openTabByUrl(menu.title, menu.url)} className="rounded-md font-medium text-sm hover:!bg-ocean-100 hover:!text-black focus:!bg-ocean-100 focus:!text-black cursor-pointer text-white transition-colors duration-150" style={{ fontSize: '13px' }}>
                          <span>{menu.title} Home</span>
                        </DropdownMenuItem>
                      )}
                      {menu.children && renderMenuItems(menu.children, openTabByUrl)}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2 min-h-0">
            {/* Search Bar (moved here) */}
            {!navigationLoading && (
              <CustomerSearch />
            )}
            {/* Bell Notification */}
            <BellNotification 
              onOpenAnnouncementsPanel={handleOpenAnnouncementsPanel} 
              unreadCount={unreadCount}
            />

            {/* User Menu - Updated to match ASP.NET design exactly */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  data-testid="profile-menu-button"
                  className="flex items-center px-4 py-1 rounded-full bg-ocean-600 hover:bg-ocean-700 text-white font-semibold shadow border border-ocean-700 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition h-8 min-h-0"
                >
                  <User className="h-4 w-4 mr-2" />
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
      
      {/* Announcements Side Panel */}
      <AnnouncementsSidePanel 
        isOpen={isAnnouncementsPanelOpen} 
        onClose={() => setIsAnnouncementsPanelOpen(false)} 
      />
    </nav>
  );
};

export default Navbar; 