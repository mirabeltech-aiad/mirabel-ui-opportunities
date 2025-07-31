import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Users, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import HelpTooltip from '@/components/shared/HelpTooltip';

const NetRevenueRetentionReport = () => {
  const nrrTrendData: any[] = [];
  const currentNRR = 0;
  const previousNRR = 0;
  const nrrChange = 0;
  const cohortData: any[] = [];

  const chartConfig = {
    nrr: {
      label: "NRR %",
      color: "hsl(142, 76%, 36%)",
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics Cards */}

      {/* NRR Dashboard Tile */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            Net Revenue Retention (NRR)
            <HelpTooltip helpId="net-revenue-retention-rate" />
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{currentNRR}%</div>
          <p className="text-xs text-muted-foreground">
            {nrrChange > 0 ? '+' : ''}{nrrChange.toFixed(1)}% from last month
          </p>
        </CardContent>
      </Card>

      {/* NRR Trend Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-ocean-800">
            <TrendingUp className="w-5 h-5 mr-2" />
            NRR Trend - Past 12 Months
            <HelpTooltip helpId="revenue-retention-trends" />
          </CardTitle>
          <CardDescription>
            Monthly Net Revenue Retention percentage showing revenue retention and expansion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nrrTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="nrr" 
                  stroke="var(--color-nrr)" 
                  strokeWidth={3}
                  dot={{ fill: "var(--color-nrr)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Cohort Analysis Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <Users className="w-5 h-5 mr-2" />
            NRR by Customer Cohort
          </CardTitle>
          <CardDescription>
            Revenue retention analysis showing expansions, contractions, and churn by customer cohort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-medium text-gray-700">Cohort</th>
                  <th className="text-right p-3 font-medium text-gray-700">Starting MRR</th>
                  <th className="text-right p-3 font-medium text-gray-700">Expansions</th>
                  <th className="text-right p-3 font-medium text-gray-700">Contractions</th>
                  <th className="text-right p-3 font-medium text-gray-700">Churn</th>
                  <th className="text-right p-3 font-medium text-gray-700">Ending MRR</th>
                  <th className="text-right p-3 font-medium text-gray-700">NRR %</th>
                </tr>
              </thead>
              <tbody>
                {cohortData.map((cohort, index) => (
                  <tr key={cohort.cohort} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{cohort.cohort}</div>
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-medium text-gray-700">${cohort.startingMRR.toLocaleString()}</span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end">
                        <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
                        <span className="font-medium text-green-600">+${cohort.expansions.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end">
                        <ArrowDownRight className="w-3 h-3 mr-1 text-yellow-500" />
                        <span className="font-medium text-yellow-600">${cohort.contractions.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end">
                        <ArrowDownRight className="w-3 h-3 mr-1 text-red-500" />
                        <span className="font-medium text-red-600">${cohort.churn.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-medium text-gray-700">${cohort.endingMRR.toLocaleString()}</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`font-bold ${cohort.nrr >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                        {cohort.nrr}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Summary */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Starting MRR:</span>
                <span className="ml-2 font-semibold text-green-600">
                  ${cohortData.reduce((sum, cohort) => sum + cohort.startingMRR, 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Expansions:</span>
                <span className="ml-2 font-semibold text-green-600">
                  +${cohortData.reduce((sum, cohort) => sum + cohort.expansions, 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Contractions:</span>
                <span className="ml-2 font-semibold text-yellow-600">
                  ${cohortData.reduce((sum, cohort) => sum + cohort.contractions, 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Overall NRR:</span>
                <span className="ml-2 font-semibold text-green-600">
                  {(
                    (cohortData.reduce((sum, cohort) => sum + cohort.endingMRR, 0) / 
                     cohortData.reduce((sum, cohort) => sum + cohort.startingMRR, 0)) * 100
                  ).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ScrollToTopButton />
    </div>
  );
};

export default NetRevenueRetentionReport;
