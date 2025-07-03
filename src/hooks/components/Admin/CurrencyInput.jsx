
import React from 'react';
import { Input } from "@OpportunityComponents/ui/input";

const CurrencyInput = ({ value, onChange, className, ...props }) => {
  const formatCurrency = (num) => {
    if (!num && num !== 0) return '';
    return num.toLocaleString();
  };

  const parseCurrency = (str) => {
    if (!str) return 0;
    // Remove commas and any non-numeric characters except decimal points
    const cleaned = str.toString().replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = parseCurrency(rawValue);
    onChange(numericValue);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
      <Input
        type="text"
        value={formatCurrency(value)}
        onChange={handleChange}
        className={`pl-7 ${className}`}
        {...props}
      />
    </div>
  );
};

export default CurrencyInput;
