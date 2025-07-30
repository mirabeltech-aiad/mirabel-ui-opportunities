

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useABTestingData } from '@/hooks/usePricingData';
import { HelpTooltip } from '@/components';

const ABTestingResults = () => {
  const { data, isLoading } = useABTestingData();

  if (isLoading || !data) {
    return <div>Loading A/B testing data...</div>;
  }

  const chartConfig = {
    conversionRate: { label: "Conversion Rate", color: "#3b82f6" },
    revenue: { label: "Revenue", color: "#10b981" },
    confidence: { label: "Confidence", color: "#8b5cf6" }
  };

  // Calculate average lift from test results
  const completedTests = data.testResults.filter(test => test.status === 'completed');
  const averageLift = completedTests.length > 0 
    ? Math.round(completedTests.reduce((sum, test) => sum + Math.abs(test.conversionChange), 0) / completedTests.length * 10) / 10
    : 0;

  // Calculate average confidence from test results
  const averageConfidence = data.testResults.length > 0
    ? Math.round(data.testResults.reduce((sum, test) => sum + test.significance, 0) / data.testResults.length)
    : 0;

  // Create mock confidence trend data
  const confidenceTrend = [
    { day: 1, confidence: 45 },
    { day: 7, confidence: 62 },
    { day: 14, confidence: 78 },
    { day: 21, confidence: 85 },
    { day: 28, confidence: averageConfidence }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Active Tests</CardTitle>
              <HelpTooltip helpId="ab-testing-active-tests" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.activeTests.length}</div>
            <p className="text-xs text-blue-500">Currently running</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Avg Conversion Lift</CardTitle>
              <HelpTooltip helpId="ab-testing-conversion-lift" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{averageLift}%</div>
            <p className="text-xs text-green-500">From winning tests</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Test Confidence</CardTitle>
              <HelpTooltip helpId="ab-testing-confidence" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{averageConfidence}%</div>
            <p className="text-xs text-purple-500">Statistical significance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Test Performance</CardTitle>
              <HelpTooltip helpId="ab-testing-performance" />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.testResults}>
                  <XAxis dataKey="testName" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="conversionRate" fill="var(--color-conversionRate)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Confidence Trends</CardTitle>
              <HelpTooltip helpId="ab-testing-confidence-trends" />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={confidenceTrend}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="confidence" stroke="var(--color-confidence)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Current Tests</CardTitle>
            <HelpTooltip helpId="ab-testing-current-tests" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.activeTests.map((test) => (
              <div key={test.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{test.name}</h4>
                  <Badge variant={test.status === 'running' ? 'blue' : test.status === 'completed' ? 'green' : 'orange'}>
                    {test.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Control Price:</span>
                    <span className="ml-1 font-medium">${test.controlPrice}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Variant Price:</span>
                    <span className="ml-1 font-medium">${test.variantPrice}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Participants:</span>
                    <span className="ml-1 font-medium">{test.participants.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ABTestingResults;
