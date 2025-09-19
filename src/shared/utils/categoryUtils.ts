/**
 * Category management utilities for column selector
 */

export interface CategoryInfo {
  key: string
  label: string
  description?: string
  icon?: React.ComponentType
  color?: string
  columnCount: number
  priority?: number
}

export interface CategoryGroup {
  name: string
  categories: CategoryInfo[]
  isExpanded?: boolean
}

/**
 * Analyze columns and extract category information
 */
export function analyzeCategoriesFromColumns<T extends { category?: string }>(
  columns: T[]
): CategoryInfo[] {
  const categoryMap = new Map<string, number>()
  
  // Count columns per category
  columns.forEach(column => {
    const category = column.category || 'uncategorized'
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
  })
  
  // Convert to CategoryInfo array
  const categories: CategoryInfo[] = []
  
  categoryMap.forEach((count, key) => {
    categories.push({
      key,
      label: formatCategoryLabel(key),
      columnCount: count,
      priority: getCategoryPriority(key)
    })
  })
  
  // Sort by priority and then by name
  categories.sort((a, b) => {
    const priorityDiff = (b.priority || 0) - (a.priority || 0)
    if (priorityDiff !== 0) return priorityDiff
    return a.label.localeCompare(b.label)
  })
  
  return categories
}

/**
 * Format category key into a readable label
 */
function formatCategoryLabel(categoryKey: string): string {
  if (categoryKey === 'uncategorized') return 'Other'
  
  return categoryKey
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Get priority for common category types
 */
function getCategoryPriority(categoryKey: string): number {
  const priorities: Record<string, number> = {
    'basic': 100,
    'general': 95,
    'info': 90,
    'identification': 85,
    'contact': 80,
    'pricing': 75,
    'financial': 70,
    'inventory': 65,
    'shipping': 60,
    'metadata': 55,
    'system': 50,
    'advanced': 45,
    'custom': 40,
    'uncategorized': 10
  }
  
  const lowerKey = categoryKey.toLowerCase()
  
  // Check for exact matches
  if (priorities[lowerKey]) {
    return priorities[lowerKey]
  }
  
  // Check for partial matches
  for (const [key, priority] of Object.entries(priorities)) {
    if (lowerKey.includes(key) || key.includes(lowerKey)) {
      return priority - 5 // Slightly lower priority for partial matches
    }
  }
  
  return 30 // Default priority
}

/**
 * Group categories into logical groups
 */
export function groupCategories(categories: CategoryInfo[]): CategoryGroup[] {
  const groups: CategoryGroup[] = [
    {
      name: 'Essential',
      categories: [],
      isExpanded: true
    },
    {
      name: 'Business',
      categories: [],
      isExpanded: true
    },
    {
      name: 'Technical',
      categories: [],
      isExpanded: false
    },
    {
      name: 'Other',
      categories: [],
      isExpanded: false
    }
  ]
  
  categories.forEach(category => {
    const lowerKey = category.key.toLowerCase()
    
    if (isEssentialCategory(lowerKey)) {
      groups[0].categories.push(category)
    } else if (isBusinessCategory(lowerKey)) {
      groups[1].categories.push(category)
    } else if (isTechnicalCategory(lowerKey)) {
      groups[2].categories.push(category)
    } else {
      groups[3].categories.push(category)
    }
  })
  
  // Remove empty groups
  return groups.filter(group => group.categories.length > 0)
}

function isEssentialCategory(key: string): boolean {
  const essentialKeywords = ['basic', 'general', 'info', 'identification', 'name', 'id']
  return essentialKeywords.some(keyword => key.includes(keyword))
}

function isBusinessCategory(key: string): boolean {
  const businessKeywords = ['pricing', 'financial', 'inventory', 'shipping', 'sales', 'marketing', 'contact']
  return businessKeywords.some(keyword => key.includes(keyword))
}

function isTechnicalCategory(key: string): boolean {
  const technicalKeywords = ['system', 'metadata', 'advanced', 'api', 'technical', 'config']
  return technicalKeywords.some(keyword => key.includes(keyword))
}

/**
 * Filter categories based on search term
 */
export function filterCategories(
  categories: CategoryInfo[],
  searchTerm: string
): CategoryInfo[] {
  if (!searchTerm.trim()) return categories
  
  const lowerSearch = searchTerm.toLowerCase()
  
  return categories.filter(category => 
    category.key.toLowerCase().includes(lowerSearch) ||
    category.label.toLowerCase().includes(lowerSearch) ||
    category.description?.toLowerCase().includes(lowerSearch)
  )
}

/**
 * Get category color based on category type
 */
export function getCategoryColor(categoryKey: string): string {
  const colorMap: Record<string, string> = {
    'basic': 'blue',
    'general': 'blue',
    'info': 'blue',
    'identification': 'indigo',
    'contact': 'green',
    'pricing': 'yellow',
    'financial': 'yellow',
    'inventory': 'purple',
    'shipping': 'orange',
    'metadata': 'gray',
    'system': 'gray',
    'advanced': 'red',
    'custom': 'pink',
    'uncategorized': 'gray'
  }
  
  const lowerKey = categoryKey.toLowerCase()
  
  // Check for exact matches
  if (colorMap[lowerKey]) {
    return colorMap[lowerKey]
  }
  
  // Check for partial matches
  for (const [key, color] of Object.entries(colorMap)) {
    if (lowerKey.includes(key)) {
      return color
    }
  }
  
  return 'gray' // Default color
}