import { getPeriodDateParams } from './dateUtils';
import { mapProductFilter, mapBusinessUnitFilter } from './filterMappings';

// API parameter building helpers

export const getDefaultApiParams = () => ({
  IDs: null,
  CustomerID: "",
  CustomerName: "",
  OppName: "",
  Type: "",
  BusinessUnit: "",
  Source: "",
  Products: "",
  LossReason: "",
  AssignedTo: "",
  Arth: "",
  SalesPresenter: null,
  Stage: "",
  CreatedBy: "",
  CreatedFrom: "",
  CreatedTo: "",
  CloseFrom: "",
  CloseTo: "",
  ActualCloseFrom: "",
  ActualCloseTo: "",
  Status: "",
  UserID: null, // Will be set dynamically based on logged-in user
  Probability: "",
  AdvSearch: {
    UserID: "",
    CategoryID: "",
    ContactGroup: "",
    Contact: "",
    ContactIDs: "",
    Name: "",
    Agency: "",
    City: "",
    LastContactOption: "-1",
    LastContactFromDate: "",
    LastContactToDate: "",
    State: "",
    Email: "",
    Phone: "",
    Mobile: "",
    Priority: "",
    Country: "",
    County: "",
    Zip: "",
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
    LeadQuality: null,
    LeadTypes: null,
    ListID: 0,
    LeadSources: null,
    ProspectingStages: null,
    WorkFlows: null,
    ProspectingStageID: -1,
    ProspectingStageFromDate: "",
    ProspectingStageToDate: "",
    LeadStatus: null,
    InActive: false,
    CampaignStatus: "",
    CampaignName: "",
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
    ProductTags: "",
    BusinessUnitTags: ""
  },
  Action: null,
  PageSize: 1000, // Increased from 25 to ensure complete data retrieval for dashboard
  CurPage: 1,
  SortBy: "",
  ListName: "Latest Search",
  ViewType: 0,
  ResultType: 1, // 1 for opportunities, 2 for proposals
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
  ListID: 0
});

export const buildExecutiveDashboardParams = (
  period = 'this-quarter', 
  selectedRep = 'all', 
  customDateRange = null,
  selectedProduct = 'all',
  selectedBusinessUnit = 'all'
) => {
  const dateParams = getPeriodDateParams(period, customDateRange);
  const defaultParams = getDefaultApiParams();
  
  // Set dynamic UserID from httpClient with better error handling
  try {
    const { userId } = require('../httpClient');
    defaultParams.UserID = userId || 23; // Use default from httpClient
    console.log('Using UserID:', defaultParams.UserID);
  } catch (error) {
    console.warn('Could not import userId from httpClient, using fallback');
    defaultParams.UserID = 23; // Fallback if import fails
  }
  
  // Build filter parameters by merging defaults with date filters
  const filterParams = {
    ...defaultParams,
    ...dateParams
  };

  // Enhanced sales rep filtering with multiple field mapping
  if (selectedRep && selectedRep !== 'all' && selectedRep !== '') {
    filterParams.AssignedTo = selectedRep;
    filterParams.SalesPresenter = selectedRep;
    // Also set in AdvSearch section for comprehensive coverage
    filterParams.AdvSearch.AssignedTo = selectedRep;
    console.log('Applied sales rep filter:', selectedRep);
  }

  // Add product filtering
  if (selectedProduct && selectedProduct !== 'all') {
    filterParams.Products = mapProductFilter(selectedProduct);
  }

  // Add business unit filtering
  if (selectedBusinessUnit && selectedBusinessUnit !== 'all') {
    filterParams.BusinessUnit = mapBusinessUnitFilter(selectedBusinessUnit);
  }

  // Validate filter parameters
  console.log('Filter validation:', {
    hasValidDateRange: filterParams.CreatedFrom && filterParams.CreatedTo,
    hasRepFilter: filterParams.AssignedTo !== "",
    hasProductFilter: filterParams.Products !== "",
    hasBusinessUnitFilter: filterParams.BusinessUnit !== ""
  });

  return filterParams;
};
