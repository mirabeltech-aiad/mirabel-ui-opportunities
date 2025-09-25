import React from 'react'
import { LucideIcon } from 'lucide-react'

export interface TabItem {
  id: string
  label: string
  icon?: LucideIcon
  disabled?: boolean
  description?: string
  count?: number
}

export interface GradientTabBarProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
  variant?: 'default' | 'compact' | 'descriptive' | 'time-tracking' | 'analytics'
  showDescriptions?: boolean
}

export const GradientTabBar: React.FC<GradientTabBarProps> = React.memo(({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  variant = 'default',
  showDescriptions = false
}) => {
  const isDescriptive = variant === 'descriptive' || showDescriptions

  const containerClasses = variant === 'compact'
    ? 'bg-blue-50 p-0.5 rounded-md'
    : isDescriptive
      ? 'bg-blue-50 p-1 rounded-lg'
      : 'bg-blue-50 p-1 rounded-md'

  const buttonPadding = variant === 'compact'
    ? 'px-3 py-1.5'
    : isDescriptive
      ? 'px-4 py-3'
      : 'px-4 py-2'

  if (isDescriptive) {
    return (
      <div className={`${containerClasses} ${className}`}>
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && onTabChange(tab.id)}
                disabled={tab.disabled}
                className={`${buttonPadding} rounded-lg font-medium text-left transition-all duration-200 ${isActive
                  ? 'bg-gradient-to-r from-ocean-500 to-ocean-600 text-white shadow-sm'
                  : tab.disabled
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/70 bg-white/50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  {Icon && (
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-ocean-600'}`} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`px-2 py-0.5 text-xs rounded-full ${isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-ocean-100 text-ocean-700'
                          }`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                    {tab.description && (
                      <p className={`text-xs mt-1 ${isActive ? 'text-white/90' : 'text-gray-600'
                        }`}>
                        {tab.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex gap-1 w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              className={`${buttonPadding} rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 whitespace-nowrap flex-1 min-w-0 ${isActive
                ? 'bg-gradient-to-r from-ocean-500 to-ocean-600 text-white shadow-sm'
                : tab.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-muted-foreground hover:text-gray-700 hover:bg-white/50'
                }`}
            >
              {Icon && (
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-current'}`} />
              )}
              <span title={tab.label} className="truncate">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full flex-shrink-0 ${isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
})