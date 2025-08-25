
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const NotesSection = ({ formData, handleInputChange, shouldDisableFields, getFieldError, hasSubmitted }) => {
  const error = getFieldError ? getFieldError("notes") : null;
  const hasError = hasSubmitted && error;

  return (
    <div className="md:col-span-2">
      <div className="relative">
        <Textarea
          id="notes"
          placeholder="Enter notes (minimum 10 characters required)"
          value={formData.notes || ""}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          className={`h-32 pt-6 pb-2 px-3 resize-none ${shouldDisableFields ? "bg-gray-100" : ""} ${
            hasError ? "border-red-500 focus:border-red-500" : ""
          }`}
          disabled={shouldDisableFields}
          required
        />
        <Label 
          htmlFor="notes"
          className={`absolute left-3 top-2 text-xs bg-background px-1 ${
            hasError ? "text-red-500" : "text-primary"
          }`}
        >
          Notes
        </Label>
        {hasError && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};

export default NotesSection;
