
import React from "react";
import { Button } from "@OpportunityComponents/ui/button";
import { List, LayoutGrid, Kanban, PanelRight } from "lucide-react";

const ViewToggle = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center gap-0 border border-gray-200 rounded-md">
      <Button
        variant={view === 'table' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onViewChange('table')}
        className="h-8 w-8 !rounded-none"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'cards' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onViewChange('cards')}
        className="h-8 w-8 !rounded-none"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'kanban' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onViewChange('kanban')}
        className="h-8 w-8 !rounded-none"
      >
        <Kanban className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'split' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onViewChange('split')}
        className="h-8 w-8 !rounded-none"
      >
        <PanelRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
