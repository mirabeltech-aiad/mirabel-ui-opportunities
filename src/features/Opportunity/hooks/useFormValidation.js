
import React, { useState, useCallback } from 'react';
import { validateField, validateForm } from '@/features/Opportunity/utils/formValidation';
import { isLostReasonRequired, hasValidLostReason, hasValidNotes } from '../utils/validationHelpers';

export const useFormValidation = (initialData = {}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});


  
  // Enhanced validation logic for all fields with comprehensive business rules
  const validateRequiredFields = (formData) => {
    const errors = {};
const data =formData;
    // Required field validation with enhanced rules
    const requiredFields = [
      { field: "name", label: "Opportunity Name", minLength: 3, maxLength: 100 },
      { field: "company", label: "Company Name", minLength: 2, maxLength: 1000 },
      { field: "status", label: "Status" },
      { field: "stageDetails", label: "Stage" },
      { field: "amount", label: "Amount", isNumeric: true, min: 0, max: 999999999 },
      { field: "probability", label: "Probability", required: true },
      { field: "projCloseDate", label: "Projected Close Date", isDate: true },
      { field: "opportunityType", label: "Opportunity Type" },
      { field: "createdBy", label: "Created By", minLength: 2, maxLength: 50 },
      { field: "createdDate", label: "Created Date", isDate: true },
    ];

    if(formData?.isAddMode) {
      // Special validation for customer selection (required to prevent FK violations)
      const selectedCustomerId = data.contactDetails?.ID || data.contactId || data.customerId;
      const hasValidCustomer = selectedCustomerId && selectedCustomerId !== '' && selectedCustomerId !== '0';
      if (!hasValidCustomer) {
        errors.customer = 'Customer selection is required. Please search and select a customer to continue.';
      }
    }

    requiredFields.forEach(({ field, label, minLength, maxLength, isNumeric, min, max, isDate }) => {
      const value = data[field];

      // Check if field is empty
      let isEmpty = false;
      if (field === "opportunityType") {
        isEmpty = !value ||
          (typeof value === "object" && !value.name) ||
          (typeof value === "string" && value.trim() === "");
      } 
      else if (field ==="stageDetails")
        {
          isEmpty = !value || !value.ID || value.ID <= 0;
      
          console.log(field,isEmpty,value)
        }
      else if (field === "amount") {
        isEmpty = !data.proposalId && (!(parseFloat(value) > 0) || (typeof value === "string" && value.trim() === ""));
      } else {
        isEmpty = !value || (typeof value === "string" && value.trim() === "");
      }

      if (isEmpty) {
        errors[field] = `${label} is required`;
      } else {
        // Additional validation for existing values
        const stringValue = typeof value === 'string' ? value : String(value);

        // String length validation
        if (minLength && stringValue.trim().length < minLength) {
          errors[field] = `${label} must be at least ${minLength} characters`;
        }

        if (maxLength && stringValue.trim().length > maxLength) {
          errors[field] = `${label} must be less than ${maxLength} characters`;
        }

        // Numeric validation
        if (isNumeric) {
          const numValue = parseFloat(stringValue);
          if (isNaN(numValue)) {
            errors[field] = `${label} must be a valid number`;
          } else {
            if (min !== undefined && numValue < min) {
              errors[field] = `${label} must be at least ${min}`;
            }
            if (max !== undefined && numValue > max) {
              errors[field] = `${label} cannot exceed ${max}`;
            }
          }
        }

        // Date validation
        if (isDate && stringValue) {
          const dateValue = new Date(stringValue);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (isNaN(dateValue.getTime())) {
            errors[field] = `${label} must be a valid date`;
          } 
          else if (field === "projCloseDate") {
            // Projected close date should be in the future
            if (dateValue < today) {
              errors[field] = `${label} should be a future date`;
            }
            // Check if projected close date is too far in the future (more than 5 years)
            const fiveYearsFromNow = new Date();
            fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
            if (dateValue > fiveYearsFromNow) {
              errors[field] = `${label} should be within 5 years`;
            }
          }
          else if (field === "createdDate") {
            // For system-generated fields like createdDate, we don't show validation errors
            // since users can't edit them. Just log if there's an issue.
            if (dateValue > today) {
              console.warn(`System field ${field} has future date: ${stringValue}. This should be auto-corrected by the UI.`);
              // Don't add to validation errors since user can't fix this system field
            }
          }
        }
      }
    });

    // Optional field validation
    const optionalFields = [
      { field: "contactName", label: "Contact Name", minLength: 2, maxLength: 500 },
      { field: "primaryCampaignSource", label: "Primary Campaign Source", maxLength: 1000 },
      { field: "nextSteps", label: "Next Steps", maxLength: 500 },
      { field: "description", label: "Description", maxLength: 10000 },
    ];

    optionalFields.forEach(({ field, label, minLength, maxLength, isNumeric, min, max }) => {
      const value = data[field];

      if (value && typeof value === 'string' && value.trim() !== '') {
        const stringValue = value.trim();

        if (minLength && stringValue.length < minLength) {
          errors[field] = `${label} must be at least ${minLength} characters`;
        }

        if (maxLength && stringValue.length > maxLength) {
          errors[field] = `${label} must be less than ${maxLength} characters`;
        }

        if (isNumeric) {
          const numValue = parseFloat(stringValue);
          if (isNaN(numValue)) {
            errors[field] = `${label} must be a valid number`;
          } else {
            if (min !== undefined && numValue < min) {
              errors[field] = `${label} must be at least ${min}`;
            }
            if (max !== undefined && numValue > max) {
              errors[field] = `${label} cannot exceed ${max}`;
            }
          }
        }
      }
    });

    // Business logic validation for stage and probability alignment
    if (data.probability) {
      const probability = parseFloat(data.probability);
      if (!isNaN(probability)) {
        if (data.stage === "Closed Won" && probability !== 100) {
          errors.probability = "Probability should be 100% for Closed Won opportunities";
        }
        if (data.stage === "Closed Lost" && probability !== 0) {
          errors.probability = "Probability should be 0% for Closed Lost opportunities";
        }
        // If Status is Open, probability cannot be 0 or 100
        if ((data.status || 'Open') === 'Open' && (probability === 0 || probability === 100)) {
          errors.probability = "Probability cannot be 0% or 100% when status is Open";
        }
        // Check for unrealistic probability for early stages
        if (data.stage === "Lead" && probability > 25) {
          errors.probability = "Probability seems high for Lead stage (typically 25% or less)";
        }
      }
    }

    // Conditional validation: Lost Reason is required when stage is "Closed Lost"
    if (isLostReasonRequired(data) && !hasValidLostReason(data.lostReason)) {
      errors.lostReason = "Lost Reason is required when opportunity stage is 'Closed Lost'";
    }

    if (isLostReasonRequired(data) && !hasValidNotes(data.notes)) {
      errors.notes = "Notes is required";
    }

    return errors;
  };


  const validateSingleField = useCallback((fieldName, value, formData) => {
    const error = validateField(fieldName, value, formData);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    return error;
  }, []);

  const validateAllFields = useCallback((formData) => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const markFieldTouched = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const hasErrors = Object.keys(errors).length > 0;
  const getFieldError = (fieldName) => touched[fieldName] ? errors[fieldName] : null;

  return {
    errors,
    touched,
    hasErrors,
    validateSingleField,
    validateAllFields,
    markFieldTouched,
    clearFieldError,
    clearAllErrors,
    getFieldError,
    validateRequiredFields
  };
};
