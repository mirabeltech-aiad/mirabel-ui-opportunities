
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const RevenueForecastChart = ({ revenueForecast, chartColors }) => {
  const formatRevenueTooltip = (value, name, props) => {
    const formatted = value >= 1000000 ? `$${(value / 1000000).toFixed(2)}M` : `$${(value / 1000).toFixed(0)}K`;
    const isHistorical = name === 'historical';
    return [
      formatted,
      isHistorical ? 'Historical Revenue' : 'Predicted Revenue'
    ];
  };

  // Filter and sort data for better visualization
  const chartData = revenueForecast
    .filter(item => item.historical > 0 || item.predicted > 0)
    .sort((a, b) => a.month.localeCompare(b.month));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12, fill: chartColors.axisText }}
          axisLine={{ stroke: chartColors.gridLines }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: chartColors.axisText }}
          axisLine={{ stroke: chartColors.gridLines }}
          tickFormatter={(value) => value >= 1000000 ? `$${(value/1000000).toFixed(1)}M` : `$${(value/1000).toFixed(0)}K`}
        />
        <Tooltip 
          formatter={formatRevenueTooltip}
          labelStyle={{ color: chartColors.titles, fontWeight: 'bold' }}
          contentStyle={{ 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="historical" 
          stroke={chartColors.primary[0]} 
          strokeWidth={3}
          dot={{ fill: chartColors.primary[0], strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: chartColors.primary[0], strokeWidth: 2 }}
          name="Historical"
          connectNulls={false}
        />
        <Line 
          type="monotone" 
          dataKey="predicted" 
          stroke={chartColors.primary[1]} 
          strokeWidth={3} 
          strokeDasharray="8 8"
          dot={{ fill: chartColors.primary[1], strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: chartColors.primary[1], strokeWidth: 2 }}
          name="Predicted"
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const PipelineVelocityChart = ({ stageVelocity, chartColors }) => {
  const formatPipelineTooltip = (value, name, props) => {
    if (name === 'avgDays') {
      return [`${value} days`, 'Average Days in Stage'];
    }
    return [value, name];
  };

  // Add color coding based on velocity performance
  const enhancedData = stageVelocity.map(stage => ({
    ...stage,
    fill: stage.avgDays > 90 ? '#ef4444' : // Red for concerning
          stage.avgDays > 45 ? '#f59e0b' : // Yellow for moderate
          '#10b981' // Green for good
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={enhancedData}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
        <XAxis 
          dataKey="stage" 
          tick={{ fontSize: 11, fill: chartColors.axisText }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: chartColors.axisText }}
          label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          formatter={formatPipelineTooltip}
          contentStyle={{ 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />
        <Bar 
          dataKey="avgDays" 
          name="Avg Days in Stage"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ConversionRatesChart = ({ conversionRates, chartColors }) => {
  const formatPercentageTooltip = (value, name) => {
    return [`${value}%`, 'Conversion Rate'];
  };

  // Filter out stages with zero conversion rates for better visualization
  const chartData = conversionRates.filter(rate => rate.rate > 0);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="rate"
          label={({ stage, rate }) => `${stage}: ${rate}%`}
          stroke="#ffffff"
          strokeWidth={2}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || chartColors.primary[index % chartColors.primary.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={formatPercentageTooltip}
          contentStyle={{ 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// New chart for Representative Performance (Table3 data)
export const RepPerformanceChart = ({ repData, chartColors }) => {
  const formatRepTooltip = (value, name) => {
    if (name === 'winRate') return [`${value.toFixed(1)}%`, 'Win Rate'];
    if (name === 'wonRevenue') return [`$${(value/1000).toFixed(0)}K`, 'Won Revenue'];
    return [value, name];
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={repData}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
        <XAxis 
          dataKey="repName" 
          tick={{ fontSize: 11, fill: chartColors.axisText }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: chartColors.axisText }}
        />
        <Tooltip 
          formatter={formatRepTooltip}
          contentStyle={{ 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />
        <Bar 
          dataKey="winRate" 
          fill={chartColors.primary[2]}
          name="Win Rate (%)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
