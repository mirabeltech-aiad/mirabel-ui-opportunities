import React from 'react';
import { getRepColor, getInitials } from '../../../utils/commonHelpers';

const RepAvatar = ({ 
  name, 
  size = 'md', 
  className = '',
  onClick = null,
  showTooltip = true 
}) => {
  if (!name) return null;
  
  const color = getRepColor(name);
  const initials = getInitials(name);
  
  // Size variants
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  const baseClasses = `inline-flex items-center justify-center rounded-full font-semibold text-white ${sizeClass} ${className}`;
  const interactiveClasses = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';
  
  return (
    <div 
      className={`${baseClasses} ${interactiveClasses}`}
      style={{ backgroundColor: color }}
      title={showTooltip ? name : undefined}
      onClick={onClick}
    >
      {initials}
    </div>
  );
};

export default RepAvatar;