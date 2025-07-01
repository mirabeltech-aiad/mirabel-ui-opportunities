
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';
import exportService from '@/services/exportService';
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
  
  // Use real-time data hook with all filters including product and business unit
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
    toast({
      title: "Dashboard Refreshed",
      description: "All data has been updated with the latest information."
    });
  };

  const handleExport = () => {
    try {
      exportService.exportDashboard(selectedPeriod);
      toast({
        title: "Export Successful",
        description: "Dashboard data has been exported successfully."
      });
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
    toast({
      title: "Filter Applied",
      description: repValue === 'all' ? 
        "Showing data for all sales representatives" : 
        `Showing data for ${repValue}`
    });
  };

  const handleProductChange = (productValue) => {
    setSelectedProduct(productValue);
    toast({
      title: "Product Filter Applied",
      description: productValue === 'all' ? 
        "Showing data for all products" : 
        `Filtered by ${productOptions.find(p => p.value === productValue)?.label}`
    });
  };

  const handleBusinessUnitChange = (unitValue) => {
    setSelectedBusinessUnit(unitValue);
    toast({
      title: "Business Unit Filter Applied",
      description: unitValue === 'all' ? 
        "Showing data for all business units" : 
        `Filtered by ${businessUnitOptions.find(u => u.value === unitValue)?.label}`
    });
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
