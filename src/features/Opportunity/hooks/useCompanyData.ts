
import { useState } from "react";
import { CompanyData } from "@/types/opportunity";

interface UseCompanyDataReturn {
  companyData: CompanyData;
  setCompanyData: React.Dispatch<React.SetStateAction<CompanyData>>;
  editingField: string | null;
  tempValue: string;
  setTempValue: React.Dispatch<React.SetStateAction<string>>;
  startEditing: (field: string, value: string) => void;
  saveEdit: (field: string) => void;
  cancelEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent, field: string) => void;
}

export const useCompanyData = (selectedCompany: string): UseCompanyDataReturn => {
  // Mock additional company data with contact person
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: selectedCompany,
    firstName: "Hal",
    lastName: "Johnson",
    phone: "(215) 996-7980",
    ext: "123",
    mobile: "(215) 555-0123",
    email: "hal@phillyvoice.com",
    address: "Philadelphia, PA",
    website: "www.phillyvoice.com",
    industry: "Media & Publishing",
    employees: "50-100"
  });

  // Track which field is being edited
  const [editingField, setEditingField] = useState<string | null>(null);
  
  // Store temporary values during editing
  const [tempValue, setTempValue] = useState<string>("");

  // Begin editing a field
  const startEditing = (field: string, value: string): void => {
    setEditingField(field);
    setTempValue(value);
  };

  // Save the edited value
  const saveEdit = (field: string): void => {
    setCompanyData(prev => ({
      ...prev,
      [field]: tempValue
    }));
    setEditingField(null);
  };

  // Cancel editing and revert to original value
  const cancelEdit = (): void => {
    setEditingField(null);
  };

  // Handle key press events for input fields
  const handleKeyDown = (e: React.KeyboardEvent, field: string): void => {
    if (e.key === "Enter") {
      saveEdit(field);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return {
    companyData,
    setCompanyData,
    editingField,
    tempValue,
    setTempValue,
    startEditing,
    saveEdit,
    cancelEdit,
    handleKeyDown
  };
};
