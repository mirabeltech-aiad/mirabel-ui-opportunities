

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useGeographicRevenue } from '@/hooks/useRevenueData';
import { HelpTooltip } from '@/components';
import RevenueChartSection from './revenue/RevenueChartSection';
import PerformanceTable from './revenue/PerformanceTable';

const GeographicRevenueDistribution = () => {
  const { data: geoData, isLoading } = useGeographicRevenue();

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#3b82f6",
    },
  };

  const regionalTableColumns = [
    { key: 'region', label: 'Region', align: 'left' as const },
    { key: 'revenue', label: 'Revenue', align: 'right' as const },
    { key: 'arpu', label: 'ARPU', align: 'right' as const },
    { key: 'growth', label: 'Growth', align: 'right' as const }
  ];

  const renderRegionalCell = (value: any, key: string) => {
    switch (key) {
      case 'region':
        return <span className="font-medium">{value}</span>;
      case 'revenue':
        return `$${value.toLocaleString()}`;
      case 'arpu':
        return `$${value.toFixed(2)}`;
      case 'growth':
        return (
          <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
            {value >= 0 ? '+' : ''}{value.toFixed(1)}%
          </span>
        );
      default:
        return value;
    }
  };

  if (isLoading || !geoData) {
    return (
      <div className="space-y-6">
        <RevenueChartSection title="Revenue by Geographic Region" isLoading />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChartSection title="Top Revenue Cities" isLoading />
          <PerformanceTable 
            title="Regional Performance Metrics"
            columns={regionalTableColumns}
            data={[]}
            isLoading
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RevenueChartSection title="Revenue by Geographic Region" helpId="geographic-revenue-distribution">
        <ChartContainer config={chartConfig}>
          <BarChart data={geoData.regional} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" />
            <YAxis dataKey="region" type="category" width={120} tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill={chartConfig.revenue.color} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </RevenueChartSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChartSection title="Top Revenue Cities" helpId="top-revenue-cities">
          <div className="space-y-3">
            {geoData.cities.slice(0, 8).map((city, index) => (
              <div key={city.city} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <div className="font-medium">{city.city}</div>
                    <div className="text-sm text-gray-500">{city.country}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${city.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{city.subscribers} subs</div>
                </div>
              </div>
            ))}
          </div>
        </RevenueChartSection>

        <PerformanceTable
          title="Regional Performance Metrics"
          columns={regionalTableColumns}
          data={geoData.regional}
          renderCell={renderRegionalCell}
          helpId="regional-performance-metrics"
        />
      </div>
    </div>
  );
};

export default GeographicRevenueDistribution;
