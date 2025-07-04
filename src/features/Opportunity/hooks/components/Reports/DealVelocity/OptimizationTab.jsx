
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Lightbulb } from 'lucide-react';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';

const OptimizationTab = ({ velocityMetrics }) => {
  const { getTitleClass } = useDesignSystem();

  // Calculate bottlenecks from velocity metrics
  const bottlenecks = velocityMetrics?.stageVelocity?.filter(stage => 
    stage.variance && stage.variance > 15
  ).map(stage => ({
    stage: stage.stage,
    avgDays: stage.avgDays,
    benchmark: stage.benchmark || 0,
    impact: stage.variance > 30 ? 'High' : 'Medium',
    recommendation: `Consider reviewing the ${stage.stage} stage process to reduce cycle time by ${Math.round(stage.variance)}%.`
  })) || [];

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
          <Lightbulb className="h-5 w-5 text-emerald-600" />
          Sales Cycle Optimization Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bottlenecks.length > 0 ? (
            bottlenecks.map((bottleneck, index) => (
              <div key={index} className="p-4 border rounded-lg bg-red-50 border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{bottleneck.stage} Stage Bottleneck</h4>
                  <Badge 
                    variant={bottleneck.impact === 'High' ? 'destructive' : 'secondary'}
                    className={
                      bottleneck.impact === 'High' ? 'bg-red-500 text-white' : 'bg-blue-300 text-gray-800'
                    }
                  >
                    {bottleneck.impact} Impact
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Current: {bottleneck.avgDays} days | Benchmark: {bottleneck.benchmark} days
                </p>
                <p className="text-sm">{bottleneck.recommendation}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-600">Optimal Performance</h3>
              <p className="text-muted-foreground">All stages are performing within benchmarks</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className={`${getTitleClass()} font-semibold mb-2 flex items-center gap-2`}>
              <Lightbulb className="h-4 w-4 text-blue-600" />
              General Optimization Tips
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Focus on qualification criteria to reduce time in Discovery</li>
              <li>• Standardize proposal templates to speed up Proposal stage</li>
              <li>• Implement clear next-step processes for each stage</li>
              <li>• Use automation tools for routine follow-ups</li>
              <li>• Provide stage-specific training for sales reps</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationTab;
