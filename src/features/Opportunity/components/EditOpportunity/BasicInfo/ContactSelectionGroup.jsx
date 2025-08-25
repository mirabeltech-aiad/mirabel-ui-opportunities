import React from "react";
import FloatingLabelInput from "../../../../../components/ui/FloatingLabelInput";
import FloatingLabelSelect from "../../../../../components/ui/FloatingLabelSelect";
import Loader from "@/components/ui/loader";

const ContactSelectionGroup = ({
  formData,
  handleInputChange,
  contactOptions,
  isLoadingContacts,
  handleContactNameChange,
  shouldDisableFields,
  isAddMode,
}) => {
  // no-op: prevent default selection; do not auto-select contacts

  return (
    <>
      <FloatingLabelSelect
        id="contactName"
        label="Contact Name"
        value={formData.contactName || ""}
        onChange={isAddMode ? handleContactNameChange : handleInputChange}
        options={contactOptions}
        placeholder={
          isLoadingContacts ? <Loader size="sm" /> : "Select contact name"
        }
        disabled={isLoadingContacts || shouldDisableFields}
        required
        className={shouldDisableFields ? "bg-gray-100" : ""}
        allowClear={true}
      />
    </>
  );
};

export default ContactSelectionGroup;
