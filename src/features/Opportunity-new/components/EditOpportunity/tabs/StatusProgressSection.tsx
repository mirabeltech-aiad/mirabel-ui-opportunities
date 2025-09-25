import React from "react";
import FloatingLabelInput from "@/shared/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/shared/components/ui/FloatingLabelSelect";

interface StatusProgressSectionProps {
  formData: any;
  handleInputChange: any;
  statusOptions: any;
  stageOptions: any;
  isLoadingStages?: boolean;
}

const StatusProgressSection: React.FC<StatusProgressSectionProps> = ({ 
  formData, 
  handleInputChange, 
  statusOptions, 
  stageOptions,
  isLoadingStages = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Stage Progression dropdowns removed as per request */}
      {isLoadingStages && (
        <div className="col-span-full text-center text-gray-500">
          Loading stages...
        </div>
      )}
    </div>
  );
};

export default StatusProgressSection;
