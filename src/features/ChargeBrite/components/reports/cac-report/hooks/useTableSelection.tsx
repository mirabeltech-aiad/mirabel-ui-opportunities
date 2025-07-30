
import { useState } from 'react';

export const useTableSelection = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleRowSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const isSelected = (id: string) => selectedRows.has(id);

  return {
    selectedRows,
    handleRowSelect,
    isSelected
  };
};
