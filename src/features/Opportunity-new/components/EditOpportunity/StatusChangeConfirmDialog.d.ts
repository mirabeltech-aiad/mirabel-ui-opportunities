import React from 'react';

interface StatusChangeConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  statusValue: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

declare const StatusChangeConfirmDialog: React.FC<StatusChangeConfirmDialogProps>;
export default StatusChangeConfirmDialog;