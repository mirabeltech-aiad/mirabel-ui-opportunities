// Main aggregator service that combines all report services
import { CustomerReportService } from './customerReportService';
import { SubscriptionManagementService } from './subscriptionManagementService';
import { ChurnAnalysisService } from './churnAnalysisService';
import { RenewalService } from './renewalService';
import { ExpansionService } from './expansionService';
import { TrialReportService } from './trialReportService';
import { GeographicReportService } from './geographicReportService';
import { EngagementReportService } from './engagementReportService';
import { PromoReportService } from './promoReportService';

export class SupabaseReportsService {
  private customerService = new CustomerReportService();
  private subscriptionService = new SubscriptionManagementService();
  private churnService = new ChurnAnalysisService();
  private renewalService = new RenewalService();
  private expansionService = new ExpansionService();
  private trialService = new TrialReportService();
  private geographicService = new GeographicReportService();
  private engagementService = new EngagementReportService();
  private promoService = new PromoReportService();

  // Customer-related methods
  getCustomers = this.customerService.getCustomers.bind(this.customerService);
  getSubscriberDemographicsData = this.customerService.getSubscriberDemographicsData.bind(this.customerService);
  getTopCustomerRevenueData = this.customerService.getTopCustomerRevenueData.bind(this.customerService);
  getLifetimeValueData = this.customerService.getLifetimeValueData.bind(this.customerService);
  getComplimentarySubscriptionsData = this.customerService.getComplimentarySubscriptionsData.bind(this.customerService);

  // Subscription management methods
  getSubscriptions = this.subscriptionService.getSubscriptions.bind(this.subscriptionService);
  getSubscriptionAgingData = this.subscriptionService.getSubscriptionAgingData.bind(this.subscriptionService);
  getExpirationForecastData = this.subscriptionService.getExpirationForecastData.bind(this.subscriptionService);
  getGiftSubscriptionsData = this.subscriptionService.getGiftSubscriptionsData.bind(this.subscriptionService);
  getMRRData = this.subscriptionService.getMRRData.bind(this.subscriptionService);
  getSubscriberGrowthData = this.subscriptionService.getSubscriberGrowthData.bind(this.subscriptionService);

  // Churn analysis methods
  getChurnData = this.churnService.getChurnData.bind(this.churnService);
  getNetMRRChurnRateData = this.churnService.getNetMRRChurnRateData.bind(this.churnService);
  getRevenueChurnRateData = this.churnService.getRevenueChurnRateData.bind(this.churnService);
  getGrossNetChurnBreakdownData = this.churnService.getGrossNetChurnBreakdownData.bind(this.churnService);

  // Renewal methods
  getRenewalData = this.renewalService.getRenewalData.bind(this.renewalService);
  getDeferredRevenueData = this.renewalService.getDeferredRevenueData.bind(this.renewalService);
  getSubscriptionRenewalData = this.renewalService.getSubscriptionRenewalData.bind(this.renewalService);
  getLogoRetentionData = this.renewalService.getLogoRetentionData.bind(this.renewalService);

  // Expansion methods
  getContractExpansionRateData = this.expansionService.getContractExpansionRateData.bind(this.expansionService);
  getExpansionPaybackPeriodData = this.expansionService.getExpansionPaybackPeriodData.bind(this.expansionService);
  getCrossSellAttachRateData = this.expansionService.getCrossSellAttachRateData.bind(this.expansionService);
  getTimeToUpgradeData = this.expansionService.getTimeToUpgradeData.bind(this.expansionService);

  // Trial methods
  getTrialData = this.trialService.getTrialData.bind(this.trialService);
  getTrialToPaidData = this.trialService.getTrialToPaidData.bind(this.trialService);

  // Geographic-related methods
  getGeographicData = this.geographicService.getGeographicData.bind(this.geographicService);
  getNewAcquisitionData = this.geographicService.getNewAcquisitionData.bind(this.geographicService);

  // Engagement-related methods
  getDigitalEngagementData = this.engagementService.getDigitalEngagementData.bind(this.engagementService);
  getIssueFulfillmentData = this.engagementService.getIssueFulfillmentData.bind(this.engagementService);

  // Promo-related methods
  getSourcePromoData = this.promoService.getSourcePromoData.bind(this.promoService);

  // Additional customer methods
  getCustomerSegmentationData = this.customerService.getCustomerSegmentationData.bind(this.customerService);

  // Additional churn methods
  getCustomerChurnData = this.churnService.getCustomerChurnData.bind(this.churnService);
  getChurnByCohortData = this.churnService.getChurnByCohortData.bind(this.churnService);
}

export const supabaseReportsService = new SupabaseReportsService();

// Export individual services for more granular usage if needed
export {
  CustomerReportService,
  SubscriptionManagementService,
  ChurnAnalysisService,
  RenewalService,
  ExpansionService,
  TrialReportService,
  GeographicReportService,
  EngagementReportService,
  PromoReportService
};

export * from './types';