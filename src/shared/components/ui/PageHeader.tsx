import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  onClose?: () => void
  className?: string
  children?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onClose,
  className,
  children
}) => {
  return (
    <div className={cn('relative mb-6', className)}>
      {/* Close button - always in top right corner, larger size */}
      {onClose && (
        <button
          onClick={onClose}
          className="close-button-page"
          aria-label="Close page"
        >
          <X className="w-6 h-6" />
        </button>
      )}
      
      {/* Main title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {title}
      </h1>
      
      {/* Subtitle with accent bar */}
      {subtitle && (
        <h2 className="page-subheader">
          {subtitle}
        </h2>
      )}
      
      {/* Additional content */}
      {children}
    </div>
  )
}

interface PageSubheaderProps {
  children: React.ReactNode
  className?: string
  accordion?: boolean  // Only show accent bar for accordion-style pages
}

export const PageSubheader: React.FC<PageSubheaderProps> = ({
  children,
  className,
  accordion = false
}) => {
  return (
    <h2 className={cn(
      'page-subheader',
      accordion && 'page-subheader--accordion',
      className
    )}>
      {children}
    </h2>
  )
}

// Convenience component for accordion-style subheaders
export const AccordionSubheader: React.FC<Omit<PageSubheaderProps, 'accordion'>> = (props) => (
  <PageSubheader {...props} accordion={true} />
)

export default PageHeader