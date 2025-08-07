
import { useState } from "react";

export const useRowSelection = (proposals: any[]) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set<string>());
  const [selectAll, setSelectAll] = useState(false);

  const handleRowSelect = (id: string, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(id);
    } else {
      newSelectedRows.delete(id);
    }
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.size === proposals.length);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set<string>(proposals.map(p => p.id.toString())));
    } else {
      setSelectedRows(new Set<string>());
    }
    setSelectAll(checked);
  };

  return {
    selectedRows,
    setSelectedRows,
    selectAll,
    setSelectAll,
    handleRowSelect,
    handleSelectAll
  };
};
