import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/lib/utils'
import { 
  calculateStablePosition, 
  hoverStateManager, 
  throttle,
  getStableZIndex,
  createStableAnimationClass
} from '@/shared/utils/flickerFix'

interface TooltipProps {
  content: string
  children: React.ReactElement
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
  className?: string
  maxWidth?: number
  showArrow?: boolean
  theme?: 'default' | 'light' | 'dark' | 'ocean' | 'success' | 'warning' | 'error'
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 300,
  disabled = false,
  className,
  maxWidth = 250,
  showArrow = true,
  theme = 'light'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPositioned, setIsPositioned] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`)

  // Stable event handlers to prevent re-renders
  const showTooltip = useCallback(() => {
    if (disabled || !content.trim()) return
    
    hoverStateManager.setHoverState(
      `${tooltipId.current}-show`,
      () => {
        setIsVisible(true)
        // Delay position calculation to ensure tooltip is rendered
        requestAnimationFrame(() => {
          updatePosition()
        })
      },
      delay
    )
  }, [disabled, content, delay])

  const hideTooltip = useCallback(() => {
    hoverStateManager.clearHoverState(`${tooltipId.current}-show`)
    hoverStateManager.setHoverState(
      `${tooltipId.current}-hide`,
      () => {
        setIsVisible(false)
        setIsPositioned(false)
      },
      50, // Quick hide
      true // Immediate
    )
  }, [])

  // Throttled position update to prevent flickering during scroll/resize
  const updatePosition = useCallback(throttle(() => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    
    const newPosition = calculateStablePosition(
      triggerRect,
      tooltipRect,
      placement,
      8 + (showArrow ? 6 : 0)
    )

    // Only update if position changed significantly
    if (Math.abs(position.x - newPosition.x) > 1 || Math.abs(position.y - newPosition.y) > 1) {
      setPosition(newPosition)
    }
    
    if (!isPositioned) {
      setIsPositioned(true)
    }
  }, 16), [placement, showArrow, position, isPositioned]) // 60fps throttle

  // Handle scroll and resize events with throttling
  useEffect(() => {
    if (isVisible) {
      const handleResize = throttle(updatePosition, 100)
      const handleScroll = throttle(updatePosition, 16)
      
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll, true)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll, true)
      }
    }
  }, [isVisible, updatePosition])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      hoverStateManager.clearHoverState(`${tooltipId.current}-show`)
      hoverStateManager.clearHoverState(`${tooltipId.current}-hide`)
    }
  }, [])

  // Memoize event handlers to prevent unnecessary re-renders
  const eventHandlers = useMemo(() => ({
    onMouseEnter: (e: React.MouseEvent) => {
      children.props.onMouseEnter?.(e)
      showTooltip()
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props.onMouseLeave?.(e)
      hideTooltip()
    },
    onFocus: (e: React.FocusEvent) => {
      children.props.onFocus?.(e)
      showTooltip()
    },
    onBlur: (e: React.FocusEvent) => {
      children.props.onBlur?.(e)
      hideTooltip()
    }
  }), [children.props.onMouseEnter, children.props.onMouseLeave, children.props.onFocus, children.props.onBlur, showTooltip, hideTooltip])

  const clonedChild = React.cloneElement(children, {
    ref: triggerRef,
    ...eventHandlers
  })

  // Memoize theme styles to prevent recalculation
  const themeStyles = useMemo(() => {
    switch (theme) {
      case 'light':
        return {
          backgroundColor: 'rgb(255, 255, 255)', // white
          color: 'rgb(31, 41, 55)', // gray-800
          borderColor: 'rgb(229, 231, 235)', // gray-200
          arrowColor: 'rgb(255, 255, 255)',
          arrowBorderColor: 'rgb(229, 231, 235)'
        }
      case 'dark':
        return {
          backgroundColor: 'rgb(17, 24, 39)', // gray-900
          color: 'rgb(255, 255, 255)', // white
          borderColor: 'rgb(55, 65, 81)', // gray-700
          arrowColor: 'rgb(17, 24, 39)',
          arrowBorderColor: 'rgb(55, 65, 81)'
        }
      case 'ocean':
        return {
          backgroundColor: 'rgb(7, 89, 133)', // ocean-800
          color: 'rgb(255, 255, 255)', // white
          borderColor: 'rgb(2, 132, 199)', // ocean-600
          arrowColor: 'rgb(7, 89, 133)',
          arrowBorderColor: 'rgb(2, 132, 199)'
        }
      case 'success':
        return {
          backgroundColor: 'rgb(22, 101, 52)', // green-800
          color: 'rgb(255, 255, 255)', // white
          borderColor: 'rgb(22, 163, 74)', // green-600
          arrowColor: 'rgb(22, 101, 52)',
          arrowBorderColor: 'rgb(22, 163, 74)'
        }
      case 'warning':
        return {
          backgroundColor: 'rgb(146, 64, 14)', // amber-800
          color: 'rgb(255, 255, 255)', // white
          borderColor: 'rgb(217, 119, 6)', // amber-600
          arrowColor: 'rgb(146, 64, 14)',
          arrowBorderColor: 'rgb(217, 119, 6)'
        }
      case 'error':
        return {
          backgroundColor: 'rgb(153, 27, 27)', // red-800
          color: 'rgb(255, 255, 255)', // white
          borderColor: 'rgb(220, 38, 38)', // red-600
          arrowColor: 'rgb(153, 27, 27)',
          arrowBorderColor: 'rgb(220, 38, 38)'
        }
      default: // treat unknown/default as light
        return {
          backgroundColor: 'rgb(255, 255, 255)', // white
          color: 'rgb(31, 41, 55)', // gray-800
          borderColor: 'rgb(229, 231, 235)', // gray-200
          arrowColor: 'rgb(255, 255, 255)',
          arrowBorderColor: 'rgb(229, 231, 235)'
        }
    }
  }, [theme])

  // Memoize animation styles
  const animationStyles = useMemo(() => 
    createStableAnimationClass(isVisible && isPositioned, 150), 
    [isVisible, isPositioned]
  )

  const tooltipContent = isVisible && content.trim() && (
    <div
      ref={tooltipRef}
      className={cn(
        "fixed px-3 py-2 text-sm rounded-lg pointer-events-none select-none",
        // Prevent flickering with stable positioning
        !isPositioned && "opacity-0",
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        maxWidth: `${maxWidth}px`,
        backgroundColor: themeStyles.backgroundColor,
        color: themeStyles.color,
        border: `1px solid ${themeStyles.borderColor}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        zIndex: getStableZIndex('tooltip'),
        // Apply stable animation styles
        opacity: animationStyles.opacity,
        transition: animationStyles.transition,
        pointerEvents: animationStyles.pointerEvents,
        // Prevent sub-pixel rendering issues
        transform: `${animationStyles.transform} translateZ(0)`,
        backfaceVisibility: 'hidden',
        willChange: 'opacity, transform'
      } as React.CSSProperties}
      data-theme={theme}
      role="tooltip"
      aria-hidden={!isVisible}
    >
      {content}
      {showArrow && (
        <div
          className="absolute w-2 h-2 transform rotate-45"
          style={{
            backgroundColor: themeStyles.arrowColor,
            border: `1px solid ${themeStyles.arrowBorderColor}`,
            borderRight: 'none',
            borderBottom: 'none',
            ...(placement === 'top' && {
              bottom: '-4px',
              left: '50%',
              marginLeft: '-4px'
            }),
            ...(placement === 'bottom' && {
              top: '-4px',
              left: '50%',
              marginLeft: '-4px'
            }),
            ...(placement === 'left' && {
              right: '-4px',
              top: '50%',
              marginTop: '-4px'
            }),
            ...(placement === 'right' && {
              left: '-4px',
              top: '50%',
              marginTop: '-4px'
            })
          }}
        />
      )}
    </div>
  )

  return (
    <>
      {clonedChild}
      {typeof document !== 'undefined' && createPortal(tooltipContent, document.body)}
    </>
  )
}

// Higher-order component for easy tooltip wrapping
export const withTooltip = <P extends object>(
  Component: React.ComponentType<P>,
  tooltipContent: string,
  tooltipProps?: Omit<TooltipProps, 'content' | 'children'>
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <Tooltip content={tooltipContent} {...tooltipProps}>
      <Component {...(props as any)} ref={ref} />
    </Tooltip>
  ))
  
  WrappedComponent.displayName = `withTooltip(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Convenience components for common themes
export const DefaultTooltip: React.FC<Omit<TooltipProps, 'theme'>> = (props) => (
  <Tooltip {...props} theme="default" />
)

export const LightTooltip: React.FC<Omit<TooltipProps, 'theme'>> = (props) => (
  <Tooltip {...props} theme="light" />
)

export const DarkTooltip: React.FC<Omit<TooltipProps, 'theme'>> = (props) => (
  <Tooltip {...props} theme="dark" />
)

export const OceanTooltip: React.FC<Omit<TooltipProps, 'theme'>> = (props) => (
  <Tooltip {...props} theme="ocean" />
)

export const SuccessTooltip: React.FC<Omit<TooltipProps, 'theme'>> = (props) => (
  <Tooltip {...props} theme="success" />
)

export const WarningTooltip: React.FC<Omit<TooltipProps, 'theme'>> = (props) => (
  <Tooltip {...props} theme="warning" />
)

export const ErrorTooltip: React.FC<Omit<TooltipProps, 'theme'>> = (props) => (
  <Tooltip {...props} theme="error" />
)

export default Tooltip