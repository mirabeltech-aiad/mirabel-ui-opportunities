import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import contactsApi from "@/services/contactsApi";
import { Button } from "@/shared/components/ui/button";
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

const ProspectingStageDropdown = ({
  prospectingStage,
  opportunity,
  onStageChange,
  prospectingStages = [],
  onRefresh,
}) => {
  const [selectedStage, setSelectedStage] = useState(prospectingStage);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    targetStageName: null,
    targetStageData: null,
  });

  // Normalizers for generalized master data
  const getStageId = (s) =>
    s?.StageId ?? s?.id ?? s?.ID ?? s?.Value ?? s?.value ?? null;
  const getStageLabel = (s) =>
    s?.StageName ?? s?.name ?? s?.Label ?? s?.label ?? s?.Display ?? "";
  const getStageColor = (s) =>
    s?.ColorCode ?? s?.colorHex ?? s?.colorCode ?? s?.color ?? "#ffffff";

  // Debug: Log the prospecting stages data structure
  useEffect(() => {
    // Colors are provided by API via ColorCode; no client randomization
    console.log(
      "ProspectingStageDropdown: stages loaded (ColorCode driven):",
      prospectingStages
    );
  }, [prospectingStages]);

  // Update selected stage when stage prop changes
  useEffect(() => {
    setSelectedStage(prospectingStage);
  }, [prospectingStage]);

  const normalize = (v) =>
    String(v ?? "")
      .trim()
      .toLowerCase();
  const slug = (v) => normalize(v).replace(/[^a-z0-9]+/g, "");
  const getSelectedStage = () => {
    if (selectedStage === "__none__" || !selectedStage) {
      return null;
    }
    const target = normalize(selectedStage);
    const byExact = prospectingStages.find(
      (s) => normalize(getStageLabel(s)) === target
    );
    if (byExact) return byExact;
    const bySlug = prospectingStages.find(
      (s) => slug(getStageLabel(s)) === slug(selectedStage)
    );
    if (bySlug) return bySlug;
    const asId = parseInt(String(selectedStage), 10);
    if (!Number.isNaN(asId)) {
      const byId = prospectingStages.find(
        (s) => parseInt(String(getStageId(s) ?? ""), 10) === asId
      );
      if (byId) return byId;
    }
    return null;
  };

  const getInputBoxStyle = () => {
    const selectedStageData = getSelectedStage();
    console.log("getInputBoxStyle - selectedStageData:", selectedStageData);

    let curpropStageBgColor = "#d1d5db"; // default for no selection

    if (selectedStageData) {
      // Use API color directly; fall back to subtle gray when API sends white/empty
      const apiColor = getStageColor(selectedStageData);
      curpropStageBgColor =
        apiColor && normalize(apiColor) !== "#ffffff" ? apiColor : "#d1d5db";
    }

    const curpropStageTextColor =
      curpropStageBgColor === "" ||
        curpropStageBgColor === "#ffffff" ||
        curpropStageBgColor === "#d1d5db"
        ? "#000000"
        : "#ffffff";

    console.log("getInputBoxStyle - colors:", {
      curpropStageBgColor,
      curpropStageTextColor,
    });

    return {
      backgroundColor: curpropStageBgColor,
      color: curpropStageTextColor,
    };
  };

  const handleStageChange = async (newStageName) => {
    // Handle the special "none" case
    if (newStageName === "__none__") {
      // Clear the prospecting stage
      try {
        const primaryId =
          opportunity?.gsCustomersID || opportunity?.ContactDetails?.ID;
        const subId = opportunity?.SubContactDetails?.ID;
        const targetId = subId || primaryId;

        if (targetId) {
          await contactsApi.updateContact({
            fieldName: "ProspectingStageId",
            fieldValue: "",
            ID: targetId,
            IsEmailIDVerificationEnabled: true,
            IsSubContactUpdate: false,
          });
        }

        // Call the callback if provided
        if (onStageChange) {
          onStageChange(opportunity.id, "");
        }

        // Trigger data refetch after successful update
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error("Error clearing prospecting stage:", error);
        setSelectedStage(prospectingStage);
      }
      return;
    }

    // Find the selected stage data to get its ID
    const selectedStageData = prospectingStages.find(
      (s) => getStageLabel(s) === newStageName
    );
    if (selectedStageData) {
      try {
        const primaryId =
          opportunity?.gsCustomersID || opportunity?.ContactDetails?.ID;
        const subId = opportunity?.SubContactDetails?.ID;

        // Check if this is a primary contact (gsCustomerID === subContactID)
        if (primaryId && subId && primaryId === subId) {
          // Open confirmation modal to choose scope
          setConfirmState({
            isOpen: true,
            targetStageName: newStageName,
            targetStageData: selectedStageData,
          });
          return; // do not change selection until confirmed
        } else {
          // Sub-contact only - update the specific sub-contact
          const targetId = subId || primaryId;
          if (targetId) {
            await contactsApi.updateContact({
              fieldName: "ProspectingStageId",
              fieldValue: String(getStageId(selectedStageData)),
              ID: targetId,
              IsEmailIDVerificationEnabled: true,
              IsSubContactUpdate: false,
            });
          }
        }

        // Call the callback if provided
        if (onStageChange) {
          onStageChange(opportunity.id, newStageName);
        }

        // Trigger data refetch after successful update
        if (onRefresh) {
          onRefresh();
        }

        // Update local selection only after successful update
        setSelectedStage(newStageName);
      } catch (error) {
        console.error("Error updating prospecting stage:", error);
        // Revert the selection on error
        setSelectedStage(prospectingStage);
      }
    }
  };

  const handleConfirmApplyAll = async (applyAllToSubContacts) => {
    const { targetStageData, targetStageName } = confirmState;
    try {
      const primaryId =
        opportunity?.gsCustomersID || opportunity?.ContactDetails?.ID;
      if (!primaryId) return;

      await contactsApi.updateContact({
        fieldName: "ProspectingStageId",
        fieldValue: String(getStageId(targetStageData)),
        ID: primaryId,
        IsEmailIDVerificationEnabled: true,
        IsSubContactUpdate: !!applyAllToSubContacts,
      });

      if (onStageChange) {
        onStageChange(opportunity.id, targetStageName);
      }
      if (onRefresh) {
        onRefresh();
      }
      setSelectedStage(targetStageName);
    } catch (err) {
      console.error("Error updating prospecting stage (confirm modal):", err);
    } finally {
      setConfirmState({
        isOpen: false,
        targetStageName: null,
        targetStageData: null,
      });
    }
  };

  // Show fallback if no stages are available
  if (!prospectingStages || prospectingStages.length === 0) {
    return (
      <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-[13px] font-medium min-w-[120px] h-[28px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="border-0 font-medium px-3 py-1 h-auto min-h-[28px] rounded-full hover:opacity-90 w-[150px] min-w-[150px] flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[13px]"
          style={getInputBoxStyle()}
        >
          <span className="truncate max-w-[200px] block">
            {selectedStage === "__none__" || !selectedStage
              ? ""
              : selectedStage}
          </span>
          <ChevronDown className="h-3 w-3 flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-white border border-gray-200 shadow-lg z-[9999] min-w-[160px] w-[260px] max-h-[300px] overflow-y-auto text-[13px]"
        align="start"
        sideOffset={4}
      >
        {prospectingStages.map((stageOption) => (
          <DropdownMenuItem
            key={getStageId(stageOption) ?? getStageLabel(stageOption)}
            onClick={() => handleStageChange(getStageLabel(stageOption))}
            className="hover:bg-gray-100 cursor-pointer py-2 px-3 text-[13px] text-gray-900 focus:bg-gray-100 focus:text-gray-900"
          >
            <div className="flex items-center gap-2 w-full">
              <span className="truncate max-w-[200px]">
                {getStageLabel(stageOption)}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>

      {/* Confirmation modal for primary-contact scope choice */}
      <AlertDialog
        open={confirmState.isOpen}
        onOpenChange={(open) =>
          !open &&
          setConfirmState({
            isOpen: false,
            targetStageName: null,
            targetStageData: null,
          })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apply stage to all sub-contacts?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are updating the prospecting stage for a primary contact. Do
              you want to apply "{confirmState.targetStageName}" to all
              sub-contacts, or only the primary contact?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel
              onClick={() =>
                setConfirmState({
                  isOpen: false,
                  targetStageName: null,
                  targetStageData: null,
                })
              }
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => handleConfirmApplyAll(false)}
            >
              Only Primary
            </Button>
            <AlertDialogAction onClick={() => handleConfirmApplyAll(true)}>
              Apply to All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
};

export default ProspectingStageDropdown;