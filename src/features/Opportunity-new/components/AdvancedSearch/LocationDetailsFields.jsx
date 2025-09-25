
import React, { useState, useEffect } from "react";
import FloatingLabelInput from "@/shared/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/shared/components/ui/FloatingLabelSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import EnhancedZipCodeField from "@/features/Opportunity/components/AdvancedSearch/EnhancedZipCodeField";
import { userService } from "@/features/Opportunity/Services/userService";

const LocationDetailsFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [states, setStates] = useState([]);
  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoadingCountries(true);
        const countriesData = await userService.getContactCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        setCountries([]);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    const fetchStates = async () => {
      try {
        setIsLoadingStates(true);
        const statesData = await userService.getContactStates();
        setStates(statesData);
      } catch (error) {
        console.error('Failed to fetch states:', error);
        setStates([]);
      } finally {
        setIsLoadingStates(false);
      }
    };

    const fetchCities = async () => {
      try {
        setIsLoadingCities(true);
        const citiesData = await userService.getContactCities();
        setCities(citiesData);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
        setCities([]);
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCountries();
    fetchStates();
    fetchCities();
  }, []);

  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  const handleMultiSelectChange = field => values => {
    // Pass the array directly to maintain separate chips for each value
    handleSelectChange(field, values);
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 - Geographic Info - optimized for different field types */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="country"
            label="Country"
            value={Array.isArray(searchParams.country) ? searchParams.country : (searchParams.country ? [searchParams.country] : [])}
            onChange={handleSelectFieldChange("country")}
            options={countries}
            placeholder={isLoadingCountries ? "Loading countries..." : "Select country"}
            disabled={isLoadingCountries}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="state"
            label="State/Province"
            value={Array.isArray(searchParams.state) ? searchParams.state : (searchParams.state ? [searchParams.state] : [])}
            onChange={handleSelectFieldChange("state")}
            options={states}
            placeholder={isLoadingStates ? "Loading states..." : "Select state"}
            disabled={isLoadingStates}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="city"
            label="City"
            value={Array.isArray(searchParams.city) ? searchParams.city : (searchParams.city ? [searchParams.city] : [])}
            onChange={handleSelectFieldChange("city")}
            options={cities}
            placeholder={isLoadingCities ? "Loading cities..." : "Select city"}
            disabled={isLoadingCities}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <EnhancedZipCodeField
            label="ZIP/Postal Code"
            value={Array.isArray(searchParams.postalCode) ? searchParams.postalCode : (searchParams.postalCode ? [searchParams.postalCode] : [])}
            onChange={handleMultiSelectChange("postalCode")}
            placeholder="Type ZIP code or select option..."
          />
        </div>
      </div>

      {/* Row 2 - Sales Region - give it more space for longer region names */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <MultiSelectDropdown
            id="sales-region"
            label="Sales Region"
            value={Array.isArray(searchParams.salesRegion) ? searchParams.salesRegion : (searchParams.salesRegion ? [searchParams.salesRegion] : [])}
            onChange={handleSelectFieldChange("salesRegion")}
            options={[{ value: "north", label: "North" }, { value: "south", label: "South" }, { value: "east", label: "East" }, { value: "west", label: "West" }, { value: "central", label: "Central" }]}
            placeholder="Select region"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationDetailsFields;
