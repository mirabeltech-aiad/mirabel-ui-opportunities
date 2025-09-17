import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const DateRangeField = ({ 
  label, 
  fromKey, 
  toKey, 
  value = { from: '', to: '' }, 
  onChange, 
  placeholder = "Select date range" 
}) => {
  const [fromDate, setFromDate] = useState(value.from || '');
  const [toDate, setToDate] = useState(value.to || '');

  useEffect(() => {
    setFromDate(value.from || '');
    setToDate(value.to || '');
  }, [value]);

  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    
    // If To date exists and new From date is greater than To date, clear To date
    if (newFromDate && toDate && new Date(newFromDate) > new Date(toDate)) {
      setToDate('');
      onChange(toKey, '');
    }
    
    onChange(fromKey, newFromDate);
  };

  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    
    // Prevent selection if new To date is less than From date
    if (fromDate && newToDate && new Date(fromDate) > new Date(newToDate)) {
      return; // Don't update the value
    }
    
    setToDate(newToDate);
    onChange(toKey, newToDate);
  };

  const clearDates = () => {
    setFromDate('');
    setToDate('');
    onChange(fromKey, '');
    onChange(toKey, '');
  };

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <div className="relative">
            <input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="From date"
            />
            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-xs text-gray-500 mt-1 block">From</span>
        </div>
        
        <div className="flex-1">
          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="To date"
            />
            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-xs text-gray-500 mt-1 block">To</span>
        </div>
        
        {(fromDate || toDate) && (
          <button
            onClick={clearDates}
            className="px-2 py-2 text-gray-400 hover:text-gray-600 transition-colors self-end mb-1"
            title="Clear dates"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangeField;
