
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save, X } from 'lucide-react';
import { useHelp } from '../contexts/HelpContext';
import { useToast } from '../hooks/use-toast';

const HelpManagement: React.FC = () => {
  const { helpItems, updateHelpItem } = useHelp();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInstruction, setEditInstruction] = useState('');

  const handleEdit = (id: string, currentInstruction: string) => {
    setEditingId(id);
    setEditInstruction(currentInstruction);
  };

  const handleSave = (id: string) => {
    updateHelpItem(id, editInstruction);
    setEditingId(null);
    setEditInstruction('');
    toast({
      title: "Help instruction updated",
      description: "The field help instruction has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditInstruction('');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-ocean-800">
          Help Instructions Management
        </CardTitle>
        <CardDescription>
          Manage help tooltips and instructions for form fields across the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {helpItems.map((item) => (
            <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{item.fieldName}</h4>
                    <Badge variant="outline" className="text-xs">
                      {item.page}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">ID: {item.id}</p>
                  
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editInstruction}
                        onChange={(e) => setEditInstruction(e.target.value)}
                        className="min-h-[80px]"
                        placeholder="Enter help instruction..."
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(item.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-700 mb-2">{item.instruction}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item.id, item.instruction)}
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpManagement;
