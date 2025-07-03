
import React, { useState } from 'react';
import { Calendar } from '@OpportunityComponents/ui/calendar';
import { Button } from '@OpportunityComponents/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@OpportunityComponents/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const DateRangePicker = ({ dateRange, onDateRangeChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (range) => {
    onDateRangeChange(range);
    // Close popover if both dates are selected
    if (range?.from && range?.to) {
      setIsOpen(false);
    }
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return "Pick start date";
    if (!dateRange?.to) return `${format(dateRange.from, "MMM dd, yyyy")} - Pick end date`;
    return `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-72 justify-start text-left font-normal border-blue-300 text-blue-700",
            !dateRange?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleDateSelect}
          numberOfMonths={2}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
