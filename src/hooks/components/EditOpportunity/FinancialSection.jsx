
import React from "react";
import FloatingLabelInput from "./FloatingLabelInput";
import { Button } from "@OpportunityComponents/ui/button";
import { Calendar } from "@OpportunityComponents/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@OpportunityComponents/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const FinancialSection = ({ formData, handleInputChange }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FloatingLabelInput
        id="amount"
        label="Amount"
        type="number"
        value={formData.amount}
        onChange={(value) => handleInputChange("amount", value)}
      />

      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-12 w-full justify-start text-left font-normal pt-6 pb-2 px-3",
                !formData.projCloseDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.projCloseDate ? format(new Date(formData.projCloseDate), "MMM dd, yyyy") : ""}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formatDateForInput(formData.projCloseDate)}
              onSelect={(date) => handleDateChange("projCloseDate", date)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <label 
          className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 bg-white px-1 ${
            formData.projCloseDate 
              ? "top-1.5 text-xs text-blue-600" 
              : "top-3.5 text-base text-gray-400"
          }`}
        >
          Projected Close Date
        </label>
      </div>

      <FloatingLabelInput
        id="forecastRevenue"
        label="Forecast Revenue"
        type="number"
        value={formData.forecastRevenue}
        onChange={(value) => handleInputChange("forecastRevenue", value)}
        disabled={true}
        className="bg-gray-50"
      />
    </div>
  );
};

export default FinancialSection;
