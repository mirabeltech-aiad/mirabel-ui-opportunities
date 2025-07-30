
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { revenueService } from '../services/revenueService';
import { useProductFilter } from '../contexts/ProductFilterContext';
import type { 
  RevenueMetrics, 
  AcquisitionChannelRevenue, 
  SubscriptionTypeRevenue, 
  GeographicRevenue, 
  RevenueAttribution 
} from '../types/revenue';

export const useRevenueOverview = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery<RevenueMetrics>({
    queryKey: ['revenue-overview', productIds, businessUnitIds],
    queryFn: () => revenueService.getRevenueMetrics(productIds, businessUnitIds),
    staleTime: 8 * 60 * 1000,
    gcTime: 12 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useRevenueMetrics = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery<RevenueMetrics>({
    queryKey: ['revenue-metrics', productIds, businessUnitIds],
    queryFn: () => revenueService.getRevenueMetrics(productIds, businessUnitIds),
    staleTime: 8 * 60 * 1000,
    gcTime: 12 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useAcquisitionChannelRevenue = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery<AcquisitionChannelRevenue[]>({
    queryKey: ['acquisition-channel-revenue', productIds, businessUnitIds],
    queryFn: () => revenueService.getAcquisitionChannelRevenue(productIds, businessUnitIds),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useSubscriptionTypeRevenue = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery<SubscriptionTypeRevenue>({
    queryKey: ['subscription-type-revenue', productIds, businessUnitIds],
    queryFn: () => revenueService.getSubscriptionTypeRevenue(productIds, businessUnitIds),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useGeographicRevenue = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery<GeographicRevenue>({
    queryKey: ['geographic-revenue', productIds, businessUnitIds],
    queryFn: async () => {
      console.log('useGeographicRevenue - fetching data with productIds:', productIds, 'businessUnitIds:', businessUnitIds);
      const result = await revenueService.getGeographicRevenue(productIds, businessUnitIds);
      console.log('useGeographicRevenue - result:', result);
      return result;
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useRevenueAttribution = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery<RevenueAttribution>({
    queryKey: ['revenue-attribution', productIds, businessUnitIds],
    queryFn: () => revenueService.getRevenueAttribution(productIds, businessUnitIds),
    staleTime: 12 * 60 * 1000,
    gcTime: 18 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};
