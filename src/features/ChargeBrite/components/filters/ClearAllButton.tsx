
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ClearAllButtonProps {
  hasActiveFilters: boolean;
  onClearAll: () => void;
}

const ClearAllButton: React.FC<ClearAllButtonProps> = ({
  hasActiveFilters,
  onClearAll
}) => {
  if (!hasActiveFilters) return null;

  return (
    <div className="flex items-center px-3 py-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="h-8 text-xs border-gray-300 bg-white hover:bg-gray-50 flex items-center gap-1"
      >
        <X className="h-3 w-3" />
        Clear All
      </Button>
    </div>
  );
};

export default ClearAllButton;
