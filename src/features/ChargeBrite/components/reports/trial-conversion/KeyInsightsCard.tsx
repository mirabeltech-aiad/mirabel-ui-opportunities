
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface KeyInsightsCardProps {
  conversionRate: number;
  conversionTiming: string;
  retentionRate90Days: number;
  bestSource: { name: string; rate: number; revenue: number };
}

export const KeyInsightsCard = ({ 
  conversionRate,
  conversionTiming,
  retentionRate90Days,
  bestSource
}: KeyInsightsCardProps) => {
  return (
    <Card className="bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-ocean-800 flex items-center gap-1">
          Trial Conversion Insights
          <HelpTooltip helpId="trial-key-insights" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800">Strong Conversion Rate</h4>
              <p className="text-sm text-green-700 mt-1">
                {conversionRate}% trial-to-paid conversion rate indicates effective trial experience and value proposition.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800">Optimal Conversion Timing</h4>
              <p className="text-sm text-blue-700 mt-1">
                {conversionTiming} suggesting trials need at least a week to evaluate.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800">High Post-Conversion Retention</h4>
              <p className="text-sm text-purple-700 mt-1">
                {retentionRate90Days}% retention rate at 90 days shows converted trials become loyal subscribers.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800">Referral Success</h4>
              <p className="text-sm text-yellow-700 mt-1">
                {bestSource.name} source has the highest conversion rate at {bestSource.rate}% and highest average revenue.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
