
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Search, Maximize2, Minimize2 } from "lucide-react";

const SearchHeader = ({ onSearch, isExpanded, onToggle, activeTab = "opportunities" }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const getTitle = () => {
    return activeTab === "opportunities" ? "Advanced Search - Opportunities" : "Advanced Search - Proposals";
  };

  const getButtonText = () => {
    return activeTab === "opportunities" ? "Search Opportunities" : "Search Proposals";
  };

  return (
    <div className={`sticky top-14 z-40 bg-gray-50 border-b border-gray-200 py-4 mb-6 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-ocean-800">{getTitle()}</h1>
            <Toggle
              size="xs"
              pressed={isExpanded}
              onPressedChange={onToggle}
              aria-label={isExpanded ? "Collapse all sections" : "Expand all sections"}
              className="text-green-600 hover:bg-gray-100 rounded-sm"
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="h-3 w-3 mr-1" />
                  Collapse All
                </>
              ) : (
                <>
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Expand All
                </>
              )}
            </Toggle>
          </div>
          <Button 
            onClick={onSearch}
            className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500 rounded-lg"
            variant="default"
          >
            <Search className="mr-2 h-4 w-4" /> {getButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
