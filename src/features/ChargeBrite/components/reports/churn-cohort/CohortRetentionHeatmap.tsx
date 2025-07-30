
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CohortRetentionData } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface CohortRetentionHeatmapProps {
  data: CohortRetentionData[];
}

const CohortRetentionHeatmap: React.FC<CohortRetentionHeatmapProps> = ({ data }) => {
  const getHeatmapColor = (value: number) => {
    if (value === 0) return 'bg-gray-200 text-gray-400';
    if (value >= 85) return 'bg-green-600 text-white';
    if (value >= 75) return 'bg-green-400 text-white';
    if (value >= 65) return 'bg-yellow-400 text-black';
    if (value >= 55) return 'bg-orange-400 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Cohort Retention Heatmap</CardTitle>
          <HelpTooltip helpId="cohort-retention-heatmap" />
        </div>
        <CardDescription>Retention rates by cohort and lifecycle stage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 font-medium text-gray-700">Cohort</th>
                <th className="text-center p-3 font-medium text-gray-700">Size</th>
                <th className="text-center p-3 font-medium text-gray-700">Month 1</th>
                <th className="text-center p-3 font-medium text-gray-700">Month 3</th>
                <th className="text-center p-3 font-medium text-gray-700">Month 6</th>
                <th className="text-center p-3 font-medium text-gray-700">Month 12</th>
                <th className="text-center p-3 font-medium text-gray-700">LTV</th>
              </tr>
            </thead>
            <tbody>
              {data.map((cohort, index) => (
                <tr key={cohort.cohort} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 font-medium">{cohort.cohort}</td>
                  <td className="p-3 text-center">{cohort.initialSize.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getHeatmapColor(cohort.month1)}`}>
                      {cohort.month1.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getHeatmapColor(cohort.month3)}`}>
                      {cohort.month3.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getHeatmapColor(cohort.month6)}`}>
                      {cohort.month6.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {cohort.month12 > 0 ? (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getHeatmapColor(cohort.month12)}`}>
                        {cohort.month12.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3 text-center font-medium">${cohort.ltv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            Excellent (85%+)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            Good (75-84%)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            Average (65-74%)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-400 rounded"></div>
            Poor (55-64%)
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            Critical (&lt;55%)
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CohortRetentionHeatmap;
