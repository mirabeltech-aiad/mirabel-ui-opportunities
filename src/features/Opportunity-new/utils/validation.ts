import { OpportunityFormData, ValidationErrors } from '../types/opportunity';

// Validation rules for opportunity form
export const validateRequiredFields = (formData: OpportunityFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Required field validations
  if (!formData.name?.trim()) {
    errors.name = 'Opportunity name is required';
  } else if (formData.name.length < 3 || formData.name.length > 100) {
    errors.name = 'Opportunity name must be between 3 and 100 characters';
  }

  if (!formData.company?.trim()) {
    errors.company = 'Company name is required';
  } else if (formData.company.length < 2 || formData.company.length > 1000) {
    errors.company = 'Company name must be between 2 and 1000 characters';
  }

  if (!formData.status?.trim()) {
    errors.status = 'Status is required';
  }

  if (!formData.stage?.trim()) {
    errors.stage = 'Stage is required';
  }

  if (!formData.amount?.trim() && !formData.proposalId) {
    errors.amount = 'Amount is required when no proposal is linked';
  } else if (formData.amount && (isNaN(Number(formData.amount)) || Number(formData.amount) < 0 || Number(formData.amount) > 999999999)) {
    errors.amount = 'Amount must be a valid number between 0 and 999,999,999';
  }

  if (!formData.probability?.trim()) {
    errors.probability = 'Probability is required';
  } else if (isNaN(Number(formData.probability)) || Number(formData.probability) < 0 || Number(formData.probability) > 100) {
    errors.probability = 'Probability must be between 0 and 100%';
  }

  if (!formData.projCloseDate?.trim()) {
    errors.projCloseDate = 'Projected close date is required';
  } else {
    const closeDate = new Date(formData.projCloseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    const fiveYearsFromNow = new Date();
    fiveYearsFromNow.setFullYear(today.getFullYear() + 5);
    
    if (closeDate < today) {
      errors.projCloseDate = 'Projected close date cannot be in the past';
    } else if (closeDate > fiveYearsFromNow) {
      errors.projCloseDate = 'Projected close date must be within 5 years';
    }
  }

  if (!formData.opportunityType?.id?.trim() || !formData.opportunityType?.name?.trim()) {
    errors.opportunityType = 'Opportunity type is required and must have valid ID and name';
  }

  if (!formData.createdBy?.trim()) {
    errors.createdBy = 'Created by is required';
  } else if (formData.createdBy.length < 2 || formData.createdBy.length > 50) {
    errors.createdBy = 'Created by must be between 2 and 50 characters';
  }

  if (!formData.createdDate?.trim()) {
    errors.createdDate = 'Created date is required';
  }

  // Conditional validations based on status and stage
  if (formData.status === 'Lost' || formData.stage === 'Closed Lost') {
    if (!formData.lostReason?.trim()) {
      errors.lostReason = 'Lost reason is required when status is Lost or stage is Closed Lost';
    }
    if (!formData.notes?.trim()) {
      errors.notes = 'Notes are required when opportunity is lost';
    }
  }

  // Business logic validations for probability alignment
  if (formData.probability === '0' && formData.status !== 'Lost') {
    errors.status = 'Status must be "Lost" when probability is 0%';
  }

  if (formData.probability === '100' && formData.status !== 'Won') {
    errors.status = 'Status must be "Won" when probability is 100%';
  }

  if (formData.status === 'Lost' && formData.probability !== '0') {
    errors.probability = 'Probability must be 0% for lost opportunities';
  }

  if (formData.status === 'Won' && formData.probability !== '100') {
    errors.probability = 'Probability must be 100% for won opportunities';
  }

  // Stage and status alignment
  if (formData.status === 'Lost' && formData.stage !== 'Closed Lost') {
    errors.stage = 'Stage must be "Closed Lost" when status is Lost';
  }

  if (formData.status === 'Won' && formData.stage !== 'Closed Won') {
    errors.stage = 'Stage must be "Closed Won" when status is Won';
  }

  if (formData.stage === 'Closed Lost' && formData.status !== 'Lost') {
    errors.status = 'Status must be "Lost" when stage is Closed Lost';
  }

  if (formData.stage === 'Closed Won' && formData.status !== 'Won') {
    errors.status = 'Status must be "Won" when stage is Closed Won';
  }

  return errors;
};

export const validateSingleField = (fieldName: string, value: any, formData: OpportunityFormData): string | null => {
  const errors = validateRequiredFields({ ...formData, [fieldName]: value });
  return errors[fieldName] || null;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// Helper functions for business logic validation
export const isLostReasonRequired = (status: string, stage: string): boolean => {
  return status === 'Lost' || stage === 'Closed Lost';
};

export const hasValidLostReason = (lostReason: string): boolean => {
  return lostReason?.trim().length > 0;
};

export const hasValidNotes = (notes: string): boolean => {
  return notes?.trim().length > 0;
};

// Calculate forecast revenue
export const calculateForecastRevenue = (amount: string, probability: string): string => {
  const amountNum = Number(amount || 0);
  const probabilityNum = Number(probability || 0);
  return ((amountNum * probabilityNum) / 100).toString();
};

// Business rule validation functions
export const shouldAmountBeReadOnly = (proposalId: string): boolean => {
  return !!(proposalId && String(proposalId).trim());
};

export const shouldAutoUpdateStage = (probability: string): { stage: string; status: string } | null => {
  const prob = Number(probability);
  if (prob === 0) {
    return { stage: 'Closed Lost', status: 'Lost' };
  }
  if (prob === 100) {
    return { stage: 'Closed Won', status: 'Won' };
  }
  return null;
};

export const shouldAutoUpdateProbability = (status: string): string | null => {
  if (status === 'Lost') return '0';
  if (status === 'Won') return '100';
  return null;
};

export const isValidProbabilityForStatus = (probability: string, status: string): boolean => {
  const prob = Number(probability);
  if (status === 'Lost' && prob !== 0) return false;
  if (status === 'Won' && prob !== 100) return false;
  if (status === 'Open' && (prob === 0 || prob === 100)) return false;
  return true;
};

export const isValidStageForStatus = (stage: string, status: string): boolean => {
  if (status === 'Lost' && stage !== 'Closed Lost') return false;
  if (status === 'Won' && stage !== 'Closed Won') return false;
  if (stage === 'Closed Lost' && status !== 'Lost') return false;
  if (stage === 'Closed Won' && status !== 'Won') return false;
  return true;
};

export const validateDateRange = (dateString: string): { isValid: boolean; error?: string } => {
  if (!dateString) return { isValid: false, error: 'Date is required' };
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fiveYearsFromNow = new Date();
  fiveYearsFromNow.setFullYear(today.getFullYear() + 5);
  
  if (date < today) {
    return { isValid: false, error: 'Date cannot be in the past' };
  }
  
  if (date > fiveYearsFromNow) {
    return { isValid: false, error: 'Date must be within 5 years' };
  }
  
  return { isValid: true };
};