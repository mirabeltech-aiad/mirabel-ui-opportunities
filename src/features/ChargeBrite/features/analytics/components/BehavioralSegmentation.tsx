import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBehavioralSegments } from '../hooks/useAnalyticsData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HelpTooltip } from '@/components';

const BehavioralSegmentation = () => {
  const { data: segments, isLoading, error } = useBehavioralSegments();

  if (isLoading) return <div>Loading behavioral segments...</div>;
  if (error) return <div>Error loading behavioral segments</div>;
  if (!segments) return null;

  const chartData = segments.map(segment => ({
    name: segment.name,
    subscribers: segment.subscriberCount,
    ltv: segment.averageLTV,
    engagement: segment.engagementScore,
    churnRate: segment.churnRate
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-ocean-800">Behavioral Segmentation</h2>
        <HelpTooltip helpId="behavioral-segmentation" />
      </div>
      
      {/* Overview Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Behavioral Segments Overview</CardTitle>
            <HelpTooltip helpId="behavioral-segments-overview" />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="subscribers" fill="#3b82f6" name="Subscribers" />
              <Bar yAxisId="right" dataKey="ltv" fill="#10b981" name="Avg LTV ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {segments.map((segment) => (
          <Card key={segment.id} className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{segment.name}</CardTitle>
                <Badge variant="outline">{segment.percentage}%</Badge>
              </div>
              <p className="text-sm text-gray-600">{segment.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Subscribers</div>
                  <div className="text-gray-600">{segment.subscriberCount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="font-medium">Avg LTV</div>
                  <div className="text-gray-600">${segment.averageLTV}</div>
                </div>
                <div>
                  <div className="font-medium">Engagement</div>
                  <div className="text-gray-600">{segment.engagementScore}/100</div>
                </div>
                <div>
                  <div className="font-medium">Churn Rate</div>
                  <div className="text-gray-600">{segment.churnRate}%</div>
                </div>
              </div>

              <div>
                <div className="font-medium text-sm mb-2">Characteristics</div>
                <div className="flex flex-wrap gap-1">
                  {segment.characteristics.map((char, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-medium text-sm mb-2">Recommended Actions</div>
                <ul className="text-xs text-gray-600 space-y-1">
                  {segment.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BehavioralSegmentation;