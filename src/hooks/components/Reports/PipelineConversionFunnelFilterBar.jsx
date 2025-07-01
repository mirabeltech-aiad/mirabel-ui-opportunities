import React, { useState, useEffect } from 'react';
import { Filter, Download, RefreshCw, CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { userService } from '@/services/userService';

const PipelineConversionFunnelFilterBar = ({
  timeRange,
  salesRep,
  product,
  businessUnit,
  onTimeRangeChange,
  onSalesRepChange,
  onProductChange,
  onBusinessUnitChange,
  onExport,
  onRefresh
}) => {
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [showCustomDatePickers, setShowCustomDatePickers] = useState(false);
  const [salesReps, setSalesReps] = useState([]);
  const [isLoadingSalesReps, setIsLoadingSalesReps] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [isLoadingBusinessUnits, setIsLoadingBusinessUnits] = useState(false);

  const timeRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "custom", label: "Custom Range" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "this-week", label: "This Week" },
    { value: "last-week", label: "Last Week" },
    { value: "this-month", label: "This Month" },
    { value: "last-month", label: "Last Month" },
    { value: "this-quarter", label: "This Quarter" },
    { value: "last-quarter", label: "Last Quarter" },
    { value: "this-year", label: "This Year" },
    { value: "last-year", label: "Last Year" },
    { value: "last-7-days", label: "Last 7 Days" },
    { value: "last-30-days", label: "Last 30 Days" },
    { value: "last-90-days", label: "Last 90 Days" },
    { value: "last-180-days", label: "Last 180 Days" },
    { value: "last-365-days", label: "Last 365 Days" },
    { value: "ytd", label: "Year to Date" },
    { value: "mtd", label: "Month to Date" }
  ];

  // Fetch sales reps from API
  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        setIsLoadingSalesReps(true);
        const reps = await userService.getUsersForDropdown();
        setSalesReps(reps);
      } catch (error) {
        console.error('Failed to fetch sales reps:', error);
      } finally {
        setIsLoadingSalesReps(false);
      }
    };

    fetchSalesReps();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const productData = await userService.getProducts();
        setProducts(productData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch business units from API
  useEffect(() => {
    const fetchBusinessUnits = async () => {
      try {
        setIsLoadingBusinessUnits(true);
        const unitData = await userService.getBusinessUnits();
        setBusinessUnits(unitData);
      } catch (error) {
        console.error('Failed to fetch business units:', error);
      } finally {
        setIsLoadingBusinessUnits(false);
      }
    };

    fetchBusinessUnits();
  }, []);

  const salesRepOptions = [
    { value: "all", label: "All Sales Reps" },
    ...salesReps.map(rep => ({
      value: rep.value,
      label: rep.display
    }))
  ];

  const productOptions = [
    { value: "all", label: "All Products" },
    ...products.map(product => ({
      value: product.value,
      label: product.label
    }))
  ];

  const businessUnitOptions = [
    { value: "all", label: "All Business Units" },
    ...businessUnits.map(unit => ({
      value: unit.value,
      label: unit.label
    }))
  ];

  const handleTimeRangeChange = (value) => {
    onTimeRangeChange(value);
    setShowCustomDatePickers(value === "custom");
    if (value !== "custom") {
      setCustomStartDate(null);
      setCustomEndDate(null);
    }
  };

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      const formattedRange = `custom:${format(customStartDate, 'yyyy-MM-dd')}-${format(customEndDate, 'yyyy-MM-dd')}`;
      onTimeRangeChange(formattedRange);
    }
  };

  const getTimeRangeDisplayValue = () => {
    if (timeRange?.startsWith('custom:')) {
      const [, dateRange] = timeRange.split(':');
      const [start, end] = dateRange.split('-');
      return `${start} to ${end}`;
    }
    return timeRangeOptions.find(option => option.value === timeRange)?.label || "All Time";
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow-sm">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Filter Label */}
        <div className="flex items-center gap-2 text-gray-600">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        {/* Time Range Dropdown */}
        <div className="min-w-[140px]">
          <Select value={timeRange || "all"} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="bg-white border-gray-200 text-sm">
              <SelectValue>
                {getTimeRangeDisplayValue()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sales Rep Filter */}
        <div className="min-w-[140px]">
          <Select value={salesRep || "all"} onValueChange={onSalesRepChange} disabled={isLoadingSalesReps}>
            <SelectTrigger className="bg-white border-gray-200 text-sm">
              <SelectValue placeholder="All Sales Reps" />
            </SelectTrigger>
            <SelectContent>
              {salesRepOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product Filter */}
        <div className="min-w-[140px]">
          <Select value={product || "all"} onValueChange={onProductChange} disabled={isLoadingProducts}>
            <SelectTrigger className="bg-white border-gray-200 text-sm">
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              {productOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Business Unit Filter */}
        <div className="min-w-[140px]">
          <Select value={businessUnit || "all"} onValueChange={onBusinessUnitChange} disabled={isLoadingBusinessUnits}>
            <SelectTrigger className="bg-white border-gray-200 text-sm">
              <SelectValue placeholder="All Business Units" />
            </SelectTrigger>
            <SelectContent>
              {businessUnitOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Custom Date Picker Section */}
      {showCustomDatePickers && (
        <div className="mt-4 bg-gray-50 p-2 rounded-md border border-gray-200">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Custom Date Range:</span>
            
            {/* Start Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-40 justify-start text-left font-normal",
                    !customStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customStartDate ? format(customStartDate, "MMM dd, yyyy") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customStartDate}
                  onSelect={setCustomStartDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {/* End Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-40 justify-start text-left font-normal",
                    !customEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customEndDate ? format(customEndDate, "MMM dd, yyyy") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customEndDate}
                  onSelect={setCustomEndDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {/* Apply Button */}
            <Button
              onClick={handleCustomDateApply}
              disabled={!customStartDate || !customEndDate}
              className="bg-ocean-500 text-white hover:bg-ocean-600"
              size="sm"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineConversionFunnelFilterBar;
