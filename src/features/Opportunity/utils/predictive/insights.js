
// AI insights generation using pattern recognition
import { getMonthlyRevenue, calculateQuarterlyRevenue } from './helpers.js';
import { calculateRepPerformanceMetrics } from './probability.js';

// Generate advanced insights using pattern recognition
export const generateAdvancedInsights = (opportunities, historicalData) => {
  const insights = [];
  const openOpportunities = opportunities.filter(opp => opp.status === 'Open');
  
  // Revenue momentum analysis
  const revenueInsight = analyzeRevenueMomentum(historicalData);
  if (revenueInsight) insights.push(revenueInsight);
  
  // Pipeline balance analysis
  const balanceInsight = analyzePipelineBalance(openOpportunities);
  if (balanceInsight) insights.push(balanceInsight);
  
  // Rep performance variance analysis
  const repInsight = analyzeRepPerformanceVariance(historicalData);
  if (repInsight) insights.push(repInsight);
  
  // Deal size trend analysis
  const sizeInsight = analyzeDealSizeTrends(opportunities);
  if (sizeInsight) insights.push(sizeInsight);
  
  // Seasonal pattern analysis
  const seasonalInsight = analyzeSeasonalPatterns(historicalData);
  if (seasonalInsight) insights.push(seasonalInsight);
  
  return insights;
};

const analyzeRevenueMomentum = (historicalData) => {
  const monthlyRevenue = getMonthlyRevenue(historicalData);
  if (monthlyRevenue.length < 6) return null;
  
  const recent3 = monthlyRevenue.slice(-3);
  const previous3 = monthlyRevenue.slice(-6, -3);
  
  const recentAvg = recent3.reduce((sum, m) => sum + m.revenue, 0) / 3;
  const previousAvg = previous3.reduce((sum, m) => sum + m.revenue, 0) / 3;
  
  const momentum = ((recentAvg - previousAvg) / previousAvg) * 100;
  
  if (momentum > 15) {
    return {
      type: 'positive',
      title: 'Strong Revenue Momentum',
      description: `Revenue has accelerated ${momentum.toFixed(1)}% in recent months, indicating excellent sales execution.`
    };
  } else if (momentum < -15) {
    return {
      type: 'warning',
      title: 'Revenue Momentum Declining',
      description: `Revenue has decelerated ${Math.abs(momentum).toFixed(1)}% recently. Review sales strategy and pipeline quality.`
    };
  }
  
  return null;
};

const analyzePipelineBalance = (openOpportunities) => {
  const stageDistribution = {};
  openOpportunities.forEach(opp => {
    stageDistribution[opp.stage] = (stageDistribution[opp.stage] || 0) + 1;
  });
  
  const total = openOpportunities.length;
  const earlyStage = (stageDistribution['Prospecting'] || 0) + (stageDistribution['Qualification'] || 0);
  const lateStage = (stageDistribution['Proposal'] || 0) + (stageDistribution['Negotiation'] || 0);
  
  if (total > 0) {
    const earlyRatio = earlyStage / total;
    const lateRatio = lateStage / total;
    
    if (lateRatio < 0.15) {
      return {
        type: 'warning',
        title: 'Pipeline Lacks Late-Stage Deals',
        description: `Only ${(lateRatio * 100).toFixed(0)}% of pipeline is in proposal/negotiation stages. Focus on advancing qualified opportunities.`
      };
    } else if (lateRatio > 0.4) {
      return {
        type: 'positive',
        title: 'Strong Late-Stage Pipeline',
        description: `${(lateRatio * 100).toFixed(0)}% of pipeline is in advanced stages, indicating healthy deal progression.`
      };
    }
  }
  
  return null;
};

const analyzeRepPerformanceVariance = (historicalData) => {
  const repPerformance = calculateRepPerformanceMetrics(historicalData);
  const winRates = Object.values(repPerformance)
    .filter(stats => stats.total >= 5)
    .map(stats => stats.winRate);
  
  if (winRates.length < 2) return null;
  
  const avgWinRate = winRates.reduce((sum, rate) => sum + rate, 0) / winRates.length;
  const variance = winRates.reduce((sum, rate) => sum + Math.pow(rate - avgWinRate, 2), 0) / winRates.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev > 25) {
    return {
      type: 'warning',
      title: 'High Rep Performance Variance',
      description: `Win rate standard deviation of ${stdDev.toFixed(1)}% indicates inconsistent performance. Consider standardizing sales processes.`
    };
  }
  
  return null;
};

const analyzeDealSizeTrends = (opportunities) => {
  const wonOpps = opportunities.filter(opp => opp.status === 'Won' && opp.actualCloseDate);
  if (wonOpps.length < 10) return null;
  
  // Sort by close date and compare recent vs historical
  const sorted = wonOpps.sort((a, b) => new Date(a.actualCloseDate) - new Date(b.actualCloseDate));
  const recentCount = Math.min(10, Math.floor(sorted.length * 0.3));
  const recent = sorted.slice(-recentCount);
  const historical = sorted.slice(0, -recentCount);
  
  const recentAvg = recent.reduce((sum, opp) => sum + opp.amount, 0) / recent.length;
  const historicalAvg = historical.reduce((sum, opp) => sum + opp.amount, 0) / historical.length;
  
  const trend = ((recentAvg - historicalAvg) / historicalAvg) * 100;
  
  if (trend > 20) {
    return {
      type: 'positive',
      title: 'Deal Size Trending Up',
      description: `Average deal size has increased ${trend.toFixed(1)}% recently, indicating successful upselling or market expansion.`
    };
  } else if (trend < -20) {
    return {
      type: 'warning',
      title: 'Deal Size Declining',
      description: `Average deal size has decreased ${Math.abs(trend).toFixed(1)}% recently. Consider value proposition review.`
    };
  }
  
  return null;
};

const analyzeSeasonalPatterns = (historicalData) => {
  const seasonalData = {};
  
  historicalData.forEach(opp => {
    if (!opp.actualCloseDate) return;
    
    const month = new Date(opp.actualCloseDate).getMonth();
    const quarter = Math.floor(month / 3);
    
    if (!seasonalData[quarter]) {
      seasonalData[quarter] = { deals: 0, revenue: 0 };
    }
    
    seasonalData[quarter].deals++;
    if (opp.status === 'Won') {
      seasonalData[quarter].revenue += opp.amount;
    }
  });
  
  const quarters = Object.values(seasonalData);
  if (quarters.length < 4) return null;
  
  const revenues = quarters.map(q => q.revenue);
  const maxRevenue = Math.max(...revenues);
  const minRevenue = Math.min(...revenues);
  const variance = (maxRevenue - minRevenue) / maxRevenue;
  
  if (variance > 0.4) {
    const bestQuarter = revenues.indexOf(maxRevenue);
    const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    return {
      type: 'positive',
      title: 'Strong Seasonal Pattern Detected',
      description: `${quarterNames[bestQuarter]} shows ${(variance * 100).toFixed(0)}% higher revenue. Plan resource allocation accordingly.`
    };
  }
  
  return null;
};
