// Color mapping for Advanced Search accordion sections
export const SECTION_COLORS = {
  // Opportunity sections
  "primary-fields": "#4A90E2", // Bright Blue - Quick Search
  "sales-pipeline": "#F5A623", // Warm Amber - Sales Pipeline & Process
  "financial-commercial": "#D0021B", // Strong Red - Financial & Commercial Terms
  "opportunity-details": "#7ED321", // Fresh Lime - Opportunity Details
  "account-company": "#BD10E0", // Vivid Purple - Account & Company Information
  "contact-info": "#50E3C2", // Aqua - Contact Information
  "product-solution": "#F8E71C", // Golden Yellow - Product & Solution Details
  "geographic-territory": "#F8E71C", // Golden Yellow - Geographic & Territory

  // Proposal sections - each with unique colors
  "opportunity-info": "#F5A623", // Warm Amber - Opportunity Info (different from primary-fields)
  "contact-address-info": "#50E3C2", // Aqua - Contact/Address Info
  "proposal-info": "#7ED321", // Fresh Lime - Proposal Info
};

// Helper function to get color for a section
export const getSectionColor = (sectionId) => {
  return SECTION_COLORS[sectionId] || "#4A90E2"; // Default to blue if not found
};

// Helper function to get Tailwind CSS class for a section
export const getSectionColorClass = (sectionId) => {
  const color = getSectionColor(sectionId);
  
  // Convert hex to Tailwind classes
  const colorMap = {
    "#4A90E2": "bg-blue-500", // Bright Blue
    "#F5A623": "bg-amber-500", // Warm Amber
    "#D0021B": "bg-red-600", // Strong Red
    "#7ED321": "bg-lime-500", // Fresh Lime
    "#BD10E0": "bg-purple-500", // Vivid Purple
    "#50E3C2": "bg-cyan-400", // Aqua
    "#F8E71C": "bg-yellow-400", // Golden Yellow
  };
  
  return colorMap[color] || "bg-blue-500";
}; 