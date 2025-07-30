import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, Calendar, Download, PlayCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface TrialConversionReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const TrialConversionReport: React.FC<TrialConversionReportProps> = ({
  dateRange,
  selectedPeriod = 'last30days'
}) => {
  // Mock trial conversion data
  const mockData = {
    summary: {
      totalTrials: 1245,
      conversions: 311,
      conversionRate: 24.98,
      averageTrialLength: 14.2,
      revenueFromConversions: 15550
    },
    monthlyTrends: [
      { month: 'Jan', trials: 189, conversions: 42, conversionRate: 22.2, revenue: 2100 },
      { month: 'Feb', trials: 205, conversions: 51, conversionRate: 24.9, revenue: 2550 },
      { month: 'Mar', trials: 224, conversions: 58, conversionRate: 25.9, revenue: 2900 },
      { month: 'Apr', trials: 198, conversions: 47, conversionRate: 23.7, revenue: 2350 },
      { month: 'May', trials: 215, conversions: 56, conversionRate: 26.0, revenue: 2800 },
      { month: 'Jun', trials: 214, conversions: 57, conversionRate: 26.6, revenue: 2850 }
    ],
    conversionBySource: [
      { source: 'Organic Search', trials: 445, conversions: 123, rate: 27.6, color: '#0ea5e9' },
      { source: 'Social Media', trials: 298, conversions: 65, rate: 21.8, color: '#3b82f6' },
      { source: 'Email Campaign', trials: 234, conversions: 67, rate: 28.6, color: '#6366f1' },
      { source: 'Paid Ads', trials: 156, conversions: 32, rate: 20.5, color: '#8b5cf6' },
      { source: 'Referral', trials: 112, conversions: 24, rate: 21.4, color: '#a855f7' }
    ],
    trialLengthAnalysis: [
      { length: '7 days', trials: 312, conversions: 58, rate: 18.6 },
      { length: '14 days', trials: 589, conversions: 162, rate: 27.5 },
      { length: '30 days', trials: 344, conversions: 91, rate: 26.5 }
    ]
  };

  const summaryCards = [
    {
      title: 'Total Trials Started',
      value: mockData.summary.totalTrials.toLocaleString(),
      icon: PlayCircle,
      trend: '+15%',
      trendUp: true,
      description: 'This period'
    },
    {
      title: 'Trial Conversions',
      value: mockData.summary.conversions.toLocaleString(),
      icon: Target,
      trend: '+18%',
      trendUp: true,
      description: 'Converted to paid'
    },
    {
      title: 'Conversion Rate',
      value: `${mockData.summary.conversionRate}%`,
      icon: TrendingUp,
      trend: '+2.3%',
      trendUp: true,
      description: 'Above industry avg'
    },
    {
      title: 'Revenue from Trials',
      value: `$${mockData.summary.revenueFromConversions.toLocaleString()}`,
      icon: Calendar,
      trend: '+22%',
      trendUp: true,
      description: 'Generated this period'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-ocean-800 mb-2">Trial Conversion Report</h2>
          <p className="text-gray-600">
            Analysis of trial performance and conversion metrics
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

      {/* Conversion Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trial Conversion Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mockData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="trials" fill="#e0f2fe" name="Trials Started" />
              <Bar yAxisId="left" dataKey="conversions" fill="#0ea5e9" name="Conversions" />
              <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#10b981" strokeWidth={3} name="Conversion Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion by Source */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Conversion Performance by Source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.conversionBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="conversions"
                >
                  {mockData.conversionBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Conversions']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {mockData.conversionBySource.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="font-medium">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{source.conversions}/{source.trials}</p>
                    <p className="text-sm text-gray-600">{source.rate}% conversion</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trial Length Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Trial Length Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.trialLengthAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="length" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="trials" fill="#e0f2fe" name="Total Trials" />
              <Bar yAxisId="left" dataKey="conversions" fill="#0ea5e9" name="Conversions" />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} name="Conversion Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Performing Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800">Top Performing Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.conversionBySource
                .sort((a, b) => b.rate - a.rate)
                .slice(0, 3)
                .map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-ocean-50 to-blue-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{source.source}</h3>
                      <p className="text-sm text-gray-600">{source.trials} trials started</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="mb-1">
                        {source.rate}% conversion
                      </Badge>
                      <p className="text-sm text-gray-600">{source.conversions} conversions</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800">Optimization Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">Paid Ads Channel</h3>
                <p className="text-sm text-amber-700">
                  Lowest conversion rate at 20.5%. Consider refining targeting or landing page optimization.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">14-Day Trials</h3>
                <p className="text-sm text-green-700">
                  Highest conversion rate at 27.5%. Consider promoting this trial length more heavily.
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Email Campaigns</h3>
                <p className="text-sm text-blue-700">
                  Strong performance at 28.6%. Scale up email marketing efforts for better ROI.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800">Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Performance Insights</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Email campaigns show highest conversion rate (28.6%)</li>
                <li>• 14-day trials perform better than shorter or longer periods</li>
                <li>• Overall conversion rate above industry average of 20%</li>
                <li>• Revenue from conversions increased 22% this period</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Recommendations</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Increase email marketing budget and frequency</li>
                <li>• Optimize paid ads targeting and landing pages</li>
                <li>• Promote 14-day trial option as default</li>
                <li>• Implement better onboarding for trial users</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialConversionReport;