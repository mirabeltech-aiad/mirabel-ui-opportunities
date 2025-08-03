
import { activeSubscriberService } from './reports/activeSubscriberService';
import { growthAnalyticsService } from './reports/growthAnalyticsService';
import { lifecycleService } from './reports/lifecycleService';
import { acquisitionService } from './reports/acquisitionService';
import { churnCancellationService } from './reports/churnCancellationService';
import { issueFulfillmentService } from './reports/issueFulfillmentService';
import { digitalEngagementService } from './reports/digitalEngagementService';
import { sourcePromoService } from './reports/sourcePromoService';

export const subscriptionService = {
  // Active Subscriber methods
  async getMetrics(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    return activeSubscriberService.getMetrics(productIds, businessUnitIds, dateRange);
  },

  async getSubscriptions(filters?: { productIds?: string[], businessUnitIds?: string[], status?: string, dateRange?: { startDate?: Date; endDate?: Date } }) {
    return activeSubscriberService.getSubscriptions(filters);
  },

  // Growth Analytics methods
  async getGrowthData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    return growthAnalyticsService.getGrowthData(productIds, businessUnitIds, dateRange);
  },

  async getChurnData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    return growthAnalyticsService.getChurnData(productIds, businessUnitIds, dateRange);
  },

  async getGeographicData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    return growthAnalyticsService.getGeographicData(productIds, businessUnitIds, dateRange);
  },

  // Lifecycle methods
  async getLifecycleData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    return lifecycleService.getLifecycleData(productIds, businessUnitIds, dateRange);
  },

  // Acquisition methods
  async getAcquisitionData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    return acquisitionService.getAcquisitionData(productIds, businessUnitIds, dateRange);
  },

  // Churn & Cancellation methods
  async getChurnCancellationData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    return churnCancellationService.getChurnCancellationData(productIds, businessUnitIds, dateRange);
  },

  // Issue Fulfillment methods
  async getIssueFulfillmentData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    return issueFulfillmentService.getIssueFulfillmentData(productIds, businessUnitIds, dateRange);
  },

  // Digital Engagement methods
  async getDigitalEngagementData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    return digitalEngagementService.getDigitalEngagementData(productIds, businessUnitIds, dateRange);
  },

  // Source/Promo Performance methods
  async getSourcePromoData(productIds?: string[], businessUnitIds?: string[], dateRange?: { startDate?: Date; endDate?: Date }) {
    return sourcePromoService.getSourcePromoData(productIds, businessUnitIds, dateRange);
  }
};
