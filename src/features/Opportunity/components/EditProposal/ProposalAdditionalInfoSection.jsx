
import React from "react";
import FloatingLabelInput from "../ui/FloatingLabelInput";

const ProposalAdditionalInfoSection = ({ formData, handleInputChange }) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-6 space-y-2">
          <FloatingLabelInput
            id="competitorAnalysis"
            label="Competitor Analysis"
            value={formData.competitorAnalysis}
            onChange={handleFieldChange("competitorAnalysis")}
            isTextarea={true}
            rows={3}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 space-y-2">
          <FloatingLabelInput
            id="riskAssessment"
            label="Risk Assessment"
            value={formData.riskAssessment}
            onChange={handleFieldChange("riskAssessment")}
            isTextarea={true}
            rows={3}
          />
        </div>
      </div>
      <div className="space-y-2">
        <FloatingLabelInput
          id="notes"
          label="Notes"
          value={formData.notes}
          onChange={handleFieldChange("notes")}
          isTextarea={true}
          rows={3}
        />
      </div>
    </div>
  );
};

export default ProposalAdditionalInfoSection;
