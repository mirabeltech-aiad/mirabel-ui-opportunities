// Proposal Tab Form Configuration
export const PROPOSAL_FORM_CONFIG = {
  sections: [
    {
      id: "primary-fields", 
      title: "Quick Search",
      fields: [
        {
          fieldName: "opportunityName",
          label: "Opportunity Name",
          componentType: "enhanced-proposal-opportunity-name",
          placeholder: "Type opportunity name or select option...",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "createdRep",
          label: "Created Rep",
          componentType: "multiselect",
          dataSource: "createdReps",
          placeholder: "Select created rep",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "businessUnit",
          label: "Business Unit",
          componentType: "multiselect",
          dataSource: "businessUnits",
          placeholder: "Select business unit",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "companyName",
          label: "Company Name",
          componentType: "autocomplete",
          placeholder: "Type to search companies...",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "assignedRep",
          label: "Assigned Rep",
          componentType: "multiselect",
          dataSource: "assignedReps",
          placeholder: "Select assigned rep",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "product",
          label: "Product",
          componentType: "multiselect",
          dataSource: "products",
          placeholder: "Select product",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "primaryCampaign",
          label: "Primary Campaign Source",
          componentType: "multiselect",
          dataSource: "campaignSources",
          placeholder: "Select campaign source",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "salesPresenter",
          label: "Sales Presenter",
          componentType: "multiselect",
          dataSource: "salesPresenters",
          placeholder: "Select sales presenter",
          gridCols: "col-span-12 sm:col-span-4"
        }
      ]
    },
    {
      id: "opportunity-info",
      title: "Opportunity Info",
      fields: [
        {
          fieldName: "status",
          label: "Status",
          componentType: "singleselect",
          options: [
            { value: "all", label: "All" },
            { value: "open", label: "Open" },
            { value: "won", label: "Won" },
            { value: "lost", label: "Lost" }
          ],
          placeholder: "Select status",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "createdDateFrom",
          label: "Created Date From",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "createdDateTo",
          label: "Created Date To",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "type",
          label: "Type",
          componentType: "multiselect",
          dataSource: "types",
          placeholder: "Select type",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "stage",
          label: "Stage",
          componentType: "multiselect",
          dataSource: "stages",
          placeholder: "Select stage",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "projectedCloseDateFrom",
          label: "Projected Close Date From",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "projectedCloseDateTo",
          label: "Projected Close Date To",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "lossReason",
          label: "Loss Reason",
          componentType: "multiselect",
          dataSource: "lossReasons",
          placeholder: "Select loss reason",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "probability",
          label: "Probability",
          componentType: "multiselect",
          options: [
            { value: "All", label: "All" },
            { value: "0", label: "0%" },
            { value: "10", label: "10%" },
            { value: "20", label: "20%" },
            { value: "30", label: "30%" },
            { value: "40", label: "40%" },
            { value: "50", label: "50%" },
            { value: "60", label: "60%" },
            { value: "70", label: "70%" },
            { value: "80", label: "80%" },
            { value: "90", label: "90%" },
            { value: "100", label: "100%" }
          ],
          placeholder: "Select probability",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "actualCloseDateFrom",
          label: "Actual Close Date From",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "actualCloseDateTo",
          label: "Actual Close Date To",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-4"
        }
      ]
    },
    {
      id: "contact-address-info",
      title: "Contact/Address Info",
      fields: [
        {
          fieldName: "contactEmail",
          label: "Email",
          componentType: "autocomplete",
          placeholder: "Type to search emails...",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "contactPhone",
          label: "Phone Number",
          componentType: "enhanced-phone",
          placeholder: "Enter phone number",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "postalCode",
          label: "Zip Code",
          componentType: "enhanced-zipcode",
          placeholder: "Enter ZIP code",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "city",
          label: "City",
          componentType: "multiselect",
          dataSource: "contactCities",
          placeholder: "Select city",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "state",
          label: "State",
          componentType: "multiselect",
          dataSource: "contactStates",
          placeholder: "Select state",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "country",
          label: "Country",
          componentType: "multiselect",
          dataSource: "contactCountries",
          placeholder: "Select country",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "county",
          label: "County",
          componentType: "multiselect",
          dataSource: "contactCounties",
          placeholder: "Select county",
          gridCols: "col-span-12 sm:col-span-4"
        }
      ]
    },
    {
      id: "proposal-info",
      title: "Proposal Info",
      fields: [
        {
          fieldName: "proposalRep",
          label: "Proposal Rep",
          componentType: "multiselect",
          dataSource: "proposalReps",
          placeholder: "Select proposal rep",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "proposalStatus",
          label: "Proposal Status",
          componentType: "multiselect",
          options: [
            { value: "1", label: "No Line Items" },
            { value: "2", label: "InActive" },
            { value: "3", label: "Active" },
            { value: "4", label: "Converted to contract" }
          ],
          placeholder: "Select proposal status",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "proposalAmountFrom",
          label: "Proposal Amount From",
          componentType: "textbox",
          type: "number",
          gridCols: "col-span-12 sm:col-span-2"
        },
        {
          fieldName: "proposalAmountTo",
          label: "Proposal Amount To",
          componentType: "textbox",
          type: "number",
          gridCols: "col-span-12 sm:col-span-2"
        },
        {
          fieldName: "proposalName",
          label: "Proposal Name",
          componentType: "enhanced-proposal-name",
          placeholder: "Type proposal name...",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "proposalApprovalStatus",
          label: "Proposal Approval Status",
          componentType: "multiselect",
          dataSource: "proposalApprovalStatuses",
          placeholder: "Select approval status",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "proposalCreatedDateFrom",
          label: "Proposal Created Date From",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-2"
        },
        {
          fieldName: "proposalCreatedDateTo",
          label: "Proposal Created Date To",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-2"
        },
        {
          fieldName: "proposalId",
          label: "Proposal ID",
          componentType: "enhanced-proposal-id",
          placeholder: "Type proposal ID...",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "proposalApprovalStages",
          label: "Proposal Approval Stage",
          componentType: "multiselect",
          dataSource: "proposalApprovalStages",
          placeholder: "Select approval stages",
          gridCols: "col-span-12 sm:col-span-4"
        }
      ]
    }
  ]
};