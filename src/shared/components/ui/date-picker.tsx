import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
}

export function DatePicker({ date, onDateChange, placeholder = "Pick a date" }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={`w-full justify-start text-left font-normal ${
            !date && "text-muted-foreground"
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

interface DateRangePickerProps {
  startDate?: Date
  endDate?: Date
  onDateRangeChange?: (startDate?: Date, endDate?: Date) => void
}

export function DateRangePicker({ startDate, endDate, onDateRangeChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <DatePicker
        date={startDate}
        onDateChange={(date) => onDateRangeChange?.(date, endDate)}
        placeholder="Start date"
      />
      <span className="text-gray-500">to</span>
      <DatePicker
        date={endDate}
        onDateChange={(date) => onDateRangeChange?.(startDate, date)}
        placeholder="End date"
      />
    </div>
  )
}