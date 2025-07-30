
import { HelpItem } from './types';

export const pricingHelpItems: HelpItem[] = [
  {
    id: 'optimal-price-point',
    instruction: 'AI-calculated optimal subscription price based on market analysis, competitor pricing, and customer willingness to pay. Confidence percentage indicates reliability of the recommendation.',
    fieldName: 'Optimal Price Point',
    page: 'Pricing Overview'
  },
  {
    id: 'price-elasticity',
    instruction: 'Measure of how sensitive customer demand is to price changes. Values closer to -1 indicate elastic demand (price-sensitive), while values closer to 0 indicate inelastic demand.',
    fieldName: 'Price Elasticity',
    page: 'Pricing Overview'
  },
  {
    id: 'pricing-revenue-impact',
    instruction: 'Projected percentage change in revenue if optimal pricing recommendations are implemented. Positive values indicate potential revenue increases.',
    fieldName: 'Revenue Impact',
    page: 'Pricing Overview'
  },
  {
    id: 'pricing-ab-tests',
    instruction: 'Number of active price testing experiments currently running to optimize subscription pricing. Shows how many users are participating in price tests.',
    fieldName: 'Active A/B Tests',
    page: 'Pricing Overview'
  },
  {
    id: 'price-demand-curve',
    instruction: 'Visual representation of how customer demand changes in response to different price points. Shows the relationship between price and quantity demanded.',
    fieldName: 'Price-Demand Curve',
    page: 'Price Elasticity Analysis'
  },
  {
    id: 'revenue-optimization-curve',
    instruction: 'Chart showing how total revenue varies at different price points. Helps identify the optimal price that maximizes revenue based on demand elasticity.',
    fieldName: 'Revenue Optimization Curve',
    page: 'Price Elasticity Analysis'
  },
  {
    id: 'elasticity-by-subscription-type',
    instruction: 'Comparison of price sensitivity across different subscription types (print, digital, combined). Shows which subscription types are more or less responsive to price changes.',
    fieldName: 'Elasticity by Subscription Type',
    page: 'Price Elasticity Analysis'
  },
  {
    id: 'print-elasticity',
    instruction: 'Price elasticity metrics specifically for print subscriptions, including optimal pricing recommendations and revenue potential from price adjustments.',
    fieldName: 'Print Subscriptions',
    page: 'Price Elasticity'
  },
  {
    id: 'digital-elasticity',
    instruction: 'Price elasticity metrics specifically for digital subscriptions, showing demand sensitivity and optimal pricing strategies for digital products.',
    fieldName: 'Digital Subscriptions',
    page: 'Price Elasticity'
  },
  {
    id: 'combined-elasticity',
    instruction: 'Price elasticity analysis for bundled print and digital subscriptions, helping optimize pricing for combined offerings.',
    fieldName: 'Combined Subscriptions',
    page: 'Price Elasticity'
  },
  {
    id: 'ab-testing-active-tests',
    instruction: 'Number of pricing experiments currently running with active traffic allocation to test different price points.',
    fieldName: 'Active Tests',
    page: 'A/B Testing'
  },
  {
    id: 'ab-testing-conversion-lift',
    instruction: 'Average improvement in conversion rates from winning test variants compared to control groups.',
    fieldName: 'Conversion Lift',
    page: 'A/B Testing'
  },
  {
    id: 'ab-testing-confidence',
    instruction: 'Statistical confidence level of current test results based on sample size and effect size.',
    fieldName: 'Test Confidence',
    page: 'A/B Testing'
  },
  {
    id: 'ab-testing-performance',
    instruction: 'Comparison of conversion rates and revenue performance across different A/B test variants.',
    fieldName: 'Test Performance',
    page: 'A/B Testing'
  },
  {
    id: 'ab-testing-confidence-trends',
    instruction: 'How statistical confidence builds up over time as more data is collected during testing.',
    fieldName: 'Confidence Trends',
    page: 'A/B Testing'
  },
  {
    id: 'ab-testing-current-tests',
    instruction: 'List of currently active pricing experiments with test parameters and participant counts.',
    fieldName: 'Current Tests',
    page: 'A/B Testing'
  },
  {
    id: 'optimization-total-potential-impact',
    instruction: 'Total potential annual revenue increase from implementing all AI-recommended optimizations.',
    fieldName: 'Total Potential Impact',
    page: 'Revenue Optimization'
  },
  {
    id: 'optimization-high-priority-actions',
    instruction: 'Number of pricing recommendations requiring immediate attention to maximize revenue impact.',
    fieldName: 'High Priority Actions',
    page: 'Revenue Optimization'
  },
  {
    id: 'optimization-implementation-score',
    instruction: 'Feasibility rating for implementing pricing recommendations based on complexity and resources.',
    fieldName: 'Implementation Score',
    page: 'Revenue Optimization'
  },
  {
    id: 'optimization-strategic-recommendations',
    instruction: 'AI-generated strategic pricing recommendations ranked by impact, feasibility, and risk level.',
    fieldName: 'Strategic Recommendations',
    page: 'Revenue Optimization'
  },
  {
    id: 'optimization-implementation-roadmap',
    instruction: 'Phased implementation plan for pricing optimizations with timelines and expected impact.',
    fieldName: 'Implementation Roadmap',
    page: 'Revenue Optimization'
  },
  {
    id: 'price-sensitivity-by-segment',
    instruction: 'Analysis of how different customer segments respond to price changes and their sensitivity levels.',
    fieldName: 'Price Sensitivity by Segment',
    page: 'Pricing Segments'
  },
  {
    id: 'revenue-distribution-by-segment',
    instruction: 'Revenue contribution breakdown across customer segments to identify highest-value segments.',
    fieldName: 'Revenue Distribution by Segment',
    page: 'Pricing Segments'
  },
  {
    id: 'segment-performance-metrics',
    instruction: 'Comprehensive performance metrics for each customer segment including size, conversion rates, and optimal pricing.',
    fieldName: 'Segment Performance Metrics',
    page: 'Pricing Segments'
  },
  {
    id: 'price-vs-willingness-to-pay',
    instruction: 'Scatter plot comparing current prices to customer willingness to pay, identifying pricing gaps.',
    fieldName: 'Price vs Willingness to Pay',
    page: 'Pricing Segments'
  },
  {
    id: 'segment-recommendations',
    instruction: 'Tailored pricing recommendations for each customer segment with expected impact and timeline.',
    fieldName: 'Segment Recommendations',
    page: 'Pricing Segments'
  }
];
