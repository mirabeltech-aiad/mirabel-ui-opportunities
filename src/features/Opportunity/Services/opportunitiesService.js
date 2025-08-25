import axiosService from '@/services/axiosService';
import apiService from './apiService';
import { getCurrentUserId } from '@/utils/userUtils';
import { API_URLS } from '@/utils/apiUrls';
const axiosInstance = axiosService;
// Utility functions for payload formatting
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

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Helper function to process probability value for backend
const processProbabilityValue = (probabilityFilter) => {
  if (!probabilityFilter || probabilityFilter === "All") {
    return "";
  }

  // If it's already in IE format, return as is
  if (typeof probabilityFilter === 'string' && probabilityFilter.includes('IE=')) {
    return probabilityFilter;
  }

  // Handle array of probability values
  if (Array.isArray(probabilityFilter)) {
    if (probabilityFilter.length === 0) {
      return "";
    }
    // Process each probability value and combine them
    const numericValues = probabilityFilter.map(prob => {
      if (typeof prob === 'string') {
        return prob.replace('%', '');
      }
      return prob;
    });
    return getIcodeFromArray(numericValues);
  }

  // Handle single string value (backward compatibility)
  if (typeof probabilityFilter === 'string') {
    const numericValue = probabilityFilter.replace('%', '');
    return getIcodeFromArray([numericValue]);
  }

  return "";
};

export const opportunitiesService = {
  async getOpportunities(filters = {}) {

    // Filter out UI-specific parameters that shouldn't be sent to API
    const { fromAdvancedSearch: FROM_ADV, ...apiFilters } = filters;

    // Use searchParams (apiFilters) for mapping payload fields
    const searchParams = apiFilters;

    // Handle opportunity name special values
    let oppNameValue = "";
    if (searchParams.opportunityNameBasic) {
      // For Proposals tab, use the exact value for special selections
      if (searchParams.opportunityName === 'IN=Is Empty~' || searchParams.opportunityName === 'INN=Is Not Empty~') {
        oppNameValue = searchParams.opportunityNameBasic;
      } else {
        // Concatenate if it's an array, otherwise use as-is
        oppNameValue = Array.isArray(searchParams.opportunityNameBasic) ? 
          searchParams.opportunityNameBasic.join('') : 
          searchParams.opportunityNameBasic;
      }
    } else if (searchParams.opportunityName) {
      // For Opportunities tab, use the exact value for special selections
      if (searchParams.opportunityNameBasic === 'IN=Is Empty~' || searchParams.opportunityNameBasic === 'INN=Is Not Empty~') {
        oppNameValue = searchParams.opportunityName;
      } else {
        // Concatenate if it's an array, otherwise use as-is
        oppNameValue = Array.isArray(searchParams.opportunityName) ? 
          searchParams.opportunityName.join('') : 
          searchParams.opportunityName;
      }
    }


    // Format Company Name with SW= prefix for search
    let customerNameValue = "";
    if (searchParams.companyNameBasic) {
      // Split by comma and format each value with SW= prefix and ~ suffix
      // const values = searchParams.companyNameBasic.split(',').filter(v => v.trim());
      // customerNameValue = values.map(v => `SW=${v.trim()}~`).join('');
      customerNameValue = searchParams.companyNameBasic;
    } else if (searchParams.companyName) {
      // Handle companyName the same way for consistency
      // const values = searchParams.companyName.split(',').filter(v => v.trim());
      // customerNameValue = values.map(v => `SW=${v.trim()}~`).join('');
      customerNameValue = searchParams.companyName;
    } else if (searchParams.customerName) {
      // Handle customerName the same way for consistency
      // const values = searchParams.customerName.split(',').filter(v => v.trim());
      // customerNameValue = values.map(v => `SW=${v.trim()}~`).join('');
      customerNameValue = searchParams.customerName;
    }


    // Process probability value for backend
    const probabilityValue = processProbabilityValue(searchParams.probability);


    // Format Email with SW= prefix for search (like company name)
    let emailValue = "";
    if (searchParams.contactEmail) {
      // Split by comma and format each value with SW= prefix and ~ suffix
      const values = Array.isArray(searchParams.contactEmail)
        ? searchParams.contactEmail
        : String(searchParams.contactEmail).split(',').filter(v => v.trim());
      emailValue = values.map(v => `SW=${v.trim()}~`).join('');
    }


    const requestPayload = {
      ActualCloseFrom: formatDate(searchParams.actualCloseFrom) || formatDate(searchParams.actualCloseDate) || formatDate(searchParams.actualCloseDateFrom) || "",
      ActualCloseTo: formatDate(searchParams.actualCloseTo) || formatDate(searchParams.actualCloseDateTo) || "",
      ApprovalStatus: null,
      Arth: searchParams.arth || "  ",
      AssignedTo: searchParams.assignedRepId ? searchParams.assignedRepId.toString() : (searchParams.assignedRep && searchParams.assignedRep !== "All Reps" ? (Array.isArray(searchParams.assignedRep) ? getIcodeFromArray(searchParams.assignedRep) : searchParams.assignedRep) : ""),
      BusinessUnit: searchParams.businessUnit ? getIcodeFromArray(Array.isArray(searchParams.businessUnit) ? searchParams.businessUnit : String(searchParams.businessUnit).split(',').map(v => v.trim()).filter(v => v)) : "",
      CloseFrom: formatDate(searchParams.closeFrom) || formatDate(searchParams.estimatedCloseDate) || "",
      CloseTo: formatDate(searchParams.closeTo) || "",
      CreatedBy: searchParams.createdRep ? getIcodeFromArray(Array.isArray(searchParams.createdRep) ? searchParams.createdRep : String(searchParams.createdRep).split(',').map(v => v.trim()).filter(v => v)) : "",
      CreatedFrom: formatDate(searchParams.createdFrom) || formatDate(searchParams.createdDateFrom) || "",
      CreatedTo: formatDate(searchParams.createdTo) || formatDate(searchParams.createdDateTo) || "",
      // CurPage is set later with final defaults
      // CustomerID provided in Additional fields section
      CustomerName: customerNameValue,
      // InternalApprovalStage finalized in trailing defaults
      LeadQuality: null,
      ListId: searchParams.ListID || 0,
      LossReason: searchParams.lossReason || searchParams.winLossReason || "",
      OppIDs: null,
      OppName: oppNameValue,
      // PageSize will be finalized below
      PageSize: 25,

      Probability: probabilityValue,
      Products: searchParams.products ? getIcodeFromArray(Array.isArray(searchParams.products) ? searchParams.products : String(searchParams.products).split(',').map(v => v.trim()).filter(v => v)) : (searchParams.product ? getIcodeFromArray(Array.isArray(searchParams.product) ? searchParams.product : String(searchParams.product).split(',').map(v => v.trim()).filter(v => v)) : ""),
      // Proposal fields are defined later with final defaults
      ProspectStage: null,
      ProspectingStage: -1,
      ProspectingStageFromDate: "",
      ProspectingStageToDate: "",
      Results: 0,
      SalesPresenter: searchParams.salesPresenter || searchParams.salesPresentation ? getIcodeFromArray([searchParams.salesPresenter || searchParams.salesPresentation]) : null,
      // SortBy is set later with final defaults
      Source: searchParams.source ? getIcodeFromArray(Array.isArray(searchParams.source) ? searchParams.source : String(searchParams.source).split(',').map(v => v.trim()).filter(v => v)) : (searchParams.primaryCampaign ? getIcodeFromArray([searchParams.primaryCampaign]) : ""),
      Stage: searchParams.stage ? getIcodeFromArray(Array.isArray(searchParams.stage) ? searchParams.stage : String(searchParams.stage).split(',').map(v => v.trim()).filter(v => v)) : "",
      State: searchParams.state ? getIcodeFromArray(Array.isArray(searchParams.state) ? searchParams.state : String(searchParams.state).split(',').map(v => v.trim()).filter(v => v)) : null,
      Status: searchParams.status || searchParams.quickStatus || "",
      Type: searchParams.type ? getIcodeFromArray([searchParams.type]) : "",
      UserID: getCurrentUserId(),
      // ViewType is set later with final defaults
      WorkFlows: null,

      // Additional fields for backward compatibility
      IDs: null,
      CustomerID: searchParams.customerID || "",
      AdvSearch: {
        UserID: "",
        CategoryID: "",
        ContactGroup: "",
        Contact: "",
        ContactIDs: "",
        Name: "",
        Agency: "",
        City: searchParams.city ? getIcodeFromArray(Array.isArray(searchParams.city) ? searchParams.city : String(searchParams.city).split(',').map(v => v.trim()).filter(v => v)) : null,
        LastContactOption: "-1",
        LastContactFromDate: "",
        LastContactToDate: "",
        Email: emailValue,
        Phone: searchParams.contactPhone || null,
        Mobile: searchParams.mobile || "",
        Priority: searchParams.priority || "",
        Country: searchParams.country ? getIcodeFromArray(Array.isArray(searchParams.country) ? searchParams.country : String(searchParams.country).split(',').map(v => v.trim()).filter(v => v)) : null,
        County: searchParams.county || "",
        Zip: searchParams.postalCode || "",
        SubContacts: -1,
        IsAgency: -1,
        CheckProductionSelected: false,
        CurrentContractID: 0,
        BusinessUnit: searchParams.businessUnit ? parseInt(searchParams.businessUnit) : -1,
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
        LeadTypes: searchParams.leadType ? getIcodeFromArray(Array.isArray(searchParams.leadType) ? searchParams.leadType : String(searchParams.leadType).split(',').map(v => v.trim()).filter(v => v)) : null,
        ListID: 0,
        LeadSources: searchParams.leadSource ? getIcodeFromArray(Array.isArray(searchParams.leadSource) ? searchParams.leadSource : String(searchParams.leadSource).split(',').map(v => v.trim()).filter(v => v)) : null,
        ProspectingStages: null,
        WorkFlows: null,
        ProspectingStageID: -1,
        ProspectingStageFromDate: "",
        ProspectingStageToDate: "",
        LeadStatus: (() => {
          // Try different case variations
          const leadStatusValue = searchParams.leadStatus || searchParams.LeadStatus || searchParams.leadstatus;

          if (leadStatusValue) {
            const processedValue = getIcodeFromArray(Array.isArray(leadStatusValue) ? leadStatusValue : String(leadStatusValue).split(',').map(v => v.trim()).filter(v => v));
            return processedValue;
          } else {
            return null;
          }
        })(),
        //searchParams.leadStatus || null,
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
      // Final defaults and report paging/sorting
      Action: null,
      CurPage: searchParams.CurPage !== undefined ? searchParams.CurPage : 1,
      SortBy: "",
      ListName: "Latest Search",
      ViewType: 0,
      ResultType: 1,
      // Proposal-related defaults (kept as empty strings)
      ProposalRep: "",
      ProposalName: "",
      ProposalStatus: "",
      ProposalIDs: "",
      ProposalApprovalStatus: "",
      ProposalESignStatus: "",
      ProposalCreateDateRangeFrom: "",
      ProposalCreateDateRangeTo: "",
      Mode: null,
      ProposalTotalRangeFrom: "",
      ProposalTotalRangeTo: "",
      InternalApprovalStage: "",
      ListID: searchParams.ListID || 0
    };

    

    try {
      // Import API_URLS to use centralized URL configuration
      const { API_URLS } = await import('@/utils/apiUrls');

      // Fetch opportunities data and column configuration in parallel
      const [response, columnConfigResponse] = await Promise.all([
        axiosInstance.post(API_URLS.OPPORTUNITIES.REPORT_ALL, requestPayload),
        this.getOpportunityColumnConfig()
      ]);

      

      // Handle the response structure and extract opportunities
      let opportunities = [];
      let totalCount = 0;
      let opportunityResult = {};
      let apiColumnConfig = [];

      // Extract data from axios response - the response has {responseHeader, content} structure
      const responseData = response;

      // Check if we have the nested content structure
      if (responseData && responseData.content && responseData.content.Data) {
        const contentData = responseData.content.Data;
        opportunities = contentData.Opportunities || [];
        totalCount = contentData.Total || opportunities.length;
        opportunityResult = (contentData.OpportunityResult && contentData.OpportunityResult[0]) || {};

        // Check for ColumnConfig in the main search response (as per updated documentation)
        if (contentData.ColumnConfig && Array.isArray(contentData.ColumnConfig)) {
          apiColumnConfig = contentData.ColumnConfig.map(item => ({
            id: item.PropertyMappingName ? item.PropertyMappingName.toLowerCase() : item.DBColumnsNames?.toLowerCase(),
            label: item.VisibleColumns || item.PropertyMappingName || item.DBColumnsNames,
            dbName: item.DBColumnsNames,
            propertyMappingName: item.PropertyMappingName,
            visibleColumns: item.VisibleColumns,
            isDefault: item.IsDefault,
            groupBy: item.GroupBy,
            sortOrder: item.SortOrder
          }));
        }
      } else if (responseData && responseData.Data) {
      
        opportunities = responseData.Data.Opportunities || [];
        totalCount = responseData.Data.Total || opportunities.length;
        opportunityResult = (responseData.Data.OpportunityResult && responseData.Data.OpportunityResult[0]) || {};

        // Check for ColumnConfig in the main search response (fallback path)
        if (responseData.Data.ColumnConfig && Array.isArray(responseData.Data.ColumnConfig)) {
          apiColumnConfig = responseData.Data.ColumnConfig.map(item => ({
            id: item.PropertyMappingName ? item.PropertyMappingName.toLowerCase() : item.DBColumnsNames?.toLowerCase(),
            label: item.VisibleColumns || item.PropertyMappingName || item.DBColumnsNames,
            dbName: item.DBColumnsNames,
            propertyMappingName: item.PropertyMappingName,
            visibleColumns: item.VisibleColumns,
            isDefault: item.IsDefault,
            groupBy: item.GroupBy,
            sortOrder: item.SortOrder
          }));
        }
      } else if (Array.isArray(responseData)) {
       
        opportunities = responseData;
        totalCount = opportunities.length;
      }

      // Process column configuration from the separate API call (only if not found in search response)
      if (apiColumnConfig.length === 0 && columnConfigResponse && columnConfigResponse.content) {
        const columnData = columnConfigResponse.content;

        // Map the column configuration with proper PropertyMappingName handling
        if (Array.isArray(columnData)) {
          apiColumnConfig = columnData.map(item => ({
            id: item.PropertyMappingName ? item.PropertyMappingName.toLowerCase() : item.DBName?.toLowerCase(),
            label: item.DisplayName || item.PropertyMappingName || item.DBName,
            dbName: item.DBName,
            propertyMappingName: item.PropertyMappingName,
            isDefault: item.IsDefault,
            isRequired: item.IsRequired,
            groupBy: item.GroupBy
          }));
        }
      }

      return { opportunities, totalCount, opportunityResult, apiColumnConfig };
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
      return { opportunities: [], totalCount: 0, opportunityResult: {}, apiColumnConfig: [] };
    }
  },

  formatOpportunityForTable(opportunity) {
    console.log('Formatting opportunity for table:', opportunity);
    console.log('Original opportunity object keys:', Object.keys(opportunity));

    // Handle cases where opportunity might have nested structure or missing properties
    const safeGetValue = (obj, path, defaultValue = '') => {
      try {
        return path.split('.').reduce((current, key) => {
          if (current && typeof current === 'object' && current[key] !== undefined) {
            // Handle the MaxDepthReached structure
            if (current[key] && typeof current[key] === 'object' && current[key]._type === 'MaxDepthReached') {
              return defaultValue;
            }
            return current[key];
          }
          return defaultValue;
        }, obj);
      } catch (e) {
        console.error('Error in safeGetValue:', e);
        return defaultValue;
      }
    };

    // Enhanced logging for debugging column mapping issues

    const formatted = {
      id: opportunity.ID || Math.random().toString(),
      status: safeGetValue(opportunity, 'Status', 'Open'),
      nextStep: safeGetValue(opportunity, 'NextStep', ''),
      product: safeGetValue(opportunity, 'ProductDetails.Name', opportunity.ProductName || ''),
      opportunityName: safeGetValue(opportunity, 'Name', 'Opportunity'),
      name: safeGetValue(opportunity, 'Name', 'Opportunity'), // Alias for opportunityName
      companyName: safeGetValue(opportunity, 'ContactDetails.Name', opportunity.CustomerName || 'Unknown Company'),
      contactName: safeGetValue(opportunity, 'SubContactDetails.Name', opportunity.SubContactName || ''),
      assignedRep: safeGetValue(opportunity, 'AssignedTo', 'Unassigned'),
      stage: safeGetValue(opportunity, 'OppStageDetails.Stage', opportunity.Stage || 'Unknown'),
      amount: opportunity.Amount || 0,
      probability: safeGetValue(opportunity, 'Probability', ''),
      projCloseDate: opportunity.CloseDate ? new Date(opportunity.CloseDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '',
      closeDate: opportunity.CloseDate ? new Date(opportunity.CloseDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '',
      leadStatus: safeGetValue(opportunity, 'LeadStatus', ''),
      actualCloseDate: opportunity.ActualCloseDate || '',
      createdDate: opportunity.CreatedDate || '',
      description: safeGetValue(opportunity, 'Notes', opportunity.Description || ''),
      proposalId: safeGetValue(opportunity, 'ProposalID', ''),
      lossReason: safeGetValue(opportunity, 'OppLossReasonDetails.Name', opportunity.LossReasonName || ''),
      salesPresenter: safeGetValue(opportunity, 'SalesPresenter', ''),
      businessUnit: safeGetValue(opportunity, 'BusinessUnitDetails.Name', opportunity.BusinessUnit || ''),
      createdBy: safeGetValue(opportunity, 'OwnerDetails.Name', opportunity.OwnerName || ''),
      forecastRevenue: opportunity.ForecastRevenue || 0,
      opportunityType: safeGetValue(opportunity, 'OppTypeDetails.Name', opportunity.TypeName || ''),
      source: safeGetValue(opportunity, 'Source', ''),
      lastActivity: safeGetValue(opportunity, 'LastActivity.Display', opportunity.OpportunityField || ''),
      lastActivityDate: safeGetValue(opportunity, 'LastActivity.LastActivity', opportunity.ActivityField || ''),
      opportunityId: opportunity.ID,
      contactId: opportunity.ContactDetails?.ID || opportunity.gsCustomersID || opportunity.contactId,

      // Additional fields that might be used in custom columns
      leadQuality: safeGetValue(opportunity, 'LeadQuality', ''),
      leadType: safeGetValue(opportunity, 'LeadType', ''),
      leadSource: safeGetValue(opportunity, 'LeadSource', ''),
      priority: safeGetValue(opportunity, 'Priority', ''),
      territory: safeGetValue(opportunity, 'Territory', ''),
      campaign: safeGetValue(opportunity, 'Campaign', ''),
      industry: safeGetValue(opportunity, 'Industry', ''),
      revenue: opportunity.Revenue || 0,
      employees: opportunity.Employees || '',
      website: safeGetValue(opportunity, 'Website', ''),
      phone: safeGetValue(opportunity, 'Phone', ''),
      email: safeGetValue(opportunity, 'Email', ''),
      address: safeGetValue(opportunity, 'Address', ''),
      city: safeGetValue(opportunity, 'City', ''),
      state: safeGetValue(opportunity, 'State', ''),
      zipCode: safeGetValue(opportunity, 'ZipCode', ''),
      country: safeGetValue(opportunity, 'Country', ''),

      // Preserve the original ContactDetails object for proper contact ID extraction
      ContactDetails: opportunity.ContactDetails,
      SubContactDetails: opportunity.SubContactDetails,
      OppStageDetails: opportunity.OppStageDetails,
      // Also preserve other potential ID fields as fallbacks
      ContactID: opportunity.ContactDetails?.ID || opportunity.ContactID,

      // Preserve stage data and other original opportunity data
      Stages: opportunity.Stages,
      stageHistory: opportunity.stageHistory,
      CreatedDate: opportunity.CreatedDate,
      ActualCloseDate: opportunity.ActualCloseDate,

      // Add proposal fields
      proposalName: safeGetValue(opportunity, 'Proposal.Name', opportunity.ProposalName || ''),
      proposalStatus: safeGetValue(opportunity, 'Proposal.Status', opportunity.ProposalStatus || ''),
      proposalApprovalStatus: safeGetValue(opportunity, 'Proposal.ApprovalStatus', opportunity.ProposalApprovalStatus || ''),
      proposalHistory: safeGetValue(opportunity, 'ProposalHistory', opportunity.ProposalHistoryIcon || ''),
      proposalESignStatus: safeGetValue(opportunity, 'Proposal.ESignature.Status', opportunity.ProposalESignStatus || ''),
      proposalContact: safeGetValue(opportunity, 'Proposal.SalesContact.Name', opportunity.ProposalContact || ''),
      proposalRep: safeGetValue(opportunity, 'Proposal.SalesRep.Name', opportunity.ProposalRep || ''),
      proposalAmount: opportunity.Proposal?.Amount || opportunity.ProposalAmount || 0,
      internalApprovalStage: safeGetValue(opportunity, 'Proposal.InternalApproval.StageName', opportunity.InternalApprovalStage || ''),

      // Add proposal history fields
      histCreated: safeGetValue(opportunity, 'ProposalHistory.Created', opportunity.Hist_created || ''),
      histActive: safeGetValue(opportunity, 'ProposalHistory.Active', opportunity.Hist_Active || ''),
      histInactive: safeGetValue(opportunity, 'ProposalHistory.Inactive', opportunity.Hist_Inactive || ''),
      histConvertedToContract: safeGetValue(opportunity, 'ProposalHistory.ConvertedToContract', opportunity.Hist_ConvertedtoContract || ''),
      histSent: safeGetValue(opportunity, 'ProposalHistory.Sent', opportunity.Hist_Sent || ''),
      histApproved: safeGetValue(opportunity, 'ProposalHistory.Approved', opportunity.Hist_Approved || ''),
      histReset: safeGetValue(opportunity, 'ProposalHistory.Reset', opportunity.Hist_Reset || ''),

      // Map stage timeline columns directly from the API response
      stageLeadAssigned: opportunity['stage_Lead Assigned'] || '',
      stageQualification: opportunity['Stage_Qualification'] || '',
      stageInitialContact: opportunity['Stage_Initial contact'] || '',
      stageMeeting: opportunity['Stage_Meeting '] || opportunity['Stage_Meeting'] || '',
      stageProposal: opportunity['stage_Proposal'] || '',
      stage2ndMeeting: opportunity['Stage_2nd Meeting'] || '',
      stage3rdMeeting: opportunity['stage_3rd Meeting'] || '',
      stageJulyMeeting: opportunity['stage_July meeting'] || '',
      stageClosedWon: opportunity['Stage_Closed Won'] || '',
      stageClosedLost: opportunity['Stage_Closed Lost'] || '',

      // Map all remaining fields from the original opportunity object to ensure no data is lost
      ...Object.keys(opportunity).reduce((acc, key) => {
        // Only add fields that don't already exist in the formatted object
        if (Object.prototype.hasOwnProperty.call(acc, key) === false && key !== 'ContactDetails' && key !== 'SubContactDetails' && key !== 'OppStageDetails') {
          const value = opportunity[key];
          // Handle nested objects by extracting their Name or Display property if available
          if (value && typeof value === 'object' && value.Name) {
            acc[key] = value.Name;
          } else if (value && typeof value === 'object' && value.Display) {
            acc[key] = value.Display;
          } else if (value !== null && value !== undefined && typeof value !== 'object') {
            acc[key] = value;
          }
        }
        return acc;
      }, {})
    };

    console.log('Formatted opportunity result:', formatted);
    console.log('Formatted opportunity keys:', Object.keys(formatted));
    return formatted;
  },

  // Method to get column configuration from API for opportunities
  async getOpportunityColumnConfig() {
    try {
      console.log('OpportunitiesService: Fetching opportunity column configuration from API');

      // Import API_URLS and use the correct endpoint for opportunities
      const { API_URLS } = await import('@/utils/apiUrls');
      const response = await apiService.get(API_URLS.ADVANCED_SEARCH.RESULT_VIEW_COLUMN_OPPORTUNITIES);

      console.log('OpportunitiesService: Column config API response:', response);

      return response;

    } catch (error) {
      console.error('OpportunitiesService: Failed to fetch opportunity column config:', error);
      throw error;
    }
  },

  async getFormattedOpportunities(filters = {}) {
    const { opportunities, totalCount, opportunityResult, apiColumnConfig } = await this.getOpportunities(filters);
    console.log('Raw opportunities before formatting:', opportunities);
    console.log('Raw opportunities type:', typeof opportunities);
    console.log('Is opportunities array?', Array.isArray(opportunities));

    if (!Array.isArray(opportunities)) {
      console.error('Opportunities is not an array:', opportunities);
      return { formatted: [], totalCount: 0, opportunityResult: {} };
    }

    const formatted = opportunities.map(opportunity => this.formatOpportunityForTable(opportunity));
    console.log('Formatted opportunities:', formatted);
    console.log('Formatted opportunities length:', formatted.length);
    return { opportunitiesData: formatted, totalCount, opportunityResult, apiColumnConfig };
  },
  // Kanban drag and drop stage update
  async updateOpportunityStageByDrag(opportunityId, stageId, loggedInUserId = null) {
    const userId = loggedInUserId || getCurrentUserId();
    const endpoint = `/services/Opportunities/Field/PipelineStageID/${opportunityId}/0/${userId}/Insert`;
    const response = await axiosInstance.post(endpoint, stageId);
    return response;
  },

  // Opportunity CRUD operations
  async updateOpportunity(opportunityData) {
    console.log('OpportunitiesService: Making POST request to /services/Opportunities');
    console.log('OpportunitiesService: Payload being sent:', opportunityData);
    const response = await axiosInstance.post(API_URLS.OPPORTUNITIES.BASE, opportunityData);
    console.log('OpportunitiesService: Response received:', response);
    return response;
  },

  async createOpportunity(opportunityData) {
    console.log('OpportunitiesService: Creating new opportunity with POST request to /services/Opportunities');
    console.log('OpportunitiesService: Create opportunity payload being sent:', opportunityData);
    const response = await axiosInstance.post(API_URLS.OPPORTUNITIES.BASE, opportunityData);
    console.log('OpportunitiesService: Create opportunity response received:', response);
    return response;
  },

  async deleteOpportunity(opportunityId, loggedInUserId = null) {
    const userId = loggedInUserId || getCurrentUserId();
    console.log('OpportunitiesService: Deleting opportunity with ID:', opportunityId, 'User ID:', userId);
    const endpoint = `/services/Opportunities/${opportunityId}/${userId}`;
    const response = await axiosInstance.delete(endpoint);
    console.log('OpportunitiesService: Delete opportunity response received:', response);
    return response;
  },

  async getOpportunityDetails(opportunityId) {
    console.log('OpportunitiesService: Fetching opportunity details for ID:', opportunityId);
    const response = await axiosInstance.get(`/services/Opportunities/${opportunityId}`);
    return response;
  },

  async getOpportunityHistory(opportunityId) {
    console.log('OpportunitiesService: Fetching opportunity history for ID:', opportunityId);
    const response = await axiosInstance.get(`/services/Opportunities/History/${opportunityId}/10/1`);
    return response;
  },

  // Opportunity metadata
  async getOpportunityTypes() {
    console.log('OpportunitiesService: Fetching opportunity types');
    const response = await axiosInstance.get(API_URLS.ADMIN.OPPORTUNITY_TYPES);
    console.log('OpportunitiesService: Opportunity Types API Response:', response);
    return response;
  },

  async getOpportunityLossReasons() {
    console.log('OpportunitiesService: Fetching opportunity loss reasons');
    const response = await axiosInstance.get(API_URLS.ADMIN.OPPORTUNITY_LOSS_REASONS);
    console.log('OpportunitiesService: Loss Reasons API Response:', response);
    return response;
  },

  async getOpportunityStages() {
    console.log('OpportunitiesService: Fetching opportunity stages');
    const response = await axiosInstance.get(API_URLS.ADMIN.OPPORTUNITY_STAGES);
    console.log('OpportunitiesService: Stages API Response:', response);
    return response;
  },

  async updateOpportunityStage(stageId, opportunityId) {
    console.log('OpportunitiesService: Updating opportunity stage for ID:', opportunityId, 'to stage:', stageId);
    const endpoint = `/services/Opportunities/Field/PipelineStageID/${opportunityId}/0/${getCurrentUserId()}/Insert`;
    const response = await axiosInstance.post(endpoint, stageId);
    console.log('OpportunitiesService: Stage update response received:', response);
    return response;
  }  ,
  // Toggle a stage timeline date (checkmark columns) using Insert/Delete actions
  async toggleOpportunityStageDate(opportunityId, stageId, shouldInsert) {
    try {
      const action = shouldInsert ? 'Insert' : 'Delete';
      const endpoint = `/services/Opportunities/Field/PipelineStageID/${opportunityId}/0/${getCurrentUserId()}/${action}`;
      console.log('OpportunitiesService: Toggling stage timeline date:', { opportunityId, stageId, action });
      const response = await axiosInstance.post(endpoint, stageId);
      return response;
    } catch (error) {
      console.error('OpportunitiesService: Failed to toggle stage timeline date', { opportunityId, stageId, shouldInsert, error });
      throw error;
    }
  }
};