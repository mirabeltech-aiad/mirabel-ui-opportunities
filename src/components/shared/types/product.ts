// Product type definitions for database integration

export enum ProductType {
  DIGITAL = 'DIGITAL',
  PRINT = 'PRINT',
  SERVICE = 'SERVICE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  EVENT = 'EVENT',
  EDITORIAL = 'EDITORIAL'
}

export interface Product {
  id: string
  organizationId: string
  name: string
  description?: string
  type: ProductType
  sku?: string
  category?: string
  subcategory?: string
  tags: string[]
  isActive: boolean
  isFeatured: boolean
  basePrice?: number
  currency?: string
  pricingModel?: string
  billingCycle?: string
  createdAt: string
  updatedAt: string
  files?: ProductFile[]
  // Print-specific fields
  printSpecs?: PrintSpecifications
  showInDigitalStudio?: boolean
  // Service-specific fields
  primaryVendor?: string
}

export interface PrintSpecifications {
  pageSize: {
    width: number
    height: number
    unit: 'inches' | 'mm' | 'cm' | 'points'
  }
  pageMargins?: {
    enabled: boolean
    left: number
    top: number
    right: number
    bottom: number
  }
  liveArea?: {
    width: number
    height: number
  }
  liveAreaMargins?: {
    top: number
    bottom: number
  }
  pageBleed?: number
}

export interface ProductFile {
  id: string
  productId: string
  filename: string
  originalName: string
  fileSize: number
  mimeType: string
  filePath: string
  createdAt: string
}

// API Request/Response types
export interface CreateProductRequest {
  name: string
  description?: string
  type: ProductType
  sku?: string
  category?: string
  subcategory?: string
  tags?: string[]
  // Associations
  rateCardIds?: string[]
  isActive?: boolean
  isFeatured?: boolean
  basePrice?: number
  currency?: string
  pricingModel?: string
  billingCycle?: string
  printSpecs?: PrintSpecifications
  organizationId?: string
  showInDigitalStudio?: boolean
  // Service-specific fields
  primaryVendor?: string
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id?: string
}

export interface ProductsQuery {
  page?: number
  limit?: number
  type?: ProductType | 'all'
  types?: ProductType[]
  status?: 'active' | 'inactive' | 'all'
  search?: string
  category?: string | 'all'
  categories?: string[]
  organizationId?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  isActive?: boolean
  featured?: boolean
  priceMin?: number
  priceMax?: number
  dateFrom?: string
  dateTo?: string
  tags?: string[]
}

export interface ProductsResponse {
  products: Product[]
  totalCount: number
  page: number
  limit: number
  hasMore: boolean
}

export interface BulkOperationResult {
  success: boolean
  successCount: number
  failureCount: number
  successfulIds: string[]
  errors: Array<{
    productId: string
    error: string
  }>
}

export interface ProductsStats {
  totalProducts: number
  activeProducts: number
  featuredProducts: number
  uniqueTypes: number
  uniqueCategories: number
  averagePrice: number
  minPrice: number
  maxPrice: number
}

export interface ProductTypeBreakdown {
  type: ProductType
  count: number
  activeCount: number
  averagePrice: number
}

export interface ProductCategoryBreakdown {
  category: string
  count: number
  activeCount: number
  averagePrice: number
}

// Error types
export interface ApiError {
  message: string
  code: string
  details?: Record<string, any>
}

export interface ValidationError extends ApiError {
  field?: string
  details: Record<string, string>
}

// Search options
export interface SearchOptions {
  organizationId?: string
  limit?: number
  includeInactive?: boolean
}

// Recent products options
export interface RecentProductsOptions {
  organizationId?: string
  limit?: number
  days?: number
}

// Bulk operation requests
export interface BulkDeleteRequest {
  productIds: string[]
}

export interface BulkStatusUpdateRequest {
  productIds: string[]
  isActive: boolean
}

// Form data types (for frontend)
export interface ProductFormData {
  name: string
  productCode: string
  description: string
  productType: ProductType
  category: string
  isActive: boolean
  circulation?: string
  schedule: string
  rateCardIds: string[]
  magazineIds: string[]
  features: string[]
  basePrice?: number
  currency?: string
  tags?: string[]
  targetAudience?: string[]
  contentType?: string
  eventDate?: string
  location?: string
  duration?: string
  serviceType?: string
  billingCycle?: string
  showInDigitalStudio?: boolean
  primaryVendor?: string
}

// Filter types for UI
export interface ProductFilters {
  type: string
  status: string
  search: string
  category?: string
}

// Export utility types
export type ProductSortField = 'name' | 'type' | 'category' | 'base_price' | 'created_at' | 'updated_at' | 'is_active'
export type SortOrder = 'asc' | 'desc'
export type ProductStatus = 'active' | 'inactive' | 'all'