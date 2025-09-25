
import React from "react";
import FloatingLabelInput from "@/shared/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/shared/components/ui/FloatingLabelSelect";

const ClientDetailsFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  const industryOptions = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" }
  ];

  const clientTypeOptions = [
    { value: "government", label: "Government" },
    { value: "enterprise", label: "Enterprise" },
    { value: "small-business", label: "Small Business" },
    { value: "non-profit", label: "Non-Profit" }
  ];

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="client-organization"
            label="Client Organization"
            value={searchParams.clientOrganization || ""}
            onChange={handleFieldChange("clientOrganization")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="client-industry"
            label="Industry"
            value={searchParams.clientIndustry || ""}
            onChange={handleSelectFieldChange("clientIndustry")}
            options={industryOptions}
            placeholder="Select industry"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="client-type"
            label="Client Type"
            value={searchParams.clientType || ""}
            onChange={handleSelectFieldChange("clientType")}
            options={clientTypeOptions}
            placeholder="Select client type"
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="client-id"
            label="Client ID"
            value={searchParams.clientId || ""}
            onChange={handleFieldChange("clientId")}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="procurement-contact"
            label="Procurement Contact"
            value={searchParams.procurementContact || ""}
            onChange={handleFieldChange("procurementContact")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="technical-contact"
            label="Technical Contact"
            value={searchParams.technicalContact || ""}
            onChange={handleFieldChange("technicalContact")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="relationship-manager"
            label="Relationship Manager"
            value={searchParams.relationshipManager || ""}
            onChange={handleFieldChange("relationshipManager")}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsFields;
