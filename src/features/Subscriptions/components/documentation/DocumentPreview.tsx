
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Home, Info, History, Building, Book, FolderOpen } from 'lucide-react';

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

interface DocumentCategories {
  core: DocumentItemData[];
  technical: DocumentItemData[];
  api: DocumentItemData[];
  guides: DocumentItemData[];
}

interface DocumentPreviewProps {
  selectedDocument: DocumentItemData | null;
  categories: DocumentCategories;
  onDocumentSelect: (document: DocumentItemData) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  selectedDocument,
  categories,
  onDocumentSelect
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

  if (selectedDocument) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTypeIcon(selectedDocument.type)}
              <div>
                <CardTitle className="text-ocean-800">
                  {selectedDocument.title}
                </CardTitle>
                <CardDescription>{selectedDocument.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getTypeColor(selectedDocument.type)} text-white`}>
                {selectedDocument.type}
              </Badge>
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {selectedDocument.content}
            </pre>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>Last updated: {selectedDocument.lastUpdated}</span>
            <span>File size: {selectedDocument.size}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex items-center justify-center">
      <CardContent className="text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Document</h3>
        <p className="text-gray-600">Choose a document from the list to view its contents</p>
        
        <div className="mt-6 grid grid-cols-2 gap-4 text-left">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Quick Access:</h4>
            <div className="space-y-1">
              {categories.core.slice(0, 2).map(doc => (
                <button
                  key={doc.id}
                  onClick={() => onDocumentSelect(doc)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {getTypeIcon(doc.type)}
                  {doc.title}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Categories:</h4>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <span className="text-gray-600">• Core Documents ({categories.core.length})</span>
              <span className="text-gray-600">• Technical Docs ({categories.technical.length})</span>
              <span className="text-gray-600">• API Reference ({categories.api.length})</span>
              <span className="text-gray-600">• Guides ({categories.guides.length})</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentPreview;
