
import { HelpItem } from './types';

export const lifecycleHelpItems: HelpItem[] = [
  {
    id: 'acquisition-funnel',
    instruction: 'Visual representation of the customer acquisition process from initial prospects through to paying subscribers, showing conversion rates at each stage.',
    fieldName: 'Acquisition Funnel',
    page: 'Lifecycle Analysis'
  },
  {
    id: 'retention-by-cohort',
    instruction: 'Analysis of subscriber retention rates organized by acquisition cohorts, showing how different groups of subscribers behave over time.',
    fieldName: 'Retention by Cohort',
    page: 'Lifecycle Analysis'
  },
  {
    id: 'churn-reasons',
    instruction: 'Breakdown of the primary reasons why subscribers cancel their subscriptions, helping identify areas for improvement.',
    fieldName: 'Top Churn Reasons',
    page: 'Lifecycle Analysis'
  },
  {
    id: 'trial-conversion',
    instruction: 'Percentage of trial users who convert to paid subscriptions. This metric shows how effective your trial experience is at demonstrating value to potential customers.',
    fieldName: 'Trial Conversion',
    page: 'Lifecycle Metrics'
  },
  {
    id: 'lifecycle-retention-rate',
    instruction: 'Percentage of subscribers who remain active after 12 months. This long-term retention metric indicates customer satisfaction and product-market fit.',
    fieldName: 'Retention Rate',
    page: 'Lifecycle Metrics'
  },
  {
    id: 'churn-rate',
    instruction: 'Percentage of subscribers who cancel their subscription each month. Lower churn rates indicate better customer retention and satisfaction.',
    fieldName: 'Churn Rate',
    page: 'Lifecycle Metrics'
  },
  {
    id: 'renewal-rate',
    instruction: 'Percentage of subscribers who renew their annual subscriptions when they expire. This metric is crucial for understanding long-term customer commitment.',
    fieldName: 'Renewal Rate',
    page: 'Lifecycle Metrics'
  }
];
