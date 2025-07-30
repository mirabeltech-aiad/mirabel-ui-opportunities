import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PricingTooltipProps {
  title: string;
  description: string;
  calculation?: string;
  period?: string;
  benchmarks?: {
    good?: string;
    average?: string;
    concerning?: string;
  };
  children: React.ReactElement;
}

const PricingTooltip: React.FC<PricingTooltipProps> = ({
  title,
  description,
  calculation,
  period,
  benchmarks,
  children
}) => {
  const [showExpandedInfo, setShowExpandedInfo] = useState(false);
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [keepVisible, setKeepVisible] = useState(false);
  const [forceHidden, setForceHidden] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // When expanded info is shown, keep it visible for exactly 5 seconds
    if (showExpandedInfo) {
      setKeepVisible(true);
      timeoutId = setTimeout(() => {
        setKeepVisible(false);
        setShowExpandedInfo(false);
      }, 5000); // Exactly 5 seconds
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showExpandedInfo]);

  return (
    <div 
      className="relative"
      onMouseEnter={() => {
        // Close expanded tooltip when hovering over another metric card
        if (showExpandedInfo && !isIconHovered) {
          setShowExpandedInfo(false);
          setKeepVisible(false);
        }
      }}
    >
      {/* Clone children to add info icon inline with CardTitle */}
      {React.cloneElement(children, {
        children: React.Children.map(children.props.children, (child: React.ReactNode) => {
          // Check if this is the CardHeader with CardTitle
          if (React.isValidElement(child) && child.type && (child.type as any).displayName === 'CardHeader') {
            return React.cloneElement(child as React.ReactElement, {
              children: React.Children.map((child as React.ReactElement).props.children, (headerChild: React.ReactNode) => {
                // Check if this is the CardTitle
                if (React.isValidElement(headerChild) && headerChild.type && (headerChild.type as any).displayName === 'CardTitle') {
                  return (
                    <div className="flex items-center gap-2">
                      {headerChild}
                      {/* Info icon - visible on icon hover or when expanded */}
                       <div 
                         className="transition-opacity duration-200"
                         onMouseEnter={() => {
                           setIsIconHovered(true);
                           // Close any other expanded tooltips when hovering over this icon
                           if (!showExpandedInfo) {
                             // This will help close other tooltips when entering a new one
                             setShowExpandedInfo(false);
                             setKeepVisible(false);
                           }
                         }}
                          onMouseLeave={() => {
                            setIsIconHovered(false);
                            // Reset force hidden when user leaves the icon area
                            setForceHidden(false);
                          }}
                       >
                        <Tooltip open={!forceHidden && (isIconHovered || keepVisible)}>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <Info className="h-4 w-4 text-gray-400 hover:text-ocean-600 transition-colors" />
                            </div>
                          </TooltipTrigger>
                           <TooltipContent 
                             className="max-w-sm p-3 bg-white border border-gray-200 shadow-md rounded-md text-gray-900" 
                             side="top"
                             sideOffset={8}
                             onMouseLeave={() => {
                               if (showExpandedInfo) {
                                 setShowExpandedInfo(false);
                                 setKeepVisible(false);
                               }
                             }}
                           >
                            <div className="space-y-3">
                              {/* Header - Title and Description */}
                              <div>
                                <h4 className="font-medium text-sm text-gray-900 mb-1">{title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                              </div>
                              
                              {/* More info button - only show when not expanded */}
                              {!showExpandedInfo && (
                                <button
                                  className="text-sm text-ocean-600 hover:text-ocean-700 font-medium"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowExpandedInfo(true);
                                  }}
                                >
                                  More info ↓
                                </button>
                              )}
                              
                              {/* Expanded content - only show when clicked */}
                              {showExpandedInfo && (
                                <div className="border-t border-gray-100 pt-3 space-y-3">
                                  {calculation && (
                                    <div>
                                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide block mb-1">CALCULATION</span>
                                      <p className="text-sm text-gray-700 leading-relaxed">{calculation}</p>
                                    </div>
                                  )}
                                  
                                  {period && (
                                    <div>
                                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide block mb-1">PERIOD</span>
                                      <p className="text-sm text-gray-700 leading-relaxed">{period}</p>
                                    </div>
                                  )}
                                  
                                  {benchmarks && (
                                    <div>
                                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide block mb-2">BENCHMARKS</span>
                                      <div className="space-y-1.5">
                                        {benchmarks.good && (
                                          <div className="flex items-center text-sm">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                                            <span className="text-gray-700">Good: {benchmarks.good}</span>
                                          </div>
                                        )}
                                        {benchmarks.average && (
                                          <div className="flex items-center text-sm">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 flex-shrink-0"></div>
                                            <span className="text-gray-700">Average: {benchmarks.average}</span>
                                          </div>
                                        )}
                                        {benchmarks.concerning && (
                                          <div className="flex items-center text-sm">
                                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></div>
                                            <span className="text-gray-700">Concerning: {benchmarks.concerning}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Close button - immediately closes the tooltip */}
                                  <button
                                    className="text-sm text-ocean-600 hover:text-ocean-700 font-medium pt-2"
                                     onClick={(e) => {
                                       e.preventDefault();
                                       e.stopPropagation();
                                       setShowExpandedInfo(false);
                                       setKeepVisible(false);
                                       setForceHidden(true);
                                     }}
                                  >
                                    Close ↑
                                  </button>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                }
                return headerChild;
              })
            });
          }
          return child;
        })
      })}
    </div>
  );
};

export default PricingTooltip;
