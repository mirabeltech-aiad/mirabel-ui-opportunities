
export const trialConversionData = {
  summary: {
    totalTrials: 3247,
    convertedTrials: 1423,
    conversionRate: 43.8,
    averageConversionTime: 8.2,
    retentionRate90Days: 87.4,
    totalConversionRevenue: 142340
  },

  trialData: [
    {
      id: 'TRIAL001',
      customerId: 'CUST001',
      customerName: 'John Smith',
      email: 'john.smith@email.com',
      trialStartDate: '2024-01-15',
      trialEndDate: '2024-01-29',
      trialDuration: 14,
      subscriptionType: 'Digital Only',
      acquisitionSource: 'Google Ads',
      trialStatus: 'Converted',
      conversionDate: '2024-01-27',
      conversionDays: 12,
      paidStartDate: '2024-01-30',
      paidSubscriptionValue: 49.99,
      retentionStatus90Days: 'Retained',
      currentStatus: 'Active Paid',
      totalRevenue: 149.97,
      engagementScore: 8.5
    },
    {
      id: 'TRIAL002',
      customerId: 'CUST002',
      customerName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      trialStartDate: '2024-02-01',
      trialEndDate: '2024-02-15',
      trialDuration: 14,
      subscriptionType: 'Print + Digital',
      acquisitionSource: 'Facebook Ads',
      trialStatus: 'Expired',
      conversionDate: null,
      conversionDays: null,
      paidStartDate: null,
      paidSubscriptionValue: null,
      retentionStatus90Days: null,
      currentStatus: 'Trial Expired',
      totalRevenue: 0,
      engagementScore: 3.2
    },
    {
      id: 'TRIAL003',
      customerId: 'CUST003',
      customerName: 'Michael Brown',
      email: 'mbrown@email.com',
      trialStartDate: '2024-02-10',
      trialEndDate: '2024-02-24',
      trialDuration: 14,
      subscriptionType: 'Print Only',
      acquisitionSource: 'Email Campaign',
      trialStatus: 'Converted',
      conversionDate: '2024-02-20',
      conversionDays: 10,
      paidStartDate: '2024-02-25',
      paidSubscriptionValue: 79.99,
      retentionStatus90Days: 'Churned',
      currentStatus: 'Cancelled',
      totalRevenue: 79.99,
      engagementScore: 6.1
    },
    {
      id: 'TRIAL004',
      customerId: 'CUST004',
      customerName: 'Lisa Wilson',
      email: 'lwilson@email.com',
      trialStartDate: '2024-03-05',
      trialEndDate: '2024-03-19',
      trialDuration: 14,
      subscriptionType: 'Digital Only',
      acquisitionSource: 'Organic Search',
      trialStatus: 'Converted',
      conversionDate: '2024-03-16',
      conversionDays: 11,
      paidStartDate: '2024-03-20',
      paidSubscriptionValue: 49.99,
      retentionStatus90Days: 'Retained',
      currentStatus: 'Active Paid',
      totalRevenue: 199.96,
      engagementScore: 9.2
    },
    {
      id: 'TRIAL005',
      customerId: 'CUST005',
      customerName: 'David Garcia',
      email: 'dgarcia@email.com',
      trialStartDate: '2024-03-12',
      trialEndDate: '2024-03-26',
      trialDuration: 14,
      subscriptionType: 'Print + Digital',
      acquisitionSource: 'Referral',
      trialStatus: 'Active',
      conversionDate: null,
      conversionDays: null,
      paidStartDate: null,
      paidSubscriptionValue: null,
      retentionStatus90Days: null,
      currentStatus: 'Active Trial',
      totalRevenue: 0,
      engagementScore: 7.8
    },
    {
      id: 'TRIAL006',
      customerId: 'CUST006',
      customerName: 'Jennifer Martinez',
      email: 'jmartinez@email.com',
      trialStartDate: '2024-04-01',
      trialEndDate: '2024-04-15',
      trialDuration: 14,
      subscriptionType: 'Digital Only',
      acquisitionSource: 'LinkedIn Ads',
      trialStatus: 'Converted',
      conversionDate: '2024-04-12',
      conversionDays: 11,
      paidStartDate: '2024-04-16',
      paidSubscriptionValue: 49.99,
      retentionStatus90Days: 'Retained',
      currentStatus: 'Active Paid',
      totalRevenue: 149.97,
      engagementScore: 8.7
    }
  ],

  monthlyConversionTrends: [
    { month: 'Jan', trials: 287, conversions: 134, conversionRate: 46.7, avgDaysToConvert: 9.2 },
    { month: 'Feb', trials: 312, conversions: 142, conversionRate: 45.5, avgDaysToConvert: 8.8 },
    { month: 'Mar', trials: 298, conversions: 125, conversionRate: 41.9, avgDaysToConvert: 8.5 },
    { month: 'Apr', trials: 334, conversions: 151, conversionRate: 45.2, avgDaysToConvert: 7.9 },
    { month: 'May', trials: 289, conversions: 118, conversionRate: 40.8, avgDaysToConvert: 8.1 },
    { month: 'Jun', trials: 267, conversions: 108, conversionRate: 40.4, avgDaysToConvert: 8.7 }
  ],

  conversionBySource: [
    { source: 'Google Ads', trials: 892, conversions: 412, conversionRate: 46.2, avgRevenue: 87.50 },
    { source: 'Facebook Ads', trials: 645, conversions: 271, conversionRate: 42.0, avgRevenue: 82.30 },
    { source: 'Email Campaign', trials: 534, conversions: 234, conversionRate: 43.8, avgRevenue: 91.20 },
    { source: 'Organic Search', trials: 423, conversions: 198, conversionRate: 46.8, avgRevenue: 89.40 },
    { source: 'Referral', trials: 298, conversions: 142, conversionRate: 47.7, avgRevenue: 94.80 },
    { source: 'LinkedIn Ads', trials: 187, conversions: 78, conversionRate: 41.7, avgRevenue: 85.60 }
  ],

  retentionData: [
    { period: '30 Days', retained: 94.2, churned: 5.8 },
    { period: '60 Days', retained: 89.8, churned: 10.2 },
    { period: '90 Days', retained: 87.4, churned: 12.6 },
    { period: '120 Days', retained: 84.1, churned: 15.9 },
    { period: '180 Days', retained: 79.3, churned: 20.7 },
    { period: '365 Days', retained: 71.8, churned: 28.2 }
  ],

  conversionTimeDistribution: [
    { days: '1-3 Days', count: 234, percentage: 16.4 },
    { days: '4-7 Days', count: 412, percentage: 28.9 },
    { days: '8-11 Days', count: 487, percentage: 34.2 },
    { days: '12-14 Days', count: 290, percentage: 20.4 }
  ],
  
  insights: {
    conversionRate: 43.8,
    conversionTiming: "Most conversions (63.1%) happen between days 4-11",
    retentionRate90Days: 87.4,
    bestSource: { name: "Referral", rate: 47.7, revenue: 94.80 }
  }
};
