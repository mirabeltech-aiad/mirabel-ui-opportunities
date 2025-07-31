
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import ScrollToTopButton from '../../components/ui/ScrollToTopButton';
import HelpTooltip from '../shared/HelpTooltip';

const SimpleLTVReport = () => {
  // Average LTV data
  const averageLTV = 2847;

  // LTV by plan data
  const ltvByPlanData = [
    { plan: 'Digital Only', ltv: 1850, customers: 1250 },
    { plan: 'Print Only', ltv: 3200, customers: 875 },
    { plan: 'Print + Digital', ltv: 4100, customers: 620 },
    { plan: 'Premium Digital', ltv: 2650, customers: 490 },
    { plan: 'Student Plan', ltv: 980, customers: 340 }
  ];

  // Customer data with LTV calculations
  const customerData = [
    {
      id: 'C001',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      plan: 'Print + Digital',
      currentMRR: 89,
      churnProbability: 15,
      calculatedLTV: 4250,
      tenure: '18 months'
    },
    {
      id: 'C002',
      name: 'Michael Chen',
      email: 'mchen@email.com',
      plan: 'Digital Only',
      currentMRR: 29,
      churnProbability: 8,
      calculatedLTV: 2100,
      tenure: '24 months'
    },
    {
      id: 'C003',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      plan: 'Print Only',
      currentMRR: 59,
      churnProbability: 22,
      calculatedLTV: 3850,
      tenure: '12 months'
    },
    {
      id: 'C004',
      name: 'Robert Wilson',
      email: 'rwilson@email.com',
      plan: 'Premium Digital',
      currentMRR: 49,
      churnProbability: 12,
      calculatedLTV: 2900,
      tenure: '36 months'
    },
    {
      id: 'C005',
      name: 'Lisa Rodriguez',
      email: 'lrodriguez@email.com',
      plan: 'Print + Digital',
      currentMRR: 89,
      churnProbability: 18,
      calculatedLTV: 4100,
      tenure: '8 months'
    },
    {
      id: 'C006',
      name: 'David Thompson',
      email: 'dthompson@email.com',
      plan: 'Student Plan',
      currentMRR: 19,
      churnProbability: 35,
      calculatedLTV: 850,
      tenure: '6 months'
    },
    {
      id: 'C007',
      name: 'Jennifer Lee',
      email: 'jlee@email.com',
      plan: 'Digital Only',
      currentMRR: 29,
      churnProbability: 6,
      calculatedLTV: 2300,
      tenure: '42 months'
    },
    {
      id: 'C008',
      name: 'Mark Anderson',
      email: 'manderson@email.com',
      plan: 'Print Only',
      currentMRR: 59,
      churnProbability: 25,
      calculatedLTV: 3200,
      tenure: '14 months'
    }
  ];

  const chartConfig = {
    ltv: {
      label: "LTV",
      color: "hsl(142, 76%, 36%)",
    },
  };

  const getChurnRiskColor = (probability: number) => {
    if (probability >= 30) return 'text-red-600 bg-red-50';
    if (probability >= 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getChurnRiskLevel = (probability: number) => {
    if (probability >= 30) return 'High';
    if (probability >= 20) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics Cards */}

      {/* LTV Dashboard Tile */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium">Average Customer Lifetime Value</CardTitle>
            <HelpTooltip helpId="average-customer-ltv" />
          </div>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">${averageLTV.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Across all subscription plans
          </p>
        </CardContent>
      </Card>

      {/* LTV by Plan Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="flex items-center text-green-600">
              <TrendingUp className="w-5 h-5 mr-2" />
              Lifetime Value by Subscription Plan
            </CardTitle>
            <HelpTooltip helpId="ltv-by-subscription-plan" />
          </div>
          <CardDescription>
            Average LTV comparison across different subscription plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ltvByPlanData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="plan" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="ltv" 
                  fill="var(--color-ltv)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Customer LTV Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="flex items-center text-green-600">
              <Users className="w-5 h-5 mr-2" />
              Customer Lifetime Value Analysis
            </CardTitle>
            <HelpTooltip helpId="customer-ltv-analysis" />
          </div>
          <CardDescription>
            Individual customer analysis with current MRR, churn risk, and calculated LTV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="h-11 text-left py-2.5 px-4 font-medium text-gray-700 bg-gray-50">Customer</th>
                  <th className="h-11 text-left py-2.5 px-4 font-medium text-gray-700 bg-gray-50">Plan</th>
                  <th className="h-11 text-right py-2.5 px-4 font-medium text-gray-700 bg-gray-50">Current MRR</th>
                  <th className="h-11 text-center py-2.5 px-4 font-medium text-gray-700 bg-gray-50">Churn Risk</th>
                  <th className="h-11 text-right py-2.5 px-4 font-medium text-gray-700 bg-gray-50">Calculated LTV</th>
                  <th className="h-11 text-center py-2.5 px-4 font-medium text-gray-700 bg-gray-50">Tenure</th>
                </tr>
              </thead>
              <tbody>
                {customerData.map((customer, index) => (
                  <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="py-2.5 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.email}</div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-sm text-gray-700">{customer.plan}</span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="font-medium text-gray-900">${customer.currentMRR}</span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getChurnRiskColor(customer.churnProbability)}`}>
                          {customer.churnProbability >= 20 && (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          )}
                          {getChurnRiskLevel(customer.churnProbability)} ({customer.churnProbability}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="font-bold text-green-600">${customer.calculatedLTV.toLocaleString()}</span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="text-sm text-gray-600">{customer.tenure}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <ScrollToTopButton />
    </div>
  );
};

export default SimpleLTVReport;
