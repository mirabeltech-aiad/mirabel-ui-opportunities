
import React from "react";
import FloatingLabelInput from "../../../../components/ui/FloatingLabelInput";
import FloatingLabelSelect from "../../../../components/ui/FloatingLabelSelect";

const ProposalBasicInfoSection = ({ 
  formData, 
  handleInputChange, 
  stateOptions, 
  typeOptions, 
  businessUnitOptions, 
  productOptions 
}) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="proposalId"
            label="Proposal ID"
            value={formData.proposalId}
            readOnly
            title="Auto-generated unique identifier"
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="opportunityId"
            label="Opportunity ID"
            value={formData.opportunityId}
            onChange={handleFieldChange("opportunityId")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="title"
            label="Proposal Title"
            value={formData.title}
            onChange={handleFieldChange("title")}
            required
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="company"
            label="Company Name"
            value={formData.company}
            onChange={handleFieldChange("company")}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="contactName"
            label="Contact Name"
            value={formData.contactName}
            onChange={handleFieldChange("contactName")}
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelSelect
            id="state"
            label="State"
            value={formData.state}
            onChange={handleFieldChange("state")}
            options={stateOptions}
            placeholder="Select state"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="type"
            label="Proposal Type"
            value={formData.type}
            onChange={handleFieldChange("type")}
            options={typeOptions}
            placeholder="Select type"
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelSelect
            id="businessUnit"
            label="Business Unit"
            value={formData.businessUnit}
            onChange={handleFieldChange("businessUnit")}
            options={businessUnitOptions}
            placeholder="Select unit"
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelSelect
            id="product"
            label="Product"
            value={formData.product}
            onChange={handleFieldChange("product")}
            options={productOptions}
            placeholder="Select product"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <FloatingLabelInput
          id="description"
          label="Description"
          value={formData.description}
          onChange={handleFieldChange("description")}
          isTextarea
          rows={3}
        />
      </div>
    </div>
  );
};

export default ProposalBasicInfoSection;
