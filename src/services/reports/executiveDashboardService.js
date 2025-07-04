import httpClient, { userId } from '../httpClient';

class ExecutiveDashboardService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache to match other services
  }

  /**
   * Call uspCDCSync_ExecutiveDashboardGet stored procedure
   * Returns 6 result sets for complete dashboard data
   */
  async getExecutiveDashboardData(
    period = 'this-quarter', 
    selectedRep = 'all', 
    customDateRange = null,
    selectedProduct = 'all',
    selectedBusinessUnit = 'all'
  ) {
    try {
      // Extract values for API call using standardized parameter requirements
      const extractedRepValue = this.extractRepValue(selectedRep);
      const extractedDateRange = this.extractDateRangeValue(period, customDateRange);
      const extractedProductValue = this.extractProductValue(selectedProduct);
      const extractedBusinessUnitValue = this.extractBusinessUnitValue(selectedBusinessUnit);

      const params = {
        spName: "uspCDCSync_ExecutiveDashboardGet",
        isMMDatabase: false,
        spParam: {
          DateRange: extractedDateRange,
          SelectedRep: extractedRepValue,
          SelectedStatus: 'all', // Could be made configurable
          SelectedProduct: extractedProductValue,
          SelectedBusinessUnit: extractedBusinessUnitValue,
          UserID: userId
        }
      };

      const cacheKey = JSON.stringify(params);
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log('Returning cached executive dashboard data');
          return cached.data;
        }
      }

      console.log('Fetching executive dashboard data from API:', params);
      const response = await httpClient.post('services/admin/common/production/executesp/', params);
      
      console.log('Executive Dashboard SP Response:', response);

      // Validate response structure
      this.validateStoredProcedureResponse(response);

      // Extract and structure the 6 result sets
      const structuredData = this.structureResultSets(response);

      // Cache the response
      this.cache.set(cacheKey, {
        data: structuredData,
        timestamp: Date.now()
      });

      console.log('Executive Dashboard API response:', response);
      return structuredData;

    } catch (error) {
      console.error('Executive Dashboard Service Error:', error);
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

  // Extract date range value for API call with custom date range support
  extractDateRangeValue(period, customDateRange) {
    if (period === 'custom' && customDateRange) {
      return `${customDateRange.from.toISOString().split('T')[0]}_${customDateRange.to.toISOString().split('T')[0]}`;
    }
    
    if (!period) {
      return 'this-quarter'; // Default
    }
    
    // Map the exact values as specified in requirements
    const validDateRanges = [
      'today', 'yesterday', 'this-week', 'last-week', 'last-7-days', 'last-14-days',
      'this-month', 'last-month', 'last-30-days', 'last-60-days', 'last-90-days',
      'this-quarter', 'last-quarter', 'last-120-days', 'last-6-months',
      'this-year', 'ytd', 'last-year', 'last-12-months', 'last-18-months',
      'last-24-months', 'all'
    ];
    
    if (validDateRanges.includes(period)) {
      return period;
    }
    
    return 'this-quarter'; // Default fallback
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

  /**
   * Validate that all 6 expected result sets are present
   */
  validateStoredProcedureResponse(response) {
    if (!response || !response.content) {
      throw new Error('Invalid stored procedure response - missing content');
    }

    const { content } = response;
    
    // Check for the 6 expected result sets from standard SP response structure
    const expectedResultSets = ['Table', 'Table1', 'Table2', 'Table3', 'Table4', 'Table5'];
    const missingResultSets = expectedResultSets.filter(resultSet => !content.Data?.[resultSet]);
    
    if (missingResultSets.length > 0) {
      console.warn('Missing result sets from stored procedure:', missingResultSets);
      // Don't throw error, allow partial data
    }

    console.log('Stored procedure validation passed, available result sets:', Object.keys(content.Data || {}));
  }

  /**
   * Structure the 6 result sets into organized data matching standard SP response format
   */
  structureResultSets(response) {
    const data = response?.content?.Data || {};

    return {
      // Result Set 1: KPI Metrics (Table)
      kpiMetrics: data.Table?.[0] || {},
      
      // Result Set 2: Pipeline Health by Stage (Table1)
      pipelineHealth: data.Table1 || [],
      
      // Result Set 3: Revenue Trends (Table2)
      revenueTrends: data.Table2 || [],
      
      // Result Set 4: Team Performance (Table3)
      teamPerformance: data.Table3 || [],
      
      // Result Set 5: Product Performance (Table4)
      productPerformance: data.Table4 || [],
      
      // Result Set 6: Business Unit Performance (Table5)
      businessUnitPerformance: data.Table5 || [],
      
      // Metadata for tracking
      metadata: {
        source: 'uspCDCSync_ExecutiveDashboardGet',
        resultSetsCount: Object.keys(data).length,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
    console.log('Executive Dashboard cache cleared');
  }
}

export default new ExecutiveDashboardService(); 