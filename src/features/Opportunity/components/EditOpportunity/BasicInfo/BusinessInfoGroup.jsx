import React from "react";
import FloatingLabelInput from "@/shared/components/ui/FloatingLabelInput";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";

const BusinessInfoGroup = ({
  formData,
  handleInputChange,
  businessUnitOptionsToUse,
  productOptionsToUse,
  isLoadingBusinessUnits,
  isLoadingProducts,
  handleBusinessUnitChange,
  handleProductChange,
  shouldDisableFields,
  shouldDisableProposalLinkedFields,
  fieldName,
  getFieldError,
  hasSubmitted,
  isAddMode = true,
}) => {

  
  // Render individual field based on fieldName prop
  const renderField = () => {
    switch (fieldName) {
      case "businessUnit":
        return (
          <MultiSelectDropdown
            id="businessUnit"
            label="Business Unit"
            value={formData.businessUnit || []}
            onChange={handleBusinessUnitChange}
            options={businessUnitOptionsToUse}
            placeholder={
              isLoadingBusinessUnits ? "Loading..." : "Select business units"
            }
            disabled={
              isLoadingBusinessUnits ||
              (!isAddMode && formData.proposalId>0) ||
              shouldDisableProposalLinkedFields
            }
            isLoading={isLoadingBusinessUnits}
            className={
              shouldDisableFields || shouldDisableProposalLinkedFields
                ? "bg-gray-100"
                : ""
            }
            valueKey="value"
            labelKey="label"
            hideAllOption
            displaySelectedAsLabels
          />
        );

      case "product":
        return (
          <MultiSelectDropdown
            id="product"
            label="Product"
            value={formData.product || []}
            onChange={handleProductChange}
            options={productOptionsToUse}
            placeholder={isLoadingProducts ? "Loading..." : "Select products"}
            disabled={
              isLoadingProducts ||
              !isAddMode  ||
              shouldDisableProposalLinkedFields
            }
            isLoading={isLoadingProducts}
            className={
              shouldDisableFields || shouldDisableProposalLinkedFields
                ? "bg-gray-100"
                : ""
            }
            valueKey="value"
            labelKey="label"
            hideAllOption
            displaySelectedAsLabels
          />
        );

      case "primaryCampaignSource":
        return (
          <FloatingLabelInput
            id="primaryCampaignSource"
            label="Primary Campaign Source"
            value={formData.primaryCampaignSource}
            onChange={(value) =>
              handleInputChange("primaryCampaignSource", value)
            }
            disabled={shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
          />
        );

      case "projCloseDate":
        return (
          <FloatingLabelInput
            id="projCloseDate"
            label="Projected Close Date"
            type="date"
            value={formData.projCloseDate}
            onChange={(value) => handleInputChange("projCloseDate", value)}
            disabled={shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
            error={getFieldError ? getFieldError("projCloseDate") : null}
            showError={hasSubmitted}
            required
          />
        );

      default:
        return null;
    }
  };

  return renderField();
};

export default BusinessInfoGroup;
