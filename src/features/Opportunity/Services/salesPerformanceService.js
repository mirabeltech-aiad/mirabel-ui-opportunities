import axiosService from '@/services/axiosService';
import { getCurrentUserId } from '@/utils/userUtils';
const axiosInstance = axiosService;
class SalesPerformanceService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
    }

    /**
     * Call uspCDCSync_GetSalesPerformanceData stored procedure
     * Returns 6 result sets for complete sales performance analysis
     */
    async getSalesPerformanceData(
        dateRange = 'last-12-months',
        selectedRep = 'all',
        selectedStatus = 'all',
        selectedProduct = 'all',
        selectedBusinessUnit = 'all',
        customDateRange = null
    ) {
        try {
            // Extract values for API call using standardized parameter requirements
            const extractedRepValue = this.extractRepValue(selectedRep);
            const extractedStatusValue = this.extractStatusValue(selectedStatus);
            const extractedDateRange = this.extractDateRangeValue(dateRange, customDateRange);
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
                    UserID: getCurrentUserId()
                }
            };



            const cacheKey = JSON.stringify(params);

            // Check cache first
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.cacheTimeout) {

                    return this.structureResultSets(cached.data);
                }
            }

            const response = await axiosInstance.post('services/admin/common/production/executesp/', params);



            // Validate response structure
            this.validateStoredProcedureResponse(response);

            // Check if response has meaningful data before processing  
            if (!response.content?.Data || Object.keys(response.content.Data).length === 0) {
                console.warn('⚠️ Empty or invalid response data from Sales Performance SP - skipping processing');
                throw new Error('Stored procedure returned empty data');
            }

            // Extract and structure the 6 result sets
            const structuredData = this.structureResultSets(response);

            // Cache the response
            this.cache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now()
            });


            return structuredData;

        } catch (error) {
            console.error('❌ Sales Performance Service Error:', error);
            throw new Error(`Failed to fetch sales performance data: ${error.message}`);
        }
    }

    // Extract rep value for API call - should send comma-separated list for multiple selections
    extractRepValue(selectedRep) {
        console.log('🔍 SalesPerformance extractRepValue input:', selectedRep, typeof selectedRep);

        if (!selectedRep || selectedRep === 'all' || (Array.isArray(selectedRep) && selectedRep.length === 0)) {
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
                return 'all';
            }
            
            return repValues.join(',');
        }

        // If it's a string (most common from MultiSelectDropdown)
        if (typeof selectedRep === 'string') {
            // Extract numeric ID from IE=123~ format
            if (selectedRep.includes('IE=') && selectedRep.includes('~')) {
                const match = selectedRep.match(/IE=(\d+)~/);
                return match ? match[1] : selectedRep;
            }
            return selectedRep;
        }

        // If it's an object with id, use the id (preferred)
        if (typeof selectedRep === 'object' && selectedRep.id) {
            const idStr = String(selectedRep.id);
            // Extract numeric ID from IE=123~ format
            if (idStr.includes('IE=') && idStr.includes('~')) {
                const match = idStr.match(/IE=(\d+)~/);
                return match ? match[1] : idStr;
            }
            return idStr;
        }

        // If it's an object with value, use the value
        if (typeof selectedRep === 'object' && selectedRep.value) {
            const valueStr = String(selectedRep.value);
            // Extract numeric ID from IE=123~ format
            if (valueStr.includes('IE=') && valueStr.includes('~')) {
                const match = valueStr.match(/IE=(\d+)~/);
                return match ? match[1] : valueStr;
            }
            return valueStr;
        }

        // If it's an object with gsEmployeesID, use that
        if (typeof selectedRep === 'object' && selectedRep.gsEmployeesID) {

            return String(selectedRep.gsEmployeesID);
        }

        // Fallback to name-based matching (for backward compatibility)
        if (typeof selectedRep === 'object' && selectedRep.fullName) {

            return selectedRep.fullName;
        }

        // If it's an object with name, use the name (fallback)
        if (typeof selectedRep === 'object' && selectedRep.name) {

            return selectedRep.name;
        }

        // If it's an object with label/value structure
        if (typeof selectedRep === 'object' && selectedRep.label) {

            return selectedRep.label;
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

    // Extract date range value for API call with custom date range support and comprehensive period support
    extractDateRangeValue(dateRange, customDateRange) {


        if (dateRange === 'custom' && customDateRange) {
            const customRange = `${customDateRange.from.toISOString().split('T')[0]}_${customDateRange.to.toISOString().split('T')[0]}`;

            return customRange;
        }

        if (!dateRange) {

            return 'last-12-months'; // Default
        }

        // Map the comprehensive date ranges matching Executive Dashboard
        const validDateRanges = [
            'today', 'yesterday', 'this-week', 'last-week', 'last-7-days', 'last-14-days',
            'this-month', 'last-month', 'last-30-days', 'last-60-days', 'last-90-days',
            'this-quarter', 'last-quarter', 'last-120-days', 'last-6-months',
            'this-year', 'ytd', 'last-year', 'last-12-months', 'last-18-months',
            'last-24-months', 'all', 'all-time'
        ];

        if (validDateRanges.includes(dateRange)) {

            return dateRange;
        }


        return 'last-12-months'; // Default fallback
    }

    // Extract product value for API call - should send comma-separated list for multiple selections
    extractProductValue(selectedProduct) {
        console.log('🔍 SalesPerformance extractProductValue input:', selectedProduct, typeof selectedProduct);

        if (!selectedProduct || selectedProduct === 'all' || (Array.isArray(selectedProduct) && selectedProduct.length === 0)) {
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
                return 'all';
            }
            
            return productValues.join(',');
        }

        // If it's an object with id, use the id as string
        if (typeof selectedProduct === 'object' && selectedProduct.id) {

            return String(selectedProduct.id);
        }

        // If it's an object with value, use the value as string  
        if (typeof selectedProduct === 'object' && selectedProduct.value) {

            return String(selectedProduct.value);
        }

        // If it's already a string (product ID), use it directly
        if (typeof selectedProduct === 'string') {

            return selectedProduct;
        }


        return 'all';
    }

    // Extract business unit value for API call - should send comma-separated list for multiple selections
    extractBusinessUnitValue(selectedBusinessUnit) {
        console.log('🔍 SalesPerformance extractBusinessUnitValue input:', selectedBusinessUnit, typeof selectedBusinessUnit);

        if (!selectedBusinessUnit || selectedBusinessUnit === 'all' || (Array.isArray(selectedBusinessUnit) && selectedBusinessUnit.length === 0)) {
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
                return 'all';
            }
            
            return businessUnitValues.join(',');
        }

        // If it's an object with id, use the id as string
        if (typeof selectedBusinessUnit === 'object' && selectedBusinessUnit.id) {

            return String(selectedBusinessUnit.id);
        }

        // If it's an object with value, use the value as string  
        if (typeof selectedBusinessUnit === 'object' && selectedBusinessUnit.value) {

            return String(selectedBusinessUnit.value);
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

        if (!pipelineData || pipelineData.length === 0) {
            // Check if data might be in other tables
            const allTables = apiData?.content?.Data || {};

            // Try to find pipeline data in other tables
            for (const [, tableData] of Object.entries(allTables)) {
                if (Array.isArray(tableData) && tableData.length > 0) {
                    // Look for stage-related properties
                    const firstItem = tableData[0];
                    if (firstItem && (firstItem.stage || firstItem.Stage || firstItem.StageName)) {
                        return tableData.map(item => ({
                            stage: item.stage || item.Stage || item.StageName || 'Unknown Stage',
                            count: item.count || item.Count || item.OpportunityCount || item.Opportunities || 0,
                            value: item.value || item.Value || item.Amount || item.TotalValue || 0
                        }));
                    }
                }
            }

            return [];
        }

        return pipelineData.map(item => ({
            stage: item.stage || item.Stage || item.StageName || 'Unknown Stage',
            count: item.count || item.Count || item.OpportunityCount || item.Opportunities || 0,
            value: item.value || item.Value || item.Amount || item.TotalValue || 0
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
            winRate: rep.winRate?.toFixed(2) || '0.00'
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
            console.warn('Missing result sets from Sales Performance stored procedure:', missingResultSets);
            // Don't throw error, allow partial data
        }

        console.log('✅ Sales Performance SP response structure validated');
    }

    /**
     * Structure the 6 result sets into organized data matching standard SP response format
     */
    structureResultSets(response) {
        const data = response?.content?.Data || {};

        return {
            // Result Set 1: KPI Metrics (Table)
            kpiMetrics: data.Table?.[0] || {},

            // Result Set 2: Revenue Trends (Table1)
            revenueTrends: data.Table1 || [],

            // Result Set 3: Pipeline Data by Stage (Table2)
            pipelineData: data.Table2 || [],

            // Result Set 4: Sales Rep Performance (Table3)
            repPerformance: data.Table3 || [],

            // Result Set 5: Sales Reps List (Table4)
            salesRepsList: data.Table4 || [],

            // Result Set 6: Filtered Opportunities Details (Table5)
            opportunitiesDetails: data.Table5 || [],

            // Metadata for tracking
            metadata: {
                source: 'uspCDCSync_GetSalesPerformanceData',
                resultSetsCount: Object.keys(data).length,
                timestamp: new Date().toISOString()
            }
        };
    }

    clearCache() {
        this.cache.clear();
    }
}

export default new SalesPerformanceService();