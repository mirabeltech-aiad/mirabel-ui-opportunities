
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';

const LossReasonsTab = ({ lossReasons }) => {
  const { getTitleClass, chartColors } = useDesignSystem();

  // Ensure safe defaults
  const safeLossReasons = Array.isArray(lossReasons) ? lossReasons : [];

  const lossReasonChart = safeLossReasons.map((item, index) => ({
    ...item,
    fill: chartColors.primary[index % chartColors.primary.length]
  }));

  const chartConfig = {
    count: {
      label: "Count",
      color: chartColors.primary[1]
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className={getTitleClass()}>Loss Reasons Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {safeLossReasons.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={lossReasonChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ reason, count, percentage }) => `${reason}: ${count} (${((count / safeLossReasons.reduce((sum, r) => sum + r.count, 0)) * 100).toFixed(1)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {lossReasonChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors.primary[index % chartColors.primary.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-medium">{data.reason}</p>
                            <p className="text-sm text-gray-600">Count: {data.count}</p>
                            <p className="text-sm text-gray-600">Value: ${(data.value / 1000).toFixed(0)}K</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No loss reason data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className={getTitleClass()}>Loss Reasons Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="h-12 px-4 py-3 text-left align-middle font-semibold text-gray-900 border-r border-gray-200">Reason</TableHead>
                <TableHead className="h-12 px-4 py-3 text-center align-middle font-semibold text-gray-900 border-r border-gray-200">Count</TableHead>
                <TableHead className="h-12 px-4 py-3 text-center align-middle font-semibold text-gray-900 border-r border-gray-200">Lost Value</TableHead>
                <TableHead className="h-12 px-4 py-3 text-center align-middle font-semibold text-gray-900">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeLossReasons.length > 0 ? (
                safeLossReasons
                  .sort((a, b) => (b.count || 0) - (a.count || 0))
                  .slice(0, 6)
                  .map((reason, index) => {
                    const totalCount = safeLossReasons.reduce((sum, r) => sum + r.count, 0);
                    const percentage = totalCount > 0 ? ((reason.count / totalCount) * 100).toFixed(1) : '0.0';
                    return (
                      <TableRow key={reason.reason} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <TableCell className="px-4 py-3 font-medium text-gray-900 border-r border-gray-100">{reason.reason}</TableCell>
                        <TableCell className="px-4 py-3 text-center text-gray-700 border-r border-gray-100">{reason.count || 0}</TableCell>
                        <TableCell className="px-4 py-3 text-center font-medium text-gray-900 border-r border-gray-100">${((reason.value || 0) / 1000).toFixed(0)}K</TableCell>
                        <TableCell className="px-4 py-3 text-center font-medium text-ocean-600">{percentage}%</TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="px-4 py-8 text-center text-muted-foreground bg-gray-50/50">
                    No loss reason data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LossReasonsTab;
