import { BaseReportService } from './baseReportService';
import { ReportFilters } from './types';

export class EngagementReportService extends BaseReportService {
  // Digital engagement data
  async getDigitalEngagementData(filters?: ReportFilters) {
    // Get digital subscriptions
    let subscriptionsQuery = this.getSupabaseClient()
      .from('subscriptions')
      .select('id, digital_access, current_price, start_date, subscriber_id')
      .eq('status', 'active')
      .eq('digital_access', true);

    if (filters?.dateRange?.startDate) {
      subscriptionsQuery = subscriptionsQuery.gte('start_date', filters.dateRange.startDate.toISOString().split('T')[0]);
    }

    if (filters?.dateRange?.endDate) {
      subscriptionsQuery = subscriptionsQuery.lte('start_date', filters.dateRange.endDate.toISOString().split('T')[0]);
    }

    const { data: subscriptions, error: subscriptionsError } = await subscriptionsQuery;
    if (subscriptionsError) throw subscriptionsError;

    // Get subscriber data separately if we have subscriptions
    let subscribers = [];
    if (subscriptions && subscriptions.length > 0) {
      const subscriberIds = subscriptions.map(sub => sub.subscriber_id).filter(Boolean);
      
      if (subscriberIds.length > 0) {
        const { data: subscribersData, error: subscribersError } = await this.getSupabaseClient()
          .from('subscribers')
          .select('id, email, created_at')
          .in('id', subscriberIds);
        
        if (subscribersError) throw subscribersError;
        subscribers = subscribersData || [];
      }
    }

    
    // Mock engagement metrics based on subscription data
    const digitalSubscribers = subscriptions ? subscriptions.length : 0;
    const avgOpenRate = 68.5 + (Math.random() * 10 - 5); // 63.5-73.5%
    const avgClickRate = 12.3 + (Math.random() * 4 - 2); // 10.3-14.3%
    const avgTimeOnPage = 8.2 + (Math.random() * 2 - 1); // 7.2-9.2 minutes
    
    // Generate monthly engagement data
    const monthlyEngagement = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    for (const month of months) {
      monthlyEngagement.push({
        month,
        opens: Math.floor(digitalSubscribers * 0.68 + Math.random() * 1000),
        clicks: Math.floor(digitalSubscribers * 0.12 + Math.random() * 200),
        sessions: Math.floor(digitalSubscribers * 0.45 + Math.random() * 500)
      });
    }

    // Device breakdown
    const deviceBreakdown = [
      { device: 'Mobile', users: Math.floor(digitalSubscribers * 0.6), percentage: 60.0 },
      { device: 'Desktop', users: Math.floor(digitalSubscribers * 0.3), percentage: 30.0 },
      { device: 'Tablet', users: Math.floor(digitalSubscribers * 0.1), percentage: 10.0 }
    ];

    return {
      digitalSubscribers,
      avgOpenRate: parseFloat(avgOpenRate.toFixed(1)),
      avgClickRate: parseFloat(avgClickRate.toFixed(1)),
      avgTimeOnPage: parseFloat(avgTimeOnPage.toFixed(1)),
      topDevice: 'Mobile',
      loginFrequency: 4.2,
      monthlyEngagement,
      deviceBreakdown
    };
  }

  // Issue fulfillment data
  async getIssueFulfillmentData(filters?: ReportFilters) {
    // Get print subscriptions that need fulfillment
    let query = this.getSupabaseClient()
      .from('subscriptions')
      .select(`
        id, subscription_type, current_price, start_date, print_delivery, address_verified, subscriber_id
      `)
      .eq('status', 'active')
      .eq('print_delivery', true);

    if (filters?.dateRange?.startDate) {
      query = query.gte('start_date', filters.dateRange.startDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query;
    if (error) throw error;

    const subscriptions = data || [];
    
    // Mock issue data since we don't have an issues table
    const totalIssues = subscriptions.length * 12; // Assume monthly publication
    const deliveredIssues = Math.floor(totalIssues * 0.95); // 95% delivery rate
    const pendingIssues = totalIssues - deliveredIssues;
    const failedDeliveries = Math.floor(totalIssues * 0.02); // 2% failure rate

    return {
      totalSubscriptions: subscriptions.length,
      totalIssues,
      deliveredIssues,
      pendingIssues,
      failedDeliveries,
      deliveryRate: (deliveredIssues / totalIssues * 100).toFixed(1),
      addressVerificationRate: (subscriptions.filter(sub => sub.address_verified).length / subscriptions.length * 100).toFixed(1),
      fulfillmentDetails: subscriptions.slice(0, 20).map((sub, index) => ({ // Limit to 20 for display
        id: sub.id.slice(0, 8),
        subscriber: `user${index + 1}@example.com`,
        lastIssue: '2024-11-01',
        nextIssue: '2024-12-01',
        status: Math.random() > 0.1 ? 'Delivered' : 'Pending',
        issuesRemaining: Math.floor(Math.random() * 12) + 1,
        address: 'Sample Address, City, State'
      }))
    };
  }
}