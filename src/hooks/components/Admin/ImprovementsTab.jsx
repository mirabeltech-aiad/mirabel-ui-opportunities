
import { useState } from "react";
import { Card, CardContent } from "@OpportunityComponents/ui/card";
import { Button } from "@OpportunityComponents/ui/button";
import { ScrollArea } from "@OpportunityComponents/ui/scroll-area";
import { Plus } from "lucide-react";
import { useImprovements } from "./hooks/useImprovements";
import { sortImprovements } from "./utils/improvementUtils";
import ImprovementForm from "./components/ImprovementForm";
import ImprovementItem from "./components/ImprovementItem";

// WARNING: Consider adding unit tests to ensure refactoring doesn't break functionality
const ImprovementsTab = () => {
  const { improvements, addImprovement, updateImprovement, deleteImprovement } = useImprovements();
  const [isAddingImprovement, setIsAddingImprovement] = useState(false);
  const [editingImprovement, setEditingImprovement] = useState(null);
  const [newImprovement, setNewImprovement] = useState({ title: "", description: "", priority: "medium" });

  // Extracted for clarity - handles form submission
  const handleAddImprovement = () => {
    const success = addImprovement(newImprovement);
    if (success) {
      setNewImprovement({ title: "", description: "", priority: "medium" });
      setIsAddingImprovement(false);
    }
  };

  // Extracted for clarity - handles editing improvement
  const handleEditImprovement = (improvement) => {
    setEditingImprovement(improvement);
    setNewImprovement({ title: improvement.title, description: improvement.description, priority: improvement.priority });
    setIsAddingImprovement(true);
  };

  // Extracted for clarity - handles updating improvement
  const handleUpdateImprovement = () => {
    const success = updateImprovement(editingImprovement.id, newImprovement);
    if (success) {
      setNewImprovement({ title: "", description: "", priority: "medium" });
      setIsAddingImprovement(false);
      setEditingImprovement(null);
    }
  };

  // Extracted for clarity - handles form cancellation
  const handleCancelForm = () => {
    setIsAddingImprovement(false);
    setEditingImprovement(null);
    setNewImprovement({ title: "", description: "", priority: "medium" });
  };

  const sortedImprovements = sortImprovements(improvements);

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="p-4 border-b bg-white">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Improvements</h2>
          <p className="text-sm text-gray-500">Feature requests and enhancement ideas</p>
        </div>

        <ImprovementForm
          isVisible={isAddingImprovement}
          isEditing={!!editingImprovement}
          formData={newImprovement}
          onFormDataChange={setNewImprovement}
          onSubmit={editingImprovement ? handleUpdateImprovement : handleAddImprovement}
          onCancel={handleCancelForm}
        />

        {!isAddingImprovement && (
          <Button
            onClick={() => setIsAddingImprovement(true)}
            className="bg-indigo-600 hover:bg-indigo-700 h-8 text-sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add New Improvement
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {improvements.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 text-sm">No improvements yet. Add your first improvement idea to get started.</p>
              </CardContent>
            </Card>
          ) : (
            sortedImprovements.map((improvement) => (
              <ImprovementItem
                key={improvement.id}
                improvement={improvement}
                onEdit={handleEditImprovement}
                onDelete={deleteImprovement}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ImprovementsTab;
