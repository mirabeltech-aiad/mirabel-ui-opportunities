
import { Filter } from 'lucide-react';

const FilterHeader = () => {
  return (
    <div className="flex items-center justify-center px-4 py-2 bg-white border-r border-gray-300 min-w-[60px]">
      <Filter className="h-4 w-4 text-gray-600" />
    </div>
  );
};

export default FilterHeader;
