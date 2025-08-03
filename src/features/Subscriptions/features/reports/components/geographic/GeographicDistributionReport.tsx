import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabaseReportsService } from '@/services/reports';
import { Loader2, MapPin, Globe, TrendingUp, DollarSign, Users, Download, Percent } from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface GeographicDistributionReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const GeographicDistributionReport: React.FC<GeographicDistributionReportProps> = ({
  dateRange,
  selectedPeriod = 'last30days'
}) => {
  const { selectedProducts, selectedBusinessUnits } = useProductFilter();

  const {
    data: subscriptionsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['geographic-distribution-report', selectedProducts, selectedBusinessUnits, dateRange, selectedPeriod],
    queryFn: () => supabaseReportsService.getSubscriptions({
      productIds: selectedProducts,
      businessUnitIds: selectedBusinessUnits,
      dateRange
    }),
    enabled: !!selectedProducts.length || !!selectedBusinessUnits.length,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-ocean-600" />
        <span className="ml-2 text-gray-600">Loading geographic data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-red-800">
            <h3 className="font-semibold mb-2">Error Loading Report</h3>
            <p className="text-sm">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const subscriptions = subscriptionsData || [];
  
  // Mock geographic data based on subscription count
  const mockGeographicData = {
    regions: [
      { 
        region: 'North America', 
        subscribers: Math.floor(subscriptions.length * 0.42),
        revenue: Math.floor(subscriptions.length * 0.42 * 65.99),
        growth: 12.5,
        arpu: 65.99,
        color: '#0ea5e9'
      },
      { 
        region: 'Europe', 
        subscribers: Math.floor(subscriptions.length * 0.28),
        revenue: Math.floor(subscriptions.length * 0.28 * 58.99),
        growth: 8.3,
        arpu: 58.99,
        color: '#3b82f6'
      },
      { 
        region: 'Asia Pacific', 
        subscribers: Math.floor(subscriptions.length * 0.18),
        revenue: Math.floor(subscriptions.length * 0.18 * 45.99),
        growth: 15.7,
        arpu: 45.99,
        color: '#6366f1'
      },
      { 
        region: 'Latin America', 
        subscribers: Math.floor(subscriptions.length * 0.08),
        revenue: Math.floor(subscriptions.length * 0.08 * 39.99),
        growth: 22.1,
        arpu: 39.99,
        color: '#8b5cf6'
      },
      { 
        region: 'Africa & Middle East', 
        subscribers: Math.floor(subscriptions.length * 0.04),
        revenue: Math.floor(subscriptions.length * 0.04 * 42.99),
        growth: 31.8,
        arpu: 42.99,
        color: '#a855f7'
      }
    ],
    countries: [
      { country: 'United States', subscribers: Math.floor(subscriptions.length * 0.32), revenue: Math.floor(subscriptions.length * 0.32 * 69.99), region: 'North America' },
      { country: 'Canada', subscribers: Math.floor(subscriptions.length * 0.10), revenue: Math.floor(subscriptions.length * 0.10 * 62.99), region: 'North America' },
      { country: 'United Kingdom', subscribers: Math.floor(subscriptions.length * 0.12), revenue: Math.floor(subscriptions.length * 0.12 * 59.99), region: 'Europe' },
      { country: 'Germany', subscribers: Math.floor(subscriptions.length * 0.08), revenue: Math.floor(subscriptions.length * 0.08 * 57.99), region: 'Europe' },
      { country: 'Australia', subscribers: Math.floor(subscriptions.length * 0.07), revenue: Math.floor(subscriptions.length * 0.07 * 54.99), region: 'Asia Pacific' },
      { country: 'Japan', subscribers: Math.floor(subscriptions.length * 0.06), revenue: Math.floor(subscriptions.length * 0.06 * 48.99), region: 'Asia Pacific' },
      { country: 'Brazil', subscribers: Math.floor(subscriptions.length * 0.05), revenue: Math.floor(subscriptions.length * 0.05 * 41.99), region: 'Latin America' },
      { country: 'France', subscribers: Math.floor(subscriptions.length * 0.04), revenue: Math.floor(subscriptions.length * 0.04 * 56.99), region: 'Europe' }
    ]
  };

  const totalSubscribers = mockGeographicData.regions.reduce((sum, region) => sum + region.subscribers, 0);
  const totalRevenue = mockGeographicData.regions.reduce((sum, region) => sum + region.revenue, 0);
  const avgGrowth = mockGeographicData.regions.reduce((sum, region) => sum + region.growth, 0) / mockGeographicData.regions.length;

  const summaryCards = [
    {
      title: 'Global Subscribers',
      value: totalSubscribers.toLocaleString(),
      icon: Users,
      trend: '+14%',
      trendUp: true,
      description: 'Across all regions'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: '+11%',
      trendUp: true,
      description: 'Global revenue'
    },
    {
      title: 'Active Regions',
      value: mockGeographicData.regions.length.toString(),
      icon: Globe,
      trend: '+1',
      trendUp: true,
      description: 'Geographic presence'
    },
    {
      title: 'Avg Growth Rate',
      value: `${avgGrowth.toFixed(1)}%`,
      icon: TrendingUp,
      trend: '+3.2%',
      trendUp: true,
      description: 'Across all regions'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-ocean-800 mb-2">Geographic Distribution Report</h2>
          <p className="text-gray-600">
            Global subscription analysis across {mockGeographicData.regions.length} regions and {mockGeographicData.countries.length} countries
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <card.icon className="h-8 w-8 text-ocean-600 mb-2" />
                  <div className={`flex items-center text-xs ${
                    card.trendUp ? "text-green-600" : "text-red-600"
                  }`}>
                    {card.trend}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Regional Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Subscribers Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Subscribers by Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockGeographicData.regions}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="subscribers"
                >
                  {mockGeographicData.regions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value.toLocaleString(), 'Subscribers']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Regional Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={mockGeographicData.regions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="subscribers" fill="#0ea5e9" name="Subscribers" />
                <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#10b981" strokeWidth={3} name="Growth %" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Regional Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Regional Performance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="h-11">Region</TableHead>
                <TableHead className="h-11">Subscribers</TableHead>
                <TableHead className="h-11">Revenue</TableHead>
                <TableHead className="h-11">ARPU</TableHead>
                <TableHead className="h-11">Growth Rate</TableHead>
                <TableHead className="h-11">Market Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockGeographicData.regions
                .sort((a, b) => b.subscribers - a.subscribers)
                .map((region, index) => {
                  const marketShare = (region.subscribers / totalSubscribers) * 100;
                  return (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: region.color }}
                          />
                          <span className="font-medium">{region.region}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 font-semibold">
                        {region.subscribers.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-2.5 font-semibold">
                        ${region.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-2.5">
                        ${region.arpu.toFixed(2)}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">
                            {region.growth.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant="outline">
                          {marketShare.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Countries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Top Performing Countries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="h-11">Country</TableHead>
                <TableHead className="h-11">Region</TableHead>
                <TableHead className="h-11">Subscribers</TableHead>
                <TableHead className="h-11">Revenue</TableHead>
                <TableHead className="h-11">ARPU</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockGeographicData.countries
                .sort((a, b) => b.subscribers - a.subscribers)
                .map((country, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="py-2.5 font-medium">
                      {country.country}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge variant="secondary">
                        {country.region}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2.5 font-semibold">
                      {country.subscribers.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-2.5 font-semibold">
                      ${country.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-2.5">
                      ${(country.revenue / country.subscribers).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Growth Opportunities & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Growth Regions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800">High Growth Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGeographicData.regions
                .filter(region => region.growth > 20)
                .map((region, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-green-800">{region.region}</h3>
                      <Badge variant="default" className="bg-green-500">
                        {region.growth.toFixed(1)}% growth
                      </Badge>
                    </div>
                    <p className="text-sm text-green-700">
                      {region.subscribers.toLocaleString()} subscribers generating ${region.revenue.toLocaleString()} in revenue
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800">Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-1">North America Dominance</h4>
                <p className="text-sm text-blue-700">
                  Represents 42% of subscriber base with highest ARPU at $65.99
                </p>
              </div>
              
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-1">Emerging Markets</h4>
                <p className="text-sm text-purple-700">
                  Africa & Middle East showing 31.8% growth despite smaller base
                </p>
              </div>
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-1">Price Sensitivity</h4>
                <p className="text-sm text-amber-700">
                  Lower ARPU regions show higher growth rates - pricing optimization opportunity
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeographicDistributionReport;