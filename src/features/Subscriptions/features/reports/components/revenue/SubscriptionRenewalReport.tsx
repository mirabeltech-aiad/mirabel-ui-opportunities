import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabaseReportsService } from '@/services/reports';
import { Loader2, RefreshCw, TrendingUp, DollarSign, Users, Calendar, Download, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SubscriptionRenewalReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const SubscriptionRenewalReport: React.FC<SubscriptionRenewalReportProps> = ({
  dateRange,
  selectedPeriod = 'last30days'
}) => {
  const { selectedProducts, selectedBusinessUnits } = useProductFilter();

  const {
    data: subscriptionsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['subscription-renewal-report', selectedProducts, selectedBusinessUnits, dateRange, selectedPeriod],
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
        <span className="ml-2 text-gray-600">Loading renewal data...</span>
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
  
  // Mock renewal data calculations
  const mockRenewalData = {
    summary: {
      totalRenewals: Math.floor(subscriptions.length * 0.75),
      renewalRate: 75.2,
      averageRenewalValue: 89.99,
      renewalRevenue: Math.floor(subscriptions.length * 0.75 * 89.99),
      upcomingRenewals: Math.floor(subscriptions.length * 0.15)
    },
    monthlyTrends: [
      { month: 'Jan', renewals: 245, renewalRate: 73.2, revenue: 22055 },
      { month: 'Feb', renewals: 289, renewalRate: 76.8, revenue: 26001 },
      { month: 'Mar', renewals: 312, renewalRate: 78.1, revenue: 28068 },
      { month: 'Apr', renewals: 298, renewalRate: 74.5, revenue: 26782 },
      { month: 'May', renewals: 334, renewalRate: 79.2, revenue: 30066 },
      { month: 'Jun', renewals: 356, renewalRate: 82.1, revenue: 32044 }
    ],
    upcomingRenewals: subscriptions.slice(0, 10).map((sub, index) => ({
      id: sub.id,
      customerName: sub.customer_name || `Customer ${index + 1}`,
      subscriptionType: sub.subscription_type || 'Standard',
      renewalDate: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000),
      currentValue: sub.current_price || 49.99,
      status: index < 3 ? 'At Risk' : index < 7 ? 'Likely' : 'Confirmed',
      daysTillRenewal: (index + 1) * 7
    }))
  };

  const { summary, monthlyTrends, upcomingRenewals } = mockRenewalData;

  const summaryCards = [
    {
      title: 'Total Renewals',
      value: summary.totalRenewals.toLocaleString(),
      icon: RefreshCw,
      trend: '+12%',
      trendUp: true,
      description: 'This period'
    },
    {
      title: 'Renewal Rate',
      value: `${summary.renewalRate}%`,
      icon: TrendingUp,
      trend: '+2.1%',
      trendUp: true,
      description: 'Above target of 70%'
    },
    {
      title: 'Renewal Revenue',
      value: `$${summary.renewalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: '+8%',
      trendUp: true,
      description: 'Generated this period'
    },
    {
      title: 'Upcoming Renewals',
      value: summary.upcomingRenewals.toLocaleString(),
      icon: Calendar,
      trend: 'Next 30 days',
      trendUp: null,
      description: 'Requires attention'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'At Risk':
        return <Badge variant="destructive">{status}</Badge>;
      case 'Likely':
        return <Badge variant="secondary">{status}</Badge>;
      case 'Confirmed':
        return <Badge variant="default">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-ocean-800 mb-2">Subscription Renewal Report</h2>
          <p className="text-gray-600">
            Tracking renewal performance and upcoming opportunities
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
                  {card.trendUp !== null && (
                    <div className={`flex items-center text-xs ${
                      card.trendUp ? "text-green-600" : "text-red-600"
                    }`}>
                      {card.trend}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Renewal Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Renewal Trends Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="renewals" fill="#0ea5e9" name="Renewals Count" />
              <Line yAxisId="right" type="monotone" dataKey="renewalRate" stroke="#10b981" strokeWidth={3} name="Renewal Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Upcoming Renewals Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Renewals (Next 30 Days)
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="h-11">Customer</TableHead>
                <TableHead className="h-11">Subscription Type</TableHead>
                <TableHead className="h-11">Renewal Date</TableHead>
                <TableHead className="h-11">Value</TableHead>
                <TableHead className="h-11">Status</TableHead>
                <TableHead className="h-11">Days Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingRenewals.map((renewal) => (
                <TableRow key={renewal.id} className="hover:bg-gray-50">
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{renewal.customerName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">{renewal.subscriptionType}</TableCell>
                  <TableCell className="py-2.5">
                    {renewal.renewalDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-2.5 font-semibold">
                    ${renewal.currentValue.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-2.5">
                    {getStatusBadge(renewal.status)}
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-1">
                      {renewal.daysTillRenewal <= 7 && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                      <span className={renewal.daysTillRenewal <= 7 ? "text-amber-600 font-medium" : ""}>
                        {renewal.daysTillRenewal} days
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Renewal Performance by Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Renewal Performance by Subscription Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Basic', 'Standard', 'Premium'].map((type, index) => {
              const rate = [68.5, 75.2, 82.1][index];
              const count = [142, 198, 89][index];
              return (
                <div key={type} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{type}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Renewal Rate</span>
                      <span className="font-medium">{rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Renewals</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-ocean-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Items & Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800">Action Items & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Immediate Action Required
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 3 high-value renewals at risk in next 7 days</li>
                <li>• Contact customers with overdue renewals</li>
                <li>• Review pricing for Basic tier (68.5% renewal rate)</li>
                <li>• Send renewal reminders 14 days before expiration</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Performance Insights
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Premium tier shows highest renewal rate (82.1%)</li>
                <li>• Overall renewal rate improved by 2.1% this quarter</li>
                <li>• June shows strongest renewal performance</li>
                <li>• Average renewal value increased to $89.99</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionRenewalReport;