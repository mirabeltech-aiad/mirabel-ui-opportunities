import { useProductFilter } from '../contexts/ProductFilterContext';

export interface CirculationData {
  total: number;
  print: number;
  digital: number;
  productBreakdown?: {
    productId: string;
    total: number;
    print: number;
    digital: number;
  }[];
}

export const useFilteredCirculationData = () => {
  const { selectedProducts, isAllProductsSelected, products } = useProductFilter();

  // Mock data with product breakdown - in real implementation, this would come from your API
  const rawData: CirculationData = {
    total: 125670,
    print: 78420,
    digital: 47250,
    productBreakdown: [
      { productId: 'daily-herald', total: 45000, print: 30000, digital: 15000 },
      { productId: 'business-weekly', total: 25000, print: 25000, digital: 0 },
      { productId: 'tech-digest', total: 20000, print: 0, digital: 20000 },
      { productId: 'lifestyle-magazine', total: 22000, print: 15000, digital: 7000 },
      { productId: 'sports-tribune', total: 13670, print: 8420, digital: 5250 },
    ]
  };

  const getFilteredData = (): CirculationData => {
    if (isAllProductsSelected) {
      return rawData;
    }

    const filteredBreakdown = rawData.productBreakdown?.filter(
      item => selectedProducts.includes(item.productId)
    ) || [];

    const totals = filteredBreakdown.reduce(
      (acc, item) => ({
        total: acc.total + item.total,
        print: acc.print + item.print,
        digital: acc.digital + item.digital,
      }),
      { total: 0, print: 0, digital: 0 }
    );

    return {
      ...totals,
      productBreakdown: filteredBreakdown,
    };
  };

  const getGrowthData = () => {
    // Mock growth data that would be filtered based on selected products
    const baseGrowthData = [
      { month: 'Jan', total: 118500, print: 82000, digital: 36500 },
      { month: 'Feb', total: 120200, print: 81500, digital: 38700 },
      { month: 'Mar', total: 121800, print: 80800, digital: 41000 },
      { month: 'Apr', total: 123400, print: 79900, digital: 43500 },
      { month: 'May', total: 124600, print: 79200, digital: 45400 },
      { month: 'Jun', total: 125670, print: 78420, digital: 47250 },
    ];

    if (isAllProductsSelected) {
      return baseGrowthData;
    }

    // Apply filtering logic based on selected products
    // This is simplified - in reality, you'd have product-specific historical data
    const filterRatio = selectedProducts.length / products.length;
    return baseGrowthData.map(month => ({
      ...month,
      total: Math.round(month.total * filterRatio),
      print: Math.round(month.print * filterRatio),
      digital: Math.round(month.digital * filterRatio),
    }));
  };

  return {
    filteredData: getFilteredData(),
    filteredGrowthData: getGrowthData(),
    selectedProductNames: isAllProductsSelected 
      ? 'All Products' 
      : selectedProducts.map(id => products.find(p => p.id === id)?.name).join(', '),
  };
};
