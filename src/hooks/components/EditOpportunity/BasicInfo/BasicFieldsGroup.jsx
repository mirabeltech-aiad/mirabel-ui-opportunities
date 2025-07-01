import React from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";
import Loader from "@/features/Opportunity/components/ui/loader";

const BasicFieldsGroup = ({ 
  formData, 
  handleInputChange,
  apiOpportunityTypes,
  isLoadingOpportunityTypes,
  apiStages,
  isLoadingStages,
  handleOpportunityTypeChange,
  handleStageChange,
  shouldDisableFields,
  isAddMode,
  addModeStatusOptions,
  fieldName
}) => {
  // Get the display value for opportunity type - ensure it matches dropdown options
  const getOpportunityTypeDisplayValue = () => {
    // If it's an object with a name property, use the name
    if (typeof formData.opportunityType === 'object' && formData.opportunityType?.name) {
      return formData.opportunityType.name;
    }
    // If it's a string, use it directly
    if (typeof formData.opportunityType === 'string') {
      return formData.opportunityType;
    }
    // Default to empty string
    return '';
  };

  // Render individual field based on fieldName prop
  const renderField = () => {
    switch (fieldName) {
      case "name":
        return (
          <FloatingLabelInput
            id="name"
            label="Opportunity Name"
            value={formData.name}
            onChange={(value) => handleInputChange("name", value)}
            required
            disabled={shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
          />
        );

      case "company":
        return (
          <FloatingLabelInput
            id="company"
            label="Company Name"
            value={formData.company}
            onChange={(value) => handleInputChange("company", value)}
            required
            disabled={formData.customerId || shouldDisableFields}
            className={(formData.customerId || shouldDisableFields) ? "bg-gray-100" : ""}
          />
        );

      case "status":
        return isAddMode ? (
          <FloatingLabelSelect
            id="status"
            label="Status"
            value={formData.status}
            onChange={(value) => handleInputChange("status", value)}
            options={addModeStatusOptions}
            placeholder="Select status"
            disabled={shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
          />
        ) : (
          <FloatingLabelInput
            id="status"
            label="Status"
            value={formData.status}
            onChange={(value) => handleInputChange("status", value)}
            disabled={shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
          />
        );

      case "stage":
        console.log('Stage dropdown - options:', apiStages, 'value:', formData.stage, 'loading:', isLoadingStages);
        return (
          <FloatingLabelSelect
            id="stage"
            label="Stage"
            value={formData.stage}
            onChange={handleStageChange}
            options={apiStages}
            placeholder={isLoadingStages ? <Loader size="sm" /> : "Select stage"}
            disabled={isLoadingStages || shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
          />
        );

      case "amount":
        return (
          <FloatingLabelInput
            id="amount"
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(value) => handleInputChange("amount", value)}
            disabled={shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
          />
        );

      case "probability":
        return (
          <FloatingLabelInput
            id="probability"
            label="Probability"
            type="number"
            value={formData.probability}
            onChange={(value) => handleInputChange("probability", value)}
            disabled={shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
          />
        );

      case "opportunityType":
        console.log('Opportunity Type dropdown - options:', apiOpportunityTypes, 'value:', getOpportunityTypeDisplayValue(), 'loading:', isLoadingOpportunityTypes);
        return (
          <FloatingLabelSelect
            id="opportunityType"
            label="Opportunity Type"
            value={getOpportunityTypeDisplayValue()}
            onChange={handleOpportunityTypeChange}
            options={apiOpportunityTypes}
            placeholder={isLoadingOpportunityTypes ? <Loader size="sm" /> : "Select opportunity type"}
            disabled={isLoadingOpportunityTypes || shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
            allowClear={true}
          />
        );

      default:
        return null;
    }
  };

  return renderField();
};

export default BasicFieldsGroup;
