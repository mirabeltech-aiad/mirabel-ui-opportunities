import React, { useState, useEffect } from 'react';
import { useHome } from '../contexts/HomeContext';
import navigationService from '../services/navigationService';
import { useAuth } from '@/contexts/AuthContext';
import { refreshIframeByUrl, printIframeByUrl } from '@/services/iframeService';
import { getUserPermissions } from '@/services/userService';
import {
  Search,
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/features/Opportunity/hooks/use-toast';

// Profile menu items with functionality
const profileMenus = [
  { title: 'Welcome', id: 'welcome', info: true },
  { separator: true },
  { title: 'My Account', id: 'myAccount', icon: User, url: '/ui/users/account' },
  { title: 'Refresh', id: 'refresh', icon: RefreshCw },
  { title: 'Print', id: 'print', icon: Printer },
  { separator: true },
  { title: 'User Setup', id: 'userSetup', icon: Users, url: '/ui/users/list' },
  { title: 'Nav Bar Setup', id: 'navBarSetup', icon: Menu, url: '/intranet/Members/Admin/NavigationSetup.aspx' },
  { title: 'Website Setup', id: 'websiteSetup', icon: Globe, url: '/ui/websitesetup' },
  { separator: true },
  { title: 'Logout', id: 'logout', icon: LogOut },
];

// Recursive menu renderer
const renderMenuItems = (items, openTabByUrl) => {
  return items.map((item) => {
    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenuSub key={item.id}>
          <DropdownMenuSubTrigger className="rounded-md text-gray-800 font-medium hover:bg-ocean-100 hover:text-ocean-700 cursor-pointer flex items-center">
            <span>{item.title}</span>
            {item.icon && (
              <Badge className="ml-2 text-xs" variant="secondary">
                {item.icon}
              </Badge>
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56 mt-2 rounded-lg shadow-lg bg-ocean-gradient border border-gray-100 p-1 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-ocean-400 scrollbar-track-ocean-100 text-white">
            {renderMenuItems(item.children, openTabByUrl)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    } else {
      return (
        <DropdownMenuItem
          key={item.id}
          onClick={() => openTabByUrl(item.title, item.url)}
          className="rounded-md font-medium hover:bg-ocean-100 hover:text-ocean-700 cursor-pointer flex items-center text-white"
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
  const { actions, tabs, navigationMenus, navigationLoading } = useHome();
  const { logout: authLogout, user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [userPermissions, setUserPermissions] = useState({
    canManageUsers: false,
    canManageNavigation: false,
    canManageWebsite: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Open command palette
        console.log('Command palette opened');
      } else if (e.key === 'F5') {
        e.preventDefault();
        // Handle F5 refresh
        const activeTab = tabs.find(tab => tab.id === actions.activeTabId);
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
  }, [tabs, actions, toast]);

  // Load user permissions on component mount
  useEffect(() => {
    const loadUserPermissions = async () => {
      try {
        const permissions = await getUserPermissions();
        setUserPermissions(permissions);
      } catch (error) {
        console.error('Error loading user permissions:', error);
        // Keep default permissions (all false)
      }
    };

    if (user) {
      loadUserPermissions();
    }
  }, [user]);

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
    const activeTab = tabs.find(tab => tab.id === actions.activeTabId);
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
        // Refresh iframe content
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
  };

  // Print current tab
  const handlePrint = () => {
    const activeTab = tabs.find(tab => tab.id === actions.activeTabId);
    if (activeTab) {
      if (activeTab.id === 'dashboard') {
        // Print the dashboard content
        window.print();
        toast({
          title: "Print initiated",
          description: "Dashboard content is being printed.",
        });
      } else if (activeTab.type === 'iframe') {
        // Print iframe content
        const success = printIframeByUrl(activeTab.url);
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
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear session data
      actions.clearSession();
      
      // Call auth logout
      authLogout();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  return (
    <nav className="bg-ocean-gradient shadow-md h-12">
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
                      <button className="px-2 py-1 rounded-md font-semibold text-white hover:bg-ocean-700 focus:bg-ocean-800 transition flex items-center text-base outline-none border-none h-8 min-h-0">
                        <span>{menu.title}</span>
                        {menu.children && menu.children.length > 0 && <ChevronDown className="h-4 w-4 ml-1" />}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 mt-2 rounded-lg shadow-lg bg-ocean-gradient border border-gray-100 p-1 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-ocean-400 scrollbar-track-ocean-100 text-white">
                      {menu.url && (
                        <DropdownMenuItem onClick={() => openTabByUrl(menu.title, menu.url)} className="rounded-md font-medium hover:bg-ocean-100 hover:text-ocean-700 cursor-pointer text-white">
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
              <div className="mr-0" style={{ width: '180px' }}>
                <div className="relative h-8">
                  <Input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-2 py-1 bg-ocean-700/30 border border-ocean-200 text-white placeholder-ocean-100 focus:bg-ocean-700/50 focus:border-ocean-300 rounded-full h-8 text-base w-full min-h-0"
                    style={{ boxShadow: 'none' }}
                  />
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-ocean-100 h-5 w-5" />
                </div>
              </div>
            )}
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-ocean-700 relative rounded-full h-8 w-8 p-0 min-h-0">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-600 text-white flex items-center justify-center">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center px-4 py-1 rounded-full bg-ocean-600 hover:bg-ocean-700 text-white font-semibold shadow border border-ocean-700 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition h-8 min-h-0">
                  <User className="h-4 w-4 mr-2" />
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-lg shadow-lg bg-white border border-gray-100 p-1">
                {profileMenus.map((item, idx) => {
                  // Skip admin items if user doesn't have permission
                  if (item.id === 'userSetup' && !userPermissions.canManageUsers) return null;
                  if (item.id === 'navBarSetup' && !userPermissions.canManageNavigation) return null;
                  if (item.id === 'websiteSetup' && !userPermissions.canManageWebsite) return null;
                  
                  return item.separator ? (
                    <DropdownMenuSeparator key={idx} />
                  ) : item.info ? (
                    <DropdownMenuItem key={item.id} className="font-bold text-base cursor-default" disabled>
                      Welcome
                      <div className="text-xs font-normal text-gray-500">
                        {user?.FullName || 'System Administrator'}
                      </div>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => handleProfileMenuClick(item)}
                      className={`rounded-md font-medium cursor-pointer flex items-center text-gray-800 hover:bg-ocean-100 hover:text-ocean-700`}
                    >
                      {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                      {item.title}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 