import React, { useRef } from 'react'
import { useFormContext, useFieldTypeRecommendation } from '../../hooks/useFormContext'
import { SmartInput, SmartSelect, SmartTextarea } from './SmartFormField'

/**
 * Automatically detects form context and chooses the appropriate field type
 * No manual decisions needed - the system figures it out!
 */
export const AutoFormField: React.FC<{
  type: 'input' | 'select' | 'textarea'
  label: string
  value: string
  onChange: (value: string) => void
  inputType?: string
  options?: Array<{ value: string; label: string }>
  placeholder?: string
  required?: boolean
  rows?: number
  className?: string
  // Override auto-detection if needed
  forceType?: 'modal' | 'page' | 'auth' | 'simple' | 'filter'
}> = ({ 
  type, 
  label, 
  value, 
  onChange, 
  inputType = 'text',
  options = [],
  placeholder,
  required,
  rows,
  className,
  forceType
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const context = useFormContext(containerRef, forceType)
  const recommendation = useFieldTypeRecommendation(context)

  // Auto-generate placeholder if not provided
  const autoPlaceholder = placeholder || `Enter ${label.toLowerCase()}`

  // Render the appropriate field type
  const renderField = () => {
    const commonProps = {
      label,
      value,
      onChange,
      placeholder: autoPlaceholder,
      required,
      className
    }

    switch (type) {
      case 'select':
        return (
          <SmartSelect
            {...commonProps}
            options={options}
          />
        )
      
      case 'textarea':
        return (
          <SmartTextarea
            {...commonProps}
            rows={rows}
          />
        )
      
      case 'input':
      default:
        return (
          <SmartInput
            {...commonProps}
            type={inputType}
          />
        )
    }
  }

  return (
    <div 
      ref={containerRef}
      className={recommendation.recommendedClasses.container}
      data-form-type={context.type}
      data-field-count={context.fieldCount}
    >
      {renderField()}
    </div>
  )
}

/**
 * Auto Form Container that provides context for all child fields
 */
export const AutoForm: React.FC<{
  children: React.ReactNode
  className?: string
  onSubmit?: (e: React.FormEvent) => void
  // Override auto-detection
  forceType?: 'modal' | 'page' | 'auth' | 'simple' | 'filter'
}> = ({ children, className, onSubmit, forceType }) => {
  const containerRef = useRef<HTMLFormElement>(null)
  const context = useFormContext(containerRef, forceType)
  const recommendation = useFieldTypeRecommendation(context)

  return (
    <form
      ref={containerRef}
      onSubmit={onSubmit}
      className={`${recommendation.recommendedClasses.container} ${className || ''}`}
      data-form-type={context.type}
      data-auto-detected="true"
    >
      {children}
    </form>
  )
}

// Convenience components for common scenarios
export const AutoInput: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  required?: boolean
  className?: string
}> = (props) => (
  <AutoFormField type="input" inputType={props.type} label={props.label} value={props.value} onChange={props.onChange} placeholder={props.placeholder} required={props.required} className={props.className} />
)

export const AutoSelect: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  required?: boolean
  className?: string
}> = (props) => (
  <AutoFormField type="select" {...props} />
)

export const AutoTextarea: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
  className?: string
}> = (props) => (
  <AutoFormField type="textarea" {...props} />
)