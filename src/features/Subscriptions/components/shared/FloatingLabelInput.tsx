
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { componentTokens } from '@/styles/designTokens';
import HelpTooltip from './HelpTooltip';

interface FloatingLabelInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  isTextarea?: boolean;
  rows?: number;
  helpId?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  className = '',
  isTextarea = false,
  rows = 4,
  helpId
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue || type === 'date';

  const inputClasses = cn(
    "w-full px-3 bg-white border-2 border-gray-200 rounded-md focus:border-ocean-500 focus:outline-none transition-all duration-200 peer text-gray-900",
    isTextarea 
      ? "pt-6 pb-2 resize-none" 
      : "h-12 pt-6 pb-1", // 48px height (h-12)
    type === 'date' && "text-gray-900", // Ensure date text is visible
    className
  );

  const labelClasses = cn(
    "absolute left-3 text-gray-500 transition-all duration-200 pointer-events-none flex items-center",
    isFloating
      ? "top-1 text-xs text-ocean-600 font-medium"
      : isTextarea 
        ? "top-4 text-base"
        : "top-3 text-base" // Centered in 48px field
  );

  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className="relative">
      <InputComponent
        type={isTextarea ? undefined : type}
        rows={isTextarea ? rows : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused && type !== 'date' ? placeholder : ''}
        required={required}
        className={inputClasses}
      />
      <label className={labelClasses}>
        <span>
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {helpId && <HelpTooltip helpId={helpId} className="ml-1" />}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
