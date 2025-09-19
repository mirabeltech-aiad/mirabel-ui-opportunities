import React from "react";
import FloatingLabelInput from "@/shared/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";
import Loader from "@/components/ui/loader";
import { isLostReasonRequired, hasValidLostReason } from "@/features/Opportunity/utils/validationHelpers";
import { decimalWithCommas } from "@/utils/commonHelpers";

const TeamAssignmentGroup = ({
  formData,
  handleInputChange,
  userOptionsToUse,
  apiLossReasons,
  isLoadingUsers,
  isLoadingLossReasons,
  handleAssignedRepChange,
  handleSalesPresenterChange,
  handleLossReasonChange,
  shouldDisableFields,
  fieldName,
  getFieldError,
  hasSubmitted,
}) => {
  
  // Helper function to get lostReason validation error
  const getLostReasonError = () => {
    // First check if there's a standard validation error from form validation
    const standardError = getFieldError ? getFieldError("lostReason") : null;
    if (standardError) return standardError;
    
    // Then check if it's required due to Closed Lost stage (show immediately if required and empty)
    const isRequired = isLostReasonRequired(formData);
    if (isRequired && !hasValidLostReason(formData.lostReason)) {
      // Show error immediately if stage is Closed Lost and field is empty, even if not submitted yet
      return "Lost Reason is required when opportunity stage is 'Closed Lost'";
    }
    
    return null;
  };
  // Render individual field based on fieldName prop
  const renderField = () => {
    switch (fieldName) {
      case "assignedRep":
        return (
          <FloatingLabelSelect
            id="assignedRep"
            label="Assign To"
            value={formData.assignedRepDetails?.Name}
            onChange={handleAssignedRepChange}
            options={userOptionsToUse}
            placeholder={
              isLoadingUsers ? (
                <Loader size="sm" />
              ) : (
                "Select assigned representative"
              )
            }
            disabled={isLoadingUsers || shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
            allowClear={false}
            error={getFieldError ? getFieldError("assignedRepDetails") : null}
            showError={hasSubmitted}
          />
        );

      case "salesPresentation":
        return (
          <FloatingLabelSelect
            id="salesPresentation"
            label="Sales Representative"
            value={formData.salesPresenterDetails?.Name}
            onChange={handleSalesPresenterChange}
            options={userOptionsToUse}
            placeholder={
              isLoadingUsers ? (
                <Loader size="sm" />
              ) : (
                "Select sales representative"
              )
            }
            disabled={isLoadingUsers || shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
            allowClear={false}
            error={getFieldError ? getFieldError("salesPresenterDetails") : null}
            showError={hasSubmitted}
          />
        );

      case "lostReason":
        const lostReasonError = getLostReasonError();
        const isRequired = isLostReasonRequired(formData);
        return (
          <FloatingLabelSelect
            id="lostReason"
            label="Closed Lost Reason"
            value={formData.lossReasonDetails?.Name}
            onChange={handleLossReasonChange}
            options={apiLossReasons}
            placeholder={
              isLoadingLossReasons ? <Loader size="sm" /> : "Select loss reason"
            }
            disabled={isLoadingLossReasons || shouldDisableFields}
            className={`${shouldDisableFields ? "bg-gray-100" : ""} ${lostReasonError ? "border-red-500" : ""}`}
            error={lostReasonError}
            showError={!!lostReasonError}
            required={isRequired}
            allowClear={false}
          />
        );

      case "forecastRevenue":
        return (
          <FloatingLabelInput
            id="forecastRevenue"
            label="Forecast Revenue"
            type="number"
            value={decimalWithCommas(formData.forecastRevenue)}
            onChange={(value) => handleInputChange("forecastRevenue", value)}
            disabled={true}
            className="bg-gray-50"
          />
        );

      case "createdBy":
        return (
          <FloatingLabelInput
            id="createdBy"
            label="Created By"
            value={formData.createdBy}
            onChange={(value) => handleInputChange("createdBy", value)}
            disabled={true}
            className="bg-gray-50"
            error={getFieldError ? getFieldError("createdBy") : null}
            showError={hasSubmitted}
            required
          />
        );

      case "createdDate":
        return (
          <FloatingLabelInput
            id="createdDate"
            label="Created Date"
            type="date"
            value={formData.createdDate}
            onChange={(value) => handleInputChange("createdDate", value)}
            disabled={true}
            className="bg-gray-50"
            error={getFieldError ? getFieldError("createdDate") : null}
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

export default TeamAssignmentGroup;
