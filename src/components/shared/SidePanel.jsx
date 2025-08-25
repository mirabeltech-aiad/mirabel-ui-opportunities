import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Generic reusable side panel component that can be used across different modules
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the panel is open
 * @param {Function} props.onClose - Function to call when panel should close
 * @param {string} props.title - Panel title
 * @param {React.ReactNode} props.children - Panel content
 * @param {string} props.width - Panel width (default: '60vw')
 * @param {string} props.maxWidth - Panel max width (default: 'max-w-4xl')
 * @param {React.ReactNode} props.footer - Optional footer content
 * @param {boolean} props.closeOnBackdropClick - Whether to close on backdrop click (default: true)
 * @param {string} props.position - Panel position 'left' or 'right' (default: 'right')
 */
const SidePanel = ({ 
  isOpen, 
  onClose, 
  title,
  children,
  width = '60vw',
  maxWidth = 'max-w-4xl',
  footer,
  closeOnBackdropClick = true,
  position = 'right'
}) => {
  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const positionClasses = position === 'left' 
    ? 'left-0' 
    : 'right-0';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleBackdropClick}
      />
      
      {/* Panel */}
      <div 
        className={`fixed ${positionClasses} top-0 h-full ${maxWidth} bg-white shadow-xl z-50 flex flex-col`}
        style={{ width }}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {children}
            </div>
          </ScrollArea>
        </div>

        {/* Panel Footer */}
        {footer && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};

export default SidePanel;