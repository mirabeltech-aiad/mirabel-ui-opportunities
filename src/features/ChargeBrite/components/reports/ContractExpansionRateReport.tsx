
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, MapPin, Building, Users } from 'lucide-react';
import { HelpTooltip } from '@/components';
import ExpansionMetricsCards from './contract-expansion/ExpansionMetricsCards';
import ExpansionTrendChart from './contract-expansion/ExpansionTrendChart';
import ExpansionDistributionChart from './contract-expansion/ExpansionDistributionChart';
import ContractSizeAnalysis from './contract-expansion/ContractSizeAnalysis';
import RenewalOutcomesChart from './contract-expansion/RenewalOutcomesChart';
import ContractRenewalsTable from './contract-expansion/ContractRenewalsTable';
import ExpansionDriversTable from './contract-expansion/ExpansionDriversTable';
import ExpansionPatternAnalysis from './contract-expansion/ExpansionPatternAnalysis';
import RevenueImpactMetrics from './contract-expansion/RevenueImpactMetrics';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';

interface ContractExpansionRateReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const ContractExpansionRateReport: React.FC<ContractExpansionRateReportProps> = ({ dateRange, selectedPeriod }) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real Contract Expansion data from Supabase
  const { data: expansionData, isLoading, error } = useQuery({
    queryKey: ['contract-expansion-rate', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getContractExpansionRateData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading Contract Expansion Rate data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading Contract Expansion Rate data</div>;
  }

  const {
    metrics = {},
    trendData = [],
    expansionDistribution = [],
    contractSizeBuckets = [],
    renewalOutcomes = [],
    contractRenewals = [],
    expansionDrivers = [],
    geographicExpansion = [],
    customerSegmentExpansion = [],
    tenureExpansion = [],
    predictiveIndicators = []
  } = expansionData || {};

  return (
    <div className="space-y-6">
      {/* Key Metrics Dashboard */}
      <ExpansionMetricsCards metrics={metrics} />

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpansionTrendChart data={trendData} />
        <ExpansionDistributionChart data={expansionDistribution} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContractSizeAnalysis data={contractSizeBuckets} />
        <RenewalOutcomesChart data={renewalOutcomes} />
      </div>

      {/* Revenue Impact */}
      <RevenueImpactMetrics metrics={metrics} />

      {/* Detailed Analysis */}
      <Tabs defaultValue="renewals" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50">
          <TabsTrigger value="renewals" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Contract Renewals</TabsTrigger>
          <TabsTrigger value="drivers" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Expansion Drivers</TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Pattern Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="renewals" className="space-y-6">
          <ContractRenewalsTable data={contractRenewals} />
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          <ExpansionDriversTable data={expansionDrivers} />
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <ExpansionPatternAnalysis segmentData={customerSegmentExpansion} tenureData={tenureExpansion} predictiveIndicators={predictiveIndicators} />
        </TabsContent>
      </Tabs>

      {/* Geographic Analysis Summary */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-ocean-800">Geographic Expansion Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {geographicExpansion.map((region, index) => {
            const configs = [
              { 
                color: 'text-red-600', 
                iconColor: 'text-red-500', 
                bgColor: 'bg-red-50',
                icon: Globe,
                subtitle: 'text-red-300',
                helpId: 'geographic-expansion-north-america'
              },
              { 
                color: 'text-orange-600', 
                iconColor: 'text-orange-500', 
                bgColor: 'bg-orange-50',
                icon: MapPin,
                subtitle: 'text-orange-300',
                helpId: 'geographic-expansion-europe'
              },
              { 
                color: 'text-green-600', 
                iconColor: 'text-green-500', 
                bgColor: 'bg-green-50',
                icon: Building,
                subtitle: 'text-green-300',
                helpId: 'geographic-expansion-asia-pacific'
              },
              { 
                color: 'text-purple-600', 
                iconColor: 'text-purple-500', 
                bgColor: 'bg-purple-50',
                icon: Users,
                subtitle: 'text-purple-300',
                helpId: 'geographic-expansion-other'
              }
            ];
            const config = configs[index % configs.length];
            const IconComponent = config.icon;
            
            return (
              <Card key={region.region} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center">
                    <CardTitle className="text-sm font-medium text-ocean-800">{region.region}</CardTitle>
                    <HelpTooltip helpId={config.helpId} />
                  </div>
                  <IconComponent className={`h-4 w-4 ${config.iconColor}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${config.color} mb-1`}>{region.expansionRate}%</div>
                  <p className={`text-xs ${config.subtitle} mb-1`}>{region.totalRenewals} renewals</p>
                  <p className={`text-xs ${config.subtitle}`}>Avg: {region.averageExpansion}%</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Key Insights Summary */}
      <div className="bg-ocean-50 p-6 rounded-lg border border-ocean-200">
        <h3 className="text-lg font-semibold mb-4 text-ocean-800">Key Insights &amp; Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3 text-ocean-800">Performance Highlights</h4>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• Enterprise contracts show 51.2% expansion rate</li>
              <li>• Customers with 24+ months tenure expand at 48.3% rate</li>
              <li>• Higher tier upgrades drive 52.3% average expansion</li>
              <li>• Health score &gt;80 correlates with 83% expansion likelihood</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-ocean-800">Action Items</h4>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• Focus expansion efforts on Mid-Market and Enterprise segments</li>
              <li>• Implement usage growth monitoring for early expansion signals</li>
              <li>• Develop tenure-based expansion campaigns</li>
              <li>• Enhance customer success programs to improve health scores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractExpansionRateReport;
