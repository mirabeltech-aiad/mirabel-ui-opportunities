import React, { useContext, createContext } from 'react'
import { FloatingLabelInput } from './FloatingLabelInput'
import { FloatingLabelSelect } from './FloatingLabelSelect'
import { FloatingLabelTextarea } from './FloatingLabelTextarea'

// Form context to automatically determine field type
interface FormContextType {
  type: 'modal' | 'page' | 'auth' | 'simple' | 'filter'
  fieldCount?: number
}

const FormContext = createContext<FormContextType>({ type: 'page' })

// Smart Form Container that sets context
export const SmartForm: React.FC<{
  children: React.ReactNode
  type?: 'modal' | 'page' | 'auth' | 'simple' | 'filter'
  fieldCount?: number
  className?: string
}> = ({ children, type = 'page', fieldCount, className }) => {
  // Auto-detect form type based on context clues
  const detectedType = React.useMemo(() => {
    // If explicitly set, use that
    if (type !== 'page') return type
    
    // Auto-detect based on field count
    if (fieldCount && fieldCount <= 2) return 'simple'
    if (fieldCount && fieldCount >= 5) return 'page' // Use floating for complex forms
    
    return 'page'
  }, [type, fieldCount])

  return (
    <FormContext.Provider value={{ type: detectedType, fieldCount }}>
      <div className={className}>
        {children}
      </div>
    </FormContext.Provider>
  )
}

// Smart Input that automatically chooses the right type
export const SmartInput: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  required?: boolean
  className?: string
}> = ({ label, value, onChange, type = 'text', placeholder, required, className }) => {
  const context = useContext(FormContext)
  
  // Decision logic based on context
  const shouldUseFloating = React.useMemo(() => {
    switch (context.type) {
      case 'modal':
        return true  // Always use floating in modals (space efficient)
      case 'auth':
        return false // Never use floating in auth (familiar patterns)
      case 'simple':
        return false // Simple forms use traditional (clarity)
      case 'filter':
        return false // Filters have their own components
      case 'page':
      default:
        return true  // Default to floating for modern look
    }
  }, [context.type])

  if (shouldUseFloating) {
    return (
      <FloatingLabelInput
        label={label}
        type={type as 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        modal={context.type === 'modal'}
        className={className}
      />
    )
  }

  // Traditional input with label
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-blue-600 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={context.type === 'modal' ? 'form-field-modal' : 'form-field-base'}
      />
    </div>
  )
}

// Smart Select that automatically chooses the right type
export const SmartSelect: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  required?: boolean
  className?: string
}> = ({ label, value, onChange, options, placeholder, required, className }) => {
  const context = useContext(FormContext)
  
  // Decision logic based on context
  const shouldUseFloating = React.useMemo(() => {
    switch (context.type) {
      case 'modal':
        return true  // Always use floating in modals
      case 'auth':
        return false // Never use floating in auth
      case 'simple':
        return false // Simple forms use traditional
      case 'filter':
        return false // Filters have their own components
      case 'page':
      default:
        return true  // Default to floating
    }
  }, [context.type])

  if (shouldUseFloating) {
    return (
      <FloatingLabelSelect
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        required={required}
        modal={context.type === 'modal'}
        className={className}
      />
    )
  }

  // Traditional select with label
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-blue-600 mb-2">
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={context.type === 'modal' ? 'form-field-modal' : 'form-field-base'}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// Smart Textarea that automatically chooses the right type
export const SmartTextarea: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
  className?: string
}> = ({ label, value, onChange, placeholder, required, rows = 3, className }) => {
  const context = useContext(FormContext)
  
  // Decision logic based on context
  const shouldUseFloating = React.useMemo(() => {
    switch (context.type) {
      case 'modal':
        return true  // Always use floating in modals
      case 'auth':
        return false // Never use floating in auth
      case 'simple':
        return false // Simple forms use traditional
      case 'filter':
        return false // Filters don't typically have textareas
      case 'page':
      default:
        return true  // Default to floating
    }
  }, [context.type])

  if (shouldUseFloating) {
    return (
      <FloatingLabelTextarea
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        modal={context.type === 'modal'}
        className={className}
      />
    )
  }

  // Traditional textarea with label
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-blue-600 mb-2">
        {label} {required && '*'}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={context.type === 'modal' ? 'form-field-modal' : 'form-field-base'}
      />
    </div>
  )
}