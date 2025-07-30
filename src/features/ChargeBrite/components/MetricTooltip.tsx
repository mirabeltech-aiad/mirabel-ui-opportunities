
// JSX component - React import removed for React 18+
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricTooltipProps {
  title: string;
  description: string;
  calculation?: string;
  period?: string;
  benchmarks?: {
    good?: string;
    average?: string;
    concerning?: string;
  };
  children: React.ReactNode;
}

const MetricTooltip: React.FC<MetricTooltipProps> = ({
  title,
  description,
  calculation,
  period,
  benchmarks,
  children
}) => {
  return (
    <div className="relative group">
      {children}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-help">
            <Info className="h-4 w-4 text-gray-400 hover:text-ocean-600" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4 bg-white border border-gray-200 shadow-lg rounded-lg text-gray-900" side="top">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-ocean-800 mb-1">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            
            {calculation && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Calculation</span>
                <p className="text-sm text-gray-600 mt-1">{calculation}</p>
              </div>
            )}
            
            {period && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Period</span>
                <p className="text-sm text-gray-600 mt-1">{period}</p>
              </div>
            )}
            
            {benchmarks && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Benchmarks</span>
                <div className="mt-1 space-y-1">
                  {benchmarks.good && (
                    <div className="flex items-center text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Good: {benchmarks.good}</span>
                    </div>
                  )}
                  {benchmarks.average && (
                    <div className="flex items-center text-xs">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Average: {benchmarks.average}</span>
                    </div>
                  )}
                  {benchmarks.concerning && (
                    <div className="flex items-center text-xs">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Concerning: {benchmarks.concerning}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default MetricTooltip;
