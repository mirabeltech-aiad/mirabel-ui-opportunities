
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MeetingDateSelector = ({ selectedDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  console.log('MeetingDateSelector rendered with selectedDate:', selectedDate);
  
  const handleDateSelect = (date) => {
    console.log('Date selected:', date);
    if (date && onDateChange) {
      onDateChange(date);
      setIsOpen(false); // Close the popover after selection
    }
  };

  return (
    <div className="px-4 py-2.5">
      <div className="flex items-center mb-2.5">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mr-3">
          <Clock className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">Schedule Meeting</h3>
      </div>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-8 text-xs",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-3 w-3" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pick a meeting date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-white border shadow-lg z-[9999]" 
          align="start"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MeetingDateSelector;
