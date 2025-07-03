
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { Badge } from '@OpportunityComponents/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@OpportunityComponents/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Layers, BarChart3, Clock } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const PipelineStageAnalysisTab = ({ stageDistribution, pipelineMovement }) => {
  const { getTitleClass, chartColors } = useDesignSystem();

  const getStageProbability = (stage) => {
    const probabilities = {
      'Prospecting': 10,
      'Qualification': 25,
      'Needs Analysis': 40,
      'Proposal': 60,
      'Negotiation': 75,
      'Closed Won': 100,
      'Closed Lost': 0
    };
    return probabilities[stage] || 30;
  };

  // Combine stage distribution with movement data for enhanced analysis
  const enhancedStageData = stageDistribution.map(stage => {
    const movementData = pipelineMovement?.find(m => m.stage === stage.stage) || {};
    return {
      ...stage,
      avgDaysInStage: movementData.avgDaysInStage || 0
    };
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            <Layers className="h-5 w-5 text-indigo-600" />
            Stage Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-gray-50 text-muted-foreground">Stage</TableHead>
                <TableHead className="bg-gray-50 text-muted-foreground">Opportunities</TableHead>
                <TableHead className="bg-gray-50 text-muted-foreground">Total Value</TableHead>
                <TableHead className="bg-gray-50 text-muted-foreground">Avg Deal Size</TableHead>
                <TableHead className="bg-gray-50 text-muted-foreground">Avg Days in Stage</TableHead>
                <TableHead className="bg-gray-50 text-muted-foreground">Win Probability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enhancedStageData.map((stage) => (
                <TableRow key={stage.stage} className="hover:bg-gray-50">
                  <TableCell className="font-medium py-2.5">{stage.stage}</TableCell>
                  <TableCell className="py-2.5">{stage.count}</TableCell>
                  <TableCell className="py-2.5">${(stage.value / 1000000).toFixed(2)}M</TableCell>
                  <TableCell className="py-2.5">
                    ${stage.count > 0 ? ((stage.value / stage.count) / 1000).toFixed(0) : 0}K
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      {Math.round(stage.avgDaysInStage)} days
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Badge variant="secondary" className="bg-blue-300 text-gray-800">
                      {stage.avgProbability || getStageProbability(stage.stage)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Stage Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageDistribution} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
              <XAxis type="number" tick={{ fill: chartColors.axisText }} />
              <YAxis dataKey="stage" type="category" width={100} tick={{ fill: chartColors.axisText }} />
              <Tooltip />
              <Bar dataKey="count" fill={chartColors.primary[2]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineStageAnalysisTab;
