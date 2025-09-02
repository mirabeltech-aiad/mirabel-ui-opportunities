import { useState, useEffect } from "react";
import { getDefaultColumnOrder } from "@/features/Opportunity/utils/columnMapping";
import {
  calculateAllColumnWidths,
  mergeColumnWidths,
} from "@/utils/columnWidthUtils";

// Helper function to map API column config to table columns
// Dynamic-first approach: preserve PropertyMappingName/DBName exactly to support custom fields
const mapApiColumnConfigToTableColumns = (apiColumnConfig) => {
  if (!apiColumnConfig || !Array.isArray(apiColumnConfig)) {
    console.warn(
      "TableColumnManager: Invalid or missing API column config, using defaults"
    );
    return getDefaultColumnOrder();
  }

  const mappedColumns = apiColumnConfig.map((column) => {
    const rawProp =
      column.propertyMappingName ||
      column.propertyMapping ||
      column.PropertyMappingName ||
      "";
    const rawDb = column.dbName || column.DBName || "";

    // Prefer the explicit property mapping path when available; keep exact case for nested access
    const id = (rawProp || rawDb).trim();

    return {
      id,
      label:
        column.label ||
        column.displayName ||
        column.DisplayName ||
        rawProp ||
        rawDb,
      dbName: rawDb || undefined,
      propertyMappingName: rawProp || undefined,
      isDefault: column.isDefault ?? column.IsDefault,
      isRequired: column.isRequired ?? column.IsRequired,
    };
  });

  return mappedColumns;
};

export const useTableColumns = (
  apiColumnConfig = null,
  data = [],
  selectedViewId = -1
) => {
  const [columnOrder, setColumnOrder] = useState(() => {
    // If API column config is provided, use it; otherwise use default
    if (
      apiColumnConfig &&
      Array.isArray(apiColumnConfig) &&
      apiColumnConfig.length > 0
    ) {
      return mapApiColumnConfigToTableColumns(apiColumnConfig);
    }
    return getDefaultColumnOrder();
  });

  // When true, a manual column order has been applied (e.g., via selected view)
  // and should not be overridden by subsequent apiColumnConfig changes
  const [isManualColumnOrderActive, setIsManualColumnOrderActive] =
    useState(false);

  // Update column order when API config changes
  useEffect(() => {
    if (
      apiColumnConfig &&
      Array.isArray(apiColumnConfig) &&
      apiColumnConfig.length > 0
    ) {
      // Respect manual overrides triggered by a selected view in the sidebar
      if (isManualColumnOrderActive) {
        return;
      }
      const mappedColumns = mapApiColumnConfigToTableColumns(apiColumnConfig);
      setColumnOrder(mappedColumns);
    }
  }, [apiColumnConfig, isManualColumnOrderActive]);

  const [draggedColumn, setDraggedColumn] = useState(null);
  const [columnWidths, setColumnWidths] = useState({});
  const [initialWidthsCalculated, setInitialWidthsCalculated] = useState(false);

  // Add debugging for column order changes
  useEffect(() => {}, [columnOrder]);

  useEffect(() => {
    if (Object.keys(columnWidths).length > 0) {
      localStorage.setItem("tableColumnWidths", JSON.stringify(columnWidths));
    }
  }, [columnWidths]);

  // Calculate initial column widths based on data content
  useEffect(() => {
    if (columnOrder.length > 0 && data.length > 0 && !initialWidthsCalculated) {
      // Calculate optimal widths based on content
      const calculatedWidths = calculateAllColumnWidths(columnOrder, data);

      // Get saved widths from localStorage
      const savedWidthsString = localStorage.getItem("tableColumnWidths");
      let savedWidths = {};
      if (savedWidthsString) {
        try {
          savedWidths = JSON.parse(savedWidthsString);
        } catch (e) {
          console.error("Failed to parse saved column widths", e);
        }
      }

      // Merge calculated and saved widths (saved widths take precedence)
      const finalWidths = mergeColumnWidths(calculatedWidths, savedWidths);

      // Ensure minimum widths to prevent overlap (except for Status and Assigned Rep columns)
      Object.keys(finalWidths).forEach((columnId) => {
        if (columnId !== 'Status' && columnId !== 'AssignedTo' && columnId !== 'Probability' && columnId !== 'Amount' && finalWidths[columnId] < 150) {
          finalWidths[columnId] = 150;
        }
      });

      setColumnWidths(finalWidths);
      setInitialWidthsCalculated(true);
    }
  }, [columnOrder, data, initialWidthsCalculated]);

  // Load saved widths on mount (fallback for when no data is available)
  useEffect(() => {
    if (data.length === 0) {
      const savedWidths = localStorage.getItem("tableColumnWidths");
      if (savedWidths) {
        try {
          setColumnWidths(JSON.parse(savedWidths));
        } catch (e) {
          console.error("Failed to parse saved column widths", e);
        }
      }
    }
  }, [data]);

  const handleColumnResize = (columnId, width) => {
    setColumnWidths((prev) => ({
      ...prev,
      [columnId]: width,
    }));
  };

  const handleDragStart = (e, columnId) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", columnId);

    const dragElement = e.target.cloneNode(true);
    dragElement.style.backgroundColor = "#3b82f6";
    dragElement.style.color = "white";
    dragElement.style.opacity = "0.8";
    dragElement.style.transform = "rotate(3deg)";
    dragElement.style.position = "absolute";
    dragElement.style.top = "-1000px";
    document.body.appendChild(dragElement);
    e.dataTransfer.setDragImage(dragElement, 0, 0);

    setTimeout(() => document.body.removeChild(dragElement), 0);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedColumn && draggedColumn !== columnId) {
      const draggedIndex = columnOrder.findIndex(
        (col) => col.id === draggedColumn
      );
      const hoverIndex = columnOrder.findIndex((col) => col.id === columnId);

      if (draggedIndex === -1 || hoverIndex === -1) return;

      const newColumnOrder = [...columnOrder];
      const [removed] = newColumnOrder.splice(draggedIndex, 1);
      newColumnOrder.splice(hoverIndex, 0, removed);

      setColumnOrder(newColumnOrder);
    }
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  // Enhanced setColumnOrder with debugging and forced update
  const updateColumnOrder = (newColumnOrder) => {
    // Force the state update by creating a new array reference
    if (Array.isArray(newColumnOrder)) {
      const updatedColumns = [...newColumnOrder];
      setColumnOrder(updatedColumns);
      // Mark that manual order is active so API updates don't override it
      setIsManualColumnOrderActive(true);
    } else {
      console.error(
        "TableColumnManager: Invalid column order provided:",
        newColumnOrder
      );
    }
  };

  // Reset manual column order to allow API updates (used when views are selected)
  const resetToApiColumnOrder = () => {
    console.log("TableColumnManager: Resetting to API column order");
    setIsManualColumnOrderActive(false);
  };

  // When selected view changes, allow API-driven columns to update again
  useEffect(() => {
    // Reset manual flag when the selected view id changes
    setIsManualColumnOrderActive(false);
  }, [selectedViewId]);

  return {
    columnOrder,
    setColumnOrder: updateColumnOrder,
    resetToApiColumnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
