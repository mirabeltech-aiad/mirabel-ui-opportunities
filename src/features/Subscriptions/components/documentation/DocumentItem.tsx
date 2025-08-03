
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Home, Info, History, Building, FileText, Book, FolderOpen } from 'lucide-react';

interface DocumentItemData {
  id: string;
  title: string;
  type: 'api' | 'guide' | 'reference' | 'changelog' | 'readme' | 'context' | 'architecture';
  lastUpdated: string;
  size: string;
  description: string;
  content: string;
  category: 'core' | 'technical' | 'api' | 'guides';
}

interface DocumentItemProps {
  document: DocumentItemData;
  isSelected: boolean;
  onSelect: (document: DocumentItemData) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  document,
  isSelected,
  onSelect
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'api': return 'bg-blue-500';
      case 'guide': return 'bg-green-500';
      case 'reference': return 'bg-purple-500';
      case 'changelog': return 'bg-orange-500';
      case 'readme': return 'bg-indigo-500';
      case 'context': return 'bg-teal-500';
      case 'architecture': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'readme': return <Home className="w-4 h-4" />;
      case 'context': return <Info className="w-4 h-4" />;
      case 'changelog': return <History className="w-4 h-4" />;
      case 'architecture': return <Building className="w-4 h-4" />;
      case 'api': return <FileText className="w-4 h-4" />;
      case 'guide': return <Book className="w-4 h-4" />;
      case 'reference': return <FolderOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-ocean-500 bg-ocean-50'
          : 'border-gray-200 bg-white hover:border-ocean-300 hover:bg-ocean-25'
      }`}
      onClick={() => onSelect(document)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getTypeIcon(document.type)}
          <h4 className="font-medium text-gray-900">{document.title}</h4>
        </div>
        <Badge className={`${getTypeColor(document.type)} text-white`}>
          {document.type}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mb-2">{document.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Updated: {document.lastUpdated}</span>
        <span>{document.size}</span>
      </div>
    </div>
  );
};

export default DocumentItem;
