
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@OpportunityComponents/ui/select';
import { Filter } from 'lucide-react';

const SalesPerformanceFilters = ({ 
  dateRange, 
  setDateRange, 
  selectedRep, 
  setSelectedRep, 
  selectedStatus, 
  setSelectedStatus, 
  salesReps 
}) => {
  return (
    <div className="flex gap-4 items-center bg-blue-50 p-4 rounded-lg border border-blue-200">
      <Filter className="h-4 w-4 text-blue-600" />
      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="w-48 border-blue-300 text-blue-700">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="this-quarter">This Quarter</SelectItem>
          <SelectItem value="last-quarter">Last Quarter</SelectItem>
          <SelectItem value="last-3-months">Last 3 Months</SelectItem>
          <SelectItem value="last-6-months">Last 6 Months</SelectItem>
          <SelectItem value="last-12-months">Last 12 Months</SelectItem>
          <SelectItem value="ytd">Year to Date</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedRep} onValueChange={setSelectedRep}>
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

      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-48 border-blue-300 text-blue-700">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Won">Won</SelectItem>
          <SelectItem value="Open">Open</SelectItem>
          <SelectItem value="Lost">Lost</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SalesPerformanceFilters;
