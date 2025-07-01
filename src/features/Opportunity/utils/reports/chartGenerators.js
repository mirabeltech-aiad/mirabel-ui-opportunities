
// Chart data generation utilities for reports

// Generate real-time revenue chart data from API
export const generateRevenueChartFromAPI = (apiData, period = "this-quarter") => {
  const opportunities = apiData.opportunities?.content?.Data?.Opportunities || [];
  const wonOpportunities = opportunities.filter(opp => opp.Status === 'Won');
  
  // Group by month for chart display
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const monthsToShow = period === 'this-quarter' ? 3 : 6;
  
  const chartData = [];
  for (let i = 0; i < monthsToShow; i++) {
    const monthIndex = (currentMonth - monthsToShow + 1 + i + 12) % 12;
    const month = monthNames[monthIndex];
    
    const monthRevenue = wonOpportunities
      .filter(opp => {
        const closeDate = new Date(opp.ActualCloseDate || opp.CloseDate);
        return closeDate.getMonth() === monthIndex;
      })
      .reduce((sum, opp) => sum + (opp.Amount || 0), 0);
    
    // Generate forecast (simplified - would use actual forecasting logic)
    const forecast = monthRevenue > 0 ? monthRevenue * 1.1 : Math.random() * 200000 + 100000;
    
    chartData.push({
      month,
      revenue: monthRevenue,
      forecast: forecast
    });
  }
  
  return chartData;
};

// Generate pipeline chart data from API
export const generatePipelineChartFromAPI = (apiData) => {
  const opportunities = apiData.opportunities?.content?.Data?.Opportunities || [];
  const openOpportunities = opportunities.filter(opp => opp.Status === 'Open');
  
  // Group by stage
  const stageGroups = openOpportunities.reduce((acc, opp) => {
    const stage = opp.OppStageDetails?.Stage || 'Unknown';
    if (!acc[stage]) acc[stage] = { count: 0, value: 0 };
    acc[stage].count++;
    acc[stage].value += opp.Amount || 0;
    return acc;
  }, {});
  
  // Convert to chart format
  return Object.entries(stageGroups).map(([stage, data]) => ({
    stage,
    count: data.count,
    value: data.value
  }));
};

// Generate team performance data from API
export const generateTeamPerformanceFromAPI = (apiData, period = "this-quarter") => {
  const opportunities = apiData.opportunities?.content?.Data?.Opportunities || [];
  
  // Group by assigned rep
  const repGroups = opportunities.reduce((acc, opp) => {
    const rep = opp.AssignedTo || 'Unassigned';
    if (!acc[rep]) {
      acc[rep] = {
        opportunities: [],
        wonDeals: 0,
        lostDeals: 0,
        revenue: 0
      };
    }
    
    acc[rep].opportunities.push(opp);
    if (opp.Status === 'Won') {
      acc[rep].wonDeals++;
      acc[rep].revenue += opp.Amount || 0;
    } else if (opp.Status === 'Lost') {
      acc[rep].lostDeals++;
    }
    
    return acc;
  }, {});
  
  // Convert to team performance format
  return Object.entries(repGroups)
    .filter(([rep]) => rep !== 'Unassigned')
    .map(([rep, data], index) => {
      const totalDeals = data.wonDeals + data.lostDeals;
      const winRate = totalDeals > 0 ? (data.wonDeals / totalDeals) * 100 : 0;
      const avgDealSize = data.wonDeals > 0 ? data.revenue / data.wonDeals : 0;
      const quota = 1200000 + (index * 100000);
      const quotaProgress = (data.revenue / quota) * 100;
      
      let status = "On Track";
      if (quotaProgress >= 90) status = "Ahead";
      else if (quotaProgress < 60) status = "At Risk";
      
      return {
        id: index + 1,
        name: rep,
        initials: rep.split(' ').map(n => n[0]).join(''),
        deals: data.wonDeals,
        revenue: data.revenue,
        quota,
        winRate: winRate,
        avgDealSize: avgDealSize,
        status
      };
    })
    .slice(0, 10);
};

