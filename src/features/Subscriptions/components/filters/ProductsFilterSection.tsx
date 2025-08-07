
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { Product } from '@/contexts/ProductFilterContext';

interface ProductsFilterSectionProps {
  products: Product[];
  selectedProducts: string[];
  isAllProductsSelected: boolean;
  toggleProduct: (productId: string) => void;
  selectAllProducts: () => void;
}

const ProductsFilterSection: React.FC<ProductsFilterSectionProps> = ({
  products,
  selectedProducts,
  isAllProductsSelected,
  toggleProduct,
  selectAllProducts
}) => {
  return (
    <div className="border-r border-gray-300">
      <Select
        value={isAllProductsSelected ? 'all' : 'custom'}
        onValueChange={(value) => {
          if (value === 'all') {
            selectAllProducts();
          }
        }}
      >
        <SelectTrigger className="w-[130px] h-11 rounded-none border-0 focus:ring-0 focus:ring-offset-0 bg-white hover:bg-gray-50">
          <SelectValue>
            {isAllProductsSelected ? 'All Products' : `${selectedProducts.length} Selected`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
          <SelectItem value="all">All Products</SelectItem>
          {products.map((product) => (
            <SelectItem 
              key={product.id}
              value={product.id}
              onClick={() => toggleProduct(product.id)}
            >
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

    </div>
  );
};

export default ProductsFilterSection;
