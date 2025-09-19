/**
 * Column metadata and information utilities
 * Provides comprehensive column analysis and information display
 */

export interface ColumnStatistics {
  totalRows: number
  nullCount: number
  uniqueCount: number
  fillRate: number
  dataSize: number
  avgLength?: number
  minValue?: any
  maxValue?: any
  mostCommon?: Array<{ value: any; count: number }>
}

export interface ColumnUsageMetrics {
  viewCount: number
  lastViewed: Date
  avgViewDuration: number
  filterUsage: number
  sortUsage: number
  exportUsage: number
  importance: 'critical' | 'high' | 'medium' | 'low'
  trendDirection: 'increasing' | 'stable' | 'decreasing'
}

export interface ColumnRelationships {
  dependencies: Array<{
    columnKey: string
    type: 'foreign_key' | 'calculated' | 'derived' | 'lookup'
    strength: number
  }>
  dependents: Array<{
    columnKey: string
    type: 'foreign_key' | 'calculated' | 'derived' | 'lookup'
    strength: number
  }>
  correlations: Array<{
    columnKey: string
    coefficient: number
    type: 'positive' | 'negative' | 'none'
  }>
}

export interface ColumnPerformanceMetrics {
  indexStatus: 'indexed' | 'partial' | 'none'
  queryPerformance: 'fast' | 'medium' | 'slow'
  storageImpact: 'low' | 'medium' | 'high'
  networkImpact: 'low' | 'medium' | 'high'
  renderingCost: number
  estimatedWidth: number
}

export interface ColumnQualityMetrics {
  completeness: number
  consistency: number
  accuracy: number
  validity: number
  uniqueness: number
  timeliness: number
  overallScore: number
  issues: Array<{
    type: 'missing' | 'duplicate' | 'invalid' | 'inconsistent' | 'outdated'
    severity: 'low' | 'medium' | 'high' | 'critical'
    count: number
    description: string
  }>
}

export interface EnhancedColumnMetadata {
  // Basic information
  key: string
  title: string
  description?: string
  category?: string
  dataType: string
  
  // Extended metadata
  statistics?: ColumnStatistics
  usage?: ColumnUsageMetrics
  relationships?: ColumnRelationships
  performance?: ColumnPerformanceMetrics
  quality?: ColumnQualityMetrics
  
  // Display properties
  formatting?: {
    type: 'currency' | 'percentage' | 'date' | 'number' | 'text' | 'custom'
    pattern?: string
    locale?: string
    precision?: number
  }
  
  // Business context
  businessRules?: Array<{
    rule: string
    description: string
    severity: 'info' | 'warning' | 'error'
  }>
  
  // Documentation
  documentation?: {
    definition: string
    examples: string[]
    notes: string[]
    lastUpdated: Date
    author: string
  }
  
  // Compliance and governance
  governance?: {
    classification: 'public' | 'internal' | 'confidential' | 'restricted'
    retention: string
    compliance: string[]
    owner: string
    steward: string
  }
}

/**
 * Calculate column importance score
 */
export function calculateColumnImportance(metadata: EnhancedColumnMetadata): number {
  let score = 0
  
  // Usage metrics (40% weight)
  if (metadata.usage) {
    score += (metadata.usage.viewCount / 1000) * 10 // Max 10 points
    score += (metadata.usage.filterUsage / 100) * 5 // Max 5 points
    score += (metadata.usage.sortUsage / 100) * 5 // Max 5 points
    
    switch (metadata.usage.importance) {
      case 'critical': score += 20; break
      case 'high': score += 15; break
      case 'medium': score += 10; break
      case 'low': score += 5; break
    }
  }
  
  // Data quality (30% weight)
  if (metadata.quality) {
    score += (metadata.quality.overallScore / 100) * 30
  }
  
  // Business context (20% weight)
  if (metadata.businessRules) {
    score += Math.min(metadata.businessRules.length * 2, 10)
  }
  if (metadata.governance?.classification === 'restricted') score += 10
  
  // Relationships (10% weight)
  if (metadata.relationships) {
    score += Math.min(metadata.relationships.dependencies.length * 2, 5)
    score += Math.min(metadata.relationships.dependents.length * 2, 5)
  }
  
  return Math.min(Math.round(score), 100)
}

/**
 * Get column health status
 */
export function getColumnHealthStatus(metadata: EnhancedColumnMetadata): {
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  score: number
  issues: string[]
  recommendations: string[]
} {
  const issues: string[] = []
  const recommendations: string[] = []
  let score = 100
  
  // Check data quality
  if (metadata.quality) {
    if (metadata.quality.completeness < 0.9) {
      issues.push(`${Math.round((1 - metadata.quality.completeness) * 100)}% missing values`)
      recommendations.push('Consider data validation rules or default values')
      score -= (1 - metadata.quality.completeness) * 20
    }
    
    if (metadata.quality.consistency < 0.8) {
      issues.push('Inconsistent data formats detected')
      recommendations.push('Implement data standardization rules')
      score -= (1 - metadata.quality.consistency) * 15
    }
    
    if (metadata.quality.issues.length > 0) {
      const criticalIssues = metadata.quality.issues.filter(i => i.severity === 'critical')
      if (criticalIssues.length > 0) {
        issues.push(`${criticalIssues.length} critical data quality issues`)
        score -= criticalIssues.length * 10
      }
    }
  }
  
  // Check performance
  if (metadata.performance) {
    if (metadata.performance.queryPerformance === 'slow') {
      issues.push('Slow query performance')
      recommendations.push('Consider adding database indexes')
      score -= 10
    }
    
    if (metadata.performance.storageImpact === 'high') {
      issues.push('High storage impact')
      recommendations.push('Consider data archiving or compression')
      score -= 5
    }
  }
  
  // Check usage patterns
  if (metadata.usage) {
    const daysSinceLastViewed = (Date.now() - metadata.usage.lastViewed.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceLastViewed > 90) {
      issues.push('Column rarely used (90+ days)')
      recommendations.push('Consider removing if not business critical')
      score -= 5
    }
  }
  
  // Determine status
  let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  if (score >= 90) status = 'excellent'
  else if (score >= 75) status = 'good'
  else if (score >= 60) status = 'fair'
  else if (score >= 40) status = 'poor'
  else status = 'critical'
  
  return {
    status,
    score: Math.max(0, Math.round(score)),
    issues,
    recommendations
  }
}

/**
 * Format column statistics for display
 */
export function formatColumnStatistics(stats: ColumnStatistics): Array<{
  label: string
  value: string
  type: 'info' | 'warning' | 'success' | 'error'
}> {
  const formatted: Array<{
    label: string
    value: string
    type: 'info' | 'warning' | 'success' | 'error'
  }> = []
  
  formatted.push({
    label: 'Total Rows',
    value: stats.totalRows.toLocaleString(),
    type: 'info' as const
  })
  
  formatted.push({
    label: 'Fill Rate',
    value: `${Math.round(stats.fillRate * 100)}%`,
    type: stats.fillRate > 0.9 ? 'success' : stats.fillRate > 0.7 ? 'warning' : 'error'
  })
  
  formatted.push({
    label: 'Unique Values',
    value: stats.uniqueCount.toLocaleString(),
    type: 'info' as const
  })
  
  if (stats.nullCount > 0) {
    formatted.push({
      label: 'Missing Values',
      value: stats.nullCount.toLocaleString(),
      type: 'warning' as const
    })
  }
  
  if (stats.avgLength !== undefined) {
    formatted.push({
      label: 'Avg Length',
      value: `${Math.round(stats.avgLength)} chars`,
      type: 'info' as const
    })
  }
  
  formatted.push({
    label: 'Data Size',
    value: formatBytes(stats.dataSize),
    type: 'info' as const
  })
  
  return formatted
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Get column icon based on data type and metadata
 */
export function getColumnIcon(metadata: EnhancedColumnMetadata): string {
  // Check for special column types first
  if (metadata.key.toLowerCase().includes('id')) return '🔑'
  if (metadata.key.toLowerCase().includes('email')) return '📧'
  if (metadata.key.toLowerCase().includes('phone')) return '📞'
  if (metadata.key.toLowerCase().includes('url') || metadata.key.toLowerCase().includes('link')) return '🔗'
  if (metadata.key.toLowerCase().includes('image') || metadata.key.toLowerCase().includes('photo')) return '🖼️'
  
  // Check governance classification
  if (metadata.governance?.classification === 'restricted') return '🔒'
  if (metadata.governance?.classification === 'confidential') return '🔐'
  
  // Check data type
  switch (metadata.dataType.toLowerCase()) {
    case 'string':
    case 'text':
    case 'varchar':
      return '📝'
    case 'number':
    case 'integer':
    case 'decimal':
    case 'float':
      return '🔢'
    case 'date':
    case 'datetime':
    case 'timestamp':
      return '📅'
    case 'boolean':
      return '☑️'
    case 'json':
    case 'object':
      return '📋'
    case 'array':
      return '📊'
    default:
      return '📄'
  }
}

/**
 * Generate column recommendations
 */
export function generateColumnRecommendations(metadata: EnhancedColumnMetadata): Array<{
  type: 'performance' | 'quality' | 'usage' | 'governance'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  action?: string
}> {
  const recommendations = []
  
  // Performance recommendations
  if (metadata.performance?.queryPerformance === 'slow') {
    recommendations.push({
      type: 'performance' as const,
      priority: 'high' as const,
      title: 'Add Database Index',
      description: 'This column has slow query performance. Adding an index could improve response times.',
      action: 'Contact your database administrator'
    })
  }
  
  // Quality recommendations
  if (metadata.quality && metadata.quality.completeness < 0.8) {
    recommendations.push({
      type: 'quality' as const,
      priority: 'high' as const,
      title: 'Improve Data Completeness',
      description: `Only ${Math.round(metadata.quality.completeness * 100)}% of values are present. Consider adding validation rules.`,
      action: 'Review data entry processes'
    })
  }
  
  // Usage recommendations
  if (metadata.usage) {
    const daysSinceLastViewed = (Date.now() - metadata.usage.lastViewed.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceLastViewed > 180) {
      recommendations.push({
        type: 'usage' as const,
        priority: 'medium' as const,
        title: 'Consider Column Removal',
        description: 'This column hasn\'t been viewed in over 6 months. Consider if it\'s still needed.',
        action: 'Review with business stakeholders'
      })
    }
  }
  
  // Governance recommendations
  if (!metadata.governance?.owner) {
    recommendations.push({
      type: 'governance' as const,
      priority: 'medium' as const,
      title: 'Assign Data Owner',
      description: 'This column doesn\'t have an assigned data owner for governance purposes.',
      action: 'Contact data governance team'
    })
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}