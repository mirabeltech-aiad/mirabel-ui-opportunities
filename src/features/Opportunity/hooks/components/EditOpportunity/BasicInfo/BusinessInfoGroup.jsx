import React from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";
import Loader from "@/components/ui/loader";

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
  fieldName
}) => {
  
  // Render individual field based on fieldName prop
  const renderField = () => {
    switch (fieldName) {
      case "businessUnit":
        console.log('Business Unit dropdown - options:', businessUnitOptionsToUse, 'value:', formData.businessUnit, 'loading:', isLoadingBusinessUnits);
        return (
          <FloatingLabelSelect
            id="businessUnit"
            label="Business Unit"
            value={formData.businessUnit || ''}
            onChange={handleBusinessUnitChange}
            options={businessUnitOptionsToUse}
            placeholder={isLoadingBusinessUnits ? <Loader size="sm" /> : "Select business unit"}
            disabled={isLoadingBusinessUnits || shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
          />
        );

      case "product":
        console.log('Product dropdown - options:', productOptionsToUse, 'value:', formData.product, 'loading:', isLoadingProducts);
        return (
          <FloatingLabelSelect
            id="product"
            label="Product"
            value={formData.product}
            onChange={handleProductChange}
            options={productOptionsToUse}
            placeholder={isLoadingProducts ? <Loader size="sm" /> : "Select product"}
            disabled={isLoadingProducts || shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
          />
        );

      case "primaryCampaignSource":
        return (
          <FloatingLabelInput
            id="primaryCampaignSource"
            label="Primary Campaign Source"
            value={formData.primaryCampaignSource}
            onChange={(value) => handleInputChange("primaryCampaignSource", value)}
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
          />
        );

      default:
        return null;
    }
  };

  return renderField();
};

export default BusinessInfoGroup;
