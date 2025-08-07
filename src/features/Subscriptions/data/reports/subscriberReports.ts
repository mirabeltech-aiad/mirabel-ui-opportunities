
import { lazy } from 'react';

const LifetimeValueReport = lazy(() => import('../../components/reports/LifetimeValueReport'));
const ComplimentarySubscriptionsReport = lazy(() => import('../../components/reports/ComplimentarySubscriptionsReport'));
const GiftSubscriptionsReport = lazy(() => import('../../components/reports/GiftSubscriptionsReport'));
const CustomerChurnReport = lazy(() => import('../../components/reports/CustomerChurnReport'));
const CustomerSegmentationReport = lazy(() => import('../../components/reports/CustomerSegmentationReport'));
const ChurnByCohortReport = lazy(() => import('../../components/reports/ChurnByCohortReport'));

export const subscriberReports = [
  {
    id: 'lifetime-value',
    title: 'Lifetime Value Report',
    description: 'Calculates and analyzes customer lifetime value metrics.',
    component: LifetimeValueReport,
    category: 'Subscriber Reports',
    keywords: ['lifetime', 'value', 'ltv', 'metrics', 'analysis'],
    color: 'text-amber-600',
    iconColor: 'text-amber-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'gift-subscriptions',
    title: 'Gift Subscriptions Report',
    description: 'Tracks gift subscriptions given by customers to others.',
    component: GiftSubscriptionsReport,
    category: 'Subscriber Reports',
    keywords: ['gift', 'subscriptions', 'giving', 'recipients', 'holidays'],
    color: 'text-pink-600',
    iconColor: 'text-pink-500',
    applicableBusinessModels: ['media'] // Media-specific - magazine/newspaper gift subscriptions
  },
  {
    id: 'customer-churn',
    title: 'Customer Churn Report',
    description: 'Detailed analysis of customer churn rates and contributing factors.',
    component: CustomerChurnReport,
    category: 'Subscriber Reports',
    keywords: ['customer', 'churn', 'rates', 'factors', 'analysis'],
    color: 'text-red-600',
    iconColor: 'text-red-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'customer-segmentation',
    title: 'Customer Segmentation Report',
    description: 'Groups customers by plan, lifecycle stage, behavior, or size.',
    component: CustomerSegmentationReport,
    category: 'Subscriber Reports',
    keywords: ['segmentation', 'groups', 'plan', 'lifecycle', 'behavior', 'size'],
    color: 'text-violet-600',
    iconColor: 'text-violet-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'churn-by-cohort',
    title: 'Churn by Cohort',
    description: 'Analyze customer retention and churn patterns across acquisition cohorts with behavioral insights and risk assessment',
    category: 'Subscriber Reports',
    keywords: ['cohort', 'churn', 'retention', 'acquisition', 'lifecycle', 'behavior', 'risk'],
    color: 'bg-red-50',
    iconColor: 'text-red-600',
    component: ChurnByCohortReport,
    applicableBusinessModels: ['saas', 'media']
  }
];
