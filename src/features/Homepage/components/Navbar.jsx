import React, { useState, useEffect } from 'react';
import { useHome } from '../contexts/HomeContext';
import {
  Search,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  HelpCircle,
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

// Mock menu data matching the screenshot
const topMenus = [
  {
    title: 'Management',
    url: 'https://app.example.com/management',
    submenu: [
      { title: 'Overview', url: 'https://app.example.com/management/overview' },
      { title: 'Users', url: 'https://app.example.com/management/users' },
    ],
  },
  {
    title: 'Customers',
    url: 'https://app.example.com/customers',
    submenu: [
      { title: 'All Customers', url: 'https://app.example.com/customers/all' },
      { title: 'Segments', url: 'https://app.example.com/customers/segments' },
    ],
  },
  {
    title: 'Reports',
    url: 'https://app.example.com/reports',
    submenu: [
      { title: 'Sales', url: 'https://app.example.com/reports/sales' },
      { title: 'Performance', url: 'https://app.example.com/reports/performance' },
    ],
  },
  {
    title: 'ChargebBrite',
    url: 'https://app.example.com/chargebbrite',
    submenu: [
      { title: 'Billing', url: 'https://app.example.com/chargebbrite/billing' },
      { title: 'Invoices', url: 'https://app.example.com/chargebbrite/invoices' },
    ],
  },
  {
    title: 'Production',
    url: 'https://app.example.com/production',
    submenu: [
      { title: 'Orders', url: 'https://app.example.com/production/orders' },
      { title: 'Inventory', url: 'https://app.example.com/production/inventory' },
    ],
  },
  {
    title: 'Tools',
    url: 'https://app.example.com/tools',
    submenu: [
      { title: 'Integrations', url: 'https://app.example.com/tools/integrations' },
      { title: 'API', url: 'https://app.example.com/tools/api' },
    ],
  },
  {
    title: 'Marketing',
    url: 'https://app.example.com/marketing',
    submenu: [
      { title: 'Campaigns', url: 'https://app.example.com/marketing/campaigns' },
      { title: 'Leads', url: 'https://app.example.com/marketing/leads' },
    ],
  },
];

const profileMenus = [
  { title: 'Profile', url: 'https://app.example.com/profile', icon: User },
  { title: 'Settings', url: 'https://app.example.com/settings', icon: Settings },
  { title: 'Help', url: 'https://app.example.com/help', icon: HelpCircle },
  { separator: true },
  { title: 'Sign Out', url: '/Login.aspx', icon: LogOut, signout: true },
];

const Navbar = () => {
  const { actions, tabs } = useHome();
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
    const existingTab = tabs.find(tab => tab.url === url);
    if (existingTab) {
      actions.setActiveTab(existingTab.id);
    } else {
      actions.addTab({
        title,
        url,
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
    <nav className="bg-ocean-gradient shadow-md">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                  <span className="text-ocean-600 font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold text-white">Mirabel Manager</span>
              </div>
            </div>
            {/* Top Menus */}
            <div className="ml-8 flex items-center space-x-1">
              {topMenus.map((menu) => (
                <DropdownMenu key={menu.title}>
                  <DropdownMenuTrigger asChild>
                    <button className="px-3 py-2 rounded-md font-semibold text-white hover:bg-ocean-700 focus:bg-ocean-800 transition flex items-center text-base outline-none border-none">
                      <span>{menu.title}</span>
                      {menu.submenu && <ChevronDown className="h-4 w-4 ml-1" />}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 mt-2 rounded-lg shadow-lg bg-white border border-gray-100 p-1">
                    <DropdownMenuItem onClick={() => openTabByUrl(menu.title, menu.url)} className="rounded-md text-gray-800 font-medium hover:bg-ocean-100 hover:text-ocean-700 cursor-pointer">
                      <span>{menu.title} Home</span>
                    </DropdownMenuItem>
                    {menu.submenu && menu.submenu.map((item) => (
                      <DropdownMenuItem key={item.title} onClick={() => openTabByUrl(item.title, item.url)} className="rounded-md text-gray-800 font-medium hover:bg-ocean-100 hover:text-ocean-700 cursor-pointer">
                        <span>{item.title}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ocean-100 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-ocean-700/30 border border-ocean-200 text-white placeholder-ocean-100 focus:bg-ocean-700/50 focus:border-ocean-300 rounded-lg"
                style={{ boxShadow: '0 0 0 2px rgba(14,165,233,0.1)' }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs bg-ocean-700/30 rounded border border-ocean-200 text-white">⌘K</kbd>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="text-white hover:bg-ocean-700 relative rounded-full">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-600 text-white">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center px-4 py-2 rounded-lg bg-ocean-600 hover:bg-ocean-700 text-white font-semibold shadow border border-ocean-700 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition">
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