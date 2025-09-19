import React, { useState } from 'react';
import { Copy, Check, X, Minimize2 } from 'lucide-react';

interface PageContextHeaderProps {
  pageName: string;
  filePath: string;
  description?: string;
  className?: string;
  variant?: 'page' | 'modal' | 'compact';
  dismissible?: boolean;
  onDismiss?: () => void;
  minimizable?: boolean;
}

export const PageContextHeader: React.FC<PageContextHeaderProps> = React.memo(({
  pageName,
  filePath,
  description,
  className = '',
  variant = 'page',
  dismissible = false,
  onDismiss,
  minimizable = false
}) => {
  const [copied, setCopied] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Debug logging removed to prevent console spam

  const contextText = `Page: ${pageName}
File: ${filePath}${description ? `
Description: ${description}` : ''}

Please help me with this page.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contextText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Variant-specific styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'modal':
        return {
          container: 'bg-blue-50 border border-blue-200 rounded-md p-3 mb-4',
          title: 'text-lg font-semibold text-blue-800 mb-1',
          filePath: 'text-xs text-blue-600 font-mono break-all mb-1',
          description: 'text-xs text-gray-600',
          button: 'px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors duration-200'
        };
      case 'compact':
        return {
          container: 'bg-gray-50 border border-gray-200 rounded p-2 mb-3',
          title: 'text-sm font-semibold text-gray-800 mb-0.5',
          filePath: 'text-xs text-gray-600 font-mono break-all',
          description: 'text-xs text-gray-500 mt-1',
          button: 'px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors duration-200'
        };
      default: // page
        return {
          container: 'bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6',
          title: 'text-xl font-semibold text-blue-800 mb-1',
          filePath: 'text-sm text-blue-600 font-mono break-all mb-2',
          description: 'text-sm text-gray-600',
          button: 'px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200'
        };
    }
  };

  const styles = getVariantStyles();

  if (isMinimized) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={styles.title}>{pageName}</span>
            <span className="text-xs text-gray-500">({filePath.split('/').pop()})</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className={`${styles.button} whitespace-nowrap`}
              title="Copy page context for Kiro"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  {variant !== 'compact' && <span className="ml-1">Copied!</span>}
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  {variant !== 'compact' && <span className="ml-1">Copy</span>}
                </>
              )}
            </button>
            {minimizable && (
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="Expand context header"
              >
                <Minimize2 className="h-3 w-3 rotate-180" />
              </button>
            )}
            {dismissible && (
              <button
                onClick={onDismiss}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="Remove context header"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className={styles.title}>
            {pageName}
          </h1>
          <p className={styles.filePath}>
            {filePath}
          </p>
          {description && (
            <p className={styles.description}>
              {description}
            </p>
          )}
        </div>
        
        <div className="flex items-start gap-1">
          <button
            onClick={handleCopy}
            className={`${styles.button} whitespace-nowrap`}
            title="Copy page context for Kiro"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                {variant !== 'compact' && <span className="ml-1">Copied!</span>}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {variant !== 'compact' && <span className="ml-1">Copy for Kiro</span>}
              </>
            )}
          </button>
          {minimizable && (
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Minimize context header"
            >
              <Minimize2 className="h-3 w-3" />
            </button>
          )}
          {dismissible && (
            <button
              onClick={onDismiss}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Remove context header"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      
      {/* Preview of what will be copied - only show for page variant */}
      {variant === 'page' && (
        <details className="mt-3">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
            Preview copy text
          </summary>
          <pre className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border overflow-x-auto">
{contextText}
          </pre>
        </details>
      )}
    </div>
  );
});

export default PageContextHeader;