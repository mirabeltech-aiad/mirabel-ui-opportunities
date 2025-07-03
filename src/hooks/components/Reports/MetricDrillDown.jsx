
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@OpportunityComponents/ui/dialog';
import { Button } from '@OpportunityComponents/ui/button';
import { Badge } from '@OpportunityComponents/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@OpportunityComponents/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@OpportunityComponents/ui/chart';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Users } from 'lucide-react';

const MetricDrillDown = ({ isOpen, onClose, metric, period }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getMetricData = () => {
    switch (metric) {
      case 'revenue':
        return {
          title: 'Total Revenue Analysis',
          icon: DollarSign,
          value: '$2.8M',
          change: '+33.3%',
          trend: 'up',
          breakdown: [
            { name: 'Enterprise', value: 1200000, percentage: 43 },
            { name: 'Mid-Market', value: 900000, percentage: 32 },
            { name: 'SMB', value: 700000, percentage: 25 }
          ],
          timeline: [
            { month: 'Jan', value: 800000 },
            { month: 'Feb', value: 950000 },
            { month: 'Mar', value: 1050000 }
          ]
        };
      case 'pipeline':
        return {
          title: 'Pipeline Value Analysis',
          icon: Target,
          value: '$4.2M',
          change: '+12.5%',
          trend: 'up',
          breakdown: [
            { name: 'Negotiation', value: 1500000, percentage: 36 },
            { name: 'Proposal', value: 1200000, percentage: 29 },
            { name: 'Discovery', value: 900000, percentage: 21 },
            { name: 'Qualified', value: 600000, percentage: 14 }
          ],
          timeline: [
            { month: 'Jan', value: 3800000 },
            { month: 'Feb', value: 4000000 },
            { month: 'Mar', value: 4200000 }
          ]
        };
      case 'winRate':
        return {
          title: 'Win Rate Analysis',
          icon: TrendingUp,
          value: '23.5%',
          change: '+2.3%',
          trend: 'up',
          breakdown: [
            { name: 'Enterprise', value: 28, percentage: 28 },
            { name: 'Mid-Market', value: 22, percentage: 22 },
            { name: 'SMB', value: 21, percentage: 21 }
          ],
          timeline: [
            { month: 'Jan', value: 21 },
            { month: 'Feb', value: 22 },
            { month: 'Mar', value: 24 }
          ]
        };
      default:
        return null;
    }
  };

  const data = getMetricData();
  if (!data) return null;

  const IconComponent = data.icon;
  const chartConfig = {
    value: {
      label: "Value",
      color: "#3b82f6",
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {data.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{data.value}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {data.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={data.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {data.change} from last period
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {period}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.breakdown.map((item, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {metric === 'revenue' || metric === 'pipeline' 
                          ? `$${(item.value / 1000000).toFixed(1)}M`
                          : `${item.value}%`
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.percentage}% of total
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="breakdown">
              <Card>
                <CardHeader>
                  <CardTitle>Segment Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.breakdown}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.timeline}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: "#3b82f6", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MetricDrillDown;
