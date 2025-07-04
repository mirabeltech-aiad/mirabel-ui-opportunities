
import React from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";
import CustomerSearchField from "./CustomerSearchField";

const AddOpportunityForm = ({ formData, handleInputChange, options }) => {
  const handleCustomerSelect = (customer) => {
    console.log('Customer selected:', customer);
    handleInputChange("company", customer.company);
    handleInputChange("contactName", customer.firstName);
    handleInputChange("customerId", customer.id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FloatingLabelInput
        id="opportunityName"
        label="Opportunity Name"
        value={formData.opportunityName}
        onChange={(value) => handleInputChange("opportunityName", value)}
        required
      />

      <CustomerSearchField onCustomerSelect={handleCustomerSelect} />

      <FloatingLabelInput
        id="company"
        label="Company Name"
        value={formData.company}
        onChange={(value) => handleInputChange("company", value)}
        disabled={true}
        className="bg-gray-50"
        required
      />

      <FloatingLabelInput
        id="contactName"
        label="Contact Name"
        value={formData.contactName}
        onChange={(value) => handleInputChange("contactName", value)}
        disabled={true}
        className="bg-gray-50"
        required
      />

      <FloatingLabelSelect
        id="status"
        label="Status"
        value={formData.status}
        onChange={(value) => handleInputChange("status", value)}
        options={options.statusOptions}
        required
      />

      <FloatingLabelSelect
        id="stage"
        label="Stage"
        value={formData.stage}
        onChange={(value) => handleInputChange("stage", value)}
        options={options.stageOptions}
        required
      />

      <FloatingLabelInput
        id="amount"
        label="Amount"
        type="number"
        value={formData.amount}
        onChange={(value) => handleInputChange("amount", value)}
      />

      <FloatingLabelInput
        id="probability"
        label="Probability"
        type="number"
        value={formData.probability}
        onChange={(value) => handleInputChange("probability", value)}
      />

      <FloatingLabelSelect
        id="opportunityType"
        label="Opportunity Type"
        value={formData.opportunityType}
        onChange={(value) => handleInputChange("opportunityType", value)}
        options={options.opportunityTypeOptions}
      />

      <FloatingLabelSelect
        id="businessUnit"
        label="Business Unit"
        value={formData.businessUnit}
        onChange={(value) => handleInputChange("businessUnit", value)}
        options={options.businessUnitOptions}
      />

      <FloatingLabelSelect
        id="product"
        label="Product"
        value={formData.product}
        onChange={(value) => handleInputChange("product", value)}
        options={options.productOptions}
      />

      <FloatingLabelInput
        id="primaryCampaignSource"
        label="Primary Campaign Source"
        value={formData.primaryCampaignSource}
        onChange={(value) => handleInputChange("primaryCampaignSource", value)}
      />

      <FloatingLabelInput
        id="projCloseDate"
        label="Projected Close Date"
        type="date"
        value={formData.projCloseDate}
        onChange={(value) => handleInputChange("projCloseDate", value)}
      />

      <FloatingLabelSelect
        id="assignedRep"
        label="Assign To"
        value={formData.assignedRep}
        onChange={(value) => handleInputChange("assignedRep", value)}
        options={options.repOptions}
      />

      <FloatingLabelSelect
        id="salesPresentation"
        label="Sales Representative"
        value={formData.salesPresentation}
        onChange={(value) => handleInputChange("salesPresentation", value)}
        options={options.repOptions}
      />

      <FloatingLabelInput
        id="nextSteps"
        label="Next Steps"
        value={formData.nextSteps}
        onChange={(value) => handleInputChange("nextSteps", value)}
      />

      <FloatingLabelInput
        id="forecastRevenue"
        label="Forecast Revenue"
        type="number"
        value={formData.forecastRevenue}
        onChange={(value) => handleInputChange("forecastRevenue", value)}
        disabled={true}
        className="bg-gray-50"
      />

      <FloatingLabelInput
        id="createdBy"
        label="Created By"
        value={formData.createdBy}
        onChange={(value) => handleInputChange("createdBy", value)}
        disabled={true}
        className="bg-gray-50"
      />

      <FloatingLabelInput
        id="createdDate"
        label="Created Date"
        type="date"
        value={formData.createdDate}
        onChange={(value) => handleInputChange("createdDate", value)}
        disabled={true}
        className="bg-gray-50"
      />

      <div className="md:col-span-2">
        <div className="relative">
          <textarea
            id="notes"
            placeholder=""
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            className="w-full h-32 pt-6 pb-2 px-3 resize-none border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="notes"
            className="absolute left-3 top-2 text-xs text-primary bg-background px-1"
          >
            Notes
          </label>
        </div>
      </div>
    </div>
  );
};

export default AddOpportunityForm;
