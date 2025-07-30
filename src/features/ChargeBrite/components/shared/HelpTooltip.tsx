
import { useState } from 'react';
import { Info } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useHelp } from '../../contexts/HelpContext';

interface HelpTooltipProps {
  helpId: string;
  className?: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ helpId, className = '' }) => {
  const { getHelpItem } = useHelp();
  const [isClickedOpen, setIsClickedOpen] = useState(false);
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const helpItem = getHelpItem(helpId);

  if (!helpItem) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsClickedOpen(!isClickedOpen);
  };

  const handleOpenChange = (open: boolean) => {
    setIsHoverOpen(open);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsClickedOpen(false);
  };

  const isOpen = isClickedOpen || isHoverOpen;

  const helpContent = (
    <div className="space-y-2">
      {helpItem.fieldName && (
        <p className="font-semibold text-ocean-800">{helpItem.fieldName}</p>
      )}
      <p className="text-gray-700 leading-relaxed font-normal">{helpItem.instruction}</p>
      {isClickedOpen && (
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close help"
        >
          ×
        </button>
      )}
    </div>
  );

  return (
    <div className="relative inline-flex">
      <HoverCard open={isOpen} onOpenChange={handleOpenChange} openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            className={`inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400 hover:text-ocean-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-1 rounded-full ${className}`}
            aria-label={`Help for ${helpItem.fieldName || helpId}`}
          >
            <Info className="w-4 h-4" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent 
          side="top" 
          className="max-w-sm p-4 text-sm bg-white border border-gray-300 shadow-xl rounded-lg z-[9999] relative"
          sideOffset={10}
          avoidCollisions={true}
        >
          {helpContent}
        </HoverCardContent>
      </HoverCard>

      {/* Overlay to close on outside click when manually opened */}
      {isClickedOpen && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default HelpTooltip;
