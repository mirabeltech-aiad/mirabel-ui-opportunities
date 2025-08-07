
import { HelpItem } from './types';

export const analyticsHelpItems: HelpItem[] = [
  {
    id: 'total-subscribers',
    instruction: 'Current count of all active subscribers across all subscription plans and formats. This metric provides a snapshot of your subscriber base size and is calculated by summing all active subscriptions with valid payment status.',
    fieldName: 'Total Subscribers',
    page: 'Analytics'
  },
  {
    id: 'average-ltv',
    instruction: 'Expected total revenue from an average subscriber over their entire subscription lifecycle. Calculated by multiplying average monthly revenue by average subscriber lifespan, this metric helps evaluate the long-term value of your customer acquisition efforts.',
    fieldName: 'Average Lifetime Value',
    page: 'Analytics'
  },
  {
    id: 'engagement-score',
    instruction: 'Composite score measuring subscriber interaction across all touchpoints including email opens, app usage, and content consumption. The score ranges from 0-100 and is calculated as a weighted average of various engagement metrics.',
    fieldName: 'Engagement Score',
    page: 'Analytics'
  },
  {
    id: 'critical-churn-risk',
    instruction: 'Number of subscribers with high probability of canceling within the next 30 days based on behavioral patterns. This prediction is generated using machine learning models that analyze engagement, payment history, and usage patterns.',
    fieldName: 'Critical Churn Risk',
    page: 'Analytics'
  },
  {
    id: 'key-insights',
    instruction: 'AI-generated insights based on current data trends, highlighting top-performing segments and strategic opportunities for growth. These insights are updated daily and provide actionable recommendations for business optimization.',
    fieldName: 'Key Insights',
    page: 'Analytics'
  },
  {
    id: 'subscriber-demographics',
    instruction: 'Detailed breakdown of subscriber characteristics including age distribution, gender, income levels, and geographic spread. This data helps understand your audience composition.',
    fieldName: 'Subscriber Demographics',
    page: 'Analytics'
  },
  {
    id: 'behavioral-segmentation',
    instruction: 'Advanced segmentation based on subscriber behavior patterns, engagement levels, and usage habits. Each segment includes characteristics and recommended marketing strategies.',
    fieldName: 'Behavioral Segmentation',
    page: 'Analytics'
  },
  {
    id: 'lifetime-value-analysis',
    instruction: 'Comprehensive analysis of customer lifetime value including current LTV, predicted future value, and revenue projections based on historical data and behavioral patterns.',
    fieldName: 'Lifetime Value Analysis',
    page: 'Analytics'
  },
  {
    id: 'churn-prediction',
    instruction: 'Machine learning-powered predictions identifying subscribers at risk of cancellation. Includes risk levels, confidence scores, and recommended intervention strategies.',
    fieldName: 'Churn Prediction Model',
    page: 'Analytics'
  },
  {
    id: 'engagement-scoring',
    instruction: 'Composite engagement scores based on email opens, content consumption, app usage, and interaction frequency. Helps identify highly engaged vs. at-risk subscribers.',
    fieldName: 'Engagement Scoring',
    page: 'Analytics'
  },
  {
    id: 'acquisition-costs',
    instruction: 'Analysis of customer acquisition costs across different marketing channels including CAC, LTV/CAC ratios, and cost efficiency metrics to optimize marketing spend.',
    fieldName: 'Acquisition Costs Analysis',
    page: 'Analytics'
  },
  // Demographics tooltips
  {
    id: 'age-distribution',
    instruction: 'Breakdown of subscribers by age groups showing demographic composition of your audience.',
    fieldName: 'Age Distribution',
    page: 'Analytics'
  },
  {
    id: 'gender-distribution',
    instruction: 'Pie chart showing gender composition of your subscriber base.',
    fieldName: 'Gender Distribution',
    page: 'Analytics'
  },
  {
    id: 'income-distribution',
    instruction: 'Subscriber distribution by income ranges with average lifetime value correlation.',
    fieldName: 'Income Distribution & LTV',
    page: 'Analytics'
  },
  {
    id: 'geographic-subscriber-distribution',
    instruction: 'Geographic spread of subscribers showing regional performance and growth opportunities.',
    fieldName: 'Geographic Distribution',
    page: 'Analytics'
  },
  // Behavioral segmentation tooltips
  {
    id: 'behavioral-segments-overview',
    instruction: 'High-level view of behavioral segments showing subscriber counts and average LTV per segment.',
    fieldName: 'Behavioral Segments Overview',
    page: 'Analytics'
  },
  // Lifetime value tooltips
  {
    id: 'average-lifetime-value',
    instruction: 'Average revenue expected from a customer over their entire subscription lifecycle.',
    fieldName: 'Average Lifetime Value',
    page: 'Analytics'
  },
  {
    id: 'total-revenue',
    instruction: 'Cumulative revenue generated from all subscribers in the current analysis period.',
    fieldName: 'Total Revenue',
    page: 'Analytics'
  },
  {
    id: 'avg-monthly-spend',
    instruction: 'Average amount spent per customer per month across all subscription types.',
    fieldName: 'Average Monthly Spend',
    page: 'Analytics'
  },
  {
    id: 'current-vs-predicted-ltv',
    instruction: 'Scatter plot comparing current lifetime value against predicted future value for each subscriber.',
    fieldName: 'Current vs Predicted LTV',
    page: 'Analytics'
  },
  {
    id: 'ltv-details',
    instruction: 'Detailed table showing individual subscriber LTV metrics, predictions, and churn risk scores.',
    fieldName: 'LTV Details',
    page: 'Analytics'
  },
  // Engagement scoring tooltips
  {
    id: 'overall-engagement',
    instruction: 'Composite engagement score averaging all interaction metrics across the platform.',
    fieldName: 'Overall Engagement',
    page: 'Analytics'
  },
  {
    id: 'content-engagement',
    instruction: 'Measures how actively subscribers consume and interact with published content.',
    fieldName: 'Content Engagement',
    page: 'Analytics'
  },
  {
    id: 'platform-usage',
    instruction: 'Tracks frequency and depth of platform usage including session duration and feature adoption.',
    fieldName: 'Platform Usage',
    page: 'Analytics'
  },
  {
    id: 'social-sharing',
    instruction: 'Measures how often subscribers share content on social media platforms.',
    fieldName: 'Social Sharing',
    page: 'Analytics'
  },
  {
    id: 'engagement-metrics-breakdown',
    instruction: 'Radar chart showing comprehensive breakdown of all engagement metrics for comparison.',
    fieldName: 'Engagement Metrics Breakdown',
    page: 'Analytics'
  },
  {
    id: 'individual-engagement',
    instruction: 'Detailed engagement scores and trends for individual subscribers with actionable insights.',
    fieldName: 'Individual Engagement',
    page: 'Analytics'
  },
  // Acquisition costs tooltips
  {
    id: 'cac-by-channel',
    instruction: 'Customer acquisition cost breakdown by marketing channel to identify most cost-effective channels.',
    fieldName: 'CAC by Channel',
    page: 'Analytics'
  },
  {
    id: 'ltv-cac-ratio',
    instruction: 'Lifetime value to customer acquisition cost ratio by channel - higher ratios indicate better ROI.',
    fieldName: 'LTV/CAC Ratio',
    page: 'Analytics'
  },
  {
    id: 'acquisition-performance',
    instruction: 'Comprehensive table showing acquisition metrics, costs, and performance trends across all channels.',
    fieldName: 'Acquisition Performance',
    page: 'Analytics'
  },
  // Delivery costs tooltips
  {
    id: 'delivery-expenses-analysis',
    instruction: 'Comprehensive analysis of delivery and distribution costs including cost breakdowns, efficiency metrics, and trend analysis.',
    fieldName: 'Delivery Expenses Analysis',
    page: 'Analytics'
  },
  {
    id: 'delivery-costs-by-type',
    instruction: 'Pie chart showing breakdown of delivery costs by type (print, digital, shipping, etc.) to identify major cost drivers.',
    fieldName: 'Delivery Costs by Type',
    page: 'Analytics'
  },
  {
    id: 'cost-efficiency-metrics',
    instruction: 'Key efficiency metrics showing cost per subscriber and trend indicators for each delivery type.',
    fieldName: 'Cost Efficiency Metrics',
    page: 'Analytics'
  },
  {
    id: 'delivery-cost-breakdown',
    instruction: 'Detailed table showing comprehensive delivery cost metrics including volume, unit costs, and subscriber allocations.',
    fieldName: 'Delivery Cost Breakdown',
    page: 'Analytics'
  },
  // Profitability tooltips
  {
    id: 'subscriber-profitability-analysis',
    instruction: 'Detailed analysis of subscriber profitability including revenue, costs, margins, and segment performance.',
    fieldName: 'Subscriber Profitability Analysis',
    page: 'Analytics'
  },
  {
    id: 'average-profit',
    instruction: 'Average profit generated per subscriber after deducting all associated costs including acquisition, delivery, and service costs.',
    fieldName: 'Average Profit',
    page: 'Analytics'
  },
  {
    id: 'average-margin',
    instruction: 'Average profit margin percentage showing overall profitability across all subscribers.',
    fieldName: 'Average Margin',
    page: 'Analytics'
  },
  {
    id: 'total-subscribers-profitability',
    instruction: 'Total number of subscribers included in the profitability analysis with complete cost and revenue data.',
    fieldName: 'Total Subscribers',
    page: 'Analytics'
  },
  {
    id: 'revenue-vs-profit-scatter',
    instruction: 'Scatter plot visualization showing the relationship between subscriber revenue and profit to identify high-value customers.',
    fieldName: 'Revenue vs Profit Scatter',
    page: 'Analytics'
  },
  {
    id: 'profitability-by-segment',
    instruction: 'Table showing aggregate profitability metrics broken down by customer segments to identify most valuable segments.',
    fieldName: 'Profitability by Segment',
    page: 'Analytics'
  },
  {
    id: 'individual-subscriber-performance',
    instruction: 'Detailed table showing individual subscriber profitability metrics, segments, channels, and performance status.',
    fieldName: 'Individual Subscriber Performance',
    page: 'Analytics'
  }
];
