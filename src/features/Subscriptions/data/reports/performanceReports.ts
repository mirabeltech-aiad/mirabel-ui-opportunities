import ActiveSubscriberSummaryReport from '../../components/reports/ActiveSubscriberSummaryReport';
import SubscriberGrowthOverTimeReport from '../../components/reports/SubscriberGrowthOverTimeReport';
import GeographicDistributionReport from '../../components/reports/GeographicDistributionReport';
import NewAcquisitionReport from '../../components/reports/NewAcquisitionReport';
import ChurnCancellationReport from '../../components/reports/ChurnCancellationReport';
import RenewalPerformanceReport from '../../components/reports/RenewalPerformanceReport';
import TrialConversionReport from '../../components/reports/TrialConversionReport';
import SubscriptionAgingReport from '../../components/reports/SubscriptionAgingReport';
import ExpirationForecastReport from '../../components/reports/ExpirationForecastReport';
import IssueFulfillmentReport from '../../components/reports/IssueFulfillmentReport';
import DigitalEngagementReport from '../../components/reports/DigitalEngagementReport';
import SourcePromoPerformanceReport from '../../components/reports/SourcePromoPerformanceReport';
import ComplimentarySubscriptionsReport from '../../components/reports/ComplimentarySubscriptionsReport';
import SubscriberDemographicReport from '../../components/reports/SubscriberDemographicReport';
import SalesFunnelConversionReport from '../../components/reports/SalesFunnelConversionReport';

export const performanceReports = [
  {
    id: 'trial-conversion',
    title: 'Trial Conversion Report',
    description: 'Tracks how many users convert from trial to paid and the associated revenue with behavior analysis',
    component: TrialConversionReport,
    category: 'Performance Reports',
    keywords: ['trial', 'conversion', 'paid', 'revenue', 'behavior', 'score', 'channel', 'users'],
    color: 'text-green-600',
    iconColor: 'text-green-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'sales-funnel-conversion',
    title: 'Sales Funnel Conversion Report',
    description: 'Tracks conversion rates between stages of the sales funnel with detailed opportunity analysis',
    component: SalesFunnelConversionReport,
    category: 'Performance Reports',
    keywords: ['sales', 'funnel', 'conversion', 'opportunities', 'pipeline', 'stages', 'prospects', 'leads', 'deals'],
    color: 'text-purple-600',
    iconColor: 'text-purple-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'active-subscriber-summary',
    title: 'Active Subscriber Summary',
    description: 'Overview of all active subscribers with key metrics, subscription types, and regional distribution',
    component: ActiveSubscriberSummaryReport,
    category: 'Performance Reports',
    keywords: ['active', 'subscribers', 'summary', 'overview', 'metrics', 'subscription', 'types', 'regional', 'distribution'],
    color: 'text-blue-600',
    iconColor: 'text-blue-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'subscriber-growth-over-time',
    title: 'Subscriber Growth Over Time',
    description: 'Historical growth trends showing subscriber acquisition, churn, and net growth patterns over time',
    component: SubscriberGrowthOverTimeReport,
    category: 'Performance Reports',
    keywords: ['growth', 'trends', 'historical', 'acquisition', 'churn', 'net', 'time', 'patterns', 'subscribers'],
    color: 'text-green-600',
    iconColor: 'text-green-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'geographic-distribution',
    title: 'Geographic Distribution Report',
    description: 'Subscriber distribution across regions, cities, and countries with growth metrics and market penetration',
    component: GeographicDistributionReport,
    category: 'Performance Reports',
    keywords: ['geographic', 'distribution', 'regions', 'cities', 'countries', 'growth', 'market', 'penetration', 'location'],
    color: 'text-indigo-600',
    iconColor: 'text-indigo-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'new-acquisition',
    title: 'New Acquisition Report',
    description: 'Analysis of newly acquired subscribers including acquisition channels, conversion rates, and onboarding performance',
    component: NewAcquisitionReport,
    category: 'Performance Reports',
    keywords: ['new', 'acquisition', 'acquired', 'subscribers', 'channels', 'conversion', 'onboarding', 'performance'],
    color: 'text-emerald-600',
    iconColor: 'text-emerald-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'churn-cancellation',
    title: 'Churn & Cancellation Analysis',
    description: 'Detailed analysis of subscriber churn patterns, cancellation reasons, and retention strategies',
    component: ChurnCancellationReport,
    category: 'Performance Reports',
    keywords: ['churn', 'cancellation', 'analysis', 'patterns', 'reasons', 'retention', 'strategies', 'attrition'],
    color: 'text-red-600',
    iconColor: 'text-red-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'trial-to-paid-conversion',
    title: 'Trial to Paid Conversion Report',
    description: 'Comprehensive analysis of trial conversion rates, timing, and factors affecting conversion success',
    component: TrialConversionReport,
    category: 'Performance Reports',
    keywords: ['trial', 'paid', 'conversion', 'rates', 'timing', 'factors', 'success', 'analysis', 'subscribers'],
    color: 'text-amber-600',
    iconColor: 'text-amber-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'subscription-aging',
    title: 'Subscription Aging Report',
    description: 'Analysis of subscription tenure, lifecycle stages, and aging patterns across subscriber segments',
    component: SubscriptionAgingReport,
    category: 'Performance Reports',
    keywords: ['subscription', 'aging', 'tenure', 'lifecycle', 'stages', 'patterns', 'segments', 'analysis'],
    color: 'text-violet-600',
    iconColor: 'text-violet-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'expiration-forecast',
    title: 'Expiration Forecast Report',
    description: 'Predictive analysis of upcoming subscription expirations with renewal probability and revenue impact',
    component: ExpirationForecastReport,
    category: 'Performance Reports',
    keywords: ['expiration', 'forecast', 'predictive', 'analysis', 'upcoming', 'renewal', 'probability', 'revenue'],
    color: 'text-rose-600',
    iconColor: 'text-rose-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'issue-fulfillment',
    title: 'Issue Fulfillment Report',
    description: 'Performance metrics for magazine issue delivery, fulfillment rates, and distribution efficiency',
    component: IssueFulfillmentReport,
    category: 'Performance Reports',
    keywords: ['issue', 'fulfillment', 'delivery', 'performance', 'metrics', 'rates', 'distribution', 'efficiency'],
    color: 'text-cyan-600',
    iconColor: 'text-cyan-500',
    applicableBusinessModels: ['media'] // Media-specific - magazine/print issue delivery
  },
  {
    id: 'digital-engagement',
    title: 'Digital Engagement Report',
    description: 'Digital platform usage, engagement metrics, and content consumption patterns for digital subscribers',
    component: DigitalEngagementReport,
    category: 'Performance Reports',
    keywords: ['digital', 'engagement', 'platform', 'usage', 'metrics', 'content', 'consumption', 'patterns'],
    color: 'text-teal-600',
    iconColor: 'text-teal-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'source-promo-performance',
    title: 'Source/Promo Performance Report',
    description: 'Analysis of marketing source codes and promotional campaign effectiveness across subscriber acquisition',
    component: SourcePromoPerformanceReport,
    category: 'Performance Reports',
    keywords: ['source', 'promo', 'performance', 'marketing', 'codes', 'promotional', 'campaign', 'effectiveness'],
    color: 'text-pink-600',
    iconColor: 'text-pink-500',
    applicableBusinessModels: ['saas', 'media']
  },
  {
    id: 'complimentary-subscriptions',
    title: 'Complimentary Subscriptions Report',
    description: 'Analysis of complimentary subscriptions, their impact on revenue, and conversion to paid subscriptions',
    component: ComplimentarySubscriptionsReport,
    category: 'Performance Reports',
    keywords: ['complimentary', 'subscriptions', 'analysis', 'impact', 'revenue', 'conversion', 'paid', 'free'],
    color: 'text-slate-600',
    iconColor: 'text-slate-500',
    applicableBusinessModels: ['media'] // Media-specific - print/digital complimentary subscriptions
  },
  {
    id: 'subscriber-demographic',
    title: 'Subscriber Demographic Report',
    description: 'Comprehensive demographic analysis of subscribers including age, location, preferences, and behavioral patterns',
    component: SubscriberDemographicReport,
    category: 'Performance Reports',
    keywords: ['subscriber', 'demographic', 'analysis', 'age', 'location', 'preferences', 'behavioral', 'patterns'],
    color: 'text-neutral-600',
    iconColor: 'text-neutral-500',
    applicableBusinessModels: ['saas', 'media']
  }
];
