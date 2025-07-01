
import React from "react";
import FloatingLabelSelect from "../ui/FloatingLabelSelect";

const ProposalTeamAssignmentSection = ({ 
  formData, 
  handleInputChange, 
  repOptions, 
  territoryOptions 
}) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="assignedRep"
            label="Assigned Rep"
            value={formData.assignedRep}
            onChange={handleFieldChange("assignedRep")}
            options={repOptions}
            placeholder="Select rep"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="proposalManager"
            label="Proposal Manager"
            value={formData.proposalManager}
            onChange={handleFieldChange("proposalManager")}
            options={repOptions}
            placeholder="Select manager"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="technicalLead"
            label="Technical Lead"
            value={formData.technicalLead}
            onChange={handleFieldChange("technicalLead")}
            options={repOptions}
            placeholder="Select lead"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="territory"
            label="Territory"
            value={formData.territory}
            onChange={handleFieldChange("territory")}
            options={territoryOptions}
            placeholder="Select territory"
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalTeamAssignmentSection;
