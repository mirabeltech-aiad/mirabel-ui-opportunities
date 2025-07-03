
import React from 'react';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@OpportunityComponents/ui/select';
import SalesRepFilter from './SalesRepFilter';

const FiltersSection = ({
  selectedPeriod,
  selectedRep,
  selectedProduct,
  selectedBusinessUnit,
  onPeriodChange,
  onRepChange,
  onProductChange,
  onBusinessUnitChange,
  periodOptions,
  productOptions,
  businessUnitOptions
}) => {
  return (
    <div className="flex gap-4 items-center bg-white p-4 rounded-lg border">
      <div className="flex items-center gap-2 text-blue-600">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>
      
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-48 bg-white border-gray-300">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periodOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <SalesRepFilter 
        selectedRep={selectedRep}
        onRepChange={onRepChange}
        selectedPeriod={selectedPeriod}
        compact={true}
      />

      <Select value={selectedProduct} onValueChange={onProductChange}>
        <SelectTrigger className="w-48 bg-white border-gray-300">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {productOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedBusinessUnit} onValueChange={onBusinessUnitChange}>
        <SelectTrigger className="w-48 bg-white border-gray-300">
          <SelectValue />
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
  );
};

export default FiltersSection;
