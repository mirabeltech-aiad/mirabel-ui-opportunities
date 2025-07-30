
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ArrowUpDown, TrendingUp, DollarSign, Users, Calculator } from 'lucide-react';

const RevenueByRegionChannelReport = () => {
  const [sortField, setSortField] = useState<string>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewType, setViewType] = useState<'region' | 'channel'>('region');

  const regionData: any[] = [];
  const channelData: any[] = [];

  const currentData = viewType === 'region' ? regionData : channelData;
  const top5Data = currentData.slice(0, 5);

  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCustomers = currentData.reduce((sum, item) => sum + item.customerCount, 0);
  const overallArpa = totalRevenue / totalCustomers;

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#3b82f6",
    },
  };

  const pieColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...currentData].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'revenue':
        aValue = a.revenue;
        bValue = b.revenue;
        break;
      case 'customerCount':
        aValue = a.customerCount;
        bValue = b.customerCount;
        break;
      case 'arpa':
        aValue = a.arpa;
        bValue = b.arpa;
        break;
      default:
        aValue = a.revenue;
        bValue = b.revenue;
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

  return (
    <div className="space-y-6">
      {/* Dashboard Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${(totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{totalCustomers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall ARPA</p>
                <p className="text-2xl font-bold">${overallArpa.toFixed(2)}</p>
              </div>
              <Calculator className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Performer</p>
                <p className="text-lg font-bold">{currentData[0]?.name}</p>
                <p className="text-sm text-muted-foreground">${(currentData[0]?.revenue / 1000000).toFixed(1)}M</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center">
        <div className="bg-muted p-1 rounded-lg">
          <button
            onClick={() => setViewType('region')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewType === 'region' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            By Region
          </button>
          <button
            onClick={() => setViewType('channel')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewType === 'channel' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            By Channel
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Revenue {viewType === 'region' ? 'Regions' : 'Channels'} - Pie Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={top5Data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="revenue"
                  nameKey="name"
                >
                  {top5Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, 'Revenue']}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Revenue {viewType === 'region' ? 'Regions' : 'Channels'} - Bar Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={top5Data} layout="vertical">
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sortable Table */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by {viewType === 'region' ? 'Region' : 'Channel'} - Detailed View</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    {viewType === 'region' ? 'Region' : 'Channel'}
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('revenue')}
                >
                  <div className="flex items-center gap-2">
                    Total Revenue
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('customerCount')}
                >
                  <div className="flex items-center gap-2">
                    Customer Count
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('arpa')}
                >
                  <div className="flex items-center gap-2">
                    ARPA
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Revenue Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => {
                const revenueShare = (item.revenue / totalRevenue) * 100;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>${(item.revenue / 1000000).toFixed(2)}M</TableCell>
                    <TableCell>{item.customerCount.toLocaleString()}</TableCell>
                    <TableCell>${item.arpa.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min(revenueShare, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {revenueShare.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueByRegionChannelReport;
