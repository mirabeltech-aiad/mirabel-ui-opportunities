import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, DollarSign, Target, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '../../services/reports';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import ScrollToTopButton from '../../components/ui/ScrollToTopButton';
import HelpTooltip from '../../components/shared/HelpTooltip';

const NewAcquisitionReport = () => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  const [dateRange, setDateRange] = React.useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  // Use React Query to fetch real acquisition data from Supabase
  const { data: acquisitionData, isLoading, error } = useQuery({
    queryKey: ['new-acquisition', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getNewAcquisitionData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Users className="h-5 w-5" />
            New Acquisition Report - Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            Error loading acquisition data: {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process data for display
  const data = acquisitionData || { monthly: {}, channels: {}, totals: { subscriptions: 0, revenue: 0 } };
  
  // Calculate metrics
  const totalNewSubscriptions = data.totals.subscriptions;
  const totalRevenue = data.totals.revenue;
  const averageRevenuePer = totalNewSubscriptions > 0 ? totalRevenue / totalNewSubscriptions : 0;
  
  // Mock marketing spend calculation (since we don't track this in current schema)
  const estimatedMarketingSpend = totalRevenue * 0.3; // Assume 30% of revenue as marketing spend
  const averageCPA = totalNewSubscriptions > 0 ? estimatedMarketingSpend / totalNewSubscriptions : 0;
  const conversionRate = 3.8; // Mock conversion rate

  // Prepare monthly chart data
  const monthlyAcquisition = Object.entries(data.monthly).map(([monthKey, stats]: [string, any]) => {
    const [year, month] = monthKey.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(month) - 1];
    
    const spend = stats.revenue * 0.3; // Mock marketing spend
    const cpa = stats.subscriptions > 0 ? spend / stats.subscriptions : 0;
    
    return {
      month: monthName,
      subscriptions: stats.subscriptions,
      spend: spend,
      cpa: cpa,
      revenue: stats.revenue
    };
  }).sort((a, b) => {
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });

  // Prepare channel data
  const channelBreakdown = Object.entries(data.channels).map(([channel, stats]: [string, any]) => ({
    channel: channel.replace('_', ' ').toUpperCase(),
    subscriptions: stats.subscriptions,
    revenue: stats.revenue,
    percentage: totalNewSubscriptions > 0 ? (stats.subscriptions / totalNewSubscriptions * 100).toFixed(1) : '0.0',
    avgRevenue: stats.subscriptions > 0 ? (stats.revenue / stats.subscriptions).toFixed(2) : '0.00'
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              New Subscriptions
              <HelpTooltip helpId="new-acquisition-metrics" />
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{totalNewSubscriptions.toLocaleString()}</div>
            <p className="text-xs text-gray-600">in last 6 months</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Avg Revenue Per Sub</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">${averageRevenuePer.toFixed(2)}</div>
            <p className="text-xs text-gray-600">per new subscriber</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Est. Marketing Spend</CardTitle>
            <Target className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">${estimatedMarketingSpend.toLocaleString()}</div>
            <p className="text-xs text-gray-600">total investment</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Conversion Rate</CardTitle>
            <TrendingUp className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 mb-1">{conversionRate}%</div>
            <p className="text-xs text-gray-600">trial to paid</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Acquisition Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Acquisition Trend
              <HelpTooltip helpId="acquisition-by-channel" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyAcquisition.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No monthly data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyAcquisition}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'subscriptions' ? value : `$${Number(value).toLocaleString()}`,
                      name === 'subscriptions' ? 'New Subs' : 
                      name === 'spend' ? 'Marketing Spend' : 'Revenue'
                    ]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="subscriptions" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="subscriptions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Acquisition by Channel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Acquisition by Channel
              <HelpTooltip helpId="acquisition-by-channel" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {channelBreakdown.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No channel data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={channelBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Subscriptions']} />
                  <Bar dataKey="subscriptions" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Channel Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Channel Performance Breakdown
            <HelpTooltip helpId="channel-performance-breakdown" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {channelBreakdown.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No channel performance data available
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="h-11 font-medium text-gray-700">Channel</TableHead>
                  <TableHead className="h-11 font-medium text-gray-700">New Subscriptions</TableHead>
                  <TableHead className="h-11 font-medium text-gray-700">Total Revenue</TableHead>
                  <TableHead className="h-11 font-medium text-gray-700">Avg Revenue/Sub</TableHead>
                  <TableHead className="h-11 font-medium text-gray-700">% of Total</TableHead>
                  <TableHead className="h-11 font-medium text-gray-700">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channelBreakdown.map((channel, index) => (
                  <TableRow key={channel.channel} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <TableCell className="py-2.5 font-medium">{channel.channel}</TableCell>
                    <TableCell className="py-2.5">{channel.subscriptions.toLocaleString()}</TableCell>
                    <TableCell className="py-2.5">${channel.revenue.toLocaleString()}</TableCell>
                    <TableCell className="py-2.5">${channel.avgRevenue}</TableCell>
                    <TableCell className="py-2.5">
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        {channel.percentage}%
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge 
                        variant={parseFloat(channel.percentage) > 20 ? 'default' : 'secondary'}
                        className={parseFloat(channel.percentage) > 20 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {parseFloat(channel.percentage) > 20 ? 'High' : parseFloat(channel.percentage) > 10 ? 'Medium' : 'Low'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <ScrollToTopButton />
    </div>
  );
};

export default NewAcquisitionReport;