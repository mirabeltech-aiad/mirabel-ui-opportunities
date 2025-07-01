import React, { useState, useEffect, useRef } from "react";
import FloatingLabelInput from "@OpportunityComponents/ui/FloatingLabelInput";
import FloatingLabelSelect from "@OpportunityComponents/ui/FloatingLabelSelect";
import { userService } from "@/services/userService";
import { ChevronDown, ChevronUp } from "lucide-react";
const BasicSearchFields = ({
  handleInputChange,
  handleSelectChange,
  searchParams = {}
}) => {
  const [createdRepOptions, setCreatedRepOptions] = useState([]);
  const [assignedRepOptions, setAssignedRepOptions] = useState([]);
  const [salesPresenterOptions, setSalesPresenterOptions] = useState([]);
  const [campaignSourceOptions, setCampaignSourceOptions] = useState([]);
  const [businessUnitOptions, setBusinessUnitOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [opportunityNameOptions, setOpportunityNameOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for dropdown visibility
  const [dropdownStates, setDropdownStates] = useState({
    createdRep: false,
    assignedRep: false,
    salesPresenter: false,
    primaryCampaignSource: false,
    businessUnit: false,
    product: false,
    opportunityName: false
  });

  // State for dropdown direction (true = upward, false = downward)
  const [dropdownDirections, setDropdownDirections] = useState({
    createdRep: false,
    assignedRep: false,
    salesPresenter: false,
    primaryCampaignSource: false,
    businessUnit: false,
    product: false,
    opportunityName: false
  });

  // Refs for dropdown buttons
  const dropdownRefs = useRef({});
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching dropdown data for Proposals tab...');

        // Set initial opportunity name options with Is Empty/Not Empty
        const initialOpportunityOptions = [{
          id: 'isEmpty',
          name: 'Is Empty'
        }, {
          id: 'notEmpty',
          name: 'Not Empty'
        }];
        setOpportunityNameOptions(initialOpportunityOptions);

        // Explicitly await each API call to handle errors individually
        let createdRepsData = [];
        try {
          createdRepsData = await userService.getOpportunityCreators();
          console.log('Successfully fetched created reps:', createdRepsData);
        } catch (err) {
          console.error('Failed to fetch created reps:', err);
        }
        let assignedRepsData = [];
        try {
          assignedRepsData = await userService.getUsersForDropdown();
          console.log('Successfully fetched assigned reps:', assignedRepsData);
        } catch (err) {
          console.error('Failed to fetch assigned reps:', err);
        }
        let salesPresentersData = [];
        try {
          salesPresentersData = await userService.getSalesPresentations();
          console.log('Successfully fetched sales presenters:', salesPresentersData);
        } catch (err) {
          console.error('Failed to fetch sales presenters:', err);
        }
        let campaignsData = [];
        try {
          campaignsData = await userService.getCampaigns();
          console.log('Successfully fetched campaigns:', campaignsData);
        } catch (err) {
          console.error('Failed to fetch campaigns:', err);
        }
        let businessUnitsData = [];
        try {
          businessUnitsData = await userService.getBusinessUnits();
          console.log('Successfully fetched business units:', businessUnitsData);
        } catch (err) {
          console.error('Failed to fetch business units:', err);
        }
        let productsData = [];
        try {
          productsData = await userService.getProducts();
          console.log('Successfully fetched products:', productsData);
        } catch (err) {
          console.error('Failed to fetch products:', err);
        }
        let opportunitiesData = [];
        try {
          opportunitiesData = await userService.getOpportunities();
          console.log('Successfully fetched opportunities:', opportunitiesData);

          // If we have opportunities from API, add them to the initial options
          if (Array.isArray(opportunitiesData) && opportunitiesData.length > 0) {
            const apiOpportunityOptions = opportunitiesData.map(opp => ({
              id: opp.id || opp.ID || opp.value,
              name: opp.name || opp.Display || opp.opportunityName || 'Unnamed Opportunity'
            }));
            setOpportunityNameOptions([...initialOpportunityOptions, ...apiOpportunityOptions]);
          }
        } catch (err) {
          console.error('Failed to fetch opportunities:', err);
          // Keep the initial options even if API fails
        }

        // Process and set data
        setCreatedRepOptions(Array.isArray(createdRepsData) ? createdRepsData : []);
        setAssignedRepOptions(Array.isArray(assignedRepsData) ? assignedRepsData : []);
        setSalesPresenterOptions(Array.isArray(salesPresentersData) ? salesPresentersData : []);
        setCampaignSourceOptions(Array.isArray(campaignsData) ? campaignsData : []);
        setBusinessUnitOptions(Array.isArray(businessUnitsData) ? businessUnitsData : []);
        setProductOptions(Array.isArray(productsData) ? productsData : []);
        console.log('Set dropdown options:', {
          createdRepOptions: Array.isArray(createdRepsData) ? createdRepsData.length : 0,
          assignedRepOptions: Array.isArray(assignedRepsData) ? assignedRepsData.length : 0,
          salesPresenterOptions: Array.isArray(salesPresentersData) ? salesPresentersData.length : 0,
          campaignSourceOptions: Array.isArray(campaignsData) ? campaignsData.length : 0,
          businessUnitOptions: Array.isArray(businessUnitsData) ? businessUnitsData.length : 0,
          productOptions: Array.isArray(productsData) ? productsData.length : 0,
          opportunityNameOptions: opportunityNameOptions.length
        });
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
        // Set empty arrays on error, but keep opportunity name options
        setCreatedRepOptions([]);
        setAssignedRepOptions([]);
        setSalesPresenterOptions([]);
        setCampaignSourceOptions([]);
        setBusinessUnitOptions([]);
        setProductOptions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDropdownData();
  }, []);

  // Let's add a method to check the userService and debug API calls
  const debugApiMethods = () => {
    console.log('Available userService methods:', Object.keys(userService));
    // Check if the methods we need exist
    console.log('getOpportunityCreators exists:', !!userService.getOpportunityCreators);
    console.log('getUsersForDropdown exists:', !!userService.getUsersForDropdown);
    console.log('getSalesPresentations exists:', !!userService.getSalesPresentations);
    console.log('getCampaigns exists:', !!userService.getCampaigns);
    console.log('getBusinessUnits exists:', !!userService.getBusinessUnits);
    console.log('getProducts exists:', !!userService.getProducts);
    console.log('getOpportunities exists:', !!userService.getOpportunities);
  };

  // Call debug function
  useEffect(() => {
    debugApiMethods();
  }, []);
  const checkDropdownDirection = field => {
    const buttonElement = dropdownRefs.current[field];
    if (!buttonElement) return false;
    const rect = buttonElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const dropdownHeight = 240; // max-h-60 = 15rem = 240px

    return spaceBelow < dropdownHeight && rect.top > dropdownHeight;
  };
  const handleFieldChange = field => value => {
    handleInputChange({
      target: {
        name: field,
        value
      }
    });
  };
  const handleSelectFieldChange = field => value => {
    // Special handling for opportunityName field with Is Empty/Not Empty options
    if (field === 'opportunityName') {
      if (value === 'isEmpty') {
        handleSelectChange(field, 'IN=Is Empty~');
        return;
      } else if (value === 'notEmpty') {
        handleSelectChange(field, 'INN=Is Not Empty~');
        return;
      }
    }
    handleSelectChange(field, value);
  };
  const handleMultiSelectChange = field => value => {
    console.log(`Multi-select change for ${field}:`, {
      value,
      searchParams
    });

    // For all multi-select fields, use simple comma-separated format
    const currentValues = searchParams[field] ? searchParams[field].split(',') : [];
    let newValues;
    if (currentValues.includes(value)) {
      // Remove value if already selected
      newValues = currentValues.filter(v => v !== value);
    } else {
      // Add value if not selected
      newValues = [...currentValues, value];
    }
    console.log(`Multi-select change for ${field}:`, {
      value,
      currentValues,
      newValues
    });
    handleSelectChange(field, newValues.join(','));
  };
  const isValueSelected = (field, value) => {
    if (field === 'opportunityName') {
      const currentValue = searchParams[field] || '';
      if (value === 'isEmpty') {
        return currentValue === 'IN=Is Empty~';
      } else if (value === 'notEmpty') {
        return currentValue === 'INN=Is Not Empty~';
      }
    }

    // For all other fields including salesPresenter, use simple comma-separated check
    const currentValues = searchParams[field] ? searchParams[field].split(',') : [];
    return currentValues.includes(value);
  };
  const toggleDropdown = field => {
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

    // Notify parent component about the dropdown state change (if needed)
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('dropdown-toggled', {
        detail: {
          component: 'BasicSearchFields',
          field
        }
      }));
    }
  };
  const getSelectedCount = field => {
    // For all fields including salesPresenter, use simple comma-separated count
    const currentValues = searchParams[field] ? searchParams[field].split(',').filter(v => v) : [];
    return currentValues.length;
  };
  const getSelectedLabels = (field, options, valueKey = 'value', labelKey = 'label') => {
    if (field === 'opportunityName') {
      const currentValue = searchParams[field] || '';
      if (currentValue === 'IN=Is Empty~') {
        return ['Is Empty'];
      } else if (currentValue === 'INN=Is Not Empty~') {
        return ['Not Empty'];
      }
    }

    // For all other fields including salesPresenter, use simple comma-separated format
    const currentValues = searchParams[field] ? searchParams[field].split(',').filter(v => v) : [];
    if (!currentValues.length) return [];
    return currentValues.map(value => {
      const option = options.find(opt => {
        if (typeof opt === 'string') return opt === value;
        return (opt[valueKey] || opt.value || opt.Value || opt.ID) === value;
      });
      if (!option) return value;
      if (typeof option === 'string') return option;
      if (field === 'assignedRep') {
        return option.display || option.label || option.Display || `${option.FirstName || ''} ${option.LastName || ''}`.trim() || 'Unnamed Rep';
      } else if (field === 'salesPresenter') {
        return option.label || `${option.FirstName || ''} ${option.LastName || ''}`.trim() || 'Unnamed Presenter';
      } else if (field === 'primaryCampaignSource') {
        return option.label || option.Source || 'Unknown Campaign';
      } else {
        return option[labelKey] || option.label || option.Display || option.Source || 'Unknown Option';
      }
    });
  };
  const renderSelectedValues = (field, options, valueKey = 'value', labelKey = 'label') => {
    const selectedLabels = getSelectedLabels(field, options, valueKey, labelKey);
    if (!selectedLabels.length) return null;
    return <div className="mt-2 flex flex-wrap gap-1">
        {selectedLabels.map((label, index) => <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md border">
            {label}
          </span>)}
      </div>;
  };
  const renderCollapsibleDropdown = (field, label, options, valueKey = 'value', labelKey = 'label') => {
    const isOpen = dropdownStates[field];
    const isUpward = dropdownDirections[field];
    const selectedCount = getSelectedCount(field);
    console.log(`Rendering dropdown for ${field}:`, {
      isOpen,
      selectedCount,
      optionsLength: Array.isArray(options) ? options.length : 0,
      options: options,
      isUpward
    });
    return <div className="relative">
        <button ref={el => dropdownRefs.current[field] = el} type="button" onClick={() => toggleDropdown(field)} className="w-full flex items-center justify-between border border-gray-300 p-3 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
          <span className="text-sm font-medium text-gray-700">
            {label} {selectedCount > 0 && `(${selectedCount} selected)`}
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {/* Selected values display */}
        {renderSelectedValues(field, options, valueKey, labelKey)}
        
        {isOpen && <div className={`fixed ${isUpward ? 'bottom-auto mb-1' : 'top-auto mt-1'} 
              border border-gray-300 rounded-md bg-white shadow-xl 
              max-h-60 overflow-y-auto w-[calc(100%-2rem)] z-[9999]`} style={{
        left: dropdownRefs.current[field] ? dropdownRefs.current[field].getBoundingClientRect().left + 'px' : '0',
        top: !isUpward ? dropdownRefs.current[field] ? dropdownRefs.current[field].getBoundingClientRect().bottom + 'px' : '0' : 'auto',
        bottom: isUpward ? window.innerHeight - (dropdownRefs.current[field] ? dropdownRefs.current[field].getBoundingClientRect().top : 0) + 'px' : 'auto',
        width: dropdownRefs.current[field] ? dropdownRefs.current[field].getBoundingClientRect().width + 'px' : 'auto'
      }}>
            {Array.isArray(options) && options.length > 0 ? options.map((option, index) => {
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
            if (field === 'opportunityName') {
              // Special handling for is empty/not empty options
              if (option.id === 'isEmpty' || option.id === 'notEmpty') {
                optionValue = option.id === 'isEmpty' ? 'isEmpty' : 'notEmpty';
                optionLabel = option.name;
              } else {
                optionValue = option.id || option.value || option.ID || '';
                optionLabel = option.name || option.label || option.Display || option.opportunityName || 'Unnamed Opportunity';
              }
            } else if (field === 'assignedRep') {
              optionValue = option.id || option.value || `IE=${option.Value}~` || '';
              optionLabel = option.display || option.label || option.Display || `${option.FirstName || ''} ${option.LastName || ''}`.trim() || 'Unnamed Rep';
            } else if (field === 'salesPresenter') {
              // Use ID for the value - same format as assignedRep
              optionValue = option.id || option.value || `IE=${option.Value}~` || '';
              optionLabel = option.label || `${option.FirstName || ''} ${option.LastName || ''}`.trim() || 'Unnamed Presenter';
              console.log('Sales Presenter option:', {
                option,
                optionValue,
                optionLabel
              });
            } else if (field === 'primaryCampaignSource') {
              optionValue = option.value || option.Source || '';
              optionLabel = option.label || option.Source || 'Unknown Campaign';
            } else {
              optionValue = option[valueKey] || option.value || option.Value || option.ID || '';
              optionLabel = option[labelKey] || option.label || option.Display || option.Source || `${option.FirstName || ''} ${option.LastName || ''}`.trim() || 'Unnamed Option';
            }
          } else {
            console.warn(`Invalid option format for ${field} at index ${index}:`, option);
            return null;
          }
          return <div key={`${field}-${optionValue}-${index}`} className="flex items-center space-x-2 py-2 px-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                    <input type="checkbox" id={`${field}-${optionValue}-${index}`} checked={isValueSelected(field, optionValue)} onChange={() => field === 'opportunityName' ? handleSelectFieldChange(field)(optionValue) : handleMultiSelectChange(field)(optionValue)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor={`${field}-${optionValue}-${index}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                      {optionLabel}
                    </label>
                  </div>;
        }) : <div className="text-sm text-gray-500 py-2 px-3 bg-white">
                {isLoading ? 'Loading...' : 'No options available'}
              </div>}
          </div>}
      </div>;
  };
  if (isLoading) {
    return <div className="pt-2">
        <div className="space-y-3">
          <div className="text-center py-4 text-gray-500">Loading dropdown options...</div>
        </div>
      </div>;
  }
  return <div className="pt-2">
      <div className="space-y-3">
        {/* Row 1 */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-4 space-y-2">
            {renderCollapsibleDropdown('opportunityName', 'Opportunity Name', opportunityNameOptions, 'id', 'name')}
          </div>
          <div className="col-span-12 sm:col-span-4 space-y-2">
            {renderCollapsibleDropdown('createdRep', 'Select Created Rep (Proposals)', createdRepOptions)}
          </div>
          <div className="col-span-12 sm:col-span-4 space-y-2">
            {renderCollapsibleDropdown('businessUnit', 'Business Unit', businessUnitOptions)}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-4 space-y-2">
            <FloatingLabelInput id="company-name" label="Company Name" value={searchParams.companyName || ""} onChange={handleFieldChange("companyName")} />
          </div>
          <div className="col-span-12 sm:col-span-4 space-y-2">
            {renderCollapsibleDropdown('assignedRep', 'Select Assigned Rep', assignedRepOptions, 'id', 'display')}
          </div>
          <div className="col-span-12 sm:col-span-4 space-y-2">
            {renderCollapsibleDropdown('product', 'Product', productOptions)}
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-4 space-y-2">
            {renderCollapsibleDropdown('primaryCampaignSource', 'Primary Campaign Source', campaignSourceOptions)}
          </div>
          <div className="col-span-12 sm:col-span-4 space-y-2">
            {renderCollapsibleDropdown('salesPresenter', 'Select Sales Presenter', salesPresenterOptions)}
          </div>
        </div>
      </div>
    </div>;
};
export default BasicSearchFields;