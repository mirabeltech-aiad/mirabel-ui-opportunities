
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronUp, ChevronDown } from "lucide-react";

const SortOptionsDropdown = ({ sortConfig, onSort, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('ascending');

  // Sync local state with sortConfig prop
  useEffect(() => {
    if (sortConfig?.key) {
      setSelectedField(sortConfig.key);
      setSelectedDirection(sortConfig.direction || 'ascending');
    } else {
      setSelectedField('');
      setSelectedDirection('ascending');
    }
  }, [sortConfig]);

  const sortableFields = [
    { key: 'opportunityName', label: 'Opportunity Name' },
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
    if (selectedField && onSort) {
      console.log('SortOptionsDropdown: Applying sort -', selectedField, selectedDirection);
      onSort(selectedField, selectedDirection);
      setIsOpen(false);
    }
  };

  const handleClearSort = () => {
    console.log('SortOptionsDropdown: Clearing sort');
    if (onSort) {
      onSort(null, 'ascending');
    }
    setSelectedField('');
    setSelectedDirection('ascending');
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white border border-gray-200 shadow-lg" align="end">
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
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
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
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
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

export default SortOptionsDropdown;
