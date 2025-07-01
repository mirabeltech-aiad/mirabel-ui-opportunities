
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
  UserID: 27,
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
  PageSize: 25,
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
  
  // Build filter parameters
  const filterParams = {
    ...dateParams
  };

  // Add sales rep filtering
  if (selectedRep && selectedRep !== 'all') {
    filterParams.AssignedTo = selectedRep;
  }

  // Add product filtering
  if (selectedProduct && selectedProduct !== 'all') {
    filterParams.Products = mapProductFilter(selectedProduct);
  }

  // Add business unit filtering
  if (selectedBusinessUnit && selectedBusinessUnit !== 'all') {
    filterParams.BusinessUnit = mapBusinessUnitFilter(selectedBusinessUnit);
  }

  return filterParams;
};
