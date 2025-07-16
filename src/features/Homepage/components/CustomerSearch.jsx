import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { customerSearchService } from '@/services/customerSearchService';
import { useHome } from '../contexts/HomeContext';
import { useToast } from '@/features/Opportunity/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const CustomerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchFlag, setSearchFlag] = useState('');
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  const { actions } = useHome();
  const { toast } = useToast();

  // Debounced search function
  const debouncedSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await customerSearchService.quickSearch(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search input changes
  const handleSearchChange = (value) => {
    console.log('Search input changed:', value);
    setSearchQuery(value);
    setSelectedResult(null);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      debouncedSearch(value);
    }, 300);
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      performSearch();
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      performSearch();
    }
  };

  // Perform the actual search
  const performSearch = () => {
    if (!searchQuery.trim()) return;

    const selected = selectedResult || searchResults[0];
    
    if (selected) {
      // Clear search
      setSearchQuery('');
      setSearchResults([]);
      setSelectedResult(null);
      setIsOpen(false);
      setSearchFlag(selected.CustomerId || selected.DisplayName);

      // Handle different types
      if (selected.Type === 'Rep') {
        handleRepSearch(selected.CustomerId);
      } else {
        handleCustomerSearch(selected);
      }
    } else {
      // No selection, perform text search
      handleTextSearch(searchQuery);
    }

    // Focus back to menu button (matching legacy behavior)
    setTimeout(() => {
      const menuButton = document.querySelector('[data-testid="profile-menu-button"]');
      if (menuButton) {
        menuButton.focus();
      }
    }, 100);
  };

  // Handle customer search
  const handleCustomerSearch = (customer) => {
    if (customer.CustomerId && !isNaN(customer.CustomerId)) {
      // Customer ID was selected, go to customer page
      const url = `/ui/ContactEdit?edit=1&Search=1&gscustomerid=${customer.CustomerId}`;
      actions.addTab({
        title: customer.DisplayName || 'Customer',
        url: url,
        type: 'iframe',
        icon: '👤',
        closable: true,
      });
    } else {
      // Text search
      handleTextSearch(customer.DisplayName || searchQuery);
    }
  };

  // Handle rep search
  const handleRepSearch = (repId) => {
    if (!isNaN(repId)) {
      const url = `/ui/ContactSearch?okToRun=YES&gsRepID=${repId}`;
      actions.addTab({
        title: 'Advanced Search',
        url: url,
        type: 'iframe',
        icon: '🔍',
        closable: true,
      });
    }
  };

  // Handle text search
  const handleTextSearch = (searchText) => {
    if (!searchText.trim()) return;

    // Encode search value and navigate to search page
    const encodedSearch = encodeURIComponent(searchText);
    const url = `/ui/ContactSearch?okToRun=YES&customer=${encodedSearch}`;
    
    actions.addTab({
      title: 'Advanced Search',
      url: url,
      type: 'iframe',
      icon: '🔍',
      closable: true,
    });
  };

  // Handle focus (clear search flag)
  const handleFocus = () => {
    if (searchFlag) {
      setSearchQuery('');
      setSearchFlag('');
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative mr-2" style={{ width: '200px' }}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              className="pl-8 pr-8 py-1 bg-ocean-700/30 border border-ocean-200 text-white placeholder-ocean-100 focus:bg-ocean-700/50 focus:border-ocean-300 rounded-full h-8 text-sm w-full min-h-0 focus:text-white"
              style={{ 
                boxShadow: 'none',
                color: 'white',
                backgroundColor: 'rgba(26, 73, 118, 0.3)',
                borderColor: 'rgb(26, 73, 118, 0.2)',
                outline: 'none'
              }}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-ocean-100 h-4 w-4 pointer-events-none" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSearchClick}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-ocean-600/50 rounded-full"
            >
              <Search className="h-3 w-3 text-ocean-100" />
            </Button>
          </div>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-[300px] p-0 bg-white border border-gray-200 shadow-lg rounded-md" 
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <div className="max-h-60 overflow-y-auto">
            {isLoading && (
              <div className="p-4 text-center text-sm text-gray-500">
                Searching...
              </div>
            )}
            
            {!isLoading && searchResults.length === 0 && searchQuery.length >= 3 && (
              <div className="p-4 text-center text-sm text-gray-500">
                No results found.
              </div>
            )}
            
            {!isLoading && searchResults.length > 0 && (
              <div className="py-1">
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.CustomerId}-${index}`}
                    onClick={() => {
                      setSelectedResult(result);
                      setSearchQuery(result.DisplayName);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                      index === 0 ? 'bg-blue-100' : ''
                    }`}
                  >
                    <div className="flex flex-col">
                      <div 
                        className={`font-medium text-sm ${
                          index === 0 ? 'text-black font-bold' : 'text-blue-600'
                        }`}
                        style={{ color: index === 0 ? '#000' : (result.Color || '#2563eb') }}
                      >
                        {result.DisplayName}
                      </div>
                      {result.Type && (
                        <div className="text-xs text-gray-600 mt-1">
                          {result.Type}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {searchQuery.length > 0 && searchQuery.length < 3 && (
              <div className="p-4 text-center text-sm text-gray-500">
                Type at least 3 characters to search
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomerSearch; 