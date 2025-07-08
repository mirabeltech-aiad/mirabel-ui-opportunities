import { useEffect, useCallback } from 'react';

interface IframeMessage {
  type: string;
  payload?: any;
}

interface IframeMessagingOptions {
  enableTokenPassing?: boolean;
  allowedOrigins?: string[];
  onMessage?: (message: IframeMessage) => void;
}

export const useIframeMessaging = (
  iframeRef: React.RefObject<HTMLIFrameElement>,
  options: IframeMessagingOptions = {}
) => {
  const { enableTokenPassing = false, allowedOrigins = [], onMessage } = options;

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin if allowedOrigins is specified
      if (allowedOrigins.length > 0 && !allowedOrigins.includes(event.origin)) {
        return;
      }

      try {
        const message: IframeMessage = typeof event.data === 'string' 
          ? JSON.parse(event.data) 
          : event.data;

        if (onMessage) {
          onMessage(message);
        }
      } catch (error) {
        console.error('Error parsing iframe message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [allowedOrigins, onMessage]);

  // Send message to iframe
  const sendMessage = useCallback((type: string, payload?: any) => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      const message: IframeMessage = { type, payload };
      iframe.contentWindow.postMessage(message, '*');
    }
  }, [iframeRef]);

  // Handle iframe load event
  const handleIframeLoad = useCallback(() => {
    if (enableTokenPassing) {
      // Send authentication token when iframe loads
      sendMessage('AUTH_TOKEN', { token: 'placeholder-token' });
    }
    
    // Send initial setup message
    sendMessage('IFRAME_READY');
  }, [enableTokenPassing, sendMessage]);

  return {
    sendMessage,
    handleIframeLoad
  };
};