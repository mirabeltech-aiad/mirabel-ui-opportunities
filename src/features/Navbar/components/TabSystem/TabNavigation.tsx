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
import { fetchDashboards } from '../../services/dashboardApi';

const TabNavigation: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, removeTab, addTab, updateTab } = useTabs();
  const [showOverflow, setShowOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [dashboardOptions, setDashboardOptions] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState<any>(null);
  const [dashboardTabId, setDashboardTabId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch dashboard options on component mount
  useEffect(() => {
    const loadDashboards = async () => {
      setDashboardLoading(true);
      try {
        const dashboards = await fetchDashboards();
        setDashboardOptions(dashboards);
        
        // Find the default dashboard
        const defaultDashboard = dashboards.find(d => d.IsDefault === true) || dashboards[0];
        if (defaultDashboard) {
          setCurrentDashboard(defaultDashboard);
          
          // Create or update the dashboard tab
          const tabId = addTab({
            title: defaultDashboard.DashBoardName,
            type: 'dynamic',
            component: 'DashboardIframe',
            iframeUrl: `https://smoke-feature16.magazinemanager.com${defaultDashboard.URL}`,
            isCloseable: true
          });
          setDashboardTabId(tabId);
        }
      } catch (error) {
        console.error('Failed to load dashboard options:', error);
        // Fallback to hardcoded options
        const fallbackDashboards = [
          { ID: 1, DashBoardName: "Sales Dashboard", URL: "#", IsDefault: true },
          { ID: 2, DashBoardName: "Audience", URL: "#", IsDefault: false },
          { ID: 3, DashBoardName: "Sales 1", URL: "#", IsDefault: false },
          { ID: 4, DashBoardName: "Dashboard #2", URL: "#", IsDefault: false },
          { ID: 5, DashBoardName: "Customer Search", URL: "#", IsDefault: false }
        ];
        setDashboardOptions(fallbackDashboards);
        
        const defaultDashboard = fallbackDashboards.find(d => d.IsDefault === true);
        if (defaultDashboard) {
          setCurrentDashboard(defaultDashboard);
          
          const tabId = addTab({
            title: defaultDashboard.DashBoardName,
            type: 'dynamic',
            component: 'DashboardIframe',
            iframeUrl: `https://smoke-feature16.magazinemanager.com${defaultDashboard.URL}`,
            isCloseable: true
          });
          setDashboardTabId(tabId);
        }
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboards();
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

  const handleDashboardSelection = (selectedDashboard: any) => {
    setCurrentDashboard(selectedDashboard);
    
    // Update the existing dashboard tab instead of creating a new one
    if (dashboardTabId) {
      updateTab(dashboardTabId, {
        title: selectedDashboard.DashBoardName,
        iframeUrl: `https://smoke-feature16.magazinemanager.com${selectedDashboard.URL}`
      });
      
      // Set the dashboard tab as active
      setActiveTab(dashboardTabId);
    }
  };

  const visibleTabs = tabs.slice(0, 8); // Limit visible tabs
  const overflowTabs = tabs.slice(8);
  

  return (
    <div className="bg-background border-b border-border">
      <div className="flex items-center h-10">
        {/* Left scroll button */}
        {showOverflow && canScrollLeft && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0"
            onClick={() => scrollTabs('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Tab container */}
        <div className="flex-1 relative">
          <ScrollArea className="w-full">
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-1 px-2 overflow-x-auto scrollbar-hide"
              onScroll={handleScroll}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {visibleTabs.map((tab, index) => (
                (tab.title === "Sales Dashboard" || tab.id === dashboardTabId) ? (
                  <DropdownMenu key={tab.id}>
                    <DropdownMenuTrigger asChild>
                      <div
                        className={cn(
                          "group relative flex items-center gap-2 px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors shrink-0 min-w-0",
                          "hover:bg-muted/50",
                          tab.isActive 
                            ? "bg-muted text-foreground font-medium" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        // mimic tab click
                        onClick={() => handleTabClick(tab.id)}
                      >
                        <span className="truncate max-w-[120px]">
                          {currentDashboard?.DashBoardName || tab.title}
                        </span>
                        <ChevronDown className="ml-1 h-3 w-3" />
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
                            className={`text-sm py-2 px-3 cursor-pointer ${
                              currentDashboard?.ID === dashboard.ID ? 'bg-muted' : ''
                            }`}
                          >
                            {dashboard.DashBoardName}
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div
                    key={tab.id}
                    className={cn(
                      "group relative flex items-center gap-2 px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors shrink-0 min-w-0",
                      "hover:bg-muted/50",
                      tab.isActive 
                        ? "bg-muted text-foreground font-medium" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <span className="truncate max-w-[120px]">{tab.title}</span>
                    {tab.isCloseable && (
                      <button
                        className={cn(
                          "ml-1 p-0.5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/20 transition-opacity",
                          tab.isActive && "opacity-70"
                        )}
                        onClick={(e) => handleCloseTab(e, tab.id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right scroll button */}
        {showOverflow && canScrollRight && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0"
            onClick={() => scrollTabs('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {/* Overflow dropdown */}
        {overflowTabs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 shrink-0 ml-1"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border border-border shadow-md">
              {overflowTabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "flex items-center justify-between cursor-pointer",
                    tab.isActive && "bg-muted"
                  )}
                >
                  <span className="truncate">{tab.title}</span>
                  {tab.isCloseable && (
                    <button
                      className="ml-2 p-0.5 rounded-sm hover:bg-muted-foreground/20"
                      onClick={(e) => handleCloseTab(e, tab.id)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;