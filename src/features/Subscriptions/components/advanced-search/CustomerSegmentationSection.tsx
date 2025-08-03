

import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FormSection from '@/components/forms/FormSection';

interface CustomerSegmentationSectionProps {
  selectedSegments: string[];
  setSelectedSegments: React.Dispatch<React.SetStateAction<string[]>>;
  selectedEngagement: string[];
  setSelectedEngagement: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRegions: string[];
  setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRevenueTier: string[];
  setSelectedRevenueTier: React.Dispatch<React.SetStateAction<string[]>>;
}

const CustomerSegmentationSection: React.FC<CustomerSegmentationSectionProps> = ({
  selectedSegments,
  setSelectedSegments,
  selectedEngagement,
  setSelectedEngagement,
  selectedRegions,
  setSelectedRegions,
  selectedRevenueTier,
  setSelectedRevenueTier
}) => {
  const segments = [
    { id: 'new', name: 'New Subscribers' },
    { id: 'returning', name: 'Returning' },
    { id: 'long-term', name: 'Long-term' },
    { id: 'premium', name: 'Premium' },
    { id: 'basic', name: 'Basic' }
  ];

  const engagementLevels = [
    { id: 'high', name: 'High Engagement' },
    { id: 'medium', name: 'Medium Engagement' },
    { id: 'low', name: 'Low Engagement' }
  ];

  const revenueTiers = [
    { id: 'high', name: 'High Value' },
    { id: 'medium', name: 'Medium Value' },
    { id: 'low', name: 'Low Value' }
  ];

  const regions = [
    { id: 'north', name: 'North Region' },
    { id: 'south', name: 'South Region' },
    { id: 'east', name: 'East Region' },
    { id: 'west', name: 'West Region' },
    { id: 'central', name: 'Central Region' }
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
    <FormSection title="Customer Segmentation" icon={<Users className="h-5 w-5" />}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700">Customer Segments</label>
          <div className="flex flex-wrap gap-2">
            {segments.map((segment) => (
              <Badge
                key={segment.id}
                variant={selectedSegments.includes(segment.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100 rounded-md"
                onClick={() => toggleSelection(segment.id, selectedSegments, setSelectedSegments)}
              >
                {segment.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="col-span-1 space-y-2">
          <label className="text-sm font-medium text-gray-700">Engagement Level</label>
          <div className="flex flex-wrap gap-2">
            {engagementLevels.map((level) => (
              <Badge
                key={level.id}
                variant={selectedEngagement.includes(level.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100 rounded-md"
                onClick={() => toggleSelection(level.id, selectedEngagement, setSelectedEngagement)}
              >
                {level.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700">Geographic Region</label>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <Badge
                key={region.id}
                variant={selectedRegions.includes(region.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100 rounded-md"
                onClick={() => toggleSelection(region.id, selectedRegions, setSelectedRegions)}
              >
                {region.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="col-span-1 space-y-2">
          <label className="text-sm font-medium text-gray-700">Revenue Tier</label>
          <div className="flex flex-wrap gap-2">
            {revenueTiers.map((tier) => (
              <Badge
                key={tier.id}
                variant={selectedRevenueTier.includes(tier.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100 rounded-md"
                onClick={() => toggleSelection(tier.id, selectedRevenueTier, setSelectedRevenueTier)}
              >
                {tier.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default CustomerSegmentationSection;
