import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { formatLongDate, calculateDaysBetween } from "@/utils/dateFormatters";

interface StageChange {
  id: string;
  date: string;
  fromStage: string;
  toStage: string;
  user: string;
  timestamp: number;
  description: string;
  stageName: string;
  previousStage: string;
  updatedBy: string;
  updatedOn: string;
}

interface TimelinePointProps {
  change: StageChange;
  index: number;
  stageChanges: StageChange[];
  colorCode:string;
}
interface Stages {
  value: string;
  label: string;
  colorCode:string;
}

const TimelinePoint: React.FC<TimelinePointProps> = ({ change, index, stageChanges, colorCode }) => {
  const isLast = index === stageChanges.length - 1;
  const isEven = index % 2 === 0;
  const bubbleOffset = isEven ? 60 : 120; // Extracted for clarity

  // Get the stage name from the change data - use toStage (current stage after change)
  const stageName = change.toStage || change.stageName || 'Unknown Stage';

  return (
    <div 
      className="flex flex-col items-center relative mr-12"
      style={{ 
        minWidth: '180px' // Preserved spacing from original
      }}
    >
      {/* Date above timeline */}
      <div className="text-sm font-medium text-gray-700 mb-3 text-center">
        {formatLongDate(change.date)}
      </div>
      
      {/* Stage indicator dot - centered on timeline */}
      <div className="w-3 h-3 bg-blue-600 rounded-full z-10 relative -mt-1.5"></div>
      
      {/* Connecting line from dot to stage bubble */}
      <div 
        className="absolute w-0.5 bg-gray-300 z-5"
        style={{
          top: '81.5px', // Preserved exact positioning
          height: `${bubbleOffset - 8}px`,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      ></div>
      
      {/* Stage badge below timeline - staggered */}
      <div 
        className="absolute flex flex-col items-center"
        style={{
          top: `${80 + bubbleOffset}px` // Preserved exact positioning
        }}
      >
        <Badge 
          variant="outline" 
          className={`${colorCode} font-medium px-4 py-2 text-sm mb-3`}
        >
          {stageName}
        </Badge>
        
        {/* User */}
        <div className="text-sm text-gray-600 text-center font-medium">
          {change.user || change.updatedBy || 'Unknown User'}
        </div>
      </div>
      
      {/* Days interval between dates - positioned between current and next date */}
      {!isLast && (
        <div className="absolute top-2 -right-6 text-sm text-gray-500 bg-white px-2 py-1 rounded border z-20 font-medium">
          {calculateDaysBetween(change.date, stageChanges[index + 1].date)} days
        </div>
      )}
      
      {/* Arrow to next stage */}
      {!isLast && (
        <div className="absolute top-20 -right-6 transform -translate-y-1/2">
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default TimelinePoint;