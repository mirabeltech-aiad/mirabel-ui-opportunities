
import { lazy, ComponentType } from 'react';

// Lazy load report components
const ActiveSubscriberSummaryReport = lazy(() => import('@/components/reports/ActiveSubscriberSummaryReport'));
const CustomerAcquisitionCostReport = lazy(() => import('@/components/reports/CustomerAcquisitionCostReport'));
const ChurnCancellationReport = lazy(() => import('@/components/reports/ChurnCancellationReport'));
const MonthlyRecurringRevenueReport = lazy(() => import('@/components/reports/MonthlyRecurringRevenueReport'));
const RevenueBySubscriptionTypeReport = lazy(() => import('@/components/reports/RevenueBySubscriptionTypeReport'));
const LifetimeValueReport = lazy(() => import('@/components/reports/LifetimeValueReport'));
const DigitalEngagementReport = lazy(() => import('@/components/reports/DigitalEngagementReport'));
const SubscriberGrowthOverTimeReport = lazy(() => import('@/components/reports/SubscriberGrowthOverTimeReport'));

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  color: string;
  iconColor: string;
  component: ComponentType<any>;
}

export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Monthly Recurring Revenue Report',
    description: 'Track monthly recurring revenue trends, growth rates, and revenue composition across different subscription tiers and customer segments.',
    category: 'Revenue Reports',
    keywords: ['MRR', 'Revenue', 'Growth'],
    color: 'bg-green-50',
    iconColor: 'text-green-600',
    component: MonthlyRecurringRevenueReport
  },
  {
    id: '2',
    title: 'Customer Acquisition Cost Report',
    description: 'Analyze customer acquisition costs by channel, campaign effectiveness, and ROI on marketing investments.',
    category: 'Revenue Reports',
    keywords: ['CAC', 'Marketing', 'ROI'],
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
    component: CustomerAcquisitionCostReport
  },
  {
    id: '3',
    title: 'Churn Analysis Report',
    description: 'Comprehensive analysis of customer churn patterns, reasons, and retention strategies effectiveness.',
    category: 'Subscriber Reports',
    keywords: ['Churn', 'Retention', 'Analytics'],
    color: 'bg-red-50',
    iconColor: 'text-red-600',
    component: ChurnCancellationReport
  },
  {
    id: '4',
    title: 'Revenue by Subscription Type Report',
    description: 'Breakdown of revenue performance across different subscription types, pricing tiers, and product offerings.',
    category: 'Revenue Reports',
    keywords: ['Subscription', 'Pricing', 'Revenue'],
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    component: RevenueBySubscriptionTypeReport
  },
  {
    id: '5',
    title: 'Active Subscriber Summary Report',
    description: 'Overview of active subscriber metrics, engagement levels, and subscription health indicators.',
    category: 'Subscriber Reports',
    keywords: ['Subscribers', 'Active', 'Engagement'],
    color: 'bg-teal-50',
    iconColor: 'text-teal-600',
    component: ActiveSubscriberSummaryReport
  },
  {
    id: '6',
    title: 'Performance Analytics Dashboard',
    description: 'Comprehensive performance metrics including key KPIs, trends, and operational efficiency indicators.',
    category: 'Performance Reports',
    keywords: ['Performance', 'KPIs', 'Analytics'],
    color: 'bg-orange-50',
    iconColor: 'text-orange-600',
    component: DigitalEngagementReport
  },
  {
    id: '7',
    title: 'Customer Lifetime Value Report',
    description: 'Calculate and analyze customer lifetime value across segments, cohorts, and acquisition channels.',
    category: 'Revenue Reports',
    keywords: ['LTV', 'Value', 'Segments'],
    color: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    component: LifetimeValueReport
  },
  {
    id: '8',
    title: 'Subscription Growth Trends',
    description: 'Track subscription growth patterns, seasonal trends, and forecast future growth opportunities.',
    category: 'Performance Reports',
    keywords: ['Growth', 'Trends', 'Forecast'],
    color: 'bg-pink-50',
    iconColor: 'text-pink-600',
    component: SubscriberGrowthOverTimeReport
  }
];
