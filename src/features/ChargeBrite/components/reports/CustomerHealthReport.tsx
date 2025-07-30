
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Heart, TrendingUp, TrendingDown, User } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { HelpTooltip } from '@/components';
import { useTableColumnManager } from '@/hooks/useTableColumnManager';
import { useSorting } from '@/hooks/useSorting';
import { getDataTypeFromColumn } from '@/utils/sortingUtils';

const CustomerHealthReport = () => {
  // Health score distribution data
  const healthDistribution = [
    { tier: 'Healthy', count: 1248, percentage: 62.4, fill: '#22c55e' },
    { tier: 'At Risk', count: 485, percentage: 24.3, fill: '#f59e0b' },
    { tier: 'Critical', count: 267, percentage: 13.3, fill: '#ef4444' }
  ];

  // Health score trends by tier
  const trendData = [
    { tier: 'Healthy', avgScore: 8.7, change: '+0.3' },
    { tier: 'At Risk', avgScore: 5.4, change: '-0.2' },
    { tier: 'Critical', avgScore: 2.8, change: '-0.5' }
  ];

  // Customer health details
  const customerHealthData = [
    {
      id: 'CUST-001',
      customerName: 'Acme Corporation',
      lastLogin: '2024-01-15',
      usageTrend: 'increasing',
      healthScore: 9.2,
      tier: 'Healthy',
      accountManager: 'Sarah Johnson',
      riskFactors: []
    },
    {
      id: 'CUST-002',
      customerName: 'TechStart Inc.',
      lastLogin: '2024-01-10',
      usageTrend: 'stable',
      healthScore: 7.8,
      tier: 'Healthy',
      accountManager: 'Mike Chen',
      riskFactors: ['Low engagement']
    },
    {
      id: 'CUST-003',
      customerName: 'Global Solutions Ltd.',
      lastLogin: '2023-12-28',
      usageTrend: 'decreasing',
      healthScore: 4.5,
      tier: 'At Risk',
      accountManager: 'Emily Davis',
      riskFactors: ['Infrequent logins', 'Support tickets']
    },
    {
      id: 'CUST-004',
      customerName: 'Innovation Labs',
      lastLogin: '2024-01-14',
      usageTrend: 'increasing',
      healthScore: 8.9,
      tier: 'Healthy',
      accountManager: 'David Wilson',
      riskFactors: []
    },
    {
      id: 'CUST-005',
      customerName: 'Metro Enterprises',
      lastLogin: '2023-12-15',
      usageTrend: 'decreasing',
      healthScore: 2.1,
      tier: 'Critical',
      accountManager: 'Lisa Thompson',
      riskFactors: ['No recent login', 'Contract expiring', 'Low usage']
    },
    {
      id: 'CUST-006',
      customerName: 'Future Systems',
      lastLogin: '2024-01-12',
      usageTrend: 'stable',
      healthScore: 6.3,
      tier: 'At Risk',
      accountManager: 'James Rodriguez',
      riskFactors: ['Declining usage']
    },
    {
      id: 'CUST-007',
      customerName: 'Dynamic Industries',
      lastLogin: '2024-01-16',
      usageTrend: 'increasing',
      healthScore: 9.5,
      tier: 'Healthy',
      accountManager: 'Maria Garcia',
      riskFactors: []
    },
    {
      id: 'CUST-008',
      customerName: 'Nexus Corporation',
      lastLogin: '2023-11-30',
      usageTrend: 'decreasing',
      healthScore: 1.8,
      tier: 'Critical',
      accountManager: 'Robert Lee',
      riskFactors: ['Extended inactivity', 'Multiple escalations', 'Contract issues']
    }
  ];

  const chartConfig = {
    healthScore: {
      label: "Health Score",
      color: "hsl(221, 83%, 53%)",
    },
  };

  const totalCustomers = healthDistribution.reduce((sum, tier) => sum + tier.count, 0);
  const averageHealthScore = (
    customerHealthData.reduce((sum, customer) => sum + customer.healthScore, 0) / 
    customerHealthData.length
  ).toFixed(1);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Healthy': return 'text-green-600';
      case 'At Risk': return 'text-yellow-600';
      case 'Critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      'Healthy': 'bg-green-100 text-green-800',
      'At Risk': 'bg-yellow-100 text-yellow-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[tier as keyof typeof colors]}`}>{tier}</span>;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <span className="h-4 w-4 text-gray-600">→</span>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600 font-bold';
    if (score >= 4) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  const getDaysSinceLogin = (lastLogin: string) => {
    const today = new Date();
    const loginDate = new Date(lastLogin);
    const diffTime = Math.abs(today.getTime() - loginDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Cards */}

      {/* Dashboard Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Health Score */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              Average Health Score
              <HelpTooltip helpId="customer-health-avg-score" />
            </CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{averageHealthScore}/10</div>
            <p className="text-xs text-muted-foreground">
              Across {totalCustomers.toLocaleString()} customers
            </p>
            <div className="mt-2 text-sm">
              <span className="text-green-600 font-medium">{healthDistribution[0].percentage}%</span>
              <span className="text-gray-600"> healthy customers</span>
            </div>
          </CardContent>
        </Card>

        {/* Health Distribution */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              Health Distribution
              <HelpTooltip helpId="customer-health-distribution" />
            </CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {healthDistribution.map((tier) => (
                <div key={tier.tier} className="text-center">
                  <div className={`text-lg font-bold ${getTierColor(tier.tier)}`}>
                    {tier.count}
                  </div>
                  <div className="text-xs text-gray-600">{tier.tier}</div>
                  <div className="text-xs text-gray-500">{tier.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Distribution Pie Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            <Heart className="w-5 h-5 mr-2" />
            Customer Health Distribution
            <HelpTooltip helpId="customer-health-chart" />
          </CardTitle>
          <CardDescription>
            Distribution of customers across health tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-medium">{data.tier}</p>
                            <p className="text-blue-600">
                              Count: {data.count.toLocaleString()}
                            </p>
                            <p className="text-green-600">
                              Percentage: {data.percentage}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Health Score Trends</h3>
              {trendData.map((tier) => (
                <div key={tier.tier} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      tier.tier === 'Healthy' ? 'bg-green-500' :
                      tier.tier === 'At Risk' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-medium">{tier.tier}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{tier.avgScore}/10</div>
                    <div className={`text-sm ${tier.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {tier.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Health Details Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            <User className="w-5 h-5 mr-2" />
            Customer Health Details
            <HelpTooltip helpId="customer-health-details" />
          </CardTitle>
          <CardDescription>
            Individual customer health metrics and risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            // Define table columns
            const tableColumns = [
              { id: 'id', label: 'Customer ID', sortable: true, resizable: true },
              { id: 'customerName', label: 'Customer Name', sortable: true, resizable: true },
              { id: 'lastLogin', label: 'Last Login', sortable: true, resizable: true },
              { id: 'usageTrend', label: 'Usage Trend', sortable: true, resizable: true },
              { id: 'healthScore', label: 'Health Score', sortable: true, resizable: true },
              { id: 'tier', label: 'Tier', sortable: true, resizable: true },
              { id: 'accountManager', label: 'Account Manager', sortable: true, resizable: true },
              { id: 'riskFactors', label: 'Risk Factors', sortable: false, resizable: true }
            ];

            // Initialize table column management
            const {
              columnOrder,
              draggedColumn,
              columnWidths,
              handleColumnResize,
              handleDragStart,
              handleDragOver,
              handleDragEnd
            } = useTableColumnManager({
              columns: tableColumns,
              storageKey: 'customer-health-details-columns'
            });

            // Initialize sorting functionality
            const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
              data: customerHealthData,
              initialSort: undefined
            });

            // Handle column resizing
            const startResizing = (e: React.MouseEvent, columnId: string) => {
              e.stopPropagation();
              e.preventDefault();
              
              const startX = e.pageX;
              const currentWidth = columnWidths[columnId] || 150;
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const width = Math.max(80, currentWidth + (moveEvent.pageX - startX));
                handleColumnResize(columnId, width);
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            };

            // Render cell content
            const renderCellContent = (customer: any, columnId: string) => {
              switch (columnId) {
                case 'id':
                  return <span className="font-medium text-blue-600">{customer.id}</span>;
                case 'customerName':
                  return <span className="font-medium text-gray-900">{customer.customerName}</span>;
                case 'lastLogin':
                  return (
                    <div>
                      <span className="text-gray-700">{customer.lastLogin}</span>
                      <div className="text-xs text-gray-500">
                        {getDaysSinceLogin(customer.lastLogin)} days ago
                      </div>
                    </div>
                  );
                case 'usageTrend':
                  return (
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(customer.usageTrend)}
                      <span className={`text-sm capitalize ${getTrendColor(customer.usageTrend)}`}>
                        {customer.usageTrend}
                      </span>
                    </div>
                  );
                case 'healthScore':
                  return (
                    <span className={`text-lg ${getScoreColor(customer.healthScore)}`}>
                      {customer.healthScore}/10
                    </span>
                  );
                case 'tier':
                  return getTierBadge(customer.tier);
                case 'accountManager':
                  return <span className="text-gray-700">{customer.accountManager}</span>;
                case 'riskFactors':
                  return customer.riskFactors.length > 0 ? (
                    <div className="space-y-1">
                      {customer.riskFactors.map((risk: string, idx: number) => (
                        <span key={idx} className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded mr-1">
                          {risk}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-green-600 text-sm">No risks</span>
                  );
                default:
                  return '';
              }
            };

            return (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['healthScore'].includes(column.id);
                      const isCenterAligned = ['usageTrend', 'tier'].includes(column.id);
                      return (
                        <TableHead
                          key={column.id}
                          className={`relative cursor-pointer hover:bg-gray-100 font-medium text-muted-foreground select-none h-11 py-2.5 px-4 ${
                            isRightAligned ? 'text-right' : isCenterAligned ? 'text-center' : 'text-left'
                          }`}
                          draggable="true"
                          onDragStart={(e) => handleDragStart(e, column.id)}
                          onDragOver={(e) => handleDragOver(e, column.id)}
                          onDragEnd={handleDragEnd}
                          onClick={(e) => {
                            if (!e.defaultPrevented && column.sortable) {
                              const dataType = getDataTypeFromColumn(column.id);
                              requestSort(column.id, dataType);
                            }
                          }}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: '80px',
                            cursor: draggedColumn === column.id ? 'grabbing' : 'grab'
                          }}
                        >
                          <div className={`flex items-center gap-1 flex-1 ${
                            isRightAligned ? 'justify-end' : isCenterAligned ? 'justify-center' : 'justify-start'
                          }`}>
                            <span>{column.label}</span>
                            {sortConfig.key === column.id && (
                              <span className="text-xs text-ocean-500">
                                {getSortIcon(column.id)}
                              </span>
                            )}
                          </div>
                          <div 
                            className="absolute right-0 top-0 h-full w-4 cursor-col-resize group"
                            onMouseDown={(e) => startResizing(e, column.id)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="h-full w-1 bg-ocean-300 opacity-0 group-hover:opacity-100 mx-auto"></div>
                          </div>
                          {draggedColumn === column.id && (
                            <div className="absolute inset-0 bg-ocean-100 opacity-30 border-2 border-ocean-400 rounded pointer-events-none"></div>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((customer, index) => (
                    <TableRow key={customer.id} className="hover:bg-gray-50">
                      {columnOrder.map((column) => {
                        const isRightAligned = ['healthScore'].includes(column.id);
                        const isCenterAligned = ['usageTrend', 'tier'].includes(column.id);
                        return (
                          <TableCell 
                            key={column.id} 
                            className={`py-2.5 px-4 ${
                              isRightAligned ? 'text-right' : isCenterAligned ? 'text-center' : ''
                            }`}
                            style={{
                              width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                              minWidth: '80px'
                            }}
                          >
                            {renderCellContent(customer, column.id)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            );
          })()}
          
          {/* Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Customers:</span>
                <span className="ml-2 font-semibold text-blue-600">{customerHealthData.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Healthy:</span>
                <span className="ml-2 font-semibold text-green-600">
                  {customerHealthData.filter(c => c.tier === 'Healthy').length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">At Risk:</span>
                <span className="ml-2 font-semibold text-yellow-600">
                  {customerHealthData.filter(c => c.tier === 'At Risk').length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Critical:</span>
                <span className="ml-2 font-semibold text-red-600">
                  {customerHealthData.filter(c => c.tier === 'Critical').length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerHealthReport;
