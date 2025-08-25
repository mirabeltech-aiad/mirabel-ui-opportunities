import React, { useState, useEffect } from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import ProposalEnhancedOpportunityNameField from "@/features/Opportunity/components/ProposalsAdvancedSearch/ProposalEnhancedOpportunityNameField";
import EnhancedPhoneField from "@/features/Opportunity/components/ProposalsAdvancedSearch/EnhancedPhoneField";
import EnhancedZipCodeField from "@/features/Opportunity/components/ProposalsAdvancedSearch/EnhancedZipCodeField";
import AutocompleteSelect from "@/components/shared/AutocompleteSelect";
import { getAutocompleteValue } from "@OpportunityUtils/searchUtils";
import { userService } from "@/features/Opportunity/Services/userService";

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

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching dropdown data for Proposals tab...');

        // Set initial opportunity name options with Is Empty/Not Empty
        const initialOpportunityOptions = [
          { value: 'isEmpty', label: 'Is Empty' },
          { value: 'notEmpty', label: 'Not Empty' }
        ];
        setOpportunityNameOptions(initialOpportunityOptions);

        // Fetch all dropdown data
        const [
          createdRepsData,
          assignedRepsData,
          salesPresentersData,
          campaignsData,
          businessUnitsData,
          productsData,
          opportunitiesData
        ] = await Promise.allSettled([
          userService.getOpportunityCreators(),
          userService.getOpportunityCreators(),
          userService.getSalesPresentations(),
          userService.getCampaigns(),
          userService.getBusinessUnits(),
          userService.getProducts(),
          userService.getOpportunities()
        ]);

        // Process created reps
        if (createdRepsData.status === 'fulfilled' && Array.isArray(createdRepsData.value)) {
          setCreatedRepOptions(createdRepsData.value);
        }

        // Process assigned reps
        if (assignedRepsData.status === 'fulfilled' && Array.isArray(assignedRepsData.value)) {
          setAssignedRepOptions(assignedRepsData.value);
        }

        // Process sales presenters
        if (salesPresentersData.status === 'fulfilled' && Array.isArray(salesPresentersData.value)) {
          setSalesPresenterOptions(salesPresentersData.value);
        }

        // Process campaign sources
        if (campaignsData.status === 'fulfilled' && Array.isArray(campaignsData.value)) {
          setCampaignSourceOptions(campaignsData.value);
        }

        // Process business units
        if (businessUnitsData.status === 'fulfilled' && Array.isArray(businessUnitsData.value)) {
          setBusinessUnitOptions(businessUnitsData.value);
        }

        // Process products
        if (productsData.status === 'fulfilled' && Array.isArray(productsData.value)) {
          setProductOptions(productsData.value);
        }

        // Process opportunities
        if (opportunitiesData.status === 'fulfilled' && Array.isArray(opportunitiesData.value)) {
          const apiOpportunityOptions = opportunitiesData.value.map(opp => ({
            value: opp.id || opp.ID || opp.value,
            label: opp.name || opp.Display || opp.opportunityName || 'Unnamed Opportunity'
            }));
            setOpportunityNameOptions([...initialOpportunityOptions, ...apiOpportunityOptions]);
          }

      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

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



  const handleMultiSelectChange = field => values => {
    // For multiselect fields, store values as comma-separated string
    // const valueString = Array.isArray(values) ? values.join(',') : values;
    handleSelectChange(field, values);
  };

  const getSelectedValues = field => {
    const value = searchParams[field];
    if (!value) return [];
    
    // If it's already an array (from context parsing), return as is
    if (Array.isArray(value)) return value;
    
    // If it's a string, parse it
    if (typeof value === 'string') {
      if (value.includes('~')) {
        // Handle IE format string (e.g., "IE=178~IE=170~")
        return value.split('~').filter(Boolean).map(v => v + '~');
      }
      if (value.includes(',')) {
        // Handle comma-separated string
        return value.split(',').filter(v => v.trim());
      }
      // Single value
      return [value];
    }
    
    return [];
  };

  if (isLoading) {
    return (
      <div className="pt-2">
        <div className="space-y-3">
          <div className="text-center py-4 text-gray-500">Loading dropdown options...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="space-y-3">
        {/* Row 1 */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-4 space-y-2">
            <ProposalEnhancedOpportunityNameField
              label="Opportunity Name"
              value={Array.isArray(searchParams.opportunityName) ? searchParams.opportunityName : (searchParams.opportunityName ? [searchParams.opportunityName] : [])}
              onChange={handleMultiSelectChange("opportunityName")}
              placeholder="Type opportunity name or select option..."
            />
          </div>
          <div className="col-span-12 sm:col-span-4 space-y-2">
            <MultiSelectDropdown
              id="created-rep"
              label="Select Created Rep (Proposals)"
              value={getSelectedValues("createdRep")}
              onChange={handleMultiSelectChange("createdRep")}
              options={createdRepOptions}
              placeholder="Select created rep"
              disabled={isLoading}
            />
          </div>
          <div className="col-span-12 sm:col-span-4 space-y-2">
            <MultiSelectDropdown
              id="business-unit"
              label="Business Unit"
              value={getSelectedValues("businessUnit")}
              onChange={handleMultiSelectChange("businessUnit")}
              options={businessUnitOptions}
              placeholder="Select business unit"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-4 space-y-2">
            <AutocompleteSelect
              label="Company Name"
              value={getAutocompleteValue(searchParams.companyName)}
              onChange={(values) => handleSelectFieldChange("companyName")(values.join(','))}
              placeholder="Type to search companies..."
              className="w-full"
            />
          </div>
          <div className="col-span-12 sm:col-span-4 space-y-2">
            <MultiSelectDropdown
              id="assigned-rep"
              label="Select Assigned Rep"
              value={getSelectedValues("assignedRep")}
              onChange={handleMultiSelectChange("assignedRep")}
              options={assignedRepOptions}
              placeholder="Select assigned rep"
              disabled={isLoading}
            />
          </div>
          <div className="col-span-12 sm:col-span-4 space-y-2">
            <MultiSelectDropdown
              id="product"
              label="Product"
              value={getSelectedValues("product")}
              onChange={handleMultiSelectChange("product")}
              options={productOptions}
              placeholder="Select product"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-4 space-y-2">
            <MultiSelectDropdown
              id="primary-campaign-source"
              label="Primary Campaign Source"
              value={getSelectedValues("primaryCampaign")}
              onChange={handleMultiSelectChange("primaryCampaign")}
              options={campaignSourceOptions}
              placeholder="Select campaign source"
              disabled={isLoading}
            />
          </div>
          <div className="col-span-12 sm:col-span-4 space-y-2">
            <MultiSelectDropdown
              id="sales-presenter"
              label="Select Sales Presenter"
              value={getSelectedValues("salesPresenter")}
              onChange={handleMultiSelectChange("salesPresenter")}
              options={salesPresenterOptions}
              placeholder="Select sales presenter"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicSearchFields;