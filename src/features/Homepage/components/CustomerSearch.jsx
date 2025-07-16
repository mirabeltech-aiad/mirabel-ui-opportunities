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
import { navigationService } from '../services/navigationService';

const CustomerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchFlag, setSearchFlag] = useState('');
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  const { actions, tabs } = useHome();
  const { toast } = useToast();

  // Debounced search function
  const debouncedSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 3) {
      setSearchResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);
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

  // Open tab by URL (same pattern as profile menu)
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

      // Handle different types using openTabByUrl pattern
      if (selected.Type === 'Rep' && selected.ContactID) {
        handleRepSearch(selected.ContactID);
      } else if (selected.ContactID && selected.ContactID > 0) {
        handleCustomerSearch(selected);
      } else {
        handleTextSearch(selected.DisplayName || searchQuery);
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

  // Handle customer search using openTabByUrl pattern
  const handleCustomerSearch = (customer) => {
    if (customer.ContactID && !isNaN(customer.ContactID)) {
      // Contact ID was selected, go to contact page
      const url = `/ui/ContactEdit?edit=1&Search=1&gscustomerid=${customer.ContactID}`;
      openTabByUrl(customer.DisplayName || 'Contact', url);
    } else {
      // Text search
      handleTextSearch(customer.DisplayName || searchQuery);
    }
  };

  // Handle rep search using openTabByUrl pattern
  const handleRepSearch = (repId) => {
    if (!isNaN(repId)) {
      const url = `/ui/ContactSearch?okToRun=YES&gsRepID=${repId}`;
      openTabByUrl('Advanced Search', url);
    }
  };

  // Handle text search using openTabByUrl pattern
  const handleTextSearch = (searchText) => {
    if (!searchText.trim()) return;

    // Encode search value and navigate to search page
    const encodedSearch = encodeURIComponent(searchText);
    const url = `/ui/ContactSearch?okToRun=YES&customer=${encodedSearch}`;
    openTabByUrl('Advanced Search', url);
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
    <div className="relative mr-2" style={{ width: '280px' }}>
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
              className="pl-8 pr-8 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full h-10 text-sm w-full min-h-0 focus:text-gray-900"
              style={{ 
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                color: '#111827',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db',
                outline: 'none',
                fontSize: '14px',
                lineHeight: '1.5',
                paddingLeft: '32px',
                paddingRight: '32px',
                paddingTop: '8px',
                paddingBottom: '8px',
                height: '40px',
                width: '100%',
                minWidth: '200px'
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSearchClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
            >
              <Search className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-[300px] p-0 bg-white border border-gray-200 shadow-lg rounded-md" 
          align="start"
          side="bottom"
          sideOffset={4}
          forceMount
        >
          <div className="max-h-60 overflow-y-auto">
            {isLoading && (
              <div className="p-4 text-center text-sm text-gray-500">
                Searching...
              </div>
            )}
            
            {!isLoading && searchResults.length === 0 && searchQuery.length >= 3 && (
              <div className="p-4 text-center text-sm text-gray-500">
                No results found for "{searchQuery}".
              </div>
            )}
            
            {!isLoading && searchResults.length > 0 && (
              <div className="py-1">
                <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </div>
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.CustomerId || result.ContactID}-${index}`}
                    onClick={() => {
                      setSelectedResult(result);
                      setSearchQuery(result.DisplayName);
                      setIsOpen(false);
                      
                      // Handle the search action based on result type
                      if (result.Type === 'Rep' && result.ContactID) {
                        // Rep search - opens search page filtered by rep
                        handleRepSearch(result.ContactID);
                      } else if (result.ContactID && result.ContactID > 0) {
                        // Valid contact - opens contact edit page
                        handleCustomerSearch(result);
                      } else {
                        // Text search - opens search page with text query
                        handleTextSearch(result.DisplayName);
                      }
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