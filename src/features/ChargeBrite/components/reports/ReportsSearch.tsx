
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { OceanButton } from '@/components/ui/design-system';
import { components } from '@/tokens';

interface ReportsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ReportsSearch = ({ searchQuery, onSearchChange }: ReportsSearchProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          style={{ borderRadius: components.forms.input.borderRadius }}
        />
      </div>
      <OceanButton variant="primary" size="md">
        Search
      </OceanButton>
    </div>
  );
};

export default ReportsSearch;
