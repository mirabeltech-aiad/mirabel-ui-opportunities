
import React from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";

const LeadSourceSection = ({ formData, handleInputChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <FloatingLabelInput
        id="primaryCampaignSource"
        label="Primary Campaign Source"
        value={formData.primaryCampaignSource}
        onChange={(value) => handleInputChange("primaryCampaignSource", value)}
      />
    </div>
  );
};

export default LeadSourceSection;
