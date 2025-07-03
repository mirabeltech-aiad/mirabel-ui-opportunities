
import React from "react";
import FloatingLabelInput from "@OpportunityComponents/ui/FloatingLabelInput";
import FloatingLabelSelect from "@OpportunityComponents/ui/FloatingLabelSelect";

const ProposalDetailsFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
  ];

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="rfp-number"
            label="RFP Number"
            value={searchParams.rfpNumber || ""}
            onChange={handleFieldChange("rfpNumber")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="submission-date"
            label="Submission Date"
            type="date"
            value={searchParams.submissionDate || ""}
            onChange={handleFieldChange("submissionDate")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="due-date"
            label="Due Date"
            type="date"
            value={searchParams.dueDate || ""}
            onChange={handleFieldChange("dueDate")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="priority"
            label="Priority"
            value={searchParams.priority || ""}
            onChange={handleSelectFieldChange("priority")}
            options={priorityOptions}
            placeholder="Select priority"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-6 space-y-2">
          <FloatingLabelInput
            id="proposal-summary"
            label="Proposal Summary"
            value={searchParams.proposalSummary || ""}
            onChange={handleFieldChange("proposalSummary")}
            isTextarea={true}
            rows={3}
            placeholder="Enter proposal summary"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 space-y-2">
          <FloatingLabelInput
            id="key-requirements"
            label="Key Requirements"
            value={searchParams.keyRequirements || ""}
            onChange={handleFieldChange("keyRequirements")}
            isTextarea={true}
            rows={3}
            placeholder="Enter key requirements"
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsFields;
