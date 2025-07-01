
import { useState } from "react";

export const useCompanyData = (selectedCompany) => {
  // Mock additional company data with contact person
  const [companyData, setCompanyData] = useState({
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
  const [editingField, setEditingField] = useState(null);
  
  // Store temporary values during editing
  const [tempValue, setTempValue] = useState("");

  // Begin editing a field
  const startEditing = (field, value) => {
    setEditingField(field);
    setTempValue(value);
  };

  // Save the edited value
  const saveEdit = (field) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: tempValue
    }));
    setEditingField(null);
  };

  // Cancel editing and revert to original value
  const cancelEdit = () => {
    setEditingField(null);
  };

  // Handle key press events for input fields
  const handleKeyDown = (e, field) => {
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
