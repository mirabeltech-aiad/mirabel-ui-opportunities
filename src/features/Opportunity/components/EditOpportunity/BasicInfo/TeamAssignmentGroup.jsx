import React from "react";
import FloatingLabelInput from "@OpportunityComponents/ui/FloatingLabelInput";
import FloatingLabelSelect from "@OpportunityComponents/ui/FloatingLabelSelect";
import Loader from "@OpportunityComponents/ui/loader";

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
  fieldName
}) => {

  // Render individual field based on fieldName prop
  const renderField = () => {
    switch (fieldName) {
      case "assignedRep":
        console.log('Assigned Rep dropdown - options:', userOptionsToUse, 'value:', formData.assignedRep, 'loading:', isLoadingUsers);
        return (
          <FloatingLabelSelect
            id="assignedRep"
            label="Assign To"
            value={formData.assignedRep}
            onChange={handleAssignedRepChange}
            options={userOptionsToUse}
            placeholder={isLoadingUsers ? <Loader size="sm" /> : "Select assigned representative"}
            disabled={isLoadingUsers || shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
          />
        );

      case "salesPresentation":
        console.log('Sales Presentation dropdown - options:', userOptionsToUse, 'value:', formData.salesPresentation, 'loading:', isLoadingUsers);
        return (
          <FloatingLabelSelect
            id="salesPresentation"
            label="Sales Representative"
            value={formData.salesPresentation}
            onChange={handleSalesPresenterChange}
            options={userOptionsToUse}
            placeholder={isLoadingUsers ? <Loader size="sm" /> : "Select sales representative"}
            disabled={isLoadingUsers || shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
          />
        );

      case "lostReason":
        console.log('Lost Reason dropdown - options:', apiLossReasons, 'value:', formData.lostReason, 'loading:', isLoadingLossReasons);
        return (
          <FloatingLabelSelect
            id="lostReason"
            label="Closed Lost Reason"
            value={formData.lostReason}
            onChange={handleLossReasonChange}
            options={apiLossReasons}
            placeholder={isLoadingLossReasons ? <Loader size="sm" /> : "Select loss reason"}
            disabled={isLoadingLossReasons || shouldDisableFields}
            className={shouldDisableFields ? "bg-gray-100" : ""}
          />
        );

      case "forecastRevenue":
        return (
          <FloatingLabelInput
            id="forecastRevenue"
            label="Forecast Revenue"
            type="number"
            value={formData.forecastRevenue}
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
          />
        );

      default:
        return null;
    }
  };

  return renderField();
};

export default TeamAssignmentGroup;
