import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabaseReportsService } from '@/services/reports';
import { Loader2, Users, Mail, Calendar, DollarSign, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActiveSubscriberSummaryReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const ActiveSubscriberSummaryReport: React.FC<ActiveSubscriberSummaryReportProps> = ({
  dateRange,
  selectedPeriod = 'last30days'
}) => {
  const { selectedProducts, selectedBusinessUnits } = useProductFilter();

  const {
    data: subscriptionsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['active-subscriber-summary', selectedProducts, selectedBusinessUnits, dateRange, selectedPeriod],
    queryFn: () => supabaseReportsService.getSubscriptions({
      productIds: selectedProducts,
      businessUnitIds: selectedBusinessUnits,
      dateRange,
      status: 'active'
    }),
    enabled: !!selectedProducts.length || !!selectedBusinessUnits.length,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-ocean-600" />
        <span className="ml-2 text-gray-600">Loading active subscriber data...</span>
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
  
  // Calculate summary metrics
  const totalActiveSubscribers = subscriptions.length;
  const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.current_price || 0), 0);
  const avgSubscriptionValue = totalActiveSubscribers > 0 ? totalRevenue / totalActiveSubscribers : 0;
  
  // Group by subscription type with proper typing
  interface SubscriptionTypeData {
    count: number;
    revenue: number;
  }
  
  const subscriptionTypes: Record<string, SubscriptionTypeData> = subscriptions.reduce((acc, sub) => {
    const type = sub.subscription_type || 'Unknown';
    if (!acc[type]) {
      acc[type] = { count: 0, revenue: 0 };
    }
    acc[type].count++;
    acc[type].revenue += sub.current_price || 0;
    return acc;
  }, {} as Record<string, SubscriptionTypeData>);

  // Group by status for detailed breakdown with proper typing
  const statusBreakdown: Record<string, number> = subscriptions.reduce((acc, sub) => {
    const status = sub.status || 'Unknown';
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status]++;
    return acc;
  }, {} as Record<string, number>);

  const summaryCards = [
    {
      title: 'Total Active Subscribers',
      value: totalActiveSubscribers.toLocaleString(),
      icon: Users,
      trend: '+12%',
      trendUp: true,
      description: 'Current active subscriber count'
    },
    {
      title: 'Monthly Recurring Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: '+8%',
      trendUp: true,
      description: 'Total MRR from active subscribers'
    },
    {
      title: 'Average Subscription Value',
      value: `$${avgSubscriptionValue.toFixed(2)}`,
      icon: Mail,
      trend: '-2%',
      trendUp: false,
      description: 'Revenue per active subscriber'
    },
    {
      title: 'Subscription Types',
      value: Object.keys(subscriptionTypes).length.toString(),
      icon: Calendar,
      trend: '→',
      trendUp: null,
      description: 'Number of active subscription types'
    }
  ];

  return (
    <div className="space-y-6">
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
                    <div className={cn(
                      "flex items-center text-xs",
                      card.trendUp ? "text-green-600" : "text-red-600"
                    )}>
                      {card.trendUp ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {card.trend}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscription Types Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Subscription Types Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(subscriptionTypes).map(([type, data]) => (
              <div key={type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-ocean-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-ocean-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{type}</h3>
                    <p className="text-sm text-gray-600">{data.count} subscribers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${data.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    ${(data.revenue / data.count).toFixed(2)} avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(statusBreakdown).map(([status, count]) => (
              <div key={status} className="text-center">
                <Badge 
                  variant={status === 'active' ? 'default' : 'secondary'}
                  className="mb-2"
                >
                  {status}
                </Badge>
                <p className="text-2xl font-bold text-gray-900">{count.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  {totalActiveSubscribers > 0 
                    ? ((count / totalActiveSubscribers) * 100).toFixed(1) 
                    : '0.0'}% of total
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Subscription Activity
          </CardTitle>
          <Button variant="outline" size="sm">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subscriptions.slice(0, 5).map((subscription, index) => (
              <div key={subscription.id || index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">
                    {subscription.customer_name || 'Anonymous Customer'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {subscription.subscription_type || 'Unknown Type'} • 
                    Started {subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${subscription.current_price?.toFixed(2) || '0.00'}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {subscription.status || 'Unknown'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveSubscriberSummaryReport;