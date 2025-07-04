
import React from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";

const ContactDetailsFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  const contactRoleOptions = [
    { value: "primary-contact", label: "Primary Contact" },
    { value: "decision-maker", label: "Decision Maker" },
    { value: "technical-evaluator", label: "Technical Evaluator" },
    { value: "procurement-officer", label: "Procurement Officer" }
  ];

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 */}
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

      {/* Row 2 */}
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
            options={contactRoleOptions}
            placeholder="Select role"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsFields;
