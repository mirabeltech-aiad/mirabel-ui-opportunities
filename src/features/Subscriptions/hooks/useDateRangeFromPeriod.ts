import { useMemo } from 'react';
import { calculateDateRange } from '../utils/periodUtils';

interface UseDateRangeFromPeriodProps {
  selectedPeriod: string;
  customDateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
}

export const useDateRangeFromPeriod = ({ 
  selectedPeriod, 
  customDateRange 
}: UseDateRangeFromPeriodProps) => {
  return useMemo(() => {
    // If custom date range is set, use it
    if (customDateRange?.startDate || customDateRange?.endDate) {
      return customDateRange;
    }
    
    // Otherwise, calculate from period
    const calculatedRange = calculateDateRange(selectedPeriod);
    return {
      startDate: calculatedRange.startDate,
      endDate: calculatedRange.endDate
    };
  }, [selectedPeriod, customDateRange]);
};
