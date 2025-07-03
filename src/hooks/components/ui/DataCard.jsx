
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { Button } from "@OpportunityComponents/ui/button";
import { MoreVertical } from "lucide-react";

/**
 * DataCard Component - Generic field-heavy card for displaying structured data
 * 
 * Design Principles:
 * - Consistent height across all cards in a grid
 * - Fixed alignment for bottom sections
 * - Icon-based field identification
 * - Clear visual hierarchy
 * 
 * @param {Object} props
 * @param {string} props.title - Main title/name
 * @param {string} props.subtitle - Secondary text (company, category, etc.)
 * @param {React.ReactNode} props.subtitleIcon - Icon for subtitle
 * @param {Array} props.fields - Array of field objects with icon, value, color
 * @param {Array} props.badges - Array of badge objects with text, variant, position
 * @param {Array} props.fixedRows - Array of fixed-height row content
 * @param {Function} props.onMenuClick - Menu button click handler
 * @param {string} props.className - Additional CSS classes
 */
const DataCard = ({
  title,
  subtitle,
  subtitleIcon,
  fields = [],
  badges = [],
  fixedRows = [],
  onMenuClick,
  className = "",
  ...props
}) => {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow border border-gray-200 flex flex-col h-full ${className}`}
      {...props}
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem] flex items-start">
            {title}
          </CardTitle>
          {onMenuClick && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 flex-shrink-0 ml-2"
              onClick={onMenuClick}
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          )}
        </div>
        {subtitle && (
          <div className="flex items-center gap-2 mt-2">
            {subtitleIcon && React.cloneElement(subtitleIcon, {
              className: "h-4 w-4 flex-shrink-0"
            })}
            <span className="text-sm text-gray-600 font-medium truncate">{subtitle}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
        {/* Top section with variable content */}
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2">
              {field.icon && React.cloneElement(field.icon, {
                className: `h-4 w-4 flex-shrink-0 ${field.iconColor || 'text-gray-500'}`
              })}
              <span className={`${field.large ? 'text-lg font-bold' : 'text-sm'} ${field.color || 'text-gray-600'} ${field.truncate ? 'truncate' : ''}`}>
                {field.value}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom section - Fixed alignment */}
        {(badges.length > 0 || fixedRows.length > 0) && (
          <div className="mt-4 space-y-3">
            {/* Badges row */}
            {badges.length > 0 && (
              <div className="flex justify-between items-center gap-2">
                {badges.map((badge, index) => (
                  <div key={index} className={badge.position === 'right' ? 'ml-auto' : ''}>
                    {badge.component}
                  </div>
                ))}
              </div>
            )}

            {/* Fixed height rows */}
            {fixedRows.map((row, index) => (
              <div key={index} className="h-5 flex items-center">
                {row.content ? (
                  <span className="text-xs text-gray-500">
                    {row.label && <span className="text-cyan-600 font-medium">{row.label}:</span>}
                    {row.label && ' '}
                    {row.content}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">{row.placeholder}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataCard;
