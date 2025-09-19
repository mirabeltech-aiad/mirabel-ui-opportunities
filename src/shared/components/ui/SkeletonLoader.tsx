import React from 'react'

interface SkeletonLoaderProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular' | 'card' | 'table'
  width?: string | number
  height?: string | number
  rows?: number
  animate?: boolean
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  rows = 1,
  animate = true
}) => {
  const baseClasses = `bg-gray-200 ${animate ? 'animate-pulse' : ''}`
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'rounded h-4'
      case 'circular':
        return 'rounded-full'
      case 'rectangular':
        return 'rounded'
      case 'card':
        return 'rounded-lg'
      case 'table':
        return 'rounded h-12'
      default:
        return 'rounded'
    }
  }

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  }

  if (rows > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={style}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  )
}

// Specific skeleton components for common use cases
export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonLoader variant="text" height="1.5rem" width="70%" />
        <div className="flex gap-2">
          <SkeletonLoader variant="rectangular" height="1.5rem" width="4rem" />
          <SkeletonLoader variant="rectangular" height="1.5rem" width="3rem" />
        </div>
      </div>
      
      {/* Description */}
      <SkeletonLoader variant="text" rows={2} />
      
      {/* Details */}
      <div className="space-y-2">
        <SkeletonLoader variant="text" height="1rem" width="50%" />
        <SkeletonLoader variant="text" height="1rem" width="40%" />
        <SkeletonLoader variant="text" height="1rem" width="60%" />
      </div>
      
      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <SkeletonLoader variant="rectangular" height="2rem" width="4rem" />
        <SkeletonLoader variant="rectangular" height="2rem" width="4rem" />
      </div>
    </div>
  </div>
)

export const ProductTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 border-b animate-pulse">
        <SkeletonLoader variant="rectangular" width="3rem" height="3rem" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader variant="text" height="1.25rem" width="60%" />
          <SkeletonLoader variant="text" height="1rem" width="40%" />
        </div>
        <div className="space-y-2">
          <SkeletonLoader variant="rectangular" height="1.5rem" width="4rem" />
          <SkeletonLoader variant="text" height="1rem" width="3rem" />
        </div>
        <div className="space-y-2">
          <SkeletonLoader variant="text" height="1rem" width="3rem" />
        </div>
        <div className="space-y-2">
          <SkeletonLoader variant="rectangular" height="1.5rem" width="3rem" />
        </div>
        <div className="flex gap-2">
          <SkeletonLoader variant="rectangular" width="2rem" height="2rem" />
          <SkeletonLoader variant="rectangular" width="2rem" height="2rem" />
        </div>
      </div>
    ))}
  </div>
)

export const ProductAccordionSkeleton: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="border border-gray-200 rounded-lg animate-pulse">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SkeletonLoader variant="rectangular" width="2rem" height="2rem" />
              <div className="space-y-1">
                <SkeletonLoader variant="text" height="1.25rem" width="12rem" />
                <SkeletonLoader variant="text" height="1rem" width="8rem" />
              </div>
            </div>
            <SkeletonLoader variant="rectangular" width="1.5rem" height="1.5rem" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <SkeletonLoader variant="text" rows={2} />
          <div className="flex gap-4">
            <SkeletonLoader variant="text" height="1rem" width="4rem" />
            <SkeletonLoader variant="text" height="1rem" width="5rem" />
            <SkeletonLoader variant="text" height="1rem" width="3rem" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

export default SkeletonLoader