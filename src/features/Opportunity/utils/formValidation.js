
// Form validation utilities for opportunity forms

export const VALIDATION_RULES = {
  required: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'This field is required';
    }
    return null;
  },
  
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },
  
  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },
  
  currency: (value) => {
    if (!value) return null;
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      return 'Please enter a valid positive amount';
    }
    return null;
  },
  
  percentage: (value) => {
    if (!value) return null;
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
      return 'Please enter a percentage between 0 and 100';
    }
    return null;
  },
  
  date: (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    return null;
  },
  
  futureDate: (value) => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return 'Date must be in the future';
    }
    return null;
  },
  
  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return null;
  },
  
  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return null;
  }
};

export const FIELD_VALIDATIONS = {
  // Basic Info validations
  name: [VALIDATION_RULES.required, VALIDATION_RULES.minLength(2)],
  company: [VALIDATION_RULES.required, VALIDATION_RULES.minLength(2)],
  contactName: [VALIDATION_RULES.minLength(2)],
  
  // Financial validations
  amount: [VALIDATION_RULES.currency],
  budget: [VALIDATION_RULES.currency],
  forecastRevenue: [VALIDATION_RULES.currency],
  probability: [VALIDATION_RULES.percentage],
  stagePercentage: [VALIDATION_RULES.percentage],
  
  // Date validations
  projCloseDate: [VALIDATION_RULES.date, VALIDATION_RULES.futureDate],
  implementationDate: [VALIDATION_RULES.date],
  createdDate: [VALIDATION_RULES.date],
  actualCloseDate: [VALIDATION_RULES.date],
  lastActivity: [VALIDATION_RULES.date],
  renewalDate: [VALIDATION_RULES.date],
  
  // Required fields for certain stages
  status: [VALIDATION_RULES.required],
  stage: [VALIDATION_RULES.required],
  
  // Text field validations
  description: [VALIDATION_RULES.maxLength(1000)],
  notes: [VALIDATION_RULES.maxLength(2000)],
  painPoints: [VALIDATION_RULES.maxLength(500)]
};

export const validateField = (fieldName, value, formData = {}) => {
  const validators = FIELD_VALIDATIONS[fieldName];
  if (!validators) return null;
  
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  
  // Cross-field validations
  if (fieldName === 'actualCloseDate' && value && formData.projCloseDate) {
    const actualDate = new Date(value);
    const projectedDate = new Date(formData.projCloseDate);
    if (actualDate < projectedDate) {
      // This is just a warning, not an error
      return null;
    }
  }
  
  return null;
};

export const validateForm = (formData) => {
  const errors = {};
  
  Object.keys(FIELD_VALIDATIONS).forEach(fieldName => {
    const error = validateField(fieldName, formData[fieldName], formData);
    if (error) {
      errors[fieldName] = error;
    }
  });
  
  // Business logic validations
  if (formData.status === 'Closed Won' && !formData.actualCloseDate) {
    errors.actualCloseDate = 'Actual close date is required for won opportunities';
  }
  
  if (formData.status === 'Closed Lost' && !formData.lostReason) {
    errors.lostReason = 'Loss reason is required for lost opportunities';
  }
  
  if (parseFloat(formData.amount) > 0 && parseFloat(formData.probability) === 0) {
    errors.probability = 'Probability should be greater than 0 for opportunities with value';
  }
  
  return errors;
};

export const getFieldError = (fieldName, errors) => {
  return errors[fieldName] || null;
};
