import { BaseReportService } from './baseReportService';
import { ReportFilters, GeographicStats, AcquisitionStats } from './types';

export class GeographicReportService extends BaseReportService {
  // Geographic distribution data
  async getGeographicData(filters?: ReportFilters) {
    try {
      // Query subscribers with their address data and subscriptions using explicit join
      let query = this.getSupabaseClient()
        .from('subscribers')
        .select(`
          id,
          mailing_address,
          created_at
        `);

      query = this.applyDateFilters(query, filters);

      const { data: subscribersData, error: subscribersError } = await query;
      if (subscribersError) throw subscribersError;

      if (!subscribersData || subscribersData.length === 0) {
        return {};
      }

      // Get subscriber IDs
      const subscriberIds = subscribersData.map(sub => sub.id);

      // Query subscriptions for these subscribers
      const { data: subscriptionsData, error: subscriptionsError } = await this.getSupabaseClient()
        .from('subscriptions')
        .select(`
          id,
          subscriber_id,
          subscription_type,
          current_price,
          start_date,
          status
        `)
        .in('subscriber_id', subscriberIds)
        .eq('status', 'active');

      if (subscriptionsError) throw subscriptionsError;

      // Combine the data
      const combinedData = subscribersData.map(subscriber => ({
        ...subscriber,
        subscriptions: subscriptionsData?.filter(sub => sub.subscriber_id === subscriber.id) || []
      }));

      // Process geographic data
      const geographicStats = this.processGeographicData(combinedData);
      return geographicStats;
    } catch (error) {
      console.error('Error fetching geographic data:', error);
      throw error;
    }
  }

  // New acquisition data
  async getNewAcquisitionData(filters?: ReportFilters) {
    try {
      // Get subscribers created in the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      let query = this.getSupabaseClient()
        .from('subscribers')
        .select(`
          id,
          email,
          created_at,
          data_source,
          mailing_address
        `)
        .gte('created_at', sixMonthsAgo.toISOString());

      query = this.applyDateFilters(query, filters);

      const { data: subscribersData, error: subscribersError } = await query;
      if (subscribersError) throw subscribersError;

      // If no data, return empty structure
      if (!subscribersData || subscribersData.length === 0) {
        return {
          monthly: {},
          channels: {},
          totals: {
            subscriptions: 0,
            revenue: 0
          }
        };
      }

      // Get subscriber IDs
      const subscriberIds = subscribersData.map(sub => sub.id);

      // Query subscriptions for these subscribers
      const { data: subscriptionsData, error: subscriptionsError } = await this.getSupabaseClient()
        .from('subscriptions')
        .select(`
          id,
          subscriber_id,
          subscription_type,
          current_price,
          start_date,
          status
        `)
        .in('subscriber_id', subscriberIds);

      if (subscriptionsError) throw subscriptionsError;

      // Combine the data
      const combinedData = subscribersData.map(subscriber => ({
        ...subscriber,
        subscriptions: subscriptionsData?.filter(sub => sub.subscriber_id === subscriber.id) || []
      }));

      // Filter subscribers who have at least one subscription
      const subscribersWithSubs = combinedData.filter(subscriber => 
        subscriber.subscriptions && subscriber.subscriptions.length > 0
      );

      // Process acquisition data
      const acquisitionStats = this.processAcquisitionData(subscribersWithSubs);
      return acquisitionStats;
    } catch (error) {
      console.error('Error fetching new acquisition data:', error);
      // Return empty structure instead of throwing
      return {
        monthly: {},
        channels: {},
        totals: {
          subscriptions: 0,
          revenue: 0
        }
      };
    }
  }

  // Helper method to process geographic data
  private processGeographicData(data: any[]): GeographicStats {
    const locationStats: GeographicStats = {};
    
    data.forEach(subscriber => {
      const address = subscriber.mailing_address;
      if (!address) return;
      
      const country = address.country || 'Unknown';
      const state = address.state || 'Unknown';
      const city = address.city || 'Unknown';
      
      // Initialize country if not exists
      if (!locationStats[country]) {
        locationStats[country] = {
          total: 0,
          print: 0,
          digital: 0,
          revenue: 0,
          states: {}
        };
      }
      
      // Initialize state if not exists
      if (!locationStats[country].states[state]) {
        locationStats[country].states[state] = {
          total: 0,
          print: 0,
          digital: 0,
          revenue: 0,
          cities: {}
        };
      }
      
      // Initialize city if not exists
      if (!locationStats[country].states[state].cities[city]) {
        locationStats[country].states[state].cities[city] = {
          total: 0,
          print: 0,
          digital: 0,
          revenue: 0
        };
      }
      
      // Count subscriptions for this subscriber
      subscriber.subscriptions.forEach((subscription: any) => {
        const isDigital = subscription.subscription_type === 'digital';
        const revenue = parseFloat(subscription.current_price) || 0;
        
        // Update totals
        locationStats[country].total++;
        locationStats[country].states[state].total++;
        locationStats[country].states[state].cities[city].total++;
        
        if (isDigital) {
          locationStats[country].digital++;
          locationStats[country].states[state].digital++;
          locationStats[country].states[state].cities[city].digital++;
        } else {
          locationStats[country].print++;
          locationStats[country].states[state].print++;
          locationStats[country].states[state].cities[city].print++;
        }
        
        // Add revenue
        locationStats[country].revenue += revenue;
        locationStats[country].states[state].revenue += revenue;
        locationStats[country].states[state].cities[city].revenue += revenue;
      });
    });
    
    return locationStats;
  }

  // Helper method to process acquisition data
  private processAcquisitionData(data: any[]): AcquisitionStats {
    const monthlyStats: Record<string, any> = {};
    const channelStats: Record<string, any> = {};
    let totalRevenue = 0;
    let totalSubscriptions = 0;
    
    data.forEach(subscriber => {
      const createdDate = new Date(subscriber.created_at);
      const monthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
      const channel = subscriber.data_source || 'direct_signup';
      
      // Initialize month if not exists
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          subscriptions: 0,
          revenue: 0,
          channels: {}
        };
      }
      
      // Initialize channel if not exists
      if (!channelStats[channel]) {
        channelStats[channel] = {
          subscriptions: 0,
          revenue: 0,
          conversionRate: 0
        };
      }
      
      // Count subscriptions and revenue for this subscriber
      subscriber.subscriptions.forEach((subscription: any) => {
        const revenue = parseFloat(subscription.current_price) || 0;
        
        monthlyStats[monthKey].subscriptions++;
        monthlyStats[monthKey].revenue += revenue;
        
        channelStats[channel].subscriptions++;
        channelStats[channel].revenue += revenue;
        
        totalRevenue += revenue;
        totalSubscriptions++;
      });
    });
    
    return {
      monthly: monthlyStats,
      channels: channelStats,
      totals: {
        subscriptions: totalSubscriptions,
        revenue: totalRevenue
      }
    };
  }
}