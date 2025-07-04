import httpClient, { userId } from '@/services/httpClient';

class SalesPerformanceService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  async getSalesPerformanceData(dateRange = 'last-12-months', selectedRep = 'all', selectedStatus = 'all', selectedProduct = 'all', selectedBusinessUnit = 'all') {
    try {
      // Extract values for API call using new parameter requirements
      const extractedRepValue = this.extractRepValue(selectedRep);
      const extractedStatusValue = this.extractStatusValue(selectedStatus);
      const extractedDateRange = this.extractDateRangeValue(dateRange);
      const extractedProductValue = this.extractProductValue(selectedProduct);
      const extractedBusinessUnitValue = this.extractBusinessUnitValue(selectedBusinessUnit);

      const params = {
        spName: "uspCDCSync_GetSalesPerformanceData",
        isMMDatabase: false,
        spParam: {
          DateRange: extractedDateRange,
          SelectedRep: extractedRepValue,
          SelectedStatus: extractedStatusValue,
          SelectedProduct: extractedProductValue,
          SelectedBusinessUnit: extractedBusinessUnitValue,
          UserId: userId
        }
      };

      const cacheKey = JSON.stringify(params);
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log('Returning cached sales performance data');
          return cached.data;
        }
      }

      console.log('Fetching sales performance data from API:', params);
      const response = await httpClient.post('services/admin/common/production/executesp/', params);
      
      // Cache the response
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });

      console.log('Sales performance API response:', response);
      return response;
    } catch (error) {
      console.error('Sales Performance Service Error:', error);
      throw error;
    }
  }

  // Extract rep value for API call - should send firstName + " " + lastName
  extractRepValue(selectedRep) {
    if (!selectedRep || selectedRep === 'all') {
      return 'all';
    }
    
    // If it's an object with fullName, use that
    if (typeof selectedRep === 'object' && selectedRep.fullName) {
      return selectedRep.fullName;
    }
    
    // If it's an object with name, use the name (fallback)
    if (typeof selectedRep === 'object' && selectedRep.name) {
      return selectedRep.name;
    }
    
    // If it's a string, use it directly
    if (typeof selectedRep === 'string') {
      return selectedRep;
    }
    
    return 'all';
  }

  // Extract status value for API call
  extractStatusValue(selectedStatus) {
    if (!selectedStatus || selectedStatus === 'all') {
      return 'all';
    }
    
    // Status should be "all", "Won", "Open", or "Lost"
    return selectedStatus;
  }

  // Extract date range value for API call with exact parameter mapping
  extractDateRangeValue(dateRange) {
    if (!dateRange) {
      return 'last-12-months'; // Default as specified
    }
    
    // Map the exact values as specified in requirements
    const validDateRanges = [
      'all-time',
      'this-quarter',
      'last-quarter', 
      'last-3-months',
      'last-6-months',
      'last-12-months',
      'ytd',
      'this-year',
      'last-year'
    ];
    
    if (validDateRanges.includes(dateRange)) {
      return dateRange;
    }
    
    return 'last-12-months'; // Default fallback
  }

  // Extract product value for API call - should send Product ID as string
  extractProductValue(selectedProduct) {
    if (!selectedProduct || selectedProduct === 'all') {
      return 'all';
    }
    
    // If it's an object with id, use the id as string
    if (typeof selectedProduct === 'object' && selectedProduct.id) {
      return String(selectedProduct.id);
    }
    
    // If it's already a string (product ID), use it directly
    if (typeof selectedProduct === 'string') {
      return selectedProduct;
    }
    
    return 'all';
  }

  // Extract business unit value for API call - should send Business Unit ID as string
  extractBusinessUnitValue(selectedBusinessUnit) {
    if (!selectedBusinessUnit || selectedBusinessUnit === 'all') {
      return 'all';
    }
    
    // If it's an object with id, use the id as string
    if (typeof selectedBusinessUnit === 'object' && selectedBusinessUnit.id) {
      return String(selectedBusinessUnit.id);
    }
    
    // If it's already a string (business unit ID), use it directly
    if (typeof selectedBusinessUnit === 'string') {
      return selectedBusinessUnit;
    }
    
    return 'all';
  }

  // Transform API data to KPI format
  transformToKPIs(apiData) {
    const tableData = apiData?.content?.Data?.Table?.[0];
    
    if (!tableData) {
      console.warn('No Table data found in API response');
      return {
        total: 0,
        won: 0,
        lost: 0,
        open: 0,
        totalRevenue: 0,
        avgDealSize: 0,
        conversionRate: 0,
        avgSalesCycle: 0
      };
    }

    return {
      total: tableData.total || 0,
      won: tableData.won || 0,
      lost: tableData.lost || 0,
      open: tableData.open || 0,
      totalRevenue: tableData.totalRevenue || 0,
      avgDealSize: tableData.avgDealSize || 0,
      conversionRate: tableData.conversionRate || 0,
      avgSalesCycle: tableData.avgSalesCycle || 0
    };
  }

  // Transform API data to revenue chart format
  transformToRevenueData(apiData) {
    const revenueData = apiData?.content?.Data?.Table1 || [];
    
    return revenueData.map(item => ({
      month: item.month,
      revenue: item.revenue || 0,
      deals: item.deals || 0
    }));
  }

  // Transform API data to pipeline chart format
  transformToPipelineData(apiData) {
    const pipelineData = apiData?.content?.Data?.Table2 || [];
    
    return pipelineData.map(item => ({
      stage: item.stage,
      count: item.count || 0,
      value: item.value || 0
    }));
  }

  // Transform API data to rep performance format
  transformToRepPerformanceData(apiData) {
    const repData = apiData?.content?.Data?.Table3 || [];
    
    return repData.map(rep => ({
      name: rep.name,
      total: rep.total || 0,
      won: rep.won || 0,
      revenue: rep.revenue || 0,
      avgDealSize: rep.avgDealSize || 0,
      winRate: rep.winRate?.toFixed(1) || '0.0'
    }));
  }

  // Get sales reps list from API data
  getSalesRepsFromData(apiData) {
    const repsData = apiData?.content?.Data?.Table4 || [];
    
    return repsData.map(rep => rep.AssignedTo).filter(rep => rep && rep !== '*Unassigned*');
  }

  // Get detailed opportunities data
  getOpportunitiesData(apiData) {
    return apiData?.content?.Data?.Table5 || [];
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new SalesPerformanceService();
