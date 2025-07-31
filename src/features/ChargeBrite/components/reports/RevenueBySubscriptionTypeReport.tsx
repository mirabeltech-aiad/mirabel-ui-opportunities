
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { TrendingUp, TrendingDown, DollarSign, RefreshCw } from 'lucide-react';

const revenueByFormat: any[] = [];

const revenueByTermLength = [
  { term: 'Monthly', revenue: 1890000, subscribers: 89200, avgRevenue: 21.19, refunds: 18500, netRevenue: 1871500 },
  { term: 'Quarterly', revenue: 950000, subscribers: 15800, avgRevenue: 60.13, refunds: 4200, netRevenue: 945800 },
  { term: 'Annual', revenue: 2360000, subscribers: 24500, avgRevenue: 96.33, refunds: 13800, netRevenue: 2346200 },
];

const revenueByRegion = [
  { region: 'North America', revenue: 2850000, subscribers: 78400, avgRevenue: 36.35, refunds: 22100, netRevenue: 2827900 },
  { region: 'Europe', revenue: 1750000, subscribers: 31200, avgRevenue: 56.09, refunds: 9800, netRevenue: 1740200 },
  { region: 'Asia Pacific', revenue: 520000, subscribers: 15300, avgRevenue: 33.99, refunds: 3200, netRevenue: 516800 },
  { region: 'Latin America', revenue: 80000, subscribers: 4600, avgRevenue: 17.39, refunds: 1400, netRevenue: 78600 },
];

const revenueByPaymentType = [
  { paymentType: 'Credit Card', revenue: 3580000, subscribers: 95200, avgRevenue: 37.61, refunds: 28400, netRevenue: 3551600 },
  { paymentType: 'Bank Transfer', revenue: 980000, subscribers: 22800, avgRevenue: 42.98, refunds: 4800, netRevenue: 975200 },
  { paymentType: 'Digital Wallet', revenue: 480000, subscribers: 9500, avgRevenue: 50.53, refunds: 2100, netRevenue: 477900 },
  { paymentType: 'Check', revenue: 160000, subscribers: 2000, avgRevenue: 80.00, refunds: 1200, netRevenue: 158800 },
];

const combinedData = [
  { category: 'Print + Annual + North America + Credit Card', revenue: 850000, subscribers: 12500, refunds: 8200 },
  { category: 'Digital + Monthly + Europe + Credit Card', revenue: 420000, subscribers: 18900, refunds: 3500 },
  { category: 'Combo + Annual + North America + Credit Card', revenue: 950000, subscribers: 8200, refunds: 5100 },
  { category: 'Print + Monthly + North America + Bank Transfer', revenue: 280000, subscribers: 11200, refunds: 2800 },
  { category: 'Digital + Monthly + Asia Pacific + Digital Wallet', revenue: 180000, subscribers: 7800, refunds: 900 },
];

const chartConfig = {
  revenue: { label: 'Revenue', color: '#3b82f6' },
  refunds: { label: 'Refunds', color: '#ef4444' },
  netRevenue: { label: 'Net Revenue', color: '#10b981' },
};

const RevenueBySubscriptionTypeReport = () => {
  const totalRevenue = revenueByFormat.reduce((sum, item) => sum + item.revenue, 0);
  const totalRefunds = revenueByFormat.reduce((sum, item) => sum + item.refunds, 0);
  const netRevenue = totalRevenue - totalRefunds;
  const refundRate = (totalRefunds / totalRevenue) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalRefunds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -2.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${netRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +9.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refund Rate</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refundRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -0.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="format" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="format">Format</TabsTrigger>
          <TabsTrigger value="term">Term Length</TabsTrigger>
          <TabsTrigger value="region">Region</TabsTrigger>
          <TabsTrigger value="payment">Payment Type</TabsTrigger>
          <TabsTrigger value="combined">Combined</TabsTrigger>
        </TabsList>

        <TabsContent value="format" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Subscription Format</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByFormat}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="format" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" />
                      <Bar dataKey="refunds" fill="var(--color-refunds)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Format Revenue Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Format</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Refunds</TableHead>
                      <TableHead>Net Revenue</TableHead>
                      <TableHead>Avg Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueByFormat.map((item) => (
                      <TableRow key={item.format}>
                        <TableCell>
                          <Badge variant="outline">{item.format}</Badge>
                        </TableCell>
                        <TableCell>${item.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-red-600">${item.refunds.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">${item.netRevenue.toLocaleString()}</TableCell>
                        <TableCell>${item.avgRevenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="term" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Term Length</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByTermLength}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="term" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" />
                      <Bar dataKey="refunds" fill="var(--color-refunds)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Term Length Revenue Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Term</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Refunds</TableHead>
                      <TableHead>Net Revenue</TableHead>
                      <TableHead>Avg Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueByTermLength.map((item) => (
                      <TableRow key={item.term}>
                        <TableCell>
                          <Badge variant="outline">{item.term}</Badge>
                        </TableCell>
                        <TableCell>${item.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-red-600">${item.refunds.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">${item.netRevenue.toLocaleString()}</TableCell>
                        <TableCell>${item.avgRevenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="region" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByRegion}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" />
                      <Bar dataKey="refunds" fill="var(--color-refunds)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Revenue Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Region</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Refunds</TableHead>
                      <TableHead>Net Revenue</TableHead>
                      <TableHead>Avg Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueByRegion.map((item) => (
                      <TableRow key={item.region}>
                        <TableCell>
                          <Badge variant="outline">{item.region}</Badge>
                        </TableCell>
                        <TableCell>${item.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-red-600">${item.refunds.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">${item.netRevenue.toLocaleString()}</TableCell>
                        <TableCell>${item.avgRevenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Payment Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByPaymentType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="paymentType" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" />
                      <Bar dataKey="refunds" fill="var(--color-refunds)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Type Revenue Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Type</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Refunds</TableHead>
                      <TableHead>Net Revenue</TableHead>
                      <TableHead>Avg Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueByPaymentType.map((item) => (
                      <TableRow key={item.paymentType}>
                        <TableCell>
                          <Badge variant="outline">{item.paymentType}</Badge>
                        </TableCell>
                        <TableCell>${item.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-red-600">${item.refunds.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">${item.netRevenue.toLocaleString()}</TableCell>
                        <TableCell>${item.avgRevenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="combined" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Combinations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Revenue breakdown by format, term, region, and payment type combinations
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Combination</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Subscribers</TableHead>
                    <TableHead>Refunds</TableHead>
                    <TableHead>Net Revenue</TableHead>
                    <TableHead>Avg Revenue per Sub</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combinedData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {item.category.split(' + ').map((part, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {part}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>${item.revenue.toLocaleString()}</TableCell>
                      <TableCell>{item.subscribers.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">${item.refunds.toLocaleString()}</TableCell>
                      <TableCell className="text-green-600">${(item.revenue - item.refunds).toLocaleString()}</TableCell>
                      <TableCell>${(item.revenue / item.subscribers).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueBySubscriptionTypeReport;
