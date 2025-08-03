import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { digitalEngagementService } from '@/services/reports/digitalEngagementService';
import { Loader2, Smartphone, Clock, Activity, Eye, Download, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface DigitalEngagementReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const DigitalEngagementReport: React.FC<DigitalEngagementReportProps> = ({
  dateRange,
  selectedPeriod = 'last30days'
}) => {
  const { selectedProducts, selectedBusinessUnits } = useProductFilter();

  const {
    data: engagementData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['digital-engagement-report', selectedProducts, selectedBusinessUnits, dateRange, selectedPeriod],
    queryFn: () => digitalEngagementService.getDigitalEngagementData(
      selectedProducts,
      selectedBusinessUnits,
      dateRange
    ),
    enabled: !!selectedProducts.length || !!selectedBusinessUnits.length,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-ocean-600" />
        <span className="ml-2 text-gray-600">Loading digital engagement data...</span>
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

  const data = engagementData || {
    metrics: {
      totalDigitalSubscribers: 0,
      avgMonthlyLogins: 0,
      avgTimeSpentMinutes: 0,
      contentEngagementRate: 0
    },
    trends: []
  };

  // Additional mock data for comprehensive report
  const mockAdditionalData = {
    deviceBreakdown: [
      { device: 'Mobile', users: Math.floor(data.metrics.totalDigitalSubscribers * 0.65), percentage: 65, color: '#0ea5e9' },
      { device: 'Desktop', users: Math.floor(data.metrics.totalDigitalSubscribers * 0.25), percentage: 25, color: '#3b82f6' },
      { device: 'Tablet', users: Math.floor(data.metrics.totalDigitalSubscribers * 0.10), percentage: 10, color: '#6366f1' }
    ],
    contentCategories: [
      { category: 'News Articles', engagement: 78.5, views: 125000, timeSpent: 4.2 },
      { category: 'Videos', engagement: 82.1, views: 89000, timeSpent: 6.8 },
      { category: 'Podcasts', engagement: 65.3, views: 45000, timeSpent: 12.5 },
      { category: 'Interactive Content', engagement: 91.2, views: 32000, timeSpent: 8.9 },
      { category: 'Archives', engagement: 45.7, views: 28000, timeSpent: 3.1 }
    ],
    timeOfDayActivity: [
      { hour: '6AM', activity: 12 },
      { hour: '9AM', activity: 45 },
      { hour: '12PM', activity: 78 },
      { hour: '3PM', activity: 65 },
      { hour: '6PM', activity: 89 },
      { hour: '9PM', activity: 92 },
      { hour: '12AM', activity: 34 }
    ]
  };

  const summaryCards = [
    {
      title: 'Digital Subscribers',
      value: data.metrics.totalDigitalSubscribers.toLocaleString(),
      icon: Smartphone,
      trend: '+18%',
      trendUp: true,
      description: 'Active digital users'
    },
    {
      title: 'Avg Monthly Logins',
      value: data.metrics.avgMonthlyLogins.toFixed(1),
      icon: Activity,
      trend: '+5%',
      trendUp: true,
      description: 'Per user per month'
    },
    {
      title: 'Time Spent',
      value: `${data.metrics.avgTimeSpentMinutes.toFixed(1)}m`,
      icon: Clock,
      trend: '+12%',
      trendUp: true,
      description: 'Average session time'
    },
    {
      title: 'Content Engagement',
      value: `${data.metrics.contentEngagementRate.toFixed(1)}%`,
      icon: Eye,
      trend: '+3.2%',
      trendUp: true,
      description: 'Overall engagement rate'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-ocean-800 mb-2">Digital Engagement Report</h2>
          <p className="text-gray-600">
            Comprehensive analysis of digital subscriber behavior and content engagement
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

      {/* Engagement Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Digital Engagement Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="logins" stroke="#0ea5e9" strokeWidth={3} name="Avg Logins" />
              <Line yAxisId="left" type="monotone" dataKey="timeSpent" stroke="#3b82f6" strokeWidth={3} name="Time Spent (min)" />
              <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={3} name="Engagement Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device and Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Device Usage Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAdditionalData.deviceBreakdown.map((device, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: device.color }}
                      />
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{device.users.toLocaleString()}</span>
                      <span className="text-sm text-gray-600 ml-2">({device.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${device.percentage}%`,
                        backgroundColor: device.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time of Day Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activity by Time of Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={mockAdditionalData.timeOfDayActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="activity" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Content Category Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={mockAdditionalData.contentCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="views" fill="#e0f2fe" name="Views" />
              <Bar yAxisId="right" dataKey="engagement" fill="#0ea5e9" name="Engagement Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Content Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800">Detailed Content Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold">Content Category</th>
                  <th className="text-left p-3 font-semibold">Total Views</th>
                  <th className="text-left p-3 font-semibold">Engagement Rate</th>
                  <th className="text-left p-3 font-semibold">Avg Time Spent</th>
                  <th className="text-left p-3 font-semibold">Performance</th>
                </tr>
              </thead>
              <tbody>
                {mockAdditionalData.contentCategories.map((category, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{category.category}</td>
                    <td className="p-3">{category.views.toLocaleString()}</td>
                    <td className="p-3">{category.engagement.toFixed(1)}%</td>
                    <td className="p-3">{category.timeSpent.toFixed(1)} min</td>
                    <td className="p-3">
                      <Badge 
                        variant={category.engagement > 80 ? 'default' : category.engagement > 60 ? 'secondary' : 'outline'}
                      >
                        {category.engagement > 80 ? 'Excellent' : category.engagement > 60 ? 'Good' : 'Needs Attention'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-1">Mobile Dominance</h4>
                <p className="text-sm text-blue-700">
                  65% of users access content via mobile devices, indicating strong mobile optimization success
                </p>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-1">Peak Engagement</h4>
                <p className="text-sm text-green-700">
                  Highest activity occurs between 6-9 PM, suggesting leisure consumption patterns
                </p>
              </div>
              
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-1">Interactive Content Success</h4>
                <p className="text-sm text-purple-700">
                  Interactive content shows 91.2% engagement rate despite lower view counts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-ocean-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Expand Interactive Content</h4>
                  <p className="text-sm text-gray-600">High engagement rates suggest users prefer interactive experiences</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-ocean-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Optimize Archive Content</h4>
                  <p className="text-sm text-gray-600">Archive content shows lowest engagement (45.7%) - needs improvement</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-ocean-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Evening Content Strategy</h4>
                  <p className="text-sm text-gray-600">Schedule premium content releases during 6-9 PM peak hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-ocean-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Mobile-First Approach</h4>
                  <p className="text-sm text-gray-600">Continue prioritizing mobile experience for 65% of user base</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DigitalEngagementReport;