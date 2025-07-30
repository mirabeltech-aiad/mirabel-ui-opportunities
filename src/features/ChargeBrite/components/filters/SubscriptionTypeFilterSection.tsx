
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SubscriptionTypeFilterSectionProps {
  subscriptionTypes: Array<{ id: string; name: string; }>;
  selectedSubscriptionTypes: string[];
  isAllSubscriptionTypesSelected: boolean;
  toggleSubscriptionType: (typeId: string) => void;
  selectAllSubscriptionTypes: () => void;
}

const SubscriptionTypeFilterSection: React.FC<SubscriptionTypeFilterSectionProps> = ({
  subscriptionTypes,
  selectedSubscriptionTypes,
  isAllSubscriptionTypesSelected,
  toggleSubscriptionType,
  selectAllSubscriptionTypes
}) => {
  return (
    <>
      <div className="border-r border-gray-300">
        <Select
          value={isAllSubscriptionTypesSelected ? 'all' : 'custom'}
          onValueChange={(value) => {
            if (value === 'all') {
              selectAllSubscriptionTypes();
            }
          }}
        >
          <SelectTrigger className="w-[120px] h-11 rounded-none border-0 focus:ring-0 focus:ring-offset-0 bg-white hover:bg-gray-50">
            <SelectValue>
              {isAllSubscriptionTypesSelected ? 'All Subscription Types' : `${selectedSubscriptionTypes.length} Selected`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            <SelectItem value="all">All Subscription Types</SelectItem>
            {subscriptionTypes.map((type) => (
              <SelectItem 
                key={type.id}
                value={type.id}
                onClick={() => toggleSubscriptionType(type.id)}
              >
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default SubscriptionTypeFilterSection;
