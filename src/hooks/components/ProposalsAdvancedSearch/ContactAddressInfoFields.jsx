import React, { useState, useEffect, useRef } from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";
import { userService } from "@/services/userService";
import { ChevronDown, ChevronUp } from "lucide-react";

const ContactAddressInfoFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const [cityOptions, setCityOptions] = useState([]);
  const [countyOptions, setCountyOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for dropdown visibility
  const [dropdownStates, setDropdownStates] = useState({
    city: false,
    county: false,
    state: false,
    country: false
  });

  // State for dropdown direction (true = upward, false = downward)
  const [dropdownDirections, setDropdownDirections] = useState({
    city: false,
    county: false,
    state: false,
    country: false
  });

  // Refs for dropdown buttons
  const dropdownRefs = useRef({});

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching contact/address info dropdown data for Proposals tab...');
        
        // Fetch cities
        let citiesData = [];
        try {
          citiesData = await userService.getContactCities();
          console.log('Successfully fetched cities:', citiesData);
        } catch (err) {
          console.error('Failed to fetch cities:', err);
        }
        
        // Fetch counties using the new API
        let countiesData = [];
        try {
          countiesData = await userService.getContactCounties();
          console.log('Successfully fetched counties:', countiesData);
        } catch (err) {
          console.error('Failed to fetch counties:', err);
        }
        
        // Fetch states
        let statesData = [];
        try {
          statesData = await userService.getContactStates();
          console.log('Successfully fetched states:', statesData);
        } catch (err) {
          console.error('Failed to fetch states:', err);
        }
        
        // Fetch countries
        let countriesData = [];
        try {
          countriesData = await userService.getContactCountries();
          console.log('Successfully fetched countries:', countriesData);
        } catch (err) {
          console.error('Failed to fetch countries:', err);
        }

        // Set the options
        setCityOptions(Array.isArray(citiesData) ? citiesData : []);
        setCountyOptions(Array.isArray(countiesData) ? countiesData : []);
        setStateOptions(Array.isArray(statesData) ? statesData : []);
        setCountryOptions(Array.isArray(countriesData) ? countriesData : []);

        console.log('Set contact/address dropdown options:', {
          cityOptions: Array.isArray(citiesData) ? citiesData.length : 0,
          countyOptions: Array.isArray(countiesData) ? countiesData.length : 0,
          stateOptions: Array.isArray(statesData) ? statesData.length : 0,
          countryOptions: Array.isArray(countriesData) ? countriesData.length : 0
        });
      } catch (error) {
        console.error('Failed to fetch contact/address dropdown data:', error);
        // Set empty arrays on error
        setCityOptions([]);
        setCountyOptions([]);
        setStateOptions([]);
        setCountryOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const checkDropdownDirection = (field) => {
    const buttonElement = dropdownRefs.current[field];
    if (!buttonElement) return false;

    const rect = buttonElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const dropdownHeight = 240; // max-h-60 = 15rem = 240px

    return spaceBelow < dropdownHeight && rect.top > dropdownHeight;
  };

  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  const handleMultiSelectChange = (field) => (value) => {
    // For multi-select, we'll store values as comma-separated string
    const currentValues = searchParams[field] ? searchParams[field].split(',') : [];
    let newValues;
    
    if (currentValues.includes(value)) {
      // Remove value if already selected
      newValues = currentValues.filter(v => v !== value);
    } else {
      // Add value if not selected
      newValues = [...currentValues, value];
    }
    
    console.log(`Multi-select change for ${field}:`, { value, currentValues, newValues });
    handleSelectChange(field, newValues.join(','));
  };

  const isValueSelected = (field, value) => {
    const currentValues = searchParams[field] ? searchParams[field].split(',') : [];
    return currentValues.includes(value);
  };

  const toggleDropdown = (field) => {
    console.log(`Toggling dropdown for ${field}`);
    
    // Check direction before opening
    const shouldOpenUpward = checkDropdownDirection(field);
    setDropdownDirections(prev => ({
      ...prev,
      [field]: shouldOpenUpward
    }));

    // If clicking on the same dropdown that's already open, close it
    // If clicking on a different dropdown, close all and open the new one
    setDropdownStates(prev => {
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === field && !prev[field];
        return acc;
      }, {});
      
      return newState;
    });
    
    // Notify parent component about the dropdown state change
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('dropdown-toggled', { detail: { component: 'ContactAddressInfoFields', field } }));
    }
  };

  // Add listener to close dropdowns when triggered from another component
  useEffect(() => {
    const handleExternalToggle = (event) => {
      // Only close dropdowns if the event came from another component
      if (event.detail.component !== 'ContactAddressInfoFields') {
        setDropdownStates(prev => 
          Object.keys(prev).reduce((acc, key) => {
            acc[key] = false;
            return acc;
          }, {})
        );
      }
    };

    window.addEventListener('dropdown-toggled', handleExternalToggle);
    
    return () => {
      window.removeEventListener('dropdown-toggled', handleExternalToggle);
    };
  }, []);

  const getSelectedCount = (field) => {
    const currentValues = searchParams[field] ? searchParams[field].split(',').filter(v => v) : [];
    return currentValues.length;
  };

  const getSelectedLabels = (field, options, valueKey = 'value', labelKey = 'label') => {
    const currentValues = searchParams[field] ? searchParams[field].split(',').filter(v => v) : [];
    if (!currentValues.length) return [];

    return currentValues.map(value => {
      const option = options.find(opt => {
        if (typeof opt === 'string') return opt === value;
        return (opt[valueKey] || opt.value || opt.Value) === value;
      });
      
      if (!option) return value;
      
      if (typeof option === 'string') return option;
      
      return option[labelKey] || option.label || option.Display || 'Unknown Option';
    });
  };

  const renderSelectedValues = (field, options, valueKey = 'value', labelKey = 'label') => {
    const selectedLabels = getSelectedLabels(field, options, valueKey, labelKey);
    if (!selectedLabels.length) return null;

    return (
      <div className="mt-2 flex flex-wrap gap-1">
        {selectedLabels.map((label, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md border"
          >
            {label}
          </span>
        ))}
      </div>
    );
  };

  const renderCollapsibleDropdown = (field, label, options, valueKey = 'value', labelKey = 'label') => {
    const isOpen = dropdownStates[field];
    const isUpward = dropdownDirections[field];
    const selectedCount = getSelectedCount(field);
    
    console.log(`Rendering contact/address dropdown for ${field}:`, { 
      isOpen, 
      selectedCount, 
      optionsLength: Array.isArray(options) ? options.length : 0,
      options: options,
      isUpward
    });
    
    return (
      <div className="relative">
        <button
          ref={(el) => dropdownRefs.current[field] = el}
          type="button"
          onClick={() => toggleDropdown(field)}
          className="w-full flex items-center justify-between border border-gray-300 rounded-md p-3 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="text-sm font-medium text-gray-700">
            {label} {selectedCount > 0 && `(${selectedCount} selected)`}
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {/* Selected values display */}
        {renderSelectedValues(field, options, valueKey, labelKey)}
        
        {isOpen && (
          <div
            className="fixed border border-gray-300 rounded-md bg-white shadow-xl max-h-60 overflow-y-auto z-[9999]"
            style={{
              left: dropdownRefs.current[field] ? dropdownRefs.current[field].getBoundingClientRect().left + 'px' : '0',
              top: !isUpward ? (dropdownRefs.current[field] ? dropdownRefs.current[field].getBoundingClientRect().bottom + 'px' : '0') : 'auto',
              bottom: isUpward ? (window.innerHeight - (dropdownRefs.current[field] ? dropdownRefs.current[field].getBoundingClientRect().top : 0)) + 'px' : 'auto',
              width: dropdownRefs.current[field] ? dropdownRefs.current[field].getBoundingClientRect().width + 'px' : 'auto'
            }}
          >
            {Array.isArray(options) && options.length > 0 ? (
              options.map((option, index) => {
                if (!option) {
                  console.warn(`Skipping null/undefined option at index ${index} for ${field}`);
                  return null;
                }
                
                let optionValue, optionLabel;
                
                if (typeof option === 'string') {
                  optionValue = option;
                  optionLabel = option;
                } else if (option && typeof option === 'object') {
                  optionValue = option[valueKey] || option.value || option.Value || '';
                  optionLabel = option[labelKey] || option.label || option.Display || 'Unknown Option';
                } else {
                  console.warn(`Invalid option format for ${field} at index ${index}:`, option);
                  return null;
                }

                return (
                  <div 
                    key={`${field}-${optionValue}-${index}`} 
                    className="flex items-center space-x-2 py-2 px-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      id={`${field}-${optionValue}-${index}`}
                      checked={isValueSelected(field, optionValue)}
                      onChange={() => handleMultiSelectChange(field)(optionValue)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`${field}-${optionValue}-${index}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                      {optionLabel}
                    </label>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-500 py-2 px-3 bg-white">
                {isLoading ? 'Loading...' : 'No options available'}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        <div className="text-center py-4 text-gray-500">Loading contact/address options...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="email"
            label="Email"
            type="email"
            value={searchParams.email || ""}
            onChange={handleFieldChange("email")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          {renderCollapsibleDropdown('city', 'City', cityOptions)}
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          {renderCollapsibleDropdown('county', 'County', countyOptions)}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="phone-number"
            label="Phone Number"
            type="tel"
            value={searchParams.phoneNumber || ""}
            onChange={handleFieldChange("phoneNumber")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          {renderCollapsibleDropdown('state', 'State', stateOptions)}
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          {renderCollapsibleDropdown('country', 'Country', countryOptions)}
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="zip-postal-code"
            label="Zip/Postal Code"
            value={searchParams.zipPostalCode || ""}
            onChange={handleFieldChange("zipPostalCode")}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactAddressInfoFields;
