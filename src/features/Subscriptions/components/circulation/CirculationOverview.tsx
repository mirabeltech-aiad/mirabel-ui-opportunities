

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Smartphone, TrendingUp } from 'lucide-react';
import { useSubscriptionMetrics } from '@/hooks/useSubscriptionData';

const CirculationOverview = () => {
  const { data: metrics, isLoading, error } = useSubscriptionMetrics();

  if (isLoading) return <div>Loading circulation overview...</div>;
  if (error) return <div>Error loading circulation overview</div>;
  if (!metrics) return null;

  // Transform subscription metrics to circulation overview format
  const overview = {
    totalCirculation: metrics.total,
    printCirculation: metrics.print,
    digitalCirculation: metrics.digital,
    monthlyGrowth: 5.2 // This would come from growth calculation
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Total Circulation</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{overview.totalCirculation.toLocaleString()}</div>
          <p className="text-xs text-blue-500">Active subscribers</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Print Circulation</CardTitle>
          <FileText className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{overview.printCirculation.toLocaleString()}</div>
          <p className="text-xs text-green-500">Print subscribers</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Digital Circulation</CardTitle>
          <Smartphone className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{overview.digitalCirculation.toLocaleString()}</div>
          <p className="text-xs text-purple-500">Digital subscribers</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Monthly Growth</CardTitle>
          <TrendingUp className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600">{overview.monthlyGrowth}%</div>
          <p className="text-xs text-rose-500">Growth rate</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CirculationOverview;
