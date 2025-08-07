import { BaseReportService } from './baseReportService';
import { ReportFilters } from './types';

export class TrialReportService extends BaseReportService {
  // Trial conversion data - using subscriptions with trial status
  async getTrialData(filters?: ReportFilters) {
    // Create mock trial data with customer acquisition channels
    const mockTrials = [
      {
        id: 'trial-1',
        trial_start_date: '2024-01-15',
        trial_end_date: '2024-01-29',
        trial_status: 'converted',
        conversion_date: '2024-01-28',
        engagement_score: 85,
        paid_subscription_value: 299,
        customers: { email: 'john@example.com', acquisition_channel: 'Google Ads' }
      },
      {
        id: 'trial-2',
        trial_start_date: '2024-01-20',
        trial_end_date: '2024-02-03',
        trial_status: 'expired',
        conversion_date: null,
        engagement_score: 45,
        paid_subscription_value: 0,
        customers: { email: 'jane@example.com', acquisition_channel: 'Social Media' }
      },
      {
        id: 'trial-3',
        trial_start_date: '2024-02-01',
        trial_end_date: '2024-02-15',
        trial_status: 'converted',
        conversion_date: '2024-02-14',
        engagement_score: 92,
        paid_subscription_value: 599,
        customers: { email: 'bob@example.com', acquisition_channel: 'Referral' }
      },
      {
        id: 'trial-4',
        trial_start_date: '2024-02-05',
        trial_end_date: '2024-02-19',
        trial_status: 'converted',
        conversion_date: '2024-02-18',
        engagement_score: 78,
        paid_subscription_value: 199,
        customers: { email: 'alice@example.com', acquisition_channel: 'Email Campaign' }
      },
      {
        id: 'trial-5',
        trial_start_date: '2024-02-10',
        trial_end_date: '2024-02-24',
        trial_status: 'expired',
        conversion_date: null,
        engagement_score: 30,
        paid_subscription_value: 0,
        customers: { email: 'charlie@example.com', acquisition_channel: 'Google Ads' }
      }
    ];

    // Filter by date range if provided
    let filteredTrials = mockTrials;
    if (filters?.dateRange?.startDate) {
      const startDate = filters.dateRange.startDate.toISOString().split('T')[0];
      filteredTrials = filteredTrials.filter(trial => trial.trial_start_date >= startDate);
    }
    if (filters?.dateRange?.endDate) {
      const endDate = filters.dateRange.endDate.toISOString().split('T')[0];
      filteredTrials = filteredTrials.filter(trial => trial.trial_start_date <= endDate);
    }

    return filteredTrials;
  }

  // Trial to paid conversion data
  async getTrialToPaidData(filters?: ReportFilters) {
    let query = this.getSupabaseClient()
      .from('subscriptions')
      .select(`
        id, status, trial_end_date, start_date, current_price, subscription_type, subscriber_id
      `)
      .not('trial_end_date', 'is', null);

    if (filters?.dateRange?.startDate) {
      query = query.gte('trial_end_date', filters.dateRange.startDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query;
    if (error) throw error;

    const trialData = data || [];
    const conversions = trialData.filter(t => t.status === 'active').length;
    const totalTrials = trialData.length;
    const conversionRate = totalTrials > 0 ? (conversions / totalTrials * 100) : 0;
    
    return {
      totalTrials,
      conversions,
      conversionRate: conversionRate.toFixed(1),
      averageTime: 12, // Mock average conversion time
      retentionRate90Days: 85.2, // Mock retention rate
      trialData: trialData.map(trial => ({
        id: trial.id.slice(0, 8),
        email: 'user@example.com', // Mock email since we need subscriber join
        trialStart: trial.start_date,
        trialEnd: trial.trial_end_date,
        converted: trial.status === 'active',
        source: 'direct', // Mock source
        revenue: trial.status === 'active' ? parseFloat(String(trial.current_price || '0')) : 0
      }))
    };
  }
}