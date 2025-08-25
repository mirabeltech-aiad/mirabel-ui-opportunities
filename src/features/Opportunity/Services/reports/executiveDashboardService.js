import axiosService from '@/services/axiosService';
import { getCurrentUserId } from '@/utils/userUtils';
const axiosInstance = axiosService;

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
    period = 'all',
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

      console.log('🔧 Executive Dashboard Service - Input Parameters:', {
        period,
        selectedRep,
        customDateRange,
        selectedProduct,
        selectedBusinessUnit
      });

      console.log('🔧 Executive Dashboard Service - Extracted Parameters:', {
        extractedDateRange,
        extractedRepValue,
        extractedProductValue,
        extractedBusinessUnitValue
      });

      const params = {
        spName: "uspCDCSync_ExecutiveDashboardGet",
        isMMDatabase: false,
        spParam: {
          DateRange: extractedDateRange,
          SelectedRep: extractedRepValue,
          SelectedStatus: 'all', // Hardcoded as requested
          SelectedProduct: extractedProductValue,
          SelectedBusinessUnit: extractedBusinessUnitValue,
          UserID: getCurrentUserId()
        }
      };

      console.log('🔧 Executive Dashboard Service - Final SP Parameters:', params.spParam);
      console.log('🔧 SP Call URL: services/admin/common/production/executesp/');
      console.log('🔧 SP Name:', params.spName);

      const cacheKey = JSON.stringify(params);

      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {

          return cached.data;
        }
      }


      const response = await axiosInstance.post('services/admin/common/production/executesp/', params);



      // Validate response structure
      this.validateStoredProcedureResponse(response);

      // Check if response has meaningful data before processing
      if (!response.content?.Data || Object.keys(response.content.Data).length === 0) {
        console.warn('⚠️ Empty or invalid response data from SP - skipping processing');
        throw new Error('Stored procedure returned empty data');
      }

      // Extract and structure the 6 result sets
      const structuredData = this.structureResultSets(response);

      // Cache the response
      this.cache.set(cacheKey, {
        data: structuredData,
        timestamp: Date.now()
      });


      return structuredData;

    } catch (error) {
      console.error('Executive Dashboard Service Error:', error);
      throw error;
    }
  }

  // Extract rep value for API call - should send firstName + " " + lastName
  extractRepValue(selectedRep) {
    console.log('🔍 extractRepValue input:', selectedRep, typeof selectedRep);
    console.log('🔍 extractRepValue isArray?', Array.isArray(selectedRep));
    console.log('🔍 extractRepValue length:', selectedRep?.length);
    
    if (!selectedRep || selectedRep === 'all') {
      return 'all';
    }

    // Handle array from MultiSelectDropdown (support multiple selections)
    if (Array.isArray(selectedRep)) {
      if (selectedRep.length === 0) return 'all';
      
      // Convert each rep to ID format and join with commas
      const repValues = selectedRep.map(rep => {
        // Handle string format from MultiSelectDropdown (most common case)  
        if (typeof rep === 'string') {
          // Extract numeric ID from IE=123~ format
          if (rep.includes('IE=') && rep.includes('~')) {
            const match = rep.match(/IE=(\d+)~/);
            return match ? match[1] : null;
          }
          // If it's already a numeric ID, use it
          if (!isNaN(rep) && rep !== 'all') {
            return rep;
          }
          return null;
        }
        // Handle object format (fallback cases)
        else if (typeof rep === 'object' && rep.id) {
          // Extract numeric ID from IE=123~ format
          const idStr = String(rep.id);
          if (idStr.includes('IE=') && idStr.includes('~')) {
            const match = idStr.match(/IE=(\d+)~/);
            return match ? match[1] : null;
          }
          return idStr;
        } else if (typeof rep === 'object' && rep.value) {
          // Extract numeric ID from IE=123~ format
          const valueStr = String(rep.value);
          if (valueStr.includes('IE=') && valueStr.includes('~')) {
            const match = valueStr.match(/IE=(\d+)~/);
            return match ? match[1] : null;
          }
          return valueStr;
        } else if (typeof rep === 'object' && rep.gsEmployeesID) {
          return String(rep.gsEmployeesID);
        }
        return null; // Don't include invalid values
      }).filter(value => value !== null && value !== 'all'); // Filter out invalid and 'all' values
      
      // If no valid IDs found, return 'all'
      if (repValues.length === 0) {
        console.log('🔍 No valid IDs found, returning all');
        return 'all';
      }
      
      const result = repValues.join(',');
      console.log('🔍 Array detected, using comma-separated values:', result);
      return result;
    }

    // If it's a string (most common from MultiSelectDropdown)
    if (typeof selectedRep === 'string') {
      console.log('🔍 Using string:', selectedRep);
      // Extract numeric ID from IE=123~ format
      if (selectedRep.includes('IE=') && selectedRep.includes('~')) {
        const match = selectedRep.match(/IE=(\d+)~/);
        const extractedId = match ? match[1] : selectedRep;
        console.log('🔍 Extracted ID from IE format:', extractedId);
        return extractedId;
      }
      return selectedRep;
    }

    // If it's an object with id, use the id (preferred)
    if (typeof selectedRep === 'object' && selectedRep.id) {
      console.log('🔍 Using id:', selectedRep.id);
      const idStr = String(selectedRep.id);
      // Extract numeric ID from IE=123~ format
      if (idStr.includes('IE=') && idStr.includes('~')) {
        const match = idStr.match(/IE=(\d+)~/);
        const extractedId = match ? match[1] : idStr;
        console.log('🔍 Extracted ID from IE format:', extractedId);
        return extractedId;
      }
      return idStr;
    }

    // If it's an object with value, use the value
    if (typeof selectedRep === 'object' && selectedRep.value) {
      console.log('🔍 Using value:', selectedRep.value);
      const valueStr = String(selectedRep.value);
      // Extract numeric ID from IE=123~ format
      if (valueStr.includes('IE=') && valueStr.includes('~')) {
        const match = valueStr.match(/IE=(\d+)~/);
        const extractedId = match ? match[1] : valueStr;
        console.log('🔍 Extracted ID from IE format:', extractedId);
        return extractedId;
      }
      return valueStr;
    }

    // If it's an object with gsEmployeesID, use that
    if (typeof selectedRep === 'object' && selectedRep.gsEmployeesID) {
      console.log('🔍 Using gsEmployeesID:', selectedRep.gsEmployeesID);
      return String(selectedRep.gsEmployeesID);
    }

    // Fallback to name-based matching (for backward compatibility)
    if (typeof selectedRep === 'object' && selectedRep.fullName) {
      console.log('🔍 Using fullName:', selectedRep.fullName);
      return selectedRep.fullName;
    }

    // If it's an object with name, use the name (fallback)
    if (typeof selectedRep === 'object' && selectedRep.name) {
      console.log('🔍 Using name:', selectedRep.name);
      return selectedRep.name;
    }

    // If it's an object with label/value structure
    if (typeof selectedRep === 'object' && selectedRep.label) {
      console.log('🔍 Using label:', selectedRep.label);
      return selectedRep.label;
    }


    console.log('🔍 Fallback to all for:', selectedRep);
    return 'all';
  }

  // Extract date range value for API call with custom date range support
  extractDateRangeValue(period, customDateRange) {
    console.log('🔍 extractDateRangeValue input:', period, customDateRange);
    
    if (period === 'custom' && customDateRange) {
      const customRange = `${customDateRange.from.toISOString().split('T')[0]}_${customDateRange.to.toISOString().split('T')[0]}`;
      console.log('🔍 Using custom date range:', customRange);
      return customRange;
    }

    if (!period) {
      console.log('🔍 No period provided, using all');
      return 'all'; // Default
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
      console.log('🔍 Using valid date range:', period);
      return period;
    }

    console.log('🔍 Invalid date range, fallback to all:', period);
    return 'all'; // Default fallback
  }

  // Extract product value for API call - should send Product ID as string
  extractProductValue(selectedProduct) {
    console.log('🔍 extractProductValue input:', selectedProduct, typeof selectedProduct);
    
    if (!selectedProduct || selectedProduct === 'all') {
      return 'all';
    }

    // Handle array from MultiSelectDropdown (support multiple selections)
    if (Array.isArray(selectedProduct)) {
      if (selectedProduct.length === 0) return 'all';
      
      // Convert each product to the appropriate format and join with commas
      const productValues = selectedProduct.map(product => {
        if (typeof product === 'object' && product.id) {
          return String(product.id);
        } else if (typeof product === 'object' && product.value) {
          return String(product.value);
        } else if (typeof product === 'string' && product !== 'all') {
          return product;
        }
        return null; // Don't include invalid values
      }).filter(value => value !== null && value !== 'all'); // Filter out invalid and 'all' values
      
      // If no valid IDs found, return 'all'
      if (productValues.length === 0) {
        console.log('🔍 No valid product IDs found, returning all');
        return 'all';
      }
      
      const result = productValues.join(',');
      console.log('🔍 Array detected, using comma-separated values:', result);
      return result;
    }

    // If it's an object with id, use the id as string
    if (typeof selectedProduct === 'object' && selectedProduct.id) {
      console.log('🔍 Using product id:', selectedProduct.id);
      return String(selectedProduct.id);
    }

    // If it's an object with value, use the value as string  
    if (typeof selectedProduct === 'object' && selectedProduct.value) {
      console.log('🔍 Using product value:', selectedProduct.value);
      return String(selectedProduct.value);
    }

    // If it's already a string (product ID), use it directly
    if (typeof selectedProduct === 'string') {
      console.log('🔍 Using product string:', selectedProduct);
      return selectedProduct;
    }

    console.log('🔍 Product fallback to all for:', selectedProduct);
    return 'all';
  }

  // Extract business unit value for API call - should send Business Unit ID as string
  extractBusinessUnitValue(selectedBusinessUnit) {
    console.log('🔍 extractBusinessUnitValue input:', selectedBusinessUnit, typeof selectedBusinessUnit);
    
    if (!selectedBusinessUnit || selectedBusinessUnit === 'all') {
      return 'all';
    }

    // Handle array from MultiSelectDropdown (support multiple selections)
    if (Array.isArray(selectedBusinessUnit)) {
      if (selectedBusinessUnit.length === 0) return 'all';
      
      // Convert each business unit to the appropriate format and join with commas
      const businessUnitValues = selectedBusinessUnit.map(unit => {
        if (typeof unit === 'object' && unit.id) {
          return String(unit.id);
        } else if (typeof unit === 'object' && unit.value) {
          return String(unit.value);
        } else if (typeof unit === 'string' && unit !== 'all') {
          return unit;
        }
        return null; // Don't include invalid values
      }).filter(value => value !== null && value !== 'all'); // Filter out invalid and 'all' values
      
      // If no valid IDs found, return 'all'
      if (businessUnitValues.length === 0) {
        console.log('🔍 No valid business unit IDs found, returning all');
        return 'all';
      }
      
      const result = businessUnitValues.join(',');
      console.log('🔍 Array detected, using comma-separated values:', result);
      return result;
    }

    // If it's an object with id, use the id as string
    if (typeof selectedBusinessUnit === 'object' && selectedBusinessUnit.id) {
      console.log('🔍 Using business unit id:', selectedBusinessUnit.id);
      return String(selectedBusinessUnit.id);
    }

    // If it's an object with value, use the value as string  
    if (typeof selectedBusinessUnit === 'object' && selectedBusinessUnit.value) {
      console.log('🔍 Using business unit value:', selectedBusinessUnit.value);
      return String(selectedBusinessUnit.value);
    }

    // If it's already a string (business unit ID), use it directly
    if (typeof selectedBusinessUnit === 'string') {
      console.log('🔍 Using business unit string:', selectedBusinessUnit);
      return selectedBusinessUnit;
    }

    console.log('🔍 Business unit fallback to all for:', selectedBusinessUnit);
    return 'all';
  }

  /**
   * Validate that all 7 expected result sets are present (added Table6 for previous period KPI data)
   */
  validateStoredProcedureResponse(response) {
    if (!response || !response.content) {
      throw new Error('Invalid stored procedure response - missing content');
    }

    const { content } = response;

    // Check for the 7 expected result sets from standard SP response structure
    const expectedResultSets = ['Table', 'Table1', 'Table2', 'Table3', 'Table4', 'Table5', 'Table6'];
    const missingResultSets = expectedResultSets.filter(resultSet => !content.Data?.[resultSet]);

    if (missingResultSets.length > 0) {
      console.warn('Missing result sets from stored procedure:', missingResultSets);
      // Don't throw error, allow partial data
    }


  }

  /**
   * Structure the 7 result sets into organized data matching standard SP response format
   */
  structureResultSets(response) {
    const data = response?.content?.Data || {};

    // Debug: Log the actual table structure to understand the mapping
    console.log('🔍 Raw API response table structure:', {
      tableKeys: Object.keys(data),
      Table: data.Table?.length ? `Array(${data.Table.length})` : data.Table,
      Table1: data.Table1?.length ? `Array(${data.Table1.length})` : data.Table1,
      Table2: data.Table2?.length ? `Array(${data.Table2.length})` : data.Table2,
      Table3: data.Table3?.length ? `Array(${data.Table3.length})` : data.Table3,
      Table4: data.Table4?.length ? `Array(${data.Table4.length})` : data.Table4,
    });

    // Smart mapping - try to detect the correct table based on content structure
    const detectKPITable = () => {
      // Look for KPI-like fields (TotIds, Won, Lost, WinTotal, etc.)
      if (data.Table1?.[0] && typeof data.Table1[0].TotIds !== 'undefined') return data.Table1[0];
      if (data.Table?.[0] && typeof data.Table[0].TotIds !== 'undefined') return data.Table[0];
      return {};
    };

    const detectPipelineTable = () => {
      // Look for pipeline-like fields (Stage, Opportunities, Value)
      if (Array.isArray(data.Table2) && data.Table2[0]?.Stage) return data.Table2;
      if (Array.isArray(data.Table1) && data.Table1[0]?.Stage) return data.Table1;
      if (Array.isArray(data.Table) && data.Table[0]?.Stage) return data.Table;
      return [];
    };

    const detectRevenueTable = () => {
      // Look for revenue trend fields (Year, Month, Revenue, Pipeline)
      if (Array.isArray(data.Table3) && data.Table3[0]?.Year) return data.Table3;
      if (Array.isArray(data.Table2) && data.Table2[0]?.Year) return data.Table2;
      if (Array.isArray(data.Table1) && data.Table1[0]?.Year) return data.Table1;
      return [];
    };

    const detectTeamTable = () => {
      // Look for team/rep fields (RepName, RepID, TotalOpportunities)
      if (Array.isArray(data.Table4) && data.Table4[0]?.RepName) return data.Table4;
      if (Array.isArray(data.Table3) && data.Table3[0]?.RepName) return data.Table3;
      if (Array.isArray(data.Table2) && data.Table2[0]?.RepName) return data.Table2;
      return [];
    };

    const kpiMetrics = detectKPITable();
    const pipelineHealth = detectPipelineTable();
    const revenueTrends = detectRevenueTable();
    const teamPerformance = detectTeamTable();

    console.log('🔍 Smart mapping results:', {
      kpiMetrics: kpiMetrics ? 'Found' : 'Empty',
      pipelineHealth: `Array(${pipelineHealth.length})`,
      revenueTrends: `Array(${revenueTrends.length})`,
      teamPerformance: `Array(${teamPerformance.length})`
    });

    return {
      // Use smart detection instead of fixed mapping
      kpiMetrics,
      pipelineHealth,
      revenueTrends,
      teamPerformance,

      // Keep static mapping for product/business unit data
      productPerformance: data.Table5 || [],
      businessUnitPerformance: data.Table6 || [],

      // Previous period data might be in different positions
      previousPeriodKpiMetrics: data.Table7?.[0] || data.Table6?.[0] || {},

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
  }
}

export default new ExecutiveDashboardService(); 