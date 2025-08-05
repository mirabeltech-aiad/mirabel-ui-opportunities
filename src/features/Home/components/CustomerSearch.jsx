import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { customerSearchService } from '@/services/customerSearchService';
import { useHome } from '../contexts/HomeContext';
import { useToast } from '@/components/ui/use-toast';
import { navigationService } from '../services/navigationService';

const CustomerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchFlag, setSearchFlag] = useState('');
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const { actions, tabs } = useHome();
  const { toast } = useToast();

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query || query.trim().length < 3) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await customerSearchService.quickSearch(query);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('CustomerSearch: Search failed:', error);
        setSearchResults([]);
        setShowDropdown(false);
        toast({
          title: "Search Error",
          description: "Failed to search customers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [toast]
  );

  // Handle search input changes
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        // Select the highlighted item
        handleSelectResult(searchResults[selectedIndex]);
      } else {
        // Perform text search
        handleTextSearch(searchQuery);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  // Handle result selection
  const handleSelectResult = (result) => {
    
    // Set the search query to the selected result's display name
    setSearchQuery(result.DisplayName);
    setShowDropdown(false);
    setSelectedIndex(-1);
    setSearchFlag(result.DisplayName);
    
    // Clear the input focus and move focus to menu button (matching legacy behavior)
    if (inputRef.current) {
      inputRef.current.blur();
    }
    
    // Try to focus the menu button (matching legacy behavior)
    const menuButton = document.getElementById("btnMenu");
    if (menuButton) {
      menuButton.focus();
    }
    
    // Navigate based on result type (same logic as legacy)
    if (result.Type === 'Rep') {
      selectCustomersByRep(result.ContactID);
    } else {
      selectCustomer(result.ContactID, result.DisplayName);
    }
  };

  // Handle text search (when no dropdown item is selected)
  const handleTextSearch = (searchText) => {
    if (!searchText.trim()) return;

    // Check if the search text is a numeric contact ID
    const trimmedText = searchText.trim();
    const isNumericId = /^\d+$/.test(trimmedText) && !isNaN(parseInt(trimmedText));
    
    if (isNumericId) {
      // Direct contact record for numeric IDs
      selectCustomer(parseInt(trimmedText), trimmedText);
    } else {
      // Encode search value and navigate to search page for text searches
      const encodedSearch = encodeURIComponent(searchText);
      const url = `/ui/ContactSearch?okToRun=YES&customer=${encodedSearch}`;
      openTabByUrl('Advanced Search', url);
    }
  };

  // Handle focus (clear search flag)
  const handleFocus = () => {
    if (searchFlag) {
      setSearchQuery('');
      setSearchFlag('');
    }
    // Show dropdown if we have results and query is long enough
    if (searchQuery.trim().length >= 3 && searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle blur (hide dropdown after delay)
  const handleBlur = () => {
    // Use a longer delay to allow for clicking on dropdown items
    setTimeout(() => {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }, 300);
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

  // Select customer by ID (matches legacy selectCustomer function)
  const selectCustomer = (customerId, displayName) => {
    if (isNaN(customerId) || !customerId) {
      // Text search
      
      const encodedSearch = encodeURIComponent(displayName || searchQuery);
      const url = `/ui/ContactSearch?okToRun=YES&customer=${encodedSearch}`;
      openTabByUrl('Advanced Search', url);
    } else {
      // Direct customer page
      
      const url = `/ui/contactedit?edit=1&Search=1&gscustomerid=${customerId}`;
      openTabByUrl('Customer', url);
    }
  };

  // Select customers by rep (matches legacy selectCustomersByRep function)
  const selectCustomersByRep = (repId) => {
    if (!isNaN(repId)) {
      const url = `/ui/ContactSearch?okToRun=YES&gsRepID=${repId}`;
      openTabByUrl('Advanced Search', url);
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    handleTextSearch(searchQuery);
  };

  // Debounce utility function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <div className="relative" style={{ width: '185px' }}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pl-8 pr-3 py-1 bg-white/95 backdrop-blur-sm border border-white/30 text-gray-900 placeholder-gray-600 focus:bg-white focus:border-white/50 focus:ring-1 focus:ring-white/30 rounded-full h-7 text-sm w-full min-h-0 focus:text-gray-900 focus:outline-none no-focus-ring"
          style={{
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            color: '#111827',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            outline: 'none',
            fontSize: '13px',
            lineHeight: '1.4',
            paddingLeft: '32px',
            paddingRight: '12px',
            paddingTop: '4px',
            paddingBottom: '4px',
            height: '28px',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none'
          }}
        />
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 h-3.5 w-3.5 pointer-events-none" />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[9999] max-h-60 overflow-y-auto"
          style={{ 
            zIndex: 9999,
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            maxHeight: '240px',
            overflowY: 'auto'
          }}
          onMouseDown={(e) => {
            // Prevent the input from losing focus when clicking inside dropdown
            e.preventDefault();
          }}
        >
          
          {isLoading ? (
            <div className="px-3 py-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div
                key={`${result.ContactID}-${index}`}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                  index === selectedIndex ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                }`}
                onClick={() => handleSelectResult(result)}
                style={{
                  paddingLeft: '10px',
                  paddingRight: '12px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer'
                }}
              >
                <div 
                  className="font-medium text-sm"
                  style={{ color: result.Color || '#333' }}
                >
                  {result.DisplayName}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {result.Type}
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-gray-500">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerSearch; 