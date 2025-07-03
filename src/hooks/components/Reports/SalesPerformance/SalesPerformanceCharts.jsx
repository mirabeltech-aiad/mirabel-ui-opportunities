
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, Target, DollarSign } from 'lucide-react';
import MetricTooltip from '@OpportunityComponents/Reports/MetricTooltip';

const SalesPerformanceCharts = ({ revenueData = [], pipelineData = [] }) => {
  // Enhanced tooltip formatters with colored content
  const RevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-ocean-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-gray-600">Revenue:</span>
              <span className="font-medium text-green-600">
                ${(entry.value / 1000000).toFixed(2)}M
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const PipelineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-ocean-800 mb-3">{label} Stage</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Opportunities:</span>
              <span className="font-medium text-blue-600">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <MetricTooltip
        title="Revenue Trend Over Time"
        description="Tracks monthly revenue performance and deal closure patterns to identify growth trends and seasonal patterns in your sales performance."
        calculation="Sum of all won deal amounts grouped by month based on actual close date from API data"
        period="Monthly aggregation over the selected date range"
        benchmarks={{
          good: "> 15% monthly growth",
          average: "5-15% monthly growth", 
          concerning: "< 5% monthly growth"
        }}
      >
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Revenue Trend Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#075985' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#075985' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#ffffff" }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Pipeline by Stage"
        description="Visual representation of your pipeline distribution across sales stages, showing both deal count and monetary value to identify potential bottlenecks."
        calculation="Stage Distribution: Count and value of opportunities by current stage. Value by Stage: Total pipeline value grouped by sales stage."
        period="Real-time snapshot of active pipeline"
        benchmarks={{
          good: "Balanced distribution across stages",
          average: "Some concentration in specific stages",
          concerning: "Heavy bottlenecks in early or late stages"
        }}
      >
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Pipeline by Stage
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fontSize: 11, fill: '#075985' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#075985' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip content={<PipelineTooltip />} />
                <Legend />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6" 
                  name="Opportunities"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </MetricTooltip>
    </>
  );
};

export default SalesPerformanceCharts;
