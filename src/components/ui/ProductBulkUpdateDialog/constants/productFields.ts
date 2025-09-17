/**
 * Product field definitions for bulk update operations
 */

export interface FieldOperation {
  value: string
  label: string
}

export interface ProductFieldDefinition {
  key: string
  label: string
  type: 'advanced-text' | 'number' | 'select' | 'multi-select'
  operations?: FieldOperation[]
  options?: (string | { value: any; label: string })[]
}

export const PRODUCT_FIELDS: ProductFieldDefinition[] = [
  // Product Name Field - Enhanced with text operations
  { 
    key: 'name', 
    label: 'Product Name', 
    type: 'advanced-text',
    operations: [
      { value: 'set', label: 'Set to' },
      { value: 'prepend', label: 'Prepend text' },
      { value: 'append', label: 'Append text' },
      { value: 'find-replace', label: 'Find & Replace' },
      { value: 'uppercase', label: 'Convert to UPPERCASE' },
      { value: 'lowercase', label: 'Convert to lowercase' },
      { value: 'title-case', label: 'Convert to Title Case' },
      { value: 'trim', label: 'Trim whitespace' }
    ]
  },
  
  // Description Field
  { 
    key: 'description', 
    label: 'Description', 
    type: 'advanced-text',
    operations: [
      { value: 'set', label: 'Set to' },
      { value: 'prepend', label: 'Prepend text' },
      { value: 'append', label: 'Append text' },
      { value: 'find-replace', label: 'Find & Replace' },
      { value: 'clear', label: 'Clear description' }
    ]
  },
  
  // Category Field
  { 
    key: 'category', 
    label: 'Category', 
    type: 'select',
    options: [
      'Marketing Materials',
      'Business Cards',
      'Brochures',
      'Flyers',
      'Posters',
      'Banners',
      'Stationery',
      'Letterheads',
      'Envelopes',
      'Catalogs',
      'Magazines',
      'Books',
      'Packaging',
      'Labels',
      'Signage'
    ]
  },
  
  // Product Type Field
  { 
    key: 'type', 
    label: 'Product Type', 
    type: 'select',
    options: [
      { value: 'magazine', label: 'Magazine' },
      { value: 'book', label: 'Book' },
      { value: 'brochure', label: 'Brochure' },
      { value: 'flyer', label: 'Flyer' },
      { value: 'poster', label: 'Poster' },
      { value: 'banner', label: 'Banner' },
      { value: 'business_card', label: 'Business Card' },
      { value: 'letterhead', label: 'Letterhead' },
      { value: 'envelope', label: 'Envelope' },
      { value: 'catalog', label: 'Catalog' },
      { value: 'packaging', label: 'Packaging' },
      { value: 'label', label: 'Label' },
      { value: 'signage', label: 'Signage' },
      { value: 'other', label: 'Other' }
    ]
  },
  
  // SKU Field
  { 
    key: 'sku', 
    label: 'SKU', 
    type: 'advanced-text',
    operations: [
      { value: 'set', label: 'Set to' },
      { value: 'prepend', label: 'Prepend text' },
      { value: 'append', label: 'Append text' },
      { value: 'find-replace', label: 'Find & Replace' },
      { value: 'uppercase', label: 'Convert to UPPERCASE' },
      { value: 'clear', label: 'Clear SKU' }
    ]
  },
  
  // Base Price Field
  { 
    key: 'basePrice', 
    label: 'Base Price', 
    type: 'number',
    operations: [
      { value: 'set', label: 'Set to' },
      { value: 'increase', label: 'Increase by amount' },
      { value: 'decrease', label: 'Decrease by amount' },
      { value: 'multiply', label: 'Multiply by factor' },
      { value: 'percentage', label: 'Increase/decrease by %' }
    ]
  },
  
  // Status Field
  { 
    key: 'isActive', 
    label: 'Status', 
    type: 'select',
    options: [
      { value: true, label: 'Active' },
      { value: false, label: 'Inactive' }
    ]
  },
  
  // Tags Field
  { 
    key: 'tags', 
    label: 'Tags', 
    type: 'multi-select',
    operations: [
      { value: 'set', label: 'Set tags to' },
      { value: 'add', label: 'Add tags' },
      { value: 'remove', label: 'Remove tags' },
      { value: 'clear', label: 'Clear all tags' }
    ],
    options: [
      'premium',
      'featured',
      'bestseller',
      'new',
      'sale',
      'limited',
      'custom',
      'standard',
      'digital',
      'print',
      'eco-friendly',
      'rush',
      'bulk',
      'seasonal'
    ]
  }
]