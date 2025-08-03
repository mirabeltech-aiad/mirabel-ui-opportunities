
import React from 'react';
import { Calendar } from 'lucide-react';
import DateRangePicker from './DateRangePicker';

interface DateRangeFilterSectionProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  onDateRangeChange?: (startDate?: Date, endDate?: Date) => void;
}

const DateRangeFilterSection: React.FC<DateRangeFilterSectionProps> = ({
  dateRange,
  onDateRangeChange
}) => {
  if (!onDateRangeChange) return null;

  return (
    <div className="flex items-center px-3 py-2 min-w-0 w-full">
      <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0 mr-2" />
      <div className="min-w-0 w-full">
        <DateRangePicker
          startDate={dateRange?.startDate}
          endDate={dateRange?.endDate}
          onDateRangeChange={onDateRangeChange}
        />
      </div>
    </div>
  );
};

export default DateRangeFilterSection;
