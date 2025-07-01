
export const UserId=23;
export const IsAdmin = true;

// Extracted dropdown options for better maintainability with industry standards
export const OPPORTUNITY_OPTIONS = {
  status: ["Open", "Won", "Lost"],
  stage: ["Lead", "Qualification", "Discovery", "Proposal", "Negotiation", "Closed Won", "Closed Lost"],
  rep: ["Courtney Karp", "Michael Scott", "Jim Halpert", "Pam Beesly", "Dwight Schrute", "Angela Martin", "Stanley Hudson", "Phyllis Vance"],
  source: ["CK Outbound", "Inbound", "Referral", "Cold Call", "Website", "Trade Show", "Email Campaign", "Social Media", "Partner", "Direct Mail"],
  leadType: ["New Business", "Existing Client", "Upsell", "Cross-sell", "Renewal", "Expansion", "Replacement"],
  leadStatus: ["New", "Contacted", "Qualified", "Unqualified", "Nurturing", "Converted", "Disqualified", "Follow-up Required"],
  priority: ["Critical", "High", "Medium", "Low"],
  industry: [
    "Technology", "Software", "Healthcare", "Finance", "Banking", "Insurance", 
    "Manufacturing", "Automotive", "Retail", "E-commerce", "Education", "Government", 
    "Non-profit", "Real Estate", "Construction", "Energy", "Utilities", "Telecommunications", 
    "Media", "Entertainment", "Transportation", "Logistics", "Agriculture", "Hospitality", 
    "Food & Beverage", "Pharmaceutical", "Biotechnology", "Legal Services", "Consulting", "Other"
  ],
  companySize: ["Startup (1-10)", "Small (11-50)", "Medium (51-200)", "Large (201-1000)", "Enterprise (1000+)", "Fortune 500"],
  timeframe: ["Immediate (0-30 days)", "Short-term (1-3 months)", "Medium-term (3-6 months)", "Long-term (6-12 months)", "Extended (12+ months)", "No Timeline"],
  territory: ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East", "Africa", "North", "South", "East", "West", "Central", "National", "International"],
  contractLength: ["Month-to-Month", "3 months", "6 months", "1 year", "2 years", "3 years", "Multi-year", "Custom Term"],
  state: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"],
  opportunityType: ["New Business", "Renewal", "Expansion", "Upsell", "Cross-sell", "Replacement", "Competitive Displacement", "Partnership"],
  businessUnit: ["Sales", "Marketing", "IT", "Operations", "Finance", "HR", "Customer Success", "Product", "Engineering", "Business Development"],
  product: [
    "Enterprise Software", "SaaS Platform", "CRM Solution", "ERP System", "Analytics Platform", 
    "Consulting Services", "Support Package", "Training Services", "Custom Development", 
    "Integration Services", "Cloud Services", "Security Solutions", "Mobile App", "API Platform"
  ],
  // Enhanced dropdown options for sales process
  competitor: [
    "Salesforce", "HubSpot", "Microsoft Dynamics", "Oracle", "SAP", "Pipedrive", "Zoho", 
    "Monday.com", "Airtable", "ServiceNow", "Workday", "Adobe", "Amazon", "Google", 
    "IBM", "Competitor A", "Competitor B", "Competitor C", "In-house Solution", "Other", "None"
  ],
  solution: [
    "Legacy System", "Manual Process", "Excel Spreadsheets", "Competitor Product", 
    "In-house Solution", "No Current Solution", "Multiple Tools", "Paper-based Process", 
    "Outdated Software", "Third-party Service"
  ],
  decisionCriteria: [
    "Price/Cost", "ROI/Value", "Features/Functionality", "Ease of Use", "Implementation Time", 
    "Support Quality", "Security", "Scalability", "Integration Capabilities", "Vendor Reputation", 
    "References", "Compliance", "Training Requirements", "Customization Options"
  ],
  nextStep: [
    "Schedule Demo", "Send Proposal", "Follow-up Call", "Technical Review", "Security Review", 
    "Contract Review", "Implementation Planning", "Final Approval", "Budget Approval", 
    "Stakeholder Meeting", "Pilot Program", "Reference Call", "ROI Analysis", "Pricing Discussion"
  ],
  campaign: [
    "Q1 2024 Campaign", "Q2 2024 Campaign", "Q3 2024 Campaign", "Q4 2024 Campaign",
    "Digital Marketing", "Trade Show", "Webinar Series", "Email Campaign", "Partner Campaign", 
    "Content Marketing", "SEO Campaign", "Social Media", "Direct Mail", "Industry Event", "Other"
  ],
  referral: [
    "Partner Network", "Existing Customer", "Employee Referral", "Industry Contact", 
    "LinkedIn Connection", "Professional Network", "Consultant", "Vendor", "Conference Contact", 
    "Social Media", "Website", "Other"
  ],
  winReason: [
    "Best Price", "Superior Features", "Excellent Support", "Quick Implementation", 
    "Strong References", "Existing Relationship", "Best ROI", "Better Security", 
    "Easier Integration", "Vendor Reputation", "Customization Capabilities", "Scalability"
  ],
  lossReason: [
    "Price Too High", "Missing Features", "Chose Competitor", "No Budget", "Project Cancelled", 
    "Poor Timing", "Lost to Status Quo", "Implementation Concerns", "Security Issues", 
    "Integration Challenges", "Support Concerns", "Vendor Concerns", "Other"
  ]
  
};
