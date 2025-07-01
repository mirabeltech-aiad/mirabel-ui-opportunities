
import React, { useState, useCallback } from 'react';
import { validateField, validateForm } from '@/features/Opportunity/utils/formValidation';

export const useFormValidation = (initialData = {}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
    getFieldError
  };
};
