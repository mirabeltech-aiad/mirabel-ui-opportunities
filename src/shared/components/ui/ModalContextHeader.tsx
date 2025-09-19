import React, { useState } from 'react';
import { PageContextHeader } from './PageContextHeader';

interface ModalContextHeaderProps {
  modalName: string;
  componentPath: string;
  description?: string;
  parentPage?: string;
  parentPath?: string;
  className?: string;
  onDismiss?: () => void;
}

export const ModalContextHeader: React.FC<ModalContextHeaderProps> = ({
  modalName,
  componentPath,
  description,
  parentPage,
  parentPath,
  className = '',
  onDismiss
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) {
    return null;
  }

  const fullDescription = [
    description,
    parentPage && `Opened from: ${parentPage}`,
    parentPath && `Parent: ${parentPath}`
  ].filter(Boolean).join(' | ');

  return (
    <PageContextHeader
      pageName={`Modal: ${modalName}`}
      filePath={componentPath}
      description={fullDescription}
      variant="modal"
      dismissible={true}
      minimizable={true}
      onDismiss={handleDismiss}
      className={className}
    />
  );
};

export default ModalContextHeader;