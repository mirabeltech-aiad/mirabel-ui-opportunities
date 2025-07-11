import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useTabs } from '../../context/TabContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { setupDashboard, navigateToDashboard } from '../../services/dashboardApi';
import type { DashboardSetup, DashboardItem } from '../../types/tab.types';

const TabNavigation: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, removeTab, addTab, updateTab } = useTabs();
  const [showOverflow, setShowOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [dashboardSetup, setDashboardSetup] = useState<DashboardSetup | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState<DashboardItem | null>(null);
  const [dashboardTabId, setDashboardTabId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Enhanced dashboard setup on component mount
  useEffect(() => {
    const loadDashboardSetup = async () => {
      setDashboardLoading(true);
      try {
        console.log('🔧 Loading dashboard setup with .NET logic...');
        const setup = await setupDashboard() as DashboardSetup;
        setDashboardSetup(setup);
        
        console.log('📊 Dashboard setup loaded:', setup);
        
        // Use the selected dashboard from .NET logic
        const selectedDashboard = setup.selectedDashboard;
        if (selectedDashboard) {
          setCurrentDashboard(selectedDashboard);
          
          // Determine the iframe URL - use processed URL from setupDashboard
          const iframeUrl = selectedDashboard.URL || '#';
          
          console.log('🎯 Creating tab for selected dashboard:', selectedDashboard.DashBoardName);
          console.log('🔗 Dashboard URL:', iframeUrl);
          
          // Create or update the dashboard tab
          const tabId = addTab({
            title: selectedDashboard.DashBoardName,
            type: 'dynamic',
            component: 'DashboardIframe',
            iframeUrl: iframeUrl,
            isCloseable: true,
            dashboardId: selectedDashboard.ID,
            dashboardData: selectedDashboard
          });
          setDashboardTabId(tabId);
        } else if (setup.dashboards.length > 0) {
          // Fallback to first dashboard if no default
          const firstDashboard = setup.dashboards[0];
          setCurrentDashboard(firstDashboard);
          
          const tabId = addTab({
            title: firstDashboard.DashBoardName,
            type: 'dynamic',
            component: 'DashboardIframe',
            iframeUrl: firstDashboard.URL || '#',
            isCloseable: true,
            dashboardId: firstDashboard.ID,
            dashboardData: firstDashboard
          });
          setDashboardTabId(tabId);
        }
        
        // Log setup details
        if (setup.setup) {
          console.log('📈 Dashboard setup summary:', {
            total: setup.setup.totalDashboards,
            mkm: setup.setup.mkmDashboards,
            defaultSelected: setup.setup.defaultSelected,
            packageType: setup.packageType,
            isAdmin: setup.isAdmin
          });
        }
        
      } catch (error) {
        console.error('❌ Failed to load dashboard setup:', error);
        // Fallback to hardcoded options
        const fallbackDashboards: DashboardItem[] = [
          { ID: 1, DashBoardName: "Sales Dashboard", URL: "#", IsDefault: true },
          { ID: 2, DashBoardName: "Audience", URL: "#", IsDefault: false },
          { ID: 3, DashBoardName: "Sales 1", URL: "#", IsDefault: false },
          { ID: 4, DashBoardName: "Dashboard #2", URL: "#", IsDefault: false },
          { ID: 5, DashBoardName: "Customer Search", URL: "#", IsDefault: false }
        ];
        
        const fallbackSetup: DashboardSetup = {
          dashboards: fallbackDashboards,
          processedDashboards: fallbackDashboards,
          selectedDashboard: fallbackDashboards[0],
          additionalMenuItems: [],
          mkmDomain: 'https://smoke-feature13.magazinemanager.com',
          packageType: null,
          isAdmin: false,
          hasToken: false,
          setup: { 
            totalDashboards: fallbackDashboards.length,
            mkmDashboards: 0,
            defaultSelected: true,
            error: 'Fallback mode' 
          }
        };
        
        setDashboardSetup(fallbackSetup);
        
        const defaultDashboard = fallbackDashboards[0];
        setCurrentDashboard(defaultDashboard);
        
        const tabId = addTab({
          title: defaultDashboard.DashBoardName,
          type: 'dynamic',
          component: 'DashboardIframe',
          iframeUrl: `https://smoke-feature13.magazinemanager.com${defaultDashboard.URL}`,
          isCloseable: true,
          dashboardId: defaultDashboard.ID
        });
        setDashboardTabId(tabId);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboardSetup();
  }, []);

  // Check if tabs overflow and need scrolling
  useEffect(() => {
    const checkOverflow = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const hasOverflow = container.scrollWidth > container.clientWidth;
        setShowOverflow(hasOverflow);
        
        if (hasOverflow) {
          setCanScrollLeft(container.scrollLeft > 0);
          setCanScrollRight(
            container.scrollLeft < container.scrollWidth - container.clientWidth
          );
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tabs]);

  const scrollTabs = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    removeTab(tabId);
  };

  // Enhanced dashboard selection with .NET logic
  const handleDashboardSelection = (selectedDashboard: DashboardItem) => {
    console.log('🎯 Dashboard selected:', selectedDashboard.DashBoardName);
    console.log('📄 Dashboard data:', selectedDashboard);
    
    setCurrentDashboard(selectedDashboard);
    
    // Use the processed URL from setupDashboard (already has domain and token if needed)
    const iframeUrl = selectedDashboard.URL;
    
    // Update the existing dashboard tab instead of creating a new one
    if (dashboardTabId) {
      console.log('🔄 Updating existing dashboard tab');
      updateTab(dashboardTabId, {
        title: selectedDashboard.DashBoardName,
        iframeUrl: iframeUrl,
        dashboardId: selectedDashboard.ID,
        dashboardData: selectedDashboard
      });
      
      // Set the dashboard tab as active
      setActiveTab(dashboardTabId);
    } else {
      console.log('➕ Creating new dashboard tab');
      // Create new tab if no existing dashboard tab
      const tabId = addTab({
        title: selectedDashboard.DashBoardName,
        type: 'dynamic',
        component: 'DashboardIframe',
        iframeUrl: iframeUrl,
        isCloseable: true,
        dashboardId: selectedDashboard.ID,
        dashboardData: selectedDashboard
      });
      setDashboardTabId(tabId);
      setActiveTab(tabId);
    }
    
    // Log URL processing info
    if (selectedDashboard.isProcessedMKM) {
      console.log('🔗 MKM URL processed with token:', selectedDashboard.URL.includes('accesstoken'));
    }
  };

  const visibleTabs = tabs.slice(0, 8); // Limit visible tabs
  const overflowTabs = tabs.slice(8);

  // Get dashboard options from setup
  const dashboardOptions = dashboardSetup?.dashboards || [];

  return (
    <div className="bg-ocean-gradient border-t border-white/10">
      <div className="flex items-center h-10 px-4">
        {/* Tab Navigation */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Left scroll button */}
          {showOverflow && canScrollLeft && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10 flex-shrink-0"
              onClick={() => scrollTabs('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          
          {/* Scrollable tabs container */}
          <div 
            ref={scrollContainerRef}
            className="flex items-center overflow-x-auto scrollbar-hide scroll-smooth flex-1 min-w-0"
            onScroll={handleScroll}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex items-center space-x-1 px-1">
              {visibleTabs.map((tab, index) => (
                <div
                  key={tab.id}
                  className={cn(
                    "group relative flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium transition-all cursor-pointer flex-shrink-0",
                    tab.id === activeTabId
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {/* Dashboard dropdown for first tab */}
                  {index === 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-1 max-w-[200px]">
                          <span className="truncate">{currentDashboard?.DashBoardName || tab.title}</span>
                          <ChevronDown className="h-3 w-3 opacity-70" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44 bg-popover border border-border shadow-md mt-1">
                        {dashboardLoading ? (
                          <DropdownMenuItem className="text-sm py-2 px-3 text-muted-foreground">
                            Loading...
                          </DropdownMenuItem>
                        ) : (
                          dashboardOptions.map(dashboard => (
                            <DropdownMenuItem
                              key={dashboard.ID}
                              onClick={() => handleDashboardSelection(dashboard)}
                              className={cn(
                                "text-sm py-2 px-3 cursor-pointer flex items-center justify-between",
                                currentDashboard?.ID === dashboard.ID ? 'bg-muted' : ''
                              )}
                            >
                              <span className="truncate">{dashboard.DashBoardName}</span>
                              {dashboard.isProcessedMKM && (
                                <span className="text-xs text-blue-500 ml-2">MKM</span>
                              )}
                              {dashboard.isMKMSpecial && (
                                <span className="text-xs text-green-500 ml-2">Special</span>
                              )}
                            </DropdownMenuItem>
                          ))
                        )}
                        {dashboardSetup?.setup?.error && (
                          <DropdownMenuItem className="text-xs text-red-500 py-1 px-3">
                            Fallback Mode
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  
                  {/* Regular tab title for non-dashboard tabs */}
                  {index !== 0 && (
                    <span className="truncate max-w-[150px]">{tab.title}</span>
                  )}
                  
                  {/* Close button */}
                  {tab.isCloseable && (
                    <button
                      onClick={(e) => handleCloseTab(e, tab.id)}
                      className="opacity-0 group-hover:opacity-100 hover:bg-white/20 rounded-sm p-0.5 transition-all ml-1 flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Right scroll button */}
          {showOverflow && canScrollRight && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10 flex-shrink-0"
              onClick={() => scrollTabs('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Overflow menu for hidden tabs */}
        {overflowTabs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10 ml-2"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <ScrollArea className="max-h-64">
                {overflowTabs.map((tab) => (
                  <DropdownMenuItem
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className="cursor-pointer"
                  >
                    <span className="truncate">{tab.title}</span>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;