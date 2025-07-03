
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Target, TrendingUp, DollarSign } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const RepQuotaAnalysis = ({ teamData }) => {
  const { getTitleClass, chartColors } = useDesignSystem();

  // Use the real team data from API with quota attainment
  const chartData = teamData.map(rep => ({
    name: rep.name,
    quotaAttainment: rep.quotaAttainment,
    revenue: rep.revenue,
    quota: rep.quota
  }));

  console.log('RepQuotaAnalysis - chartData from API:', chartData);

  // Enhanced custom tooltip with comprehensive data explanations
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const attainment = data.quotaAttainment;
      const difference = data.revenue - data.quota;
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg min-w-[280px]">
          <p className={`font-semibold ${getTitleClass()} mb-3 flex items-center gap-2`}>
            <Target className="h-4 w-4 text-blue-600" />
            {data.name}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-emerald-600" />
                Actual Revenue:
              </span>
              <span className="font-medium text-green-600">${(data.revenue / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Target className="h-3 w-3 text-blue-600" />
                Assigned Quota:
              </span>
              <span className="font-medium text-blue-600">${(data.quota / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between gap-4 border-t pt-2">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-purple-500" />
                Quota Attainment:
              </span>
              <span className={`font-bold ${attainment >= 100 ? 'text-green-600' : attainment >= 80 ? 'text-amber-500' : 'text-rose-500'}`}>
                {attainment.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-600">
                Variance:
              </span>
              <span className={`font-medium ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {difference >= 0 ? '+' : ''}${(difference / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-3 pt-2 border-t bg-gray-50 p-2 rounded">
              <div className="font-medium mb-1">Performance Analysis:</div>
              {attainment >= 120 
                ? "🏆 Outstanding performance - significantly exceeded targets" 
                : attainment >= 100 
                ? "🎯 Excellent performance - met or exceeded quota target" 
                : attainment >= 80 
                ? "⚠️ Good performance - close to quota target, minor improvement needed" 
                : attainment >= 60
                ? "📈 Below target - requires focused improvement strategy"
                : "🚨 Significantly below target - immediate action required"}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
          <Target className="h-5 w-5 text-blue-500" />
          Quota Attainment Analysis
        </CardTitle>
        <p className="text-sm text-gray-600">
          Individual sales representative performance against assigned quotas for the current period
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
            <XAxis 
              type="number" 
              domain={[0, 150]} 
              tick={{ fontSize: 12, fill: chartColors.axisText }}
              tickFormatter={(value) => `${value}%`}
              axisLine={{ stroke: chartColors.gridLines }}
              label={{ value: 'Quota Attainment (%)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={120}
              tick={{ fontSize: 11, fill: chartColors.axisText }}
              axisLine={{ stroke: chartColors.gridLines }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="quotaAttainment"
              fill={chartColors.primary[2]}
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => {
                const attainment = entry.quotaAttainment;
                let color = chartColors.primary[3]; // rose for < 80%
                if (attainment >= 120) color = '#10b981'; // emerald-500 for exceptional performance
                else if (attainment >= 100) color = chartColors.primary[0]; // emerald for >= 100%
                else if (attainment >= 80) color = chartColors.primary[4]; // amber for >= 80%
                
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
            <span>≥120% (Outstanding)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>100-119% (Exceeded)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span>80-99% (Close)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-500 rounded"></div>
            <span>&lt;80% (Below)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepQuotaAnalysis;
