
import React from "react";
import FloatingLabelInput from "@OpportunityComponents/ui/FloatingLabelInput";
import FloatingLabelSelect from "@OpportunityComponents/ui/FloatingLabelSelect";
import Loader from "@/features/Opportunity/components/ui/loader";

const ContactSelectionGroup = ({ 
  formData, 
  handleInputChange,
  contactOptions,
  isLoadingContacts,
  handleContactNameChange,
  shouldDisableFields,
  isAddMode
}) => {
  const isCustomerSelected = isAddMode && formData.customerId;

  return (
    <>
      {isAddMode ? (
        <FloatingLabelSelect
          id="contactName"
          label="Contact Name"
          value={formData.contactName}
          onChange={handleContactNameChange}
          options={contactOptions}
          placeholder={isLoadingContacts ? <Loader size="sm" /> : "Select contact name"}
          disabled={isLoadingContacts || shouldDisableFields}
          required
          className={shouldDisableFields ? "bg-gray-100" : ""}
        />
      ) : (
        <FloatingLabelInput
          id="contactName"
          label="Contact Name"
          value={formData.contactName}
          onChange={(value) => handleInputChange("contactName", value)}
          required
          disabled={isCustomerSelected || shouldDisableFields}
          className={(isCustomerSelected || shouldDisableFields) ? "bg-gray-100" : ""}
        />
      )}
    </>
  );
};

export default ContactSelectionGroup;
