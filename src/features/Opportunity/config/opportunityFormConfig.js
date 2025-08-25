// Opportunity Tab Form Configuration
export const OPPORTUNITY_FORM_CONFIG = {
  sections: [
    {
      id: "primary-fields",
      title: "Quick Search",
      fields: [
        {
          fieldName: "opportunityNameBasic",
          label: "Opportunity Name",
          componentType: "enhanced-opportunity-name",
          placeholder: "Type opportunity name or select option...",
          gridCols: "col-span-12 sm:col-span-5"
        },
        {
          fieldName: "createdRep",
          label: "Opportunity Creator",
          componentType: "multiselect",
          dataSource: "opportunityCreators",
          placeholder: "Select creator",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "businessUnit",
          label: "Business Unit",
          componentType: "multiselect",
          dataSource: "businessUnits",
          placeholder: "Select business unit",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "product",
          label: "Product",
          componentType: "multiselect",
          dataSource: "products",
          placeholder: "Select product",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "companyName",
          label: "Company Name",
          componentType: "autocomplete",
          type: "company",
          placeholder: "Type to search companies...",
          gridCols: "col-span-12 sm:col-span-5"
        },
        {
          fieldName: "salesPresenter",
          label: "Sales Presenter",
          componentType: "multiselect",
          dataSource: "salesPresenters",
          placeholder: "Select presenter",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "assignedRep",
          label: "Assigned Rep",
          componentType: "multiselect",
          dataSource: "assignedReps",
          placeholder: "Select rep",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "primaryCampaign",
          label: "Primary Campaign Source",
          componentType: "multiselect",
          dataSource: "campaigns",
          placeholder: "Select campaign",
          gridCols: "col-span-12 sm:col-span-5"
        }
      ]
    },
    {
      id: "sales-pipeline",
      title: "Sales Pipeline & Process",
      fields: [
        {
          fieldName: "stage",
          label: "Stage",
          componentType: "multiselect",
          dataSource: "stages",
          placeholder: "Select stage",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "status",
          label: "Status",
          componentType: "multiselect",
          options: [
            { value: "Open", label: "Open" },
            { value: "Won", label: "Won" },
            { value: "Lost", label: "Lost" }
          ],
          placeholder: "Select status",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "priority",
          label: "Priority",
          componentType: "multiselect",
          options: [
            { value: "Critical", label: "Critical" },
            { value: "High", label: "High" },
            { value: "Medium", label: "Medium" },
            { value: "Low", label: "Low" }
          ],
          placeholder: "Select priority",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "probabilityMin",
          label: "Probability (Min %)",
          componentType: "textbox",
          type: "number",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "probabilityMax",
          label: "Probability (Max %)",
          componentType: "textbox",
          type: "number",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "closeDateFrom",
          label: "Close Date From",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "closeDateTo",
          label: "Close Date To",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "winLossReason",
          label: "Win/Loss Reason",
          componentType: "multiselect",
          dataSource: "lossReasons",
          placeholder: "Select reason",
          gridCols: "col-span-12 sm:col-span-6"
        }
      ]
    },
    {
      id: "financial-commercial",
      title: "Financial & Commercial Terms",
      fields: [
        {
          fieldName: "contractLength",
          label: "Contract Length",
          componentType: "multiselect",
          options: [
            { value: "Month-to-Month", label: "Month-to-Month" },
            { value: "3 months", label: "3 months" },
            { value: "6 months", label: "6 months" },
            { value: "1 year", label: "1 year" },
            { value: "2 years", label: "2 years" },
            { value: "3 years", label: "3 years" },
            { value: "Multi-year", label: "Multi-year" },
            { value: "Custom Term", label: "Custom Term" }
          ],
          placeholder: "Select length",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "forecastRevenueMin",
          label: "Forecast Min",
          componentType: "textbox",
          type: "number",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "forecastRevenueMax",
          label: "Forecast Max",
          componentType: "textbox",
          type: "number",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "annualRevenue",
          label: "Annual Revenue",
          componentType: "textbox",
          type: "number",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "implementationDateFrom",
          label: "Implementation From",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "implementationDateTo",
          label: "Implementation To",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "renewalDate",
          label: "Renewal Date",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "creditScore",
          label: "Credit Score",
          componentType: "textbox",
          type: "number",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "budgetRange",
          label: "Budget Range",
          componentType: "multiselect",
          options: [
            { value: "0-10k", label: "$0 - $10,000" },
            { value: "10k-50k", label: "$10,000 - $50,000" },
            { value: "50k-100k", label: "$50,000 - $100,000" },
            { value: "100k-500k", label: "$100,000 - $500,000" },
            { value: "500k+", label: "$500,000+" }
          ],
          placeholder: "Select budget range",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "paymentTerms",
          label: "Payment Terms",
          componentType: "multiselect",
          options: [
            { value: "net-30", label: "Net 30" },
            { value: "net-60", label: "Net 60" },
            { value: "net-90", label: "Net 90" }
          ],
          placeholder: "Select payment terms",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "fiscalYear",
          label: "Fiscal Year End",
          componentType: "multiselect",
          options: [
            { value: "january", label: "January" },
            { value: "june", label: "June" },
            { value: "december", label: "December" }
          ],
          placeholder: "Select month",
          gridCols: "col-span-12 sm:col-span-4"
        }
      ]
    },
    {
      id: "opportunity-details",
      title: "Opportunity Details",
      fields: [
        {
          fieldName: "opportunityId",
          label: "Opportunity ID",
          componentType: "textbox",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "leadType",
          label: "Lead Type",
          componentType: "multiselect",
          dataSource: "leadType",
          placeholder: "Select lead type",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "leadStatus",
          label: "Lead Status",
          componentType: "multiselect",
          dataSource: "leadStatus",
          placeholder: "Select lead status",
          gridCols: "col-span-12 sm:col-span-5"
        },
        {
          fieldName: "source",
          label: "Source",
          componentType: "multiselect",
          options: [
            { value: "CK Outbound", label: "CK Outbound" },
            { value: "Inbound", label: "Inbound" },
            { value: "Referral", label: "Referral" },
            { value: "Cold Call", label: "Cold Call" },
            { value: "Website", label: "Website" },
            { value: "Trade Show", label: "Trade Show" },
            { value: "Email Campaign", label: "Email Campaign" },
            { value: "Social Media", label: "Social Media" },
            { value: "Partner", label: "Partner" },
            { value: "Direct Mail", label: "Direct Mail" }
          ],
          placeholder: "Select source",
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
        }
      ]
    },
    {
      id: "account-company",
      title: "Account & Company Information",
      fields: [
        {
          fieldName: "companyName",
          label: "Company Name",
          componentType: "autocomplete",
          type: "company",
          placeholder: "Type to search companies...",
          gridCols: "col-span-12 sm:col-span-5"
        },
        {
          fieldName: "industry",
          label: "Industry",
          componentType: "multiselect",
          options: [
            "Technology", "Software", "Healthcare", "Finance", "Banking", "Insurance",
            "Manufacturing", "Automotive", "Retail", "E-commerce", "Education", "Government",
            "Non-profit", "Real Estate", "Construction", "Energy", "Utilities", "Telecommunications",
            "Media", "Entertainment", "Transportation", "Logistics", "Agriculture", "Hospitality",
            "Food & Beverage", "Pharmaceutical", "Biotechnology", "Legal Services", "Consulting", "Other"
          ].map(opt => ({ value: opt, label: opt })),
          placeholder: "Select industry",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "customerId",
          label: "Customer ID",
          componentType: "textbox",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "companySize",
          label: "Company Size",
          componentType: "multiselect",
          options: [
            { value: "Startup (1-10)", label: "Startup (1-10)" },
            { value: "Small (11-50)", label: "Small (11-50)" },
            { value: "Medium (51-200)", label: "Medium (51-200)" },
            { value: "Large (201-1000)", label: "Large (201-1000)" },
            { value: "Enterprise (1000+)", label: "Enterprise (1000+)" },
            { value: "Fortune 500", label: "Fortune 500" }
          ],
          placeholder: "Select size",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "accountManager",
          label: "Account Manager",
          componentType: "textbox",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "customerSince",
          label: "Customer Since",
          componentType: "textbox",
          type: "date",
          gridCols: "col-span-12 sm:col-span-2"
        },
        {
          fieldName: "timeframe",
          label: "Timeframe",
          componentType: "multiselect",
          options: [
            { value: "Immediate (0-30 days)", label: "Immediate (0-30 days)" },
            { value: "Short-term (1-3 months)", label: "Short-term (1-3 months)" },
            { value: "Medium-term (3-6 months)", label: "Medium-term (3-6 months)" },
            { value: "Long-term (6+ months)", label: "Long-term (6+ months)" }
          ],
          placeholder: "Select timeframe",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "decisionMaker",
          label: "Decision Maker",
          componentType: "textbox",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "currentSolution",
          label: "Current Solution",
          componentType: "multiselect",
          options: [
            { value: "None", label: "None" },
            { value: "Competitor A", label: "Competitor A" },
            { value: "Competitor B", label: "Competitor B" },
            { value: "In-house Solution", label: "In-house Solution" },
            { value: "Legacy System", label: "Legacy System" }
          ],
          placeholder: "Select solution",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "budget",
          label: "Budget",
          componentType: "textbox",
          type: "number",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "budgetMin",
          label: "Budget (Min)",
          componentType: "textbox",
          type: "number",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "budgetMax",
          label: "Budget (Max)",
          componentType: "textbox",
          type: "number",
          gridCols: "col-span-12 sm:col-span-3"
        }
      ]
    },
    {
      id: "contact-info",
      title: "Contact Information",
      fields: [
        {
          fieldName: "contactName",
          label: "Contact Name",
          componentType: "textbox",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "contactTitle",
          label: "Contact Title",
          componentType: "textbox",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "contactEmail",
          label: "Contact Email",
          componentType: "textbox",
          type: "email",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "contactPhone",
          label: "Contact Phone",
          componentType: "textbox",
          type: "tel",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "department",
          label: "Department",
          componentType: "textbox",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "influencer",
          label: "Influencer",
          componentType: "textbox",
          gridCols: "col-span-12 sm:col-span-4"
        }
      ]
    },

    {
      id: "geographic-territory",
      title: "Geographic & Territory",
      fields: [
        {
          fieldName: "country",
          label: "Country",
          componentType: "multiselect",
          dataSource: "countries",
          placeholder: "Select country",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "state",
          label: "State/Province",
          componentType: "multiselect",
          dataSource: "states",
          placeholder: "Select state",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "city",
          label: "City",
          componentType: "multiselect",
          dataSource: "cities",
          placeholder: "Select city",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "zipCode",
          label: "ZIP Code",
          componentType: "textbox",
          gridCols: "col-span-12 sm:col-span-3"
        },
        {
          fieldName: "territory",
          label: "Territory",
          componentType: "multiselect",
          options: [
            { value: "North", label: "North" },
            { value: "South", label: "South" },
            { value: "East", label: "East" },
            { value: "West", label: "West" },
            { value: "Central", label: "Central" },
            { value: "International", label: "International" }
          ],
          placeholder: "Select territory",
          gridCols: "col-span-12 sm:col-span-4"
        },
        {
          fieldName: "region",
          label: "Region",
          componentType: "textbox",
          gridCols: "col-span-12 sm:col-span-5"
        }
      ]
    }
  ]
};