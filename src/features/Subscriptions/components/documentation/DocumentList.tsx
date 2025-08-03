
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import DocumentItem from './DocumentItem';

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

interface DocumentListProps {
  documents: DocumentItemData[];
  selectedDocument: DocumentItemData | null;
  onDocumentSelect: (document: DocumentItemData) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  selectedDocument,
  onDocumentSelect
}) => {
  return (
    <div className="lg:col-span-1 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Available Documents</h3>
        <Badge variant="secondary">{documents.length} found</Badge>
      </div>
      
      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No documents found matching your criteria</p>
        </div>
      ) : (
        documents.map((doc) => (
          <DocumentItem
            key={doc.id}
            document={doc}
            isSelected={selectedDocument?.id === doc.id}
            onSelect={onDocumentSelect}
          />
        ))
      )}
    </div>
  );
};

export default DocumentList;
