
import { useState, useEffect } from 'react';
import { toast } from '@/features/Opportunity/hooks/use-toast';
import { useRealtimeReports } from '@/features/Opportunity/hooks/useRealtimeReports';
import exportService from '@/features/Opportunity/Services/exportService';
import { periodOptions, getProductOptions, getBusinessUnitOptions } from './dashboardConstants';

export const useExecutiveDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedRep, setSelectedRep] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState("all");
  const [customDateRange, setCustomDateRange] = useState(null);
  const [drillDownMetric, setDrillDownMetric] = useState(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [businessUnitOptions, setBusinessUnitOptions] = useState([]);
  
  // Use real-time data hook with stored procedure integration
  const {
    kpiData,
    pipelineHealth,
    revenueData,
    pipelineData,
    teamData,
    isLoading,
    error,
    lastUpdated,
    refresh
  } = useRealtimeReports(selectedPeriod, selectedRep, true, customDateRange, selectedProduct, selectedBusinessUnit);

  // Log stored procedure data source
  useEffect(() => {
    if (kpiData && kpiData.source) {
      console.log('Executive Dashboard using stored procedure:', kpiData.source);
    }
  }, [kpiData]);

  // Fetch product options when component mounts
  useEffect(() => {
    const fetchProductOptions = async () => {
      try {
        const options = await getProductOptions();
        setProductOptions(options);
      } catch (error) {
        console.error('Failed to fetch product options:', error);
        // Fallback to basic options if API fails
        setProductOptions([{ value: "all", label: "All Products" }]);
      }
    };

    fetchProductOptions();
  }, []);

  // Fetch business unit options when component mounts
  useEffect(() => {
    const fetchBusinessUnitOptions = async () => {
      try {
        const options = await getBusinessUnitOptions();
        setBusinessUnitOptions(options);
      } catch (error) {
        console.error('Failed to fetch business unit options:', error);
        // Fallback to basic options if API fails
        setBusinessUnitOptions([{ value: "all", label: "All Business Units" }]);
      }
    };

    fetchBusinessUnitOptions();
  }, []);

  const handleRefresh = () => {
    refresh();
  };

  const handleExport = () => {
    try {
      exportService.exportDashboard(selectedPeriod);
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the dashboard data.",
        variant: "destructive"
      });
    }
  };

  const handleMetricClick = (metric) => {
    setDrillDownMetric(metric);
    setIsDrillDownOpen(true);
  };

  const handlePeriodChange = (periodValue) => {
    setSelectedPeriod(periodValue);
    
    // Reset custom date range when switching away from custom
    if (periodValue !== "custom") {
      setCustomDateRange(null);
    }
    
    toast({
      title: "Period Filter Applied",
      description: periodValue === "custom" ? 
        "Select custom date range below" : 
        `Showing data for ${periodOptions.find(p => p.value === periodValue)?.label}`
    });
  };

  const handleCustomDateRangeChange = (dateRange) => {
    setCustomDateRange(dateRange);
    
    if (dateRange?.from && dateRange?.to) {
      toast({
        title: "Custom Date Range Applied",
        description: `Showing data from ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`
      });
    }
  };

  const handleRepChange = (repValue) => {
    setSelectedRep(repValue);
  };

  const handleProductChange = (productValue) => {
    setSelectedProduct(productValue);
  };

  const handleBusinessUnitChange = (unitValue) => {
    setSelectedBusinessUnit(unitValue);
  };

  return {
    selectedPeriod,
    selectedRep,
    selectedProduct,
    selectedBusinessUnit,
    customDateRange,
    drillDownMetric,
    isDrillDownOpen,
    kpiData,
    pipelineHealth,
    revenueData,
    pipelineData,
    teamData,
    isLoading,
    error,
    lastUpdated,
    handleRefresh,
    handleExport,
    handleMetricClick,
    handlePeriodChange,
    handleCustomDateRangeChange,
    handleRepChange,
    handleProductChange,
    handleBusinessUnitChange,
    setIsDrillDownOpen
  };
};
