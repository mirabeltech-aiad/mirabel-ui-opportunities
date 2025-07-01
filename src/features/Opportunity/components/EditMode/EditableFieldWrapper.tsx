
import React from 'react';
import { Edit } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { Button } from '@/components/ui/button';

interface EditableFieldWrapperProps {
  fieldName: string;
  children: React.ReactNode;
  onEdit?: () => void;
}

const EditableFieldWrapper: React.FC<EditableFieldWrapperProps> = ({ 
  fieldName, 
  children, 
  onEdit 
}) => {
  const { isEditMode, editableFields } = useEditMode();
  
  const isFieldEditable = editableFields.includes(fieldName);
  const showEditIcon = isEditMode && isFieldEditable;

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      console.log(`Edit field: ${fieldName}`);
    }
  };

  return (
    <div className="relative">
      {children}
      {showEditIcon && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute -top-1 -right-1 h-6 w-6 bg-blue-500 text-white hover:bg-blue-600 rounded-full"
          onClick={handleEdit}
        >
          <Edit className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default EditableFieldWrapper;
