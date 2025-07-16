import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { customerSearchService } from '@/services/customerSearchService';
import { useHome } from '../contexts/HomeContext';
import { useToast } from '@/features/Opportunity/hooks/use-toast';
import { navigationService } from '../services/navigationService';

const CustomerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFlag, setSearchFlag] = useState('');
  const inputRef = useRef(null);

  const { actions, tabs } = useHome();
  const { toast } = useToast();

  // Handle search input changes
  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleTextSearch(searchQuery);
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

  return (
    <div className="relative" style={{ width: '150px' }}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="pl-8 pr-4 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 rounded-full h-10 text-sm w-full min-h-0 focus:text-gray-900 focus:outline-none focus:ring-0 focus:shadow-none no-focus-ring"
          style={{
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            color: '#111827',
            backgroundColor: '#ffffff',
            borderColor: '#d1d5db',
            outline: 'none',
            fontSize: '14px',
            lineHeight: '1.5',
            paddingLeft: '32px',
            paddingRight: '16px',
            paddingTop: '8px',
            paddingBottom: '8px',
            height: '30px',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none'
          }}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
      </div>
    </div>
  );
};

export default CustomerSearch; 