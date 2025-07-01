
// Date calculation utilities for reports service

export const getPeriodDateParams = (period, customDateRange = null) => {
  // Handle custom date range
  if (period === 'custom' && customDateRange?.from && customDateRange?.to) {
    return {
      CreatedFrom: customDateRange.from.toISOString().split('T')[0],
      CreatedTo: customDateRange.to.toISOString().split('T')[0],
      CloseFrom: customDateRange.from.toISOString().split('T')[0],
      CloseTo: customDateRange.to.toISOString().split('T')[0]
    };
  }

  const now = new Date();
  let startDate, endDate;

  switch (period) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      break;
    case "yesterday":
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
      endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
      break;
    case "this-week":
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      startDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate());
      endDate = now;
      break;
    case "last-week":
      const lastWeekEnd = new Date(now);
      lastWeekEnd.setDate(now.getDate() - now.getDay() - 1); // Last Saturday
      const lastWeekStart = new Date(lastWeekEnd);
      lastWeekStart.setDate(lastWeekEnd.getDate() - 6); // Previous Sunday
      startDate = new Date(lastWeekStart.getFullYear(), lastWeekStart.getMonth(), lastWeekStart.getDate());
      endDate = new Date(lastWeekEnd.getFullYear(), lastWeekEnd.getMonth(), lastWeekEnd.getDate(), 23, 59, 59);
      break;
    case "last-7-days":
      startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      endDate = now;
      break;
    case "last-14-days":
      startDate = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));
      endDate = now;
      break;
    case "this-month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
      break;
    case "last-month":
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      startDate = lastMonth;
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59); // Last day of previous month
      break;
    case "last-30-days":
      startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      endDate = now;
      break;
    case "last-60-days":
      startDate = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
      endDate = now;
      break;
    case "last-90-days":
      startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      endDate = now;
      break;
    case "this-quarter":
      const currentQuarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
      endDate = new Date(now.getFullYear(), currentQuarter * 3 + 3, 0);
      break;
    case "last-quarter":
      const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
      const lastQuarterYear = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const adjustedLastQuarter = lastQuarter < 0 ? 3 : lastQuarter;
      startDate = new Date(lastQuarterYear, adjustedLastQuarter * 3, 1);
      endDate = new Date(lastQuarterYear, adjustedLastQuarter * 3 + 3, 0);
      break;
    case "last-120-days":
      startDate = new Date(now.getTime() - (120 * 24 * 60 * 60 * 1000));
      endDate = now;
      break;
    case "last-6-months":
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      endDate = now;
      break;
    case "this-year":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = now;
      break;
    case "ytd":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = now;
      break;
    case "last-year":
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear() - 1, 11, 31);
      break;
    case "last-12-months":
      startDate = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
      endDate = now;
      break;
    case "last-18-months":
      startDate = new Date(now.getFullYear(), now.getMonth() - 18, now.getDate());
      endDate = now;
      break;
    case "last-24-months":
      startDate = new Date(now.getFullYear(), now.getMonth() - 24, now.getDate());
      endDate = now;
      break;
    default:
      startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      endDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
  }

  return {
    CreatedFrom: startDate.toISOString().split('T')[0],
    CreatedTo: endDate.toISOString().split('T')[0],
    CloseFrom: startDate.toISOString().split('T')[0],
    CloseTo: endDate.toISOString().split('T')[0]
  };
};
