import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, X, Loader2 } from 'lucide-react';
import { getApiMethod } from '../../services/advancedSearchApi';

const MultiSelectField = ({ label, value = [], onChange, placeholder = "Select options...", fieldKey, tabType = 'opportunities' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch data when dropdown is opened for the first time
  const fetchOptions = async (search = '') => {
    if (hasLoaded && !search) return; // Don't refetch if already loaded and no search term

    setLoading(true);
    setError(null);

    try {
      const apiMethod = getApiMethod(fieldKey, tabType);
      
      if (apiMethod) {
        const response = await apiMethod(search);
        // Transform API response to expected format
        const transformedOptions = response.map((item, index) => ({
          id: item.id || item.value || index,
          label: item.label || item.name || item.text || item
        }));
        setOptions(transformedOptions);
        setHasLoaded(true);
      } else {
        // No API method found for this field
        setError('No API endpoint configured for this field');
        setOptions([]);
        setHasLoaded(true);
      }
    } catch (err) {
      console.error(`Error fetching options for ${fieldKey}:`, err);
      setError('API Failed');
      setOptions([]);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!isOpen && !hasLoaded) {
      await fetchOptions();
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    const newValue = value.includes(option.id)
      ? value.filter(id => id !== option.id)
      : [...value, option.id];
    
    onChange(newValue);
  };

  const handleRemove = (optionId) => {
    const newValue = value.filter(id => id !== optionId);
    onChange(newValue);
  };

  const getSelectedLabels = () => {
    return value.map(id => options.find(option => option.id === id)?.label).filter(Boolean);
  };

  // Handle search with debouncing
  const handleSearchChange = async (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    // Debounce search API calls
    if (newSearchTerm.length > 2) {
      setTimeout(() => {
        if (newSearchTerm === searchTerm) {
          fetchOptions(newSearchTerm);
        }
      }, 300);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          className="w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1 min-h-[20px]">
              {getSelectedLabels().length > 0 ? (
                getSelectedLabels().map((label, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const optionId = options.find(opt => opt.label === label)?.id;
                        if (optionId) handleRemove(optionId);
                      }}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">{placeholder}</span>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-48 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center px-3 py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="ml-2 text-sm text-gray-500">Loading options...</span>
                </div>
              ) : error ? (
                <div className="px-3 py-2 text-sm text-red-500">{error}</div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.id);
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelect(option)}
                      className={`px-3 py-2 cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-sm">{option.label}</span>
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {searchTerm ? 'No options found' : 'No options available'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectField;