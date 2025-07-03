
import React from "react";
import FloatingLabelInput from "@OpportunityComponents/ui/FloatingLabelInput";
import FloatingLabelSelect from "@OpportunityComponents/ui/FloatingLabelSelect";
import { Textarea } from "@OpportunityComponents/ui/textarea";
import { Label } from "@OpportunityComponents/ui/label";
import { OPPORTUNITY_OPTIONS } from "@/constants/opportunityOptions";

const OpportunityFormFields = ({ handleInputChange, handleSelectChange }) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 - Core Identifiers - smaller fields get 3 cols, name gets 6 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="opportunity-id"
            label="Opportunity ID"
            value=""
            onChange={handleFieldChange("opportunityId")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="proposal-id"
            label="Proposal ID"
            value=""
            onChange={handleFieldChange("proposalId")}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 space-y-2">
          <FloatingLabelInput
            id="opportunity-name"
            label="Opportunity Name"
            value=""
            onChange={handleFieldChange("opportunityName")}
          />
        </div>
      </div>

      {/* Row 2 - Status and Stage - 3 cols each for selects */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="opportunity-status"
            label="Status"
            value=""
            onChange={handleSelectFieldChange("status")}
            options={OPPORTUNITY_OPTIONS.status}
            placeholder="Select status"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="opportunity-stage"
            label="Stage"
            value=""
            onChange={handleSelectFieldChange("stage")}
            options={OPPORTUNITY_OPTIONS.stage}
            placeholder="Select stage"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="priority"
            label="Priority"
            value=""
            onChange={handleSelectFieldChange("priority")}
            options={OPPORTUNITY_OPTIONS.priority}
            placeholder="Select priority"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="opportunity-type"
            label="Type"
            value=""
            onChange={handleSelectFieldChange("opportunityType")}
            options={OPPORTUNITY_OPTIONS.opportunityType}
            placeholder="Select type"
          />
        </div>
      </div>

      {/* Row 3 - Financial - 2 cols each for amounts, 4 cols for probability range */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="amount-min"
            label="Amount (Min)"
            type="number"
            value=""
            onChange={handleFieldChange("amountMin")}
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="amount-max"
            label="Amount (Max)"
            type="number"
            value=""
            onChange={handleFieldChange("amountMax")}
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="probability-min"
            label="Probability Min %"
            type="number"
            value=""
            onChange={handleFieldChange("probabilityMin")}
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="probability-max"
            label="Probability Max %"
            type="number"
            value=""
            onChange={handleFieldChange("probabilityMax")}
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="stage-percentage-min"
            label="Stage % Min"
            type="number"
            value=""
            onChange={handleFieldChange("stagePercentageMin")}
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="stage-percentage-max"
            label="Stage % Max"
            type="number"
            value=""
            onChange={handleFieldChange("stagePercentageMax")}
          />
        </div>
      </div>

      {/* Row 4 - Dates - 3 cols each for better date field visibility */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="created-date-from"
            label="Created Date (From)"
            type="date"
            value=""
            onChange={handleFieldChange("createdDateFrom")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="created-date-to"
            label="Created Date (To)"
            type="date"
            value=""
            onChange={handleFieldChange("createdDateTo")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="projected-close-date"
            label="Projected Close Date"
            type="date"
            value=""
            onChange={handleFieldChange("projectedCloseDate")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="last-activity-date"
            label="Last Activity Date"
            type="date"
            value=""
            onChange={handleFieldChange("lastActivityDate")}
          />
        </div>
      </div>

      {/* Row 5 - More Dates */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="actual-close-date-from"
            label="Actual Close Date (From)"
            type="date"
            value=""
            onChange={handleFieldChange("actualCloseDateFrom")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="actual-close-date-to"
            label="Actual Close Date (To)"
            type="date"
            value=""
            onChange={handleFieldChange("actualCloseDateTo")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="assigned-rep"
            label="Assigned Rep"
            value=""
            onChange={handleSelectFieldChange("assignedRep")}
            options={OPPORTUNITY_OPTIONS.rep}
            placeholder="Select rep"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="created-by"
            label="Created By"
            value=""
            onChange={handleFieldChange("createdBy")}
          />
        </div>
      </div>

      {/* Row 6 - Location and Remote - optimized spacing */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-6 space-y-2">
          <FloatingLabelInput
            id="location"
            label="Location"
            value=""
            onChange={handleFieldChange("location")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="remote"
            label="Remote"
            value=""
            onChange={handleSelectFieldChange("remote")}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" }
            ]}
            placeholder="Select option"
          />
        </div>
      </div>

      {/* Row 7 - Description - converted to floating label format */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <FloatingLabelInput
            id="description"
            label="Description"
            value=""
            onChange={handleFieldChange("description")}
            isTextarea={true}
            rows={3}
            placeholder="Enter description or notes"
          />
        </div>
      </div>
    </div>
  );
};

export default OpportunityFormFields;
