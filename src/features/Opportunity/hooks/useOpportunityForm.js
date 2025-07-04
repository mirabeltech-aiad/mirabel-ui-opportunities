import { useState, useEffect } from "react";
import { useAuditTrail } from "./useAuditTrail";
import { useFormValidation } from "./useFormValidation";
import { toast } from "@/features/Opportunity/hooks/use-toast";
import apiService from "../Services/apiService";

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

export const useOpportunityForm = (opportunityId) => {
  // Initialize form validation
  const { 
    validateSingleField, 
    validateAllFields, 
    markFieldTouched, 
    getFieldError, 
    hasErrors,
    clearAllErrors 
  } = useFormValidation();

  // Initialize audit trail
  const { trackChange } = useAuditTrail(opportunityId);
  
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
    businessUnit: "", 
    businessUnitId: "", // Add businessUnitId field
    product: "", 
    productId: "", // Add productId field
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

  useEffect(() => {
    if (opportunityId) {
      // Fetch opportunity data from API
      setIsLoading(true);
      apiService.getOpportunityDetails(opportunityId)
        .then(response => {
          console.log('Opportunity API response:', response);
          
          if (response && response.content && response.content.Data) {
            const data = response.content.Data;
            
            // Helper function to get product name - prioritize ProductsArr over ProductDetails
            const getProductName = (data) => {
              // First check if ProductsArr exists and has items
              if (data.ProductsArr && Array.isArray(data.ProductsArr) && data.ProductsArr.length > 0) {
                return data.ProductsArr[0].Name || '';
              }
              // Fall back to ProductDetails
              return safeGet(data, 'ProductDetails.Name', '');
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
            
            // Map API response to form data with corrected mappings
            setFormData({
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
              businessUnit: getBusinessUnitName(data),
              businessUnitId: safeGet(data, 'BusinessUnitDetailsArr.0.ID') || safeGet(data, 'BusinessUnitDetails.ID', ''),
              product: getProductName(data),
              productId: getProductIdFromResponse(data),
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
            });
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
    
    setFormData(prev => ({
      ...prev,
      ...updatedData
    }));

    // Validate field on change
    validateSingleField(field, value, { ...formData, ...updatedData });

    // Track the change in audit trail
    if (oldValue !== value) {
      trackChange(field, oldValue, value, "Current User");
    }
  };

  const validateForm = () => {
    const isValid = validateAllFields(formData);
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before saving.",
        variant: "destructive"
      });
    }
    
    return isValid;
  };

  const saveOpportunity = async () => {
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
        BusinessUnitDetails: [{
          ID: getBusinessUnitId(formData.businessUnit, formData.businessUnitId),
          Name: formData.businessUnit || ""
        }],
        BusinessUnitIDS: getBusinessUnitId(formData.businessUnit, formData.businessUnitId),
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
          ? formData.productDetails 
          : [{
              ID: formData.product ? getProductId(formData.product, formData.productId) : "", // Fixed: Empty ID if no product selected
              Name: formData.product || ""
            }],
        ProductIDS: formData.productDetails && formData.productDetails.length > 0 
          ? formData.productDetails[0].ID 
          : (formData.product ? getProductId(formData.product, formData.productId) : ""), // Fixed: Empty ID if no product selected
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

      console.log('About to call /services/Opportunities API with payload:', payload);
      console.log('OppStageDetails in payload:', payload.OppStageDetails);
      console.log('OppTypeDetails in payload:', payload.OppTypeDetails);
      
      const response = await apiService.updateOpportunity(payload);
      
      console.log('API response from /services/Opportunities:', response);
      
      if (response) {
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
    validateForm,
    saveOpportunity,
    hasValidationErrors: hasErrors,
    getFieldError,
    markFieldTouched,
    clearValidationErrors: clearAllErrors,
    isLoading,
    isSaving
  };
};
