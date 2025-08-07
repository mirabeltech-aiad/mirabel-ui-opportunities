
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { BusinessUnit } from '@/contexts/ProductFilterContext';

interface BusinessUnitsFilterSectionProps {
  businessUnits: BusinessUnit[];
  selectedBusinessUnits: string[];
  isAllBusinessUnitsSelected: boolean;
  toggleBusinessUnit: (unitId: string) => void;
  selectAllBusinessUnits: () => void;
}

const BusinessUnitsFilterSection: React.FC<BusinessUnitsFilterSectionProps> = ({
  businessUnits,
  selectedBusinessUnits,
  isAllBusinessUnitsSelected,
  toggleBusinessUnit,
  selectAllBusinessUnits
}) => {
  return (
    <div className="border-r border-gray-300">
      <Select
        value={isAllBusinessUnitsSelected ? 'all' : 'custom'}
        onValueChange={(value) => {
          if (value === 'all') {
            selectAllBusinessUnits();
          }
        }}
      >
        <SelectTrigger className="w-[140px] h-11 rounded-none border-0 focus:ring-0 focus:ring-offset-0 bg-white hover:bg-gray-50">
          <SelectValue>
            {isAllBusinessUnitsSelected ? 'All Business Units' : `${selectedBusinessUnits.length} Selected`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
          <SelectItem value="all">All Business Units</SelectItem>
          {businessUnits.map((unit) => (
            <SelectItem 
              key={unit.id}
              value={unit.id}
              onClick={() => toggleBusinessUnit(unit.id)}
            >
              {unit.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

    </div>
  );
};

export default BusinessUnitsFilterSection;
