import React from 'react';

const DataValidationWrapper = ({ children, data, validationRules = {} }) => {
  const validateData = (data, rules) => {
    if (!data) return { isValid: false, errors: ['No data provided'] };
    
    const errors = [];
    
    // Check for required fields
    if (rules.required) {
      rules.required.forEach(field => {
        if (!data[field] && data[field] !== 0) {
          errors.push(`Missing required field: ${field}`);
        }
      });
    }
    
    // Check for minimum values
    if (rules.minValues) {
      Object.entries(rules.minValues).forEach(([field, minValue]) => {
        if (data[field] !== undefined && data[field] < minValue) {
          errors.push(`${field} must be at least ${minValue}`);
        }
      });
    }
    
    // Check for maximum values
    if (rules.maxValues) {
      Object.entries(rules.maxValues).forEach(([field, maxValue]) => {
        if (data[field] !== undefined && data[field] > maxValue) {
          errors.push(`${field} must be at most ${maxValue}`);
        }
      });
    }
    
    // Check for array lengths
    if (rules.arrayLengths) {
      Object.entries(rules.arrayLengths).forEach(([field, { min, max }]) => {
        if (Array.isArray(data[field])) {
          if (min && data[field].length < min) {
            errors.push(`${field} must have at least ${min} items`);
          }
          if (max && data[field].length > max) {
            errors.push(`${field} must have at most ${max} items`);
          }
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validation = validateData(data, validationRules);

  if (!validation.isValid) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Data Validation Failed</h3>
        <ul className="list-disc list-inside space-y-1">
          {validation.errors.map((error, index) => (
            <li key={index} className="text-sm text-red-700">{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  return children;
};

export default DataValidationWrapper; 