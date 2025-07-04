import apiService from './apiService';
import httpClient, { userId } from './httpClient';

// Utility functions for payload formatting
export const getIcodeFromArray = (arr) => {
  let str = "";
  arr.map((x) => (str += `IE=${x}~`));
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
  // Strip % symbol and get numeric value
  const numericValue = probabilityFilter.replace('%', '');
  return getIcodeFromArray([numericValue]);
};

export const opportunitiesService = {
  async getOpportunities(filters = {}) {
    console.log('Received filters in service:', filters);
    
    // Use searchParams (filters) for mapping payload fields
    const searchParams = filters;
    
    // Handle opportunity name special values
    let oppNameValue = "";
    if (searchParams.opportunityName) {
      // For Proposals tab, use the exact value for special selections
      if (searchParams.opportunityName === 'IN=Is Empty~' || searchParams.opportunityName === 'INN=Is Not Empty~') {
        oppNameValue = searchParams.opportunityName;
      } else {
        oppNameValue = searchParams.opportunityName;
      }
    } else if (searchParams.opportunityNameBasic) {
      // For Opportunities tab, use the exact value for special selections
      if (searchParams.opportunityNameBasic === 'IN=Is Empty~' || searchParams.opportunityNameBasic === 'INN=Is Not Empty~') {
        oppNameValue = searchParams.opportunityNameBasic;
      } else {
        oppNameValue = searchParams.opportunityNameBasic;
      }
    }
    console.log('Setting OppName to:', oppNameValue);

    // Format Company Name with SW= prefix for search
    let customerNameValue = "";
    if (searchParams.companyNameBasic) {
      customerNameValue = `SW=${searchParams.companyNameBasic}~`;
    } else if (searchParams.companyName) {
      customerNameValue = `SW=${searchParams.companyName}~`;
    } else if (searchParams.customerName) {
      customerNameValue = `SW=${searchParams.customerName}~`;
    }
    console.log('Setting CustomerName to:', customerNameValue);

    // Process probability value for backend
    const probabilityValue = processProbabilityValue(searchParams.probability);
    console.log('Processed probability value:', {
      original: searchParams.probability,
      processed: probabilityValue
    });

    const requestPayload = {
      Action: null,
      ActualCloseFrom: formatDate(searchParams.actualCloseDateFrom) || "",
      ActualCloseTo: formatDate(searchParams.actualCloseDateTo) || "",
      ApprovalStatus: null,
      Arth: "  ",
      AssignedTo: searchParams.assignedRep ? getIcodeFromArray([searchParams.assignedRep]) : "",
      BusinessUnit: searchParams.businessUnit ? getIcodeFromArray([searchParams.businessUnit]) : "",
      City: searchParams.city ? getIcodeFromArray([searchParams.city]) : null,
      CloseFrom: "",
      CloseTo: "",
      Country: searchParams.country ? getIcodeFromArray([searchParams.country]) : null,
      County: null,
      CreatedBy: searchParams.createdRep ? getIcodeFromArray([searchParams.createdRep]) : "",
      CreatedFrom: formatDate(searchParams.createdDateFrom) || "",
      CreatedTo: formatDate(searchParams.createdDateTo) || "",
      CurPage: searchParams.CurPage !== undefined ? searchParams.CurPage : 1,
      CustomerID: "",
      CustomerName: customerNameValue,
      Email: searchParams.contactEmail ? getIcodeFromArray(searchParams.contactEmail) : null,
      InternalApprovalStage: "",
      LeadQuality: null,
      LeadSource: searchParams.leadSource ? getIcodeFromArray([searchParams.leadSource]) : null,
      LeadStatus: searchParams.leadStatus ? getIcodeFromArray([searchParams.leadStatus]) : null,
      LeadType: searchParams.leadType ? getIcodeFromArray([searchParams.leadType]) : null,
      ListId: searchParams.ListID || 0,
      LossReason: "",
      OppIDs: null,
      OppName: oppNameValue,
      PageSize: 0,
      Phone: searchParams.contactPhone ? getIcodeFromArray([searchParams.contactPhone]) : null,
      Probability: probabilityValue,
      Products: searchParams.product ? getIcodeFromArray([searchParams.product]) : "",
      ProposalCreateDateRangeFrom: null,
      ProposalCreateDateRangeTo: null,
      ProposalESignStatus: null,
      ProposalIDs: "",
      ProposalName: null,
      ProposalRep: null,
      ProposalStatus: null,
      ProposalTotalRangeFrom: null,
      ProposalTotalRangeTo: null,
      ProspectStage: null,
      ProspectingStage: -1,
      ProspectingStageFromDate: "",
      ProspectingStageToDate: "",
      Results: 0,
      SalesPresenter: searchParams.salesPresenter ? getIcodeFromArray([searchParams.salesPresenter]) : null,
      SortBy: null,
      Source: searchParams.source ? getIcodeFromArray([searchParams.source]) : (searchParams.primaryCampaign ? getIcodeFromArray([searchParams.primaryCampaign]) : ""),
      Stage: searchParams.stage ? getIcodeFromArray([searchParams.stage]) : "",
      State: searchParams.state ? getIcodeFromArray([searchParams.state]) : null,
      Status: searchParams.status || "",
      Type: searchParams.type ? getIcodeFromArray([searchParams.type]) : "",
      UserID:userId,
      ViewType: 0,
      WorkFlows: null,
      Zip: searchParams.postalCode ? getIcodeFromArray([searchParams.postalCode]) : null,

      // Legacy fields for backward compatibility
      IDs: null,
      CustomerID: searchParams.customerID || "",
      // Use the formatted customer name value here too
      CustomerName: customerNameValue,
      OppName: oppNameValue,
      Type: searchParams.type ? getIcodeFromArray([searchParams.type]) : "",
      BusinessUnit: searchParams.businessUnit ? getIcodeFromArray([searchParams.businessUnit]) : "",
      Source: searchParams.source ? getIcodeFromArray([searchParams.source]) : (searchParams.primaryCampaign ? getIcodeFromArray([searchParams.primaryCampaign]) : (searchParams.leadSource || "")),
      Products: searchParams.products || searchParams.product || "",
      LossReason: searchParams.lossReason || searchParams.winLossReason || "",
      AssignedTo: searchParams.assignedRepId ? searchParams.assignedRepId.toString() : 
                 (searchParams.assignedRep && searchParams.assignedRep !== "All Reps" ? searchParams.assignedRep : ""),
      Arth: searchParams.arth || "",
      SalesPresenter: searchParams.salesPresenter || searchParams.salesPresentation || "",
      Stage: searchParams.stage ? getIcodeFromArray([searchParams.stage]) : "",
      CreatedBy: searchParams.createdBy || searchParams.createdRep || "",
      CreatedFrom: formatDate(searchParams.createdFrom) || "",
      CreatedTo: formatDate(searchParams.createdTo) || "",
      CloseFrom: formatDate(searchParams.closeFrom) || formatDate(searchParams.estimatedCloseDate) || "",
      CloseTo: formatDate(searchParams.closeTo) || "",
      ActualCloseFrom: formatDate(searchParams.actualCloseFrom) || formatDate(searchParams.actualCloseDate) || "",
      ActualCloseTo: formatDate(searchParams.actualCloseTo) || "",
      Status: searchParams.status !== undefined && searchParams.status !== "" ? searchParams.status : "-1",
      UserID: userId,
      // Use processed probability value instead of raw filter value
      Probability: probabilityValue,
      AdvSearch: {
        UserID: "",
        CategoryID: "",
        ContactGroup: "",
        Contact: "",
        ContactIDs: "",
        Name: "",
        Agency: "",
        City: searchParams.city || "",
        LastContactOption: "-1",
        LastContactFromDate: "",
        LastContactToDate: "",
        State: searchParams.state || "",
        Email: searchParams.email || "",
        Phone: searchParams.phone || "",
        Mobile: searchParams.mobile || "",
        Priority: searchParams.priority || "",
        Country: searchParams.country || "",
        County: searchParams.county || "",
        Zip: searchParams.zip || "",
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
      Action: null,
      PageSize: 25,
      CurPage: searchParams.CurPage !== undefined ? searchParams.CurPage : 1,
      SortBy: "",
      ListName: "Latest Search",
      ViewType: 0,
      ResultType: 1,
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

    console.log('API Request Payload:', requestPayload);
    console.log('CurPage in payload:', requestPayload.CurPage);
    console.log('ListID in payload:', requestPayload.ListID);
    console.log('Source in payload:', requestPayload.Source);
    console.log('UserID in payload:', requestPayload.UserID);
    console.log('CustomerName formatted:', requestPayload.CustomerName);
    console.log('Probability in payload:', requestPayload.Probability);

    try {
      const response = await apiService.post('/services/opportunities/report/all/', requestPayload);
      console.log('Raw API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Response content type:', typeof response.content);
      console.log('Response content:', response.content);
      
      // Handle the response structure and extract opportunities
      let opportunities = [];
      let totalCount = 0;
      
      if (response && response.content && response.content.Data) {
        console.log('Using response.content.Data path');
        opportunities = response.content.Data.Opportunities || [];
        totalCount = response.content.Data.Total || opportunities.length;
      } else if (response && response.content && Array.isArray(response.content)) {
        console.log('Using response.content array path');
        opportunities = response.content;
        totalCount = opportunities.length;
      } else if (Array.isArray(response)) {
        console.log('Using response array path');
        opportunities = response;
        totalCount = opportunities.length;
      } else {
        console.log('No valid data structure found in response');
      }
      
      console.log('Extracted opportunities:', opportunities);
      console.log('Total count:', totalCount);
      console.log('Opportunities array length:', opportunities.length);
      return { opportunities, totalCount };
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
      return { opportunities: [], totalCount: 0 };
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
    console.log('Raw opportunity data fields available:');
    console.log('- ID:', opportunity.ID);
    console.log('- Name:', opportunity.Name);
    console.log('- Status:', opportunity.Status);
    console.log('- NextStep:', opportunity.NextStep);
    console.log('- ProductDetails:', opportunity.ProductDetails);
    console.log('- ContactDetails:', opportunity.ContactDetails);
    console.log('- SubContactDetails:', opportunity.SubContactDetails);
    console.log('- AssignedTo:', opportunity.AssignedTo);
    console.log('- OppStageDetails:', opportunity.OppStageDetails);
    console.log('- Amount:', opportunity.Amount);
    console.log('- Probability:', opportunity.Probability);
    console.log('- CloseDate:', opportunity.CloseDate);
    console.log('- LeadStatus:', opportunity.LeadStatus);
    console.log('- ActualCloseDate:', opportunity.ActualCloseDate);
    console.log('- CreatedDate:', opportunity.CreatedDate);
    console.log('- Notes:', opportunity.Notes);
    console.log('- ProposalID:', opportunity.ProposalID);

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
        if (!acc.hasOwnProperty(key) && key !== 'ContactDetails' && key !== 'SubContactDetails' && key !== 'OppStageDetails') {
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

  async getFormattedOpportunities(filters = {}) {
    const { opportunities, totalCount } = await this.getOpportunities(filters);
    console.log('Raw opportunities before formatting:', opportunities);
    console.log('Raw opportunities type:', typeof opportunities);
    console.log('Is opportunities array?', Array.isArray(opportunities));
    
    if (!Array.isArray(opportunities)) {
      console.error('Opportunities is not an array:', opportunities);
      return { formatted: [], totalCount: 0 };
    }
    
    const formatted = opportunities.map(opportunity => this.formatOpportunityForTable(opportunity));
    console.log('Formatted opportunities:', formatted);
    console.log('Formatted opportunities length:', formatted.length);
    return { opportunitiesData: formatted, totalCount };
  }
};
