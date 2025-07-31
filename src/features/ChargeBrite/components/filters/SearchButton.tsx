
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const SearchButton: React.FC = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/chargebrite/advanced-search');
  };

  return (
    <div className="flex items-center px-3 py-2">
      <Button
        onClick={handleSearchClick}
        className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500 h-8 text-xs"
      >
        <Search className="h-3 w-3 mr-1" />
        Filters
      </Button>
    </div>
  );
};

export default SearchButton;
