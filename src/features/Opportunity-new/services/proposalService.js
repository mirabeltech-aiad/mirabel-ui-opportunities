import apiService from './apiService';
import { getCurrentUserId } from '@/utils/userUtils';

// Utility function to format multi-select values similar to opportunities
const formatMultiSelectValue = (value) => {
  if (!value) {
    console.log('🔍 DEBUG - formatMultiSelectValue: No value, returning empty string');
    return '';
  }

  // If it's already formatted (contains IE=), return as is
  if (typeof value === 'string' && value.includes('IE=')) {
    console.log('🔍 DEBUG - formatMultiSelectValue: Already formatted with IE=, returning as is:', value);
    return value;
  }
  
  if (Array.isArray(value)) {
    // If array, format each value
    const formatted = value
      .filter(v => v && typeof v === 'string' ? v.trim() : v)
      .map(v => `IE=${String(v).trim()}~`).join('');
    console.log('🔍 DEBUG - formatMultiSelectValue: Array input, formatted result:', {
      original: value,
      formatted
    });
    return formatted;
  }
  
  // If string, split by comma and format each value
  if (typeof value === 'string') {
    const values = value.split(',').filter(v => v.trim());
    const formatted = values.map(v => `IE=${v.trim()}~`).join('');
    console.log('🔍 DEBUG - formatMultiSelectValue: String input, formatted result:', {
      original: value,
      splitValues: values,
      formatted
    });
    return formatted;
  }
  
  // Fallback: just return as string
  const fallback = String(value);
  console.log('🔍 DEBUG - formatMultiSelectValue: Fallback case, returning as string:', fallback);
  return fallback;
};

// Utility function to format email with SW= prefix
const formatEmailValue = (value) => {
  if (!value) return '';

  // If it's already formatted (contains SW=), return as is
  if (value.includes('SW=')) return value;

  // Format email with SW= prefix
  return `SW=${value.trim()}~`;
};

// Utility function to format phone with SW= prefix
const formatPhoneValue = (value) => {
  if (!value) return '';

  // If it's already formatted (contains SW=), return as is
  if (value.includes('SW=')) return value;

  // Format phone with SW= prefix
  return `SW=${value.trim()}~`;
};

// Utility function to format zip with SW= prefix
const formatZipValue = (value) => {
  if (!value) return '';

  // If it's already formatted (contains SW=), return as is
  if (value.includes('SW=')) return value;

  // Format zip with SW= prefix
  return `SW=${value.trim()}~`;
};

// Utility function to format proposal IDs and names with SW= prefix
const formatProposalValue = (value) => {
  if (!value) return '';

  // If it's already formatted (contains SW=), return as is
  if (value.includes('SW=')) return value;

  // Format proposal value with SW= prefix
  return `SW=${value.trim()}~`;
};

// Utility function to format customer name with SW= prefix
const formatCustomerNameValue = (value) => {
  if (!value) return '';

  // If it's already formatted (contains SW=), return as is
  if (value.includes('SW=')) return value;

  // Format customer name with SW= prefix
  return `SW=${value.trim()}~`;
};

// Format date helper - Updated to MM/DD/YYYY format
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Helper function to safely parse business unit
const parseBusinessUnit = (businessUnit) => {
  if (!businessUnit) return -1;
  if (typeof businessUnit === 'number') return businessUnit;
  if (typeof businessUnit === 'string') {
    // If it's already formatted with IE=, extract the value
    if (businessUnit.includes('IE=')) {
      const match = businessUnit.match(/IE=([^~]+)~/);
      if (match && match[1]) {
        const parsed = parseInt(match[1]);
        return isNaN(parsed) ? -1 : parsed;
      }
    }
    const parsed = parseInt(businessUnit);
    return isNaN(parsed) ? -1 : parsed;
  }
  return -1;
};

export const getIcodeFromArray = (arr) => {
  if (!arr || arr.length === 0) return "";
  
  let str = "";
  arr.forEach((x) => {
    const value = String(x).trim();
    // If value already starts with IE=, it's already formatted
    if (value.startsWith('IE=')) {
      str += value.replace(/~+$/, '') + '~';
    } else {
      str += `IE=${value}~`;
    }
  });
  return str;
};

export const getSWcodeFromArray = (arr) => {
  if (!arr || arr.length === 0) return "";
  
  let str = "";
  arr.forEach((x) => {
    const value = String(x).trim();
    // If value already starts with IE=, it's already formatted
    if (value.startsWith('SW=')) {
      str += value.replace(/~+$/, '') + '~';
    } else {
      str += `SW=${value}~`;
    }
  });
  return str;
};

// Utility function to format ID values with IE= prefix (for status fields)
const formatIdValue = (value) => {
  if (!value) return '';

  // If it's already formatted (contains IE=), return as is
  if (value.includes('IE=')) return value;

  // For ID fields, we expect the value to be the ID directly
  return `IE=${value.trim()}~`;
};

export const proposalService = {
  async searchProposals(filters = {}) {
    try {
      // Filter out UI-specific parameters that shouldn't be sent to API
      const { fromAdvancedSearch, ...searchParams } = filters;

      // Build the complete payload with proper defaults and search parameter mapping
      const payload = {
        Action: null,
        ActualCloseFrom: formatDate(searchParams.actualCloseDateFrom) || "",
        ActualCloseTo: formatDate(searchParams.actualCloseDateTo) || "",
        AdvSearch: {
          UserID: "",
          CategoryID: "",
          ContactGroup: "",
          Contact: "",
          ContactIDs: "",
          Name: "",
          Agency: "",
          City: searchParams.city ? formatMultiSelectValue(searchParams.city) : "",
          LastContactOption: "-1",
          LastContactFromDate: "",
          LastContactToDate: "",
          State: searchParams.state ? formatMultiSelectValue(searchParams.state) : "",
          Email: (searchParams.contactEmail || searchParams.email) ? formatEmailValue(searchParams.contactEmail || searchParams.email) : "",
          Phone: (searchParams.contactPhone || searchParams.phoneNumber) ? formatPhoneValue(searchParams.contactPhone || searchParams.phoneNumber) : "",
          Mobile: searchParams.mobile || "",
          Priority: searchParams.priority || "",
          Country: searchParams.country ? formatMultiSelectValue(searchParams.country) : "",
          County: searchParams.county ? formatMultiSelectValue(searchParams.county) : "",
          Zip: (searchParams.postalCode || searchParams.zipPostalCode) ? searchParams.postalCode || searchParams.zipPostalCode : "",
          SubContacts: -1,
          IsAgency: -1,
          CheckProductionSelected: false,
          CurrentContractID: 0,
          BusinessUnit: parseBusinessUnit(searchParams.businessUnit),
          Product: searchParams.product ? parseInt(searchParams.product) : -1,
          IssueYear: -1,
          IssueID: -1,
          From: "",
          To: "",
          ContactType: searchParams.contactType || "",
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
          Address: searchParams.address || null,
          ContactAddedDateFrom: null,
          ContactAddedDateTo: null,
          LeadQuality: searchParams.leadQuality || null,
          LeadTypes: searchParams.leadType || null,
          ListID: 0,
          LeadSources: searchParams.leadSource || null,
          ProspectingStages: null,
          WorkFlows: null,
          ProspectingStageID: -1,
          ProspectingStageFromDate: "",
          ProspectingStageToDate: "",
          LeadStatus: searchParams.leadStatus || null,
          InActive: false,
          CampaignStatus: "",
          CampaignName: searchParams.campaign || searchParams.primaryCampaign || "",
          CampaignSubject: "",
          CampaignCreatedDateFrom: "",
          CampaignCreatedDateTo: "",
          CampaignScheduleDateFrom: "",
          CampaignScheduleDateTo: "",
          CampaignActivity: "",
          PageType: 0,
          SelectedCampaignIDs: "",
          MKMContactIds: "",
          CampaignsFrom: "",
          SubsidiaryParentCompany: "",
          ProductTags: searchParams.tags || "",
          BusinessUnitTags: ""
        },
        Arth: searchParams.arth || "",
        AssignedTo: searchParams.assignedRep ? formatMultiSelectValue(searchParams.assignedRep) : "",
        BusinessUnit: searchParams.businessUnit ? formatMultiSelectValue(searchParams.businessUnit) : "",
        CloseFrom: formatDate(searchParams.projectedCloseDateFrom) || "",
        CloseTo: formatDate(searchParams.projectedCloseDateTo) || "",
        CreatedBy: searchParams.createdBy || searchParams.createdRep ? formatMultiSelectValue(searchParams.createdBy || searchParams.createdRep) : "",
        CreatedFrom: formatDate(searchParams.createdFrom) || formatDate(searchParams.createdDateFrom) || "",
        CreatedTo: formatDate(searchParams.createdTo) || formatDate(searchParams.createdDateTo) || "",
        CurPage: searchParams.CurPage || 1,
        CustomerID: searchParams.customerID || "",
        CustomerName: searchParams.customerName || searchParams.companyName || searchParams.companyNameBasic ? formatCustomerNameValue(searchParams.customerName || searchParams.companyName || searchParams.companyNameBasic) : "",
        Email: (searchParams.contactEmail || searchParams.email) ? formatEmailValue(searchParams.contactEmail || searchParams.email) : "",
        IDs: null,
        InternalApprovalStage: searchParams.proposalApprovalStages || searchParams.internalApprovalStage ? formatMultiSelectValue(searchParams.proposalApprovalStages || searchParams.internalApprovalStage) : "",
        ListID: searchParams.ListID || 0,
        ListName: "Latest Search",
        LossReason: searchParams.lossReason || searchParams.winLossReason ? formatMultiSelectValue(searchParams.lossReason || searchParams.winLossReason) : "",
        Mode: null,
        OppName: searchParams.opportunityName ? 
          (typeof searchParams.opportunityName === 'string' && (searchParams.opportunityName.includes('IN=Is Empty~') || searchParams.opportunityName.includes('INN=Is Not Empty~')))
            ? searchParams.opportunityName 
            : getSWcodeFromArray(Array.isArray(searchParams.opportunityName) ? searchParams.opportunityName : String(searchParams.opportunityName).split(',').map(v => v.trim()).filter(v => v))
          : null,
        // searchParams.opportunityName || "",
        PageSize: 25,
        Probability: searchParams.probability ? formatMultiSelectValue(searchParams.probability) : "",
        Products: searchParams.products || searchParams.product ? formatMultiSelectValue(searchParams.products || searchParams.product) : "",
        ProposalApprovalStatus: searchParams.proposalApprovalStatus ? formatIdValue(searchParams.proposalApprovalStatus) : "",
        ProposalCreateDateRangeFrom: formatDate(searchParams.proposalCreatedDateFrom) || "",
        ProposalCreateDateRangeTo: formatDate(searchParams.proposalCreatedDateTo) || "",
        ProposalESignStatus: searchParams.proposalESignStatus || "",
        ProposalIDs: searchParams.proposalId ? formatProposalValue(searchParams.proposalId) : "",
        ProposalName: searchParams.proposalName ? formatProposalValue(searchParams.proposalName) : "",
        ProposalRep: (() => {
          const proposalRepValue = searchParams.proposalRep && searchParams.proposalRep !== "all" ? formatMultiSelectValue(searchParams.proposalRep) : "";
          console.log('🔍 DEBUG - proposalService: ProposalRep processing:', {
            input: searchParams.proposalRep,
            inputType: typeof searchParams.proposalRep,
            isAll: searchParams.proposalRep === "all",
            formattedValue: proposalRepValue,
            timestamp: new Date().toISOString()
          });
          return proposalRepValue;
        })(),
        ProposalStatus: searchParams.proposalStatus ? formatIdValue(searchParams.proposalStatus) : "",
        ProposalTotalRangeFrom: searchParams.proposalAmountFrom || "",
        ProposalTotalRangeTo: searchParams.proposalAmountTo || "",
        ResultType: 2,
        SalesPresenter: searchParams.salesPresenter ? formatMultiSelectValue(searchParams.salesPresenter) : null,
        SortBy: "",
        Source: searchParams.source ? formatMultiSelectValue(searchParams.source) : (searchParams.primaryCampaign ? formatMultiSelectValue(searchParams.primaryCampaign) : ""),
        Stage: searchParams.stage ? formatMultiSelectValue(searchParams.stage) : "",
        Status: searchParams.status !== undefined && searchParams.status !== "" ? searchParams.status : "",
        Type: searchParams.type ? formatMultiSelectValue(searchParams.type) : "",
        UserID: getCurrentUserId() || "",
        ViewType: 0
      };

      console.log('ProposalService: API payload:', payload);

      const response = await apiService.post('/services/opportunities/report/all/', payload);

      
      return response;

    } catch (error) {
      console.error('ProposalService: Failed to search proposals:', error);
      throw error;
    }
  },

  // Method to get all proposals with default parameters for grid display
  // async getAllProposals(page = 1) {
  //   try {
  //     console.log('ProposalService: Fetching all proposals for grid display, page:', page);

  //     // Use default search parameters to get all proposals, with page parameter
  //     return await this.searchProposals({ CurPage: page });

  //   } catch (error) {
  //     console.error('ProposalService: Failed to fetch all proposals:', error);
  //     throw error;
  //   }
  // },

  // Method to get column configuration from API
  async getColumnConfig() {
    try {
      console.log('ProposalService: Fetching column configuration from API');

      // Call the column config API: services/AdvSearches/ResultViewColumn/1/2/-1
      const response = await apiService.get('/services/AdvSearches/ResultViewColumn/1/2/-1');

      console.log('ProposalService: Column config API response:', response);

      return response;

    } catch (error) {
      console.error('ProposalService: Failed to fetch column config:', error);
      throw error;
    }
  }
};
