
import React, { createContext, useContext, useState } from 'react';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  editableFields: string[];
  setEditableFields: (fields: string[]) => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const EditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableFields, setEditableFields] = useState<string[]>([]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <EditModeContext.Provider value={{
      isEditMode,
      toggleEditMode,
      editableFields,
      setEditableFields
    }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
};
