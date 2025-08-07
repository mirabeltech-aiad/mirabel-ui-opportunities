

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, BarChart, Bar } from 'recharts';
import { useSubscriptionTypeRevenue } from '../../hooks/useRevenueData';
import HelpTooltip from '../shared/HelpTooltip';
import RevenueChartSection from './revenue/RevenueChartSection';

const SubscriptionTypeRevenue = () => {
  const { data: typeData, isLoading } = useSubscriptionTypeRevenue();

  const chartConfig = {
    print: {
      label: "Print",
      color: "#10b981",
    },
    digital: {
      label: "Digital", 
      color: "#3b82f6",
    },
    both: {
      label: "Both",
      color: "#8b5cf6",
    },
  };

  if (isLoading || !typeData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChartSection title="Revenue by Subscription Type" isLoading />
        <RevenueChartSection title="Revenue Trends" isLoading />
        <RevenueChartSection title="Subscription Type Performance" isLoading className="lg:col-span-2" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RevenueChartSection title="Revenue by Subscription Type" helpId="subscription-type-revenue">
        <ChartContainer config={chartConfig}>
          <BarChart data={typeData.monthly}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="print" fill="var(--color-print)" />
            <Bar dataKey="digital" fill="var(--color-digital)" />
            <Bar dataKey="both" fill="var(--color-both)" />
          </BarChart>
        </ChartContainer>
      </RevenueChartSection>

      <RevenueChartSection title="Revenue Trends" helpId="revenue-trends-subscription-type">
        <ChartContainer config={chartConfig}>
          <AreaChart data={typeData.monthly}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey="print" 
              stackId="1" 
              fill="var(--color-print)" 
            />
            <Area 
              type="monotone" 
              dataKey="digital" 
              stackId="1" 
              fill="var(--color-digital)" 
            />
            <Area 
              type="monotone" 
              dataKey="both" 
              stackId="1" 
              fill="var(--color-both)" 
            />
          </AreaChart>
        </ChartContainer>
      </RevenueChartSection>

      <RevenueChartSection title="Subscription Type Performance" className="lg:col-span-2" helpId="subscription-type-performance">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {typeData.summary.map((type) => (
            <div key={type.type} className="border rounded-lg p-4 hover:bg-gray-50">
              <h3 className="font-semibold text-lg mb-2 capitalize">{type.type}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">${type.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subscribers:</span>
                  <span className="font-medium">{type.subscribers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ARPU:</span>
                  <span className="font-medium">${type.arpu.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth:</span>
                  <span className={`font-medium ${type.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {type.growth >= 0 ? '+' : ''}{type.growth.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RevenueChartSection>
    </div>
  );
};

export default SubscriptionTypeRevenue;
