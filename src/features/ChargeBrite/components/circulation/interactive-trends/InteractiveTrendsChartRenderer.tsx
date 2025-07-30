

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

interface InteractiveTrendsChartRendererProps {
  data: any[];
  chartType: 'line' | 'area';
  dataView: 'circulation' | 'activity';
  customTooltip?: React.ComponentType<any>;
}

const InteractiveTrendsChartRenderer: React.FC<InteractiveTrendsChartRendererProps> = ({
  data,
  chartType,
  dataView,
  customTooltip
}) => {
  const commonProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 5 }
  };

  const commonAxisProps = {
    tick: { fill: '#075985', fontSize: 12 },
    axisLine: { stroke: '#e5e7eb' }
  };

  // Use custom tooltip if provided, otherwise use default
  const TooltipComponent = customTooltip || ChartTooltipContent;

  if (chartType === 'area') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" {...commonAxisProps} />
          <YAxis {...commonAxisProps} />
          <ChartTooltip content={<TooltipComponent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {dataView === 'circulation' ? (
            <>
              <Area 
                type="monotone" 
                dataKey="total" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              <Area 
                type="monotone" 
                dataKey="print" 
                stackId="2"
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.3}
              />
              <Area 
                type="monotone" 
                dataKey="digital" 
                stackId="3"
                stroke="#8b5cf6" 
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
            </>
          ) : (
            <>
              <Area 
                type="monotone" 
                dataKey="newSubscriptions" 
                stackId="1"
                stroke="#f59e0b" 
                fill="#f59e0b"
                fillOpacity={0.3}
              />
              <Area 
                type="monotone" 
                dataKey="churnedSubscriptions" 
                stackId="2"
                stroke="#f43f5e" 
                fill="#f43f5e"
                fillOpacity={0.3}
              />
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" {...commonAxisProps} />
        <YAxis {...commonAxisProps} />
        <ChartTooltip content={<TooltipComponent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {dataView === 'circulation' ? (
          <>
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, stroke: "#ffffff", r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="print" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2, stroke: "#ffffff", r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="digital" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", strokeWidth: 2, stroke: "#ffffff", r: 3 }}
            />
          </>
        ) : (
          <>
            <Line 
              type="monotone" 
              dataKey="newSubscriptions" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ fill: "#f59e0b", strokeWidth: 2, stroke: "#ffffff", r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="churnedSubscriptions" 
              stroke="#f43f5e" 
              strokeWidth={2}
              dot={{ fill: "#f43f5e", strokeWidth: 2, stroke: "#ffffff", r: 3 }}
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default InteractiveTrendsChartRenderer;
