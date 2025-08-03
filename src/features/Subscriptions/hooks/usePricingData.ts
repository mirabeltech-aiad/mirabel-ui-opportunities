
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { pricingService } from '@/services/pricingService';
import { useProductFilter } from '@/contexts/ProductFilterContext';

export const usePricingMetrics = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery({
    queryKey: ['pricing-metrics', productIds, businessUnitIds],
    queryFn: () => pricingService.getPricingMetrics(productIds, businessUnitIds),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,    // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useABTestingData = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery({
    queryKey: ['ab-testing-data', productIds, businessUnitIds],
    queryFn: () => pricingService.getABTestingData(productIds, businessUnitIds),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,    // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const usePriceElasticityData = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery({
    queryKey: ['price-elasticity-data', productIds, businessUnitIds],
    queryFn: () => pricingService.getPriceElasticityData(productIds, businessUnitIds),
    staleTime: 15 * 60 * 1000, // 15 minutes - less frequently updated
    gcTime: 20 * 60 * 1000,    // 20 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const useOptimizationSuggestions = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery({
    queryKey: ['optimization-suggestions', productIds, businessUnitIds],
    queryFn: () => pricingService.getOptimizationSuggestions(productIds, businessUnitIds),
    staleTime: 15 * 60 * 1000, // 15 minutes - suggestions change less frequently
    gcTime: 20 * 60 * 1000,    // 20 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};

export const usePricingSegmentData = () => {
  const { selectedProducts, selectedBusinessUnits, isAllProductsSelected, isAllBusinessUnitsSelected } = useProductFilter();
  
  const productIds = isAllProductsSelected ? undefined : selectedProducts;
  const businessUnitIds = isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits;
  
  return useQuery({
    queryKey: ['pricing-segment-data', productIds, businessUnitIds],
    queryFn: () => pricingService.getPricingSegmentData(productIds, businessUnitIds),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,    // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
};
