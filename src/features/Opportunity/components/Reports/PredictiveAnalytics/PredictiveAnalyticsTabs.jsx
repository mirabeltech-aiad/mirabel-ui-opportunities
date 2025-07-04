
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Target, AlertTriangle, Brain, Activity, BarChart3, Users } from 'lucide-react';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';
import MetricTooltip from '../MetricTooltip';
import { RevenueForecastChart, PipelineVelocityChart, ConversionRatesChart, RepPerformanceChart } from './PredictiveAnalyticsCharts';

const PredictiveAnalyticsTabs = ({ 
  revenueForecast, 
  dealProbabilities, 
  pipelineHealth, 
  predictiveMetrics, 
  forecastPeriod,
  chartColors,
  apiData 
}) => {
  const { getTitleClass, getTabContainerClass } = useDesignSystem();

  // Extract representative performance data from apiData if available
  const repPerformanceData = React.useMemo(() => {
    if (!apiData?.content?.Data?.Table3) return [];
    
    return apiData.content.Data.Table3.map(rep => ({
      repName: rep.RepName || 'Unknown Rep',
      totalOpportunities: rep.TotalOpportunities || 0,
      wonDeals: rep.WonDeals || 0,
      lostDeals: rep.LostDeals || 0,
      openDeals: rep.OpenDeals || 0,
      winRate: rep.WinRate || 0,
      wonRevenue: rep.WonRevenue || 0,
      avgWonDealSize: rep.AvgWonDealSize || 0,
      avgSalesCycle: rep.AvgSalesCycle || 0,
      winRateRank: rep.WinRateRank || 0,
      revenueRank: rep.RevenueRank || 0
    }));
  }, [apiData]);

  // Helper function to get risk level badge variant
  const getRiskBadgeVariant = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low risk':
      case 'low':
        return "default";
      case 'medium risk':
      case 'medium':
        return "secondary";
      case 'high risk':
      case 'high':
        return "destructive";
      default:
        return "outline";
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toFixed(0)}`;
  };

  return (
    <Tabs defaultValue="forecast" className="w-full">
      <TabsList className={`grid w-full grid-cols-5 ${getTabContainerClass()}`}>
        <TabsTrigger value="forecast" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
          <TrendingUp className="h-4 w-4" />
          Revenue Forecast
        </TabsTrigger>
        <TabsTrigger value="probability" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
          <Target className="h-4 w-4" />
          Deal Probability
        </TabsTrigger>
        <TabsTrigger value="pipeline" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
          <Activity className="h-4 w-4" />
          Pipeline Health
        </TabsTrigger>
        <TabsTrigger value="reps" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
          <Users className="h-4 w-4" />
          Rep Performance
        </TabsTrigger>
        <TabsTrigger value="insights" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
          <Brain className="h-4 w-4" />
          AI Insights
        </TabsTrigger>
      </TabsList>

      <TabsContent value="forecast" className="space-y-4">
        <Card>
          <CardHeader className="bg-gray-50">
            <MetricTooltip
              title="Revenue Forecast Analysis"
              description="AI-powered revenue prediction combining historical performance, current pipeline health, and market trends to forecast future revenue."
              calculation="Machine learning model using historical revenue, pipeline velocity, conversion rates, and seasonal patterns"
              period={`${forecastPeriod} forecast period`}
              benchmarks={{
                good: "Forecast shows consistent growth",
                average: "Forecast shows stable revenue",
                concerning: "Forecast shows declining revenue"
              }}
            >
              <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                Revenue Forecast Trend ({revenueForecast.length} data points)
              </CardTitle>
            </MetricTooltip>
          </CardHeader>
          <CardContent>
            {revenueForecast.length > 0 ? (
              <RevenueForecastChart revenueForecast={revenueForecast} chartColors={chartColors} />
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No forecast data available
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="probability" className="space-y-4">
        <Card>
          <CardHeader className="bg-white border-b border-gray-200">
            <MetricTooltip
              title="Deal Probability Analysis"
              description="AI-powered probability scoring for each opportunity based on historical patterns, deal characteristics, and behavioral indicators."
              calculation="Machine learning algorithm analyzing stage duration, deal size, rep performance, and historical win/loss patterns"
              period="Current active pipeline"
              benchmarks={{
                good: "High probability (80%+)",
                average: "Medium probability (50-79%)",
                concerning: "Low probability (<50%)"
              }}
            >
              <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
                <Target className="h-5 w-5 text-blue-600" />
                Deal Probability Analysis ({dealProbabilities.length} opportunities)
              </CardTitle>
            </MetricTooltip>
          </CardHeader>
          <CardContent className="p-0">
            {dealProbabilities.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="bg-gray-50 text-ocean-800 font-semibold py-3 px-4 border-r border-gray-100">Opportunity</TableHead>
                    <TableHead className="bg-gray-50 text-ocean-800 font-semibold py-3 px-4 border-r border-gray-100">Stage</TableHead>
                    <TableHead className="bg-gray-50 text-ocean-800 font-semibold py-3 px-4 border-r border-gray-100">Amount</TableHead>
                    <TableHead className="bg-gray-50 text-ocean-800 font-semibold py-3 px-4 border-r border-gray-100">AI Probability</TableHead>
                    <TableHead className="bg-gray-50 text-ocean-800 font-semibold py-3 px-4 border-r border-gray-100">Risk Level</TableHead>
                    <TableHead className="bg-gray-50 text-ocean-800 font-semibold py-3 px-4">Days Old</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dealProbabilities.slice(0, 10).map((deal) => (
                    <TableRow key={deal.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium py-2.5 px-4">{deal.name}</TableCell>
                      <TableCell className="py-2.5 px-4">{deal.stage}</TableCell>
                      <TableCell className="py-2.5 px-4">{formatCurrency(deal.amount)}</TableCell>
                      <TableCell className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <Progress value={deal.probability} className="w-16" />
                          <span className="text-sm">{deal.probability}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 px-4">
                        <Badge variant={getRiskBadgeVariant(deal.riskLevel)}>
                          {deal.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5 px-4 text-sm text-muted-foreground">
                        {deal.daysOld} days
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No deal probability data available
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pipeline" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Pipeline Velocity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pipelineHealth.stageVelocity.length > 0 ? (
                <PipelineVelocityChart stageVelocity={pipelineHealth.stageVelocity} chartColors={chartColors} />
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No velocity data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
                <Activity className="h-5 w-5 text-cyan-600" />
                Conversion Rates by Stage
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pipelineHealth.conversionRates.length > 0 ? (
                <ConversionRatesChart conversionRates={pipelineHealth.conversionRates} chartColors={chartColors} />
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No conversion data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="reps" className="space-y-4">
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
              <Users className="h-5 w-5 text-purple-600" />
              Representative Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {repPerformanceData.length > 0 ? (
              <div className="space-y-4">
                <RepPerformanceChart repData={repPerformanceData} chartColors={chartColors} />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-gray-50 text-ocean-800">Rep Name</TableHead>
                      <TableHead className="bg-gray-50 text-ocean-800">Win Rate</TableHead>
                      <TableHead className="bg-gray-50 text-ocean-800">Won Revenue</TableHead>
                      <TableHead className="bg-gray-50 text-ocean-800">Open Deals</TableHead>
                      <TableHead className="bg-gray-50 text-ocean-800">Avg Deal Size</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repPerformanceData.map((rep, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{rep.repName}</TableCell>
                        <TableCell>{rep.winRate.toFixed(1)}%</TableCell>
                        <TableCell>{formatCurrency(rep.wonRevenue)}</TableCell>
                        <TableCell>{rep.openDeals}</TableCell>
                        <TableCell>{formatCurrency(rep.avgWonDealSize)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No representative performance data available
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
                <Brain className="h-5 w-5 text-purple-600" />
                Key Insights ({predictiveMetrics.insights.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {predictiveMetrics.insights.length > 0 ? (
                predictiveMetrics.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-1 rounded-full ${
                      insight.type === 'positive' ? 'bg-green-100' : 
                      insight.type === 'warning' ? 'bg-yellow-100' : 
                      'bg-red-100'
                    }`}>
                      {insight.type === 'positive' ? 
                        <TrendingUp className="h-4 w-4 text-green-600" /> :
                        <AlertTriangle className={`h-4 w-4 ${insight.type === 'warning' ? 'text-yellow-600' : 'text-red-600'}`} />
                      }
                    </div>
                    <div>
                      <p className="font-medium">{insight.title}</p>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {insight.category}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No insights available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
                <Target className="h-5 w-5 text-blue-600" />
                AI Recommendations ({predictiveMetrics.recommendations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {predictiveMetrics.recommendations.length > 0 ? (
                predictiveMetrics.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Target className="h-4 w-4 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">{rec.action}</p>
                      <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={rec.priority === 'Critical' ? 'destructive' : 
                                     rec.priority === 'High' ? 'default' : 'secondary'}>
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Impact: {rec.impact}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Effort: {rec.effort}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No recommendations available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PredictiveAnalyticsTabs;
