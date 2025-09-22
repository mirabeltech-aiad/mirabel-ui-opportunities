const proposalsConfig = [
  {
    sectionName: "Quick Search",
    fields: [
      { label: "Proposal Name", key: "proposalName", type: "multiSelect" },
      { label: "Proposal ID", key: "proposalId", type: "multiSelect" },
      { label: "Company Name", key: "companyName", type: "multiSelect" },
      { label: "Opportunity Name", key: "opportunityName", type: "multiSelect" },
      { label: "Customer ID", key: "customerId", type: "multiSelect" },
    ]
  },
  {
    sectionName: "Proposal Details",
    fields: [
      { label: "Proposal Rep", key: "proposalRep", type: "multiSelect" },
      { label: "Proposal Status", key: "proposalStatus", type: "multiSelect" },
      { label: "Proposal Approval Status", key: "proposalApprovalStatus", type: "multiSelect" },
      { label: "Proposal Approval Stages", key: "proposalApprovalStages", type: "multiSelect" },
      { label: "Proposal E-Sign Status", key: "proposalESignStatus", type: "multiSelect" },
      { label: "Sales Presenter", key: "salesPresenter", type: "multiSelect" },
      { label: "Created Rep", key: "createdRep", type: "multiSelect" },
      { label: "Assigned Rep", key: "assignedRep", type: "multiSelect" },
      { label: "Business Unit", key: "businessUnit", type: "multiSelect" },
      { label: "Products", key: "products", type: "multiSelect" },
      { label: "Source", key: "source", type: "multiSelect" },
      { label: "Type", key: "type", type: "multiSelect" },
      { label: "Status", key: "status", type: "multiSelect" },
    ]
  },
  {
    sectionName: "Contact Information",
    fields: [
      { label: "Contact Email", key: "contactEmail", type: "multiSelect" },
      { label: "Contact Phone", key: "contactPhone", type: "multiSelect" },
      { label: "Mobile", key: "mobile", type: "multiSelect" },
      { label: "City", key: "city", type: "multiSelect" },
      { label: "State", key: "state", type: "multiSelect" },
      { label: "Zip/Postal Code", key: "zipPostalCode", type: "multiSelect" },
      { label: "County", key: "county", type: "multiSelect" },
      { label: "Country", key: "country", type: "multiSelect" },
      { label: "Address", key: "address", type: "multiSelect" },
      { label: "Contact Type", key: "contactType", type: "multiSelect" },
      { label: "Priority", key: "priority", type: "multiSelect" },
    ]
  },
  {
    sectionName: "Financial",
    fields: [
      { label: "Proposal Amount From", key: "proposalAmountFrom", type: "multiSelect" },
      { label: "Proposal Amount To", key: "proposalAmountTo", type: "multiSelect" },
    ]
  },
  {
    sectionName: "Date Ranges",
    fields: [
      { label: "Created Date", key: "createdDate", type: "dateRange", fromKey: "createdDateFrom", toKey: "createdDateTo" },
      { label: "Proposal Created Date", key: "proposalCreatedDate", type: "dateRange", fromKey: "proposalCreatedDateFrom", toKey: "proposalCreatedDateTo" },
    ]
  },
  {
    sectionName: "Lead Information",
    fields: [
      { label: "Lead Quality", key: "leadQuality", type: "multiSelect" },
      { label: "Lead Type", key: "leadType", type: "multiSelect" },
      { label: "Lead Source", key: "leadSource", type: "multiSelect" },
      { label: "Lead Status", key: "leadStatus", type: "multiSelect" },
    ]
  },
  {
    sectionName: "Marketing",
    fields: [
      { label: "Campaign", key: "campaign", type: "multiSelect" },
    ]
  },
  {
    sectionName: "Additional",
    fields: [
      { label: "Tags", key: "tags", type: "multiSelect" },
    ]
  }
];

export default proposalsConfig;