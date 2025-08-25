// Utility to build API payload for search requests
import { safeStringToArray } from '@OpportunityUtils/searchUtils';
import { getCurrentUserId } from '@/utils/userUtils';

// Helper function to format text search values (SW= format)
// Examples: 
// Single: "company" → "SW=company~"
// Multiple: ["the", "The 360 Agency", "The A Group"] → "SW=the~SW=The 360 Agency~SW=The A Group~"
const formatTextSearch = (value) => {
  if (!value) return "";
  
  // Handle arrays of values
  if (Array.isArray(value)) {
    return value.filter(v => v && v.toString().trim()).map(v => `SW=${v.toString().trim()}~`).join('');
  }
  
  // Handle comma-separated string values
  if (typeof value === 'string' && value.includes(',')) {
    const values = value.split(',').filter(v => v && v.trim());
    return values.map(v => `SW=${v.trim()}~`).join('');
  }
  
  // Handle single value that's already formatted
  if (typeof value === 'string' && value.startsWith('SW=')) return value;
  
  // Handle single value
  if (value && value.toString().trim()) {
    return `SW=${value.toString().trim()}~`;
  }
  
  return "";
};

// Helper function to format ID-based search values (IE= format)
// Examples: 
// Single: "123" → "IE=123~"
// Multiple: ["167", "178", "170", "182"] → "IE=167~IE=178~IE=170~IE=182~"
const formatIdSearch = (value) => {
  if (!value) return "";
  
  // Handle arrays of values
  if (Array.isArray(value)) {
    return value.filter(v => v && v.toString().trim()).map(v => `IE=${v.toString().trim()}~`).join('');
  }
  
  // Handle comma-separated string values
  if (typeof value === 'string' && value.includes(',')) {
    const values = value.split(',').filter(v => v && v.trim());
    return values.map(v => `IE=${v.trim()}~`).join('');
  }
  
  // Handle single value that's already formatted
  if (typeof value === 'string' && value.startsWith('IE=')) return value;
  
  // Handle single value
  if (value && value.toString().trim()) {
    return `IE=${value.toString().trim()}~`;
  }
  
  return "";
};

// Helper function to format date values
const formatDate = (dateValue) => {
  if (!dateValue) return "";
  try {
    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  } catch (error) {
    return "";
  }
};

/**
 * Builds API payload from form parameters
 * @param {Object} searchParams - The raw search parameters from the form
 * @param {string} searchType - Either 'opportunity' or 'proposal'
 * @returns {Object} API payload ready for /services/opportunities/report/all/
 */
export const buildSearchJson = (searchParams, searchType = 'opportunity') => {
  try {
    // Build the API payload structure
    // debugger;
    const apiPayload = {
      IDs: null,
      CustomerID: "",
      CustomerName: searchParams.companyName || searchParams.companyNameBasic ? 
        formatTextSearch(searchParams.companyName || searchParams.companyNameBasic) : "",
      OppName: searchParams.opportunityNameBasic || searchParams.opportunityName ? 
        (Array.isArray(searchParams.opportunityNameBasic || searchParams.opportunityName) ? 
          (searchParams.opportunityNameBasic || searchParams.opportunityName).join('') : 
          (searchParams.opportunityNameBasic || searchParams.opportunityName)) : "",
      Type: searchParams.type ? formatIdSearch(searchParams.type) : "",
      BusinessUnit: searchParams.businessUnit ? formatIdSearch(searchParams.businessUnit) : "",
      Source: searchParams.source || searchParams.primaryCampaign ? 
        formatIdSearch(searchParams.source || searchParams.primaryCampaign) : "",
      Products: searchParams.product ? formatIdSearch(searchParams.product) : "",
      LossReason: searchParams.winLossReason ? formatIdSearch(searchParams.winLossReason) : "",
      AssignedTo: searchParams.assignedRep ? formatIdSearch(searchParams.assignedRep) : "",
      Arth: searchParams.arth || "",
      SalesPresenter: searchParams.salesPresenter ? formatIdSearch(searchParams.salesPresenter) : null,
      Stage: searchParams.stage ? formatIdSearch(searchParams.stage) : "",
      CreatedBy: searchParams.createdRep ? formatIdSearch(searchParams.createdRep) : "",
      CreatedFrom: formatDate(searchParams.createdDateFrom),
      CreatedTo: formatDate(searchParams.createdDateTo),
      CloseFrom: formatDate(searchParams.closeDateFrom),
      CloseTo: formatDate(searchParams.closeDateTo),
      ActualCloseFrom: formatDate(searchParams.actualCloseDateFrom),
      ActualCloseTo: formatDate(searchParams.actualCloseDateTo),
      Status:
        (Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status) || "" 
        ,
      UserID: getCurrentUserId(),
      Probability: searchParams.probability ? formatIdSearch(searchParams.probability) : "",
      ListID: 0,
      
      // Advanced Search nested object
      AdvSearch: {
        UserID: "",
        CategoryID: "",
        ContactGroup: "",
        Contact: "",
        ContactIDs: "",
        Name: "",
        Agency: "",
        City: searchParams.city ? formatIdSearch(searchParams.city) : "",
        LastContactOption: "-1",
        LastContactFromDate: "",
        LastContactToDate: "",
        State: searchParams.state ? formatIdSearch(searchParams.state) : "",
        Email: searchParams.contactEmail || searchParams.email ? 
          formatTextSearch(searchParams.contactEmail || searchParams.email) : "",
        Phone: searchParams.contactPhone ? formatTextSearch(searchParams.contactPhone) : "",
        Mobile: "",
        Priority: "",
        Country: searchParams.country ? formatIdSearch(searchParams.country) : "",
        County: searchParams.county ? formatIdSearch(searchParams.county) : "",
        Zip: searchParams.zipCode || searchParams.postalCode ? 
          formatTextSearch(searchParams.zipCode || searchParams.postalCode) : "",
        SubContacts: -1,
        IsAgency: -1,
        CheckProductionSelected: false,
        CurrentContractID: 0,
        BusinessUnit: -1,
        Product: -1,
        IssueYear: -1,
        IssueID: -1,
        From: "",
        To: "",
        ContactType: "",
        BudgetPlanningFrom: "",
        BudgetPlanningTo: "",
        CustomFieldXML: "",
        SelectedContactIDs: "",
        EmailVerificationStatus: "",
        IsQuickSearch: false,
        Activity: "",
        ActivitySalesRep: "",
        IsGifter: false,
        SubscriptionStartDateFrom: "",
        SubscriptionStartDateTo: "",
        SubscriptionEndDateFrom: "",
        SubscriptionEndDateTo: "",
        SubscriptionBusinessUnit: "",
        SubscriptionProduct: "",
        CustomerType: -1,
        IsDigitalAdsAdvertiser: -1,
        Address: null,
        ContactAddedDateFrom: null,
        ContactAddedDateTo: null,
        LeadQuality: searchParams.leadQuality ? formatIdSearch(searchParams.leadQuality) : null,
        LeadTypes: searchParams.leadType ? formatIdSearch(searchParams.leadType) : null,
        ListID: 0,
        LeadSources: searchParams.leadSource ? formatIdSearch(searchParams.leadSource) : null,
        ProspectingStages: searchParams.prospectingStages ? formatIdSearch(searchParams.prospectingStages) : null,
        WorkFlows: searchParams.workFlows ? formatIdSearch(searchParams.workFlows) : null,
        ProspectingStageID: 0,
        ProspectingStageFromDate: null,
        ProspectingStageToDate: null,
        LeadStatus: searchParams.leadStatus ? formatIdSearch(searchParams.leadStatus) : null,
        InActive: false,
        CampaignStatus: null,
        CampaignName: null,
        CampaignSubject: null,
        CampaignCreatedDateFrom: "",
        CampaignCreatedDateTo: "",
        CampaignScheduleDateFrom: null,
        CampaignScheduleDateTo: null,
        CampaignActivity: null,
        PageType: 0,
        SelectedCampaignIDs: "",
        MKMContactIds: "",
        CampaignsFrom: "",
        SubsidiaryParentCompany: "",
        ProductTags: searchParams.tags || "",
        BusinessUnitTags: ""
      },
      
      Action: null,
      PageSize: 25,
      CurPage: 1,
      SortBy: "",
      ListName: "Latest Search",
      ViewType: 0,
      ResultType: searchType === 'proposal' ? 2 : 1,
      
      // Proposal-specific fields
      ProposalRep: searchParams.proposalRep ? formatIdSearch(searchParams.proposalRep) : "",
      ProposalName: searchParams.proposalName ? 
        (Array.isArray(searchParams.proposalName) ? 
          searchParams.proposalName.map(val => 
            val.startsWith('SW=') ? val : `SW=${val}~`
          ).join('') : 
          (typeof searchParams.proposalName === 'string' && searchParams.proposalName.startsWith('SW=') ? 
            searchParams.proposalName : 
            formatTextSearch(searchParams.proposalName))
        ) : "",
      // searchParams.proposalName ? 
      //   (Array.isArray(searchParams.proposalName) ? searchParams.proposalName.join("") : searchParams.proposalName) 
      //   : "",
      ProposalStatus: searchParams.proposalStatus ? formatIdSearch(searchParams.proposalStatus) : "",
      ProposalIDs: searchParams.proposalId ? formatTextSearch(searchParams.proposalId) : null,
      ProposalApprovalStatus: searchParams.proposalApprovalStatus ? formatIdSearch(searchParams.proposalApprovalStatus) : "",
      ProposalESignStatus: searchParams.proposalESignStatus ? formatIdSearch(searchParams.proposalESignStatus) : "",
      ProposalCreateDateRangeFrom: formatDate(searchParams.proposalCreatedDateFrom),
      ProposalCreateDateRangeTo: formatDate(searchParams.proposalCreatedDateTo),
      Mode: null,
      ProposalTotalRangeFrom: searchParams.proposalAmountFrom || "",
      ProposalTotalRangeTo: searchParams.proposalAmountTo || "",
      InternalApprovalStage: searchParams.proposalApprovalStages ? formatIdSearch(searchParams.proposalApprovalStages) : null
    };

    console.log('SearchJson Builder: Generated API payload:', {
      searchType,
      inputParamsCount: Object.keys(searchParams).length,
      resultType: apiPayload.ResultType,
      apiPayload
    });

    return apiPayload;
  } catch (error) {
    console.error('SearchJson Builder: Error building API payload:', error);
    throw error;
  }
};

/**
 * Extracts applied filters summary from API payload for UI display
 * @param {Object} apiPayload - The API payload object
 * @returns {Object} Summary of applied filters for UI display
 */
export const getSearchSummary = (apiPayload) => {
  const summary = {
    totalFilters: 0,
    appliedFilters: [],
    searchType: apiPayload.ResultType === 2 ? 'proposal' : 'opportunity'
  };

  // Check main fields for applied filters
  const mainFields = [
    { key: 'OppName', label: 'Opportunity Name' },
    { key: 'CustomerName', label: 'Company Name' },
    { key: 'BusinessUnit', label: 'Business Unit' },
    { key: 'AssignedTo', label: 'Assigned Rep' },
    { key: 'CreatedBy', label: 'Created Rep' },
    { key: 'SalesPresenter', label: 'Sales Presenter' },
    { key: 'Source', label: 'Source/Campaign' },
    { key: 'Products', label: 'Products' },
    { key: 'Stage', label: 'Stage' },
    { key: 'Status', label: 'Status' },
    { key: 'Probability', label: 'Probability' },
    { key: 'ProposalName', label: 'Proposal Name' },
    { key: 'ProposalRep', label: 'Proposal Rep' },
    { key: 'ProposalStatus', label: 'Proposal Status' }
  ];

  mainFields.forEach(field => {
    const value = apiPayload[field.key];
    if (value && value !== "" && value !== null) {
      summary.appliedFilters.push({
        field: field.key,
        label: field.label,
        value: value
      });
      summary.totalFilters++;
    }
  });

  // Check AdvSearch nested fields
  if (apiPayload.AdvSearch) {
    const advSearchFields = [
      { key: 'Email', label: 'Email' },
      { key: 'Phone', label: 'Phone' },
      { key: 'City', label: 'City' },
      { key: 'State', label: 'State' },
      { key: 'Country', label: 'Country' },
      { key: 'Zip', label: 'ZIP Code' }
    ];

    advSearchFields.forEach(field => {
      const value = apiPayload.AdvSearch[field.key];
      if (value && value !== "" && value !== null) {
        summary.appliedFilters.push({
          field: field.key,
          label: field.label,
          value: value
        });
        summary.totalFilters++;
      }
    });
  }

  return summary;
};

/**
 * Validates API payload structure
 * @param {Object} apiPayload - The API payload to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateSearchJson = (apiPayload) => {
  const errors = [];
  
  if (!apiPayload || typeof apiPayload !== 'object') {
    errors.push('API payload must be an object');
    return { isValid: false, errors };
  }
  
  if (!apiPayload.ResultType || ![1, 2].includes(apiPayload.ResultType)) {
    errors.push('API payload must have a valid ResultType (1 for Opportunity, 2 for Proposal)');
  }
  
  if (!apiPayload.AdvSearch || typeof apiPayload.AdvSearch !== 'object') {
    errors.push('API payload must have an AdvSearch object');
  }
  
  if (!apiPayload.UserID) {
    errors.push('API payload must have a UserID');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Example usage demonstrating how to generate API payload
 * This shows how form data gets transformed to the exact API format
 */
export const generateExamplePayload = () => {
  // Example form data from Advanced Search
  const exampleFormData = {
    companyName: "the",
    opportunityName: "the", 
    businessUnit: "1",
    createdRep: "178",
    proposalApprovalStatus: "2",
    proposalCreatedDateFrom: "2025-03-01"
  };

  // Generate API payload using our builder
  const apiPayload = buildSearchJson(exampleFormData, 'proposal');
  
  console.log('Example API Payload:', JSON.stringify(apiPayload, null, 2));
  
  return apiPayload;
};