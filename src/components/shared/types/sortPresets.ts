export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

export interface SortPreset {
  id: string
  label: string
  sortConfig: SortConfig[]
}

export const SORT_PRESETS: SortPreset[] = [
  { id: 'default', label: 'Default', sortConfig: [] },
  { id: 'newest', label: 'Newest First', sortConfig: [{ field: 'createdAt', direction: 'desc' }] },
  { id: 'oldest', label: 'Oldest First', sortConfig: [{ field: 'createdAt', direction: 'asc' }] },
  { id: 'alphabetical', label: 'A-Z', sortConfig: [{ field: 'name', direction: 'asc' }] },
  { id: 'price-low', label: 'Price: Low to High', sortConfig: [{ field: 'price', direction: 'asc' }] },
  { id: 'price-high', label: 'Price: High to Low', sortConfig: [{ field: 'price', direction: 'desc' }] }
]