

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FloatingLabelInput } from '../../components';

interface DocumentCategories {
  core: any[];
  technical: any[];
  api: any[];
  guides: any[];
}

interface DocumentSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: DocumentCategories;
  totalDocuments: number;
}

const DocumentSearchBar: React.FC<DocumentSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalDocuments
}) => {
  return (
    <div className="mb-6 space-y-4">
      <FloatingLabelInput
        label="Search Documentation"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search by title or description..."
      />
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange('all')}
        >
          All Documents ({totalDocuments})
        </Button>
        <Button
          variant={selectedCategory === 'core' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange('core')}
        >
          Core ({categories.core.length})
        </Button>
        <Button
          variant={selectedCategory === 'technical' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange('technical')}
        >
          Technical ({categories.technical.length})
        </Button>
        <Button
          variant={selectedCategory === 'api' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange('api')}
        >
          API ({categories.api.length})
        </Button>
        <Button
          variant={selectedCategory === 'guides' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange('guides')}
        >
          Guides ({categories.guides.length})
        </Button>
      </div>
    </div>
  );
};

export default DocumentSearchBar;
