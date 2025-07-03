
import React from "react";
import { ScrollArea } from "@OpportunityComponents/ui/scroll-area";
import { renderDocumentContent } from "./documentationContent";

/**
 * Component for displaying documentation content
 * Extracted from DocumentationTab for better organization
 */
const DocumentationViewer = ({ activeDoc }) => {
  return (
    <ScrollArea className="flex-1 p-4">
      {renderDocumentContent(activeDoc)}
    </ScrollArea>
  );
};

export default DocumentationViewer;
