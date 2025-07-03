
import React from "react";
import { Label } from "@OpportunityComponents/ui/label";
import { Textarea } from "@OpportunityComponents/ui/textarea";

const NotesSection = ({ formData, handleInputChange, shouldDisableFields }) => {
  return (
    <div className="md:col-span-2">
      <div className="relative">
        <Textarea
          id="notes"
          placeholder=""
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          className={`h-32 pt-6 pb-2 px-3 resize-none ${shouldDisableFields ? "bg-gray-100" : ""}`}
          disabled={shouldDisableFields}
        />
        <Label 
          htmlFor="notes"
          className="absolute left-3 top-2 text-xs text-primary bg-background px-1"
        >
          Notes
        </Label>
      </div>
    </div>
  );
};

export default NotesSection;
