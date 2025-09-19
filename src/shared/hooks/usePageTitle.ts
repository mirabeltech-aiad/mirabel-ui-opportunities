import { useEffect } from 'react'

/**
 * Hook to manage document title and page metadata
 * @param title - The page title to set
 * @param suffix - Optional suffix to append (defaults to app name)
 */
export const usePageTitle = (title: string, suffix: string = 'Magazine Manager Kiro') => {
  useEffect(() => {
    const fullTitle = suffix ? `${title} - ${suffix}` : title
    document.title = fullTitle
    
    // Cleanup: restore default title when component unmounts
    return () => {
      document.title = 'Magazine Manager Kiro'
    }
  }, [title, suffix])
}

export default usePageTitle