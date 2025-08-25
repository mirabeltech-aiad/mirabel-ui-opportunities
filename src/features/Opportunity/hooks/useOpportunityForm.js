import { useState, useEffect } from "react";
import { useAuditTrail } from "./useAuditTrail";
import { useFormValidation } from "./useFormValidation";
import { toast } from "@/features/Opportunity/hooks/use-toast";
import { opportunitiesService } from "../Services/opportunitiesService";
import { isLostReasonRequired, hasValidLostReason, hasValidNotes } from '../utils/validationHelpers';

// Function to generate unique opportunity ID
const generateOpportunityId = () => {
  const prefix = 'OPP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Helper function to safely get nested object values
const safeGet = (obj, path, defaultValue = '') => {
  try {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  } catch (e) {
    return defaultValue;
  }
};

// Helper function to get business unit name from BusinessUnitDetailsArr
const getBusinessUnitName = (data) => {
  try {
    // Check if BusinessUnitDetailsArr exists and has data
    if (data.BusinessUnitDetailsArr && Array.isArray(data.BusinessUnitDetailsArr) && data.BusinessUnitDetailsArr.length > 0) {
      return data.BusinessUnitDetailsArr[0].Name || '';
    }
    // Fallback to BusinessUnitDetails if array is empty
    if (data.BusinessUnitDetails && data.BusinessUnitDetails.Name) {
      return data.BusinessUnitDetails.Name;
    }
    return '';
  } catch (e) {
    return '';
  }
};

// Helper function to format date from API - fixed to avoid timezone issues
const formatApiDate = (dateString) => {
  if (!dateString || dateString === "0001-01-01T00:00:00") return "";

  // Parse the date string and extract just the date part to avoid timezone conversion
  const datePart = dateString.split('T')[0]; // Gets "2025-06-26" from "2025-06-26T00:00:00"
  return datePart; // Return YYYY-MM-DD format directly without timezone conversion
};

// Helper function to format date for API (MM/DD/YYYY format)
const formatDateForApi = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

// Helper function to get assigned rep ID from name
const getAssignedRepId = (repName) => {
  // For now, return a default ID. In real implementation, this would map to actual rep IDs
  if (!repName) return 0;
  return 71; // Default assigned rep ID
};

// Helper function to get product ID from stored product ID
const getProductId = (productName, productId) => {
  // Use the stored productId if available, otherwise return default
  if (productId) return productId;
  if (!productName) return "";
  return "4"; // Default product ID
};

// Helper function to get business unit ID from business unit name
const getBusinessUnitId = (businessUnitName, businessUnitId) => {
  // Use the stored businessUnitId if available, otherwise return default
  if (businessUnitId) return businessUnitId;
  if (!businessUnitName) return "";
  return "1"; // Default business unit ID
};

// Helper function to get contact ID from contact name
const getContactId = (contactName) => {
  // For now, return a default ID. In real implementation, this would map to actual contact IDs
  if (!contactName) return 1611;
  return 1616; // Default contact ID based on the example
};

export const useOpportunityForm = (opportunityId, apiStages = []) => {
  // Initialize form validation
  const {
    validateSingleField,
    validateAllFields,
    markFieldTouched,
    getFieldError,
    hasErrors,
    clearAllErrors,
     validateRequiredFields,
  } = useFormValidation();

  // Initialize audit trail
  const { trackChange } = useAuditTrail(opportunityId);

  // Form validation state
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    opportunityId: "",
    proposalId: "",
    proposalName: "",
    name: "",
    company: "",
    contactName: "",
    status: "",
    stage: "",
    stageDetails: {}, // Add field for stage details with ID
    state: "",
    amount: "",
    probability: "",
    stagePercentage: "",
    opportunityType: {
      id: "",
      name: ""
    },
    opportunityTypeId: "", // Add new field for opportunity type ID
    businessUnit: [], // Changed to array for multiselect
    businessUnitId: [], // Changed to array for multiselect
    businessUnitDetails: [], // Add field for business unit details array
    product: [], // Changed to array for multiselect
    productId: [], // Changed to array for multiselect
    primaryCampaignSource: "",
    assignedRep: "",
    assignedRepDetails: {}, // Add field for assigned rep details
    createdBy: "",
    source: "",
    leadSource: "",
    leadType: "",
    leadStatus: "",
    salesPresentation: "",
    salesPresenterDetails: {}, // Add field for sales presenter details
    projCloseDate: "",
    actualCloseDate: "",
    createdDate: "",
    description: "",
    priority: "",
    location: "",
    remote: false,
    industry: "",
    companySize: "",
    budget: "",
    decisionMaker: "",
    timeframe: "",
    competitors: "",
    nextSteps: "",
    lastActivity: "",
    territory: "",
    campaign: "",
    referralSource: "",
    productInterest: "",
    painPoints: "",
    currentSolution: "",
    decisionCriteria: "",
    implementationDate: "",
    contractLength: "",
    renewalDate: "",
    lostReason: "",
    winReason: "",
    tags: "",
    notes: "",
    forecastRevenue: "",
    productDetails: [], // Add new field for product details array
    lossReasonDetails: {}, // Add new field for loss reason details
    contactDetails: {}
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Status change confirmation state
  const [statusConfirmDialog, setStatusConfirmDialog] = useState({
    isOpen: false,
    newStatus: null,
    pendingChange: null
  });

  // Preserve previous stage/probability when moving to Won/Lost so we can restore on Open
  const [previousStage, setPreviousStage] = useState('');
  const [previousStageDetails, setPreviousStageDetails] = useState({});
  const [previousProbability, setPreviousProbability] = useState('');
  
  // Flag to temporarily disable confirmations during batch operations
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  
  // Track original proposal state when form loads to distinguish existing vs new proposals
  const [originalProposalId, setOriginalProposalId] = useState('');

  // Function to get validation error for a specific field
  const getFieldValidationError = (fieldName) => {
    if (!hasSubmitted) return null;
    return validationErrors[fieldName] || null;
  };

  // Function to check if form has validation errors
  const hasValidationErrors = () => {
    return Object.keys(validationErrors).length > 0;
  };

  // Helper function to determine if unlink option should be shown
  const shouldShowUnlinkOption = () => {
    // Show unlink option only if:
    // 1. There's currently a linked proposal AND
    // 2. Either it's the original proposal OR it's a new proposal that has been saved
    const hasLinkedProposal = formData.proposalId && formData.proposalId.trim() !== '';
    const isOriginalProposal = formData.proposalId === originalProposalId;
    
    console.log('shouldShowUnlinkOption check:', {
      hasLinkedProposal,
      isOriginalProposal,
      currentProposalId: formData.proposalId,
      originalProposalId,
      result: hasLinkedProposal && isOriginalProposal
    });
    
    // Only show unlink for existing proposals that were already linked when form loaded
    return hasLinkedProposal && isOriginalProposal;
  };

  // Helper function to determine if proposal change represents a replacement
  const isProposalReplacement = (newProposalId) => {
    const hasOriginalProposal = originalProposalId && originalProposalId.trim() !== '';
    const isDifferentProposal = newProposalId !== originalProposalId;
    return hasOriginalProposal && isDifferentProposal;
  };

  // Function to update the original proposal ID after successful save
  const updateOriginalProposalId = (newProposalId) => {
    console.log('Updating original proposal ID from', originalProposalId, 'to', newProposalId);
    setOriginalProposalId(newProposalId || '');
  };

  // Function to handle batch updates (useful for proposal linking)
  const handleBatchInputChange = (updates) => {
    console.log('handleBatchInputChange called with:', updates);
    
    // Set batch updating flag to prevent confirmations
    setIsBatchUpdating(true);
    
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      console.log('Batch update result:', newData);
      
      // If form has been submitted, re-validate after batch update
      if (hasSubmitted) {
        setTimeout(() => {
          const liveErrors = validateRequiredFields(newData);
          setValidationErrors(liveErrors);
        }, 50);
      }
      
      return newData;
    });

    // Track changes in audit trail for significant fields
    Object.entries(updates).forEach(([field, value]) => {
      if (['proposalId', 'amount', 'product', 'businessUnit'].includes(field)) {
        trackChange(field, formData[field], value, "Current User");
      }
    });
    
    // Clear batch updating flag after a short delay
    setTimeout(() => {
      setIsBatchUpdating(false);
    }, 100);
  };

  // Function to handle proposal unlinking with immediate persistence
  const unlinkProposal = async () => {
    try {
      // Build the unlinking payload according to correct API structure
      const payload = {
        ID: opportunityId ? parseInt(opportunityId) : 0,
        Name: formData.name || "Opportunity",
        Status: formData.status || "Open",
        CloseDate: formatDateForApi(formData.projCloseDate),
        Amount: formData.amount ? formData.amount.toString() : "0.00",
        Probability: formData.probability ? parseInt(formData.probability) : 0,
        Source: formData.primaryCampaignSource || null,
        Notes: formData.notes || "",
        NextStep: formData.nextSteps || "",
        CreatedDate: formatDateForApi(formData.createdDate),
        ModfiedDate: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):(\d+)/, '$3-$1-$2 $4:$5:$6'),
        OppStageDetails: {
          ID: formData.stageDetails && formData.stageDetails.ID ? parseInt(formData.stageDetails.ID) : null,
          Stage: formData.stage || ""
        },
        ContactDetails: formData.contactDetails && formData.contactDetails.ID ? {
          ID: parseInt(formData.contactDetails.ID),
          SalesRepID:  parseInt(formData.assignedRepDetails.ID) 
        } : {
          ID: parseInt(formData.contactId) || 1611,
          SalesRepID: parseInt(formData.assignedRepDetails.ID) 
        },
        ProductDetails: formData.productDetails && formData.productDetails.length > 0
          ? formData.productDetails.map(product => ({
            Details: null,
            Products: null,
            ListOfProducts: null,
            ID: parseInt(product.ID) || 0,
            Name: product.Name || ""
          }))
          : (formData.product && formData.product.length > 0
            ? formData.product.map((name, index) => ({
              Details: null,
              Products: null,
              ListOfProducts: null,
              ID: parseInt(formData.productId[index]) || 0,
              Name: name
            }))
            : [{
              Details: null,
              Products: null,
              ListOfProducts: null,
              ID: 47,
              Name: "Classified Services"
            }]),
        OwnerDetails: {
          ID:  parseInt(formData.assignedRepDetails.ID) 
        },
        AssignedTODetails: formData.assignedRepDetails && formData.assignedRepDetails.ID ? {
          ID: parseInt(formData.assignedRepDetails.ID),
          Name: formData.assignedRepDetails.Name || formData.assignedRep || ""
        } : {
          ID: getAssignedRepId(formData.assignedRep),
          Name: formData.assignedRep || ""
        },
        SalesPresenterDetails: formData.salesPresenterDetails && formData.salesPresenterDetails.ID ? {
          ID: parseInt(formData.salesPresenterDetails.ID),
          Name: formData.salesPresenterDetails.Name || formData.salesPresentation || ""
        } : {
          ID: 0,
          Name: "*Unassigned*"
        },
        OppTypeDetails: {
          ID: formData.opportunityType && formData.opportunityType.id ? parseInt(formData.opportunityType.id) : (formData.opportunityTypeId ? parseInt(formData.opportunityTypeId) : null),
          Name: formData.opportunityType && formData.opportunityType.name ? formData.opportunityType.name : ""
        },
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
            : [{ ID: "", Name: "" }]),
        BusinessUnitIDS: formData.businessUnitId && formData.businessUnitId.length > 0
          ? formData.businessUnitId.join(",")
          : "",
        ProductIDS: formData.productId && formData.productId.length > 0
          ? formData.productId.join(",")
          : "",
        OppLossReasonDetails: formData.lossReasonDetails && formData.lossReasonDetails.ID ? {
          ID: parseInt(formData.lossReasonDetails.ID),
          Name: formData.lossReasonDetails.Name || formData.lostReason || ""
        } : {
          ID: null,
          Name: formData.lostReason || ""
        },
        StageAction: "Add",
        SubContactDetails: formData.contactDetails && formData.contactDetails.ID ? {
          ID: parseInt(formData.contactDetails.ID),
          Name: formData.contactDetails.Name || formData.contactName || ""
        } : {
          ID: parseInt(formData.contactId) || 0,
          Name: formData.contactName || ""
        },
        ProposalID: "" // Clear proposal link
      };

      // Call the API to unlink immediately
      const response = await opportunitiesService.updateOpportunity(payload);
      
      if (response) {
        // Update form data to reflect unlinked state
        setFormData(prev => ({
          ...prev,
          proposalId: '',
          proposalName: '',
          amount: '0',
          product: [],
          productId: [],
          productDetails: [],
          businessUnit: [],
          businessUnitId: [],
          businessUnitDetails: []
        }));
        
        toast({
          title: "Proposal Unlinked",
          description: "The proposal has been successfully unlinked from this opportunity.",
          variant: "default"
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to unlink proposal:', error);
      toast({
        title: "Error",
        description: "Failed to unlink proposal. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (opportunityId) {
      // Fetch opportunity data from API
      setIsLoading(true);
      opportunitiesService.getOpportunityDetails(opportunityId)
        .then(response => {
          console.log('🔍 Opportunity API response structure:', {
            response,
            hasContent: !!response?.content,
            hasData: !!response?.Data,
            responseType: typeof response,
            responseKeys: response ? Object.keys(response) : 'null'
          });

          // Handle response structure - now response is response directly
          let data = null;
          data = response.content.Data;        

          console.log('📊 Final data object:', data);

          if (data) {

            // Helper function to get product name - prioritize ProductsArr over ProductDetails
            const getProductName = (data) => {
              console.log('🔍 Getting product name from data:', {
                hasProductsArr: !!data.ProductsArr,
                productsArrLength: data.ProductsArr?.length,
                productsArrSample: data.ProductsArr?.[0],
                hasProductDetails: !!data.ProductDetails,
                productDetailsSample: data.ProductDetails
              });

              // First check if ProductsArr exists and has items
              if (data.ProductsArr && Array.isArray(data.ProductsArr) && data.ProductsArr.length > 0) {
                const productName = data.ProductsArr[0].Name || '';
                console.log('✅ Product name from ProductsArr:', productName);
                return productName;
              }
              // Fall back to ProductDetails
              const productName = safeGet(data, 'ProductDetails.Name', '');
              console.log('✅ Product name from ProductDetails:', productName);
              return productName;
            };

            // Helper function to get product ID - prioritize ProductsArr over ProductDetails
            const getProductIdFromResponse = (data) => {
              // First check if ProductsArr exists and has items
              if (data.ProductsArr && Array.isArray(data.ProductsArr) && data.ProductsArr.length > 0) {
                return data.ProductsArr[0].ID || '';
              }
              // Fall back to ProductDetails
              return safeGet(data, 'ProductDetails.ID', '');
            };

            // Helper function to get product details array - prioritize ProductsArr over ProductDetails
            const getProductDetailsArray = (data) => {
              // First check if ProductsArr exists and has items
              if (data.ProductsArr && Array.isArray(data.ProductsArr) && data.ProductsArr.length > 0) {
                return data.ProductsArr.map(product => ({
                  ID: product.ID,
                  Name: product.Name
                }));
              }
              // Fall back to ProductDetails if it exists
              if (data.ProductDetails && data.ProductDetails.Name) {
                return [{
                  ID: safeGet(data, 'ProductDetails.ID'),
                  Name: safeGet(data, 'ProductDetails.Name')
                }];
              }
              return [];
            };

            // Helper functions for multiselect business units - use names as values to match dropdown options
            const getBusinessUnitValues = (data) => {
              try {
                if (data.BusinessUnitDetailsArr && Array.isArray(data.BusinessUnitDetailsArr) && data.BusinessUnitDetailsArr.length > 0) {
                  return data.BusinessUnitDetailsArr.map(bu => bu.Name || '').filter(name => name);
                }
                if (data.BusinessUnitDetails && data.BusinessUnitDetails.Name) {
                  return [data.BusinessUnitDetails.Name];
                }
                return [];
              } catch (e) {
                return [];
              }
            };

            const getBusinessUnitIds = (data) => {
              try {
                if (data.BusinessUnitDetailsArr && Array.isArray(data.BusinessUnitDetailsArr) && data.BusinessUnitDetailsArr.length > 0) {
                  return data.BusinessUnitDetailsArr.map(bu => bu.ID).filter(id => id);
                }
                if (data.BusinessUnitDetails && data.BusinessUnitDetails.ID) {
                  return [data.BusinessUnitDetails.ID];
                }
                return [];
              } catch (e) {
                return [];
              }
            };

            const getBusinessUnitDetailsArray = (data) => {
              try {
                if (data.BusinessUnitDetailsArr && Array.isArray(data.BusinessUnitDetailsArr) && data.BusinessUnitDetailsArr.length > 0) {
                  return data.BusinessUnitDetailsArr.map(bu => ({
                    ID: bu.ID,
                    Name: bu.Name || ''
                  }));
                }
                if (data.BusinessUnitDetails && data.BusinessUnitDetails.Name) {
                  return [{
                    ID: data.BusinessUnitDetails.ID,
                    Name: data.BusinessUnitDetails.Name
                  }];
                }
                return [];
              } catch (e) {
                return [];
              }
            };

            // Helper functions for multiselect products - use names as values to match dropdown options
            const getProductValues = (data) => {
              try {
                if (data.ProductsArr && Array.isArray(data.ProductsArr) && data.ProductsArr.length > 0) {
                  return data.ProductsArr.map(product => product.Name || '').filter(name => name);
                }
                if (data.ProductDetails && data.ProductDetails.Name) {
                  return [data.ProductDetails.Name];
                }
                return [];
              } catch (e) {
                return [];
              }
            };

            const getProductIds = (data) => {
              try {
                if (data.ProductsArr && Array.isArray(data.ProductsArr) && data.ProductsArr.length > 0) {
                  return data.ProductsArr.map(product => product.ID).filter(id => id);
                }
                if (data.ProductDetails && data.ProductDetails.ID) {
                  return [data.ProductDetails.ID];
                }
                return [];
              } catch (e) {
                return [];
              }
            };

            // Map API response to form data with corrected mappings
            const newFormData = {
              opportunityId: opportunityId,
              proposalId: safeGet(data, 'ProposalID'),
              proposalName: safeGet(data, 'ProposalName'),
              name: safeGet(data, 'Name'),
              company: safeGet(data, 'ContactDetails.Name'),
              contactName: safeGet(data, 'SubContactDetails.ContactFullName') ||
                safeGet(data, 'SubContactDetails.ContactName') ||
                `${safeGet(data, 'SubContactDetails.FirstName')} ${safeGet(data, 'SubContactDetails.LastName')}`.trim(),
              status: safeGet(data, 'Status'),
              stage: safeGet(data, 'OppStageDetails.Stage'),
              stageDetails: data.OppStageDetails || {}, // Store complete stage details
              state: "",
              amount: safeGet(data, 'Amount', ''),
              probability: safeGet(data, 'Probability', ''),
              stagePercentage: safeGet(data, 'OppStageDetails.PercentClosed', ''),
              opportunityType: {
                id: safeGet(data, 'OppTypeDetails.ID'),
                name: safeGet(data, 'OppTypeDetails.Name')
              },
              opportunityTypeId: safeGet(data, 'OppTypeDetails.ID'),
              businessUnit: getBusinessUnitValues(data),
              businessUnitId: getBusinessUnitIds(data),
              businessUnitDetails: getBusinessUnitDetailsArray(data),
              product: getProductValues(data),
              productId: getProductIds(data),
              primaryCampaignSource: safeGet(data, 'Source'),
              assignedRep: safeGet(data, 'AssignedTODetails.Name'),
              assignedRepDetails: {
                ID: safeGet(data, 'AssignedTODetails.ID'),
                Name: safeGet(data, 'AssignedTODetails.Name')
              },
              createdBy: safeGet(data, 'OwnerDetails.Name') || safeGet(data, 'OwnerDetails.SalesRepName'),
              source: safeGet(data, 'Source'),
              leadSource: safeGet(data, 'LeadSource'),
              leadType: safeGet(data, 'LeadType'),
              leadStatus: safeGet(data, 'LeadStatus'),
              salesPresentation: safeGet(data, 'SalesPresenterDetails.Name') || safeGet(data, 'SalesPresenterDetails.SalesRepName'),
              salesPresenterDetails: {
                ID: safeGet(data, 'SalesPresenterDetails.ID'),
                Name: safeGet(data, 'SalesPresenterDetails.Name') || safeGet(data, 'SalesPresenterDetails.SalesRepName')
              },
              projCloseDate: formatApiDate(safeGet(data, 'CloseDate')),
              actualCloseDate: formatApiDate(safeGet(data, 'ActualCloseDate')),
              createdDate: formatApiDate(safeGet(data, 'CreatedDateTo')) || formatApiDate(safeGet(data, 'CreatedDate')),
              description: safeGet(data, 'Description'),
              priority: "",
              location: "",
              remote: false,
              industry: "",
              companySize: "",
              budget: "",
              decisionMaker: safeGet(data, 'SubContactDetails.ContactName'),
              timeframe: "",
              competitors: "",
              nextSteps: safeGet(data, 'NextStep'),
              lastActivity: safeGet(data, 'LastActivity'),
              territory: "",
              campaign: safeGet(data, 'Source'),
              referralSource: "",
              productInterest: getProductName(data),
              painPoints: "",
              currentSolution: "",
              decisionCriteria: "",
              implementationDate: "",
              contractLength: "",
              renewalDate: "",
              lostReason: safeGet(data, 'OppLossReasonDetails.Name'),
              lossReasonDetails: {
                ID: safeGet(data, 'OppLossReasonDetails.ID'),
                Name: safeGet(data, 'OppLossReasonDetails.Name')
              },
              winReason: "",
              tags: "",
              notes: safeGet(data, 'Notes'),
              forecastRevenue: safeGet(data, 'Amount', ''),
              productDetails: getProductDetailsArray(data),
              contactDetails: {
                ID: safeGet(data, 'SubContactDetails.ID'),
                Name: safeGet(data, 'SubContactDetails.ContactFullName') || safeGet(data, 'SubContactDetails.ContactName')
              }
            };

            console.log('🎯 Final formData product values:', {
              product: newFormData.product,
              productId: newFormData.productId,
              productDetails: newFormData.productDetails
            });

            setFormData(newFormData);
            
            // Capture original proposal ID to distinguish existing vs new proposals
            setOriginalProposalId(safeGet(data, 'ProposalID') || '');
          }
        })
        .catch(error => {
          console.error('Failed to fetch opportunity details:', error);
          toast({
            title: "Error",
            description: "Failed to load opportunity details. Please try again.",
            variant: "destructive"
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // For new opportunities, generate a unique ID and set current date
      setFormData(prev => ({
        ...prev,
        opportunityId: generateOpportunityId(),
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: "Current User"
      }));
    }
  }, [opportunityId]);

  const handleInputChange = (field, value) => {
    
    const oldValue = formData[field];
    
    // Skip confirmation for proposal-driven updates (when fields are being populated from proposal selection)
    // We detect this by checking if proposalId field is being set or if we're in batch updating mode
    const isProposalLinkingOperation = field === 'proposalId' || field === 'proposalName';
    const isProposalDrivenUpdate = isProposalLinkingOperation || isBatchUpdating;
    
    // If product changes and a proposal is linked, confirm and clear the link (but not during proposal selection)
    if ((field === 'product' || field === 'productId' || field === 'productDetails') && 
        formData.proposalId && !isProposalDrivenUpdate) {
      const changed = JSON.stringify(oldValue) !== JSON.stringify(value);
      if (changed) {
        // Show confirmation dialog before clearing proposal link
        const confirmed = window.confirm(
          'Changing the product will unlink the current proposal. Do you want to continue?'
        );
        if (confirmed) {
          // Clear proposal linkage and related locks
          setFormData(prev => ({
            ...prev,
            proposalId: '',
            proposalName: '',
            // Optionally clear amount if it came from proposal
            amount: '0'
          }));
        } else {
          // User cancelled, don't change the product
          return;
        }
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

    // Handle status change from Won/Lost to Open - clear stage and probability
    if (field === 'status' && value === 'Open' &&
      (formData.status === 'Won' || formData.status === 'Lost')) {
      // Restore previous stage/probability when changing from Won/Lost to Open
      setFormData(prev => ({
        ...prev,
        status: value,
        stage: previousStage || '',
        stageDetails: previousStageDetails || {},
        probability: previousProbability || '',
        stagePercentage: ''
      }));
      // Clear previous values after restore
      setPreviousStage('');
      setPreviousStageDetails({});
      setPreviousProbability('');

      // Track the change in audit trail
      const oldValue = formData[field];
      if (oldValue !== value) {
        trackChange(field, oldValue, value, "Current User");
      }

      return; // Don't continue with normal field update
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
    // Handle probability direct changes to 100 or 0 to set status Won/Lost with confirmation
    if (field === 'probability') {
      const num = parseInt(String(value).replace('%', ''), 10);
      
      if (num === 100 || num === 0) {
        const targetStatus = num === 100 ? 'Won' : 'Lost';
        const confirmMsg = `Set status to ${targetStatus} and update stage accordingly?`;
        if (window.confirm(confirmMsg)) {
          // Save previous only if transitioning from a non-closed status
          if (formData.status !== 'Won' && formData.status !== 'Lost') {
            setPreviousStage(formData.stage);
            setPreviousStageDetails(formData.stageDetails);
            setPreviousProbability(formData.probability);
          }
          // Find closed stage
          const closedStage = apiStages.find(s => (s.value || s.name) === `Closed ${targetStatus}`);
          const stageName = `Closed ${targetStatus}`;
          const stageId = closedStage ? (closedStage.id || closedStage.ID) : null;
         
            // Correct forecastRevenue calculation to use formData.amount and formData.probability (case-insensitive keys)
            // Also ensure values are numbers and handle empty/invalid input gracefully
            const amount = Number(formData.amount || 0);
            const probability = num || 0;
           
          
        
          setFormData(prev => ({
            ...prev,
            probability: String(num),
            forecastRevenue: ((amount * probability) / 100),
            status: targetStatus,
            stage: stageName,
            stageDetails: { ID: stageId, Stage: stageName },
            stagePercentage: String(num)
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

    // Handle opportunity type selection to store both ID and name
    let updatedData = { [field]: value };
    if (field === "opportunityType" && typeof value === 'object' && value.id && value.name) {
      updatedData = {
        opportunityType: value,
        opportunityTypeId: value.id
      };
    }

    // Auto-update stage percentage based on stage selection
    if (field === "stage") {
      const stagePercentages = {
        "1st Demo": "10",
        "Discovery": "25",
        "Proposal": "50",
        "Negotiation": "75",
        "Closed Won": "100",
        "Closed Lost": "0"
      };
      updatedData.stagePercentage = stagePercentages[value] || "";
    }

   
    

   
    const nextData = { ...formData, ...updatedData };
   
    // Use functional update to ensure React detects the change
    setFormData(nextData);

    // Validate field on change (fine-grained validator)
    validateSingleField(field, value, nextData);

    // If the form has been submitted once, keep the global validationErrors in sync
    if (hasSubmitted) {
      const liveErrors = validateRequiredFields(nextData);
      setValidationErrors(liveErrors);
    }

    // Track the change in audit trail
    if (oldValue !== value) {
      trackChange(field, oldValue, value, "Current User");
    }
  };

  // Handle status change confirmation
  const handleStatusConfirm = () => {
    const { newStatus, pendingChange } = statusConfirmDialog;

    if (pendingChange && newStatus) {
      let updatedData = {
        [pendingChange.field]: pendingChange.value
      };

      // Auto-update stage and probability based on status
      if (newStatus === 'Won') {
        // Find "Closed Won" stage from apiStages
        const closedWonStage = apiStages.find(stage =>
          stage.value === 'Closed Won' || stage.label === 'Closed Won' || stage.name === 'Closed Won'
        );

        if (closedWonStage) {
          updatedData.stageDetails = {
            ID: closedWonStage.id || closedWonStage.ID,
            Stage: closedWonStage.value || closedWonStage.name || 'Closed Won'
          };
          updatedData.stage = closedWonStage.value || closedWonStage.name || 'Closed Won';
        } else {
          // Fallback if stage not found in apiStages
          updatedData.stageDetails = {
            ID: null,
            Stage: 'Closed Won'
          };
          updatedData.stage = 'Closed Won';
        }
        updatedData.probability = '100';
        updatedData.stagePercentage = '100';
      } else if (newStatus === 'Lost') {
        // Find "Closed Lost" stage from apiStages
        const closedLostStage = apiStages.find(stage =>
          stage.value === 'Closed Lost' || stage.label === 'Closed Lost' || stage.name === 'Closed Lost'
        );

        if (closedLostStage) {
          updatedData.stageDetails = {
            ID: closedLostStage.id || closedLostStage.ID,
            Stage: closedLostStage.value || closedLostStage.name || 'Closed Lost'
          };
          updatedData.stage = closedLostStage.value || closedLostStage.name || 'Closed Lost';
        } else {
          // Fallback if stage not found in apiStages
          updatedData.stageDetails = {
            ID: null,
            Stage: 'Closed Lost'
          };
          updatedData.stage = 'Closed Lost';
        }
        updatedData.probability = '0';
        updatedData.stagePercentage = '0';
      }

      setFormData(prev => ({
        ...prev,
        ...updatedData
      }));

      // Track the change in audit trail
      const oldValue = formData[pendingChange.field];
      if (oldValue !== pendingChange.value) {
        trackChange(pendingChange.field, oldValue, pendingChange.value, "Current User");
      }
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

  const validateForm = () => {
    setHasSubmitted(true);

    // Run comprehensive validation
    const errors = validateRequiredFields(formData);
    console.log('🔍 validateForm errors:', errors);
    setValidationErrors(errors);

    // If validation fails, show toast and return false
    if (Object.keys(errors).length > 0) {
      // Show specific error message if lost reason is the main issue
      if (errors.lostReason && Object.keys(errors).length === 1) {
        toast({
          title: "Lost Reason Required",
          description: "Lost Reason is required when opportunity stage is 'Closed Lost'. Please select a reason before saving.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Validation Error",
          description: "Please fix the errors in the form before saving.",
          variant: "destructive"
        });
      }
      return false;
    }

    return true;
  };

  const saveOpportunity = async () => {
    
    if (!validateForm()) {
      return false;
    }
    setIsSaving(true);

    try {
      // Create the payload structure based on form data with proper IDs and formats
      const payload = {
        Amount: formData.amount ? formData.amount.toString() : "0",
        AssignedTODetails: formData.assignedRepDetails && formData.assignedRepDetails.ID ? {
          ID: parseInt(formData.assignedRepDetails.ID),
          Name: formData.assignedRepDetails.Name || formData.assignedRep || ""
        } : {
          ID: getAssignedRepId(formData.assignedRep),
          Name: formData.assignedRep || ""
        },
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
        CloseDate: formatDateForApi(formData.projCloseDate),
        ContactDetails: formData.contactDetails && formData.contactDetails.ID ? {
          ID: parseInt(formData.contactDetails.ID),
          SalesRepID: 1
        } : {
          ID: parseInt(formData.contactId) || 1611,
          SalesRepID: 1
        },
        CreatedDate: formatDateForApi(formData.createdDate),
        ID: opportunityId ? parseInt(opportunityId) : 0,
        ModfiedDate: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):(\d+)/, '$3-$1-$2 $4:$5:$6'),
        Name: formData.name || "Opportunity",
        NextStep: formData.nextSteps || "",
        Notes: formData.notes || "",
        ProposalID: formData.proposalId || "",
        ProposalName: formData.proposalName || "",
        OppLossReasonDetails: formData.lossReasonDetails && formData.lossReasonDetails.ID ? {
          ID: parseInt(formData.lossReasonDetails.ID),
          Name: formData.lossReasonDetails.Name || formData.lostReason || ""
        } : {
          ID: null,
          Name: formData.lostReason || ""
        },
        OppStageDetails: {
          ID: formData.stageDetails && formData.stageDetails.ID ? parseInt(formData.stageDetails.ID) : null,
          Stage: formData.stage || ""
        },
        OppTypeDetails: {
          ID: formData.opportunityType && formData.opportunityType.id ? parseInt(formData.opportunityType.id) : (formData.opportunityTypeId ? parseInt(formData.opportunityTypeId) : null),
          Name: formData.opportunityType && formData.opportunityType.name ? formData.opportunityType.name : ""
        },
        OwnerDetails: {
          ID: formData.assignedRepDetails?.ID ? parseInt(formData.assignedRepDetails.ID) : null // Fixed: Set to null if no owner details
        },
        Probability: formData.probability ? parseInt(formData.probability) : 0,
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
        ProductIDS: formData.productId && formData.productId.length > 0
          ? formData.productId.join(",")
          : "",
        SalesPresenterDetails: formData.salesPresenterDetails && formData.salesPresenterDetails.ID ? {
          ID: parseInt(formData.salesPresenterDetails.ID),
          Name: formData.salesPresenterDetails.Name || formData.salesPresentation || ""
        } : {
          ID: 0,
          Name: formData.salesPresentation || ""
        },
        Source: formData.primaryCampaignSource || null,
        StageAction: "Add",
        Status: formData.status || "Open",
        SubContactDetails: formData.contactDetails && formData.contactDetails.ID ? {
          ID: parseInt(formData.contactDetails.ID),
          Name: formData.contactDetails.Name || formData.contactName || ""
        } : {
          ID: parseInt(formData.contactId) || 0,
          Name: formData.contactName || ""
        }
      };

  

      const response = await opportunitiesService.updateOpportunity(payload);

     

      if (response) {
        // Update original proposal ID if it has changed (for new proposals or replacements)
        if (formData.proposalId && formData.proposalId !== originalProposalId) {
          updateOriginalProposalId(formData.proposalId);
        }
        
        toast({
          title: "Success",
          description: "Opportunity has been saved successfully.",
          variant: "default"
        });
        return true;
      } else {
        throw new Error('No response received from API');
      }

    } catch (error) {
      console.error('Failed to save opportunity to /services/Opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to save opportunity. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    handleInputChange,
    handleBatchInputChange,
    validateForm,
    saveOpportunity,
    unlinkProposal,
    shouldShowUnlinkOption,
    isProposalReplacement,
    updateOriginalProposalId,
    originalProposalId,
    hasValidationErrors: hasErrors,
    getFieldError: getFieldValidationError,
    markFieldTouched,
    clearValidationErrors: clearAllErrors,
    isLoading,
    isSaving,
    hasSubmitted,
    // Status change confirmation
    statusConfirmDialog,
    handleStatusConfirm,
    handleStatusCancel,
    isStageDisabled,
    isProbabilityDisabled
  };
};
