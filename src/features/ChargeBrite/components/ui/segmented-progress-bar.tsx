
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SegmentedProgressBarProps {
  value: number;
  animate?: boolean;
  className?: string;
}

const SegmentedProgressBar: React.FC<SegmentedProgressBarProps> = ({
  value,
  animate = false,
  className
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (animate) {
      // Reset animation
      setAnimatedValue(0);
      
      // Sequential animation - animate to each quarter milestone
      const animateSequentially = () => {
        const segments = [25, 50, 75, 100];
        let currentSegment = 0;
        
        const animateNextSegment = () => {
          if (currentSegment < segments.length && segments[currentSegment] <= value) {
            const targetValue = Math.min(segments[currentSegment], value);
            setAnimatedValue(targetValue);
            currentSegment++;
            
            if (currentSegment < segments.length && segments[currentSegment] <= value) {
              setTimeout(animateNextSegment, 300); // 300ms delay between segments
            }
          }
        };
        
        // Start first segment after initial delay
        setTimeout(animateNextSegment, 100);
      };
      
      animateSequentially();
    } else {
      setAnimatedValue(value);
    }
  }, [value, animate]);

  const segments = [
    { min: 0, max: 25, color: 'bg-red-500', label: 'Poor' },
    { min: 26, max: 50, color: 'bg-amber-500', label: 'Fair' },
    { min: 51, max: 75, color: 'bg-blue-500', label: 'Good' },
    { min: 76, max: 100, color: 'bg-emerald-500', label: 'Excellent' }
  ];

  const getSegmentWidth = (segmentIndex: number) => {
    const segment = segments[segmentIndex];
    const segmentStart = segment.min;
    const segmentEnd = segment.max;
    
    if (animatedValue <= segmentStart) return 0;
    if (animatedValue >= segmentEnd) return 100;
    
    const segmentRange = segmentEnd - segmentStart + 1;
    const valueInSegment = animatedValue - segmentStart + 1;
    return (valueInSegment / segmentRange) * 100;
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="flex-1 relative bg-gray-200"
          >
            <div
              className={cn(
                "h-full transition-all duration-300 ease-out",
                segment.color
              )}
              style={{
                width: `${getSegmentWidth(index)}%`
              }}
            />
            {index < segments.length - 1 && (
              <div className="absolute right-0 top-0 w-px h-full bg-white opacity-50" />
            )}
          </div>
        ))}
      </div>
      
      {/* Optional: Add segment labels */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
};

export { SegmentedProgressBar };
