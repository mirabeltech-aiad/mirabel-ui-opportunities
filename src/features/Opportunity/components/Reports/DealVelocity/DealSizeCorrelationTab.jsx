
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@OpportunityComponents/ui/chart';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import { useDealSizeCorrelation } from './hooks/useDealSizeCorrelation';

const DealSizeCorrelationTab = ({ velocityData, chartConfig }) => {
  const { getTitleClass, chartColors } = useDesignSystem();
  
  // Use the hook to generate correlation data from velocity data
  const correlationAnalysis = useDealSizeCorrelation(velocityData);
  
  // Safely extract data with fallbacks
  const scatterData = correlationAnalysis?.correlationData || [];
  const correlationCoefficient = correlationAnalysis?.correlationCoefficient || 0;
  const sizeSegments = correlationAnalysis?.sizeSegments || {};
  const insights = correlationAnalysis?.insights || [];
  const correlationStats = correlationAnalysis?.correlationStats || {};

  // Prepare data for size segments bar chart using API data
  const segmentData = Object.keys(sizeSegments).map(segment => ({
    segment: segment.replace(/\s*\([^)]*\)/g, ''), // Clean up segment names
    fullSegment: segment,
    avgCycle: sizeSegments[segment]?.avgCycle || 0,
    dealCount: sizeSegments[segment]?.dealCount || 0,
    totalValue: sizeSegments[segment]?.totalValue || 0,
    avgDealSize: sizeSegments[segment]?.avgDealSize || 0
  })).sort((a, b) => {
    // Sort by segment order: Small, Medium, Large, Enterprise, Strategic
    const order = {
      'Small': 1,
      'Medium': 2, 
      'Large': 3,
      'Enterprise': 4,
      'Strategic': 5
    };
    return (order[a.segment] || 999) - (order[b.segment] || 999);
  });

  const getCorrelationColor = (correlation) => {
    if (correlation > 0.7) return 'text-red-600';
    if (correlation > 0.4) return 'text-orange-500';
    if (correlation > 0.1) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getCorrelationStrength = (correlation) => {
    if (correlation > 0.7) return 'Strong';
    if (correlation > 0.4) return 'Moderate';
    if (correlation > 0.1) return 'Weak';
    return 'None';
  };

  return (
    <div className="space-y-6">
      {/* Correlation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Correlation Strength</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getCorrelationColor(correlationCoefficient)}`}>
              {getCorrelationStrength(correlationCoefficient)}
            </div>
            <p className="text-xs text-gray-500">Coefficient: {correlationCoefficient.toFixed(3)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Data Points</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{correlationStats.dataPoints || scatterData.length}</div>
            <p className="text-xs text-blue-300">Closed deals analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Avg Deal Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${(correlationStats.avgAmount || 0).toLocaleString()}
            </div>
            <p className="text-xs text-purple-300">Across all deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Avg Cycle Time</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{correlationStats.avgCycleTime || 0} days</div>
            <p className="text-xs text-rose-300">Average across deals</p>
          </CardContent>
        </Card>
      </div>

      {/* Scatter Plot */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            <DollarSign className="h-5 w-5 text-green-600" />
            Deal Size vs Cycle Time Correlation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis 
                dataKey="amount" 
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                tick={{ fill: '#0369a1' }}
                label={{ value: 'Deal Size ($)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                dataKey="cycleTime"
                type="number"
                domain={['dataMin', 'dataMax']}
                tick={{ fill: '#0369a1' }}
                label={{ value: 'Cycle Time (Days)', angle: -90, position: 'insideLeft' }}
              />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium">{data.dealName}</p>
                        <p className="text-sm text-gray-600">
                          Deal Size: ${data.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Cycle Time: {data.cycleTime} days
                        </p>
                        <p className="text-sm text-gray-600">
                          Rep: {data.rep}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                dataKey="cycleTime" 
                fill="#3b82f6"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Size Segments Analysis */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Average Cycle Time by Deal Size Segment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={segmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis 
                dataKey="segment" 
                tick={{ fill: '#0369a1' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: '#0369a1' }}
                label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium">{data.fullSegment}</p>
                        <p className="text-sm text-gray-600">
                          Avg Cycle: {data.avgCycle} days
                        </p>
                        <p className="text-sm text-gray-600">
                          Deal Count: {data.dealCount}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total Value: ${data.totalValue.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Avg Deal Size: ${data.avgDealSize.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="avgCycle" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">No insights available at this time.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealSizeCorrelationTab;
