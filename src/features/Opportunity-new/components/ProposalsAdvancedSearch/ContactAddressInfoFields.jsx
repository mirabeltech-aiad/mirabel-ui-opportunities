import React, { useState, useEffect } from "react";
import FloatingLabelInput from "@/shared/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import AutocompleteSelect from "@/components/shared/AutocompleteSelect";
import EnhancedPhoneField from "@/features/Opportunity/components/ProposalsAdvancedSearch/EnhancedPhoneField";
import EnhancedZipCodeField from "@/features/Opportunity/components/ProposalsAdvancedSearch/EnhancedZipCodeField";
import { userService } from "@/features/Opportunity/Services/userService";
import { getAutocompleteValue } from "@OpportunityUtils/searchUtils";

const ContactAddressInfoFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const handleMultiSelectChange = field => values => {
    // For multiselect fields, store values as comma-separated string
    const valueString = Array.isArray(values) ? values.join(',') : values;
    handleSelectChange(field, valueString);
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [countyOptions, setCountyOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching contact/address info dropdown data for Proposals tab...');
        
        // Fetch all dropdown data
        const [
          citiesData,
          statesData,
          countriesData,
          countiesData
        ] = await Promise.allSettled([
          userService.getContactCities(),
          userService.getContactStates(),
          userService.getContactCountries(),
          userService.getContactCounties()
        ]);

        // Process cities
        if (citiesData.status === 'fulfilled' && Array.isArray(citiesData.value)) {
          setCityOptions(citiesData.value);
        }

        // Process states
        if (statesData.status === 'fulfilled' && Array.isArray(statesData.value)) {
          setStateOptions(statesData.value);
        }

        // Process countries
        if (countriesData.status === 'fulfilled' && Array.isArray(countriesData.value)) {
          setCountryOptions(countriesData.value);
        }

        // Process counties
        if (countiesData.status === 'fulfilled' && Array.isArray(countiesData.value)) {
          setCountyOptions(countiesData.value);
        }

      } catch (error) {
        console.error('Failed to fetch contact/address dropdown data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSingleSelectChange = field => value => {
    // For single select fields, store value directly
    handleSelectChange(field, value);
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
        {/* Row 1 - Column 1: Email, Phone, Zip */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <AutocompleteSelect
            label="Email"
            type="email"
            value={getAutocompleteValue(searchParams.contactEmail)}
            onChange={(values) => handleSelectFieldChange("contactEmail")(values.join(','))}
            placeholder="Type to search emails..."
            className="w-full"
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <EnhancedPhoneField
            label="Phone Number"
            value={searchParams.contactPhone || []}
            onChange={handleMultiSelectChange("contactPhone")}
            placeholder="Type phone number or select option..."
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <EnhancedZipCodeField
            label="Zip/Postal Code"
            value={searchParams.postalCode || []}
            onChange={handleMultiSelectChange("postalCode")}
            placeholder="Type ZIP code or select option..."
          />
        </div>
      </div>

        {/* Row 2 - Column 2: City, State dropdowns */}
      <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-6 space-y-2">
            <MultiSelectDropdown
              id="city"
              label="City"
              value={getSelectedValues("city")}
              onChange={handleMultiSelectChange("city")}
              options={cityOptions}
              placeholder="Select city"
              disabled={isLoading}
          />
        </div>
          <div className="col-span-12 sm:col-span-6 space-y-2">
            <MultiSelectDropdown
              id="state"
              label="State"
              value={getSelectedValues("state")}
              onChange={handleMultiSelectChange("state")}
              options={stateOptions}
              placeholder="Select state"
              disabled={isLoading}
            />
        </div>
      </div>

        {/* Row 3 - Column 3: County, Country multiselect dropdowns */}
      <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-6 space-y-2">
            <MultiSelectDropdown
              id="county"
              label="County"
              value={getSelectedValues("county")}
              onChange={handleMultiSelectChange("county")}
              options={countyOptions}
              placeholder="Select county"
              disabled={isLoading}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 space-y-2">
            <MultiSelectDropdown
              id="country"
              label="Country"
              value={getSelectedValues("country")}
              onChange={handleMultiSelectChange("country")}
              options={countryOptions}
              placeholder="Select country"
              disabled={isLoading}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAddressInfoFields;
