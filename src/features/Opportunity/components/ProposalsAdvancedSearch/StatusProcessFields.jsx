
import React from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";

const StatusProcessFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  const workflowStatusOptions = [
    { value: "initiation", label: "Initiation" },
    { value: "research", label: "Research" },
    { value: "drafting", label: "Drafting" },
    { value: "review", label: "Review" },
    { value: "approval", label: "Approval" },
    { value: "submission", label: "Submission" }
  ];

  const reviewStageOptions = [
    { value: "not-started", label: "Not Started" },
    { value: "technical-review", label: "Technical Review" },
    { value: "compliance-review", label: "Compliance Review" },
    { value: "final-review", label: "Final Review" },
    { value: "completed", label: "Completed" }
  ];

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="workflow-status"
            label="Workflow Status"
            value={searchParams.workflowStatus || ""}
            onChange={handleSelectFieldChange("workflowStatus")}
            options={workflowStatusOptions}
            placeholder="Select workflow status"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="review-stage"
            label="Review Stage"
            value={searchParams.reviewStage || ""}
            onChange={handleSelectFieldChange("reviewStage")}
            options={reviewStageOptions}
            placeholder="Select review stage"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="created-date-from"
            label="Created Date (From)"
            type="date"
            value={searchParams.createdDateFrom || ""}
            onChange={handleFieldChange("createdDateFrom")}
            max={searchParams.createdDateTo || undefined}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="created-date-to"
            label="Created Date (To)"
            type="date"
            value={searchParams.createdDateTo || ""}
            onChange={handleFieldChange("createdDateTo")}
            min={searchParams.createdDateFrom || undefined}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="last-modified-by"
            label="Last Modified By"
            value={searchParams.lastModifiedBy || ""}
            onChange={handleFieldChange("lastModifiedBy")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="last-modified-date"
            label="Last Modified Date"
            type="date"
            value={searchParams.lastModifiedDate || ""}
            onChange={handleFieldChange("lastModifiedDate")}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusProcessFields;
