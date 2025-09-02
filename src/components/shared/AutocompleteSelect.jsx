import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import ReactDOM from "react-dom";
import { cn } from "@/lib/utils";
import axiosService from '@/services/axiosService';
import { getCurrentUserId } from '@/utils/userUtils';
import { API_URLS } from "@/utils/apiUrls"; 
const axiosInstance = axiosService;

const AUTOCOMPLETE_CALL_TIMEDELAY = 500;

const AutocompleteSelect = ({
  label,
  value = [],
  onChange,
  placeholder = "Select...",
  className,
  disabled = false,
  type = "company", // "company" or "email"
}) => {
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const timer = useRef(null);
  const [popoverStyle, setPopoverStyle] = useState({});
  const dropdownId = useRef(`dropdown-${Math.random().toString(36).substr(2, 9)}`).current;

  // Floating label logic
  const hasValue = value && value.length > 0;
  const labelClasses = cn(
    "absolute left-3 transition-all duration-200 pointer-events-none z-10 px-1",
    hasValue || isFocused || open
      ? "top-1.5 text-xs text-primary bg-background"
      : "top-3.5 text-base text-muted-foreground bg-transparent"
  );

  // Calculate dropdown position
  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopoverStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
        maxHeight: 300,
        padding: 0,
        margin: 0,
        background: '#fff',
        zIndex: 99
      });
    }
  };

  // Update dropdown position when it opens
  useEffect(() => {
    if (open) {
      calculateDropdownPosition();
      // Recalculate on window resize and scroll
      const handleResize = () => calculateDropdownPosition();
      const handleScroll = () => calculateDropdownPosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true); // Use capture to catch all scroll events
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [open]);

  const fetchUrl = type === "email"
    ? API_URLS.CONTACTS.DISTINCT_CUSTOMER_EMAILS(getCurrentUserId())
    : API_URLS.CONTACTS.DISTINCT_CUSTOMERS;

  // Handle input change with debouncing
  const handleInputChange = (input) => {
    setInputValue(input);
    if (input.length > 2) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setIsLoading(true);
        axiosInstance.post(fetchUrl, input)
          .then((res) => {
            const result = JSON.parse(res.content.JSONContent);
            const values = type === "email"
              ? [...new Set(result.map((x) => x.Email))]
              : [...new Set(result.map((x) => x.Company))];
            setOptions(values);
          })
          .catch(() => setOptions([]))
          .finally(() => setIsLoading(false));
      }, AUTOCOMPLETE_CALL_TIMEDELAY);
    } else if (input.length === 0) {
      setOptions([]);
    }
  };

  // Handle selection/deselection of values
  const handleSelect = (selectedValue) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onChange(newValue);
    setOpen(true);
  };

  // Remove a selected value
  const handleRemove = (valueToRemove) => {
    onChange(value.filter((v) => v !== valueToRemove));
  };

  // For tag X button
  const handleXButtonClick = (e, tagValue) => {
    e.preventDefault();
    e.stopPropagation();
    setTimeout(() => {
      setOpen(true);
    }, 0);
    handleRemove(tagValue);
  };

  // Display text for button
  const getDisplayText = () => {
    if (value.length === 0) return '';
    if (value.length <= 3) return value.join(', ');
    return `${value.length} selected`;
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('[data-dropdown-content]') ||
          event.target.closest('.cursor-pointer') ||
          event.target.tagName === 'svg' ||
          event.target.closest('svg')) {
        return;
      }
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Global dropdown coordination - close other dropdowns when this one opens
  useEffect(() => {
    const handleGlobalDropdownOpen = (event) => {
      // Close this dropdown if another dropdown opened (and it's not this one)
      if (event.detail.dropdownId !== dropdownId && open) {
        setOpen(false);
        setInputValue("");
        setOptions([]);
      }
    };

    document.addEventListener('globalDropdownOpen', handleGlobalDropdownOpen);
    return () => {
      document.removeEventListener('globalDropdownOpen', handleGlobalDropdownOpen);
    };
  }, [open, dropdownId]);

  // Dispatch global event when this dropdown opens
  useEffect(() => {
    if (open) {
      // Notify other dropdowns to close
      const event = new CustomEvent('globalDropdownOpen', {
        detail: { dropdownId }
      });
      document.dispatchEvent(event);
    }
  }, [open, dropdownId]);

  return (
    <div className={cn("relative w-full", className)}>
      <label htmlFor={label} className={labelClasses}>
        {label}
      </label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className={cn(
          "h-12 pt-6 pb-2 px-3 w-full min-w-0 focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 border bg-white hover:bg-gray-50 transition-colors focus:outline-none rounded-lg text-base shadow-none flex items-center justify-between",
          open ? "border-ocean-500 ring-2 ring-ocean-500" : "border-gray-300",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
        style={{ margin: 0, alignItems: 'center' }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <span className="text-base text-gray-700 truncate text-left">
          {getDisplayText()}
        </span>
        <span className="flex items-center justify-center h-full">
          {/* {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />} */}
        </span>
      </button>
      {open && ReactDOM.createPortal(
        <div
          className="bg-background border border-border shadow-md z-50 rounded-lg overflow-y-auto"
          data-dropdown-content
          style={popoverStyle}
        >
          {/* Selected tags/chips at the top */}
          {value.length > 0 && (
            <div
              className="flex flex-wrap gap-1 px-3 pt-3 pb-1 border-b border-gray-200 bg-gray-50 sticky top-0 z-10 overflow-y-auto"
              style={{ minHeight: '36px', maxHeight: '72px' }}
            >
              {value.slice(0, 3).map((v) => (
                <span key={v} className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded mr-1 border border-blue-200 max-w-full truncate">
                  {v}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer hover:bg-blue-200 rounded"
                    style={{ zIndex: 1000 }}
                    onClick={(e) => handleXButtonClick(e, v)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                </span>
              ))}
              {value.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded border border-gray-300">
                  +{value.length - 3} more
                </span>
              )}
            </div>
          )}
          {/* Search input */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-2 z-20">
            <input
              type="text"
              placeholder="Search company name..."
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-ocean-500 bg-white shadow-none"
              style={{ margin: 0, background: '#fff', zIndex: 10000, fontSize: '15px', height: '36px' }}
              onClick={(e) => e.stopPropagation()}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          {/* Options */}
          <div>
            {isLoading ? (
              <div className="px-3 py-2 text-base text-gray-500">Loading...</div>
            ) : inputValue.length < 3 ? (
              <div className="px-3 py-2 text-base text-gray-500">Start typing to search companies.</div>
            ) : (
              <div>
                {/* Show current input value at the top if it's not already selected and not empty */}
                {inputValue && !value.includes(inputValue) && inputValue.length >= 3 && (
                  <div
                    className="flex items-center space-x-2 py-2 px-4 hover:bg-ocean-50 cursor-pointer text-base border-b border-gray-100"
                    style={{ minHeight: '40px', margin: 0, border: 0 }}
                    onClick={() => handleSelect(inputValue)}
                  >
                    <input
                      type="checkbox"
                      id={`company-${inputValue}-current`}
                      checked={value.includes(inputValue)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelect(inputValue);
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                      onClick={(e) => e.stopPropagation()}
                      style={{ minWidth: 16, minHeight: 16, margin: 0 }}
                    />
                    <label
                      htmlFor={`company-${inputValue}-current`}
                      className="text-base text-gray-700 cursor-pointer flex-1 truncate font-medium"
                      style={{ margin: 0 }}
                    >
                      {inputValue}
                    </label>
                  </div>
                )}
                {/* Show existing options */}
                {options.map((option, index) => (
                  <div
                    key={option}
                    className="flex items-center space-x-2 py-2 px-4 hover:bg-ocean-50 cursor-pointer text-base"
                    style={{ minHeight: '40px', margin: 0, border: 0 }}
                    onClick={() => handleSelect(option)}
                  >
                    <input
                      type="checkbox"
                      id={`company-${option}-${index}`}
                      checked={value.includes(option)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelect(option);
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                      onClick={(e) => e.stopPropagation()}
                      style={{ minWidth: 16, minHeight: 16, margin: 0 }}
                    />
                    <label
                      htmlFor={`company-${option}-${index}`}
                      className="text-base text-gray-700 cursor-pointer flex-1 truncate"
                      style={{ margin: 0 }}
                    >
                      {option}
                    </label>
                  </div>
                ))}
                {/* Show "No results found" message only if no options and no current input value to show */}
                {options.length === 0 && (!inputValue || inputValue.length < 3 || value.includes(inputValue)) && (
                  <div className="px-3 py-2 text-base text-gray-500">No results found.</div>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AutocompleteSelect; 