
// JSX component - React import removed for React 18+
import { Label } from '@/components/ui/label';
import HelpTooltip from './shared/HelpTooltip';

interface FieldWithHelpProps {
  label: string;
  helpId: string;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

const FieldWithHelp: React.FC<FieldWithHelpProps> = ({
  label,
  helpId,
  htmlFor,
  required = false,
  className = '',
  children
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center">
        <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <HelpTooltip helpId={helpId} />
      </div>
      {children}
    </div>
  );
};

export default FieldWithHelp;
