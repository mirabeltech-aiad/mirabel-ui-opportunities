import React from 'react'
import { cn } from '@/shared/lib/utils'

interface FormFieldProps {
  children: React.ReactNode
  className?: string
  size?: 'fillable' | 'standard' | 'compact'
  minWidth?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  className,
  size = 'standard',
  minWidth
}) => {
  return (
    <div 
      className={cn(
        'form-field-wrapper',
        {
          'form-field-wrapper--fillable': size === 'fillable',
          'form-field-wrapper--standard': size === 'standard',
          'form-field-wrapper--compact': size === 'compact'
        },
        className
      )}
      style={minWidth ? { minWidth } : undefined}
    >
      {children}
    </div>
  )
}

interface FormSectionProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export const FormSection: React.FC<FormSectionProps> = ({
  children,
  className,
  title
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          {title}
        </h3>
      )}
      <div className="form-section">
        {children}
      </div>
    </div>
  )
}

export default FormField