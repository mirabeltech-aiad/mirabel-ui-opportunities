import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../../../components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { useAcquisitionChannelRevenue } from '../../../../hooks/useRevenueData';
import HelpTooltip from '../../../shared/HelpTooltip';
import RevenueChartSection from '@/components/circulation/revenue/RevenueChartSection';
import PerformanceTable from '@/components/circulation/revenue/PerformanceTable';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const AcquisitionChannelRevenue = () => {
  const { data: channelData, isLoading } = useAcquisitionChannelRevenue();

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#3b82f6",
    },
  };

  const tableColumns = [
    { key: 'channel', label: 'Channel', align: 'left' as const },
    { key: 'revenue', label: 'Revenue', align: 'right' as const },
    { key: 'subscribers', label: 'Subscribers', align: 'right' as const },
    { key: 'arpu', label: 'ARPU', align: 'right' as const },
    { key: 'cac', label: 'CAC', align: 'right' as const },
    { key: 'ltvCacRatio', label: 'LTV/CAC', align: 'right' as const }
  ];

  const renderTableCell = (value: any, key: string) => {
    switch (key) {
      case 'channel':
        return <span className="font-medium">{value}</span>;
      case 'revenue':
      case 'subscribers':
        return value.toLocaleString();
      case 'arpu':
      case 'cac':
        return `$${value.toFixed(2)}`;
      case 'ltvCacRatio':
        return (
          <span className={value >= 3 ? 'text-green-600' : 'text-red-600'}>
            {value.toFixed(1)}x
          </span>
        );
      default:
        return value;
    }
  };

  if (isLoading || !channelData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChartSection title="Revenue by Acquisition Channel" isLoading />
        <RevenueChartSection title="Channel Revenue Distribution" isLoading />
        <PerformanceTable 
          title="Channel Performance Metrics"
          columns={tableColumns}
          data={[]}
          isLoading
          className="lg:col-span-2"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RevenueChartSection title="Revenue by Acquisition Channel" helpId="acquisition-channel-revenue">
        <ChartContainer config={chartConfig}>
          <BarChart data={channelData}>
            <XAxis dataKey="channel" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" />
          </BarChart>
        </ChartContainer>
      </RevenueChartSection>

      <RevenueChartSection title="Channel Revenue Distribution" helpId="channel-revenue-distribution">
        <ChartContainer config={chartConfig}>
          <PieChart>
            <Pie
              data={channelData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="revenue"
              label={({ channel, percentage }) => `${channel}: ${percentage}%`}
            >
              {channelData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </RevenueChartSection>

      <PerformanceTable
        title="Channel Performance Metrics"
        columns={tableColumns}
        data={channelData}
        renderCell={renderTableCell}
        className="lg:col-span-2"
        helpId="channel-performance-metrics"
      />
    </div>
  );
};

export default AcquisitionChannelRevenue;