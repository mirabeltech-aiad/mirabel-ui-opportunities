
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X } from 'lucide-react';

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange: (startDate?: Date, endDate?: Date) => void;
}

const DateRangePicker = ({ startDate, endDate, onDateRangeChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "justify-start text-left font-normal h-auto px-0 py-0 text-sm hover:bg-transparent focus:ring-0 focus:ring-offset-0",
              !startDate && !endDate && "text-muted-foreground"
            )}
          >
            {startDate && endDate ? (
              <span className="truncate">
                {format(startDate, "MMM dd")} - {format(endDate, "MMM dd, yyyy")}
              </span>
            ) : startDate ? (
              <span className="truncate">
                {format(startDate, "MMM dd, yyyy")}
              </span>
            ) : (
              "Date"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white shadow-lg border border-gray-200 z-50" align="start">
          <Calendar
            mode="range"
            selected={{ from: startDate, to: endDate }}
            onSelect={(range) => {
              onDateRangeChange(range?.from, range?.to);
              if (range?.from && range?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      {(startDate || endDate) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDateRangeChange(undefined, undefined)}
          className="h-4 w-4 p-0 hover:bg-gray-100 ml-1"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </>
  );
};

export default DateRangePicker;
