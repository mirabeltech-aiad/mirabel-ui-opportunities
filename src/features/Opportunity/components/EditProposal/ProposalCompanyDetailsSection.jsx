
import React from "react";
import FloatingLabelInput from "../../../../components/ui/FloatingLabelInput";
import FloatingLabelSelect from "../../../../components/ui/FloatingLabelSelect";

const ProposalCompanyDetailsSection = ({ 
  formData, 
  handleInputChange, 
  industryOptions, 
  companySizeOptions, 
  stateOptions 
}) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelSelect
            id="industry"
            label="Industry"
            value={formData.industry}
            onChange={handleFieldChange("industry")}
            options={industryOptions}
            placeholder="Select industry"
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelSelect
            id="companySize"
            label="Company Size"
            value={formData.companySize}
            onChange={handleFieldChange("companySize")}
            options={companySizeOptions}
            placeholder="Select size"
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="decisionMaker"
            label="Decision Maker"
            value={formData.decisionMaker}
            onChange={handleFieldChange("decisionMaker")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalCompanyDetailsSection;
