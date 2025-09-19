import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FloatingLabelSearchInputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  error?: string | null;
  disabled?: boolean;
  className?: string;
}

export const FloatingLabelSearchInput: React.FC<FloatingLabelSearchInputProps> = ({
  id,
  label,
  value,
  onChange,
  onSearch,
  placeholder,
  error,
  disabled = false,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const shouldFloat = isFocused || hasValue;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={handleKeyPress}
          placeholder={shouldFloat ? placeholder : ''}
          disabled={disabled}
          className={`peer pt-6 pb-2 pr-10 ${error ? 'border-red-500 focus:border-red-500' : ''} ${
            disabled ? 'bg-gray-50 cursor-not-allowed' : ''
          }`}
        />
        
        <button
          type="button"
          onClick={onSearch}
          disabled={disabled || !value.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
      
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none ${
          shouldFloat
            ? 'top-1 text-xs text-gray-500'
            : 'top-1/2 -translate-y-1/2 text-gray-400'
        } ${error ? 'text-red-500' : ''} ${disabled ? 'text-gray-400' : ''}`}
      >
        {label}
      </label>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};