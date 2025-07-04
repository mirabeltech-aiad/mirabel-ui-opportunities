
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';

const CompetitorsTab = ({ repAnalysis }) => {
  const { getTitleClass, getTableHeaderClass } = useDesignSystem();

  // Ensure safe defaults
  const safeRepAnalysis = Array.isArray(repAnalysis) ? repAnalysis : [];

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <CardTitle className={getTitleClass()}>Rep Loss Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`${getTableHeaderClass()} text-muted-foreground`}>Rep Name</TableHead>
              <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Lost Deals</TableHead>
              <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Lost Value</TableHead>
              <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Avg Deal Size</TableHead>
              <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Loss Rate</TableHead>
              <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Risk Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeRepAnalysis.length > 0 ? (
              safeRepAnalysis.slice(0, 10).map((rep) => (
                <TableRow key={rep.repName} className="hover:bg-gray-50">
                  <TableCell className="font-medium py-2.5">{rep.repName}</TableCell>
                  <TableCell className="text-center py-2.5">{rep.lostDealsCount}</TableCell>
                  <TableCell className="text-center py-2.5">${(rep.lostValue / 1000000).toFixed(1)}M</TableCell>
                  <TableCell className="text-center py-2.5">${(rep.avgLostDealSize / 1000).toFixed(0)}K</TableCell>
                  <TableCell className="text-center py-2.5">{rep.lossRate}%</TableCell>
                  <TableCell className="text-center py-2.5">
                    <Badge 
                      variant={
                        rep.lossRate >= 50 ? 'destructive' :
                        rep.lossRate >= 30 ? 'secondary' : 'default'
                      }
                    >
                      {rep.lossRate >= 50 ? 'High' :
                       rep.lossRate >= 30 ? 'Medium' : 'Low'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-2.5">
                  No rep analysis data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CompetitorsTab;
