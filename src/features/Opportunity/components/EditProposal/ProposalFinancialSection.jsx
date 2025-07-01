
import React from "react";
import FloatingLabelInput from "../ui/FloatingLabelInput";

const ProposalFinancialSection = ({ formData, handleInputChange }) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="proposedValue"
            label="Proposed Value"
            type="number"
            value={formData.proposedValue}
            onChange={handleFieldChange("proposedValue")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="estimatedCost"
            label="Estimated Cost"
            type="number"
            value={formData.estimatedCost}
            onChange={handleFieldChange("estimatedCost")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="margin"
            label="Margin %"
            type="number"
            value={formData.margin}
            onChange={handleFieldChange("margin")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="currency"
            label="Currency"
            value={formData.currency}
            onChange={handleFieldChange("currency")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalFinancialSection;
