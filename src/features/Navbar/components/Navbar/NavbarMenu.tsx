import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Star } from 'lucide-react';
import { useTabs } from '../../context/TabContext';

const NavbarMenu: React.FC = () => {
  const { addTab } = useTabs();

  const menuItems = [
    'M&S',
    'Consulting',
    'Tech Support'
  ];

  const managementDropdownItems = [
    'User Editor',
    'User Logins',
    'Web Site Setup',
    'Nav Bar Setup',
    'Which Server',
    'Standard Flex Reports - v2',
    'Digital Studio-MM Site Creation',
    'MM Notifications Message',
    'Terms & Conditions',
    'BI Monitoring Dashboard',
    'Invoice Payment Gateway Log'
  ];

  const customersDropdownItems = [
    { name: 'Inbox', isNew: true, component: 'CustomersInboxPage' },
    { name: 'Search', component: 'CustomersSearchPage' },
    { name: 'Adv Search', component: 'CustomersAdvancedSearchPage' },
    { name: 'Add Contact', component: 'AddContactPage' },
    { name: 'Patty\'s Note Search with Priority', isPriority: true, component: 'PattysNoteSearchPage' },
    { name: 'Add Ad Agency', component: 'AddAdAgencyPage' },
    { name: 'Contact Reports', component: 'ContactReportsPage' },
    { name: 'All Notes & Activity', component: 'AllNotesActivityPage' },
    { name: 'Accounts Receivable', component: 'AccountsReceivablePage' },
    { name: 'Get User Products with Names', component: 'UserProductsPage' },
    { name: 'Jakob Reports', component: 'JakobReportsPage' },
    { name: 'Get E-Sign Counts', component: 'ESignCountsPage' },
    { name: 'Segmentation', component: 'SegmentationPage' },
    { name: 'Import Subscribers', component: 'ImportSubscribersPage' },
    { name: 'Subscriptions Simple Search', isNew: true, component: 'SubscriptionsSearchPage' }
  ];

  const reportsDropdownItems = [
    { name: 'MKM Clients', isNew: true, iframeUrl: '/reports/mkm-clients' },
    { name: 'Patty\'s Sales Runsheet with Client ID', isPriority: true, iframeUrl: '/reports/sales-runsheet' },
    { name: 'Patty\'s Demo Report', isSpecial: true, iframeUrl: '/reports/demo-report' },
    { name: 'Report Suite', iframeUrl: '/reports/report-suite' },
    { 
      name: 'Sales', 
      children: [
        { name: 'Sales Module', iframeUrl: '/reports/sales/sales-module' },
        { name: 'Opportunities', iframeUrl: '/reports/sales/opportunities' },
        { name: 'Revenues and Goals Module', isBeta: true, iframeUrl: '/reports/sales/revenues-goals' }
      ]
    },
    { name: 'Production', iframeUrl: '/reports/production' },
    { name: 'Accounts Receivable', iframeUrl: '/reports/accounts-receivable' },
    { name: 'Search Contacts w URL', iframeUrl: '/reports/search-contacts' },
    { name: 'v2_Customer Search with Job Title', iframeUrl: '/reports/customer-search-job' },
    { name: 'Digital Studio Activity', iframeUrl: '/reports/digital-studio' },
    { name: 'Distribution', iframeUrl: '/reports/distribution' },
    { name: 'Editorial', iframeUrl: '/reports/editorial' },
    { name: 'Inventory Report', isNew: true, iframeUrl: '/reports/inventory' },
    { name: 'Dashboards', iframeUrl: '/reports/dashboards' },
    { name: 'Marketing', iframeUrl: '/reports/marketing' },
    { name: 'Contact Switch', iframeUrl: '/reports/contact-switch' }
  ];

  const chargebriteDropdownItems = [
    'Search',
    'Advanced Search',
    'New Subscriber',
    'Add a New Subscription',
    'Reports'
  ];

  const productionDropdownItems = [
    'Production Module',
    'Mirabel\'s Digital Studio',
    'Ad Manager',
    'Production Runsheet',
    'Magazine Central',
    'Production Schedule'
  ];

  const toolsDropdownItems = [
    { name: 'AI Sales Agent', isNew: true },
    'Email Verification Report',
    'Merge Tool',
    'Import Tools',
    'Upload Import Files',
    'File Explorer',
    'File Explorer - Secure',
    { name: 'File Explorer - Secure - New', isNew: true },
    'Batch Order Update',
    'Profile Service',
    { name: 'Outlook Calendar', isNew: true },
    'Efficiency Analyzer',
    { name: 'Analytics Dashboard', isBeta: true }
  ];

  const marketingDropdownItems = [
    'Mailing List Wizard',
    { name: 'Letters', isNew: true },
    'Staff List',
    'Production Letters',
    'Subscription Letters',
    'Job Search',
    'Opportunities',
    'Mailing List Report',
    'Email Builder',
    'Landing Page Builder',
    'Campaign Performance Report',
    'Form Builder',
    'Workflows',
    'Prospecting',
    'Template Gallery',
    'Competitor Analysis',
    { name: 'Revenue Analysis with Priority', isNew: true },
    { name: 'Campaign Management Module', isNew: true }
  ];

  const handleMenuItemClick = (item: any, category: string) => {
    const itemName = typeof item === 'string' ? item : item.name;
    const iframeUrl = typeof item === 'object' && item.iframeUrl ? item.iframeUrl : null;
    
    // Always create iframe tabs for menu items
    const newTab = {
      title: itemName,
      type: 'dynamic' as const,
      iframeUrl: iframeUrl || `/${category.toLowerCase()}/${itemName.toLowerCase().replace(/\s+/g, '-')}`,
      isCloseable: true
    };

    addTab(newTab);
  };

  const renderMenuItem = (item: any, category: string, isChild = false) => {
    const itemName = typeof item === 'string' ? item : item.name;
    const isNew = typeof item === 'object' && item.isNew;
    const isPriority = typeof item === 'object' && item.isPriority;
    const isSpecial = typeof item === 'object' && item.isSpecial;
    const isBeta = typeof item === 'object' && item.isBeta;
    const hasChildren = typeof item === 'object' && item.children && item.children.length > 0;

    return (
      <DropdownMenuItem 
        key={itemName}
        className={`text-white hover:bg-white/10 cursor-pointer px-4 py-2 text-sm flex items-center justify-between ${isChild ? 'pl-8' : ''}`}
        onClick={() => !hasChildren && handleMenuItemClick(item, category)}
      >
        <span className="flex items-center gap-2">
          {itemName}
          {isPriority && <Star size={14} className="text-yellow-400 fill-current" />}
          {isSpecial && <span className="text-yellow-400 text-sm">*</span>}
        </span>
        <div className="flex items-center gap-1">
          {isNew && (
            <span className="bg-amber-500 text-black text-xs px-2 py-0.5 rounded font-medium">
              new
            </span>
          )}
          {isBeta && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded font-medium">
              Beta
            </span>
          )}
          {hasChildren && <ChevronDown size={12} className="ml-1" />}
        </div>
      </DropdownMenuItem>
    );
  };

  return (
    <nav className="hidden lg:flex items-center space-x-2">
      {/* Management Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-white/90 hover:text-white text-sm font-medium px-2 py-2 rounded-sm hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-1">
            Management
            <ChevronDown size={12} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 bg-ocean-gradient text-white border border-white/20 shadow-lg z-50"
          align="start"
          sideOffset={8}
        >
          {managementDropdownItems.map((item, index) => (
            <DropdownMenuItem 
              key={index}
              className="text-white hover:bg-white/10 cursor-pointer px-4 py-2 text-sm"
              onClick={() => handleMenuItemClick(item, 'management')}
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Customers Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-white/90 hover:text-white text-sm font-medium px-2 py-2 rounded-sm hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-1">
            Customers
            <ChevronDown size={12} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 bg-ocean-gradient text-white border border-white/20 shadow-lg z-50"
          align="start"
          sideOffset={8}
        >
          {customersDropdownItems.map((item, index) => {
            const itemName = typeof item === 'string' ? item : item.name;
            const isNew = typeof item === 'object' && item.isNew;
            const isPriority = typeof item === 'object' && item.isPriority;
            
            return (
              <DropdownMenuItem 
                key={index}
                className="text-white hover:bg-white/10 cursor-pointer px-4 py-2 text-sm flex items-center justify-between"
                onClick={() => handleMenuItemClick(item, 'customers')}
              >
                <span className="flex items-center gap-2">
                  {itemName}
                  {isPriority && <Star size={14} className="text-yellow-400 fill-current" />}
                </span>
                {isNew && (
                  <span className="bg-amber-500 text-black text-xs px-2 py-0.5 rounded font-medium">
                    new
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reports Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-white/90 hover:text-white text-sm font-medium px-2 py-2 rounded-sm hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-1">
            Reports
            <ChevronDown size={12} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 bg-ocean-gradient text-white border border-white/20 shadow-lg z-50"
          align="start"
          sideOffset={8}
        >
          {reportsDropdownItems.map((item, index) => {
            const hasChildren = typeof item === 'object' && item.children && item.children.length > 0;
            
            return (
              <React.Fragment key={index}>
                {renderMenuItem(item, 'reports')}
                {hasChildren && item.children?.map((child, childIndex) => (
                  renderMenuItem(child, 'reports', true)
                ))}
              </React.Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ChargebBrite Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-white/90 hover:text-white text-sm font-medium px-2 py-2 rounded-sm hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-1">
            ChargebBrite
            <ChevronDown size={12} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 bg-ocean-gradient text-white border border-white/20 shadow-lg z-50"
          align="start"
          sideOffset={8}
        >
          {chargebriteDropdownItems.map((item, index) => (
            <DropdownMenuItem 
              key={index}
              className="text-white hover:bg-white/10 cursor-pointer px-4 py-2 text-sm"
              onClick={() => handleMenuItemClick(item, 'chargebrite')}
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Production Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-white/90 hover:text-white text-sm font-medium px-2 py-2 rounded-sm hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-1">
            Production
            <ChevronDown size={12} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 bg-ocean-gradient text-white border border-white/20 shadow-lg z-50"
          align="start"
          sideOffset={8}
        >
          {productionDropdownItems.map((item, index) => (
            <DropdownMenuItem 
              key={index}
              className="text-white hover:bg-white/10 cursor-pointer px-4 py-2 text-sm"
              onClick={() => handleMenuItemClick(item, 'production')}
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Tools Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-white/90 hover:text-white text-sm font-medium px-2 py-2 rounded-sm hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-1">
            Tools
            <ChevronDown size={12} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 bg-ocean-gradient text-white border border-white/20 shadow-lg z-50"
          align="start"
          sideOffset={8}
        >
          {toolsDropdownItems.map((item, index) => {
            const itemName = typeof item === 'string' ? item : item.name;
            const isNew = typeof item === 'object' && item.isNew;
            const isBeta = typeof item === 'object' && item.isBeta;
            
            return (
              <DropdownMenuItem 
                key={index}
                className="text-white hover:bg-white/10 cursor-pointer px-4 py-2 text-sm flex items-center justify-between"
                onClick={() => handleMenuItemClick(item, 'tools')}
              >
                <span>{itemName}</span>
                {isNew && (
                  <span className="bg-amber-500 text-black text-xs px-2 py-0.5 rounded font-medium">
                    new
                  </span>
                )}
                {isBeta && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                    Beta
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {menuItems.map((item) => (
        <button
          key={item}
          className="text-white/90 hover:text-white text-sm font-medium px-2 py-2 rounded-sm hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          {item}
        </button>
      ))}
      
      {/* Marketing Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-white/90 hover:text-white text-sm font-medium px-2 py-2 rounded-sm hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-1">
            Marketing
            <ChevronDown size={12} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 bg-ocean-gradient text-white border border-white/20 shadow-lg z-50"
          align="start"
          sideOffset={8}
        >
          {marketingDropdownItems.map((item, index) => {
            const itemName = typeof item === 'string' ? item : item.name;
            const isNew = typeof item === 'object' && item.isNew;
            
            return (
              <DropdownMenuItem 
                key={index}
                className="text-white hover:bg-white/10 cursor-pointer px-4 py-2 text-sm flex items-center justify-between"
                onClick={() => handleMenuItemClick(item, 'marketing')}
              >
                <span>{itemName}</span>
                {isNew && (
                  <span className="bg-amber-500 text-black text-xs px-2 py-0.5 rounded font-medium">
                    new
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default NavbarMenu;