
// Period and date calculation utilities for reports

// Helper function to filter opportunities by period
export const filterOpportunitiesByPeriod = (opportunities, period) => {
  const now = new Date();
  let startDate, endDate;

  switch (period) {
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
    case "q1-2024":
      startDate = new Date("2024-01-01");
      endDate = new Date("2024-03-31");
      break;
    case "last-90-days":
      startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      endDate = now;
      break;
    case "last-6-months":
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
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
    default:
      return opportunities; // Return all if no valid period
  }

  return opportunities.filter(opp => {
    const oppDate = new Date(opp.actualCloseDate || opp.projCloseDate || opp.createdDate);
    return oppDate >= startDate && oppDate <= endDate;
  });
};

// Helper function to get previous period for comparison
export const getPreviousPeriod = (period) => {
  const now = new Date();
  
  switch (period) {
    case "all":
      // For "all" time comparison, use a meaningful previous period (e.g., same period last year)
      return {
        startDate: new Date(now.getFullYear() - 1, 0, 1),
        endDate: new Date(now.getFullYear() - 1, 11, 31)
      };
    case "today":
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return {
        startDate: yesterday,
        endDate: yesterday
      };
    case "yesterday":
      const dayBeforeYesterday = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      return {
        startDate: dayBeforeYesterday,
        endDate: dayBeforeYesterday
      };
    case "this-week":
      const lastWeekStart = new Date(now.getTime() - ((now.getDay() + 7) * 24 * 60 * 60 * 1000));
      const lastWeekEnd = new Date(lastWeekStart.getTime() + (6 * 24 * 60 * 60 * 1000));
      return { startDate: lastWeekStart, endDate: lastWeekEnd };
    case "last-week":
      const twoWeeksAgoStart = new Date(now.getTime() - ((now.getDay() + 14) * 24 * 60 * 60 * 1000));
      const twoWeeksAgoEnd = new Date(twoWeeksAgoStart.getTime() + (6 * 24 * 60 * 60 * 1000));
      return { startDate: twoWeeksAgoStart, endDate: twoWeeksAgoEnd };
    case "last-7-days":
      return {
        startDate: new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000)),
        endDate: new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
      };
    case "last-14-days":
      return {
        startDate: new Date(now.getTime() - (28 * 24 * 60 * 60 * 1000)),
        endDate: new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000))
      };
    case "this-month":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth(), 0)
      };
    case "last-month":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() - 1, 0)
      };
    case "last-30-days":
      return {
        startDate: new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000)),
        endDate: new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
      };
    case "last-60-days":
      return {
        startDate: new Date(now.getTime() - (120 * 24 * 60 * 60 * 1000)),
        endDate: new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000))
      };
    case "last-90-days":
      return {
        startDate: new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000)),
        endDate: new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000))
      };
    case "this-quarter":
      const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
      const lastQuarterYear = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const adjustedLastQuarter = lastQuarter < 0 ? 3 : lastQuarter;
      return {
        startDate: new Date(lastQuarterYear, adjustedLastQuarter * 3, 1),
        endDate: new Date(lastQuarterYear, adjustedLastQuarter * 3 + 3, 0)
      };
    case "last-quarter":
      const twoQuartersAgo = Math.floor(now.getMonth() / 3) - 2;
      const twoQuartersAgoYear = twoQuartersAgo < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const adjustedTwoQuartersAgo = twoQuartersAgo < 0 ? 4 + twoQuartersAgo : twoQuartersAgo;
      return {
        startDate: new Date(twoQuartersAgoYear, adjustedTwoQuartersAgo * 3, 1),
        endDate: new Date(twoQuartersAgoYear, adjustedTwoQuartersAgo * 3 + 3, 0)
      };
    case "last-120-days":
      return {
        startDate: new Date(now.getTime() - (240 * 24 * 60 * 60 * 1000)),
        endDate: new Date(now.getTime() - (120 * 24 * 60 * 60 * 1000))
      };
    case "last-6-months":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 12, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() - 6, 0)
      };
    case "ytd":
    case "this-year":
      return {
        startDate: new Date(now.getFullYear() - 1, 0, 1),
        endDate: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      };
    case "last-year":
      return {
        startDate: new Date(now.getFullYear() - 2, 0, 1),
        endDate: new Date(now.getFullYear() - 2, 11, 31)
      };
    case "last-12-months":
      return {
        startDate: new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()),
        endDate: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      };
    case "last-18-months":
      return {
        startDate: new Date(now.getFullYear() - 3, now.getMonth() - 6, now.getDate()),
        endDate: new Date(now.getFullYear() - 1, now.getMonth() - 6, now.getDate())
      };
    case "last-24-months":
      return {
        startDate: new Date(now.getFullYear() - 4, now.getMonth(), now.getDate()),
        endDate: new Date(now.getFullYear() - 2, now.getMonth(), now.getDate())
      };
    case "q1-2024":
      return {
        startDate: new Date("2023-01-01"), // Q1 2023
        endDate: new Date("2023-03-31")
      };
    default:
      // Return previous year as fallback
      return {
        startDate: new Date(now.getFullYear() - 1, 0, 1),
        endDate: new Date(now.getFullYear() - 1, 11, 31)
      };
  }
};

// Helper function to get current period dates (matches SP logic)
export const getCurrentPeriod = (period) => {
  const now = new Date();
  
  switch (period) {
    case "all":
      return {
        startDate: new Date(1900, 0, 1),
        endDate: new Date(2099, 11, 31)
      };
    case "today":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate())
      };
    case "yesterday":
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return {
        startDate: yesterday,
        endDate: yesterday
      };
    case "this-week":
      const startOfWeek = new Date(now.getTime() - (now.getDay() * 24 * 60 * 60 * 1000));
      const endOfWeek = new Date(startOfWeek.getTime() + (6 * 24 * 60 * 60 * 1000));
      return { startDate: startOfWeek, endDate: endOfWeek };
    case "last-week":
      const lastWeekStart = new Date(now.getTime() - ((now.getDay() + 7) * 24 * 60 * 60 * 1000));
      const lastWeekEnd = new Date(lastWeekStart.getTime() + (6 * 24 * 60 * 60 * 1000));
      return { startDate: lastWeekStart, endDate: lastWeekEnd };
    case "last-7-days":
      return {
        startDate: new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)),
        endDate: now
      };
    case "last-14-days":
      return {
        startDate: new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000)),
        endDate: now
      };
    case "this-month":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      };
    case "last-month":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth(), 0)
      };
    case "last-30-days":
      return {
        startDate: new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)),
        endDate: now
      };
    case "last-60-days":
      return {
        startDate: new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000)),
        endDate: now
      };
    case "last-90-days":
      return {
        startDate: new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000)),
        endDate: now
      };
    case "this-quarter":
      const currentQuarter = Math.floor(now.getMonth() / 3);
      return {
        startDate: new Date(now.getFullYear(), currentQuarter * 3, 1),
        endDate: new Date(now.getFullYear(), currentQuarter * 3 + 3, 0)
      };
    case "last-quarter":
      const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
      const lastQuarterYear = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const adjustedLastQuarter = lastQuarter < 0 ? 3 : lastQuarter;
      return {
        startDate: new Date(lastQuarterYear, adjustedLastQuarter * 3, 1),
        endDate: new Date(lastQuarterYear, adjustedLastQuarter * 3 + 3, 0)
      };
    case "last-120-days":
      return {
        startDate: new Date(now.getTime() - (120 * 24 * 60 * 60 * 1000)),
        endDate: now
      };
    case "last-6-months":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 6, 1),
        endDate: now
      };
    case "ytd":
    case "this-year":
      return {
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: now
      };
    case "last-year":
      return {
        startDate: new Date(now.getFullYear() - 1, 0, 1),
        endDate: new Date(now.getFullYear() - 1, 11, 31)
      };
    case "last-12-months":
      return {
        startDate: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        endDate: now
      };
    case "last-18-months":
      return {
        startDate: new Date(now.getFullYear() - 1, now.getMonth() - 6, now.getDate()),
        endDate: now
      };
    case "last-24-months":
      return {
        startDate: new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()),
        endDate: now
      };
    case "q1-2024":
      return {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-03-31")
      };
    default:
      // Fallback to this quarter
      const defaultQuarter = Math.floor(now.getMonth() / 3);
      return {
        startDate: new Date(now.getFullYear(), defaultQuarter * 3, 1),
        endDate: new Date(now.getFullYear(), defaultQuarter * 3 + 3, 0)
      };
  }
};

