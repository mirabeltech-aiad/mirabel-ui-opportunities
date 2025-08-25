import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const TruncatedText = ({ 
  text, 
  maxLength = 50, 
  className = "", 
  expandable = true,
  showTooltip = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text || typeof text !== 'string') {
    return <span className={className}>-</span>;
  }
  
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate 
    ? text 
    : `${text.substring(0, maxLength)}...`;
  
  if (!shouldTruncate) {
    return (
      <span 
        className={`${className} break-words`}
        title={showTooltip ? text : undefined}
      >
        {text}
      </span>
    );
  }
  
  if (!expandable) {
    return (
      <span 
        className={`${className} truncate block`}
        title={showTooltip ? text : undefined}
      >
        {displayText}
      </span>
    );
  }
  
  return (
    <div className={`${className} max-w-full`}>
      <span 
        className={isExpanded ? "break-words" : "truncate block"}
        title={showTooltip && !isExpanded ? text : undefined}
      >
        {displayText}
      </span>
      {expandable && (
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 ml-1 inline-flex items-center justify-center hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>
      )}
    </div>
  );
};

export default TruncatedText;