import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import { HelpTooltip } from '@/components';

interface LifetimeValueReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const LifetimeValueReport: React.FC<LifetimeValueReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real lifetime value data from Supabase
  const { data: ltvData, isLoading, error } = useQuery({
    queryKey: ['lifetime-value', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getLifetimeValueData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading lifetime value data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading lifetime value data</div>;
  }

  const {
    ltvSummary = {
      averageLTV: 0,
      totalCustomers: 0,
      totalRevenue: 0,
      averageLifespan: 0,
      acquisitionCostRatio: 0
    },
    channelLTV = [],
    formatLTV = [],
    termLTV = [],
    ltvTrends = []
  } = ltvData || {};


  const roiByChannel = channelLTV.map(channel => ({
    ...channel,
    roi: ((channel.avgLTV - channel.acquisitionCost) / channel.acquisitionCost * 100).toFixed(1)
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}

      {/* Summary Cards - Updated with Design Hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Average LTV
              <HelpTooltip helpId="average-ltv" />
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">${ltvSummary.averageLTV}</div>
            <p className="text-xs text-gray-600">Across all channels</p>
          </CardContent>
        </Card>
        
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Total Customers
              <HelpTooltip helpId="total-customers-ltv" />
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{ltvSummary.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-gray-600">Active subscribers</p>
          </CardContent>
        </Card>
        
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Avg Lifespan
              <HelpTooltip helpId="avg-lifespan" />
            </CardTitle>
            <Calendar className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">{ltvSummary.averageLifespan} months</div>
            <p className="text-xs text-gray-600">Customer duration</p>
          </CardContent>
        </Card>
        
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              Total Revenue
              <HelpTooltip helpId="total-revenue-ltv" />
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 mb-1">${(ltvSummary.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-gray-600">Lifetime value</p>
          </CardContent>
        </Card>
      </div>

      {/* LTV by Acquisition Channel */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Lifetime Value by Acquisition Channel</CardTitle>
            <HelpTooltip helpId="ltv-by-acquisition-channel" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelLTV}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Average LTV']} />
                <Bar dataKey="avgLTV" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {roiByChannel.map((channel, index) => (
              <div key={channel.channel} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{channel.channel}</div>
                  <div className="text-sm text-gray-600">
                    {channel.customers.toLocaleString()} customers • {channel.avgLifespan} months avg lifespan
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-right">
                  <div>
                    <div className="text-sm font-medium">${channel.avgLTV}</div>
                    <div className="text-xs text-gray-500">Avg LTV</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">${channel.acquisitionCost}</div>
                    <div className="text-xs text-gray-500">Acq. Cost</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">${(channel.totalRevenue / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Total Revenue</div>
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${parseFloat(channel.roi) > 300 ? 'text-green-600' : parseFloat(channel.roi) > 200 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {channel.roi}%
                    </div>
                    <div className="text-xs text-gray-500">ROI</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* LTV by Subscription Format and Term Length */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">LTV by Subscription Format</CardTitle>
              <HelpTooltip helpId="ltv-by-subscription-format" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formatLTV}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ format, avgLTV }) => `${format}: $${avgLTV}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="avgLTV"
                  >
                    {formatLTV.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Average LTV']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {formatLTV.map((format, index) => (
                <div key={format.format} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="font-medium">{format.format}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${format.avgLTV}</div>
                    <div className="text-xs text-gray-500">{format.customers.toLocaleString()} customers</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">LTV by Term Length</CardTitle>
              <HelpTooltip helpId="ltv-by-term-length" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={termLTV}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="term" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Average LTV']} />
                  <Bar dataKey="avgLTV" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {termLTV.map((term) => (
                <div key={term.term} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{term.term}</div>
                    <div className="text-sm text-gray-600">{term.customers.toLocaleString()} customers</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${term.avgLTV}</div>
                    <div className="text-xs text-gray-500">{term.avgLifespan} months • {term.retention}% retention</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LTV Trends */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">LTV Trends Over Time</CardTitle>
            <HelpTooltip helpId="ltv-trends-over-time" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ltvTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'avgLTV' ? `$${value}` : value,
                    name === 'avgLTV' ? 'Average LTV' : 'New Customers'
                  ]}
                />
                <Line type="monotone" dataKey="avgLTV" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Key LTV Insights</CardTitle>
            <HelpTooltip helpId="key-ltv-insights" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ltvTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'avgLTV' ? `$${value}` : value,
                    name === 'avgLTV' ? 'Average LTV' : 'New Customers'
                  ]}
                />
                <Line type="monotone" dataKey="avgLTV" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-ocean-800">Key LTV Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">Highest Value Channels</h4>
                <p className="text-sm text-green-700 mt-1">
                  Referral Program ($695) and Direct Website ($625) generate the highest LTV customers with longer lifespans.
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800">Format Performance</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Print + Digital bundles show 45% higher LTV than digital-only subscriptions.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800">Term Length Impact</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Multi-year subscriptions deliver 104% higher LTV with 85% retention rates.
                </p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-800">ROI Leaders</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Email marketing shows the best ROI at 22:1, followed by referrals at 19:1.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LifetimeValueReport;
