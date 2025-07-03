
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@OpportunityComponents/ui/table';
import { Badge } from '@OpportunityComponents/ui/badge';
import { BarChart3 } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const StageAnalysisTab = ({ velocityMetrics }) => {
  const { getTitleClass, getTableHeaderClass } = useDesignSystem();

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
          <BarChart3 className="h-5 w-5 text-purple-600" />
          Time in Stage Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`${getTableHeaderClass()} text-muted-foreground`}>Stage</TableHead>
              <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Avg Time (Days)</TableHead>
              <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Deal Count</TableHead>
              <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>vs Benchmark</TableHead>
              <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {velocityMetrics.stageVelocity.map((stage) => (
              <TableRow key={stage.stage} className="hover:bg-gray-50">
                <TableCell className="font-medium py-2.5">{stage.stage}</TableCell>
                <TableCell className="text-center py-2.5">{stage.avgDays}</TableCell>
                <TableCell className="text-center py-2.5">{stage.dealCount}</TableCell>
                <TableCell className="text-center py-2.5">
                  <span className={`font-medium ${
                    stage.variance > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {stage.variance > 0 ? '+' : ''}{stage.variance}%
                  </span>
                </TableCell>
                <TableCell className="text-center py-2.5">
                  <Badge 
                    variant={
                      stage.status === 'optimal' ? 'default' :
                      stage.status === 'slow' ? 'destructive' : 'secondary'
                    }
                    className={
                      stage.status === 'optimal' ? 'bg-green-500 text-white' :
                      stage.status === 'slow' ? 'bg-red-500 text-white' : 'bg-blue-300 text-gray-800'
                    }
                  >
                    {stage.status === 'optimal' ? 'Optimal' :
                     stage.status === 'slow' ? 'Needs Work' : 'Fast'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StageAnalysisTab;
