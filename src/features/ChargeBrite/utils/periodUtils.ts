
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subDays, subWeeks, subMonths, subQuarters, subYears, startOfDay, endOfDay } from 'date-fns';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export const calculateDateRange = (periodKey: string): DateRange => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = subDays(today, 1);

  switch (periodKey) {
    // Short-term Periods
    case 'yesterday':
      return {
        startDate: startOfDay(yesterday),
        endDate: endOfDay(yesterday)
      };
    
    case 'last_7_days':
      return {
        startDate: subDays(today, 7),
        endDate: today
      };
    
    case 'last_14_days':
      return {
        startDate: subDays(today, 14),
        endDate: today
      };
    
    case 'last_30_days':
      return {
        startDate: subDays(today, 30),
        endDate: today
      };

    case 'last_90_days':
      return {
        startDate: subDays(today, 90),
        endDate: today
      };

    // Calendar-based Periods
    case 'this_week':
      return {
        startDate: startOfWeek(today, { weekStartsOn: 1 }), // Monday
        endDate: today
      };
    
    case 'last_week':
      const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
      return {
        startDate: lastWeekStart,
        endDate: endOfWeek(lastWeekStart, { weekStartsOn: 1 })
      };
    
    case 'this_month':
      return {
        startDate: startOfMonth(today),
        endDate: today
      };
    
    case 'last_month':
      const lastMonth = subMonths(today, 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth)
      };

    case 'month_to_date':
      return {
        startDate: startOfMonth(today),
        endDate: today
      };
    
    case 'this_quarter':
      return {
        startDate: startOfQuarter(today),
        endDate: today
      };
    
    case 'last_quarter':
      const lastQuarter = subQuarters(today, 1);
      return {
        startDate: startOfQuarter(lastQuarter),
        endDate: endOfQuarter(lastQuarter)
      };

    case 'quarter_to_date':
      return {
        startDate: startOfQuarter(today),
        endDate: today
      };

    case 'this_year':
      return {
        startDate: startOfYear(today),
        endDate: today
      };
    
    case 'last_year':
      const lastYear = subYears(today, 1);
      return {
        startDate: startOfYear(lastYear),
        endDate: endOfYear(lastYear)
      };

    case 'year_to_date':
      return {
        startDate: startOfYear(today),
        endDate: today
      };

    // Extended Periods
    case 'last_3_months':
      return {
        startDate: subMonths(today, 3),
        endDate: today
      };
    
    case 'last_6_months':
      return {
        startDate: subMonths(today, 6),
        endDate: today
      };
    
    case 'last_12_months':
      return {
        startDate: subMonths(today, 12),
        endDate: today
      };

    case 'last_2_years':
      return {
        startDate: subYears(today, 2),
        endDate: today
      };

    // Special Periods
    case 'all_time':
      return {
        startDate: new Date(2020, 0, 1), // Reasonable start date
        endDate: today
      };

    // Default to last 30 days
    default:
      return {
        startDate: subDays(today, 30),
        endDate: today
      };
  }
};

export const formatDateRange = (dateRange: DateRange): string => {
  const { startDate, endDate } = dateRange;
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
};
