import axiosService from '@/services/axiosService.js';
import { getDefaultApiParams, buildExecutiveDashboardParams } from './apiHelpers';
import { API_URLS } from '@/utils/apiUrls';
const axiosInstance = axiosService;

class ReportsService {
  constructor() {
   
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  // Get comprehensive reports data using your existing API
  async getReportsData(params = {}) {
    try {
      const defaultParams = getDefaultApiParams();
      const finalParams = { ...defaultParams, ...params };

      const cacheKey = JSON.stringify(finalParams);
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          return cached.data;
        }
      }

      const response = await axiosInstance.post(API_URLS.OPPORTUNITIES.REPORT_ALL, finalParams);
      
      // Cache the response
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });

      return response;
    } catch (error) {
      console.error('Reports Service Error:', error);
      throw error; // Re-throw the error instead of returning mock data
    }
  }

  // Get opportunities data with filtering
  async getOpportunitiesData(params = {}) {
    return this.getReportsData({ ...params, ResultType: 1 });
  }

  // Get proposals data with filtering
  async getProposalsData(params = {}) {
    return this.getReportsData({ ...params, ResultType: 2 });
  }

  // Get opportunity statistics for a specific opportunity
  async getOpportunityStats(opportunityId) {
    try {
      if (!opportunityId) {
        throw new Error('Opportunity ID is required');
      }

      const payload = {
        spName: "uspCDCSync_OpportunityStatsGet",
        isMMDatabase: false,
        spParam: {
          OpportunityId: opportunityId
        }
      };

      const cacheKey = `opportunity-stats-${opportunityId}`;
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          return cached.data;
        }
      }

      const response = await axiosInstance.post(API_URLS.REPORTS.OPPORTUNITY_STATS, payload);
      
      // Cache the response
      this.cache.set(cacheKey, {
        data: response?.content || {},
        timestamp: Date.now()
      });

      return response?.content || {};
    } catch (error) {
      console.error('Error fetching opportunity stats:', error);
      throw error;
    }
  }

  // Get executive dashboard data with comprehensive filtering
  async getExecutiveDashboardData(
    period = 'this-quarter', 
    selectedRep = 'all', 
    customDateRange = null,
    selectedProduct = 'all',
    selectedBusinessUnit = 'all'
  ) {
    const filterParams = buildExecutiveDashboardParams(
      period, 
      selectedRep, 
      customDateRange,
      selectedProduct,
      selectedBusinessUnit
    );
    
    console.log('API params:', { 
      ...filterParams, 
      period, 
      selectedRep, 
      customDateRange,
      selectedProduct,
      selectedBusinessUnit
    });
    
    try {
      // Get both opportunities and proposals data with all filters
      const [opportunitiesResponse, proposalsResponse] = await Promise.all([
        this.getOpportunitiesData(filterParams),
        this.getProposalsData({ 
          ...filterParams, 
          ProposalRep: selectedRep !== 'all' ? selectedRep : '' 
        })
      ]);

      return {
        opportunities: opportunitiesResponse,
        proposals: proposalsResponse,
        period,
        selectedRep,
        customDateRange,
        selectedProduct,
        selectedBusinessUnit
      };
    } catch (error) {
      console.error('Error fetching executive dashboard data:', error);
      throw error; // Re-throw the error instead of returning mock data
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new ReportsService();
