import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Tooltip } from '@/shared/components/ui/tooltip'
import { Copy, Trash2, Package, DollarSign } from 'lucide-react'

export interface StandardProductCardData {
  id: string
  name: string
  sku?: string | null
  type?: string | null
  isActive?: boolean
  description?: string | null
  basePrice?: number | null
}

interface ProductCardProps {
  product: StandardProductCardData
  onClick?: (product: StandardProductCardData) => void
  onCopy?: (product: StandardProductCardData) => void
  onDelete?: (productId: string) => void
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onCopy,
  onDelete,
  className = ''
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${className}`}
      onClick={() => onClick?.(product)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-ocean-800 truncate max-w-[220px]">
                {product.name}
              </CardTitle>
              {(product.sku || product.type) && (
                <p className="text-xs text-gray-600">
                  {product.type ? `${product.type}` : ''}
                  {product.type && product.sku ? ' • ' : ''}
                  {product.sku ? `SKU: ${product.sku}` : ''}
                </p>
              )}
            </div>
          </div>

          {/* Standard actions: Copy and Delete */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Tooltip content="Copy" theme="default">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => onCopy?.(product)}
                title="Copy"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete" theme="default">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete?.(product.id)}
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm">
          <div className={`px-2 py-1 text-xs font-medium rounded-md ${
            product.isActive === false
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {product.isActive === false ? 'Inactive' : 'Active'}
          </div>
          {typeof product.basePrice === 'number' && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-gray-400" />
              <span className="font-medium text-gray-900">{product.basePrice.toFixed(2)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard


