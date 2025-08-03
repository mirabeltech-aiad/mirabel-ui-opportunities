import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  value: any;
}

interface ConnectedFilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  isAllSelected: boolean;
  onSelectAll: () => void;
  placeholder?: string;
  className?: string;
}

const ConnectedFilterDropdown: React.FC<ConnectedFilterDropdownProps> = ({
  label,
  options,
  selectedValues,
  onSelectionChange,
  isAllSelected,
  onSelectAll,
  placeholder = "Select...",
  className = ""
}) => {
  const handleToggleOption = (optionId: string) => {
    const newSelected = selectedValues.includes(optionId)
      ? selectedValues.filter(id => id !== optionId)
      : [...selectedValues, optionId];
    
    onSelectionChange(newSelected);
  };

  const getDisplayText = () => {
    if (isAllSelected || selectedValues.length === 0) {
      return `All ${label}`;
    }
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.id === selectedValues[0]);
      return option?.label || placeholder;
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`h-9 px-3 border-0 rounded-none text-sm justify-between bg-white hover:bg-gray-50 ${className}`}
        >
          <span>{getDisplayText()}</span>
          <ChevronDown className="h-3 w-3 ml-1 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-56 bg-white border border-gray-200 shadow-lg z-50 max-h-80 overflow-y-auto"
      >
        <div className="p-2">
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id="select-all"
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              className="h-4 w-4"
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Select All {label}
            </label>
          </div>
          
          <DropdownMenuSeparator className="my-2" />
          
          <div className="space-y-1">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedValues.includes(option.id)}
                  onCheckedChange={() => handleToggleOption(option.id)}
                  className="h-4 w-4"
                />
                <label
                  htmlFor={option.id}
                  className="text-sm text-gray-700 cursor-pointer flex-1 truncate"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectedFilterDropdown;