
import React from 'react';
import { Search } from 'lucide-react';
import StandaloneInput from './StandaloneInput';

interface StandaloneReportsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const StandaloneReportsSearch = ({ searchQuery, onSearchChange }: StandaloneReportsSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-violet-400" />
      <StandaloneInput
        placeholder="Search reports..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 max-w-md"
      />
    </div>
  );
};

export default StandaloneReportsSearch;
