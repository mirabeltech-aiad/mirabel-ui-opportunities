
import React, { useState } from "react";
import { Label } from "@OpportunityComponents/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@OpportunityComponents/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const StageSelector = ({ handleSelectChange }) => {
  const [selectedStages, setSelectedStages] = useState([]);

  // Preserved exact function behavior
  const handleStageSelect = (stage) => {
    setSelectedStages((current) => {
      if (current.includes(stage)) {
        const newStages = current.filter((s) => s !== stage);
        handleSelectChange("stages", newStages);
        return newStages;
      } else {
        const newStages = [...current, stage];
        handleSelectChange("stages", newStages);
        return newStages;
      }
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="opportunity-stage">Stage</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <span className="truncate">
              {selectedStages.length === 0 ? "Select stages" : `${selectedStages.length} stage(s) selected`}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[240px]" align="start">
          <DropdownMenuCheckboxItem
            checked={selectedStages.includes("prospecting")}
            onCheckedChange={() => handleStageSelect("prospecting")}
          >
            Prospecting
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStages.includes("qualification")}
            onCheckedChange={() => handleStageSelect("qualification")}
          >
            Qualification
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStages.includes("needs-analysis")}
            onCheckedChange={() => handleStageSelect("needs-analysis")}
          >
            Needs Analysis
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStages.includes("proposal")}
            onCheckedChange={() => handleStageSelect("proposal")}
          >
            Proposal
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStages.includes("negotiation")}
            onCheckedChange={() => handleStageSelect("negotiation")}
          >
            Negotiation
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStages.includes("closed-won")}
            onCheckedChange={() => handleStageSelect("closed-won")}
          >
            Closed Won
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStages.includes("closed-lost")}
            onCheckedChange={() => handleStageSelect("closed-lost")}
          >
            Closed Lost
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StageSelector;
