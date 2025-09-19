// Navbar Performance Diagnostics

import { logger } from './logger'

export const diagnoseNavbarPerformance = () => {

  const diagnostics = {
    timestamp: new Date().toISOString(),
    issues: [] as string[],
    recommendations: [] as string[],
    performance: {} as Record<string, any>
  }

  // Check for React DevTools warnings
  if (typeof window !== 'undefined') {
    const originalWarn = console.warn
    const originalError = console.error
    
    let reactWarnings: string[] = []
    let reactErrors: string[] = []
    
    console.warn = (...args) => {
      const message = args.join(' ')
      if (message.includes('React') || message.includes('component')) {
        reactWarnings.push(message)
      }
      originalWarn.apply(console, args)
    }
    
    console.error = (...args) => {
      const message = args.join(' ')
      if (message.includes('React') || message.includes('component')) {
        reactErrors.push(message)
      }
      originalError.apply(console, args)
    }
    
    // Restore after a short delay
    setTimeout(() => {
      console.warn = originalWarn
      console.error = originalError
      
      if (reactWarnings.length > 0) {
        diagnostics.issues.push(`React warnings detected: ${reactWarnings.length}`)
        diagnostics.recommendations.push('Check console for React warnings and fix them')
      }
      
      if (reactErrors.length > 0) {
        diagnostics.issues.push(`React errors detected: ${reactErrors.length}`)
        diagnostics.recommendations.push('Check console for React errors and fix them')
      }
    }, 1000)
  }

  // Check for performance issues
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      diagnostics.performance.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      diagnostics.performance.loadComplete = navigation.loadEventEnd - navigation.loadEventStart
      
      if (diagnostics.performance.domContentLoaded > 1000) {
        diagnostics.issues.push('Slow DOM content loading detected')
        diagnostics.recommendations.push('Consider code splitting and lazy loading')
      }
    }
  }

  // Check for CSS issues
  const checkCSSPerformance = () => {
    const stylesheets = document.styleSheets
    let totalRules = 0
    
    try {
      for (let i = 0; i < stylesheets.length; i++) {
        const sheet = stylesheets[i]
        if (sheet.cssRules) {
          totalRules += sheet.cssRules.length
        }
      }
      
      diagnostics.performance.cssRules = totalRules
      
      if (totalRules > 5000) {
        diagnostics.issues.push('High number of CSS rules detected')
        diagnostics.recommendations.push('Consider CSS optimization and unused rule removal')
      }
    } catch (e) {
      // Cross-origin stylesheets
    }
  }

  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete') {
      checkCSSPerformance()
    } else {
      window.addEventListener('load', checkCSSPerformance)
    }
  }

  // Check for event listener leaks
  const checkEventListeners = () => {
    const elements = document.querySelectorAll('*')
    let elementsWithListeners = 0
    
    elements.forEach(el => {
      // Check for common event attributes
      const events = ['onclick', 'onmouseover', 'onmouseout', 'onfocus', 'onblur']
      const hasListeners = events.some(event => (el as any)[event] !== null)
      
      if (hasListeners) {
        elementsWithListeners++
      }
    })
    
    diagnostics.performance.elementsWithListeners = elementsWithListeners
    
    if (elementsWithListeners > 100) {
      diagnostics.issues.push('High number of elements with event listeners')
      diagnostics.recommendations.push('Consider event delegation and cleanup')
    }
  }

  if (typeof window !== 'undefined') {
    setTimeout(checkEventListeners, 500)
  }

  return diagnostics
}

export const logNavbarDiagnostics = () => {
  const diagnostics = diagnoseNavbarPerformance()
  
  console.group('🔍 Navbar Performance Diagnostics')
  logger.log('Timestamp:', diagnostics.timestamp)
  
  if (diagnostics.issues.length > 0) {
    console.group('⚠️ Issues Found')
    diagnostics.issues.forEach(issue => logger.warn(issue))
    console.groupEnd()
  }
  
  if (diagnostics.recommendations.length > 0) {
    console.group('💡 Recommendations')
    diagnostics.recommendations.forEach(rec => logger.info(rec))
    console.groupEnd()
  }
  
  console.group('📊 Performance Metrics')
  Object.entries(diagnostics.performance).forEach(([key, value]) => {
    logger.log(`${key}:`, value)
  })
  console.groupEnd()
  
  console.groupEnd()
  
  return diagnostics
}

// Auto-run diagnostics in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(logNavbarDiagnostics, 2000)
  })
}