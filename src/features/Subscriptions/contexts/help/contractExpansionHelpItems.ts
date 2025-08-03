
import { HelpItem } from './types';

export const contractExpansionHelpItems: HelpItem[] = [
  {
    id: 'contract-expansion-rate',
    instruction: 'Percentage of contracts that expanded in value during renewal compared to their original contract value. Indicates customer satisfaction and product stickiness.',
    fieldName: 'Contract Expansion Rate',
    page: 'Contract Expansion Rate Report'
  },
  {
    id: 'avg-expansion-percentage',
    instruction: 'Average percentage increase in contract value when expansions occur. Shows the typical magnitude of expansion among customers who do expand.',
    fieldName: 'Avg Expansion %',
    page: 'Contract Expansion Rate Report'
  },
  {
    id: 'total-expansion-revenue',
    instruction: 'Total additional revenue generated from contract expansions during the selected period. Represents the direct financial impact of expansion efforts.',
    fieldName: 'Total Expansion Revenue',
    page: 'Contract Expansion Rate Report'
  },
  {
    id: 'net-revenue-retention',
    instruction: 'Percentage of recurring revenue retained from existing customers, including expansions, downgrades, and churn. Values above 100% indicate net growth from existing customers.',
    fieldName: 'Net Revenue Retention',
    page: 'Contract Expansion Rate Report'
  },
  {
    id: 'expansion-rate-trend-chart',
    instruction: 'Shows the monthly trend of contract expansion rates over the past 12 months. Helps identify seasonal patterns and overall growth trajectory in customer expansions.',
    fieldName: 'Contract Expansion Rate Trend',
    page: 'Contract Expansion Rate Report'
  },
  {
    id: 'expansion-distribution-chart',
    instruction: 'Distribution showing how contract expansion percentages are spread across different ranges. Helps understand the typical expansion magnitude and identify outliers.',
    fieldName: 'Expansion Amount Distribution',
    page: 'Contract Expansion Rate Report'
  },
  {
    id: 'contract-size-analysis',
    instruction: 'Analysis of how expansion rates vary by contract value buckets. Larger contracts often have different expansion patterns than smaller ones.',
    fieldName: 'Expansion Rate by Contract Size',
    page: 'Contract Expansion Rate Report'
  },
  {
    id: 'renewal-outcome-breakdown',
    instruction: 'Pie chart showing the distribution of all contract renewal outcomes including expansions, flat renewals, downgrades, and churn.',
    fieldName: 'Renewal Outcome Breakdown',
    page: 'Contract Expansion Rate Report'
  },
  {
    id: 'geographic-expansion-north-america',
    instruction: 'Contract expansion performance for North American customers. Shows the percentage of renewals that resulted in increased contract values and the average expansion rate for this region.',
    fieldName: 'North America Expansion',
    page: 'Contract Expansion Rate Report'
  },
  {
    id: 'geographic-expansion-europe',
    instruction: 'Contract expansion performance for European customers. Displays renewal expansion rates and total renewal counts for European markets.',
    fieldName: 'Europe Expansion',
    page: 'Contract Expansion Rate Report'
  },
  {
    id: 'geographic-expansion-asia-pacific',
    instruction: 'Contract expansion performance for Asia Pacific customers. Shows expansion rates and renewal statistics for APAC region.',
    fieldName: 'Asia Pacific Expansion',
    page: 'Contract Expansion Rate Report'
  },
  {
    id: 'geographic-expansion-other',
    instruction: 'Contract expansion performance for other global regions. Includes expansion rates and renewal data for markets outside of North America, Europe, and Asia Pacific.',
    fieldName: 'Other Regions Expansion',
    page: 'Contract Expansion Rate Report'
  }
];
