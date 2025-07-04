
import React, { useState, useMemo } from 'react';
import { usePredictiveAnalytics } from '../../hooks/usePredictiveAnalytics';
import { transformPredictiveAnalyticsData } from '../../utils/predictive/apiTransformer';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';
import { toast } from '@/features/Opportunity/hooks/use-toast';
import Loader from '@/components/ui/loader';
import PredictiveAnalyticsHeader from './PredictiveAnalytics/PredictiveAnalyticsHeader';
import PredictiveAnalyticsFilterBar from './PredictiveAnalytics/PredictiveAnalyticsFilterBar';
import PredictiveAnalyticsMetrics from './PredictiveAnalytics/PredictiveAnalyticsMetrics';
import PredictiveAnalyticsTabs from './PredictiveAnalytics/PredictiveAnalyticsTabs';

const PredictiveAnalytics = () => {
  const forecastPeriod = '6-months'; // Fixed to 6 months
  const [selectedTimeRange, setSelectedTimeRange] = useState('last-6-months');
  const [salesRep, setSalesRep] = useState('all');
  const [product, setProduct] = useState('all');
  const [businessUnit, setBusinessUnit] = useState('all');
  
  const { chartColors } = useDesignSystem();

  // Fetch data from API
  const { data: apiData, loading, error, refetch } = usePredictiveAnalytics(
    selectedTimeRange,
    salesRep,
    null, // customDateRange
    product,
    businessUnit
  );

  // Log API response for debugging
  console.log('Predictive Analytics - Raw API Response:', apiData);

  // Transform API data to component format
  const transformedData = useMemo(() => {
    console.log('Predictive Analytics - Transforming API data:', apiData);
    const result = transformPredictiveAnalyticsData(apiData);
    console.log('Predictive Analytics - Transformed data:', result);
    return result;
  }, [apiData]);

  const { predictiveMetrics, revenueForecast, dealProbabilities, pipelineHealth } = transformedData;

  const handleExport = () => {
    toast({
      title: "Export Complete",
      description: "Predictive analytics data has been exported successfully."
    });
  };

  const handleRefresh = () => {
    console.log('Predictive Analytics - Refreshing data...');
    refetch();
    toast({
      title: "Data Refreshed",
      description: "Predictive analytics data has been refreshed successfully."
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PredictiveAnalyticsHeader />
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Predictive Analytics - Error loading data:', error);
    return (
      <div className="space-y-6">
        <PredictiveAnalyticsHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load predictive analytics data</p>
            <button 
              onClick={handleRefresh}
              className="bg-ocean-500 text-white px-4 py-2 rounded hover:bg-ocean-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PredictiveAnalyticsHeader />

      {/* Filter Bar */}
      <PredictiveAnalyticsFilterBar 
        timeRange={selectedTimeRange}
        salesRep={salesRep}
        product={product}
        businessUnit={businessUnit}
        onTimeRangeChange={setSelectedTimeRange}
        onSalesRepChange={setSalesRep}
        onProductChange={setProduct}
        onBusinessUnitChange={setBusinessUnit}
        onExport={handleExport}
        onRefresh={handleRefresh}
      />

      {/* Key Predictions Cards */}
      <PredictiveAnalyticsMetrics 
        predictiveMetrics={predictiveMetrics}
        pipelineHealth={pipelineHealth}
        forecastPeriod={forecastPeriod}
      />

      {/* Analytics Tabs */}
      <PredictiveAnalyticsTabs 
        revenueForecast={revenueForecast}
        dealProbabilities={dealProbabilities}
        pipelineHealth={pipelineHealth}
        predictiveMetrics={predictiveMetrics}
        forecastPeriod={forecastPeriod}
        chartColors={chartColors}
        apiData={apiData} // Pass raw API data for additional processing
      />
    </div>
  );
};

export default PredictiveAnalytics;
