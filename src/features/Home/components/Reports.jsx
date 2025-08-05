import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Download,
  Calendar
} from 'lucide-react';

const Reports = () => {
  const reports = [
    {
      title: 'Sales Pipeline',
      description: 'Overview of your sales pipeline and conversion rates',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      title: 'Revenue Trends',
      description: 'Monthly and quarterly revenue analysis',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Lead Sources',
      description: 'Breakdown of leads by source and conversion',
      icon: PieChart,
      color: 'bg-purple-500'
    },
    {
      title: 'Activity Report',
      description: 'Team activity and performance metrics',
      icon: Activity,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">
            Access comprehensive reports and analytics for your sales performance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button className="bg-ocean-600 hover:bg-ocean-700">
            <Calendar className="h-4 w-4 mr-2" />
            This Month
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last Quarter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reports.map((report, index) => {
            const IconComponent = report.icon;
            return (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-ocean-300"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${report.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Report
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sample Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Chart placeholder</p>
                  <p className="text-sm">Pipeline visualization would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p>Chart placeholder</p>
                  <p className="text-sm">Revenue trend visualization would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: '$2.4M', change: '+18%' },
              { label: 'Win Rate', value: '68%', change: '+5%' },
              { label: 'Avg Deal Size', value: '$45K', change: '+12%' },
              { label: 'Sales Cycle', value: '45 days', change: '-8%' }
            ].map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-green-600">{metric.change} from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 