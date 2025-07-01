
import React from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";

const LocationDetailsFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  const countryOptions = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" }
  ];

  const regionOptions = [
    { value: "north", label: "North" },
    { value: "south", label: "South" },
    { value: "east", label: "East" },
    { value: "west", label: "West" },
    { value: "central", label: "Central" }
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
            options={countryOptions}
            placeholder="Select country"
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
