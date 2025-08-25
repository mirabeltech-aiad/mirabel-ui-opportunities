// Validation helper functions for opportunity forms

/**
 * Check if Lost Reason should be required based on stage
 * @param {Object} formData - The form data object
 * @returns {boolean} - Whether lost reason is required
 */
export const isLostReasonRequired = (formData) => {
  return formData.stage === "Closed Lost" || 
         formData.stage === "Closed-Lost" || 
         (formData.stageDetails && (
           formData.stageDetails.Stage === "Closed Lost" || 
           formData.stageDetails.Stage === "Closed-Lost"
         ));
};

/**
 * Check if lost reason field has a valid value
 * @param {any} lostReason - The lost reason value
 * @returns {boolean} - Whether the value is valid
 */
export const hasValidLostReason = (lostReason) => {
  if (!lostReason) return false;
  
  if (typeof lostReason === 'string') {
    return lostReason.trim() !== '';
  }
  
  if (typeof lostReason === 'object') {
    return !!(lostReason.Name || lostReason.name);
  }
  
  return false;
};

/**
 * Check if notes field has a valid value
 * @param {any} notes - The notes value
 * @returns {boolean} - Whether the value is valid
 */
export const hasValidNotes = (notes) => {
  if (!notes) return false;
  return notes.trim() !== '';
};

/**
 * Get validation error message for lost reason field
 * @param {Object} formData - The form data object
 * @param {boolean} hasSubmitted - Whether the form has been submitted
 * @returns {string|null} - Error message or null if valid
 */
export const getLostReasonValidationError = (formData, hasSubmitted) => {
  if (!hasSubmitted) return null;
  
  if (isLostReasonRequired(formData) && !hasValidLostReason(formData.lostReason)) {
    return "Lost Reason is required when opportunity stage is 'Closed Lost'";
  }
  
  return null;
}; 