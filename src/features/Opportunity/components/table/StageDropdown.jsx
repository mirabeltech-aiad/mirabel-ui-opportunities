import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { opportunitiesService } from "@/features/Opportunity/Services/opportunitiesService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const StageDropdown = ({
  stage,
  opportunityId,
  onStageChange,
  stages = [],
  isReadOnly = false,
  onClosedLost,
}) => {
  const [selectedStage, setSelectedStage] = useState(stage);
  const [isWonConfirmOpen, setIsWonConfirmOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState(null);
  const [restrictionOpen, setRestrictionOpen] = useState(false);
  const [restrictionMsg, setRestrictionMsg] = useState("");

  // Update selected stage when stage prop changes
  useEffect(() => {
    setSelectedStage(stage);
  }, [stage]);

  const getStageStyle = (stageName) => {
    const stageData = stages.find((s) => s.name === stageName);
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
    const stageData = stages.find((s) => s.name === stageName);
    return stageData?.colorCode || "#4fb3ff";
  };

  const performUpdate = async (newStage) => {
    // Find the selected stage data to get its ID
    const selectedStageData = stages.find((s) => s.name === newStage);
    if (!selectedStageData) return;
    try {
      await opportunitiesService.updateOpportunityStage(
        selectedStageData.id,
        opportunityId
      );
      if (onStageChange) {
        onStageChange(opportunityId, newStage);
      }
      setSelectedStage(newStage);
    } catch (error) {
      console.error("Error updating stage:", error);
      setSelectedStage(stage);
    }
  };

  const handleStageChange = async (newStage) => {
    // Guard: read-only rows
    if (isReadOnly) {
      setRestrictionMsg(
        "You do not have permission to modify this opportunity."
      );
      setRestrictionOpen(true);
      // revert UI select value
      setSelectedStage(stage);
      return;
    }

    // Guardrails for closed states handled by dropdown
    if (stage === "Closed Won" || stage === "Closed Lost") {
      setRestrictionMsg(
        "Closed opportunities cannot be moved via the grid. Use the Edit page."
      );
      setRestrictionOpen(true);
      setSelectedStage(stage);
      return;
    }

    if (newStage === "Closed Won") {
      setPendingStage(newStage);
      setIsWonConfirmOpen(true);
      return;
    }
    if (newStage === "Closed Lost") {
      if (onClosedLost) {
        onClosedLost(opportunityId);
      }
      // Revert until user completes loss reason flow
      setSelectedStage(stage);
      return;
    }

    await performUpdate(newStage);
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
    <>
      <Select value={selectedStage} onValueChange={handleStageChange}>
        <SelectTrigger
          className={`${getStageStyle(
            selectedStage
          )} border-0 font-medium px-3 py-1 h-auto min-h-[28px] rounded-full hover:opacity-90 w-auto min-w-[120px]`}
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

      {/* Closed Won confirmation */}
      <AlertDialog open={isWonConfirmOpen} onOpenChange={setIsWonConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Closed Won?</AlertDialogTitle>
            <AlertDialogDescription>
              This will set Probability to 100% and Actual Close Date to today.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsWonConfirmOpen(false);
                setPendingStage(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setIsWonConfirmOpen(false);
                if (pendingStage) {
                  await performUpdate(pendingStage);
                  setPendingStage(null);
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restrictions dialog */}
      <AlertDialog open={restrictionOpen} onOpenChange={setRestrictionOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Action not allowed</AlertDialogTitle>
            <AlertDialogDescription>{restrictionMsg}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setRestrictionOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StageDropdown;
