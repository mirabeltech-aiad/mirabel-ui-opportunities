
import { userService } from '@/features/Opportunity/Services/userService';

export const periodOptions = [
  { value: "all", label: "All Time" },
  { value: "custom", label: "Custom Date Range" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this-week", label: "This Week" },
  { value: "last-week", label: "Last Week" },
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "last-14-days", label: "Last 14 Days" },
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "last-60-days", label: "Last 60 Days" },
  { value: "last-90-days", label: "Last 90 Days" },
  { value: "this-quarter", label: "This Quarter" },
  { value: "last-quarter", label: "Last Quarter" },
  { value: "last-120-days", label: "Last 120 Days" },
  { value: "last-6-months", label: "Last 6 Months" },
  { value: "this-year", label: "This Year" },
  { value: "ytd", label: "Year to Date" },
  { value: "last-year", label: "Last Year" },
  { value: "last-12-months", label: "Last 12 Months" },
  { value: "last-18-months", label: "Last 18 Months" },
  { value: "last-24-months", label: "Last 24 Months" }
];

// Function to get dynamic product options from API
export const getProductOptions = async () => {
  try {
    const products = await userService.getProducts();
    return [
      { value: "all", label: "All Products" },
      ...products.map(product => ({
        value: product.value,
        label: product.label
      }))
    ];
  } catch (error) {
    console.error('Failed to fetch products for dashboard:', error);
    // Fallback to static options if API fails
    return [
      { value: "all", label: "All Products" },
      { value: "digital-ads", label: "Digital Advertising" },
      { value: "print-ads", label: "Print Advertising" },
      { value: "sponsored-content", label: "Sponsored Content" },
      { value: "events", label: "Events & Conferences" },
      { value: "newsletters", label: "Newsletter Sponsorship" },
      { value: "webinars", label: "Webinar Solutions" }
    ];
  }
};

// Function to get dynamic business unit options from API
export const getBusinessUnitOptions = async () => {
  try {
    const businessUnits = await userService.getBusinessUnits();
    return [
      { value: "all", label: "All Business Units" },
      ...businessUnits.map(unit => ({
        value: unit.value,
        label: unit.label
      }))
    ];
  } catch (error) {
    console.error('Failed to fetch business units for dashboard:', error);
    // Fallback to static options if API fails
    return [
      { value: "all", label: "All Business Units" },
      { value: "enterprise", label: "Enterprise Solutions" },
      { value: "mid-market", label: "Mid-Market" },
      { value: "small-business", label: "Small Business" },
      { value: "government", label: "Government & Public Sector" },
      { value: "healthcare", label: "Healthcare" },
      { value: "education", label: "Education" }
    ];
  }
};
