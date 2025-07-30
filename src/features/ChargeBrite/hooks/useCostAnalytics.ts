
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { costAnalyticsService } from '@/services/costAnalyticsService';
import { useProductFilter } from '@/contexts/ProductFilterContext';

export const useCostMetrics = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery({
    queryKey: ['cost-metrics', productIds, businessUnitIds],
    queryFn: () => costAnalyticsService.getCostMetrics(productIds, businessUnitIds),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,    // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useAcquisitionCosts = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery({
    queryKey: ['acquisition-costs', productIds, businessUnitIds],
    queryFn: () => costAnalyticsService.getAcquisitionCosts(productIds, businessUnitIds),
    staleTime: 12 * 60 * 1000, // 12 minutes - cost data changes less frequently
    gcTime: 18 * 60 * 1000,    // 18 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useDeliveryExpenses = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery({
    queryKey: ['delivery-expenses', productIds, businessUnitIds],
    queryFn: () => costAnalyticsService.getDeliveryExpenses(productIds, businessUnitIds),
    staleTime: 15 * 60 * 1000, // 15 minutes - delivery costs are relatively stable
    gcTime: 20 * 60 * 1000,    // 20 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useSubscriberProfitability = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery({
    queryKey: ['subscriber-profitability', productIds, businessUnitIds],
    queryFn: () => costAnalyticsService.getSubscriberProfitability(productIds, businessUnitIds),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,    // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useCostBreakdown = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery({
    queryKey: ['cost-breakdown', productIds, businessUnitIds],
    queryFn: () => costAnalyticsService.getCostBreakdown(productIds, businessUnitIds),
    staleTime: 12 * 60 * 1000, // 12 minutes
    gcTime: 18 * 60 * 1000,    // 18 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};
