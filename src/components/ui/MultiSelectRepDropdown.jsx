import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { userService } from '@/features/Opportunity/Services/userService';

const MultiSelectRepDropdown = ({ 
  value = [], 
  onValueChange, 
  placeholder = "Select Sales Reps",
  includeAllOption = false,
  allOptionLabel = "All Sales Reps",
  disabled = false,
  className = "",
  ...props 
}) => {
  const [salesReps, setSalesReps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const reps = await userService.getUsersForDropdown();
        setSalesReps(reps || []);
      } catch (err) {
        console.error('Failed to fetch sales reps:', err);
        setError(err.message);
        setSalesReps([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesReps();
  }, []);

  const repOptions = [
    ...(includeAllOption ? [{ value: 'all', label: allOptionLabel }] : []),
    ...salesReps.map(rep => ({
      value: rep.value || rep.id,
      label: rep.display || rep.label
    }))
  ];

  const selectedValues = Array.isArray(value) ? value : [];
  const isAllSelected = selectedValues.includes('all');

  const handleToggle = (optionValue, e) => {
    e?.stopPropagation();
    let newSelection;
    
    if (optionValue === 'all') {
      // If selecting "All", clear all other selections
      newSelection = isAllSelected ? [] : ['all'];
    } else {
      // If selecting a specific rep, remove "All" if present
      let updatedSelection = selectedValues.filter(v => v !== 'all');
      
      if (updatedSelection.includes(optionValue)) {
        updatedSelection = updatedSelection.filter(v => v !== optionValue);
      } else {
        updatedSelection = [...updatedSelection, optionValue];
      }
      
      newSelection = updatedSelection;
    }
    
    onValueChange(newSelection);
  };

  const getDisplayText = () => {
    if (isAllSelected) {
      return allOptionLabel;
    }
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      const selectedRep = repOptions.find(rep => rep.value === selectedValues[0]);
      return selectedRep?.label || selectedValues[0];
    }
    return `${selectedValues.length} reps selected`;
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onValueChange([]);
  };

  if (error) {
    console.warn('MultiSelectRepDropdown: Error loading reps, using fallback options');
    return (
      <Button variant="outline" disabled className={className} {...props}>
        Error loading reps
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={`justify-between ${className}`}
          disabled={disabled || isLoading}
          {...props}
        >
          <span className="truncate">
            {isLoading ? "Loading..." : getDisplayText()}
          </span>
          <div className="flex items-center gap-1">
            {selectedValues.length > 0 && (
              <X 
                className="h-4 w-4 text-gray-400 hover:text-gray-600" 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  clearSelection(e);
                }}
              />
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
        <div className="max-h-60 overflow-auto">
          {repOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={(e) => handleToggle(option.value, e)}
            >
              <Checkbox
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked, e) => {
                  e?.stopPropagation();
                  if (checked !== selectedValues.includes(option.value)) {
                    handleToggle(option.value, e);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm flex-1">{option.label}</span>
              {selectedValues.includes(option.value) && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </div>
          ))}
          {repOptions.length === 0 && !isLoading && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No sales reps found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectRepDropdown;