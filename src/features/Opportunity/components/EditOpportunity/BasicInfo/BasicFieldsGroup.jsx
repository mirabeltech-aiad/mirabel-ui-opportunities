import React from "react";
import { FloatingLabelInput } from "@/shared/components/ui/FloatingLabelInput";
import { FloatingLabelSelect } from "@/shared/components/ui/FloatingLabelSelect";
import Loader from "@/components/ui/loader";

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
  shouldDisableProposalLinkedFields, // ✅ Add shouldDisableProposalLinkedFields prop
  isAddMode,
  addModeStatusOptions,
  fieldName,
  getFieldError,
  hasSubmitted,
  probabilityOptions, // ✅ Add probability options prop
  isStageDisabled, // ✅ Add stage disabled prop
  isProbabilityDisabled, // ✅ Add probability disabled prop
}) => {
  // Get the display value for opportunity type - ensure it matches dropdown options

  const getOpportunityTypeDisplayValue = () => {
    // If it's an object with a name property, use the name
    if (
      typeof formData.opportunityType === "object" &&
      formData.opportunityType?.name
    ) {
      return formData.opportunityType.name;
    }
    // If it's a string, use it directly
    if (typeof formData.opportunityType === "string") {
      return formData.opportunityType;
    }
    // Default to empty string
    return "";
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
            error={getFieldError ? getFieldError("name") : null}
            showError={hasSubmitted}
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
            disabled={formData.contactDetails.ID > 0 || formData.opportunityId > 0}
            className={
              formData.customerId || shouldDisableFields ? "bg-gray-100" : ""
            }
            error={getFieldError ? getFieldError("company") : null}
            showError={hasSubmitted}
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
            error={getFieldError ? getFieldError("status") : null}
            showError={hasSubmitted}
            allowClear={false}
          />
        ) : (
          <FloatingLabelSelect
            id="status"
            label="Status"
            value={formData.status}
            onChange={(value) => handleInputChange("status", value)}
            options={addModeStatusOptions}
            placeholder="Select status"
            disabled={shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
            error={getFieldError ? getFieldError("status") : null}
            showError={hasSubmitted}
            allowClear={false}
          />
        );

      case "stage":
        return (
          <FloatingLabelSelect
            id="stage"
            label="Stage"
            value={formData.stageDetails?.Stage}
            onChange={handleStageChange}
            options={apiStages}
            placeholder={
              isLoadingStages ? <Loader size="sm" /> : "Select stage"
            }
            disabled={isLoadingStages || shouldDisableFields || isStageDisabled}
            className={
              shouldDisableFields || isStageDisabled ? "bg-gray-100" : ""
            }
            error={getFieldError ? getFieldError("stageDetails") : null}
            showError={hasSubmitted}
            allowClear={false}
          />
        );

      case "amount":
        // Check if this field should be disabled due to proposal linking
        const isAmountDisabledByProposal =
          typeof shouldDisableProposalLinkedFields === "function"
            ? shouldDisableProposalLinkedFields("amount")
            : false;

        return (
          <FloatingLabelInput
            id="amount"
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(value) => handleInputChange("amount", value)}
            disabled={(!isAddMode && formData.proposalId > 0) || isAmountDisabledByProposal}
            className={
              shouldDisableFields || isAmountDisabledByProposal
                ? "bg-gray-100"
                : ""
            }
            error={getFieldError ? getFieldError("amount") : null}
            showError={hasSubmitted}
            required
          />
        );

      case "probability":
        return (
          <FloatingLabelSelect
            id="probability"
            label="Probability (%)"
            value={formData.probability}
            onChange={(value) => handleInputChange("probability", value)}
            options={probabilityOptions || []}
            placeholder="Select probability"
            disabled={shouldDisableFields || isProbabilityDisabled}
            className={
              shouldDisableFields || isProbabilityDisabled ? "bg-gray-100" : ""
            }
            error={getFieldError ? getFieldError("probability") : null}
            showError={hasSubmitted}
            required
            allowClear={false}
          />
        );

      case "opportunityType":
        return (
          <FloatingLabelSelect
            id="opportunityType"
            label="Opportunity Type"
            value={getOpportunityTypeDisplayValue()}
            onChange={handleOpportunityTypeChange}
            options={apiOpportunityTypes}
            placeholder={
              isLoadingOpportunityTypes ? (
                <Loader size="sm" />
              ) : (
                "Select opportunity type"
              )
            }
            disabled={isLoadingOpportunityTypes || shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
            allowClear={false}
            error={getFieldError ? getFieldError("opportunityType") : null}
            showError={hasSubmitted}
          />
        );

      default:
        return null;
    }
  };

  return renderField();
};

export default BasicFieldsGroup;
