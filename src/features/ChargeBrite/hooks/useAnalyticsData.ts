
import { useProductFilter } from '@/contexts/ProductFilterContext';
import { analyticsService } from '@/services/analyticsService';
import { useDeferredQuery } from './useDeferredQuery';

export const useSubscriberDemographics = (defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['subscriber-demographics', productIds, businessUnitIds],
    () => analyticsService.getDemographics(productIds, businessUnitIds),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};

export const useBehavioralSegments = (defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['behavioral-segments', productIds, businessUnitIds],
    () => analyticsService.getBehavioralSegments(productIds, businessUnitIds),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};

export const useLifetimeValues = (defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['lifetime-values', productIds, businessUnitIds],
    () => analyticsService.getLifetimeValues(productIds, businessUnitIds),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};

export const useEngagementMetrics = (defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['engagement-metrics', productIds, businessUnitIds],
    () => analyticsService.getEngagementMetrics(productIds, businessUnitIds),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};

export const useChurnPredictions = (defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['churn-predictions', productIds, businessUnitIds],
    () => analyticsService.getChurnPredictions(productIds, businessUnitIds),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};

export const useAnalyticsOverview = (defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['analytics-overview', productIds, businessUnitIds],
    () => analyticsService.getAnalyticsOverview(productIds, businessUnitIds),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};
