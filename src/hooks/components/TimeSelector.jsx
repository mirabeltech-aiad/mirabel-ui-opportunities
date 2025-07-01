
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TimeSelector = ({ value, onChange, className = "" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Generate time options in 15-minute increments
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatDisplayTime(hour, minute);
        options.push({ value: timeString, display: displayTime });
      }
    }
    return options;
  };

  const formatDisplayTime = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  // Get current time as formatted string
  const getCurrentTimeString = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Get current time display with timestamp for dropdown
  const getCurrentTimeDisplay = () => {
    const timeString = formatDisplayTime(currentTime.getHours(), currentTime.getMinutes());
    return `Now - ${timeString}`;
  };

  // Convert "now" value to actual current time when needed
  const getActualTimeValue = (timeValue) => {
    if (timeValue === "now") {
      return getCurrentTimeString();
    }
    return timeValue;
  };

  const timeOptions = generateTimeOptions();

  // Determine display value - show just "Now" for now value, otherwise show regular time
  const getDisplayValue = () => {
    if (!value || value === "now") {
      return "Now";
    }
    
    // Find the matching option for regular time values
    const option = timeOptions.find(opt => opt.value === value);
    return option ? option.display : value;
  };

  const handleValueChange = (selectedValue) => {
    // Pass the actual value to the parent component
    const actualValue = getActualTimeValue(selectedValue);
    onChange(actualValue);
  };

  // Set the select value - use "now" as default when no value is provided
  const selectValue = value || "now";

  return (
    <Select value={selectValue} onValueChange={handleValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Now">
          {getDisplayValue()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-300 shadow-lg z-50 max-h-60">
        {/* Now option at the top */}
        <SelectItem key="now" value="now" className="text-xs hover:bg-gray-100 font-medium text-blue-600">
          {getCurrentTimeDisplay()}
        </SelectItem>
        
        {/* Regular time options */}
        {timeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-xs hover:bg-gray-100">
            {option.display}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeSelector;
