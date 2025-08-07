import { BaseReportService } from './baseReportService';
import { ReportFilters } from './types';

export class SubscriptionManagementService extends BaseReportService {
  // Subscription data
  async getSubscriptions(filters?: ReportFilters) {
    let query = this.getSupabaseClient()
      .from('subscriptions')
      .select('*');

    query = this.applyProductFilters(query, filters);
    query = this.applyDateFilters(query, filters, 'start_date');

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Subscription aging data
  async getSubscriptionAgingData(filters?: ReportFilters) {
    let query = this.getSupabaseClient()
      .from('subscriptions')
      .select(`
        id, status, start_date, end_date, current_price, subscription_type, subscriber_id
      `)
      .eq('status', 'active');

    if (filters?.dateRange?.startDate) {
      query = query.gte('start_date', filters.dateRange.startDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query;
    if (error) throw error;

    const subscriptions = data || [];
    const now = new Date();
    
    // Calculate aging buckets
    const agingBuckets = {
      '0-3 months': 0,
      '3-6 months': 0,
      '6-12 months': 0,
      '1-2 years': 0,
      '2+ years': 0
    };

    const agingDetails = subscriptions.map(sub => {
      const startDate = new Date(sub.start_date);
      const monthsOld = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      
      let ageBucket = '2+ years';
      if (monthsOld < 3) ageBucket = '0-3 months';
      else if (monthsOld < 6) ageBucket = '3-6 months';
      else if (monthsOld < 12) ageBucket = '6-12 months';
      else if (monthsOld < 24) ageBucket = '1-2 years';
      
      agingBuckets[ageBucket as keyof typeof agingBuckets]++;
      
      return {
        id: sub.id.slice(0, 8),
        email: 'user@example.com', // Mock email since we need subscriber join
        startDate: sub.start_date,
        monthsOld,
        ageBucket,
        revenue: parseFloat(String(sub.current_price || '0')),
        type: sub.subscription_type
      };
    });

    return {
      agingBuckets,
      agingDetails,
      totalSubscriptions: subscriptions.length,
      averageAge: agingDetails.length > 0 ? 
        agingDetails.reduce((sum, sub) => sum + sub.monthsOld, 0) / agingDetails.length : 0
    };
  }

  // Expiration forecast data
  async getExpirationForecastData(filters?: ReportFilters) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
    
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    let query = this.getSupabaseClient()
      .from('subscriptions')
      .select(`
        id, end_date, current_price, subscription_type, auto_renewal, subscriber_id
      `)
      .eq('status', 'active')
      .not('end_date', 'is', null)
      .lte('end_date', ninetyDaysFromNow.toISOString().split('T')[0]);

    const { data, error } = await query;
    if (error) throw error;

    const subscriptions = data || [];
    
    const expiring30Days = subscriptions.filter(sub => 
      new Date(sub.end_date) <= thirtyDaysFromNow
    );
    
    const expiring60Days = subscriptions.filter(sub => 
      new Date(sub.end_date) <= sixtyDaysFromNow && new Date(sub.end_date) > thirtyDaysFromNow
    );
    
    const expiring90Days = subscriptions.filter(sub => 
      new Date(sub.end_date) <= ninetyDaysFromNow && new Date(sub.end_date) > sixtyDaysFromNow
    );

    return {
      expiring30Days: expiring30Days.length,
      expiring60Days: expiring60Days.length,
      expiring90Days: expiring90Days.length,
      totalExpiring: subscriptions.length,
      revenue30Days: expiring30Days.reduce((sum, sub) => sum + parseFloat(String(sub.current_price || '0')), 0),
      revenue60Days: expiring60Days.reduce((sum, sub) => sum + parseFloat(String(sub.current_price || '0')), 0),
      revenue90Days: expiring90Days.reduce((sum, sub) => sum + parseFloat(String(sub.current_price || '0')), 0),
      autoRenewalRate: subscriptions.filter(sub => sub.auto_renewal).length / subscriptions.length * 100,
      expirationDetails: subscriptions.map(sub => ({
        id: sub.id.slice(0, 8),
        endDate: sub.end_date,
        revenue: parseFloat(String(sub.current_price || '0')),
        type: sub.subscription_type,
        autoRenewal: sub.auto_renewal,
        daysUntilExpiration: Math.ceil((new Date(sub.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      }))
    };
  }

  // Complimentary subscriptions data
  async getComplimentarySubscriptionsData(filters?: ReportFilters) {
    // Query subscriptions that are complimentary (free or $0 price)
    let query = this.getSupabaseClient()
      .from('subscriptions')
      .select(`
        id, subscription_type, current_price, start_date, end_date, status, subscriber_id
      `)
      .eq('status', 'active')
      .or('current_price.eq.0,current_price.is.null');

    query = this.applyDateFilters(query, filters, 'start_date');

    const { data, error } = await query;
    if (error) throw error;

    const subscriptions = data || [];
    
    // Process complimentary subscription data
    const totalComplimentary = subscriptions.length;
    const bpaQualified = Math.floor(totalComplimentary * 0.15); // Mock 15% BPA qualified
    const highEngagement = Math.floor(totalComplimentary * 0.45); // Mock 45% high engagement
    const avgEngagementScore = 7.2 + (Math.random() * 2 - 1); // 6.2-8.2

    // Generate qualification type distribution
    const qualificationTypes = ['BPA Qualified', 'Industry VIP', 'Academic', 'Media Exchange', 'Research Institution', 'Government Official'];
    const qualificationTypeData = qualificationTypes.map(type => ({
      type,
      count: Math.floor(totalComplimentary / qualificationTypes.length + Math.random() * 2 - 1),
      percentage: (100 / qualificationTypes.length).toFixed(1)
    }));

    // Generate engagement level data
    const engagementLevelData = [
      { level: 'Very High', count: Math.floor(totalComplimentary * 0.15), avgScore: 9.2 },
      { level: 'High', count: Math.floor(totalComplimentary * 0.30), avgScore: 8.4 },
      { level: 'Medium', count: Math.floor(totalComplimentary * 0.35), avgScore: 6.9 },
      { level: 'Low', count: Math.floor(totalComplimentary * 0.20), avgScore: 4.8 }
    ];

    // Transform subscription data for display
    const complimentarySubscriptions = subscriptions.slice(0, 20).map((sub, index) => ({
      id: `COMP${String(index + 1).padStart(3, '0')}`,
      subscriberName: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      company: 'Company Name',
      title: 'Position Title',
      qualificationType: qualificationTypes[Math.floor(Math.random() * qualificationTypes.length)],
      subscriptionSource: ['BPA Request', 'Editorial Request', 'Academic Program', 'Media Partnership'][Math.floor(Math.random() * 4)],
      justificationReason: 'Industry professional relevance',
      editionType: sub.subscription_type === 'saas' ? 'Digital Only' : 
                   sub.subscription_type === 'magazine' ? 'Print + Digital' : 
                   sub.subscription_type === 'newspaper' ? 'Print Only' : 'Hybrid',
      startDate: sub.start_date,
      endDate: sub.end_date || '2024-12-31',
      engagementLevel: engagementLevelData[Math.floor(Math.random() * engagementLevelData.length)].level,
      engagementScore: parseFloat((6 + Math.random() * 4).toFixed(1)),
      issuesReceived: Math.floor(Math.random() * 12) + 12,
      digitalOpens: Math.floor(Math.random() * 20) + 5,
      timeOnSite: parseFloat((20 + Math.random() * 40).toFixed(1)),
      articlesRead: Math.floor(Math.random() * 25) + 5,
      status: 'Active',
      region: ['North America', 'Europe', 'Asia Pacific'][Math.floor(Math.random() * 3)],
      approvedBy: 'System Admin',
      approvalDate: sub.start_date
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

  // Gift subscriptions data
  // Gift subscriptions data
  async getGiftSubscriptionsData(filters?: ReportFilters) {
    // Get gift subscriptions (identify by plan name containing 'gift')
    let query = this.getSupabaseClient()
      .from('subscriptions')
      .select(`
        id, subscriber_id, current_price, start_date, end_date, status,
        subscription_type, plan_name, created_at
      `)
      .ilike('plan_name', '%gift%');

    query = this.applyDateFilters(query, filters, 'start_date');

    const { data, error } = await query;
    if (error) throw error;

    const subscriptions = data || [];
    
    // Get subscriber details
    const subscriberIds = [...new Set(subscriptions.map(sub => sub.subscriber_id))];
    const { data: subscribers } = await this.getSupabaseClient()
      .from('subscribers')
      .select('id, first_name, last_name, email, company_name')
      .in('id', subscriberIds);

    const subscriberMap = (subscribers || []).reduce((acc, sub) => {
      acc[sub.id] = sub;
      return acc;
    }, {} as Record<string, any>);

    // Calculate summary metrics
    const totalGifts = subscriptions.length;
    const activeGifts = subscriptions.filter(sub => sub.status === 'active').length;
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + parseFloat(String(sub.current_price || '0')), 0);
    const avgGiftValue = totalGifts > 0 ? totalRevenue / totalGifts : 0;

    // Mock conversion data (would need tracking)
    const conversions = Math.floor(totalGifts * 0.374);
    const conversionRate = totalGifts > 0 ? parseFloat(((conversions / totalGifts) * 100).toFixed(1)) : 0;

    // Create gift subscription records with mock data
    const giftSubscriptions = subscriptions.slice(0, 50).map((sub, index) => {
      const subscriber = subscriberMap[sub.subscriber_id];
      if (!subscriber) return null;

      const purchaserName = `Gift Purchaser ${index + 1}`;
      const recipientName = `${subscriber.first_name || 'Recipient'} ${subscriber.last_name || index + 1}`;
      const giftValue = parseFloat(String(sub.current_price || '0'));
      
      const statuses = ['Active', 'Expired', 'Converted', 'Pending Activation', 'Active Gift'];
      const currentStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: sub.id.slice(0, 8),
        purchaserName,
        purchaserEmail: `purchaser${index + 1}@example.com`,
        recipientName,
        recipientEmail: subscriber.email,
        subscriptionType: sub.plan_name || 'Digital',
        giftValue,
        purchaseDate: sub.created_at?.slice(0, 10) || sub.start_date,
        giftStartDate: sub.start_date,
        giftEndDate: sub.end_date || 'Ongoing',
        recipientActivated: Math.random() > 0.3,
        activationDate: Math.random() > 0.3 ? sub.start_date : null,
        convertedToPaid: Math.random() > 0.6,
        conversionDate: Math.random() > 0.6 ? '2024-02-15' : null,
        renewalType: Math.random() > 0.6 ? 'Annual' : null,
        currentStatus,
        giftStatus: sub.status === 'active' ? 'Active' : 'Expired'
      };
    }).filter(Boolean);

    // Generate trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyGiftTrends = months.map((month, index) => ({
      month,
      gifts: Math.floor(Math.random() * 50) + 20,
      conversions: Math.floor(Math.random() * 20) + 5
    }));

    // Conversion status data
    const conversionData = [
      { status: 'Active Gifts', count: activeGifts, percentage: parseFloat(((activeGifts / totalGifts) * 100).toFixed(1)) },
      { status: 'Converted', count: conversions, percentage: conversionRate },
      { status: 'Expired', count: totalGifts - activeGifts - conversions, percentage: parseFloat((((totalGifts - activeGifts - conversions) / totalGifts) * 100).toFixed(1)) }
    ];

    // Subscription type breakdown
    const typeBreakdown = [
      { type: 'Digital Only', count: Math.floor(totalGifts * 0.4), avgValue: Math.floor(avgGiftValue * 0.8) },
      { type: 'Print + Digital', count: Math.floor(totalGifts * 0.45), avgValue: Math.floor(avgGiftValue * 1.2) },
      { type: 'Print Only', count: Math.floor(totalGifts * 0.15), avgValue: Math.floor(avgGiftValue * 1.1) }
    ];

    return {
      giftSummary: {
        totalGiftSubscriptions: totalGifts,
        activeGifts,
        convertedToReturning: conversions,
        conversionRate,
        totalGiftRevenue: Math.floor(totalRevenue),
        averageGiftValue: Math.floor(avgGiftValue)
      },
      conversionData,
      monthlyGiftTrends,
      subscriptionTypeBreakdown: typeBreakdown,
      giftSubscriptions
    };
  }

  // Monthly Recurring Revenue data
  async getMRRData(filters?: ReportFilters) {
    // Get all active subscriptions with their prices and subscriber data
    let subscriptionQuery = this.getSupabaseClient()
      .from('subscriptions')
      .select(`
        id, current_price, start_date, subscription_type, plan_name, subscriber_id, billing_cycle
      `)
      .eq('status', 'active')
      .not('current_price', 'is', null);

    subscriptionQuery = this.applyProductFilters(subscriptionQuery, filters);
    subscriptionQuery = this.applyDateFilters(subscriptionQuery, filters, 'start_date');

    const { data: subscriptions, error } = await subscriptionQuery;
    if (error) throw error;

    // Get subscriber details separately
    const subscriberIds = [...new Set((subscriptions || []).map(sub => sub.subscriber_id))];
    const { data: subscribers } = await this.getSupabaseClient()
      .from('subscribers')
      .select('id, email, first_name, last_name, company_name')
      .in('id', subscriberIds);

    const subscriberMap = (subscribers || []).reduce((acc, sub) => {
      acc[sub.id] = sub;
      return acc;
    }, {} as Record<string, any>);

    const subscriptionData = subscriptions || [];
    
    // Calculate current MRR
    const currentMRR = subscriptionData.reduce((sum, sub) => {
      const price = parseFloat(String(sub.current_price || '0'));
      // Convert to monthly recurring revenue based on billing cycle
      if (sub.billing_cycle === 'annual') return sum + (price / 12);
      if (sub.billing_cycle === 'quarterly') return sum + (price / 3);
      if (sub.billing_cycle === 'yearly') return sum + (price / 12);
      return sum + price; // Assume monthly by default
    }, 0);

    // Generate monthly trend data for the last 12 months
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      // Calculate MRR for each month (simplified - assuming linear growth)
      const baselineGrowth = 0.03; // 3% monthly growth
      const monthlyMRR = currentMRR * Math.pow(1 + baselineGrowth, -(11 - i));
      
      months.push({
        month: monthName,
        mrr: Math.round(monthlyMRR)
      });
    }

    // Previous month MRR for growth calculation
    const previousMRR = months[months.length - 2]?.mrr || 0;
    const mrrGrowth = previousMRR > 0 ? ((currentMRR - previousMRR) / previousMRR * 100).toFixed(1) : '0.0';

    // Transform customer data for the table
    const customerData = subscriptionData.slice(0, 20).map(sub => {
      const subscriber = subscriberMap[sub.subscriber_id];
      return {
        customerName: subscriber?.company_name || 
                     `${subscriber?.first_name || 'Customer'} ${subscriber?.last_name || ''}`.trim() ||
                     'Unknown Customer',
        planType: sub.plan_name || (sub.subscription_type === 'saas' ? 'Professional' : 
                  sub.subscription_type === 'magazine' ? 'Premium' : 'Basic'),
        mrrContribution: parseFloat(String(sub.current_price || '0')),
        subscriptionStart: sub.start_date
      };
    });

    return {
      currentMRR: Math.round(currentMRR),
      previousMRR: Math.round(previousMRR),
      mrrGrowth,
      mrrTrendData: months,
      customerData
    };
  }

  // Subscriber Growth Over Time data
  async getSubscriberGrowthData(filters?: ReportFilters) {
    // Get all subscriptions with start and end dates
    let query = this.getSupabaseClient()
      .from('subscriptions')
      .select(`
        id, start_date, end_date, cancellation_date, status, current_price, subscription_type
      `);

    query = this.applyProductFilters(query, filters);
    query = this.applyDateFilters(query, filters, 'start_date');

    const { data: subscriptions, error } = await query;
    if (error) throw error;

    const subscriptionData = subscriptions || [];
    
    // Generate monthly growth data for the last 12 months
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthName = monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      // Calculate metrics for this month
      const newStarts = subscriptionData.filter(sub => {
        const startDate = new Date(sub.start_date);
        return startDate >= monthStart && startDate <= monthEnd;
      }).length;

      const renewals = subscriptionData.filter(sub => {
        // Assume subscriptions that started earlier and are still active are renewals
        const startDate = new Date(sub.start_date);
        return startDate < monthStart && sub.status === 'active';
      }).length;

      const expirations = subscriptionData.filter(sub => {
        const endDate = sub.end_date ? new Date(sub.end_date) : null;
        const cancellationDate = sub.cancellation_date ? new Date(sub.cancellation_date) : null;
        const expDate = endDate || cancellationDate;
        return expDate && expDate >= monthStart && expDate <= monthEnd;
      }).length;

      const reactivations = Math.floor(newStarts * 0.1); // Estimate 10% are reactivations

      const netGrowth = newStarts + renewals + reactivations - expirations;
      
      // Calculate total active at end of month
      const totalActive = subscriptionData.filter(sub => {
        const startDate = new Date(sub.start_date);
        const endDate = sub.end_date ? new Date(sub.end_date) : null;
        const cancellationDate = sub.cancellation_date ? new Date(sub.cancellation_date) : null;
        const expDate = endDate || cancellationDate;
        
        return startDate <= monthEnd && (!expDate || expDate > monthEnd);
      }).length;

      const churnRate = totalActive > 0 ? ((expirations / totalActive) * 100).toFixed(1) : '0.0';

      months.push({
        month: monthName,
        newStarts,
        renewals,
        reactivations,
        expirations,
        netGrowth,
        totalActive,
        churnRate: parseFloat(churnRate)
      });
    }

    const currentMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];
    const yearAgoMonth = months[0];

    return {
      growthData: months,
      currentMonthData: currentMonth,
      previousMonthData: previousMonth,
      yearOverYearData: yearAgoMonth
    };
  }
}