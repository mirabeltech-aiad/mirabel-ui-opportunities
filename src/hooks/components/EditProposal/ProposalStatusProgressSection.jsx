
import React from "react";
import FloatingLabelSelect from "../ui/FloatingLabelSelect";
import FloatingLabelInput from "../ui/FloatingLabelInput";

const ProposalStatusProgressSection = ({ 
  formData, 
  handleInputChange, 
  statusOptions, 
  stageOptions, 
  priorityOptions 
}) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="status"
            label="Status"
            value={formData.status}
            onChange={handleFieldChange("status")}
            options={statusOptions}
            placeholder="Select status"
            required
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="stage"
            label="Stage"
            value={formData.stage}
            onChange={handleFieldChange("stage")}
            options={stageOptions}
            placeholder="Select stage"
            required
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="priority"
            label="Priority"
            value={formData.priority}
            onChange={handleFieldChange("priority")}
            options={priorityOptions}
            placeholder="Select priority"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="submissionDate"
            label="Submission Date"
            type="date"
            value={formData.submissionDate}
            onChange={handleFieldChange("submissionDate")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalStatusProgressSection;
