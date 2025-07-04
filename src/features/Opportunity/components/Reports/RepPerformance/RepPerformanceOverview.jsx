import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';

const RepPerformanceOverview = ({ teamData }) => {
  const { getTitleClass } = useDesignSystem();

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
          <Users className="h-5 w-5 text-indigo-500" />
          Rep Performance Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-50 text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                Rep Name
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-600" />
                  Deals Won
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  Revenue
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Quota Progress
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Win Rate
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  Avg Deal Size
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamData.map((rep) => (
              <TableRow key={rep.id} className="hover:bg-gray-50">
                <TableCell className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                      {rep.initials}
                    </div>
                    {rep.name}
                  </div>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">{rep.deals}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2.5 text-green-600 font-medium">${(rep.revenue / 1000000).toFixed(1)}M</TableCell>
                <TableCell className="py-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-purple-600">
                        <Target className="h-3 w-3" />
                        {Math.round((rep.revenue / rep.quota) * 100)}%
                      </span>
                    </div>
                    <Progress value={(rep.revenue / rep.quota) * 100} className="h-2" />
                  </div>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-orange-600">{rep.winRate}%</span>
                  </div>
                </TableCell>
                <TableCell className="py-2.5 text-blue-600 font-medium">${(rep.avgDealSize / 1000).toFixed(0)}K</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RepPerformanceOverview;
