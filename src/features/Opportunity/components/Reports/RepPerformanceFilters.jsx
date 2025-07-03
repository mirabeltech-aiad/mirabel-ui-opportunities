
import React from 'react';
import { Card, CardContent } from '@OpportunityComponents/ui/card';
import { Button } from '@OpportunityComponents/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@OpportunityComponents/ui/select';
import { Input } from '@OpportunityComponents/ui/input';
import { Label } from '@OpportunityComponents/ui/label';
import { Calendar, Download, RefreshCw } from 'lucide-react';

const RepPerformanceFilters = ({ 
  filters, 
  onFiltersChange, 
  onExport, 
  onRefresh,
  availableReps 
}) => {
  const periodOptions = [
    { value: "this-quarter", label: "This Quarter" },
    { value: "last-quarter", label: "Last Quarter" },
    { value: "this-month", label: "This Month" },
    { value: "last-month", label: "Last Month" },
    { value: "last-30-days", label: "Last 30 Days" },
    { value: "last-60-days", label: "Last 60 Days" },
    { value: "last-90-days", label: "Last 90 Days" },
    { value: "last-3-months", label: "Last 3 Months" },
    { value: "last-6-months", label: "Last 6 Months" },
    { value: "last-12-months", label: "Last 12 Months" },
    { value: "ytd", label: "Year to Date" },
    { value: "last-year", label: "Last Year" },
    { value: "q1-2024", label: "Q1 2024" },
    { value: "q2-2024", label: "Q2 2024" },
    { value: "q3-2024", label: "Q3 2024" },
    { value: "q4-2024", label: "Q4 2024" },
    { value: "custom", label: "Custom Range" }
  ];

  const viewOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <Label htmlFor="period">Time Period</Label>
            <Select 
              value={filters.period} 
              onValueChange={(value) => onFiltersChange({ ...filters, period: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="view">View Type</Label>
            <Select 
              value={filters.view} 
              onValueChange={(value) => onFiltersChange({ ...filters, view: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                {viewOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="rep">Sales Rep</Label>
            <Select 
              value={filters.selectedRep} 
              onValueChange={(value) => onFiltersChange({ ...filters, selectedRep: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Reps" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reps</SelectItem>
                {availableReps.map(rep => (
                  <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filters.period === 'custom' && (
            <>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepPerformanceFilters;
