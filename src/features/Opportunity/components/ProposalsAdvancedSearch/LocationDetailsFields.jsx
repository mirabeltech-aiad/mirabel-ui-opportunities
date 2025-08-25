import React, { useState, useEffect } from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";
import { userService } from "@/features/Opportunity/Services/userService";

const LocationDetailsFields = ({
  handleInputChange,
  handleSelectChange,
  searchParams = {},
}) => {
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoadingCountries(true);
        const countriesData = await userService.getContactCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        setCountries([]);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  const regionOptions = [
    { value: "north", label: "North" },
    { value: "south", label: "South" },
    { value: "east", label: "East" },
    { value: "west", label: "West" },
    { value: "central", label: "Central" },
  ];

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="country"
            label="Country"
            value={searchParams.country || ""}
            onChange={handleSelectFieldChange("country")}
            options={countries}
            placeholder={
              isLoadingCountries ? "Loading countries..." : "Select country"
            }
            disabled={isLoadingCountries}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="state"
            label="State/Province"
            value={searchParams.state || ""}
            onChange={handleFieldChange("state")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="city"
            label="City"
            value={searchParams.city || ""}
            onChange={handleFieldChange("city")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="postal-code"
            label="Postal Code"
            value={searchParams.postalCode || ""}
            onChange={handleFieldChange("postalCode")}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelSelect
            id="service-region"
            label="Service Region"
            value={searchParams.serviceRegion || ""}
            onChange={handleSelectFieldChange("serviceRegion")}
            options={regionOptions}
            placeholder="Select region"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationDetailsFields;
