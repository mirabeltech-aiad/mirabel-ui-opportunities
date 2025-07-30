

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEngagementMetrics } from '@/hooks/useAnalyticsData';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Users, MessageSquare, Share2, ThumbsUp } from 'lucide-react';
import { HelpTooltip } from '@/components';

const EngagementScoring = () => {
  const { data: engagementData, isLoading, error } = useEngagementMetrics();

  if (isLoading) return <div>Loading engagement metrics...</div>;
  if (error) return <div>Error loading engagement metrics</div>;
  if (!engagementData) return null;

  const averageEngagement = engagementData.reduce((sum, sub) => sum + sub.overallScore, 0) / engagementData.length;
  const averageContentEngagement = engagementData.reduce((sum, sub) => sum + sub.contentEngagement, 0) / engagementData.length;
  const averagePlatformUsage = engagementData.reduce((sum, sub) => sum + sub.platformUsage, 0) / engagementData.length;
  const averageSocialSharing = engagementData.reduce((sum, sub) => sum + sub.socialSharing, 0) / engagementData.length;
  const averageFeedback = engagementData.reduce((sum, sub) => sum + sub.feedbackProvided, 0) / engagementData.length;

  const radarData = [
    {
      metric: 'Content',
      average: averageContentEngagement
    },
    {
      metric: 'Platform Usage',
      average: averagePlatformUsage
    },
    {
      metric: 'Social Sharing',
      average: averageSocialSharing
    },
    {
      metric: 'Feedback',
      average: averageFeedback
    },
    {
      metric: 'Referrals',
      average: engagementData.reduce((sum, sub) => sum + sub.referrals, 0) / engagementData.length
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗';
      case 'decreasing': return '↘';
      default: return '→';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-ocean-800">Engagement Scoring</h2>
        <HelpTooltip helpId="engagement-scoring" />
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Overall Engagement</CardTitle>
              <HelpTooltip helpId="overall-engagement" />
            </div>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{averageEngagement.toFixed(1)}</div>
            <p className="text-xs text-purple-300">Average score</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Content Engagement</CardTitle>
              <HelpTooltip helpId="content-engagement" />
            </div>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{averageContentEngagement.toFixed(1)}</div>
            <p className="text-xs text-blue-300">Content interaction</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Platform Usage</CardTitle>
              <HelpTooltip helpId="platform-usage" />
            </div>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{averagePlatformUsage.toFixed(1)}</div>
            <p className="text-xs text-green-300">Platform activity</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Social Sharing</CardTitle>
              <HelpTooltip helpId="social-sharing" />
            </div>
            <Share2 className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{averageSocialSharing.toFixed(1)}</div>
            <p className="text-xs text-rose-300">Share activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Radar Chart */}
      <Card size="large" className="bg-white">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Engagement Metrics Breakdown</CardTitle>
            <HelpTooltip helpId="engagement-metrics-breakdown" />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Average Score"
                dataKey="average"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Subscriber Scores */}
      <Card size="large" className="bg-white">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Individual Subscriber Engagement</CardTitle>
            <HelpTooltip helpId="individual-engagement" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engagementData.map((subscriber) => (
              <div key={subscriber.subscriberId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{subscriber.subscriberId}</div>
                    <Badge variant="outline">
                      Score: {subscriber.overallScore}/100
                    </Badge>
                    <div className={`text-sm flex items-center gap-1 ${getTrendColor(subscriber.trend)}`}>
                      <span>{getTrendIcon(subscriber.trend)}</span>
                      <span>{subscriber.trend}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last active: {new Date(subscriber.lastActivity).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Content</div>
                    <div className="text-gray-600">{subscriber.contentEngagement}/100</div>
                  </div>
                  <div>
                    <div className="font-medium">Platform</div>
                    <div className="text-gray-600">{subscriber.platformUsage}/100</div>
                  </div>
                  <div>
                    <div className="font-medium">Social</div>
                    <div className="text-gray-600">{subscriber.socialSharing}/100</div>
                  </div>
                  <div>
                    <div className="font-medium">Feedback</div>
                    <div className="text-gray-600">{subscriber.feedbackProvided}/100</div>
                  </div>
                  <div>
                    <div className="font-medium">Referrals</div>
                    <div className="text-gray-600">{subscriber.referrals}/100</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementScoring;
