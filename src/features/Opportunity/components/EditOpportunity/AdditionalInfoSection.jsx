
import React from "react";
import FloatingLabelInput from "./FloatingLabelInput";
import { Button } from "@OpportunityComponents/ui/button";
import { Calendar } from "@OpportunityComponents/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@OpportunityComponents/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@OpportunityComponents/ui/label";
import { Textarea } from "@OpportunityComponents/ui/textarea";

const AdditionalInfoSection = ({ formData, handleInputChange, isAddMode = false }) => {
  const formatDateForInput = (dateString) => {
    if (!dateString) return undefined;
    try {
      return new Date(dateString);
    } catch {
      return undefined;
    }
  };

  const handleDateChange = (field, date) => {
    const dateString = date ? format(date, "yyyy-MM-dd") : "";
    handleInputChange(field, dateString);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {!isAddMode && (
          <FloatingLabelInput
            id="lostReason"
            label="Closed Lost Reason"
            value={formData.lostReason}
            onChange={(value) => handleInputChange("lostReason", value)}
          />
        )}

        {!isAddMode && (
          <FloatingLabelInput
            id="createdBy"
            label="Created By"
            value={formData.createdBy}
            onChange={(value) => handleInputChange("createdBy", value)}
            disabled={true}
            className="bg-gray-50"
          />
        )}

        {!isAddMode && (
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 w-full justify-start text-left font-normal pt-6 pb-2 px-3",
                    !formData.createdDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.createdDate ? format(new Date(formData.createdDate), "MMM dd, yyyy") : ""}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formatDateForInput(formData.createdDate)}
                  onSelect={(date) => handleDateChange("createdDate", date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <label 
              className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 bg-white px-1 ${
                formData.createdDate 
                  ? "top-1.5 text-xs text-blue-600" 
                  : "top-3.5 text-base text-gray-400"
              }`}
            >
              Created Date
            </label>
          </div>
        )}
      </div>
      
      {!isAddMode && (
        <div className="relative">
          <Textarea
            id="notes"
            placeholder=""
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            className="h-32 pt-6 pb-2 px-3 resize-none"
          />
          <Label 
            htmlFor="notes"
            className="absolute left-3 top-2 text-xs text-primary bg-background px-1"
          >
            Notes
          </Label>
        </div>
      )}
    </div>
  );
};

export default AdditionalInfoSection;
