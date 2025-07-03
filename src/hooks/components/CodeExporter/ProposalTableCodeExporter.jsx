
import React, { useState } from 'react';
import { Button } from '@OpportunityComponents/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { Copy, Check, Download } from 'lucide-react';
import { ScrollArea } from '@OpportunityComponents/ui/scroll-area';

const ProposalTableCodeExporter = () => {
  const [copied, setCopied] = useState(false);

  const codeSnippet = `// ============================================
// COMPREHENSIVE PROPOSALS TABLE CODE EXPORT
// ============================================
// This snippet contains all components, styles, and functionality
// needed to recreate the complete proposals table system including
// the full side panel for column management and view customization

// ============================================
// 1. MAIN TABLE COMPONENTS
// ============================================

// ProposalTableContent.jsx
import { Table, TableBody } from "@OpportunityComponents/ui/table";
import { ScrollArea } from "@OpportunityComponents/ui/scroll-area";
import ProposalTableHeader from "./ProposalTableHeader";
import ProposalTableRow from "./ProposalTableRow";
import InfiniteScrollLoader from "../table/InfiniteScrollLoader";

const ProposalTableContent = ({
  columnOrder,
  sortConfig,
  requestSort,
  draggedColumn,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  selectAll,
  onSelectAll,
  columnWidths,
  onColumnResize,
  displayedItems,
  selectedRows,
  handleRowSelect,
  isLoading,
  observerRef,
  onCompanySelect,
  selectedCompany
}) => {
  return (
    <div className="relative">
      <ScrollArea className="h-[600px] w-full">
        <div className="min-w-full overflow-auto">
          <Table className="w-full min-w-[1200px]">
            <ProposalTableHeader 
              columnOrder={columnOrder}
              sortConfig={sortConfig}
              requestSort={requestSort}
              draggedColumn={draggedColumn}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragEnd={handleDragEnd}
              selectAll={selectAll}
              onSelectAll={onSelectAll}
              columnWidths={columnWidths}
              onColumnResize={onColumnResize}
            />
            <TableBody>
              {displayedItems.map((proposal) => (
                <ProposalTableRow 
                  key={proposal.id} 
                  proposal={proposal}
                  isSelected={selectedRows.has(proposal.id)}
                  onSelect={(checked) => handleRowSelect(proposal.id, checked)}
                  columnOrder={columnOrder}
                  columnWidths={columnWidths}
                  onCompanySelect={onCompanySelect}
                  selectedCompany={selectedCompany}
                />
              ))}
              {isLoading && <InfiniteScrollLoader columnCount={columnOrder.length} />}
              <tr ref={observerRef}>
                <td colSpan={columnOrder.length} className="h-4 w-full" style={{ backgroundColor: 'transparent' }} />
              </tr>
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

// ProposalTableHeader.jsx
import React from "react";
import { TableHead, TableHeader, TableRow } from "@OpportunityComponents/ui/table";
import { Checkbox } from "@OpportunityComponents/ui/checkbox";

const ProposalTableHeader = ({ 
  columnOrder, 
  sortConfig, 
  requestSort, 
  draggedColumn, 
  handleDragStart, 
  handleDragOver, 
  handleDragEnd,
  selectAll,
  onSelectAll,
  columnWidths,
  onColumnResize
}) => {
  const startResizing = (e, columnId) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.pageX;
    const currentWidth = columnWidths[columnId] || 150;
    
    const handleMouseMove = (moveEvent) => {
      const width = Math.max(80, currentWidth + (moveEvent.pageX - startX));
      onColumnResize(columnId, width);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  return (
    <TableHeader>
      <TableRow className="bg-gray-50">
        <TableHead className="w-8">
          <Checkbox 
            checked={selectAll}
            onCheckedChange={onSelectAll}
          />
        </TableHead>
        <TableHead className="w-8"></TableHead>
        {columnOrder.map((column) => (
          <TableHead
            key={column.id}
            className="relative cursor-pointer hover:bg-gray-100 font-medium text-gray-700 select-none"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, column.id)}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragEnd={handleDragEnd}
            style={{
              width: columnWidths[column.id] ? \`\${columnWidths[column.id]}px\` : undefined,
              minWidth: '80px'
            }}
          >
            <div 
              className="flex items-center gap-1 flex-1"
              onClick={() => requestSort(column.id)}
            >
              {column.label}
              {sortConfig.key === column.id && (
                <span className="text-xs">
                  {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                </span>
              )}
            </div>
            <div 
              className="absolute right-0 top-0 h-full w-4 cursor-col-resize group"
              onMouseDown={(e) => startResizing(e, column.id)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full w-1 bg-gray-300 opacity-0 group-hover:opacity-100 mx-auto"></div>
            </div>
            {draggedColumn === column.id && (
              <div className="absolute inset-0 bg-blue-100 opacity-30 border-2 border-blue-400 rounded pointer-events-none"></div>
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

// ProposalTableRow.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { TableRow, TableCell } from "@OpportunityComponents/ui/table";
import { Checkbox } from "@OpportunityComponents/ui/checkbox";
import { Pencil } from "lucide-react";
import TableStatusBadge from "../table/TableStatusBadge";
import TableStageBadge from "../table/TableStageBadge";

const ProposalTableRow = ({ proposal, isSelected, onSelect, columnOrder, columnWidths, onCompanySelect, selectedCompany }) => {
  const navigate = useNavigate();
  
  if (!proposal) return null;

  const handleEditClick = () => {
    navigate(\`/edit-proposal/\${proposal.id}\`);
  };

  const handleCompanyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onCompanySelect?.(proposal.company);
  };

  const getRepColor = (repName) => {
    if (!repName) return "bg-gray-500";
    
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
      "bg-orange-500", "bg-cyan-500", "bg-lime-500", "bg-rose-500"
    ];
    
    const colorIndex = repName.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const renderCellContent = (columnId) => {
    switch (columnId) {
      case 'status':
        return <TableStatusBadge status={proposal.status} />;
      case 'name':
        return <span className="font-medium text-blue-600 hover:underline cursor-pointer">{proposal.name}</span>;
      case 'company':
        return (
          <span 
            className={\`cursor-pointer hover:text-blue-600 \${selectedCompany === proposal.company ? 'font-bold text-blue-600' : ''}\`}
            onClick={handleCompanyClick}
          >
            {proposal.company}
          </span>
        );
      case 'assignedRep':
        return (
          <div className="flex items-center gap-2">
            <div className={\`w-6 h-6 \${getRepColor(proposal.assignedRep)} rounded-full flex items-center justify-center text-white text-xs font-medium\`}>
              {proposal.assignedRep?.substring(0, 2)?.toUpperCase() || 'CK'}
            </div>
          </div>
        );
      case 'stage':
        return <TableStageBadge stage={proposal.stage} />;
      case 'amount':
        return <span className="font-medium">{typeof proposal.amount === 'number' ? \`$\${proposal.amount.toLocaleString()}.00\` : proposal.amount}</span>;
      default:
        return proposal[columnId] || '';
    }
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="w-8">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      <TableCell className="w-8">
        <button onClick={handleEditClick} className="hover:bg-gray-100 p-1 rounded">
          <Pencil className="h-4 w-4 text-yellow-500 hover:text-yellow-600" />
        </button>
      </TableCell>
      {columnOrder.map((column) => (
        <TableCell 
          key={column.id} 
          className="min-w-[80px] truncate"
          style={{
            width: columnWidths[column.id] ? \`\${columnWidths[column.id]}px\` : undefined,
            maxWidth: columnWidths[column.id] ? \`\${columnWidths[column.id]}px\` : undefined
          }}
        >
          {renderCellContent(column.id)}
        </TableCell>
      ))}
    </TableRow>
  );
};

// ============================================
// 2. VIEWS SIDEBAR & COLUMN MANAGEMENT
// ============================================

// ViewsSidebar.jsx
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@OpportunityComponents/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@OpportunityComponents/ui/tabs";
import SavedViewsTab from "./SavedViewsTab";
import AddViewTab from "./AddViewTab";

const ViewsSidebar = ({ isOpen, onClose, columnOrder, onColumnOrderChange }) => {
  const [activeViewId, setActiveViewId] = useState(null);
  const [savedViews, setSavedViews] = useState([
    {
      id: 1,
      name: "Proposal Overview",
      columns: ["status", "name", "company", "assignedRep", "stage", "amount"]
    },
    {
      id: 2,
      name: "Financial Analysis",
      columns: ["name", "company", "amount", "stage", "projCloseDate", "actualCloseDate"]
    },
    {
      id: 3,
      name: "Pipeline Tracking",
      columns: ["status", "name", "company", "stage", "assignedRep", "amount", "projCloseDate"]
    }
  ]);

  const handleSaveView = (viewName, selectedColumns) => {
    const newView = {
      id: Date.now(),
      name: viewName,
      columns: selectedColumns
    };
    setSavedViews([...savedViews, newView]);
  };

  const handleLoadView = (view) => {
    setActiveViewId(view.id);
    
    const allColumns = [
      { id: 'status', label: 'Status' },
      { id: 'name', label: 'Proposal Name' },
      { id: 'company', label: 'Company Name' },
      { id: 'createdDate', label: 'Created Date' },
      { id: 'assignedRep', label: 'Assigned Rep' },
      { id: 'stage', label: 'Stage' },
      { id: 'amount', label: 'Amount' },
      { id: 'projCloseDate', label: 'Proj Close Date' }
    ];
    
    const newColumnOrder = view.columns.map(columnId => 
      allColumns.find(col => col.id === columnId)
    ).filter(Boolean);
    
    onColumnOrderChange(newColumnOrder);
    onClose();
  };

  const handleDeleteView = (viewId) => {
    setSavedViews(savedViews.filter(view => view.id !== viewId));
    if (activeViewId === viewId) {
      setActiveViewId(null);
    }
  };

  const handleUpdateView = (viewId, newName) => {
    setSavedViews(savedViews.map(view => 
      view.id === viewId ? { ...view, name: newName } : view
    ));
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-white/30 backdrop-blur-[0.5px] z-40 pointer-events-none"
          style={{ backdropFilter: 'blur(0.5px)' }}
        />
      )}
      
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-1/2 min-w-[600px] max-w-[900px] z-50">
          <SheetHeader>
            <SheetTitle className="text-blue-600">Views</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6">
            <Tabs defaultValue="saved" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-blue-50 border-blue-200">
                <TabsTrigger value="saved" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">SAVED VIEWS</TabsTrigger>
                <TabsTrigger value="add" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">ADD VIEW</TabsTrigger>
              </TabsList>
              
              <TabsContent value="saved" className="mt-4">
                <SavedViewsTab 
                  savedViews={savedViews}
                  onLoadView={handleLoadView}
                  onDeleteView={handleDeleteView}
                  onUpdateView={handleUpdateView}
                  activeViewId={activeViewId}
                />
              </TabsContent>
              
              <TabsContent value="add" className="mt-4">
                <AddViewTab 
                  columnOrder={columnOrder}
                  onSaveView={handleSaveView}
                />
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

// SavedViewsTab.jsx
import React, { useState } from "react";
import { Button } from "@OpportunityComponents/ui/button";
import { Input } from "@OpportunityComponents/ui/input";
import { Separator } from "@OpportunityComponents/ui/separator";
import { Pencil, Trash, Check, X, Save } from "lucide-react";

const SavedViewsTab = ({ savedViews, onLoadView, onDeleteView, onUpdateView, activeViewId }) => {
  const [editingViewId, setEditingViewId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const globalViews = savedViews.filter(view => 
    ["Proposal Overview", "Financial Analysis"].includes(view.name)
  );
  
  const myViews = savedViews.filter(view => 
    !["Proposal Overview", "Financial Analysis"].includes(view.name)
  );

  const getViewColor = (viewName) => {
    const colorMap = {
      "Proposal Overview": "#6b7280",
      "Financial Analysis": "#3b82f6", 
      "Pipeline Tracking": "#10b981"
    };
    return colorMap[viewName] || "#6b7280";
  };

  const isTemplate = (viewName) => {
    return ["Proposal Overview", "Financial Analysis"].includes(viewName);
  };

  const handleEditStart = (view) => {
    setEditingViewId(view.id);
    setEditingName(view.name);
  };

  const handleEditSave = (viewId) => {
    if (editingName.trim() && onUpdateView) {
      onUpdateView(viewId, editingName.trim());
    }
    setEditingViewId(null);
    setEditingName("");
  };

  const handleEditCancel = () => {
    setEditingViewId(null);
    setEditingName("");
  };

  const ViewItem = ({ view, showActions = true }) => (
    <div className={\`flex items-center justify-between py-2 px-3 hover:bg-gray-50 group rounded-md transition-colors \${
      activeViewId === view.id ? 'bg-blue-50 border border-blue-200' : ''
    }\`}>
      <div className="flex items-center gap-2 flex-1">
        <div 
          className="w-3 h-3 rounded-full border border-gray-200"
          style={{ backgroundColor: getViewColor(view.name) }}
        />
        {editingViewId === view.id ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="h-6 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditSave(view.id);
                if (e.key === 'Escape') handleEditCancel();
              }}
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-green-500 hover:text-green-700"
              onClick={() => handleEditSave(view.id)}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-500 hover:text-gray-700"
              onClick={handleEditCancel}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <>
            <div 
              className={\`text-sm cursor-pointer hover:text-blue-600 font-medium transition-colors \${
                activeViewId === view.id ? 'text-blue-600' : 'text-gray-700'
              }\`}
              onClick={() => onLoadView(view)}
            >
              {view.name}
            </div>
            {isTemplate(view.name) && (
              <Save className="h-3 w-3 text-blue-500" title="Template view" />
            )}
            {activeViewId === view.id && (
              <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                Active
              </span>
            )}
            <span className="text-xs text-gray-400">({view.columns.length} cols)</span>
          </>
        )}
      </div>
      
      {showActions && editingViewId !== view.id && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-yellow-500 hover:text-yellow-700"
            onClick={() => handleEditStart(view)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-red-500 hover:text-red-700"
            onClick={() => onDeleteView(view.id)}
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium text-gray-900 mb-2 px-3">
          Global Views
        </div>
        <div className="space-y-1">
          {globalViews.map((view) => (
            <ViewItem key={view.id} view={view} showActions={!isTemplate(view.name)} />
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <div className="text-sm font-medium text-gray-900 mb-2 px-3">
          My Views
        </div>
        <div className="space-y-1">
          {myViews.map((view) => (
            <ViewItem key={view.id} view={view} />
          ))}
        </div>
      </div>
    </div>
  );
};

// AddViewTab.jsx
import React, { useState, useMemo } from "react";
import { Button } from "@OpportunityComponents/ui/button";
import { Input } from "@OpportunityComponents/ui/input";
import { Label } from "@OpportunityComponents/ui/label";
import { Checkbox } from "@OpportunityComponents/ui/checkbox";
import { Info, X, CheckCircle2, Plus } from "lucide-react";
import ColumnSelector from "./ColumnSelector";

const AddViewTab = ({ columnOrder, onSaveView }) => {
  const [viewName, setViewName] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [isPublicView, setIsPublicView] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const selectedColumnsWithLabels = useMemo(() => {
    return selectedColumns.map(columnId => 
      columnOrder.find(col => col.id === columnId)
    ).filter(Boolean);
  }, [selectedColumns, columnOrder]);

  const handleColumnToggle = (columnId) => {
    setSelectedColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSave = () => {
    if (viewName.trim() && selectedColumns.length > 0) {
      onSaveView(viewName.trim(), selectedColumns);
      setViewName("");
      setSelectedColumns([]);
    }
  };

  return (
    <div className="space-y-4">
      {showInstructions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
          <button
            onClick={() => setShowInstructions(false)}
            className="absolute top-3 right-3 text-blue-600 hover:text-blue-800"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-start gap-3 pr-8">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-3">
              <h4 className="font-medium text-blue-900">How to Create a Custom View</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Enter a descriptive name for your view</li>
                <li>2. Use the column selector below to choose columns</li>
                <li>3. Browse by category to find specific fields</li>
                <li>4. Click Save to create your custom view</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Save with Selected Columns</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="publicView"
              checked={isPublicView}
              onCheckedChange={setIsPublicView}
            />
            <Label htmlFor="publicView" className="text-sm">Public View</Label>
          </div>
        </div>
        
        <Input
          placeholder="Enter view name"
          value={viewName}
          onChange={(e) => setViewName(e.target.value)}
        />
        
        <Button
          onClick={handleSave}
          disabled={!viewName.trim() || selectedColumns.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Save View ({selectedColumns.length} columns selected)
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">
          {selectedColumns.length} of {columnOrder.length} columns selected
        </span>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-blue-700">Selected Columns</Label>
        <div className="min-h-[120px] max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg p-2 bg-white">
          {selectedColumnsWithLabels.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5">
              {selectedColumnsWithLabels.map((column, index) => (
                <div
                  key={column.id}
                  className="flex items-center justify-between p-1.5 bg-blue-50 border border-blue-200 rounded cursor-pointer hover:bg-blue-100"
                  onClick={() => handleColumnToggle(column.id)}
                >
                  <span className="text-xs font-medium text-blue-900 flex-1">
                    {index + 1}. {column.label}
                  </span>
                  <X className="h-3 w-3 text-blue-600" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No columns selected</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ColumnSelector
        columnOrder={columnOrder}
        selectedColumns={selectedColumns}
        onColumnToggle={handleColumnToggle}
      />
    </div>
  );
};

// ColumnSelector.jsx
import React, { useState, useMemo } from "react";
import { Label } from "@OpportunityComponents/ui/label";
import { Badge } from "@OpportunityComponents/ui/badge";
import { Filter, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@OpportunityComponents/ui/tabs";

const ColumnSelector = ({ columnOrder, selectedColumns, onColumnToggle }) => {
  const [activeCategory, setActiveCategory] = useState("standard");

  const columnCategories = useMemo(() => {
    const categories = {
      standard: {
        label: "Standard Fields",
        columns: ["status", "name", "company", "createdDate", "assignedRep", "amount", "projCloseDate"]
      },
      stages: {
        label: "Process Stages",
        columns: ["stage"]
      },
      dates: {
        label: "Date Fields",
        columns: ["createdDate", "projCloseDate", "actualCloseDate"]
      },
      other: {
        label: "Other Fields",
        columns: ["source", "leadSource", "leadType", "createdBy"]
      }
    };

    return categories;
  }, []);

  const availableColumns = useMemo(() => {
    let columns = columnOrder.filter(column => !selectedColumns.includes(column.id));
    const categoryColumns = columnCategories[activeCategory]?.columns || [];
    columns = columns.filter(column => categoryColumns.includes(column.id));
    return columns;
  }, [columnOrder, selectedColumns, activeCategory, columnCategories]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-blue-700">Available Columns</Label>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          {availableColumns.length} available
        </Badge>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-blue-50 border-blue-200">
          {Object.entries(columnCategories).map(([key, category]) => (
            <TabsTrigger 
              key={key} 
              value={key} 
              className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-4">
          <div className="grid grid-cols-3 gap-1.5 max-h-[300px] overflow-y-auto border border-gray-200 rounded-lg p-2 bg-white">
            {availableColumns.map((column) => (
              <div
                key={column.id}
                className="flex items-center space-x-1.5 p-1.5 bg-white border border-gray-200 rounded cursor-pointer hover:bg-blue-50 hover:border-blue-200"
                onClick={() => onColumnToggle(column.id)}
              >
                <Plus className="h-3 w-3 text-blue-600 flex-shrink-0" />
                <Label className="text-xs cursor-pointer flex-1 text-gray-700">
                  {column.label}
                </Label>
              </div>
            ))}
          </div>

          {availableColumns.length === 0 && (
            <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg bg-white">
              <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No available columns found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ============================================
// 3. FILTER CONTROLS & SORT OPTIONS
// ============================================

// ProposalTableFilterControls.jsx
import { Button } from "@OpportunityComponents/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@OpportunityComponents/ui/tooltip";
import { ChevronLeft, ChevronRight, Settings, RefreshCw, Search, LayoutGrid, List, Kanban, PanelRight } from "lucide-react";

const ProposalTableFilterControls = ({ filters, onFilterChange, totalItems, view, onViewChange, onViewsClick, onRefresh }) => {
  return (
    <TooltipProvider>
      <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="border border-gray-300 rounded-md overflow-hidden flex">
            <select className="bg-white p-2 text-sm border-r border-gray-300 outline-none" value={filters?.status || "All Proposals"}>
              <option>All Proposals</option>
              <option>Open Proposals</option>
              <option>Won Proposals</option>
              <option>Lost Proposals</option>
            </select>
            <select className="bg-white p-2 text-sm border-r border-gray-300 outline-none" value={filters?.probability || "All Probability"}>
              <option>All Probability</option>
              <option>High Probability</option>
              <option>Medium Probability</option>
              <option>Low Probability</option>
            </select>
            <select className="bg-white p-2 text-sm outline-none" value={filters?.assignedRep || "Karp, Courtney"}>
              <option>Karp, Courtney</option>
              <option>All Agents</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            1-{totalItems} of {totalItems}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={onViewsClick}
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center border border-gray-200 rounded-md">
            <Button variant={view === 'table' ? 'default' : 'ghost'} size="icon" onClick={() => onViewChange('table')} className="h-7 w-7 rounded-none">
              <List className="h-4 w-4" />
            </Button>
            <Button variant={view === 'cards' ? 'default' : 'ghost'} size="icon" onClick={() => onViewChange('cards')} className="h-7 w-7 rounded-none">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={view === 'kanban' ? 'default' : 'ghost'} size="icon" onClick={() => onViewChange('kanban')} className="h-7 w-7 rounded-none">
              <Kanban className="h-4 w-4" />
            </Button>
            <Button variant={view === 'split' ? 'default' : 'ghost'} size="icon" onClick={() => onViewChange('split')} className="h-7 w-7 rounded-none">
              <PanelRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

// ============================================
// 4. COLUMN MANAGEMENT HOOKS
// ============================================

// ProposalTableColumnManager.jsx
import { useState, useEffect } from 'react';

export const useProposalTableColumns = () => {
  const [columnOrder, setColumnOrder] = useState([
    { id: 'status', label: 'Status' },
    { id: 'name', label: 'Proposal Name' },
    { id: 'company', label: 'Company Name' },
    { id: 'createdDate', label: 'Created Date' },
    { id: 'assignedRep', label: 'Assigned Rep' },
    { id: 'stage', label: 'Stage' },
    { id: 'amount', label: 'Amount' },
    { id: 'projCloseDate', label: 'Proj Close Date' }
  ]);
  
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [columnWidths, setColumnWidths] = useState({});

  const handleColumnResize = (columnId, width) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: width
    }));
  };

  const handleDragStart = (e, columnId) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', columnId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedColumn && draggedColumn !== columnId) {
      const draggedIndex = columnOrder.findIndex(col => col.id === draggedColumn);
      const hoverIndex = columnOrder.findIndex(col => col.id === columnId);
      
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

  return {
    columnOrder,
    setColumnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
};

// ============================================
// 5. UI COMPONENTS & BADGES
// ============================================

// TableStatusBadge.jsx
import { Badge } from "@OpportunityComponents/ui/badge";

const TableStatusBadge = ({ status }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'accepted':
        return 'default';
      case 'under review':
      case 'submitted':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'draft':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
};

// TableStageBadge.jsx
import { Badge } from "@OpportunityComponents/ui/badge";

const TableStageBadge = ({ stage }) => {
  const getStageVariant = (stage) => {
    if (stage?.includes("Closed Won")) return 'default';
    if (stage?.includes("Closed Lost")) return 'destructive';
    if (stage?.includes("Proposal")) return 'secondary';
    if (stage?.includes("Negotiation")) return 'outline';
    return 'secondary';
  };

  return <Badge variant={getStageVariant(stage)}>{stage}</Badge>;
};

// InfiniteScrollLoader.jsx
import { Skeleton } from "@OpportunityComponents/ui/skeleton";
import { TableRow, TableCell } from "@OpportunityComponents/ui/table";

const InfiniteScrollLoader = ({ columnCount = 14 }) => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={\`skeleton-\${index}\`} className="hover:bg-transparent">
          {Array.from({ length: columnCount }).map((_, cellIndex) => (
            <TableCell key={cellIndex} className="py-2.5 px-4">
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

// TableActionsPanel.jsx
import { Button } from "@OpportunityComponents/ui/button";
import { Download, Mail, Printer, Archive, Edit } from "lucide-react";

const TableActionsPanel = ({ selectedCount, onExport, onBatchUpdate, onSendEmail }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-900">
            {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onExport} className="text-blue-600 border-blue-300 hover:bg-blue-100">
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={onBatchUpdate} className="text-blue-600 border-blue-300 hover:bg-blue-100">
            <Edit className="h-3 w-3 mr-1" />
            Batch Update
          </Button>
          <Button variant="outline" size="sm" onClick={onSendEmail} className="text-blue-600 border-blue-300 hover:bg-blue-100">
            <Mail className="h-3 w-3 mr-1" />
            Email
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 6. MAIN PROPOSALS TABLE COMPONENT
// ============================================

// ProposalsTable.jsx
import { useState } from "react";
import ProposalTableFilterControls from "./proposal/ProposalTableFilterControls";
import ProposalTableContent from "./proposal/ProposalTableContent";
import TableActionsPanel from "./table/TableActionsPanel";
import ViewsSidebar from "./views/ViewsSidebar";
import { useProposalTableColumns } from "./proposal/ProposalTableColumnManager";

const ProposalsTable = ({ proposals, view, onViewChange, onCompanySelect, selectedCompany, filters, onFilterChange, onRefresh }) => {
  const [isViewsSidebarOpen, setIsViewsSidebarOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  
  const {
    columnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    setColumnOrder
  } = useProposalTableColumns();

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        <ProposalTableFilterControls 
          filters={filters}
          onFilterChange={onFilterChange}
          totalItems={proposals.length}
          view={view}
          onViewChange={onViewChange}
          onViewsClick={() => setIsViewsSidebarOpen(true)}
          onRefresh={onRefresh}
        />
        
        {selectedRows.size > 0 && (
          <div className="px-4 pt-4">
            <TableActionsPanel selectedCount={selectedRows.size} />
          </div>
        )}
        
        <ProposalTableContent
          columnOrder={columnOrder}
          draggedColumn={draggedColumn}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragEnd={handleDragEnd}
          columnWidths={columnWidths}
          onColumnResize={handleColumnResize}
          displayedItems={proposals}
          selectedRows={selectedRows}
          onCompanySelect={onCompanySelect}
          selectedCompany={selectedCompany}
        />
      </div>

      <ViewsSidebar
        isOpen={isViewsSidebarOpen}
        onClose={() => setIsViewsSidebarOpen(false)}
        columnOrder={columnOrder}
        onColumnOrderChange={setColumnOrder}
      />
    </>
  );
};

// ============================================
// 7. REQUIRED STYLES & CONFIGURATIONS
// ============================================

/*
KEY TAILWIND CLASSES USED:
- Table Layout: w-full, min-w-[1200px], overflow-auto
- Responsive Design: sm:, md:, lg: breakpoints
- Colors: bg-gray-50, text-gray-700, text-blue-600, border-gray-200
- Interactive States: hover:bg-gray-100, hover:text-blue-600, cursor-pointer
- Spacing: p-4, px-4, py-2, gap-2, gap-4
- Borders: border, border-gray-200, rounded-md, rounded-lg
- Flex Layout: flex, items-center, justify-between, flex-wrap
- Typography: text-sm, text-xs, font-medium, font-semibold
- Shadow: shadow-sm, shadow-lg
- Z-index: z-10, z-50 for dropdowns and modals
*/

// COLUMN CONFIGURATIONS:
const defaultColumnOrder = [
  { id: 'status', label: 'Status' },
  { id: 'name', label: 'Proposal Name' },
  { id: 'company', label: 'Company Name' },
  { id: 'createdDate', label: 'Created Date' },
  { id: 'assignedRep', label: 'Assigned Rep' },
  { id: 'stage', label: 'Stage' },
  { id: 'amount', label: 'Amount' },
  { id: 'projCloseDate', label: 'Proj Close Date' }
];

// USAGE INSTRUCTIONS:
/*
1. Import all required dependencies from shadcn/ui and lucide-react
2. Ensure proper table data structure with required fields
3. Implement drag & drop functionality for column reordering
4. Add infinite scroll for large datasets
5. Customize colors and styling as needed
6. Connect to your data source and API endpoints
7. Add proper TypeScript types for better development experience

REQUIRED PROPS STRUCTURE:
- proposals: Array of proposal objects
- view: String ('table', 'cards', 'kanban', 'split')
- onViewChange: Function to handle view changes
- filters: Object with current filter values
- onFilterChange: Function to handle filter updates
- selectedCompany: String for highlighted company
- onCompanySelect: Function to handle company selection

SIDE PANEL FEATURES:
- ViewsSidebar: Main container for column management
- SavedViewsTab: Manage and load saved column configurations
- AddViewTab: Create new custom views with selected columns
- ColumnSelector: Interactive column selection with categories
- Drag & drop column reordering
- Persistent view configurations
- Template views for common use cases
*/

export default ProposalsTable;`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([codeSnippet], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proposals-table-complete-with-sidebar.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">
            Proposals Table - Complete Code Export with Side Panel
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              className="flex items-center gap-2"
              variant={copied ? "default" : "outline"}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Code
                </>
              )}
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Complete, self-contained code for the proposals table system including all components, the full side panel for column management, views sidebar, and all functionality.
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <code>{codeSnippet}</code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProposalTableCodeExporter;
