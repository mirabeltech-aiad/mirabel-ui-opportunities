
import React, { useState } from "react";
import DocumentationSidebar from "./DocumentationSidebar";
import DocumentationHeader from "./DocumentationHeader";
import DocumentationViewer from "./DocumentationViewer";

/**
 * Main documentation tab component - refactored for better maintainability
 * Preserves all existing functionality while improving code organization
 */
const DocumentationTab = () => {
  const [activeDoc, setActiveDoc] = useState('contributing');

  const documentationFiles = [
    {
      id: 'contributing',
      name: 'CONTRIBUTING.md',
      title: 'Contributing Guidelines',
      description: 'Code style, development process, and contribution standards',
      status: 'Available',
      lastUpdated: '2025-05-25'
    },
    {
      id: 'deployment',
      name: 'DEPLOYMENT.md',
      title: 'Deployment Guide',
      description: 'Environment setup, build process, and deployment instructions',
      status: 'Available',
      lastUpdated: '2025-05-25'
    },
    {
      id: 'api',
      name: 'API.md',
      title: 'API Documentation',
      description: 'Endpoints, schemas, authentication, and integration patterns',
      status: 'Available',
      lastUpdated: '2025-05-25'
    },
    {
      id: 'testing',
      name: 'TESTING.md',
      title: 'Testing Guidelines',
      description: 'Testing strategy, patterns, and coverage requirements',
      status: 'Available',
      lastUpdated: '2025-05-25'
    },
    {
      id: 'troubleshooting',
      name: 'TROUBLESHOOTING.md',
      title: 'Troubleshooting Guide',
      description: 'Common issues, debug procedures, and solution patterns',
      status: 'Available',
      lastUpdated: '2025-05-25'
    }
  ];

  // Preserved original functionality - no logic changes
  const handleDocumentSelect = (docId) => {
    setActiveDoc(docId);
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="p-4 border-b bg-white">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Documentation Management</h2>
          <p className="text-sm text-gray-500">View and manage project documentation files</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Extracted to DocumentationSidebar component */}
        <DocumentationSidebar 
          documentationFiles={documentationFiles}
          activeDoc={activeDoc}
          onDocumentSelect={handleDocumentSelect}
        />

        {/* Documentation Viewer */}
        <div className="flex-1 flex flex-col">
          {/* Extracted to DocumentationHeader component */}
          <DocumentationHeader 
            documentationFiles={documentationFiles}
            activeDoc={activeDoc}
          />

          {/* Extracted to DocumentationViewer component */}
          <DocumentationViewer activeDoc={activeDoc} />
        </div>
      </div>
    </div>
  );
};

export default DocumentationTab;
