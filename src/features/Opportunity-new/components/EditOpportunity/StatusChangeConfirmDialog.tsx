import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface StatusChangeConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  statusValue: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const StatusChangeConfirmDialog: React.FC<StatusChangeConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  statusValue,
  onConfirm,
  onCancel
}) => {
  const getStatusConfig = (status: string | null) => {
    switch (status) {
      case 'Won':
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-600" />,
          title: 'Mark Opportunity as Won?',
          description: 'This will set the probability to 100% and move the opportunity to "Closed Won" stage.',
          confirmText: 'Mark as Won',
          confirmClass: 'bg-green-600 hover:bg-green-700 text-white'
        };
      case 'Lost':
        return {
          icon: <XCircle className="h-8 w-8 text-red-600" />,
          title: 'Mark Opportunity as Lost?',
          description: 'This will set the probability to 0% and move the opportunity to "Closed Lost" stage. You will need to provide a loss reason.',
          confirmText: 'Mark as Lost',
          confirmClass: 'bg-red-600 hover:bg-red-700 text-white'
        };
      default:
        return {
          icon: <AlertTriangle className="h-8 w-8 text-yellow-600" />,
          title: 'Confirm Status Change',
          description: 'Are you sure you want to change the opportunity status?',
          confirmText: 'Confirm',
          confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
    }
  };

  const config = getStatusConfig(statusValue);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            {config.icon}
            <DialogTitle className="text-lg font-semibold">
              {config.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {statusValue === 'Won' && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">What happens next:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Probability will be set to 100%</li>
              <li>• Stage will change to "Closed Won"</li>
              <li>• Opportunity will be marked as successful</li>
              <li>• This action can be reversed if needed</li>
            </ul>
          </div>
        )}

        {statusValue === 'Lost' && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-900 mb-2">What happens next:</h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Probability will be set to 0%</li>
              <li>• Stage will change to "Closed Lost"</li>
              <li>• You'll need to provide a loss reason</li>
              <li>• This action can be reversed if needed</li>
            </ul>
          </div>
        )}

        <DialogFooter className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 ${config.confirmClass}`}
          >
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusChangeConfirmDialog;