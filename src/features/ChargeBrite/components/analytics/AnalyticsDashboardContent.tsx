
import { useState, useCallback } from 'react';
import AnalyticsFilters from './AnalyticsFilters';
import AnalyticsTabNavigation from './AnalyticsTabNavigation';
import AnalyticsOverviewCards from './AnalyticsOverviewCards';
import AnalyticsKeyInsights from './AnalyticsKeyInsights';
import SubscriberDemographics from './SubscriberDemographics';
import BehavioralSegmentation from './BehavioralSegmentation';
import ChurnPredictionModel from './ChurnPredictionModel';
import LifetimeValueAnalysis from './LifetimeValueAnalysis';
import EngagementScoring from './EngagementScoring';
import AcquisitionCostsAnalysis from './AcquisitionCostsAnalysis';
import CostAnalyticsOverview from './CostAnalyticsOverview';
import DeliveryExpensesAnalysis from './DeliveryExpensesAnalysis';
import SubscriberProfitabilityAnalysis from './SubscriberProfitabilityAnalysis';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AnalyticsOverview } from '@/types/analytics';

const AnalyticsDashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  const handleDateRangeChange = useCallback((startDate?: Date, endDate?: Date) => {
    setDateRange({
      startDate,
      endDate
    });
  }, []);

  // Mock overview data
  const mockOverview: AnalyticsOverview = {
    totalSubscribers: 12847,
    averageLTV: 2450,
    overallEngagementScore: 78,
    churnRisk: {
      low: 8945,
      medium: 2876,
      high: 884,
      critical: 142
    },
    topPerformingSegments: [
      'Premium Digital Subscribers',
      'Long-term Print + Digital',
      'Young Professional Segment'
    ],
    keyInsights: [
      'Digital engagement up 23% this quarter',
      'Premium subscribers show 40% higher retention',
      'Mobile app usage correlates with lower churn risk'
    ]
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ocean-800 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Advanced analytics and insights for subscriber behavior, profitability, and business intelligence
        </p>
      </div>

      <AnalyticsFilters 
        dateRange={dateRange} 
        onDateRangeChange={handleDateRangeChange} 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <AnalyticsTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <TabsContent value="overview" className="space-y-8">
          <AnalyticsOverviewCards overview={mockOverview} />
          <AnalyticsKeyInsights overview={mockOverview} />
        </TabsContent>
        
        <TabsContent value="demographics" className="space-y-8">
          <SubscriberDemographics />
          <BehavioralSegmentation />
        </TabsContent>
        
        <TabsContent value="predictive" className="space-y-8">
          <ChurnPredictionModel />
          <LifetimeValueAnalysis />
          <EngagementScoring />
        </TabsContent>
        
        <TabsContent value="costs" className="space-y-8">
          <CostAnalyticsOverview />
          <AcquisitionCostsAnalysis />
          <DeliveryExpensesAnalysis />
          <SubscriberProfitabilityAnalysis />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default AnalyticsDashboardContent;
