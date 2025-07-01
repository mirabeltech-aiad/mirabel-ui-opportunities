
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const StagePatternsTab = ({ stageAnalysis }) => {
  const { getTitleClass, chartColors } = useDesignSystem();

  // Ensure safe defaults
  const safeStageAnalysis = Array.isArray(stageAnalysis) ? stageAnalysis : [];

  const chartConfig = {
    count: {
      label: "Count",
      color: chartColors.primary[3]
    }
  };

  // Transform data for display with mock additional fields
  const stageLossPatterns = safeStageAnalysis.map(stage => ({
    ...stage,
    losses: stage.count || 0,
    percentage: stage.count ? ((stage.count / safeStageAnalysis.reduce((sum, s) => sum + (s.count || 0), 0)) * 100).toFixed(1) : 0,
    avgDaysInStage: Math.floor(Math.random() * 30) + 10, // Mock data
    topLossReason: 'Price Too High' // Mock data
  }));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            Stage-Specific Loss Patterns
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Analysis of which sales stages have the highest loss rates and associated risk patterns</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-white border-b border-gray-200">
                <TableHead className="h-12 px-4 py-3 text-left align-middle font-semibold text-gray-900 border-r border-gray-200">Stage</TableHead>
                <TableHead className="h-12 px-4 py-3 text-center align-middle font-semibold text-gray-900 border-r border-gray-200">Losses</TableHead>
                <TableHead className="h-12 px-4 py-3 text-center align-middle font-semibold text-gray-900 border-r border-gray-200">% of Total</TableHead>
                <TableHead className="h-12 px-4 py-3 text-center align-middle font-semibold text-gray-900 border-r border-gray-200">Avg Days in Stage</TableHead>
                <TableHead className="h-12 px-4 py-3 text-center align-middle font-semibold text-gray-900 border-r border-gray-200">Top Loss Reason</TableHead>
                <TableHead className="h-12 px-4 py-3 text-center align-middle font-semibold text-gray-900">Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stageLossPatterns.length > 0 ? (
                stageLossPatterns.map((stage, index) => (
                  <TableRow key={stage.stage} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <TableCell className="px-4 py-3 font-medium text-gray-900 border-r border-gray-100">{stage.stage}</TableCell>
                    <TableCell className="px-4 py-3 text-center text-gray-700 border-r border-gray-100">{stage.losses}</TableCell>
                    <TableCell className="px-4 py-3 text-center font-medium text-ocean-600 border-r border-gray-100">{stage.percentage}%</TableCell>
                    <TableCell className="px-4 py-3 text-center text-gray-700 border-r border-gray-100">{stage.avgDaysInStage}</TableCell>
                    <TableCell className="px-4 py-3 text-center text-gray-700 border-r border-gray-100">{stage.topLossReason}</TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <Badge 
                        variant={
                          stage.losses >= 10 ? 'destructive' :
                          stage.losses >= 6 ? 'secondary' : 'default'
                        }
                      >
                        {stage.losses >= 10 ? 'High' :
                         stage.losses >= 6 ? 'Medium' : 'Low'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-8 text-center text-muted-foreground bg-gray-50/50">
                    No stage analysis data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-white">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            Loss Analysis by Stage
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Visual representation of deal losses across different sales stages</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {safeStageAnalysis.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={stageLossPatterns}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
                <XAxis dataKey="stage" tick={{ fill: chartColors.axisText }} />
                <YAxis tick={{ fill: chartColors.axisText }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="losses" fill={chartColors.primary[3]} name="Losses" />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No stage analysis data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StagePatternsTab;
