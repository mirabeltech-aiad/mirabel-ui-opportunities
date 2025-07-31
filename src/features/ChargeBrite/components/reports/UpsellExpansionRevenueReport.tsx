
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ArrowUpDown, TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import HelpTooltip from '../shared/HelpTooltip';

const UpsellExpansionRevenueReport = () => {
  const [sortField, setSortField] = useState<string>('upsellAmount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const expansionTrends: any[] = [];
  const customerUpsells: any[] = [];

  const currentMonthExpansion = expansionTrends[expansionTrends.length - 1];
  const previousMonthExpansion = expansionTrends[expansionTrends.length - 2];
  const expansionGrowth = ((currentMonthExpansion.expansionMRR - previousMonthExpansion.expansionMRR) / previousMonthExpansion.expansionMRR) * 100;

  const totalExpansionMRR = customerUpsells.reduce((sum, customer) => sum + customer.upsellAmount, 0);
  const avgUpsellValue = totalExpansionMRR / customerUpsells.length;

  const chartConfig = {
    expansionMRR: {
      label: "Expansion MRR",
      color: "#10b981",
    },
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCustomers = [...customerUpsells].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'customerName':
        aValue = a.customerName;
        bValue = b.customerName;
        break;
      case 'upsellAmount':
        aValue = a.upsellAmount;
        bValue = b.upsellAmount;
        break;
      case 'upsellDate':
        aValue = new Date(a.upsellDate).getTime();
        bValue = new Date(b.upsellDate).getTime();
        break;
      case 'priorPlan':
        aValue = a.priorPlan;
        bValue = b.priorPlan;
        break;
      case 'newPlan':
        aValue = a.newPlan;
        bValue = b.newPlan;
        break;
      default:
        aValue = a.upsellAmount;
        bValue = b.upsellAmount;
    }

    if (typeof aValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }

    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const getPlanTypeBadge = (planType: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (planType === 'upgrade') {
      return `${baseClasses} bg-blue-100 text-blue-800`;
    }
    return `${baseClasses} bg-green-100 text-green-800`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}

      {/* Dashboard Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <p className="text-sm font-medium text-muted-foreground">Expansion MRR This Month</p>
                  <HelpTooltip helpId="expansion-mrr-this-month" />
                </div>
                <p className="text-2xl font-bold">${currentMonthExpansion.expansionMRR.toLocaleString()}</p>
                <p className={`text-sm ${expansionGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {expansionGrowth >= 0 ? '↗' : '↘'} {Math.abs(expansionGrowth).toFixed(1)}% from last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <p className="text-sm font-medium text-muted-foreground">Upsells This Month</p>
                  <HelpTooltip helpId="upsells-this-month" />
                </div>
                <p className="text-2xl font-bold">{currentMonthExpansion.upsellCount}</p>
                <p className="text-sm text-muted-foreground">customers upgraded</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <p className="text-sm font-medium text-muted-foreground">Avg Upsell Value</p>
                  <HelpTooltip helpId="avg-upsell-value" />
                </div>
                <p className="text-2xl font-bold">${avgUpsellValue.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">per customer</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <p className="text-sm font-medium text-muted-foreground">Total Expansion Revenue</p>
                  <HelpTooltip helpId="total-expansion-revenue" />
                </div>
                <p className="text-2xl font-bold">${totalExpansionMRR.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">recent period</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upsell Trends Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle>Expansion MRR Trends Over Time</CardTitle>
            <HelpTooltip helpId="expansion-mrr-trends" />
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart data={expansionTrends}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Expansion MRR']}
              />
              <Line 
                type="monotone" 
                dataKey="expansionMRR" 
                stroke="var(--color-expansionMRR)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-expansionMRR)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Customer Upsells Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle>Recent Customer Upsells & Expansions</CardTitle>
            <HelpTooltip helpId="recent-customer-upsells" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="h-11 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('customerName')}
                >
                  <div className="flex items-center gap-2">
                    Customer Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="h-11 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('priorPlan')}
                >
                  <div className="flex items-center gap-2">
                    Prior Plan
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="h-11 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('newPlan')}
                >
                  <div className="flex items-center gap-2">
                    New Plan
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="h-11 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('upsellAmount')}
                >
                  <div className="flex items-center gap-2">
                    Upsell Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="h-11 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('upsellDate')}
                >
                  <div className="flex items-center gap-2">
                    Upsell Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="h-11">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-50 cursor-pointer">
                  <TableCell className="py-2.5 px-4">
                    <div>
                      <div className="font-medium">{customer.customerName}</div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5 px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                      {customer.priorPlan}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {customer.newPlan}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5 px-4 font-medium">
                    ${customer.upsellAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-2.5 px-4">
                    {new Date(customer.upsellDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-2.5 px-4">
                    <span className={getPlanTypeBadge(customer.planType)}>
                      {customer.planType === 'upgrade' ? 'Upgrade' : 'Add-on'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpsellExpansionRevenueReport;
