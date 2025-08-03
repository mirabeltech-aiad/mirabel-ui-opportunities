import { BaseReportService } from './baseReportService';
import { ReportFilters } from './types';

export class PromoReportService extends BaseReportService {
  // Source/Promo performance data
  async getSourcePromoData(filters?: ReportFilters) {
    try {
      // Get subscription data to analyze promo effectiveness
      let query = this.getSupabaseClient()
        .from('subscriptions')
        .select(`
          id, current_price, start_date, status, external_id, subscriber_id,
          subscribers!subscriptions_subscriber_id_fkey(data_source, created_at)
        `)
        .eq('status', 'active');

    if (filters?.dateRange?.startDate) {
      query = query.gte('start_date', filters.dateRange.startDate.toISOString().split('T')[0]);
    }

    if (filters?.dateRange?.endDate) {
      query = query.lte('start_date', filters.dateRange.endDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query;
    if (error) throw error;

    const subscriptions = data || [];
    
    // Calculate summary metrics
    const activeCodes = 45; // Mock active promo codes
    const newCodesThisMonth = 8;
    const totalConversions = subscriptions.length;
    const avgConversionRate = 6.2;
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + parseFloat(String(sub.current_price || '0')), 0);
    const avgOrderValue = totalRevenue > 0 ? Math.floor(totalRevenue / totalConversions) : 0;
    const avgRetentionRate = 78;

    // Top performing codes (mock data based on real subscription volume)
    const topPerformers = [
      { code: 'SPRING50', revenue: Math.floor(totalRevenue * 0.25) },
      { code: 'SAVE30', revenue: Math.floor(totalRevenue * 0.20) },
      { code: 'WELCOME25', revenue: Math.floor(totalRevenue * 0.18) },
      { code: 'LOYALTY', revenue: Math.floor(totalRevenue * 0.15) }
    ];

    // Type distribution
    const typeDistribution = [
      { name: 'Discount', revenue: Math.floor(totalRevenue * 0.4) },
      { name: 'Free Trial', revenue: Math.floor(totalRevenue * 0.3) },
      { name: 'Bundle', revenue: Math.floor(totalRevenue * 0.2) },
      { name: 'Loyalty', revenue: Math.floor(totalRevenue * 0.1) }
    ];

    // Monthly trend
    const monthlyTrend = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    for (const month of months) {
      monthlyTrend.push({
        month,
        conversionRate: 5.8 + Math.random() * 1.5,
        revenue: Math.floor(totalRevenue / 6 + Math.random() * 20000)
      });
    }

    // Detailed performance (mock data)
    const detailedPerformance = [
      { 
        id: '1', 
        code: 'SPRING50', 
        type: 'discount', 
        impressions: 15000, 
        conversions: Math.floor(totalConversions * 0.25), 
        conversionRate: 6.5, 
        revenue: topPerformers[0].revenue, 
        averageOrderValue: 250, 
        retentionRate: 82, 
        status: 'active' 
      },
      { 
        id: '2', 
        code: 'SAVE30', 
        type: 'discount', 
        impressions: 12000, 
        conversions: Math.floor(totalConversions * 0.20), 
        conversionRate: 6.0, 
        revenue: topPerformers[1].revenue, 
        averageOrderValue: 263, 
        retentionRate: 78, 
        status: 'active' 
      },
      { 
        id: '3', 
        code: 'WELCOME25', 
        type: 'trial', 
        impressions: 8500, 
        conversions: Math.floor(totalConversions * 0.18), 
        conversionRate: 6.0, 
        revenue: topPerformers[2].revenue, 
        averageOrderValue: 306, 
        retentionRate: 85, 
        status: 'active' 
      }
    ];

    // Channel performance
    const channelPerformance = [
      { channel: 'Email', activeCodes: 12, conversionRate: 7.2, revenue: Math.floor(totalRevenue * 0.3), averageOrderValue: 189, retentionRate: 84 },
      { channel: 'Social Media', activeCodes: 8, conversionRate: 5.8, revenue: Math.floor(totalRevenue * 0.15), averageOrderValue: 156, retentionRate: 72 },
      { channel: 'Direct Mail', activeCodes: 15, conversionRate: 4.9, revenue: Math.floor(totalRevenue * 0.25), averageOrderValue: 198, retentionRate: 76 },
      { channel: 'Website', activeCodes: 10, conversionRate: 8.1, revenue: Math.floor(totalRevenue * 0.3), averageOrderValue: 213, retentionRate: 89 }
    ];

    return {
      summary: {
        activeCodes,
        newCodesThisMonth,
        totalConversions,
        avgConversionRate,
        totalRevenue,
        avgOrderValue,
        avgRetentionRate
      },
      topPerformers,
      typeDistribution,
      monthlyTrend,
      detailedPerformance,
      channelPerformance
    };
    } catch (error) {
      console.error('Error fetching source/promo data:', error);
      // Return empty structure instead of throwing
      return {
        summary: {
          activeCodes: 0,
          newCodesThisMonth: 0,
          totalConversions: 0,
          avgConversionRate: 0,
          totalRevenue: 0,
          avgOrderValue: 0,
          avgRetentionRate: 0
        },
        topPerformers: [],
        typeDistribution: [],
        monthlyTrend: [],
        detailedPerformance: [],
        channelPerformance: []
      };
    }
  }
}