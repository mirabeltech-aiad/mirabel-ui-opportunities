
// Shared helper functions for predictive analytics

export const getHistoricalData = (opportunities) => {
  return opportunities.filter(opp => 
    opp.status === 'Won' || opp.status === 'Lost'
  );
};

export const getCurrentPeriodRevenue = (opportunities) => {
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  
  return opportunities
    .filter(opp => opp.status === 'Won')
    .filter(opp => new Date(opp.actualCloseDate || opp.createdDate) >= threeMonthsAgo)
    .reduce((sum, opp) => sum + opp.amount, 0);
};

export const getMonthlyRevenue = (opportunities) => {
  const monthlyData = {};
  
  opportunities
    .filter(opp => opp.status === 'Won' && opp.actualCloseDate)
    .forEach(opp => {
      const date = new Date(opp.actualCloseDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, revenue: 0, date: date };
      }
      monthlyData[monthKey].revenue += opp.amount;
    });
  
  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
};

export const getDealAge = (opportunity) => {
  const created = new Date(opportunity.createdDate);
  const now = new Date();
  return Math.abs((now - created) / (1000 * 60 * 60 * 24));
};

export const calculateTrend = (monthlyData) => {
  if (monthlyData.length < 2) return 0;
  
  const n = monthlyData.length;
  const sumX = (n * (n + 1)) / 2;
  const sumY = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const sumXY = monthlyData.reduce((sum, item, index) => sum + (index + 1) * item.revenue, 0);
  const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;
  
  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
};

export const calculateQuarterlyRevenue = (historicalData) => {
  const quarterlyRevenue = [];
  const quarterlyData = {};
  
  historicalData.filter(opp => opp.status === 'Won' && opp.actualCloseDate).forEach(opp => {
    const date = new Date(opp.actualCloseDate);
    const quarter = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
    
    if (!quarterlyData[quarter]) {
      quarterlyData[quarter] = 0;
    }
    quarterlyData[quarter] += opp.amount;
  });
  
  const revenues = Object.values(quarterlyData);
  return revenues.length > 0 ? revenues.reduce((sum, rev) => sum + rev, 0) / revenues.length : 0;
};
