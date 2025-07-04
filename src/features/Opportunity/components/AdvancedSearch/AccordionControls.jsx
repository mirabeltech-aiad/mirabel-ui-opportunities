
import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Maximize2, Minimize2 } from "lucide-react";

const AccordionControls = ({ onExpandAll, onCollapseAll, isExpanded, onToggle }) => {
  return (
    <div className="flex justify-start mb-4">
      <Toggle
        pressed={isExpanded}
        onPressedChange={onToggle}
        aria-label={isExpanded ? "Collapse all sections" : "Expand all sections"}
        className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 hover:bg-blue-50"
      >
        {isExpanded ? (
          <>
            <Minimize2 className="h-4 w-4 mr-2" />
            Collapse All
          </>
        ) : (
          <>
            <Maximize2 className="h-4 w-4 mr-2" />
            Expand All
          </>
        )}
      </Toggle>
    </div>
  );
};

export default AccordionControls;
