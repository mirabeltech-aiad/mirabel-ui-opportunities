
import { HelpItem } from './types';

export const circulationHelpItems: HelpItem[] = [
  {
    id: 'active-subscribers',
    instruction: 'Total number of currently active paid subscribers across all subscription types. This includes both print and digital subscribers.',
    fieldName: 'Active Subscribers',
    page: 'Circulation Dashboard'
  },
  {
    id: 'monthly-revenue',
    instruction: 'Total monthly recurring revenue (MRR) from all active subscriptions. This represents predictable monthly income from subscription fees.',
    fieldName: 'Monthly Revenue',
    page: 'Circulation Dashboard'
  },
  {
    id: 'growth-rate',
    instruction: 'Percentage growth in new subscriptions compared to the previous month. Calculated as (new subscriptions / total subscribers) × 100.',
    fieldName: 'Growth Rate',
    page: 'Circulation Dashboard'
  },
  {
    id: 'retention-rate',
    instruction: 'Percentage of subscribers who continue their subscription each month. Calculated as 100% minus the churn rate. Higher retention indicates better customer satisfaction.',
    fieldName: 'Retention Rate',
    page: 'Circulation Dashboard'
  },
  {
    id: 'circulation-trends',
    instruction: 'Interactive chart showing circulation trends over time. Switch between Circulation view (total numbers by type) and Activity view (new vs churned subscriptions). Toggle between line and area chart styles.',
    fieldName: 'Interactive Circulation Trends',
    page: 'Circulation Dashboard'
  },
  {
    id: 'growth-trends',
    instruction: 'Line chart displaying 6-month circulation growth analysis showing trends for total, print, and digital subscriptions over time.',
    fieldName: 'Growth Trends',
    page: 'Circulation Dashboard'
  },
  {
    id: 'churn-analysis',
    instruction: 'Bar chart analyzing monthly churn rates with comparison to average churn. Shows the percentage of subscribers who cancelled their subscription each month.',
    fieldName: 'Churn Analysis',
    page: 'Circulation Dashboard'
  },
  {
    id: 'geographic-distribution',
    instruction: 'Geographic breakdown of subscribers showing distribution by region and location. Helps understand market penetration and regional performance.',
    fieldName: 'Geographic Distribution',
    page: 'Circulation Dashboard'
  },
  {
    id: 'subscription-lifecycle',
    instruction: 'Comprehensive view of the subscriber journey from acquisition through retention, including cohort analysis and lifecycle stages.',
    fieldName: 'Subscription Lifecycle Tracker',
    page: 'Circulation Dashboard'
  },
  {
    id: 'total-circulation',
    instruction: 'Total number of active subscribers across all subscription types including both print and digital subscriptions currently active in the system.',
    fieldName: 'Total Circulation',
    page: 'Circulation Overview'
  },
  {
    id: 'print-circulation',
    instruction: 'Number of active print subscribers who receive physical copies of the publication. This includes home delivery and newsstand subscriptions.',
    fieldName: 'Print Circulation',
    page: 'Circulation Overview'
  },
  {
    id: 'digital-circulation',
    instruction: 'Number of active digital subscribers who access content through digital platforms including web, mobile apps, and digital editions.',
    fieldName: 'Digital Circulation',
    page: 'Circulation Overview'
  },
  {
    id: 'monthly-growth',
    instruction: 'Percentage growth in total circulation compared to the previous month, calculated as the change in total active subscribers over time.',
    fieldName: 'Monthly Growth',
    page: 'Circulation Overview'
  },
  {
    id: 'circulation-analytics',
    instruction: 'Comprehensive view of circulation metrics including subscriber counts, growth trends, churn analysis, and geographic distribution.',
    fieldName: 'Circulation Analytics',
    page: 'Circulation Dashboard'
  },
  {
    id: 'revenue-analytics',
    instruction: 'Detailed revenue analysis including attribution, geographic distribution, pricing analysis, and revenue optimization insights.',
    fieldName: 'Revenue Analytics',
    page: 'Circulation Dashboard'
  }
];
