/**
 * Conditional Logging Utility
 * 
 * Replaces console.log with conditional logging that only runs in development.
 * This eliminates performance overhead in production builds.
 */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args)
    }
  },
  
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args)
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args)
  },
  
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args)
    }
  },
  
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args)
    }
  },
  
  // Performance monitoring (only in dev)
  performance: (label: string, fn: () => void) => {
    if (isDev) {
      console.time(label)
      fn()
      console.timeEnd(label)
    } else {
      fn()
    }
  },
  
  // Analytics tracking (always enabled)
  analytics: (event: string, properties?: Record<string, any>) => {
    if (isDev) {
      console.log(`📊 Analytics: ${event}`, properties)
    }
    // In production, this would send to actual analytics service
  }
}

// Export individual functions for convenience
export const { log, warn, error, info, debug, performance, analytics } = logger
