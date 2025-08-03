
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface CustomerStatusFilterSectionProps {
  customerStatuses: Array<{ id: string; name: string; }>;
  selectedCustomerStatuses: string[];
  isAllCustomerStatusesSelected: boolean;
  toggleCustomerStatus: (statusId: string) => void;
  selectAllCustomerStatuses: () => void;
}

const CustomerStatusFilterSection: React.FC<CustomerStatusFilterSectionProps> = ({
  customerStatuses,
  selectedCustomerStatuses,
  isAllCustomerStatusesSelected,
  toggleCustomerStatus,
  selectAllCustomerStatuses
}) => {
  return (
    <>
      <div className="border-r border-gray-300">
        <Select
          value={isAllCustomerStatusesSelected ? 'all' : 'custom'}
          onValueChange={(value) => {
            if (value === 'all') {
              selectAllCustomerStatuses();
            }
          }}
        >
          <SelectTrigger className="w-[130px] h-11 rounded-none border-0 focus:ring-0 focus:ring-offset-0 bg-white hover:bg-gray-50">
            <SelectValue>
              {isAllCustomerStatusesSelected ? 'All Customer Status' : `${selectedCustomerStatuses.length} Selected`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            <SelectItem value="all">All Customer Status</SelectItem>
            {customerStatuses.map((status) => (
              <SelectItem 
                key={status.id}
                value={status.id}
                onClick={() => toggleCustomerStatus(status.id)}
              >
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default CustomerStatusFilterSection;
