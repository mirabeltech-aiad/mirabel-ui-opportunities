
import { USE_MOCK_DATA } from './apiClient';

const mockPricingMetrics = {
  optimalPrice: 24.99,
  priceConfidence: 87,
  priceElasticity: -1.2,
  elasticityType: 'elastic',
  revenueImpact: 12.4,
  activeTests: 3,
  testUsers: 15420,
};

const mockABTestingData = {
  activeTests: [
    {
      id: 1,
      name: 'Digital Price Test',
      description: 'Testing $19.99 vs $24.99 for digital subscriptions',
      status: 'running',
      controlPrice: 19.99,
      variantPrice: 24.99,
      participants: 5200,
    },
    {
      id: 2,
      name: 'Bundle Pricing',
      description: 'Testing combined subscription pricing strategies',
      status: 'running',
      controlPrice: 39.99,
      variantPrice: 44.99,
      participants: 3800,
    },
    {
      id: 3,
      name: 'Premium Tier Test',
      description: 'Testing premium tier acceptance',
      status: 'paused',
      controlPrice: 49.99,
      variantPrice: 59.99,
      participants: 2100,
    },
  ],
  conversionComparison: [
    { testName: 'Digital Price Test', control: 12.4, variant: 9.8 },
    { testName: 'Bundle Pricing', control: 8.2, variant: 11.6 },
    { testName: 'Premium Tier Test', control: 4.1, variant: 3.2 },
  ],
  testResults: [
    {
      id: 1,
      testName: 'Digital Price Test',
      controlPrice: 19.99,
      variantPrice: 24.99,
      conversionRate: 9.8,
      conversionChange: -2.6,
      revenueImpact: 18.2,
      significance: 95,
      isSignificant: true,
      status: 'completed',
    },
    {
      id: 2,
      testName: 'Bundle Pricing',
      controlPrice: 39.99,
      variantPrice: 44.99,
      conversionRate: 11.6,
      conversionChange: 3.4,
      revenueImpact: 15.8,
      significance: 98,
      isSignificant: true,
      status: 'completed',
    },
    {
      id: 3,
      testName: 'Premium Tier Test',
      controlPrice: 49.99,
      variantPrice: 59.99,
      conversionRate: 3.2,
      conversionChange: -0.9,
      revenueImpact: 12.4,
      significance: 78,
      isSignificant: false,
      status: 'running',
    },
  ],
};

const mockPriceElasticityData = {
  demandCurve: [
    { price: 10, demand: 15000 },
    { price: 15, demand: 12500 },
    { price: 20, demand: 10000 },
    { price: 25, demand: 7500 },
    { price: 30, demand: 5000 },
    { price: 35, demand: 3000 },
    { price: 40, demand: 1500 },
  ],
  revenueCurve: [
    { price: 10, revenue: 150000 },
    { price: 15, revenue: 187500 },
    { price: 20, revenue: 200000 },
    { price: 25, revenue: 187500 },
    { price: 30, revenue: 150000 },
    { price: 35, revenue: 105000 },
    { price: 40, revenue: 60000 },
  ],
  elasticityByType: [
    { price: 10, print: -0.8, digital: -1.4, both: -1.1 },
    { price: 15, print: -0.9, digital: -1.5, both: -1.2 },
    { price: 20, print: -1.0, digital: -1.6, both: -1.3 },
    { price: 25, print: -1.2, digital: -1.8, both: -1.5 },
    { price: 30, print: -1.4, digital: -2.0, both: -1.7 },
    { price: 35, print: -1.6, digital: -2.2, both: -1.9 },
    { price: 40, print: -1.8, digital: -2.4, both: -2.1 },
  ],
  elasticityMetrics: {
    print: {
      elasticity: -1.2,
      optimalPrice: 22.50,
      revenuePotential: 8.4,
    },
    digital: {
      elasticity: -1.6,
      optimalPrice: 18.99,
      revenuePotential: 15.2,
    },
    both: {
      elasticity: -1.3,
      optimalPrice: 24.99,
      revenuePotential: 12.1,
    },
  },
};

const mockOptimizationSuggestions = {
  revenueOpportunity: {
    total: 425000,
    percentage: 14.8,
  },
  implementationScore: 78,
  activeSuggestions: 8,
  implementedSuggestions: 3,
  suggestions: [
    {
      id: 1,
      title: 'Implement Dynamic Pricing for Digital Subscriptions',
      description: 'Use machine learning to adjust prices based on user behavior and market conditions',
      priority: 'high',
      category: 'Pricing Strategy',
      revenueImpact: 185000,
      affectedUsers: 25400,
      implementationTime: '6-8 weeks',
      confidence: 92,
      riskLevel: 'Medium',
      actionSteps: [
        'Set up dynamic pricing infrastructure',
        'Train ML models on historical data',
        'Create A/B testing framework',
        'Implement gradual rollout strategy',
        'Monitor performance metrics',
      ],
    },
    {
      id: 2,
      title: 'Optimize Bundle Pricing Strategy',
      description: 'Restructure print+digital bundles to maximize value perception',
      priority: 'high',
      category: 'Product Bundling',
      revenueImpact: 125000,
      affectedUsers: 18200,
      implementationTime: '3-4 weeks',
      confidence: 88,
      riskLevel: 'Low',
      actionSteps: [
        'Analyze current bundle performance',
        'Design new pricing tiers',
        'Test value proposition messaging',
        'Launch updated bundles',
        'Track conversion metrics',
      ],
    },
    {
      id: 3,
      title: 'Introduce Freemium Tier',
      description: 'Create a limited free tier to increase conversion funnel',
      priority: 'medium',
      category: 'Customer Acquisition',
      revenueImpact: 95000,
      affectedUsers: 35000,
      implementationTime: '8-10 weeks',
      confidence: 75,
      riskLevel: 'High',
      actionSteps: [
        'Define freemium content limits',
        'Develop conversion strategies',
        'Create upgrade prompts',
        'Implement usage tracking',
        'Monitor cannibalization effects',
      ],
    },
  ],
  roadmap: [
    {
      phase: 1,
      title: 'Quick Wins (0-3 months)',
      description: 'Low-effort, high-impact pricing optimizations',
      timeline: 'Q1 2024',
      revenueImpact: 150000,
      effort: 'Low',
    },
    {
      phase: 2,
      title: 'Strategic Implementations (3-6 months)',
      description: 'Medium-term pricing strategy overhauls',
      timeline: 'Q2 2024',
      revenueImpact: 275000,
      effort: 'Medium',
    },
    {
      phase: 3,
      title: 'Advanced Analytics (6-12 months)',
      description: 'AI-driven dynamic pricing and personalization',
      timeline: 'Q3-Q4 2024',
      revenueImpact: 450000,
      effort: 'High',
    },
  ],
};

const mockPricingSegmentData = {
  priceSensitivity: [
    { segment: 'Budget Conscious', sensitivity: 8.5 },
    { segment: 'Value Seekers', sensitivity: 6.2 },
    { segment: 'Premium Buyers', sensitivity: 3.1 },
    { segment: 'Enterprise', sensitivity: 2.4 },
  ],
  revenueDistribution: [
    { segment: 'Budget Conscious', revenue: 450000 },
    { segment: 'Value Seekers', revenue: 850000 },
    { segment: 'Premium Buyers', revenue: 1200000 },
    { segment: 'Enterprise', revenue: 650000 },
  ],
  segmentMetrics: [
    {
      id: 0,
      name: 'Budget Conscious',
      size: 45200,
      avgPrice: 12.99,
      conversionRate: 8.2,
      sensitivity: 'High',
      optimalPrice: 14.99,
      revenuePotential: 18.4,
    },
    {
      id: 1,
      name: 'Value Seekers',
      size: 28600,
      avgPrice: 19.99,
      conversionRate: 12.8,
      sensitivity: 'Medium',
      optimalPrice: 22.99,
      revenuePotential: 15.2,
    },
    {
      id: 2,
      name: 'Premium Buyers',
      size: 18400,
      avgPrice: 34.99,
      conversionRate: 15.6,
      sensitivity: 'Low',
      optimalPrice: 39.99,
      revenuePotential: 12.8,
    },
    {
      id: 3,
      name: 'Enterprise',
      size: 8200,
      avgPrice: 49.99,
      conversionRate: 22.4,
      sensitivity: 'Low',
      optimalPrice: 54.99,
      revenuePotential: 8.6,
    },
  ],
  priceWillingness: [
    { currentPrice: 12.99, willingnessToPay: 18.50 },
    { currentPrice: 19.99, willingnessToPay: 24.99 },
    { currentPrice: 34.99, willingnessToPay: 42.99 },
    { currentPrice: 49.99, willingnessToPay: 58.99 },
  ],
  recommendations: [
    {
      segment: 'Budget Conscious',
      recommendation: 'Introduce a lower-priced tier at $9.99 to capture price-sensitive users',
      priority: 'High',
      expectedImpact: 25,
      timeline: '4 weeks',
    },
    {
      segment: 'Value Seekers',
      recommendation: 'Enhance value messaging and add more features to justify $22.99 price point',
      priority: 'Medium',
      expectedImpact: 15,
      timeline: '6 weeks',
    },
    {
      segment: 'Premium Buyers',
      recommendation: 'Test premium features and services to support $39.99 pricing',
      priority: 'Medium',
      expectedImpact: 12,
      timeline: '8 weeks',
    },
    {
      segment: 'Enterprise',
      recommendation: 'Develop custom pricing packages and enterprise features',
      priority: 'Low',
      expectedImpact: 8,
      timeline: '12 weeks',
    },
  ],
};

const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

export const pricingService = {
  async getPricingMetrics(productIds?: string[], businessUnitIds?: string[]) {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockPricingMetrics);
    }
    throw new Error('Real API not implemented yet');
  },

  async getABTestingData(productIds?: string[], businessUnitIds?: string[]) {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockABTestingData);
    }
    throw new Error('Real API not implemented yet');
  },

  async getPriceElasticityData(productIds?: string[], businessUnitIds?: string[]) {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockPriceElasticityData);
    }
    throw new Error('Real API not implemented yet');
  },

  async getOptimizationSuggestions(productIds?: string[], businessUnitIds?: string[]) {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockOptimizationSuggestions);
    }
    throw new Error('Real API not implemented yet');
  },

  async getPricingSegmentData(productIds?: string[], businessUnitIds?: string[]) {
    if (USE_MOCK_DATA) {
      return await mockApiCall(mockPricingSegmentData);
    }
    throw new Error('Real API not implemented yet');
  },
};
