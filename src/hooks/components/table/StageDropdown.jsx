
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@OpportunityComponents/ui/select";
import { ChevronDown } from "lucide-react";
import apiService from "@/services/apiService";

const StageDropdown = ({ stage, opportunityId, onStageChange, stages = [] }) => {
  const [selectedStage, setSelectedStage] = useState(stage);

  // Update selected stage when stage prop changes
  useEffect(() => {
    setSelectedStage(stage);
  }, [stage]);

  const getStageStyle = (stageName) => {
    const stageData = stages.find(s => s.name === stageName);
    if (stageData && stageData.colorCode) {
      return `text-white border-0`;
    }
    // Fallback colors
    switch (stageName) {
      case "2nd Meeting":
        return "bg-green-500 text-white";
      case "Closed Won":
        return "bg-orange-500 text-white";
      case "Closed Lost":
        return "bg-red-500 text-white";
      default:
        return "bg-blue-400 text-white";
    }
  };

  const getStageBackgroundColor = (stageName) => {
    const stageData = stages.find(s => s.name === stageName);
    return stageData?.colorCode || "#4fb3ff";
  };

  const handleStageChange = async (newStage) => {
    setSelectedStage(newStage);
    
    // Find the selected stage data to get its ID
    const selectedStageData = stages.find(s => s.name === newStage);
    if (selectedStageData) {
      try {
        // Use the new API method that handles dynamic userId internally
        const response = await apiService.updateOpportunityStage(selectedStageData.id, opportunityId);
        
        // Call the callback if provided
        if (onStageChange) {
          onStageChange(opportunityId, newStage);
        }
      } catch (error) {
        console.error('Error updating stage:', error);
        // Revert the selection on error
        setSelectedStage(stage);
      }
    }
  };

  // Show fallback if no stages are available
  if (!stages || stages.length === 0) {
    return (
      <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium min-w-[120px] h-[28px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Select value={selectedStage} onValueChange={handleStageChange}>
      <SelectTrigger 
        className={`${getStageStyle(selectedStage)} border-0 font-medium px-3 py-1 h-auto min-h-[28px] rounded-full hover:opacity-90 w-auto min-w-[120px]`}
        style={{ backgroundColor: getStageBackgroundColor(selectedStage) }}
      >
        <SelectValue>{selectedStage}</SelectValue>
      </SelectTrigger>
      <SelectContent 
        className="bg-white border border-gray-200 shadow-lg z-[9999] min-w-[160px] max-h-[300px] overflow-y-auto"
        position="popper"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        {stages.map((stageOption) => (
          <SelectItem 
            key={stageOption.id} 
            value={stageOption.name}
            className="hover:bg-gray-100 cursor-pointer py-2 px-3 text-sm text-gray-900 focus:bg-gray-100 focus:text-gray-900"
          >
            {stageOption.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StageDropdown;
