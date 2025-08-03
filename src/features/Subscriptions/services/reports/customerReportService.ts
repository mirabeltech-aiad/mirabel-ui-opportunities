import { BaseReportService } from './baseReportService';
import { ReportFilters } from './types';

export class CustomerReportService extends BaseReportService {
  // Get subscribers (customers)
  async getCustomers(filters?: ReportFilters) {
    let query = this.getSupabaseClient()
      .from('subscribers')
      .select('*');

    query = this.applyDateFilters(query, filters);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Subscriber demographics data
  async getSubscriberDemographicsData(filters?: ReportFilters) {
    // Get subscribers with demographic information
    let subscribersQuery = this.getSupabaseClient()
      .from('subscribers')
      .select('*');

    subscribersQuery = this.applyDateFilters(subscribersQuery, filters, 'created_at');

    const { data: subscribers, error: subscribersError } = await subscribersQuery;
    if (subscribersError) throw subscribersError;

    const subscribersList = subscribers || [];
    const totalSubscribers = subscribersList.length;

    // Calculate age groups (using mock data since date_of_birth might not have complete data)
    const ageGroups = [
      { range: '18-24', count: Math.floor(totalSubscribers * 0.067), percentage: 6.7, avgRevenue: 180.50 },
      { range: '25-34', count: Math.floor(totalSubscribers * 0.256), percentage: 25.6, avgRevenue: 245.75 },
      { range: '35-44', count: Math.floor(totalSubscribers * 0.310), percentage: 31.0, avgRevenue: 310.20 },
      { range: '45-54', count: Math.floor(totalSubscribers * 0.225), percentage: 22.5, avgRevenue: 385.40 },
      { range: '55-64', count: Math.floor(totalSubscribers * 0.113), percentage: 11.3, avgRevenue: 420.80 },
      { range: '65+', count: Math.floor(totalSubscribers * 0.029), percentage: 2.9, avgRevenue: 390.60 }
    ];

    // Calculate gender distribution from available data
    const genderCounts = subscribersList.reduce((acc, sub) => {
      const gender = sub.gender || 'Other/Prefer not to say';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const genderDistribution = Object.entries(genderCounts).map(([gender, count]) => ({
      gender,
      count,
      percentage: parseFloat(((count / totalSubscribers) * 100).toFixed(1)),
      avgRevenue: 295.30 + Math.random() * 50 // Mock average revenue
    }));

    // Get industry data from subscribers
    const industryCounts = subscribersList.reduce((acc, sub) => {
      const industry = sub.industry || 'Other';
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const industries = Object.entries(industryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([industry, count]) => ({
        industry,
        count,
        percentage: parseFloat(((count / totalSubscribers) * 100).toFixed(1)),
        avgIncome: 70000 + Math.random() * 50000,
        growthRate: 1.2 + Math.random() * 3
      }));

    // Job titles from occupation field
    const jobTitleCounts = subscribersList.reduce((acc, sub) => {
      const title = sub.occupation || 'Other';
      acc[title] = (acc[title] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const jobTitles = Object.entries(jobTitleCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([title, count]) => ({
        title,
        count,
        percentage: parseFloat(((count / totalSubscribers) * 100).toFixed(1)),
        topIndustries: ['Technology', 'Finance', 'Healthcare'] // Mock related industries
      }));

    // Mock income brackets (would need additional subscriber data)
    const incomeBrackets = [
      { bracket: '$25K-$40K', count: Math.floor(totalSubscribers * 0.125), percentage: 12.5, subscriptionPreference: 'Digital', avgLTV: 185.20 },
      { bracket: '$40K-$60K', count: Math.floor(totalSubscribers * 0.226), percentage: 22.6, subscriptionPreference: 'Digital', avgLTV: 245.80 },
      { bracket: '$60K-$80K', count: Math.floor(totalSubscribers * 0.282), percentage: 28.2, subscriptionPreference: 'Both', avgLTV: 295.40 },
      { bracket: '$80K-$100K', count: Math.floor(totalSubscribers * 0.208), percentage: 20.8, subscriptionPreference: 'Both', avgLTV: 345.60 },
      { bracket: '$100K+', count: Math.floor(totalSubscribers * 0.160), percentage: 16.0, subscriptionPreference: 'Print', avgLTV: 425.90 }
    ];

    // Mock behavioral tags (would need engagement tracking data)
    const behavioralTags = [
      { tag: 'Tech Enthusiast', count: Math.floor(totalSubscribers * 0.151), percentage: 15.1, engagementScore: 92, topContent: ['Tech Reviews', 'Industry News', 'Product Launches'] },
      { tag: 'Business Leader', count: Math.floor(totalSubscribers * 0.125), percentage: 12.5, engagementScore: 88, topContent: ['Market Analysis', 'Leadership', 'Strategy'] },
      { tag: 'Health Conscious', count: Math.floor(totalSubscribers * 0.099), percentage: 9.9, engagementScore: 85, topContent: ['Wellness', 'Fitness', 'Nutrition'] },
      { tag: 'Financial Investor', count: Math.floor(totalSubscribers * 0.086), percentage: 8.6, engagementScore: 90, topContent: ['Market News', 'Investment Tips', 'Economic Analysis'] },
      { tag: 'Sports Fan', count: Math.floor(totalSubscribers * 0.077), percentage: 7.7, engagementScore: 82, topContent: ['Sports News', 'Player Stats', 'Game Analysis'] }
    ];

    // Sample detailed segments from real subscriber data
    const detailedSegments = subscribersList.slice(0, 3).map((sub, index) => {
      const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
      const incomeRanges = ['$25K-$40K', '$40K-$60K', '$60K-$80K', '$80K-$100K', '$100K+'];
      const subscriptionTypes = ['Digital Only', 'Print Only', 'Digital + Print'];
      const behavioralTagsList = ['Tech Enthusiast', 'Business Leader', 'Health Conscious', 'Financial Investor'];

      return {
        id: sub.id.slice(0, 8),
        name: `${sub.first_name || 'User'} ${sub.last_name || index + 1}`,
        age: ageRanges[Math.floor(Math.random() * ageRanges.length)],
        gender: sub.gender || 'Other',
        jobTitle: sub.occupation || 'Professional',
        industry: sub.industry || 'Technology',
        income: incomeRanges[Math.floor(Math.random() * incomeRanges.length)],
        location: 'City, State', // Would need address data
        subscriptionType: subscriptionTypes[Math.floor(Math.random() * subscriptionTypes.length)],
        behavioralTags: [behavioralTagsList[Math.floor(Math.random() * behavioralTagsList.length)]],
        engagementScore: Math.floor(Math.random() * 40) + 60, // 60-100
        totalSpent: parseFloat((Math.random() * 500 + 100).toFixed(2))
      };
    });

    return {
      totalSubscribers,
      ageGroups,
      genderDistribution,
      jobTitles,
      industries,
      incomeBrackets,
      behavioralTags,
      detailedSegments
    };
  }

  // Top customer revenue data
  async getTopCustomerRevenueData(filters?: ReportFilters) {
    // Get subscriptions with basic data for revenue analysis
    let query = this.getSupabaseClient()
      .from('subscriptions')
      .select('id, current_price, subscriber_id, start_date, end_date, subscription_type, plan_name, status')
      .eq('status', 'active');

    query = this.applyDateFilters(query, filters, 'start_date');

    const { data, error } = await query;
    if (error) throw error;

    const subscriptions = data || [];
    
    // Get subscriber details separately to avoid join issues
    const subscriberIds = [...new Set(subscriptions.map(sub => sub.subscriber_id))];
    const { data: subscribers } = await this.getSupabaseClient()
      .from('subscribers')
      .select('id, first_name, last_name, company_name, email')
      .in('id', subscriberIds);

    const subscriberMap = (subscribers || []).reduce((acc, sub) => {
      acc[sub.id] = sub;
      return acc;
    }, {} as Record<string, any>);
    
    // Calculate customer revenue and sort by highest MRR
    const customerRevenue = subscriptions.reduce((acc, sub) => {
      const customerId = sub.subscriber_id;
      const subscriber = subscriberMap[customerId];
      if (!subscriber) return acc;
      
      const companyName = subscriber.company_name || `${subscriber.first_name} ${subscriber.last_name}`;
      const mrr = parseFloat(String(sub.current_price || '0'));
      
      if (!acc[customerId]) {
        acc[customerId] = {
          id: customerId.slice(0, 8),
          companyName,
          plan: sub.plan_name || 'Enterprise',
          mrr: 0,
          tenure: this.calculateTenure(sub.start_date),
          expansionHistory: {
            totalExpansions: Math.floor(Math.random() * 10) + 2,
            lastExpansion: new Date().toISOString().slice(0, 7).replace('-', ' '),
            expansionRevenue: Math.floor(Math.random() * 3000) + 1000
          },
          segment: mrr > 5000 ? 'Enterprise' : mrr > 2000 ? 'Mid-Market' : 'SMB',
          revenueShare: 0
        };
      }
      acc[customerId].mrr += mrr;
      return acc;
    }, {} as Record<string, any>);

    const topCustomers = Object.values(customerRevenue)
      .sort((a: any, b: any) => b.mrr - a.mrr)
      .slice(0, 12);

    const totalRevenue = subscriptions.reduce((sum, sub) => sum + parseFloat(String(sub.current_price || '0')), 0);
    
    // Calculate revenue share for each customer
    topCustomers.forEach((customer: any) => {
      customer.revenueShare = parseFloat(((customer.mrr / totalRevenue) * 100).toFixed(1));
    });

    const totalCustomers = Object.keys(customerRevenue).length;
    const top10PercentCount = Math.ceil(totalCustomers * 0.1);
    const top10PercentRevenue = topCustomers.slice(0, top10PercentCount).reduce((sum: number, c: any) => sum + c.mrr, 0);
    const top10PercentShare = parseFloat(((top10PercentRevenue / totalRevenue) * 100).toFixed(1));
    const averageMrrTop10 = top10PercentCount > 0 ? Math.floor(top10PercentRevenue / top10PercentCount) : 0;

    return {
      topCustomers,
      overallMetrics: {
        top10PercentShare,
        totalCustomers,
        top10PercentCount,
        averageMrrTop10,
        totalRevenue: Math.floor(totalRevenue)
      }
    };
  }

  // Lifetime value data
  async getLifetimeValueData(filters?: ReportFilters) {
    // Get subscriptions with revenue data
    let query = this.getSupabaseClient()
      .from('subscriptions')
      .select('id, current_price, start_date, end_date, status, subscription_type, plan_name, billing_cycle, subscriber_id');

    query = this.applyDateFilters(query, filters, 'start_date');

    const { data, error } = await query;
    if (error) throw error;

    const subscriptions = data || [];
    
    // Get subscriber data separately
    const subscriberIds = [...new Set(subscriptions.map(sub => sub.subscriber_id))];
    const { data: subscribers } = await this.getSupabaseClient()
      .from('subscribers')
      .select('id, data_source')
      .in('id', subscriberIds);

    const subscriberMap = (subscribers || []).reduce((acc, sub) => {
      acc[sub.id] = sub;
      return acc;
    }, {} as Record<string, any>);
    
    // Calculate LTV metrics
    const totalCustomers = subscriptions.length;
    const totalRevenue = subscriptions.reduce((sum, sub) => {
      const mrr = parseFloat(String(sub.current_price || '0'));
      const lifespan = this.calculateLifespanMonths(sub.start_date, sub.end_date);
      return sum + (mrr * lifespan);
    }, 0);
    
    const averageLTV = totalCustomers > 0 ? parseFloat((totalRevenue / totalCustomers).toFixed(2)) : 0;
    const averageLifespan = subscriptions.reduce((sum, sub) => {
      return sum + this.calculateLifespanMonths(sub.start_date, sub.end_date);
    }, 0) / totalCustomers;

    // Channel LTV analysis based on data_source
    const channelGroups = subscriptions.reduce((acc, sub) => {
      const subscriber = subscriberMap[sub.subscriber_id];
      const channel = this.mapDataSourceToChannel(subscriber?.data_source);
      const lifespan = this.calculateLifespanMonths(sub.start_date, sub.end_date);
      const ltv = parseFloat(String(sub.current_price || '0')) * lifespan;
      
      if (!acc[channel]) {
        acc[channel] = { customers: 0, totalRevenue: 0, totalLifespan: 0 };
      }
      acc[channel].customers++;
      acc[channel].totalRevenue += ltv;
      acc[channel].totalLifespan += lifespan;
      return acc;
    }, {} as Record<string, any>);

    const channelLTV = Object.entries(channelGroups).map(([channel, data]: [string, any]) => ({
      channel,
      avgLTV: parseFloat((data.totalRevenue / data.customers).toFixed(2)),
      customers: data.customers,
      totalRevenue: Math.floor(data.totalRevenue),
      avgLifespan: parseFloat((data.totalLifespan / data.customers).toFixed(1)),
      acquisitionCost: this.getChannelAcquisitionCost(channel)
    }));

    // Format LTV analysis
    const formatGroups = subscriptions.reduce((acc, sub) => {
      const format = this.getSubscriptionFormat(sub.subscription_type, sub.plan_name);
      const lifespan = this.calculateLifespanMonths(sub.start_date, sub.end_date);
      const ltv = parseFloat(String(sub.current_price || '0')) * lifespan;
      
      if (!acc[format]) {
        acc[format] = { customers: 0, revenue: 0, totalLifespan: 0 };
      }
      acc[format].customers++;
      acc[format].revenue += ltv;
      acc[format].totalLifespan += lifespan;
      return acc;
    }, {} as Record<string, any>);

    const formatLTV = Object.entries(formatGroups).map(([format, data]: [string, any]) => ({
      format,
      avgLTV: parseFloat((data.revenue / data.customers).toFixed(2)),
      customers: data.customers,
      revenue: Math.floor(data.revenue),
      lifespan: parseFloat((data.totalLifespan / data.customers).toFixed(1))
    }));

    // Term length LTV analysis
    const termGroups = subscriptions.reduce((acc, sub) => {
      const term = this.getTermLength(sub.billing_cycle);
      const lifespan = this.calculateLifespanMonths(sub.start_date, sub.end_date);
      const ltv = parseFloat(String(sub.current_price || '0')) * lifespan;
      
      if (!acc[term]) {
        acc[term] = { customers: 0, revenue: 0, totalLifespan: 0 };
      }
      acc[term].customers++;
      acc[term].revenue += ltv;
      acc[term].totalLifespan += lifespan;
      return acc;
    }, {} as Record<string, any>);

    const termLTV = Object.entries(termGroups).map(([term, data]: [string, any]) => ({
      term,
      avgLTV: parseFloat((data.revenue / data.customers).toFixed(2)),
      customers: data.customers,
      revenue: Math.floor(data.revenue),
      avgLifespan: parseFloat((data.totalLifespan / data.customers).toFixed(1)),
      retention: this.getRetentionByTerm(term)
    }));

    // Generate trend data (mock for now)
    const ltvTrends = this.generateLTVTrends(averageLTV);

    return {
      ltvSummary: {
        averageLTV,
        totalCustomers,
        totalRevenue: Math.floor(totalRevenue),
        averageLifespan: parseFloat(averageLifespan.toFixed(1)),
        acquisitionCostRatio: 0.18
      },
      channelLTV,
      formatLTV,
      termLTV,
      ltvTrends
    };
  }

  private calculateTenure(startDate: string): string {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    return `${years} years ${months} months`;
  }

  private calculateLifespanMonths(startDate: string, endDate?: string): number {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)));
  }

  private mapDataSourceToChannel(dataSource?: string): string {
    const mapping: Record<string, string> = {
      'website': 'Direct Website',
      'google_ads': 'Google Ads',
      'facebook': 'Facebook Ads',
      'email': 'Email Marketing',
      'referral': 'Referral Program',
      'direct_mail': 'Direct Mail',
      'social': 'Social Media'
    };
    return mapping[dataSource || ''] || 'Direct Website';
  }

  private getChannelAcquisitionCost(channel: string): number {
    const costs: Record<string, number> = {
      'Direct Website': 45.20,
      'Google Ads': 87.50,
      'Facebook Ads': 78.57,
      'Email Marketing': 25.30,
      'Referral Program': 35.80,
      'Direct Mail': 95.60,
      'Social Media': 62.40
    };
    return costs[channel] || 50.00;
  }

  private getSubscriptionFormat(type?: string, plan?: string): string {
    if (plan?.includes('Digital') && plan?.includes('Print')) return 'Print + Digital';
    if (plan?.includes('Digital') || type === 'digital') return 'Digital Only';
    return 'Print Only';
  }

  private getTermLength(billingCycle?: string): string {
    const mapping: Record<string, string> = {
      'monthly': 'Monthly',
      'quarterly': 'Quarterly', 
      'annual': 'Annual',
      'yearly': 'Annual'
    };
    return mapping[billingCycle || ''] || 'Annual';
  }

  private getRetentionByTerm(term: string): number {
    const rates: Record<string, number> = {
      'Monthly': 65,
      'Quarterly': 72,
      'Annual': 78,
      'Multi-year': 85
    };
    return rates[term] || 70;
  }

  private generateLTVTrends(currentLTV: number) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      avgLTV: parseFloat((currentLTV * (0.95 + index * 0.01)).toFixed(2)),
      newCustomers: Math.floor(Math.random() * 200) + 800
    }));
  }

  // Complimentary subscriptions data
  async getComplimentarySubscriptionsData(filters?: ReportFilters) {
    // Get complimentary subscriptions (identify by zero price or plan name containing 'complimentary')
    let query = this.getSupabaseClient()
      .from('subscriptions')
      .select(`
        id, subscriber_id, current_price, start_date, status,
        subscription_type, plan_name
      `)
      .or('current_price.eq.0,plan_name.ilike.%complimentary%')
      .eq('status', 'active');

    query = this.applyDateFilters(query, filters, 'start_date');

    const { data, error } = await query;
    if (error) throw error;

    const subscriptions = data || [];
    
    // Get subscriber details
    const subscriberIds = [...new Set(subscriptions.map(sub => sub.subscriber_id))];
    const { data: subscribers } = await this.getSupabaseClient()
      .from('subscribers')
      .select('id, first_name, last_name, company_name, email, industry, occupation')
      .in('id', subscriberIds);

    const subscriberMap = (subscribers || []).reduce((acc, sub) => {
      acc[sub.id] = sub;
      return acc;
    }, {} as Record<string, any>);

    const totalComplimentary = subscriptions.length;
    
    // Mock qualification data (would need additional tracking)
    const qualificationTypes = ['BPA Qualified', 'Industry VIP', 'Academic', 'Media Exchange', 'Research Institution', 'Government Official'];
    const sources = ['BPA Request', 'Editorial Request', 'Academic Program', 'Media Partnership', 'Research Grant', 'Government Request'];
    const engagementLevels = ['Very High', 'High', 'Medium', 'Low'];

    // Create detailed subscription records
    const complimentarySubscriptions = subscriptions.slice(0, 50).map((sub, index) => {
      const subscriber = subscriberMap[sub.subscriber_id];
      if (!subscriber) return null;

      const qualificationType = qualificationTypes[Math.floor(Math.random() * qualificationTypes.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const engagementLevel = engagementLevels[Math.floor(Math.random() * engagementLevels.length)];
      const engagementScore = 
        engagementLevel === 'Very High' ? Math.floor(Math.random() * 10) + 90 :
        engagementLevel === 'High' ? Math.floor(Math.random() * 15) + 75 :
        engagementLevel === 'Medium' ? Math.floor(Math.random() * 20) + 55 :
        Math.floor(Math.random() * 25) + 30;

      return {
        id: sub.id.slice(0, 8),
        subscriberName: `${subscriber.first_name || 'User'} ${subscriber.last_name || index + 1}`,
        email: subscriber.email,
        company: subscriber.company_name || 'Individual',
        qualificationType,
        subscriptionSource: source,
        engagementLevel,
        engagementScore,
        status: sub.status === 'active' ? 'Active' : 'Inactive'
      };
    }).filter(Boolean);

    // Calculate metrics
    const bpaQualified = complimentarySubscriptions.filter(sub => sub?.qualificationType === 'BPA Qualified').length;
    const highEngagement = complimentarySubscriptions.filter(sub => sub && ['Very High', 'High'].includes(sub.engagementLevel)).length;
    const avgEngagementScore = complimentarySubscriptions.reduce((sum, sub) => sum + (sub?.engagementScore || 0), 0) / complimentarySubscriptions.length;

    // Generate chart data
    const qualificationTypeData = qualificationTypes.map(type => ({
      type,
      count: complimentarySubscriptions.filter(sub => sub?.qualificationType === type).length,
      percentage: parseFloat(((complimentarySubscriptions.filter(sub => sub?.qualificationType === type).length / totalComplimentary) * 100).toFixed(1))
    }));

    const engagementLevelData = engagementLevels.map(level => ({
      level,
      count: complimentarySubscriptions.filter(sub => sub?.engagementLevel === level).length
    }));

    return {
      totalComplimentary,
      bpaQualified,
      highEngagement,
      avgEngagementScore: parseFloat(avgEngagementScore.toFixed(1)),
      qualificationTypeData,
      engagementLevelData,
      complimentarySubscriptions
    };
  }

  // Customer segmentation data
  async getCustomerSegmentationData(filters?: ReportFilters) {
    // Get all subscriptions with subscriber details
    let query = this.getSupabaseClient()
      .from('subscriptions')
      .select('id, current_price, subscriber_id, start_date, end_date, status, subscription_type, plan_name');

    query = this.applyDateFilters(query, filters, 'start_date');

    const { data, error } = await query;
    if (error) throw error;

    const subscriptions = data || [];
    
    // Get subscriber details
    const subscriberIds = [...new Set(subscriptions.map(sub => sub.subscriber_id))];
    const { data: subscribers } = await this.getSupabaseClient()
      .from('subscribers')
      .select('id, first_name, last_name, company_name, industry, occupation')
      .in('id', subscriberIds);

    const subscriberMap = (subscribers || []).reduce((acc, sub) => {
      acc[sub.id] = sub;
      return acc;
    }, {} as Record<string, any>);

    // Calculate segments based on MRR, tenure, and behavior
    const customerData = subscriptions.reduce((acc, sub) => {
      const customerId = sub.subscriber_id;
      const subscriber = subscriberMap[customerId];
      if (!subscriber) return acc;
      
      const mrr = parseFloat(String(sub.current_price || '0'));
      const tenure = this.calculateLifespanMonths(sub.start_date, sub.end_date);
      
      if (!acc[customerId]) {
        acc[customerId] = {
          id: customerId,
          mrr: 0,
          tenure,
          subscriptions: 0,
          industry: subscriber.industry || 'Other',
          company: subscriber.company_name || 'Individual'
        };
      }
      acc[customerId].mrr += mrr;
      acc[customerId].subscriptions++;
      return acc;
    }, {} as Record<string, any>);

    const customers = Object.values(customerData);
    const totalCustomers = customers.length;
    const totalMRR = customers.reduce((sum: number, c: any) => sum + c.mrr, 0);

    // Create segments
    const segments = [
      {
        id: 'enterprise',
        segmentName: 'Enterprise',
        category: 'Size-Based',
        filter: (c: any) => c.mrr >= 1000,
        characteristics: ['High value', 'Multi-subscriptions', 'Long tenure']
      },
      {
        id: 'mid-market',
        segmentName: 'Mid-Market',
        category: 'Size-Based',
        filter: (c: any) => c.mrr >= 200 && c.mrr < 1000,
        characteristics: ['Growth potential', 'Standard plans', 'Stable usage']
      },
      {
        id: 'smb',
        segmentName: 'Small Business',
        category: 'Size-Based',
        filter: (c: any) => c.mrr > 0 && c.mrr < 200,
        characteristics: ['Price sensitive', 'Basic plans', 'Self-service']
      },
      {
        id: 'new-customers',
        segmentName: 'New Customers',
        category: 'Lifecycle',
        filter: (c: any) => c.tenure <= 6,
        characteristics: ['Recently acquired', 'Onboarding phase', 'Higher churn risk']
      },
      {
        id: 'mature-customers',
        segmentName: 'Mature Customers',
        category: 'Lifecycle',
        filter: (c: any) => c.tenure > 24,
        characteristics: ['Long tenure', 'Stable revenue', 'Low churn']
      },
      {
        id: 'power-users',
        segmentName: 'Power Users',
        category: 'Behavioral',
        filter: (c: any) => c.subscriptions > 1,
        characteristics: ['Multiple subscriptions', 'High engagement', 'Brand advocates']
      }
    ];

    const segmentAnalysis = segments.map(segment => {
      const segmentCustomers = customers.filter(segment.filter);
      const segmentMRR = segmentCustomers.reduce((sum: number, c: any) => sum + c.mrr, 0);
      const customerCount = segmentCustomers.length;
      
      return {
        id: segment.id,
        segmentName: segment.segmentName,
        category: segment.category,
        customerCount,
        mrr: Math.floor(segmentMRR),
        arpa: customerCount > 0 ? parseFloat((segmentMRR / customerCount).toFixed(2)) : 0,
        churnRate: this.getMockChurnRate(segment.id),
        growthRate: this.getMockGrowthRate(segment.id),
        characteristics: segment.characteristics
      };
    });

    // Overall metrics
    const overallMetrics = {
      totalCustomers,
      totalMRR: Math.floor(totalMRR),
      averageARPA: totalCustomers > 0 ? parseFloat((totalMRR / totalCustomers).toFixed(2)) : 0,
      overallChurnRate: 4.2,
      segmentCount: segments.length
    };

    // Chart data for top segments by MRR
    const chartData = segmentAnalysis
      .filter(s => s.mrr > 0)
      .sort((a, b) => b.mrr - a.mrr)
      .slice(0, 6)
      .map((s, index) => ({
        segment: s.segmentName,
        mrr: s.mrr,
        fill: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'][index]
      }));

    return {
      overallMetrics,
      customerSegments: segmentAnalysis,
      chartData
    };
  }

  private getMockChurnRate(segmentId: string): number {
    const rates: Record<string, number> = {
      'enterprise': 1.2,
      'mid-market': 2.8,
      'smb': 6.5,
      'new-customers': 8.9,
      'mature-customers': 2.1,
      'power-users': 1.8
    };
    return rates[segmentId] || 4.2;
  }

  private getMockGrowthRate(segmentId: string): number {
    const rates: Record<string, number> = {
      'enterprise': 8.5,
      'mid-market': 12.3,
      'smb': 18.7,
      'new-customers': 45.2,
      'mature-customers': -2.8,
      'power-users': 6.2
    };
    return rates[segmentId] || 5.0;
  }
}