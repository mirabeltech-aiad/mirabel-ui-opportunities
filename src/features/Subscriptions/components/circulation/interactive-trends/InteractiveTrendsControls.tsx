
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface InteractiveTrendsControlsProps {
  dataView: 'circulation' | 'activity';
  onDataViewChange: (value: 'circulation' | 'activity') => void;
  chartType: 'line' | 'area';
  onChartTypeChange: (value: 'line' | 'area') => void;
}

const InteractiveTrendsControls: React.FC<InteractiveTrendsControlsProps> = ({
  dataView,
  onDataViewChange,
  chartType,
  onChartTypeChange,
}) => {
  return (
    <div className="flex items-center gap-4">
      <ToggleGroup
        type="single"
        value={dataView}
        onValueChange={(value) => onDataViewChange(value as 'circulation' | 'activity')}
        className="bg-gray-50 border border-gray-200 rounded-md"
      >
        <ToggleGroupItem 
          value="circulation" 
          className="text-xs data-[state=on]:bg-ocean-500 data-[state=on]:text-white"
        >
          Circulation
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="activity" 
          className="text-xs data-[state=on]:bg-ocean-500 data-[state=on]:text-white"
        >
          Activity
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        type="single"
        value={chartType}
        onValueChange={(value) => onChartTypeChange(value as 'line' | 'area')}
        className="bg-gray-50 border border-gray-200 rounded-md"
      >
        <ToggleGroupItem 
          value="line" 
          className="text-xs data-[state=on]:bg-ocean-500 data-[state=on]:text-white"
        >
          Line
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="area" 
          className="text-xs data-[state=on]:bg-ocean-500 data-[state=on]:text-white"
        >
          Area
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default InteractiveTrendsControls;
