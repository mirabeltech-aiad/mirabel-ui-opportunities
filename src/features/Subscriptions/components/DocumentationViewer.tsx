
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from 'lucide-react';
import DocumentSearchBar from './documentation/DocumentSearchBar';
import DocumentList from './documentation/DocumentList';
import DocumentPreview from './documentation/DocumentPreview';
import { documentsData, type DocumentItem } from './documentation/documentsData';

const DocumentationViewer: React.FC = () => {
  const [documents] = useState<DocumentItem[]>(documentsData);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categorizeDocuments = () => {
    const categories = {
      core: documents.filter(doc => ['readme', 'context'].includes(doc.type)),
      technical: documents.filter(doc => ['architecture', 'changelog'].includes(doc.type)),
      api: documents.filter(doc => doc.type === 'api'),
      guides: documents.filter(doc => ['guide', 'reference'].includes(doc.type))
    };
    return categories;
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           categorizeDocuments()[selectedCategory as keyof ReturnType<typeof categorizeDocuments>]?.some(d => d.id === doc.id);
    return matchesSearch && matchesCategory;
  });

  const categories = categorizeDocuments();

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-ocean-800">
            <Book className="w-5 h-5 mr-2" />
            Documentation Library
          </CardTitle>
          <CardDescription>Browse and search through all documentation files</CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            totalDocuments={documents.length}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DocumentList
              documents={filteredDocs}
              selectedDocument={selectedDoc}
              onDocumentSelect={setSelectedDoc}
            />

            <div className="lg:col-span-2">
              <DocumentPreview
                selectedDocument={selectedDoc}
                categories={categories}
                onDocumentSelect={setSelectedDoc}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentationViewer;
