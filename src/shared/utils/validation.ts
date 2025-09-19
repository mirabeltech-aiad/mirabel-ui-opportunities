// Validation utilities for forms
import { useState, useEffect } from 'react'
import { FieldValue, UnknownRecord, ValidationRule, ValidationResult } from '../types/utility'

export const validateField = (value: FieldValue, rules: ValidationRule): ValidationResult => {
  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return { isValid: false, error: 'This field is required' }
  }

  // Skip other validations if field is empty and not required
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: true, error: null }
  }

  // String validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return { isValid: false, error: `Must be at least ${rules.minLength} characters` }
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return { isValid: false, error: `Must be no more than ${rules.maxLength} characters` }
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return { isValid: false, error: 'Invalid format' }
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return { isValid: false, error: `Must be at least ${rules.min}` }
    }

    if (rules.max !== undefined && value > rules.max) {
      return { isValid: false, error: `Must be no more than ${rules.max}` }
    }
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value)
    if (customError) {
      return { isValid: false, error: customError }
    }
  }

  return { isValid: true, error: null }
}

// Product-specific validation rules
export const productValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    custom: (value: FieldValue) => {
      const str = String(value || "")
      if (str && /\s/.test(str)) {
        return 'Field cannot contain spaces'
      }
      if (str && /\s$/.test(str)) {
        return 'Field cannot end with spaces'
      }
      if (str && !/^[A-Z0-9]/i.test(str)) {
        return 'Field must start with a letter or number'
      }
      if (str && /--/.test(str)) {
        return 'Field cannot contain double dashes'
      }
      return null
    }
  },
  productCode: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[A-Z0-9-_]+$/i,
    custom: (value: FieldValue) => {
      const str = String(value || "")
      if (str && /\s/.test(str)) {
        return 'Field cannot contain spaces'
      }
      if (str && /\s$/.test(str)) {
        return 'Field cannot end with spaces'
      }
      if (str && !/^[A-Z0-9]/i.test(str)) {
        return 'Field must start with a letter or number'
      }
      if (str && /--/.test(str)) {
        return 'Field cannot contain double dashes'
      }
      return null
    }
  },
  description: {
    maxLength: 1000
  },
  category: {
    maxLength: 50
  },
  basePrice: {
    min: 0,
    max: 999999.99,
    custom: (value: FieldValue) => {
      const str = String(value || "")
      if (str && /\s/.test(str)) {
        return 'Field cannot contain spaces'
      }
      if (str && /\s$/.test(str)) {
        return 'Field cannot end with spaces'
      }
      if (str && !/^[A-Z0-9]/i.test(str)) {
        return 'Field must start with a letter or number'
      }
      if (str && /--/.test(str)) {
        return 'Field cannot contain double dashes'
      }
      return null
    }
  },
  schedule: {
    required: true
  },
  eventDate: {
    custom: (value: FieldValue) => {
      const str = String(value || "")
      if (str && /\s/.test(str)) {
        return 'Field cannot contain spaces'
      }
      if (str && /\s$/.test(str)) {
        return 'Field cannot end with spaces'
      }
      if (str && !/^[A-Z0-9]/i.test(str)) {
        return 'Field must start with a letter or number'
      }
      if (str && /--/.test(str)) {
        return 'Field cannot contain double dashes'
      }
      return null
    }
  },
  duration: {
    pattern: /^\d+(\.\d+)?\s*(hours?|days?|weeks?|months?)$/i,
    custom: (value: FieldValue) => {
      const str = String(value || "")
      if (str && /\s/.test(str)) {
        return 'Field cannot contain spaces'
      }
      if (str && /\s$/.test(str)) {
        return 'Field cannot end with spaces'
      }
      if (str && !/^[A-Z0-9]/i.test(str)) {
        return 'Field must start with a letter or number'
      }
      if (str && /--/.test(str)) {
        return 'Field cannot contain double dashes'
      }
      return null
    }
  },
  location: {
    maxLength: 200
  },
  serviceType: {
    maxLength: 50
  },
  contentType: {
    maxLength: 50
  },
  circulation: {
    pattern: /^\d+$/,
    custom: (value: FieldValue) => {
      const str = String(value || "")
      if (str && /\s/.test(str)) {
        return 'Field cannot contain spaces'
      }
      if (str && /\s$/.test(str)) {
        return 'Field cannot end with spaces'
      }
      if (str && !/^[A-Z0-9]/i.test(str)) {
        return 'Field must start with a letter or number'
      }
      if (str && /--/.test(str)) {
        return 'Field cannot contain double dashes'
      }
      return null
    }
  }
}

// Validate entire form
export const validateProductForm = (formData: UnknownRecord, productType: string): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  // Basic validations
  const nameResult = validateField((formData.name || "") as FieldValue, productValidationRules.name)
  if (!nameResult.isValid) errors.name = nameResult.error!

  const codeResult = validateField((formData.productCode || "") as FieldValue, productValidationRules.productCode)
  if (!codeResult.isValid) errors.productCode = codeResult.error!

  const descResult = validateField((formData.description || "") as FieldValue, productValidationRules.description)
  if (!descResult.isValid) errors.description = descResult.error!

  const categoryResult = validateField((formData.category || "") as FieldValue, productValidationRules.category)
  if (!categoryResult.isValid) errors.category = categoryResult.error!

  const priceResult = validateField((formData.basePrice || "") as FieldValue, productValidationRules.basePrice)
  if (!priceResult.isValid) errors.basePrice = priceResult.error!

  const scheduleResult = validateField((formData.schedule || "") as FieldValue, productValidationRules.schedule)
  if (!scheduleResult.isValid) errors.schedule = scheduleResult.error!

  // Product type specific validations
  if (productType === 'EVENT') {
    if (formData.eventDate) {
      const eventDateResult = validateField((formData.eventDate || "") as FieldValue, productValidationRules.eventDate)
      if (!eventDateResult.isValid) errors.eventDate = eventDateResult.error!
    }

    if (formData.duration) {
      const durationResult = validateField((formData.duration || "") as FieldValue, productValidationRules.duration)
      if (!durationResult.isValid) errors.duration = durationResult.error!
    }

    if (formData.location) {
      const locationResult = validateField((formData.location || "") as FieldValue, productValidationRules.location)
      if (!locationResult.isValid) errors.location = locationResult.error!
    }
  }

  if (productType === 'SERVICE') {
    if (formData.serviceType) {
      const serviceTypeResult = validateField((formData.serviceType || "") as FieldValue, productValidationRules.serviceType)
      if (!serviceTypeResult.isValid) errors.serviceType = serviceTypeResult.error!
    }
  }

  if (productType === 'DIGITAL') {
    if (formData.contentType) {
      const contentTypeResult = validateField((formData.contentType || "") as FieldValue, productValidationRules.contentType)
      if (!contentTypeResult.isValid) errors.contentType = contentTypeResult.error!
    }

    if (formData.circulation) {
      const circulationResult = validateField((formData.circulation || "") as FieldValue, productValidationRules.circulation)
      if (!circulationResult.isValid) errors.circulation = circulationResult.error!
    }
  }

  return errors
}

// Real-time validation hook
export const useFieldValidation = (value: FieldValue, rules: ValidationRule, debounceMs = 300): {
  error: string;
  isValidating: boolean;
} => {
  const [error, setError] = useState<string>('')
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    setIsValidating(true)
    const timer = setTimeout(() => {
      const result = validateField(value, rules)
      setError(result.error || '')
      setIsValidating(false)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, rules, debounceMs])

  return { error, isValidating }
}