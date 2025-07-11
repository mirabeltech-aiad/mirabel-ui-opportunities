import React, { useState, useEffect } from 'react';
import { useHome } from '../contexts/HomeContext';
import navigationService from '../services/navigationService';
import {
  Search,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Profile menu items (static for now)
const profileMenus = [
  { title: 'Profile', url: 'https://app.example.com/profile', icon: User },
  { title: 'Settings', url: 'https://app.example.com/settings', icon: Settings },
  { title: 'Help', url: 'https://app.example.com/help', icon: HelpCircle },
  { separator: true },
  { title: 'Sign Out', url: '/Login.aspx', icon: LogOut, signout: true },
];

const Navbar = () => {
  const { actions, tabs, navigationMenus, navigationLoading } = useHome();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Open command palette
        console.log('Command palette opened');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const handleProfileMenuClick = (item) => {
    if (item.signout) {
      actions.clearSession();
      window.location.href = item.url;
    } else if (item.url) {
      openTabByUrl(item.title, item.url);
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
              {navigationMenus.map((menu) => (
                <DropdownMenu key={menu.id}>
                  <DropdownMenuTrigger asChild>
                    <button className="px-2 py-1 rounded-md font-semibold text-white hover:bg-ocean-700 focus:bg-ocean-800 transition flex items-center text-base outline-none border-none h-8 min-h-0">
                        <span>{menu.title}</span>
                        {menu.submenu && menu.submenu.length > 0 && <ChevronDown className="h-4 w-4 ml-1" />}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 mt-2 rounded-lg shadow-lg bg-white border border-gray-100 p-1">
                      {menu.url && (
                        <DropdownMenuItem onClick={() => openTabByUrl(menu.title, menu.url)} className="rounded-md text-gray-800 font-medium hover:bg-ocean-100 hover:text-ocean-700 cursor-pointer">
                          <span>{menu.title} Home</span>
                        </DropdownMenuItem>
                      )}
                      {menu.submenu && menu.submenu.map((item) => (
                        <DropdownMenuItem 
                          key={item.id} 
                          onClick={() => openTabByUrl(item.title, item.url)}
                          className="rounded-md text-gray-800 font-medium hover:bg-ocean-100 hover:text-ocean-700 cursor-pointer"
                        >
                          <span>{item.title}</span>
                          {item.icon && (
                            <Badge className="ml-2 text-xs" variant="secondary">
                              {item.icon}
                            </Badge>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
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
                  Welcome
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-lg shadow-lg bg-white border border-gray-100 p-1">
                {profileMenus.map((item, idx) =>
                  item.separator ? (
                    <DropdownMenuSeparator key={idx} />
                  ) : (
                    <DropdownMenuItem
                      key={item.title}
                      onClick={() => handleProfileMenuClick(item)}
                      className={`rounded-md font-medium cursor-pointer flex items-center ${item.signout ? 'text-red-600 hover:bg-red-50' : 'text-gray-800 hover:bg-ocean-100 hover:text-ocean-700'}`}
                    >
                      {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                      {item.title}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 