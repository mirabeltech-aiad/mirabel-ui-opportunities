import { useCallback, useRef } from 'react';

// Custom hook to handle help icon drag events
const useHelpDragHandler = () => {
  const helpDragHandler = useRef(null);

  const setHelpDragHandler = useCallback((handler) => {
    helpDragHandler.current = handler;
  }, []);

  const handleDragEnd = useCallback((event) => {
    if (helpDragHandler.current) {
      helpDragHandler.current(event);
    }
  }, []);

  return {
    handleDragEnd,
    setHelpDragHandler,
  };
};

export default useHelpDragHandler;
