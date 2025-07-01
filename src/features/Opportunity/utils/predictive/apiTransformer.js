
// Transform API response to predictive analytics format

export const transformPredictiveAnalyticsData = (apiResponse) => {
  if (!apiResponse || !apiResponse.content || !apiResponse.content.Data) {
    return {
      predictiveMetrics: getDefaultPredictiveMetrics(),
      revenueForecast: getDefaultRevenueForecast(),
      dealProbabilities: getDefaultDealProbabilities(),
      pipelineHealth: getDefaultPipelineHealth()
    };
  }

  const data = apiResponse.content.Data;
  
  return {
    predictiveMetrics: transformPredictiveMetrics(data),
    revenueForecast: transformRevenueForecast(data),
    dealProbabilities: transformDealProbabilities(data),
    pipelineHealth: transformPipelineHealth(data)
  };
};

const transformPredictiveMetrics = (data) => {
  // Calculate predicted revenue from Table4 (Revenue Forecasting Data)
  const forecastData = data.Table4 || [];
  const predictedEntries = forecastData.filter(item => item.DataType === 'predicted');
  const predictedRevenue = predictedEntries.reduce((sum, item) => sum + (item.Predicted || 0), 0);
  
  // Calculate historical revenue for growth comparison
  const historicalEntries = forecastData.filter(item => item.DataType === 'historical');
  const historicalRevenue = historicalEntries.reduce((sum, item) => sum + (item.Historical || 0), 0);
  const revenueGrowth = historicalRevenue > 0 ? ((predictedRevenue - historicalRevenue) / historicalRevenue) * 100 : 0;
  
  // Calculate expected deals from Table2 (Deal Probability Analysis)
  const dealProbabilities = data.Table2 || [];
  const expectedDeals = dealProbabilities.reduce((sum, deal) => {
    const probability = (deal.AIProbability || deal.CurrentProbability || 0) / 100;
    return sum + probability;
  }, 0);
  
  return {
    predictedRevenue,
    revenueGrowth,
    expectedDeals: Math.round(expectedDeals),
    insights: transformInsights(data.Table6 || []),
    recommendations: transformRecommendations(data.Table7 || [])
  };
};

const transformRevenueForecast = (data) => {
  // Transform Table4 (Revenue Forecasting Data) for chart display
  const forecastData = data.Table4 || [];
  
  return forecastData.map(item => ({
    month: item.MonthDisplay || `${item.Year}-${String(item.Month).padStart(2, '0')}`,
    historical: item.Historical || 0,
    predicted: item.Predicted || 0,
    confidence: item.MovingAvg3M ? 85 : 70, // Confidence based on moving average availability
    dataType: item.DataType || 'unknown'
  }));
};

const transformDealProbabilities = (data) => {
  // Transform Table2 (Deal Probability Analysis)
  const dealData = data.Table2 || [];
  
  return dealData.map(deal => ({
    id: deal.OpportunityId?.toString() || '',
    name: deal.OpportunityName || '',
    stage: deal.Stage || '',
    amount: deal.Amount || 0,
    probability: deal.AIProbability || deal.CurrentProbability || 0,
    riskLevel: deal.RiskLevel || 'Medium',
    daysOld: deal.DaysOld || 0,
    daysToClose: deal.DaysToClose || 0,
    predictedCloseDate: deal.PredictedCloseDate || null
  }));
};

const transformPipelineHealth = (data) => {
  // Transform Table1 (Pipeline Health Metrics)
  const stageData = data.Table1 || [];
  
  // Calculate overall health score based on stage distribution and conversion rates
  const totalOpportunities = stageData.reduce((sum, stage) => sum + (stage.OpportunityCount || 0), 0);
  const avgConversionRate = stageData.length > 0 
    ? stageData.reduce((sum, stage) => sum + (stage.ConversionRate || 0), 0) / stageData.length
    : 0;
  
  // Health score calculation (0-100)
  let healthScore = Math.min(100, Math.max(0, avgConversionRate * 100));
  
  // Count at-risk deals from Table2
  const dealData = data.Table2 || [];
  const atRiskDeals = dealData.filter(deal => 
    deal.RiskLevel === 'High Risk' || deal.DaysOld > 365
  ).length;
  
  // Determine status based on health score
  let status = 'Good';
  if (healthScore < 40) status = 'Poor';
  else if (healthScore < 70) status = 'Fair';
  
  return {
    healthScore: Math.round(healthScore),
    status,
    atRiskDeals,
    stageVelocity: transformStageVelocity(stageData),
    conversionRates: transformConversionRates(stageData)
  };
};

const transformStageVelocity = (stageData) => {
  return stageData.map(stage => ({
    stage: stage.Stage || '',
    avgDays: stage.AvgDaysInStage || 0,
    trend: stage.AvgDaysInStage > 60 ? 'concerning' : 
           stage.AvgDaysInStage > 30 ? 'stable' : 'good',
    opportunityCount: stage.OpportunityCount || 0,
    totalValue: stage.TotalValue || 0
  }));
};

const transformConversionRates = (stageData) => {
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b', '#6366f1'];
  
  return stageData.map((stage, index) => ({
    stage: stage.Stage || '',
    rate: Math.round((stage.ConversionRate || 0) * 100),
    color: colors[index % colors.length],
    opportunityCount: stage.OpportunityCount || 0,
    avgAmount: stage.AvgAmount || 0
  }));
};

const transformInsights = (insightData) => {
  return insightData.map(insight => ({
    title: insight.Title || '',
    description: insight.Description || '',
    type: insight.InsightCategory || 'neutral', // 'positive', 'warning', 'neutral'
    impact: insight.InsightType === 'revenue_momentum' ? 'high' : 'medium',
    category: insight.InsightType || 'general'
  }));
};

const transformRecommendations = (recommendationData) => {
  return recommendationData.map(rec => ({
    action: rec.ActionTitle || '',
    reason: rec.ReasonDescription || '',
    priority: rec.Priority || 'Medium',
    impact: rec.Impact || 'Medium',
    effort: rec.Effort || 'Medium',
    type: rec.RecommendationType || 'general'
  }));
};

// Default fallback data
const getDefaultPredictiveMetrics = () => ({
  predictedRevenue: 0,
  revenueGrowth: 0,
  expectedDeals: 0,
  insights: [],
  recommendations: []
});

const getDefaultRevenueForecast = () => [];

const getDefaultDealProbabilities = () => [];

const getDefaultPipelineHealth = () => ({
  healthScore: 0,
  status: 'Unknown',
  atRiskDeals: 0,
  stageVelocity: [],
  conversionRates: []
});
