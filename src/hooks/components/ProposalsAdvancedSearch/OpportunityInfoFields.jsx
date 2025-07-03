import React, { useState, useEffect, useRef } from "react";
import FloatingLabelInput from "@OpportunityComponents/ui/FloatingLabelInput";
import { userService } from "@/services/userService";
import { ChevronDown, ChevronUp } from "lucide-react";

const OpportunityInfoFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const [statusOptions, setStatusOptions] = useState([]);
  const [stageOptions, setStageOptions] = useState([]);
  const [probabilityOptions, setProbabilityOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [lossReasonOptions, setLossReasonOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for dropdown visibility
  const [dropdownStates, setDropdownStates] = useState({
    status: false,
    stage: false,
    probability: false,
    type: false,
    lossReason: false
  });

  // State for dropdown direction (true = upward, false = downward)
  const [dropdownDirections, setDropdownDirections] = useState({
    status: false,
    stage: false,
    probability: false,
    type: false,
    lossReason: false
  });

  // Refs for dropdown buttons
  const dropdownRefs = useRef({});

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching opportunity info dropdown data for Proposals tab...');
        
        // Set hardcoded status options
        const hardcodedStatus = [
          { label: 'All', value: 'all' },
          { label: 'Open', value: 'open' },
          { label: 'Won', value: 'won' },
          { label: 'Lost', value: 'lost' }
        ];
        setStatusOptions(hardcodedStatus);
        console.log('Set hardcoded status options:', hardcodedStatus);
        
        // Fetch stage options using new API structure
        let stagesData = [];
        try {
          stagesData = await userService.getStages();
          console.log('Successfully fetched stage options:', stagesData);
        } catch (err) {
          console.error('Failed to fetch stage options:', err);
        }
        
        // Set hardcoded probability options
        const hardcodedProbability = [];
        for (let i = 10; i <= 100; i += 10) {
          hardcodedProbability.push({ label: `${i}%`, value: i.toString() });
        }
        setProbabilityOptions(hardcodedProbability);
        console.log('Set hardcoded probability options:', hardcodedProbability);
        
        // Fetch type options using new API structure
        let typesData = [];
        try {
          typesData = await userService.getOpportunityTypes();
          console.log('Successfully fetched type options:', typesData);
        } catch (err) {
          console.error('Failed to fetch type options:', err);
        }
        
        // Fetch loss reason options using new API structure
        let lossReasonsData = [];
        try {
          lossReasonsData = await userService.getLossReasons();
          console.log('Successfully fetched loss reason options:', lossReasonsData);
        } catch (err) {
          console.error('Failed to fetch loss reason options:', err);
        }

        // Set the options
        setStageOptions(Array.isArray(stagesData) ? stagesData : []);
        setTypeOptions(Array.isArray(typesData) ? typesData : []);
        setLossReasonOptions(Array.isArray(lossReasonsData) ? lossReasonsData : []);

        console.log('Set opportunity info dropdown options:', {
          statusOptions: hardcodedStatus.length,
          stageOptions: Array.isArray(stagesData) ? stagesData.length : 0,
          probabilityOptions: hardcodedProbability.length,
          typeOptions: Array.isArray(typesData) ? typesData.length : 0,
          lossReasonOptions: Array.isArray(lossReasonsData) ? lossReasonsData.length : 0
        });
      } catch (error) {
        console.error('Failed to fetch opportunity info dropdown data:', error);
        // Set empty arrays on error
        setStatusOptions([]);
        setStageOptions([]);
        setProbabilityOptions([]);
        setTypeOptions([]);
        setLossReasonOptions([]);
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
    const currentValues = searchParams[field] ? searchParams[field].split(',').filter(v => v) : [];
    
    // Convert value to string for consistent comparison
    const stringValue = String(value);
    
    console.log(`Checking if value is selected for ${field}:`, { 
      value: stringValue, 
      currentValues, 
      searchParams: searchParams[field],
      isSelected: currentValues.includes(stringValue)
    });
    
    return currentValues.includes(stringValue);
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
      window.dispatchEvent(new CustomEvent('dropdown-toggled', { detail: { component: 'OpportunityInfoFields', field } }));
    }
  };

  // Add listener to close dropdowns when triggered from another component
  useEffect(() => {
    const handleExternalToggle = (event) => {
      // Only close dropdowns if the event came from another component
      if (event.detail.component !== 'OpportunityInfoFields') {
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
        // Convert both to strings for consistent comparison
        const optionValue = String(opt[valueKey] || opt.value || opt.Value || opt.ID || '');
        return optionValue === String(value);
      });
      
      if (!option) return value;
      
      if (typeof option === 'string') return option;
      
      if (field === 'type') {
        return option.Name || option.label || option.Display || 'Unknown Type';
      } else if (field === 'stage') {
        return option.Stage || option.label || option.Display || 'Unknown Stage';
      } else if (field === 'lossReason') {
        return option.Name || option.label || option.Display || 'Unknown Reason';
      } else {
        return option[labelKey] || option.label || option.Display || 'Unknown Option';
      }
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
    
    console.log(`Rendering opportunity info dropdown for ${field}:`, { 
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
              top: !isUpward
                ? dropdownRefs.current[field]
                  ? dropdownRefs.current[field].getBoundingClientRect().bottom + 'px'
                  : '0'
                : 'auto',
              bottom: isUpward
                ? window.innerHeight -
                  (dropdownRefs.current[field]
                    ? dropdownRefs.current[field].getBoundingClientRect().top
                    : 0) + 'px'
                : 'auto',
              width: dropdownRefs.current[field]
                ? dropdownRefs.current[field].getBoundingClientRect().width + 'px'
                : 'auto'
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
                  // Handle different API response structures
                  if (field === 'type') {
                    optionValue = String(option.ID || option.id || '');
                    optionLabel = option.Name || option.name || 'Unknown Type';
                  } else if (field === 'stage') {
                    optionValue = String(option.ID || option.id || '');
                    optionLabel = option.Stage || option.stage || 'Unknown Stage';
                  } else if (field === 'lossReason') {
                    optionValue = String(option.ID || option.id || '');
                    optionLabel = option.Name || option.name || 'Unknown Reason';
                  } else {
                    optionValue = String(option[valueKey] || option.value || option.Value || option.ID || '');
                    optionLabel = option[labelKey] || option.label || option.Display || option.Stage || option.Status || option.Type || option.LossReason || 'Unnamed Option';
                  }
                } else {
                  console.warn(`Invalid option format for ${field} at index ${index}:`, option);
                  return null;
                }

                const isChecked = isValueSelected(field, optionValue);
                console.log(`Checkbox state for ${field} option ${optionValue}:`, { isChecked, optionValue, optionLabel });

                return (
                  <div 
                    key={`${field}-${optionValue}-${index}`} 
                    className="flex items-center space-x-3 py-2 px-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleMultiSelectChange(field)(optionValue)}
                  >
                    <input
                      type="checkbox"
                      id={`${field}-${optionValue}-${index}`}
                      checked={isChecked}
                      onChange={() => handleMultiSelectChange(field)(optionValue)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                    />
                    <label htmlFor={`${field}-${optionValue}-${index}`} className="text-sm text-gray-700 cursor-pointer flex-1 leading-relaxed">
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
        <div className="text-center py-4 text-gray-500">Loading opportunity info options...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          {renderCollapsibleDropdown('status', 'Status', statusOptions)}
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="created-date-from"
            label="Created Date From"
            type="date"
            value={searchParams.createdDateFrom || ""}
            onChange={handleFieldChange("createdDateFrom")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="created-date-to"
            label="Created Date To"
            type="date"
            value={searchParams.createdDateTo || ""}
            onChange={handleFieldChange("createdDateTo")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          {renderCollapsibleDropdown('type', 'Type', typeOptions)}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          {renderCollapsibleDropdown('stage', 'Stage', stageOptions)}
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="projected-close-date-from"
            label="Projected Close Date From"
            type="date"
            value={searchParams.projectedCloseDateFrom || ""}
            onChange={handleFieldChange("projectedCloseDateFrom")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="projected-close-date-to"
            label="Projected Close Date To"
            type="date"
            value={searchParams.projectedCloseDateTo || ""}
            onChange={handleFieldChange("projectedCloseDateTo")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          {renderCollapsibleDropdown('lossReason', 'Loss Reason', lossReasonOptions)}
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          {renderCollapsibleDropdown('probability', 'Probability', probabilityOptions)}
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="actual-close-date-from"
            label="Actual Close Date From"
            type="date"
            value={searchParams.actualCloseDateFrom || ""}
            onChange={handleFieldChange("actualCloseDateFrom")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="actual-close-date-to"
            label="Actual Close Date To"
            type="date"
            value={searchParams.actualCloseDateTo || ""}
            onChange={handleFieldChange("actualCloseDateTo")}
          />
        </div>
      </div>
    </div>
  );
};

export default OpportunityInfoFields;
