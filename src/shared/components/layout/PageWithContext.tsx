import React from 'react';
import { PageContextHeader } from '../ui/PageContextHeader';
import { usePageContext } from '../../hooks/usePageContext';
import { useContextHeader } from '../../hooks/useContextHeader';

interface PageWithContextProps {
  children: React.ReactNode;
  pageName?: string;
  filePath?: string;
  description?: string;
  className?: string;
  dismissible?: boolean;
  minimizable?: boolean;
  persistDismissal?: boolean;
}

export const PageWithContext: React.FC<PageWithContextProps> = ({
  children,
  pageName,
  filePath,
  description,
  className = '',
  dismissible = true,
  minimizable = true,
  persistDismissal = true
}) => {
  const contextData = usePageContext({
    ...(pageName && { pageName }),
    ...(filePath && { filePath }),
    ...(description && { description })
  });

  const contextHeaderKey = filePath || contextData.filePath;
  const { isVisible, dismiss } = useContextHeader({
    key: contextHeaderKey.replace(/[^a-zA-Z0-9]/g, '-'),
    defaultVisible: true,
    persistDismissal
  });

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isVisible && (
          <PageContextHeader
            pageName={contextData.pageName}
            filePath={contextData.filePath}
            description={contextData.description}
            dismissible={dismissible}
            minimizable={minimizable}
            onDismiss={dismiss}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default PageWithContext;