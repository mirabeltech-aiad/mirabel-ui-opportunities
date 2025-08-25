
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronUp, ChevronDown } from "lucide-react";

const ProposalSortOptionsDropdown = ({ sortConfig, onSort, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(sortConfig?.key || '');
  const [selectedDirection, setSelectedDirection] = useState(sortConfig?.direction || 'ascending');

  console.log('ProposalSortOptionsDropdown: Rendering with props:', { sortConfig, onSort: !!onSort, childrenType: typeof children });
  console.log('ProposalSortOptionsDropdown: Current state:', { isOpen, selectedField, selectedDirection });

  const sortableFields = [
    { key: 'proposalName', label: 'Proposal Name' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'amount', label: 'Amount' },
    { key: 'stage', label: 'Stage' },
    { key: 'status', label: 'Status' },
    { key: 'assignedRep', label: 'Assigned Rep' },
    { key: 'createdDate', label: 'Created Date' },
    { key: 'projCloseDate', label: 'Projected Close Date' },
    { key: 'actualCloseDate', label: 'Actual Close Date' },
    { key: 'probability', label: 'Probability' },
    { key: 'source', label: 'Source' },
    { key: 'createdBy', label: 'Created By' }
  ];

  const handleApplySort = () => {
    console.log('ProposalSortOptionsDropdown: Applying sort -', selectedField, selectedDirection);
    if (selectedField && onSort) {
      onSort(selectedField, selectedDirection);
      setIsOpen(false);
    }
  };

  const handleClearSort = () => {
    console.log('ProposalSortOptionsDropdown: Clearing sort');
    if (onSort) {
      onSort(null, 'ascending');
      setSelectedField('');
      setSelectedDirection('ascending');
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open) => {
    console.log('ProposalSortOptionsDropdown: Open state changing to:', open);
    setIsOpen(open);
  };

  const handleTriggerClick = (e) => {
    console.log('ProposalSortOptionsDropdown: Trigger clicked, current isOpen:', isOpen);
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  // Update local state when sortConfig changes
  React.useEffect(() => {
    console.log('ProposalSortOptionsDropdown: useEffect triggered with sortConfig:', sortConfig);
    if (sortConfig?.key) {
      setSelectedField(sortConfig.key);
      setSelectedDirection(sortConfig.direction || 'ascending');
    }
  }, [sortConfig]);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div onClick={handleTriggerClick}>
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white border border-gray-200 shadow-lg z-50" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-900 mb-2">Sort Options</h4>
            <p className="text-xs text-gray-500">Choose a field and direction to sort the table</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Sort by field</label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select field to sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  {sortableFields.map((field) => (
                    <SelectItem key={field.key} value={field.key}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Sort direction</label>
              <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="ascending">
                    <div className="flex items-center gap-2">
                      <ChevronUp className="h-3 w-3" />
                      Ascending (A-Z, 1-9)
                    </div>
                  </SelectItem>
                  <SelectItem value="descending">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="h-3 w-3" />
                      Descending (Z-A, 9-1)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {sortConfig?.key && (
            <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
              Currently sorted by: <strong>{sortableFields.find(f => f.key === sortConfig.key)?.label}</strong> ({sortConfig.direction})
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleApplySort} 
              disabled={!selectedField}
              className="flex-1 h-8 text-xs"
            >
              Apply Sort
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClearSort}
              className="h-8 text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProposalSortOptionsDropdown;
