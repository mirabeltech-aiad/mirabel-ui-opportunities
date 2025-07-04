
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';
import { userService } from '@/features/Opportunity/Services/userService';

const PipelineFilters = ({ 
  selectedPeriod, 
  setSelectedPeriod, 
  selectedRep, 
  setSelectedRep, 
  selectedStage, 
  setSelectedStage, 
  salesReps: propSalesReps, 
  stages 
}) => {
  const { getInteractiveButtonClass } = useDesignSystem();
  const [salesReps, setSalesReps] = useState([]);
  const [isLoadingSalesReps, setIsLoadingSalesReps] = useState(false);

  // Fetch sales reps from API
  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        setIsLoadingSalesReps(true);
        const reps = await userService.getUsersForDropdown();
        setSalesReps(reps.map(rep => rep.display));
      } catch (error) {
        console.error('Failed to fetch sales reps:', error);
        // Fallback to prop salesReps if API fails
        setSalesReps(propSalesReps || []);
      } finally {
        setIsLoadingSalesReps(false);
      }
    };

    fetchSalesReps();
  }, [propSalesReps]);

  return (
    <div className="flex gap-4 items-center bg-blue-50 p-4 rounded-lg border border-blue-200">
      <Filter className="h-4 w-4 text-blue-600" />
      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
        <SelectTrigger className="w-48 border-blue-300 text-blue-700">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="this-quarter">This Quarter</SelectItem>
          <SelectItem value="last-quarter">Last Quarter</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
          <SelectItem value="last-30-days">Last 30 Days</SelectItem>
          <SelectItem value="last-60-days">Last 60 Days</SelectItem>
          <SelectItem value="last-90-days">Last 90 Days</SelectItem>
          <SelectItem value="last-3-months">Last 3 Months</SelectItem>
          <SelectItem value="last-6-months">Last 6 Months</SelectItem>
          <SelectItem value="last-12-months">Last 12 Months</SelectItem>
          <SelectItem value="ytd">Year to Date</SelectItem>
          <SelectItem value="last-year">Last Year</SelectItem>
          <SelectItem value="q1-2024">Q1 2024</SelectItem>
          <SelectItem value="q2-2024">Q2 2024</SelectItem>
          <SelectItem value="q3-2024">Q3 2024</SelectItem>
          <SelectItem value="q4-2024">Q4 2024</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedRep} onValueChange={setSelectedRep} disabled={isLoadingSalesReps}>
        <SelectTrigger className="w-48 border-blue-300 text-blue-700">
          <SelectValue placeholder="All Sales Reps" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sales Reps</SelectItem>
          {salesReps.map(rep => (
            <SelectItem key={rep} value={rep}>{rep}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedStage} onValueChange={setSelectedStage}>
        <SelectTrigger className="w-48 border-blue-300 text-blue-700">
          <SelectValue placeholder="All Stages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          {stages.map(stage => (
            <SelectItem key={stage} value={stage}>{stage}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PipelineFilters;
