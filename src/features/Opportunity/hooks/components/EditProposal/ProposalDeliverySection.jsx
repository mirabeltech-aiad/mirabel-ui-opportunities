
import React from "react";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import FloatingLabelSelect from "../ui/FloatingLabelSelect";

const ProposalDeliverySection = ({ 
  formData, 
  handleInputChange, 
  timeframeOptions 
}) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelSelect
            id="deliveryTimeframe"
            label="Delivery Timeframe"
            value={formData.deliveryTimeframe}
            onChange={handleFieldChange("deliveryTimeframe")}
            options={timeframeOptions}
            placeholder="Select timeframe"
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="implementationDate"
            label="Implementation Date"
            type="date"
            value={formData.implementationDate}
            onChange={handleFieldChange("implementationDate")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="deliveryMethod"
            label="Delivery Method"
            value={formData.deliveryMethod}
            onChange={handleFieldChange("deliveryMethod")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalDeliverySection;
