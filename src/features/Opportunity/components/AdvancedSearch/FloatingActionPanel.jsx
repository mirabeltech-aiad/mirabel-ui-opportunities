
import React, { useState, useEffect } from "react";
import { Button } from "@OpportunityComponents/ui/button";
import { Checkbox } from "@OpportunityComponents/ui/checkbox";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";

const FloatingActionPanel = ({ searchParams, onSearch, onClear, openAccordions, onAccordionChange }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Count active filters
  const activeFilterCount = Object.values(searchParams || {}).filter(
    value => value && value.toString().trim() !== ''
  ).length;

  // Get active filters for display
  const activeFilters = Object.entries(searchParams || {}).filter(
    ([key, value]) => value && value.toString().trim() !== ''
  );

  // Show floating panel when user scrolls down or has active filters
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const shouldShow = scrollTop > 50 || activeFilterCount > 0;
      setIsVisible(shouldShow);
    };

    // Check initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeFilterCount]);

  // Define accordion sections with their labels
  const allSections = [
    { value: "primary-fields", label: "Quick Search" },
    { value: "sales-pipeline", label: "Sales Pipeline" },
    { value: "financial-commercial", label: "Financial Terms" },
    { value: "opportunity-details", label: "Opportunity Details" },
    { value: "account-company", label: "Account Info" },
    { value: "contact-info", label: "Contact Info" },
    { value: "product-solution", label: "Product Details" },
    { value: "geographic-territory", label: "Geographic" }
  ];

  const handleSectionToggle = (sectionValue, checked) => {
    if (checked) {
      // Add section to open accordions
      onAccordionChange([...openAccordions, sectionValue]);
    } else {
      // Remove section from open accordions
      onAccordionChange(openAccordions.filter(item => item !== sectionValue));
    }
  };

  // Handle clearing all filters and closing panel
  const handleClearAll = () => {
    onClear(); // Clear all search parameters
    onAccordionChange([]); // Close all accordions
    setIsVisible(false); // Hide the floating panel
  };

  // Format field names for display
  const formatFieldName = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Truncate long values
  const formatFieldValue = (value) => {
    const str = value.toString();
    return str.length > 20 ? `${str.substring(0, 20)}...` : str;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="bg-white rounded-lg shadow-lg border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Active Filters ({activeFilterCount})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
              title="Clear all filters and close panel"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {activeFilters.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1">
                <span className="font-medium text-gray-600">
                  {formatFieldName(key)}:
                </span>
                <span className="text-gray-800 ml-1">
                  {formatFieldValue(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accordion Controls */}
      <div className="bg-white rounded-lg shadow-lg border p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Sections</span>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {allSections.map((section) => (
            <div key={section.value} className="flex items-center gap-2">
              <Checkbox 
                id={`accordion-${section.value}`}
                checked={openAccordions.includes(section.value)}
                onCheckedChange={(checked) => handleSectionToggle(section.value, checked)}
              />
              <label 
                htmlFor={`accordion-${section.value}`} 
                className="text-xs font-medium text-gray-600 cursor-pointer leading-none"
              >
                {section.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Search Button */}
      <Button 
        onClick={onSearch}
        className="bg-[#4fb3ff] hover:bg-[#4fb3ff]/90 text-white gap-2 shadow-lg"
        size="lg"
      >
        <Search className="h-4 w-4" />
        Search
      </Button>
    </div>
  );
};

export default FloatingActionPanel;
