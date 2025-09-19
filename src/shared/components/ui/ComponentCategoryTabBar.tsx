import React from 'react'
import { LucideIcon } from 'lucide-react'

export interface ComponentCategory {
  id: string
  label: string
  icon: LucideIcon
  description: string
  count: number
  examples: string[]
}

export interface ComponentCategoryTabBarProps {
  categories: ComponentCategory[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
  className?: string
}

export const ComponentCategoryTabBar: React.FC<ComponentCategoryTabBarProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  className = ''
}) => {
  return (
    <div className={`bg-blue-50 p-4 rounded-lg ${className}`}>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const isActive = activeCategory === category.id
          const Icon = category.icon
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-ocean-500 to-ocean-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/70 bg-white/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : 'text-ocean-600'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">{category.label}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-ocean-100 text-ocean-700'
                    }`}>
                      {category.count}
                    </span>
                  </div>
                  <p className={`text-xs mb-2 ${
                    isActive ? 'text-white/90' : 'text-gray-600'
                  }`}>
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {category.examples.slice(0, 3).map((example, index) => (
                      <span
                        key={index}
                        className={`px-1.5 py-0.5 text-xs rounded ${
                          isActive 
                            ? 'bg-white/10 text-white/80' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {example}
                      </span>
                    ))}
                    {category.examples.length > 3 && (
                      <span className={`px-1.5 py-0.5 text-xs rounded ${
                        isActive 
                          ? 'bg-white/10 text-white/80' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        +{category.examples.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}