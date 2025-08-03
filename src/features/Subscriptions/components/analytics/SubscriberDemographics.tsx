

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriberDemographics } from '@/hooks/useAnalyticsData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { HelpTooltip } from '@/components';

import { CHART_COLORS } from '@/constants/chartColors';

const SubscriberDemographics = () => {
  const { data: demographics, isLoading, error } = useSubscriberDemographics();

  if (isLoading) return <div>Loading demographics...</div>;
  if (error) return <div>Error loading demographics</div>;
  if (!demographics) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-ocean-800">Subscriber Demographics</h2>
        <HelpTooltip helpId="subscriber-demographics" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Groups */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Age Distribution</CardTitle>
              <HelpTooltip helpId="age-distribution" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demographics.ageGroups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value, name) => [value.toLocaleString(), name]} />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Gender Distribution</CardTitle>
              <HelpTooltip helpId="gender-distribution" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demographics.genderDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {demographics.genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value.toLocaleString(), 'Subscribers']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Income Ranges */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Income Distribution & LTV</CardTitle>
              <HelpTooltip helpId="income-distribution" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demographics.incomeRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Subscribers" />
                <Bar yAxisId="right" dataKey="averageLTV" fill="#10b981" name="Avg LTV" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SubscriberDemographics;
