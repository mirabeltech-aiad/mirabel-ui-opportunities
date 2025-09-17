const proposalsConfig = [
  {
    sectionName: "Quick Search",
    fields: [
      { label: "Proposal Name", key: "proposalName", type: "multiSelect" },
      { label: "Customer Name", key: "customerName", type: "multiSelect" },
      { label: "Select Sales Presenter", key: "salesPresenter", type: "multiSelect" },
      { label: "Select Created Rep", key: "createdRep", type: "multiSelect" },
      { label: "Select Assigned Rep", key: "assignedRep", type: "multiSelect" },
      { label: "Business Unit", key: "businessUnit", type: "multiSelect" },
      { label: "Product", key: "product", type: "multiSelect" },
      { label: "Primary Campaign Source", key: "primaryCampaignSource", type: "multiSelect" },
    ]
  },
  {
    sectionName: "Contact/Address Info",
    fields: [
      { label: "Email", key: "email", type: "multiSelect" },
      { label: "Phone Number", key: "phoneNumber", type: "multiSelect" },
      { label: "City", key: "city", type: "multiSelect" },
      { label: "State", key: "state", type: "multiSelect" },
      { label: "Zip/Postal Code", key: "zipPostalCode", type: "multiSelect" },
      { label: "County", key: "county", type: "multiSelect" },
      { label: "Country", key: "country", type: "multiSelect" },
    ]
  },
  {
    sectionName: "Opportunity Info",
    fields: [
      { label: "Status", key: "status", type: "multiSelect" },
      { label: "Stage", key: "stage", type: "multiSelect" },
      { label: "Probability", key: "probability", type: "multiSelect" },
      { label: "Created Date", key: "createdDate", type: "dateRange", fromKey: "createdDateFrom", toKey: "createdDateTo" },
      { label: "Projected Close Date", key: "projectedCloseDate", type: "dateRange", fromKey: "projectedCloseDateFrom", toKey: "projectedCloseDateTo" },
      { label: "Actual Close Date", key: "actualCloseDate", type: "dateRange", fromKey: "actualCloseDateFrom", toKey: "actualCloseDateTo" },
      { label: "Type", key: "type", type: "multiSelect" },
      { label: "Loss Reason", key: "lossReason", type: "multiSelect" },
    ]
  },
  {
    sectionName: "Proposal Info",
    fields: [
      { label: "Proposal Rep", key: "proposalRep", type: "multiSelect" },
      { label: "Proposal Name", key: "proposalName", type: "multiSelect" },
      { label: "Proposal ID", key: "proposalId", type: "multiSelect" },
      { label: "Proposal Status", key: "proposalStatus", type: "multiSelect" },
      { label: "Proposal Approval Status", key: "proposalApprovalStatus", type: "multiSelect" },
      { label: "Proposal Approval Stages", key: "proposalApprovalStages", type: "multiSelect" },
      { label: "Proposal Total", key: "proposalTotal", type: "multiSelect" },
      { label: "Proposal Created Date", key: "proposalCreatedDate", type: "dateRange", fromKey: "proposalCreatedDateFrom", toKey: "proposalCreatedDateTo" },
    ]
  }
];

export default proposalsConfig;