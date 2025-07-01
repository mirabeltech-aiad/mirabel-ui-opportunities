
import React from "react";
import FloatingLabelInput from "../EditOpportunity/FloatingLabelInput";
import FloatingLabelSelect from "../EditOpportunity/FloatingLabelSelect";

const ContactDetailsFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 - Contact Info - name and email get more space */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="contact-name"
            label="Contact Name"
            value={searchParams.contactName || ""}
            onChange={handleFieldChange("contactName")}
          />
        </div>
        <div className="col-span-12 sm:col-span-5 space-y-2">
          <FloatingLabelInput
            id="contact-email"
            label="Email"
            type="email"
            value={searchParams.contactEmail || ""}
            onChange={handleFieldChange("contactEmail")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="contact-title"
            label="Title"
            value={searchParams.contactTitle || ""}
            onChange={handleFieldChange("contactTitle")}
          />
        </div>
      </div>

      {/* Row 2 - Phone and Role - optimized spacing */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="contact-phone"
            label="Phone"
            type="tel"
            value={searchParams.contactPhone || ""}
            onChange={handleFieldChange("contactPhone")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelSelect
            id="contact-role"
            label="Role"
            value={searchParams.contactRole || ""}
            onChange={handleSelectFieldChange("contactRole")}
            options={[
              { value: "decision-maker", label: "Decision Maker" },
              { value: "influencer", label: "Influencer" },
              { value: "technical-contact", label: "Technical Contact" },
              { value: "end-user", label: "End User" }
            ]}
            placeholder="Select role"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsFields;
