
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const SearchHeader = ({ onSearch, isExpanded, onToggle }) => {
  return (
    <div className="search-gradient border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#1a4d80]">
              Advanced Proposals Search
            </h1>
            <p className="text-gray-600">
              Find proposals using detailed search criteria and filters
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button 
              variant="outline" 
              onClick={onToggle}
              className="gap-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expand All
                </>
              )}
            </Button>
            
            <Button 
              onClick={onSearch}
              className="gap-2 bg-[#4fb3ff] hover:bg-[#4fb3ff]/90 text-white"
            >
              <Search className="h-4 w-4" />
              Search Proposals
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
