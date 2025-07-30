
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import { HelpTooltip } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';

interface MonthlyRecurringRevenueReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
}

const chartConfig = {
  mrr: {
    label: 'MRR',
    color: 'hsl(var(--chart-1))',
  },
};

const MonthlyRecurringRevenueReport: React.FC<MonthlyRecurringRevenueReportProps> = ({ dateRange }) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real MRR data from Supabase
  const { data: mrrData, isLoading, error } = useQuery({
    queryKey: ['mrr-data', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getMRRData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading MRR data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading MRR data</div>;
  }

  const {
    currentMRR = 0,
    previousMRR = 0,
    mrrGrowth = '0.0',
    mrrTrendData = [],
    customerData = []
  } = mrrData || {};
  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}

      {/* Dashboard Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium">Current MRR</CardTitle>
              <HelpTooltip helpId="current-mrr-card" />
            </div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMRR.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium">MRR Growth</CardTitle>
              <HelpTooltip helpId="mrr-growth-card" />
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{mrrGrowth}%</div>
            <p className="text-xs text-muted-foreground">Month-over-month growth</p>
          </CardContent>
        </Card>
      </div>

      {/* MRR Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle>MRR Trend - Past 12 Months</CardTitle>
            <HelpTooltip helpId="mrr-trend-chart" />
          </div>
          <CardDescription>Monthly recurring revenue growth over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mrrTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'MRR']}
                />
                <Line
                  type="monotone"
                  dataKey="mrr"
                  stroke="var(--color-mrr)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-mrr)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Customer MRR Breakdown Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle>Customer MRR Breakdown</CardTitle>
            <HelpTooltip helpId="customer-mrr-breakdown" />
          </div>
          <CardDescription>Individual customer contributions to monthly recurring revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Plan Type</TableHead>
                <TableHead className="text-right">MRR Contribution</TableHead>
                <TableHead>Subscription Start</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerData.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{customer.customerName}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.planType === 'Enterprise' 
                        ? 'bg-purple-100 text-purple-800' 
                        : customer.planType === 'Professional'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.planType}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${customer.mrrContribution.toLocaleString()}
                  </TableCell>
                  <TableCell>{new Date(customer.subscriptionStart).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <ScrollToTopButton />
    </div>
  );
};

export default MonthlyRecurringRevenueReport;
