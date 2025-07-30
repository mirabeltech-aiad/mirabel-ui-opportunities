

import { DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FormSection from '@/components/forms/FormSection';
import { FloatingLabelInput } from '@/components';

interface BusinessMetricsSectionProps {
  minLtv: string;
  setMinLtv: (value: string) => void;
  subscriptionLength: string;
  setSubscriptionLength: (value: string) => void;
  selectedChannels: string[];
  setSelectedChannels: React.Dispatch<React.SetStateAction<string[]>>;
  revenueRange: string;
  setRevenueRange: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
}

const BusinessMetricsSection: React.FC<BusinessMetricsSectionProps> = ({
  minLtv,
  setMinLtv,
  subscriptionLength,
  setSubscriptionLength,
  selectedChannels,
  setSelectedChannels,
  revenueRange,
  setRevenueRange,
  currency,
  setCurrency
}) => {
  const channels = [
    { id: 'direct', name: 'Direct' },
    { id: 'social', name: 'Social Media' },
    { id: 'email', name: 'Email' },
    { id: 'referral', name: 'Referral' },
    { id: 'paid', name: 'Paid Ads' },
    { id: 'organic', name: 'Organic Search' }
  ];

  const toggleSelection = (
    id: string, 
    selected: string[], 
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <FormSection title="Business Metrics" icon={<DollarSign className="h-5 w-5" />}>
      <div className="space-y-3">
        {/* Row 1: All financial fields optimally sized */}
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[180px]">
            <FloatingLabelInput
              type="number"
              label="Minimum Lifetime Value ($)"
              value={minLtv}
              onChange={setMinLtv}
              placeholder="Enter minimum LTV"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <FloatingLabelInput
              type="text"
              label="Revenue Range"
              value={revenueRange}
              onChange={setRevenueRange}
              placeholder="e.g. $1K-5K"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <FloatingLabelInput
              type="number"
              label="Subscription (Months)"
              value={subscriptionLength}
              onChange={setSubscriptionLength}
              placeholder="12"
            />
          </div>
          <div className="flex-1 min-w-[100px]">
            <FloatingLabelInput
              type="text"
              label="Currency"
              value={currency}
              onChange={setCurrency}
              placeholder="USD"
            />
          </div>
        </div>

        {/* Row 2: Full-width badge selection area */}
        <div className="w-full space-y-2">
          <label className="text-sm font-medium text-gray-700">Acquisition Channels</label>
          <div className="flex flex-wrap gap-2">
            {channels.map((channel) => (
              <Badge
                key={channel.id}
                variant={selectedChannels.includes(channel.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100 rounded-md"
                onClick={() => toggleSelection(channel.id, selectedChannels, setSelectedChannels)}
              >
                {channel.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default BusinessMetricsSection;
