
import { lazy } from 'react';

const DeferredRevenueReport = lazy(() => import('../../components/reports/DeferredRevenueReport'));
const GrossNetChurnBreakdownReport = lazy(() => import('../../components/reports/GrossNetChurnBreakdownReport'));
const SubscriptionRenewalReport = lazy(() => import('../../components/reports/SubscriptionRenewalReport'));
const RenewalPerformanceReport = lazy(() => import('../../components/reports/RenewalPerformanceReport'));
const LogoRetentionReport = lazy(() => import('../../components/reports/LogoRetentionReport'));
const TopCustomerRevenueReport = lazy(() => import('../../components/reports/TopCustomerRevenueReport'));
const TimeToUpgradeReport = lazy(() => import('../../components/reports/TimeToUpgradeReport'));
const CrossSellAttachRateReport = lazy(() => import('../../components/reports/CrossSellAttachRateReport'));
const ExpansionPaybackPeriodReport = lazy(() => import('../../components/reports/ExpansionPaybackPeriodReport'));
const ContractExpansionRateReport = lazy(() => import('../../components/reports/ContractExpansionRateReport'));
const RevenueChurnRateReport = lazy(() => import('../../components/reports/RevenueChurnRateReport'));
const NetMRRChurnRateReport = lazy(() => import('../../components/reports/NetMRRChurnRateReport'));

export const revenueReports = [
  {
    id: 'net-mrr-churn-rate',
    title: 'Net MRR Churn Rate Report',
    description: 'Measures net MRR movement including expansion and churn, tracking path to negative churn and revenue growth efficiency.',
    component: NetMRRChurnRateReport,
    category: 'Revenue Reports',
    keywords: ['net', 'mrr', 'churn', 'expansion', 'negative churn', 'revenue retention', 'growth'],
    color: 'text-blue-600',
    iconColor: 'text-blue-500',
    applicableBusinessModels: ['saas']
  },
  {
    id: 'revenue-churn-rate',
    title: 'Revenue Churn Rate Report',
    description: 'Measures percentage of revenue lost from existing customers, providing financial perspective on customer attrition.',
    component: RevenueChurnRateReport,
    category: 'Revenue Reports',
    keywords: ['revenue', 'churn', 'mrr', 'financial', 'attrition', 'retention', 'loss'],
    color: 'text-red-600',
    iconColor: 'text-red-500',
    applicableBusinessModels: ['saas']
  },
  {
    id: 'contract-expansion-rate',
    title: 'Contract Expansion Rate Report',
    description: 'Measures percentage increases in contract values at renewal and tracks expansion patterns across segments.',
    component: ContractExpansionRateReport,
    category: 'Revenue Reports',
    keywords: ['contract', 'expansion', 'renewal', 'growth', 'revenue retention', 'upsell'],
    color: 'text-blue-600',
    iconColor: 'text-blue-500',
    applicableBusinessModels: ['saas']
  },
  {
    id: 'expansion-payback-period',
    title: 'Expansion Payback Period Report',
    description: 'Calculates ROI and payback timing for expansion efforts including upsells, cross-sells, and add-ons.',
    component: ExpansionPaybackPeriodReport,
    category: 'Revenue Reports',
    keywords: ['expansion', 'payback', 'roi', 'upsell', 'investment', 'returns'],
    color: 'text-emerald-600',
    iconColor: 'text-emerald-500',
    applicableBusinessModels: ['saas']
  },
  {
    id: 'cross-sell-attach-rate',
    title: 'Cross-sell Attach Rate Report',
    description: 'Analyzes complementary product attachment rates and cross-sell performance across customer segments.',
    component: CrossSellAttachRateReport,
    category: 'Revenue Reports',
    keywords: ['cross-sell', 'attach rate', 'complementary', 'products', 'upsell', 'revenue expansion'],
    color: 'text-purple-600',
    iconColor: 'text-purple-500',
    applicableBusinessModels: ['saas']
  },
  {
    id: 'time-to-upgrade',
    title: 'Time to Upgrade Report',
    description: 'Analyzes average time from initial subscription to first upgrade, with trends and customer segment breakdowns.',
    component: TimeToUpgradeReport,
    category: 'Revenue Reports',
    keywords: ['upgrade', 'time', 'conversion', 'segments', 'lifecycle', 'upsell'],
    color: 'text-indigo-600',
    iconColor: 'text-indigo-500',
    applicableBusinessModels: ['saas']
  },
  {
    id: 'renewal-performance',
    title: 'Renewal Performance Report',
    description: 'Comprehensive renewal metrics including rates, trends, and campaign performance.',
    component: RenewalPerformanceReport,
    category: 'Revenue Reports',
    keywords: ['renewal', 'performance', 'auto-renewal', 'campaigns', 'retention', 'success rates'],
    color: 'text-green-600',
    iconColor: 'text-green-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'deferred-revenue',
    title: 'Deferred Revenue Report',
    description: 'Shows prepaid revenue that has not yet been recognized.',
    component: DeferredRevenueReport,
    category: 'Revenue Reports',
    keywords: ['deferred', 'revenue', 'recognition', 'contracts', 'schedule'],
    color: 'text-emerald-600',
    iconColor: 'text-emerald-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'gross-net-churn-breakdown',
    title: 'Gross & Net Churn Breakdown Report',
    description: 'Provides a granular view of churned revenue and customer segments.',
    component: GrossNetChurnBreakdownReport,
    category: 'Revenue Reports',
    keywords: ['churn', 'gross', 'net', 'revenue', 'segments', 'mrr'],
    color: 'text-red-600',
    iconColor: 'text-red-500',
    applicableBusinessModels: ['saas']
  },
  {
    id: 'subscription-renewal',
    title: 'Subscription Renewal Report',
    description: 'Tracks upcoming and completed renewals and their outcomes.',
    component: SubscriptionRenewalReport,
    category: 'Revenue Reports',
    keywords: ['renewal', 'subscription', 'mrr', 'retention', 'completion'],
    color: 'text-blue-600',
    iconColor: 'text-blue-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'logo-retention',
    title: 'Logo Retention Report',
    description: 'Measures the percentage of customers retained, regardless of revenue.',
    component: LogoRetentionReport,
    category: 'Revenue Reports',
    keywords: ['logo', 'retention', 'customers', 'churn', 'segments', 'cohort'],
    color: 'text-purple-600',
    iconColor: 'text-purple-500',
    applicableBusinessModels: ['saas']
  },
  {
    id: 'top-customer-revenue',
    title: 'Top Customer Revenue Report',
    description: 'Lists highest-paying customers to track revenue concentration.',
    component: TopCustomerRevenueReport,
    category: 'Revenue Reports',
    keywords: ['top', 'customers', 'revenue', 'concentration', 'mrr', 'enterprise'],
    color: 'text-amber-600',
    iconColor: 'text-amber-500',
    applicableBusinessModels: ['saas', 'media']
  }
];
