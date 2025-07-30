
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { CohortBehaviorData } from './types';

interface CohortBehaviorComparisonProps {
  data: CohortBehaviorData[];
}

const CohortBehaviorComparison: React.FC<CohortBehaviorComparisonProps> = ({ data }) => {
  // Ensure data is an array and provide fallback
  const validData = Array.isArray(data) ? data : [];
  
  // Transform data for radar chart
  const radarData = [
    {
      metric: 'Session Length',
      'Jan 2024': validData.find(d => d.cohort === 'Jan 2024')?.avgSessionLength || 0,
      'Dec 2023': validData.find(d => d.cohort === 'Dec 2023')?.avgSessionLength || 0,
    },
    {
      metric: 'Feature Adoption',
      'Jan 2024': validData.find(d => d.cohort === 'Jan 2024')?.featureAdoption || 0,
      'Dec 2023': validData.find(d => d.cohort === 'Dec 2023')?.featureAdoption || 0,
    },
    {
      metric: 'NPS Score',
      'Jan 2024': (validData.find(d => d.cohort === 'Jan 2024')?.npsScore || 0) * 10,
      'Dec 2023': (validData.find(d => d.cohort === 'Dec 2023')?.npsScore || 0) * 10,
    },
    {
      metric: 'Engagement',
      'Jan 2024': validData.find(d => d.cohort === 'Jan 2024')?.engagementScore || 0,
      'Dec 2023': validData.find(d => d.cohort === 'Dec 2023')?.engagementScore || 0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-ocean-800">Cohort Behavior Comparison</CardTitle>
        <CardDescription>Behavioral metrics comparison across cohorts</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" fontSize={12} />
            <PolarRadiusAxis fontSize={10} />
            <Radar
              name="Jan 2024"
              dataKey="Jan 2024"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Radar
              name="Dec 2023"
              dataKey="Dec 2023"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          {validData.map((cohort) => (
            <div key={cohort.cohort} className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">{cohort.cohort}</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Avg Session:</span>
                  <span className="font-medium">{cohort.avgSessionLength} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Feature Adoption:</span>
                  <span className="font-medium">{cohort.featureAdoption}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Support Tickets:</span>
                  <span className="font-medium">{cohort.supportTickets}/month</span>
                </div>
                <div className="flex justify-between">
                  <span>NPS Score:</span>
                  <span className="font-medium">{cohort.npsScore}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CohortBehaviorComparison;
