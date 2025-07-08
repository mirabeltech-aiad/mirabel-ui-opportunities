import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
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

const TabNavigation: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, removeTab } = useTabs();
  const [showOverflow, setShowOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
                  
                  {/* Close button for dynamic tabs */}
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