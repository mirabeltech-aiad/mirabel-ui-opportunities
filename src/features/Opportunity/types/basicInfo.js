
/**
 * Type definitions for BasicInfoSection component
 * 
 * @typedef {Object} BasicInfoFormData
 * @property {string} opportunityId
 * @property {string} proposalId
 * @property {string} name
 * @property {string} company
 * @property {string} contactName
 * @property {string} state
 * @property {string} opportunityType
 * @property {string} businessUnit
 * @property {string} product
 * @property {string} description
 * 
 * @typedef {Object} BasicInfoSectionProps
 * @property {BasicInfoFormData} formData
 * @property {function(string, string): void} handleInputChange
 * @property {string[]} stateOptions
 * @property {string[]} opportunityTypeOptions
 * @property {string[]} businessUnitOptions
 * @property {string[]} productOptions
 * 
 * @typedef {Object} ValidationErrors
 * @property {string} [key] - Error message for each field
 */

export {};
