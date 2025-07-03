
import React, { useState } from 'react';
import { Filter, Download, RefreshCw, CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@OpportunityComponents/ui/select';
import { Button } from '@OpportunityComponents/ui/button';
import { Calendar } from '@OpportunityComponents/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@OpportunityComponents/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useFiltersData } from './hooks/useFiltersData';

const SalesPerformanceFilterBar = ({
  timeRange,
  salesRep,
  selectedStatus,
  product,
  businessUnit,
  onTimeRangeChange,
  onSalesRepChange,
  onStatusChange,
  onProductChange,
  onBusinessUnitChange,
  onExport,
  onRefresh
}) => {
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [showCustomDatePickers, setShowCustomDatePickers] = useState(false);

  // Fetch dynamic filter data
  const { salesReps, products, businessUnits, isLoading, error } = useFiltersData();

  // Updated time range options to match API requirements
  const timeRangeOptions = [
    { value: "all-time", label: "All Time" },
    { value: "this-quarter", label: "This Quarter" },
    { value: "last-quarter", label: "Last Quarter" },
    { value: "last-3-months", label: "Last 3 Months" },
    { value: "last-6-months", label: "Last 6 Months" },
    { value: "last-12-months", label: "Last 12 Months" },
    { value: "ytd", label: "Year to Date" },
    { value: "this-year", label: "This Year" },
    { value: "last-year", label: "Last Year" }
  ];

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "Won", label: "Won" },
    { value: "Open", label: "Open" },
    { value: "Lost", label: "Lost" }
  ];

  const handleTimeRangeChange = (value) => {
    onTimeRangeChange(value);
    setShowCustomDatePickers(false);
    setCustomStartDate(null);
    setCustomEndDate(null);
  };

  // Get the display value for the current time range
  const getCurrentTimeRangeLabel = () => {
    const option = timeRangeOptions.find(option => option.value === timeRange);
    return option?.label || "Last 12 Months";
  };

  // Get display values for selected items
  const getSalesRepDisplayValue = () => {
    if (!salesRep || salesRep === 'all') return "All Sales Reps";
    if (typeof salesRep === 'object') return salesRep.name;
    return salesRep;
  };

  const getProductDisplayValue = () => {
    if (!product || product === 'all') return "All Products";
    if (typeof product === 'object') return product.name;
    return product;
  };

  const getBusinessUnitDisplayValue = () => {
    if (!businessUnit || businessUnit === 'all') return "All Business Units";
    if (typeof businessUnit === 'object') return businessUnit.name;
    return businessUnit;
  };

  const getStatusDisplayValue = () => {
    if (!selectedStatus || selectedStatus === 'all') return "All Statuses";
    const option = statusOptions.find(option => option.value === selectedStatus);
    return option?.label || "All Statuses";
  };

  if (error) {
    console.error('Error loading filter data:', error);
  }

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
          <Select value={timeRange || "last-12-months"} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="bg-white border-gray-200 text-sm">
              <SelectValue placeholder="Last 12 Months">
                {getCurrentTimeRangeLabel()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
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
          <Select 
            value={typeof salesRep === 'object' ? salesRep.id : (salesRep || "all")} 
            onValueChange={(value) => {
              if (value === "all") {
                onSalesRepChange("all");
              } else {
                const selectedRep = salesReps.find(rep => rep.id === value || rep.value === value);
                if (selectedRep) {
                  onSalesRepChange({
                    id: selectedRep.id || selectedRep.value,
                    name: selectedRep.display || selectedRep.label,
                    fullName: selectedRep.fullName || `${selectedRep.firstName || ''} ${selectedRep.lastName || ''}`.trim()
                  });
                }
              }
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white border-gray-200 text-sm">
              <SelectValue placeholder="All Sales Reps">
                {getSalesRepDisplayValue()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="all">All Sales Reps</SelectItem>
              {salesReps.map(rep => (
                <SelectItem key={rep.id || rep.value} value={rep.id || rep.value}>
                  {rep.display || rep.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="min-w-[140px]">
          <Select value={selectedStatus || "all"} onValueChange={onStatusChange}>
            <SelectTrigger className="bg-white border-gray-200 text-sm">
              <SelectValue placeholder="All Statuses">
                {getStatusDisplayValue()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product Filter */}
        <div className="min-w-[140px]">
          <Select 
            value={typeof product === 'object' ? product.id : (product || "all")} 
            onValueChange={(value) => {
              if (value === "all") {
                onProductChange("all");
              } else {
                const selectedProduct = products.find(prod => prod.value === value);
                if (selectedProduct) {
                  onProductChange({
                    id: selectedProduct.value,
                    name: selectedProduct.label
                  });
                }
              }
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white border-gray-200 text-sm">
              <SelectValue placeholder="All Products">
                {getProductDisplayValue()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="all">All Products</SelectItem>
              {products.map(product => (
                <SelectItem key={product.value} value={product.value}>
                  {product.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Business Unit Filter */}
        <div className="min-w-[140px]">
          <Select 
            value={typeof businessUnit === 'object' ? businessUnit.id : (businessUnit || "all")} 
            onValueChange={(value) => {
              if (value === "all") {
                onBusinessUnitChange("all");
              } else {
                const selectedUnit = businessUnits.find(unit => unit.value === value);
                if (selectedUnit) {
                  onBusinessUnitChange({
                    id: selectedUnit.value,
                    name: selectedUnit.label
                  });
                }
              }
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white border-gray-200 text-sm">
              <SelectValue placeholder="All Business Units">
                {getBusinessUnitDisplayValue()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="all">All Business Units</SelectItem>
              {businessUnits.map(unit => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
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
    </div>
  );
};

export default SalesPerformanceFilterBar;
