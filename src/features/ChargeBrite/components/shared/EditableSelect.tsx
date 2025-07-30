
import { useState } from 'react';
import { Edit2, Plus, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditMode } from '../../contexts/EditModeContext';
import { useToast } from '../../hooks/use-toast';

interface EditableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  onOptionsChange?: (options: Array<{ value: string; label: string }>) => void;
  placeholder?: string;
  className?: string;
}

const EditableSelect: React.FC<EditableSelectProps> = ({
  value,
  onValueChange,
  options,
  onOptionsChange,
  placeholder = "Select an option...",
  className = ""
}) => {
  const { isEditMode } = useEditMode();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editOptions, setEditOptions] = useState(options);
  const [newOption, setNewOption] = useState({ value: '', label: '' });

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditOptions([...options]);
  };

  const handleSaveEdit = () => {
    if (onOptionsChange) {
      onOptionsChange(editOptions);
      toast({
        title: "Options updated",
        description: "Select field options have been successfully updated.",
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditOptions([...options]);
    setNewOption({ value: '', label: '' });
  };

  const handleAddOption = () => {
    if (newOption.value && newOption.label) {
      setEditOptions([...editOptions, newOption]);
      setNewOption({ value: '', label: '' });
    }
  };

  const handleRemoveOption = (valueToRemove: string) => {
    setEditOptions(editOptions.filter(opt => opt.value !== valueToRemove));
  };

  const handleEditOption = (index: number, field: 'value' | 'label', newValue: string) => {
    const updated = [...editOptions];
    updated[index] = { ...updated[index], [field]: newValue };
    setEditOptions(updated);
  };

  if (isEditing) {
    return (
      <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-blue-900">Edit Select Options</h4>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {editOptions.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={option.value}
                onChange={(e) => handleEditOption(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1"
              />
              <Input
                value={option.label}
                onChange={(e) => handleEditOption(index, 'label', e.target.value)}
                placeholder="Label"
                className="flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRemoveOption(option.value)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-blue-200">
          <Input
            value={newOption.value}
            onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
            placeholder="New option value"
            className="flex-1"
          />
          <Input
            value={newOption.label}
            onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
            placeholder="New option label"
            className="flex-1"
          />
          <Button size="sm" onClick={handleAddOption} disabled={!newOption.value || !newOption.label}>
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isEditMode && onOptionsChange && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleStartEdit}
          className="shrink-0"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};

export default EditableSelect;
