import { useState, useEffect } from 'react';
import { opportunitiesService } from '../Services/opportunitiesService';
import { getCurrentUserId } from '@/utils/userUtils';
import { getCurrentUserInfo } from '@/utils/userUtils';
import { isLostReasonRequired, hasValidLostReason, hasValidNotes } from '../utils/validationHelpers';
import { useFormValidation } from './useFormValidation';

// Get current user information
const getCurrentUser = () => {
  const userInfo = getCurrentUserInfo();
  return {
    id: getCurrentUserId(),
    name: userInfo?.fullName || userInfo?.userName || 'Current User',
    email: userInfo?.email || null
  };
};

export const useAddOpportunityForm = (apiStages = []) => {
  // Get current user info at component level
  const currentUser = getCurrentUser();
  const {
    
    validateRequiredFields,
 } = useFormValidation();
  // Form validation state
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Enhanced validation logic for all fields with comprehensive business rules
//   const validateRequiredFields1 = (data) => {
//     const errors = {};
 
// alert(data.isAddMode);
//     // Required field validation with enhanced rules
//     const requiredFields = [
//       { field: "name", label: "Opportunity Name", minLength: 3, maxLength: 100 },
//       { field: "company", label: "Company Name", minLength: 2, maxLength: 100 },
//       { field: "status", label: "Status" },
//       { field: "stageDetails", label: "Stage" },
//       { field: "amount", label: "Amount", isNumeric: true, min: 0, max: 999999999 },
//       { field: "probability", label: "Probability", required: true },
//       { field: "projCloseDate", label: "Projected Close Date", isDate: true },
//       { field: "opportunityType", label: "Opportunity Type" },
//       { field: "createdBy", label: "Created By", minLength: 2, maxLength: 50 },
//       { field: "createdDate", label: "Created Date", isDate: true },
//     ];

//     // Special validation for customer selection (required to prevent FK violations)
//     const selectedCustomerId = data.contactDetails?.ID || data.contactId || data.customerId;
//     const hasValidCustomer = selectedCustomerId && selectedCustomerId !== '' && selectedCustomerId !== '0';

//     if (!hasValidCustomer) {
//       errors.customer = 'Customer selection is required. Please search and select a customer to continue.';
//     }

//     requiredFields.forEach(({ field, label, minLength, maxLength, isNumeric, min, max, isDate }) => {
//       const value = data[field];

//       // Check if field is empty
//       let isEmpty = false;
//       if (field === "opportunityType") {
//         isEmpty = !value ||
//           (typeof value === "object" && !value.name) ||
//           (typeof value === "string" && value.trim() === "");
//       }
//       else if (field ==="stageDetails")
//       {
//         isEmpty = !value || !value.ID || value.ID <= 0;
    
//         console.log(field,isEmpty,value)
//       }
//       else if (field === "amount") {
//         isEmpty = !formData.proposalId && (!(parseFloat(value) > 0) || (typeof value === "string" && value.trim() === ""));
//       }
//       else {
//         isEmpty = !value || (typeof value === "string" && value.trim() === "");
//       }

//       if (isEmpty) {
//         errors[field] = `${label} is required`;
//       } else {
//         // Additional validation for existing values
//         const stringValue = typeof value === 'string' ? value : String(value);

//         // String length validation
//         if (minLength && stringValue.trim().length < minLength) {
//           errors[field] = `${label} must be at least ${minLength} characters`;
//         }

//         if (maxLength && stringValue.trim().length > maxLength) {
//           errors[field] = `${label} must be less than ${maxLength} characters`;
//         }

//         // Numeric validation
//         if (isNumeric) {
//           const numValue = parseFloat(stringValue);
//           if (isNaN(numValue)) {
//             errors[field] = `${label} must be a valid number`;
//           } else {
//             if (min !== undefined && numValue < min) {
//               errors[field] = `${label} must be at least ${min}`;
//             }
//             if (max !== undefined && numValue > max) {
//               errors[field] = `${label} cannot exceed ${max}`;
//             }
//           }
//         }

//         // Date validation
//         if (isDate && stringValue) {
//           const dateValue = new Date(stringValue);
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);

//           if (isNaN(dateValue.getTime())) {
//             errors[field] = `${label} must be a valid date`;
//           } else if (field === "projCloseDate") {
//             // Projected close date should be in the future
//             if (dateValue < today) {
//               errors[field] = `${label} should be a future date`;
//             }

//             // Check if projected close date is too far in the future (more than 5 years)
//             const fiveYearsFromNow = new Date();
//             fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
//             if (dateValue > fiveYearsFromNow) {
//               errors[field] = `${label} should be within 5 years`;
//             }
//           } else if (field === "createdDate") {
//             // For system-generated fields like createdDate, we don't show validation errors
//             // since users can't edit them. Just log if there's an issue.
//             if (dateValue > today) {
//               console.warn(`System field ${field} has future date: ${stringValue}. This should be auto-corrected by the UI.`);
//               // Don't add to validation errors since user can't fix this system field
//             }
//           }
//         }
//       }
//     });

//     // Optional field validation
//     const optionalFields = [
//       { field: "contactName", label: "Contact Name", minLength: 2, maxLength: 50 },
//       { field: "primaryCampaignSource", label: "Primary Campaign Source", maxLength: 100 },
//       { field: "nextSteps", label: "Next Steps", maxLength: 500 },
//     ];

//     optionalFields.forEach(({ field, label, minLength, maxLength, isNumeric, min, max }) => {
//       const value = data[field];

//       if (value && typeof value === 'string' && value.trim() !== '') {
//         const stringValue = value.trim();

//         if (minLength && stringValue.length < minLength) {
//           errors[field] = `${label} must be at least ${minLength} characters`;
//         }

//         if (maxLength && stringValue.length > maxLength) {
//           errors[field] = `${label} must be less than ${maxLength} characters`;
//         }

//         if (isNumeric) {
//           const numValue = parseFloat(stringValue);
//           if (isNaN(numValue)) {
//             errors[field] = `${label} must be a valid number`;
//           } else {
//             if (min !== undefined && numValue < min) {
//               errors[field] = `${label} must be at least ${min}`;
//             }
//             if (max !== undefined && numValue > max) {
//               errors[field] = `${label} cannot exceed ${max}`;
//             }
//           }
//         }
//       }
//     });

//     // Business logic validation for stage and probability alignment
//     if (data.probability) {
//       const probability = parseFloat(data.probability);
//       if (!isNaN(probability)) {
//         if (data.stage === "Closed Won" && probability !== 100) {
//           errors.probability = "Probability should be 100% for Closed Won opportunities";
//         }
//         if (data.stage === "Closed Lost" && probability !== 0) {
//           errors.probability = "Probability should be 0% for Closed Lost opportunities";
//         }
//         // If Status is Open, probability cannot be 0 or 100
//         if ((data.status || 'Open') === 'Open' && (probability === 0 || probability === 100)) {
//           errors.probability = "Probability cannot be 0% or 100% when status is Open";
//         }
//         // Check for unrealistic probability for early stages
//         if (data.stage === "Lead" && probability > 25) {
//           errors.probability = "Probability seems high for Lead stage (typically 25% or less)";
//         }
//       }
//     }

//     // Conditional validation: Lost Reason is required when stage is "Closed Lost"
//     if (isLostReasonRequired(data) && !hasValidLostReason(data.lostReason)) {
//       errors.lostReason = "Lost Reason is required when opportunity stage is 'Closed Lost'";
//     }
//     if (isLostReasonRequired(data) && !hasValidNotes(data.notes)) {
//       errors.notes = "Notes is required";
//     }


//     return errors;
//   };

  // Function to get validation error for a specific field
  const getFieldError = (fieldName) => {
    // If user hasn't tried to submit yet, do not show errors
    if (!hasSubmitted) return null;
    return validationErrors[fieldName] || null;
  };

  // Function to check if form has validation errors
  const hasValidationErrors = () => {
    return Object.keys(validationErrors).length > 0;
  };

  // Initial form data for new opportunity
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    assignedRep: '',
    stage: '',
    status: '',
    amount: '',
    probability: '',
    projCloseDate: '',
    description: '',
    nextSteps: '',
    leadSource: '',
    leadType: '',
    leadStatus: '',
    priority: 'Medium',
    industry: '',
    companySize: '',
    timeframe: '',
    territory: '',
    contractLength: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    businessUnit: [],
    product: [],
    opportunityType: {},
    primaryCampaignSource: '',
    createdBy: currentUser.name, // Use actual current user name
    createdById: currentUser.id,  // Store user ID separately  
    createdDate: (() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    })(), // Always use today's date, never future dates
    modifiedBy: '',
    modifiedDate: '',
    notes: '',
    tags: [],
    customFields: {},
    customerId: '', // Add customerId field to store the selected customer's ID

    // Additional fields for API payload mapping
    contactId: '',
    businessUnitId: [],
    businessUnitDetails: [],
    productId: [],
    assignedRepDetails: {},
    salesPresenterDetails: {},
    contactDetails: {},
    stageDetails: {},
    productDetails: [],
    lossReasonDetails: {},
    customerData: null
  });

  const [isLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Add customer selection state
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);

  // Status change confirmation state
  const [statusConfirmDialog, setStatusConfirmDialog] = useState({
    isOpen: false,
    newStatus: null,
    pendingChange: null
  });

  // Preserve stage/probability when toggling back to Open
  const [previousStage, setPreviousStage] = useState('');
  const [previousStageDetails, setPreviousStageDetails] = useState({});
  const [previousProbability, setPreviousProbability] = useState('');

  // Auto-correct system fields on initialization
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Auto-correct created date if it's invalid or in the future
    if (formData.createdDate) {
      const createdDate = new Date(formData.createdDate + 'T00:00:00');

      if (isNaN(createdDate.getTime()) || createdDate > today) {
        setFormData(prev => ({
          ...prev,
          createdDate: todayStr
        }));
      }
    } else {
      // Set today's date if somehow empty
      setFormData(prev => ({
        ...prev,
        createdDate: todayStr
      }));
    }

    // Ensure current user info is set
    if (!formData.createdBy || formData.createdBy === 'Current User') {
      setFormData(prev => ({
        ...prev,
        createdBy: currentUser.name,
        createdById: currentUser.id
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  const handleInputChange = (field, value, options = {}) => {
    const { fromProposal = false } = options;
    let updatedValue = value;
    // If product changes and a proposal is linked, confirm and clear the link
    if (
      (field === 'product' || field === 'productId' || field === 'productDetails') &&
      formData.proposalId &&
      !fromProposal
    ) {
      const original = formData[field];
      const changed = JSON.stringify(original) !== JSON.stringify(value);
      if (changed) {

        // Clear proposal linkage and related locks
        setFormData(prev => ({
          ...prev,
          proposalId: '',
          proposalName: ''
        }));
      }
    }


    // Handle status change with confirmation for Won/Lost
    if (field === 'status' && (value === 'Won' || value === 'Lost')) {
      // Show confirmation dialog instead of directly updating
      setStatusConfirmDialog({
        isOpen: true,
        newStatus: value,
        pendingChange: { field, value }
      });
      return; // Don't update the form data yet
    }

    // Handle status change from Won/Lost to Open - restore previous stage and probability
    if (field === 'status' && value === 'Open' &&
      (formData.status === 'Won' || formData.status === 'Lost')) {
      setFormData(prev => ({
        ...prev,
        status: value,
        stage: previousStage || '',
        stageDetails: previousStageDetails || {},
        probability: previousProbability || ''
      }));
      setPreviousStage('');
      setPreviousStageDetails({});
      setPreviousProbability('');

      // Clear any previous errors when user starts typing
      if (error) {
        setError(null);
      }

      return; // Don't continue with normal field update
    }

    // Auto-correct system fields with enhanced logic
    if (field === 'createdDate') {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      if (!value) {
        updatedValue = todayStr;
      } else {
        const inputDate = new Date(value + 'T00:00:00'); // Ensure proper date parsing

        // Check if date is invalid or in the future
        if (isNaN(inputDate.getTime())) {
          updatedValue = todayStr;
        } else if (inputDate > today) {
          updatedValue = todayStr;
        }
      }
    }

    // Ensure createdBy is never empty for system integrity
    if (field === 'createdBy' && (!value || value.trim() === '')) {
      updatedValue = currentUser.name; // Use actual current user name
    }

    if(field === "amount"){
      const amount = Number(value || 0);
      const probability = Number(formData.probability || 0);
     
      setFormData(prev => ({
        ...prev,
        amount: value,
        forecastRevenue: ((amount * probability) / 100),
      }));
      return;
    }

    // If probability is set to 0 or 100, prompt to set status and stage accordingly
    if (field === 'probability') {
      const num = parseInt(String(updatedValue).replace('%', ''), 10);
      if (num === 100 || num === 0) {
        const targetStatus = num === 100 ? 'Won' : 'Lost';
        const proceed = window.confirm(`Set status to ${targetStatus} and update stage accordingly?`);
        if (proceed) {
          // Save previous before switching to closed
          setPreviousStage(formData.stage);
          setPreviousStageDetails(formData.stageDetails);
          setPreviousProbability(formData.probability);

          const closedStageName = `Closed ${targetStatus}`;
          const matchedStage = apiStages.find(s => (s.value || s.name || s.label) === closedStageName);
          const stageId = matchedStage ? (matchedStage.id || matchedStage.ID) : null;

          const amount = Number(formData.amount || 0);
          const probability = num || 0;

          setFormData(prev => ({
            ...prev,
            probability: String(num),
            forecastRevenue: ((amount * probability) / 100),
            status: targetStatus,
            stage: closedStageName,
            stageDetails: { ID: stageId, Stage: closedStageName }
          }));
          return;
        }
      }

      const amount = Number(formData.amount || 0);
      const probability = num || 0;
      setFormData(prev => ({
        ...prev,
        probability: String(num),
        forecastRevenue: ((amount * probability) / 100),
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: updatedValue,
      // Also update createdById if createdBy is changed
      ...(field === 'createdBy' ? { createdById: currentUser.id } : {})
    }));

    // Clear any previous errors when user starts typing
    if (error) {
      setError(null);
    }

    // If there were validation errors, re-validate the single field to clear warnings promptly
    if (hasSubmitted) {
      const nextData = { ...formData, [field]: updatedValue };
      const freshErrors = validateRequiredFields(nextData);
      setValidationErrors(freshErrors);
    }

    // Update customer selection state when customer-related fields change
    if (field === 'customerId' || field === 'company') {
      const hasCustomer = (field === 'customerId' && updatedValue && updatedValue.trim() !== '') ||
        (field === 'company' && updatedValue && updatedValue.trim() !== '');
      setIsCustomerSelected(hasCustomer);
    }
  };

  // Handle status change confirmation
  const handleStatusConfirm = () => {
    const { newStatus, pendingChange } = statusConfirmDialog;

    if (pendingChange && newStatus) {
      let updatedFields = {
        [pendingChange.field]: pendingChange.value
      };

      // Auto-update stage and probability based on status
      if (newStatus === 'Won') {
        // Save previous before switching to closed
        setPreviousStage(formData.stage);
        setPreviousStageDetails(formData.stageDetails);
        setPreviousProbability(formData.probability);
        // Find "Closed Won" stage from apiStages
        const closedWonStage = apiStages.find(stage =>
          stage.value === 'Closed Won' || stage.label === 'Closed Won' || stage.name === 'Closed Won'
        );

        if (closedWonStage) {
          updatedFields.stageDetails = {
            ID: closedWonStage.id || closedWonStage.ID,
            Stage: closedWonStage.value || closedWonStage.name || 'Closed Won'
          };
          updatedFields.stage = closedWonStage.value || closedWonStage.name || 'Closed Won';
        } else {
          // Fallback if stage not found in apiStages
          updatedFields.stageDetails = {
            ID: null,
            Stage: 'Closed Won'
          };
          updatedFields.stage = 'Closed Won';
        }
        updatedFields.probability = '100';
      } else if (newStatus === 'Lost') {
        // Save previous before switching to closed
        setPreviousStage(formData.stage);
        setPreviousStageDetails(formData.stageDetails);
        setPreviousProbability(formData.probability);
        // Find "Closed Lost" stage from apiStages
        const closedLostStage = apiStages.find(stage =>
          stage.value === 'Closed Lost' || stage.label === 'Closed Lost' || stage.name === 'Closed Lost'
        );

        if (closedLostStage) {
          updatedFields.stageDetails = {
            ID: closedLostStage.id || closedLostStage.ID,
            Stage: closedLostStage.value || closedLostStage.name || 'Closed Lost'
          };
          updatedFields.stage = closedLostStage.value || closedLostStage.name || 'Closed Lost';
        } else {
          // Fallback if stage not found in apiStages
          updatedFields.stageDetails = {
            ID: null,
            Stage: 'Closed Lost'
          };
          updatedFields.stage = 'Closed Lost';
        }
        updatedFields.probability = '0';
      }

      setFormData(prev => ({
        ...prev,
        ...updatedFields
      }));
    }

    // Close the dialog
    setStatusConfirmDialog({
      isOpen: false,
      newStatus: null,
      pendingChange: null
    });
  };

  // Handle status change cancellation
  const handleStatusCancel = () => {
    // Just close the dialog without making changes
    setStatusConfirmDialog({
      isOpen: false,
      newStatus: null,
      pendingChange: null
    });
  };

  // Check if stage and probability should be disabled
  const isStageDisabled = formData.status === 'Won' || formData.status === 'Lost';
  const isProbabilityDisabled = formData.status === 'Won' || formData.status === 'Lost';

  // Enhanced error parsing and messaging
  const parseApiError = (error, response) => {
    // Network or connection errors
    if (!error.response && error.code) {
      switch (error.code) {
        case 'NETWORK_ERROR':
          return {
            message: 'Network connection failed. Please check your internet connection and try again.',
            isRetryable: true,
            type: 'network'
          };
        case 'TIMEOUT':
          return {
            message: 'Request timed out. Please try again.',
            isRetryable: true,
            type: 'timeout'
          };
        default:
          return {
            message: 'Connection failed. Please check your network and try again.',
            isRetryable: true,
            type: 'connection'
          };
      }
    }

    // HTTP status code errors
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          return {
            message: 'Invalid data provided. Please check all required fields and try again.',
            isRetryable: false,
            type: 'validation'
          };
        case 401:
          return {
            message: 'Session expired. Please refresh the page and try again.',
            isRetryable: false,
            type: 'auth'
          };
        case 403:
          return {
            message: 'You do not have permission to create opportunities. Please contact your administrator.',
            isRetryable: false,
            type: 'permission'
          };
        case 409:
          return {
            message: 'An opportunity with this name already exists for this company. Please use a different name.',
            isRetryable: false,
            type: 'conflict'
          };
        case 422:
          return {
            message: 'Some required information is missing or invalid. Please review all fields.',
            isRetryable: false,
            type: 'validation'
          };
        case 500:
          return {
            message: 'Server error occurred. Please try again in a few moments.',
            isRetryable: true,
            type: 'server'
          };
        case 503:
          return {
            message: 'Service temporarily unavailable. Please try again later.',
            isRetryable: true,
            type: 'service'
          };
        default:
          return {
            message: `Unexpected error (${status}). Please try again or contact support.`,
            isRetryable: status >= 500,
            type: 'unknown'
          };
      }
    }

    // API response content errors
    if (response && response.Status === 'Error') {
      return {
        message: response.Message || 'The server returned an error. Please try again.',
        isRetryable: false,
        type: 'api'
      };
    }

    // Generic fallback
    return {
      message: error.message || 'An unexpected error occurred. Please try again.',
      isRetryable: true,
      type: 'generic'
    };
  };

  // Retry logic for retryable errors
  const retryApiCall = async (apiCallFn, maxRetries = 2) => {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await apiCallFn();
        setRetryCount(0); // Reset retry count on success
        return result;
      } catch (error) {
        lastError = error;
        const errorInfo = parseApiError(error);

        // Don't retry if error is not retryable
        if (!errorInfo.isRetryable || attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));

        setRetryCount(attempt + 1);
      }
    }

    throw lastError;
  };

  const saveOpportunity = async () => {
    setIsSaving(true);
    setError(null);
    setHasSubmitted(true);

    // Validate form data
    const errors = validateRequiredFields(formData);
    setValidationErrors(errors);

    // If validation fails, stop submission
    if (Object.keys(errors).length > 0) {
      setIsSaving(false);

      return false;
    }

    try {
      // Validate required fields for API payload
      if (!currentUser.id) {
        throw new Error('User session invalid. Please refresh the page and try again.');
      }

      // Get the selected customer ID for consistent use throughout payload
      const selectedCustomerId = formData.contactDetails?.ID || formData.contactId || formData.customerId;

      // Format data for API - mapping to the required payload structure
      // Ensure required fields are not empty (backend validation requirements)
      if (!formData.name || formData.name.trim() === '') {
        throw new Error('Opportunity Name is required and cannot be empty.');
      }

      if (!formData.stageDetails.ID || formData.stageDetails.ID<=0) {
        throw new Error('Opportunity Stage is required and cannot be empty.');
      }

      if (!formData.projCloseDate || formData.projCloseDate.trim() === '') {
        throw new Error('Projected Close Date is required and cannot be empty.');
      }

      // Critical: Validate customer selection to prevent FK constraint violations
      if (!selectedCustomerId || selectedCustomerId === '' || selectedCustomerId === '0') {
        throw new Error('Please select a customer before creating the opportunity. A valid customer is required to avoid database conflicts.');
      }

      const opportunityData = {
        ID: 0, // Always 0 for new opportunities
        Name: formData.name.trim(),
        Status: formData.status || 'Open',
        CloseDate: formData.projCloseDate, // Ensure this is not empty
        Amount: formData.amount || '',
        // Convert percentage string to number for API
        Probability: formData.probability ? parseInt(formData.probability.replace('%', '')) : 0,
        AssignedTODetails: formData.assignedRepDetails?.ID ?
          { ID: parseInt(formData.assignedRepDetails.ID), Name: formData.assignedRepDetails.Name } :
          { ID: currentUser.id, Name: currentUser.name }, // Use current user as default assignee
        BusinessUnitDetails: formData.businessUnitDetails && formData.businessUnitDetails.length > 0
          ? formData.businessUnitDetails.map(bu => ({
            ID: parseInt(bu.ID) || 0,
            Name: bu.Name || ""
          }))
          : (formData.businessUnit && formData.businessUnit.length > 0
            ? formData.businessUnit.map((name, index) => ({
              ID: parseInt(formData.businessUnitId[index]) || 0,
              Name: name
            }))
            : [{ ID: 0, Name: "" }]),
        BusinessUnitIDS: formData.businessUnitId && formData.businessUnitId.length > 0
          ? formData.businessUnitId.join(",")
          : "",
        ContactDetails: selectedCustomerId && selectedCustomerId !== '' && selectedCustomerId !== '0' ?
          { ID: selectedCustomerId.toString(), SalesRepID: currentUser.id } :
          null, // Send null instead of invalid IDs to prevent FK violations
        CreatedDate: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }), // Always use today's date
        CreatedBy: currentUser.id, // Use actual current user ID for API
        ModfiedDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }) + ' ' + new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }),
        NextStep: formData.nextSteps || "",
        Notes: formData.notes || "",
        OppLossReasonDetails: formData.lossReasonDetails?.ID ?
          { ID: formData.lossReasonDetails.ID, Name: formData.lossReasonDetails.Name } :
          { ID: null, Name: "" },
        OppStageDetails: formData.stageDetails?.ID ?
          { ID: formData.stageDetails.ID, Stage: formData.stageDetails.Stage } :
          { ID: null, Stage: formData.stage.trim() }, // Ensure stage is not empty
        OppTypeDetails: formData.opportunityType?.id ?
          { ID: formData.opportunityType.id, Name: formData.opportunityType.name } :
          { ID: null, Name: "" },
        OwnerDetails: formData.assignedRepDetails?.ID ?
          { ID: parseInt(formData.assignedRepDetails.ID) } :
          { ID: currentUser.id }, // Use current user as default owner
        ProductDetails: formData.productDetails && formData.productDetails.length > 0
          ? formData.productDetails.map(product => ({
            ID: parseInt(product.ID) || 0,
            Name: product.Name || ""
          }))
          : (formData.product && formData.product.length > 0
            ? formData.product.map((name, index) => ({
              ID: parseInt(formData.productId[index]) || 0,
              Name: name
            }))
            : [{ ID: 0, Name: "" }]),
        ProductIDS: formData.productDetails && formData.productDetails.length > 0
          ? formData.productDetails.map(product => product.ID).join(",")
          : (formData.productId && formData.productId.length > 0
            ? formData.productId.join(",")
            : ""),
        ProposalID: formData.proposalId || "",
        ProposalName: formData.proposalName || "",
        SalesPresenterDetails: formData.salesPresenterDetails?.ID ?
          { ID: parseInt(formData.salesPresenterDetails.ID), Name: formData.salesPresenterDetails.Name } :
          { ID: currentUser.id, Name: currentUser.name }, // Use current user as default presenter
        Source: formData.primaryCampaignSource || null,
        StageAction: "Add",
        SubContactDetails: selectedCustomerId && selectedCustomerId !== '' && selectedCustomerId !== '0' ?
          { ID: parseInt(selectedCustomerId), Name: formData.contactDetails?.Name || formData.contactName || "" } :
          null // Send null instead of invalid IDs to prevent FK violations
      };

      // Call API with retry logic
      const response = await retryApiCall(async () => {
        return await opportunitiesService.createOpportunity(opportunityData);
      });

      // Enhanced response validation
      if (response && (response.Status === 'Success' || response.content?.Status === 'Success')) {
        return true;
      } else if (response && response.Status === 'Error') {
        throw new Error(response.Message || 'Server returned an error');
      } else if (response && response.content?.Status === 'Error') {
        throw new Error(response.content.Message || 'Server returned an error');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorInfo = parseApiError(err);
      setError(errorInfo);

      return false;
    } finally {
      setIsSaving(false);
      setRetryCount(0);
    }
  };

  return {
    formData,
    handleInputChange,
    isLoading,
    saveOpportunity,
    isSaving,
    error,
    isCustomerSelected, // Expose the new state
    getFieldError,
    hasValidationErrors,
    hasSubmitted,
    retryCount, // Expose retry count for UI feedback
    currentUser, // Expose current user info for UI display
    // Status change confirmation
    statusConfirmDialog,
    handleStatusConfirm,
    handleStatusCancel,
    isStageDisabled,
    isProbabilityDisabled
  };
};
