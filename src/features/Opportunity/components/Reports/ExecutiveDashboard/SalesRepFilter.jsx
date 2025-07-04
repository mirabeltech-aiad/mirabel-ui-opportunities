
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userService } from '@/features/Opportunity/Services/userService';

const SalesRepFilter = ({ selectedRep, onRepChange, selectedPeriod, compact = false }) => {
  const [salesReps, setSalesReps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        setIsLoading(true);
        const reps = await userService.getUsersForDropdown();
        setSalesReps(reps);
      } catch (error) {
        console.error('Failed to fetch sales reps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesReps();
  }, []);

  const repOptions = [
    { value: 'all', label: 'All Sales Reps' },
    ...salesReps.map(rep => ({
      value: rep.value,
      label: rep.display
    }))
  ];

  return (
    <Select value={selectedRep} onValueChange={onRepChange} disabled={isLoading}>
      <SelectTrigger className="w-48 bg-white border-gray-300">
        <SelectValue placeholder="All Sales Reps" />
      </SelectTrigger>
      <SelectContent>
        {repOptions.map(rep => (
          <SelectItem key={rep.value} value={rep.value}>
            {rep.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SalesRepFilter;
