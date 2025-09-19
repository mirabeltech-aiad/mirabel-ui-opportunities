import React, { useState, useEffect } from 'react'
import { Badge } from './badge'
import { Button } from './button'
import { Progress } from './progress'
import {
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Database,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  ArrowUpDown,
  Download,
  Link,
  FileText,
  Lightbulb
} from 'lucide-react'
import {
  EnhancedColumnMetadata,
  calculateColumnImportance,
  getColumnHealthStatus,
  formatColumnStatistics,
  getColumnIcon,
  generateColumnRecommendations
} from '../../utils/columnMetadata'

interface ColumnTooltipProps {
  metadata: EnhancedColumnMetadata
  isVisible: boolean
  position: { x: number; y: number }
  onClose?: () => void
  showExtended?: boolean
  className?: string
}

export const ColumnTooltip: React.FC<ColumnTooltipProps> = ({
  metadata,
  isVisible,
  position,
  onClose,
  showExtended = false,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'quality' | 'usage' | 'recommendations'>('overview')
  
  if (!isVisible) return null

  const importance = calculateColumnImportance(metadata)
  const health = getColumnHealthStatus(metadata)
  const stats = metadata.statistics ? formatColumnStatistics(metadata.statistics) : []
  const recommendations = generateColumnRecommendations(metadata)
  const icon = getColumnIcon(metadata)

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200'
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'poor': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getImportanceColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50'
    if (score >= 60) return 'text-orange-600 bg-orange-50'
    if (score >= 40) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getTrendIcon = (direction?: string) => {
    switch (direction) {
      case 'increasing': return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'decreasing': return <TrendingDown className="h-3 w-3 text-red-600" />
      default: return <Minus className="h-3 w-3 text-gray-400" />
    }
  }

  return (
    <div
      className={`
        fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-w-md
        ${showExtended ? 'w-96' : 'w-80'}
        ${className}
      `}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{icon}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {metadata.title}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {metadata.key} • {metadata.dataType}
              </p>
              {metadata.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {metadata.description}
                </p>
              )}
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 -mt-1 -mr-1"
              onClick={onClose}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 mt-3">
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getImportanceColor(importance)}`}>
            <span className="font-medium">Importance: {importance}%</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${getHealthColor(health.status)}`}>
            {health.status === 'excellent' && <CheckCircle className="h-3 w-3" />}
            {health.status === 'critical' && <XCircle className="h-3 w-3" />}
            {!['excellent', 'critical'].includes(health.status) && <Info className="h-3 w-3" />}
            <span className="font-medium capitalize">{health.status}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {showExtended && (
        <div className="flex border-b border-gray-200">
          {[
            { key: 'overview', label: 'Overview', icon: Info },
            { key: 'stats', label: 'Stats', icon: Database },
            { key: 'quality', label: 'Quality', icon: CheckCircle },
            { key: 'usage', label: 'Usage', icon: Eye },
            { key: 'recommendations', label: 'Tips', icon: Lightbulb }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`
                flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium
                ${activeTab === key 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              onClick={() => setActiveTab(key as any)}
            >
              <Icon className="h-3 w-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-4 max-h-80 overflow-y-auto">
        {(!showExtended || activeTab === 'overview') && (
          <div className="space-y-3">
            {/* Category and Tags */}
            {metadata.category && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Category:</span>
                <Badge variant="outline" className="text-xs">
                  {metadata.category}
                </Badge>
              </div>
            )}

            {/* Governance */}
            {metadata.governance && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-700">Governance</span>
                </div>
                <div className="pl-5 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Classification:</span>
                    <Badge 
                      variant={metadata.governance.classification === 'restricted' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {metadata.governance.classification}
                    </Badge>
                  </div>
                  {metadata.governance.owner && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Owner:</span>
                      <span className="text-gray-900">{metadata.governance.owner}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Usage Metrics */}
            {metadata.usage && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-700">Usage</span>
                  {getTrendIcon(metadata.usage.trendDirection)}
                </div>
                <div className="pl-5 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Views:</span>
                    <span className="text-gray-900">{metadata.usage.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last viewed:</span>
                    <span className="text-gray-900">
                      {metadata.usage.lastViewed.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Performance */}
            {metadata.performance && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-3 w-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-700">Performance</span>
                </div>
                <div className="pl-5 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Query speed:</span>
                    <Badge 
                      variant={metadata.performance.queryPerformance === 'fast' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {metadata.performance.queryPerformance}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Index status:</span>
                    <Badge 
                      variant={metadata.performance.indexStatus === 'indexed' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {metadata.performance.indexStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showExtended && activeTab === 'stats' && (
          <div className="space-y-3">
            {stats.length > 0 ? (
              stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stat.label}:</span>
                  <span className={`text-sm font-medium ${
                    stat.type === 'success' ? 'text-green-600' :
                    stat.type === 'warning' ? 'text-yellow-600' :
                    stat.type === 'error' ? 'text-red-600' :
                    'text-gray-900'
                  }`}>
                    {stat.value}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No statistics available
              </p>
            )}
          </div>
        )}

        {showExtended && activeTab === 'quality' && (
          <div className="space-y-3">
            {metadata.quality ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Overall Score:</span>
                    <span className="text-sm font-bold text-gray-900">
                      {health.score}%
                    </span>
                  </div>
                  <Progress value={health.score} className="h-2" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Quality Metrics</h4>
                  {[
                    { label: 'Completeness', value: metadata.quality.completeness },
                    { label: 'Consistency', value: metadata.quality.consistency },
                    { label: 'Accuracy', value: metadata.quality.accuracy },
                    { label: 'Validity', value: metadata.quality.validity }
                  ].map((metric, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">{metric.label}:</span>
                      <span className="text-xs font-medium text-gray-900">
                        {Math.round(metric.value * 100)}%
                      </span>
                    </div>
                  ))}
                </div>

                {health.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      Issues
                    </h4>
                    {health.issues.map((issue, index) => (
                      <p key={index} className="text-xs text-gray-600">
                        • {issue}
                      </p>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No quality metrics available
              </p>
            )}
          </div>
        )}

        {showExtended && activeTab === 'usage' && (
          <div className="space-y-3">
            {metadata.usage ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Eye className="h-3 w-3 text-gray-400" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {metadata.usage.viewCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Filter className="h-3 w-3 text-gray-400" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {metadata.usage.filterUsage}
                    </div>
                    <div className="text-xs text-gray-500">Filters</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Sort usage:</span>
                    <span className="text-xs text-gray-900">{metadata.usage.sortUsage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Export usage:</span>
                    <span className="text-xs text-gray-900">{metadata.usage.exportUsage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Avg view time:</span>
                    <span className="text-xs text-gray-900">
                      {Math.round(metadata.usage.avgViewDuration)}s
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No usage data available
              </p>
            )}
          </div>
        )}

        {showExtended && activeTab === 'recommendations' && (
          <div className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded p-3">
                  <div className="flex items-start gap-2">
                    <div className={`
                      w-2 h-2 rounded-full mt-2 flex-shrink-0
                      ${rec.priority === 'high' ? 'bg-red-500' : 
                        rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}
                    `} />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {rec.description}
                      </p>
                      {rec.action && (
                        <p className="text-xs text-blue-600 mt-1 font-medium">
                          → {rec.action}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  No recommendations at this time
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {metadata.documentation?.lastUpdated && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Updated {metadata.documentation.lastUpdated.toLocaleDateString()}</span>
            </div>
            {metadata.documentation.author && (
              <span>by {metadata.documentation.author}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ColumnTooltip