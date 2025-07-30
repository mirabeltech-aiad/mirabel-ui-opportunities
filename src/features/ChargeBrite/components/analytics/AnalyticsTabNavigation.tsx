

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsOverview } from '@/types/analytics';
import SubscriberDemographics from './SubscriberDemographics';
import BehavioralSegmentation from './BehavioralSegmentation';
import LifetimeValueAnalysis from './LifetimeValueAnalysis';
import EngagementScoring from './EngagementScoring';
import ChurnPredictionModel from './ChurnPredictionModel';
import AcquisitionCostsAnalysis from './AcquisitionCostsAnalysis';
import DeliveryExpensesAnalysis from './DeliveryExpensesAnalysis';
import SubscriberProfitabilityAnalysis from './SubscriberProfitabilityAnalysis';
import AnalyticsOverviewCards from './AnalyticsOverviewCards';
import CostAnalyticsOverview from './CostAnalyticsOverview';
import AnalyticsKeyInsights from './AnalyticsKeyInsights';

interface AnalyticsTabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  overview?: AnalyticsOverview;
}

const AnalyticsTabNavigation: React.FC<AnalyticsTabNavigationProps> = ({ activeTab, onTabChange, overview }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="bg-blue-50 w-full justify-start rounded-md">
        <TabsTrigger value="overview" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
          Overview
        </TabsTrigger>
        
        <TabsTrigger value="demographics" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
          Demographics
        </TabsTrigger>
        
        <TabsTrigger value="segmentation" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
          Segmentation
        </TabsTrigger>
        
        <TabsTrigger value="lifetime-value" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
          Lifetime Value
        </TabsTrigger>
        
        <TabsTrigger value="engagement" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
          Engagement
        </TabsTrigger>
        
        <TabsTrigger value="churn-prediction" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
          Churn Prediction
        </TabsTrigger>
        
        <TabsTrigger value="acquisition-costs" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
          Acquisition Costs
        </TabsTrigger>
        
        <TabsTrigger value="delivery-expenses" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
          Delivery Costs
        </TabsTrigger>
        
        <TabsTrigger value="profitability" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
          Profitability
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6 space-y-6">
        {/* Overview Cards */}
        {overview && <AnalyticsOverviewCards overview={overview} />}

        {/* Cost Analytics Overview */}
        <CostAnalyticsOverview />

        {/* Key Insights */}
        {overview && <AnalyticsKeyInsights overview={overview} />}
      </TabsContent>
      
      <TabsContent value="demographics" className="mt-6">
        <SubscriberDemographics />
      </TabsContent>
      
      <TabsContent value="segmentation" className="mt-6">
        <BehavioralSegmentation />
      </TabsContent>
      
      <TabsContent value="lifetime-value" className="mt-6">
        <LifetimeValueAnalysis />
      </TabsContent>
      
      <TabsContent value="engagement" className="mt-6">
        <EngagementScoring />
      </TabsContent>
      
      <TabsContent value="churn-prediction" className="mt-6">
        <ChurnPredictionModel />
      </TabsContent>
      
      <TabsContent value="acquisition-costs" className="mt-6">
        <AcquisitionCostsAnalysis />
      </TabsContent>
      
      <TabsContent value="delivery-expenses" className="mt-6">
        <DeliveryExpensesAnalysis />
      </TabsContent>
      
      <TabsContent value="profitability" className="mt-6">
        <SubscriberProfitabilityAnalysis />
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTabNavigation;
