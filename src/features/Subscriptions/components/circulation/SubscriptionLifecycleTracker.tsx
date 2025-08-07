

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { HelpTooltip } from '../../components';
import { useSubscriptionLifecycleData } from '../../hooks/useSubscriptionData';
import LifecycleMetricsCards from './lifecycle/LifecycleMetricsCards';
import AcquisitionFunnelChart from './lifecycle/AcquisitionFunnelChart';
import RetentionChart from './lifecycle/RetentionChart';
import ChurnReasonsCard from './lifecycle/ChurnReasonsCard';

const SubscriptionLifecycleTracker = () => {
  const { data: lifecycleData, isLoading, error } = useSubscriptionLifecycleData();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Subscription Lifecycle Tracker
            </CardTitle>
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !lifecycleData) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Subscription Lifecycle Tracker
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            Error loading lifecycle data
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use the correct property names from LifecycleData
  const { acquisitionFunnel, retentionCohorts, churnReasons } = lifecycleData;

  // Create mock conversion rates from the available data
  const conversionRates = {
    trialToSubscription: acquisitionFunnel[2]?.conversionRate || 25,
    retention: 78,
    churn: 22,
    renewal: 85
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-ocean-800 flex items-center gap-2">
          <Users className="h-6 w-6" />
          Subscription Lifecycle Tracker
        </h2>
        <HelpTooltip helpId="subscription-lifecycle" />
      </div>
      
      <LifecycleMetricsCards conversionRates={conversionRates} />
      <AcquisitionFunnelChart funnelData={acquisitionFunnel} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RetentionChart retentionData={retentionCohorts} />
        <ChurnReasonsCard churnReasons={churnReasons} />
      </div>
    </div>
  );
};

export default SubscriptionLifecycleTracker;
