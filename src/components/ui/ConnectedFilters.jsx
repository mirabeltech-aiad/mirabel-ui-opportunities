import React from 'react';
import { cn } from '@/lib/utils';

/**
 * ConnectedFilters - Groups filter components together with connected styling
 * Removes gaps between filters and creates a unified appearance with visual separators
 */
const ConnectedFilters = ({ children, className = "", ...props }) => {
  const childrenArray = React.Children.toArray(children).filter(Boolean);
  
  // Filter out props that shouldn't be passed to DOM elements
  const { 'data-lov-id': dataLovId, ...domProps } = props;

  return (
    <div 
      className={cn(
        "flex items-center border border-gray-300 rounded-md bg-white overflow-hidden",
        className
      )}
      data-lov-id={dataLovId}
      {...domProps}
    >
      {childrenArray.map((child, index) => {
        const isFirst = index === 0;
        const isLast = index === childrenArray.length - 1;

        return (
          <React.Fragment key={index}>
            {/* Add visual separator before each filter (except first) */}
            {!isFirst && (
              <div className="w-px h-6 bg-gray-300 flex-shrink-0" />
            )}
            
            {/* Filter component */}
            <div className="flex-shrink-0">
              {React.cloneElement(child, {
                className: cn(
                  // Base styling for all connected filters
                  "border-0 bg-transparent outline-none h-9 text-sm min-w-[140px] rounded-none",
                  // Focus ring styling
                  "focus:ring-0 data-[state=open]:ring-0",
                  // Preserve any existing classes
                  child.props.className
                ),
                style: {
                  // Remove any border radius since we're using separators
                  borderRadius: '0',
                  ...child.props.style
                }
              })}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/**
 * ConnectedSelect - A select component optimized for connected filter groups
 */
export const ConnectedSelect = ({ children, className = "", value, onChange, ...props }) => {
  return (
    <select
      className={cn("px-3 bg-transparent", className)}
      value={value}
      onChange={onChange}
      {...props}
    >
      {children}
    </select>
  );
};

/**
 * ConnectedSelectTrigger - A wrapper for shadcn Select components in connected filters
 */
export const ConnectedSelectTrigger = ({ children, className = "", ...props }) => {
  return (
    <div className={cn("px-3 bg-transparent flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
};

export default ConnectedFilters; 