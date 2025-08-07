
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Settings } from "lucide-react";
import SavedViewsTab from "./SavedViewsTab";
import AddViewTab from "./AddViewTab";

interface ViewsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  columnOrder: any[];
  onColumnOrderChange: (newOrder: any[]) => void;
}

const ViewsSidebar: React.FC<ViewsSidebarProps> = ({
  isOpen,
  onClose,
  columnOrder,
  onColumnOrderChange
}) => {
  const [savedViews, setSavedViews] = useState([
    { id: '1', name: 'Default View', isPublic: false, columns: [] },
    { id: '2', name: 'Sales Pipeline', isPublic: true, columns: [] },
    { id: '3', name: 'My Proposals', isPublic: false, columns: [] }
  ]);
  const [activeViewId, setActiveViewId] = useState<string | null>('1');

  const handleSaveView = (name: string, selectedColumns: string[]) => {
    const newView = {
      id: Date.now().toString(),
      name,
      isPublic: false,
      columns: selectedColumns
    };
    setSavedViews(prev => [...prev, newView]);
  };

  const handleDeleteView = (viewId: string) => {
    setSavedViews(prev => prev.filter(view => view.id !== viewId));
    if (activeViewId === viewId) {
      setActiveViewId(null);
    }
  };

  const handleLoadView = (view: any) => {
    setActiveViewId(view.id);
    // Apply the view's column configuration
    if (view.columns && view.columns.length > 0) {
      onColumnOrderChange(view.columns);
    }
  };

  const handleUpdateView = (viewId: string, newName: string) => {
    setSavedViews(prev => 
      prev.map(view => 
        view.id === viewId ? { ...view, name: newName } : view
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-ocean-600" />
            <h2 className="text-lg font-semibold text-ocean-800">Table Views</h2>
          </div>
          <Button 
            variant="ocean-ghost" 
            size="icon-sm" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 h-full overflow-y-auto">
          <Tabs defaultValue="saved" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-50">
              <TabsTrigger 
                value="saved" 
                className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
              >
                Saved Views
              </TabsTrigger>
              <TabsTrigger 
                value="add" 
                className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
              >
                Create View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="space-y-4">
              <SavedViewsTab 
                savedViews={savedViews}
                onLoadView={handleLoadView}
                onDeleteView={handleDeleteView}
                onUpdateView={handleUpdateView}
                activeViewId={activeViewId}
              />
            </TabsContent>

            <TabsContent value="add" className="space-y-4">
              <AddViewTab 
                columnOrder={columnOrder}
                onSaveView={handleSaveView}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ViewsSidebar;
