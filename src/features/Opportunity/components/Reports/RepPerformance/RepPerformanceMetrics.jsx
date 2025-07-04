
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award } from 'lucide-react';
import MetricTooltip from '../MetricTooltip';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';

const RepPerformanceMetrics = ({ overallMetrics }) => {
  const { metricCardColors } = useDesignSystem();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricTooltip
        title="Total Sales Representatives"
        description="Total number of active sales representatives in your team. This represents the current sales force available for opportunity assignment and revenue generation."
        calculation="Count of all sales reps with assigned opportunities in the selected period"
        benchmarks={{
          good: "Optimal team size based on territory coverage",
          average: "Adequate coverage with some gaps",
          concerning: "Understaffed or significant coverage gaps"
        }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Reps</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{overallMetrics.totalReps}</div>
            <p className="text-xs text-purple-300 flex items-center gap-1">
              <Users className="h-3 w-3" />
              Active sales reps
            </p>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Average Quota Attainment"
        description="Team-wide average of quota achievement across all sales representatives. Values above 100% indicate the team is exceeding targets, while lower values suggest performance challenges."
        calculation="Average of (Individual Rep Revenue ÷ Individual Rep Quota) × 100 for all reps"
        benchmarks={{
          good: "> 100% average quota attainment",
          average: "80-100% average quota attainment",
          concerning: "< 80% average quota attainment"
        }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Avg Quota Attainment</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallMetrics.avgQuotaAttainment}%</div>
            <p className="text-xs text-green-300 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Team average
            </p>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Top Performing Representative"
        description="The sales representative with the highest quota attainment percentage in the selected period. This identifies your top performer for recognition and best practice sharing."
        calculation="Sales rep with the highest (Revenue ÷ Quota) × 100 percentage"
        benchmarks={{
          good: "Top performer > 150% quota attainment",
          average: "Top performer 120-150% quota attainment",
          concerning: "Top performer < 120% quota attainment"
        }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Top Performer</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overallMetrics.topPerformer}</div>
            <p className="text-xs text-blue-300 flex items-center gap-1">
              <Award className="h-3 w-3" />
              Highest quota attainment
            </p>
          </CardContent>
        </Card>
      </MetricTooltip>
    </div>
  );
};

export default RepPerformanceMetrics;
