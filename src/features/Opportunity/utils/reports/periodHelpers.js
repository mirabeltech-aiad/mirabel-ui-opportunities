
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
    case "q1-2024":
      return {
        startDate: new Date("2023-10-01"), // Q4 2023
        endDate: new Date("2023-12-31")
      };
    case "last-90-days":
      const start90 = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000)); // 90-180 days ago
      const end90 = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      return { startDate: start90, endDate: end90 };
    case "last-6-months":
      const start6m = new Date(now.getFullYear(), now.getMonth() - 12, 1); // 6-12 months ago
      const end6m = new Date(now.getFullYear(), now.getMonth() - 6, 0);
      return { startDate: start6m, endDate: end6m };
    case "ytd":
      return {
        startDate: new Date(now.getFullYear() - 1, 0, 1), // Last year YTD
        endDate: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      };
    case "last-year":
      return {
        startDate: new Date(now.getFullYear() - 2, 0, 1), // Year before last
        endDate: new Date(now.getFullYear() - 2, 11, 31)
      };
    default:
      return { startDate: new Date(0), endDate: new Date(0) };
  }
};

