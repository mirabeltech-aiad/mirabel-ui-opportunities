

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/forms/FormSection';

interface SearchActionsSectionProps {
  onSearch: () => void;
  onReset: () => void;
}

const SearchActionsSection: React.FC<SearchActionsSectionProps> = ({
  onSearch,
  onReset
}) => {
  return (
    <FormSection title="Search Actions" icon={<Search className="h-5 w-5" />}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ocean-800 mb-1">Ready to Search?</h3>
          <p className="text-gray-600 text-sm">Apply your filters to find relevant data</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onReset}
            className="border-gray-300 hover:bg-gray-50 rounded-lg"
          >
            Reset All
          </Button>
          <Button
            onClick={onSearch}
            className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500 rounded-lg"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </FormSection>
  );
};

export default SearchActionsSection;
