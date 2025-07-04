
import React from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";

const TeamAssignmentSection = ({ formData, handleInputChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FloatingLabelInput
        id="assignedRep"
        label="Assign To"
        value={formData.assignedRep}
        onChange={(value) => handleInputChange("assignedRep", value)}
      />

      <FloatingLabelInput
        id="salesPresentation"
        label="Sales Representative"
        value={formData.salesPresentation}
        onChange={(value) => handleInputChange("salesPresentation", value)}
      />
    </div>
  );
};

export default TeamAssignmentSection;
