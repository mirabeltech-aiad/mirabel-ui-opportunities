import React, { useState, useEffect, useRef } from "react";
import FloatingLabelInput from "@OpportunityComponents/ui/FloatingLabelInput";
import { userService } from "@/services/userService";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProposalInfoFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const [proposalRepOptions, setProposalRepOptions] = useState([]);
  const [proposalApprovalStagesOptions, setProposalApprovalStagesOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for dropdown visibility
  const [dropdownStates, setDropdownStates] = useState({
    proposalRep: false,
    proposalStatus: false,
    proposalApprovalStatus: false,
    proposalApprovalStages: false
  });

  // State for dropdown direction (true = upward, false = downward)
  const [dropdownDirections, setDropdownDirections] = useState({
    proposalRep: false,
    proposalStatus: false,
    proposalApprovalStatus: false,
    proposalApprovalStages: false
  });

  // Refs for dropdown buttons
  const dropdownRefs = useRef({});

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching proposal info dropdown data for Proposals tab...');
        
        // Fetch proposal reps
        let proposalRepsData = [];
        try {
          proposalRepsData = await userService.getProposalReps();
          console.log('Successfully fetched proposal reps:', proposalRepsData);
        } catch (err) {
          console.error('Failed to fetch proposal reps:', err);
        }
        
        // Fetch proposal approval stages
        let proposalApprovalStagesData = [];
        try {
          proposalApprovalStagesData = await userService.getProposalApprovalStages();
          console.log('Successfully fetched proposal approval stages:', proposalApprovalStagesData);
        } catch (err) {
          console.error('Failed to fetch proposal approval stages:', err);
        }

        // Set the options
        setProposalRepOptions(Array.isArray(proposalRepsData) ? proposalRepsData : []);
        setProposalApprovalStagesOptions(Array.isArray(proposalApprovalStagesData) ? proposalApprovalStagesData : []);

        console.log('Set proposal info dropdown options:', {
          proposalRepOptions: Array.isArray(proposalRepsData) ? proposalRepsData.length : 0,
          proposalApprovalStagesOptions: Array.isArray(proposalApprovalStagesData) ? proposalApprovalStagesData.length : 0
        });
      } catch (error) {
        console.error('Failed to fetch proposal info dropdown data:', error);
        // Set empty arrays on error
        setProposalRepOptions([]);
        setProposalApprovalStagesOptions([]);
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
      window.dispatchEvent(new CustomEvent('dropdown-toggled', { detail: { component: 'ProposalInfoFields', field } }));
    }
  };

  // Add listener to close dropdowns when triggered from another component
  useEffect(() => {
    const handleExternalToggle = (event) => {
      // Only close dropdowns if the event came from another component
      if (event.detail.component !== 'ProposalInfoFields') {
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
    
    console.log(`Rendering proposal info dropdown for ${field}:`, { 
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
                  optionValue = option[valueKey] || option.value || option.Value || '';
                  optionLabel = option[labelKey] || option.label || option.Display || 'Unknown Option';
                } else {
                  console.warn(`Invalid option format for ${field} at index ${index}:`, option);
                  return null;
                }

                return (
                  <div
                    key={optionValue}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm ${isValueSelected(field, optionValue) ? 'bg-blue-100 text-blue-800 font-semibold' : ''}`}
                    onClick={() => handleMultiSelectChange(field)(optionValue)}
                  >
                    <input
                      type="checkbox"
                      checked={isValueSelected(field, optionValue)}
                      readOnly
                      className="mr-2 align-middle"
                    />
                    {optionLabel}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm">No options</div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Hardcoded proposal status options as shown in the image
  const proposalStatusOptions = [
    { value: "1", label: "No Line Items" },
    { value: "2", label: "InActive" },
    { value: "3", label: "Active" },
    { value: "4", label: "Converted To Contract" }
  ];

  // Hardcoded proposal approval status options as shown in the image
  const proposalApprovalStatusOptions = [
    { value: "0", label: "[Blank]" },
    { value: "1", label: "Sent" },
    { value: "2", label: "Approved" }
  ];

  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        <div className="text-center py-4 text-gray-500">Loading proposal info options...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          {renderCollapsibleDropdown('proposalRep', 'Proposal Rep', proposalRepOptions)}
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          {renderCollapsibleDropdown('proposalStatus', 'Proposal Status', proposalStatusOptions)}
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="proposal-total-from"
            label="From"
            type="number"
            value={searchParams.proposalTotalFrom || ""}
            onChange={handleFieldChange("proposalTotalFrom")}
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="proposal-total-to"
            label="To"
            type="number"
            value={searchParams.proposalTotalTo || ""}
            onChange={handleFieldChange("proposalTotalTo")}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="proposal-name"
            label="Proposal Name"
            value={searchParams.proposalName || ""}
            onChange={handleFieldChange("proposalName")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          {renderCollapsibleDropdown('proposalApprovalStatus', 'Proposal Approval Status', proposalApprovalStatusOptions)}
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="proposal-created-date-from"
            label="Proposal Created Date From"
            type="date"
            value={searchParams.proposalCreatedDateFrom || ""}
            onChange={handleFieldChange("proposalCreatedDateFrom")}
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="proposal-created-date-to"
            label="Proposal Created Date To"
            type="date"
            value={searchParams.proposalCreatedDateTo || ""}
            onChange={handleFieldChange("proposalCreatedDateTo")}
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="proposal-id"
            label="Proposal ID"
            value={searchParams.proposalId || ""}
            onChange={handleFieldChange("proposalId")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          {renderCollapsibleDropdown('proposalApprovalStages', 'Proposal Approval Stages', proposalApprovalStagesOptions, 'StageId', 'Name')}
        </div>
      </div>
    </div>
  );
};

export default ProposalInfoFields;
