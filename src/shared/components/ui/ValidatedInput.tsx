import React from 'react'
import { Input } from './input'
import { Label } from './label'
import { Textarea } from './textarea'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ValidatedInputProps {
  id: string
  label: string
  type?: 'text' | 'email' | 'number' | 'password' | 'textarea'
  value: string | number
  onChange: (value: string | number) => void
  error?: string
  isValidating?: boolean
  isValid?: boolean
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  rows?: number
  min?: number
  max?: number
  step?: number
  hasChanged?: boolean
  modal?: boolean
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  isValidating = false,
  isValid,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  rows = 3,
  min,
  max,
  step,
  hasChanged = false,
  modal = false
}) => {
  const hasError = !!error
  const showSuccess = !hasError && !isValidating && value && isValid
  
  const getStatusIcon = () => {
    if (isValidating) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
    }
    if (hasError) {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
    if (showSuccess) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return null
  }
  
  const getInputClasses = () => {
    let classes = 'pr-10 '
    if (hasError) {
      classes += 'border-red-300 focus:border-red-500 focus:ring-red-500 '
    } else if (showSuccess) {
      classes += 'border-green-300 focus:border-green-500 focus:ring-green-500 '
    }
    return classes + className
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={hasError ? 'text-red-700' : ''} required={required}>
        {label}
        {hasChanged && <span className="text-blue-500 ml-1 text-xs">●</span>}
      </Label>
      
      <div className="relative">
        {type === 'textarea' ? (
          <Textarea
            id={id}
            value={value as string}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={getInputClasses()}
            modal={modal}
          />
        ) : (
          <Input
            id={id}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={getInputClasses()}
            modal={modal}
          />
        )}
        
        {/* Status icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {getStatusIcon()}
        </div>
      </div>
      
      {/* Error message */}
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {/* Success message */}
      {showSuccess && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Valid
        </p>
      )}
    </div>
  )
}

export default ValidatedInput