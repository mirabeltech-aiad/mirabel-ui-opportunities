import { useProductFilter } from '../contexts/ProductFilterContext';
import { subscriptionService } from '../services/subscriptionService';
import { useDeferredQuery } from './useDeferredQuery';

export const useSubscriptionMetrics = (dateRange?: { startDate?: Date; endDate?: Date }, defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['subscription-metrics', productIds, businessUnitIds, dateRange],
    () => subscriptionService.getMetrics(productIds, businessUnitIds, dateRange),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};

export const useSubscriptionGrowthData = (dateRange?: { startDate?: Date; endDate?: Date }, defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['subscription-growth', productIds, businessUnitIds, dateRange],
    () => subscriptionService.getGrowthData(productIds, businessUnitIds, dateRange),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};

export const useSubscriptionChurnData = (dateRange?: { startDate?: Date; endDate?: Date }, defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['subscription-churn', productIds, businessUnitIds, dateRange],
    () => subscriptionService.getChurnData(productIds, businessUnitIds, dateRange),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};

export const useSubscriptionGeographicData = (dateRange?: { startDate?: Date; endDate?: Date }, defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['subscription-geographic', productIds, businessUnitIds, dateRange],
    () => subscriptionService.getGeographicData(productIds, businessUnitIds, dateRange),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};

export const useSubscriptionLifecycleData = (dateRange?: { startDate?: Date; endDate?: Date }, defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['subscription-lifecycle', productIds, businessUnitIds, dateRange],
    () => subscriptionService.getLifecycleData(productIds, businessUnitIds, dateRange),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};

export const useSubscriptions = (filters?: { status?: string }, dateRange?: { startDate?: Date; endDate?: Date }, defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['subscriptions', productIds, businessUnitIds, filters, dateRange],
    () => subscriptionService.getSubscriptions({ 
      productIds,
      businessUnitIds,
      dateRange,
      ...filters 
    }),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};

export const useSubscriptionAcquisitionData = (dateRange?: { startDate?: Date; endDate?: Date }, defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['subscription-acquisition', productIds, businessUnitIds, dateRange],
    () => subscriptionService.getAcquisitionData(productIds, businessUnitIds, dateRange),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};

export const useDigitalEngagementData = (dateRange?: { startDate?: Date; endDate?: Date }, defer = false) => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useDeferredQuery(
    ['digital-engagement', productIds, businessUnitIds, dateRange],
    () => subscriptionService.getDigitalEngagementData(productIds, businessUnitIds, dateRange),
    { staleTime: 5 * 60 * 1000 },
    defer
  );
};
