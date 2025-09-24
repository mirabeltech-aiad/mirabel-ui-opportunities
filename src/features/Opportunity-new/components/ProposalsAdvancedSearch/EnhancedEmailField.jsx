import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactDOM from "react-dom";

const EnhancedEmailField = ({ 
  label = "Email", 
  value = [], 
  onChange, 
  placeholder = "Type email or select option..." 
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [popoverStyle, setPopoverStyle] = useState({});

  // Predefined options
  const predefinedOptions = [
    { value: "IN=Is Empty~", label: "Is Empty" },
    { value: "INN=Is Not Empty~", label: "Is Not Empty" }
  ];

  // Ensure value is always an array
  const currentValues = Array.isArray(value) ? value : (value ? 
    (typeof value === 'string' && value.includes(',') ? 
      value.split(',').map(v => v.trim()).filter(v => v) : 
      [value]
    ) : []
  );

  // Update popover position when open
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setPopoverStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        maxHeight: 300,
        padding: 0,
        margin: 0,
        background: '#fff',
        zIndex: 20000
      });
    }
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContainerClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addValue(inputValue.trim());
      setInputValue("");
    }
  };

  const addValue = (value) => {
    if (!value || currentValues.includes(value)) return;
    
    const newValues = [...currentValues, value];
    onChange(newValues);
  };

  const removeValue = (valueToRemove) => {
    const newValues = currentValues.filter(v => v !== valueToRemove);
    onChange(newValues);
  };

  const handleOptionClick = (option) => {
    if (currentValues.includes(option.value)) {
      removeValue(option.value);
    } else {
      addValue(option.value);
    }
  };

  const handleToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Get display text for the input
  const getDisplayText = () => {
    if (currentValues.length === 0) return inputValue;
    if (currentValues.length === 1) {
      const predefined = predefinedOptions.find(option => option.value === currentValues[0]);
      if (predefined) return predefined.label;
      // For custom text, remove SW= and ~ to show user-friendly text
      if (currentValues[0].startsWith('SW=') && currentValues[0].endsWith('~')) {
        return currentValues[0].slice(3, -1); // Remove SW= and ~
      }
      return currentValues[0];
    }
    return `${currentValues.length} selected`;
  };

  return (
    <div className="space-y-2">
      {/* Main input container - styled like other dropdowns */}
      <div className="relative" ref={dropdownRef}>
        <div 
          className={`relative border rounded-md min-h-[42px] cursor-pointer transition-colors ${
            isFocused 
              ? 'border-ocean-500 ring-2 ring-ocean-500/20' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={handleContainerClick}
        >
          {/* Display area */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex-1 min-w-0">
              {currentValues.length === 0 ? (
                <input
                  ref={inputRef}
                  type="email"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={placeholder}
                  className="w-full border-0 p-0 shadow-none focus:ring-0 focus:outline-none bg-transparent"
                  onClick={handleInputClick}
                />
              ) : (
                <div className="flex flex-wrap gap-1">
                  {currentValues.map((value, index) => {
                    const predefined = predefinedOptions.find(option => option.value === value);
                    const displayValue = predefined ? predefined.label : 
                      (value.startsWith('SW=') && value.endsWith('~') ? value.slice(3, -1) : value);
                    
                    return (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-800 border-blue-200"
                      >
                        {displayValue}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1 hover:bg-blue-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeValue(value);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Dropdown */}
        {isDropdownOpen && ReactDOM.createPortal(
          <div
            style={popoverStyle}
            className="border border-gray-300 rounded-md shadow-lg bg-white overflow-hidden"
          >
            {/* Predefined options */}
            <div className="p-2 border-b border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-2">Quick Options</div>
              {predefinedOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-3 py-2 text-sm cursor-pointer rounded hover:bg-gray-100 ${
                    currentValues.includes(option.value) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))}
            </div>

            {/* Custom input */}
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-2">Add Custom Email</div>
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type="email"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type email and press Enter"
                  className="flex-1 text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (inputValue.trim()) {
                      addValue(inputValue.trim());
                      setInputValue("");
                    }
                  }}
                  disabled={!inputValue.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default EnhancedEmailField; 