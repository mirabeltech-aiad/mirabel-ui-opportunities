import React, { useCallback, useId, useMemo, useRef, useState } from 'react'

type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

export interface SimpleTooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  side?: TooltipSide
  delay?: number
  disabled?: boolean
  maxWidth?: number
  className?: string
  showArrow?: boolean
  theme?: 'default' | 'light'
}

/**
 * SimpleTooltip
 * Minimal, stable tooltip with a modern gray theme.
 * - No portals
 * - No global listeners
 * - Keyboard accessible
 * - Predictable positioning
 */
export const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  children,
  side = 'top',
  delay = 200,
  disabled = false,
  maxWidth = 260,
  className,
  showArrow = true,
  theme = 'default'
}) => {
  const [open, setOpen] = useState(false)
  const timerRef = useRef<number | null>(null)
  const id = useId()

  const handleShow = useCallback(() => {
    if (disabled) return
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setOpen(true), delay)
  }, [delay, disabled])

  const handleHide = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    setOpen(false)
  }, [])

  const positionClasses = useMemo(() => {
    switch (side) {
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2'
      case 'top':
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    }
  }, [side])

  const arrowPositionStyles = useMemo<React.CSSProperties>(() => {
    if (!showArrow) return {}
    const base: React.CSSProperties = {
      width: 8,
      height: 8,
      position: 'absolute' as const,
      backgroundColor: theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(55, 65, 81)',
      borderLeft: theme === 'light' ? '1px solid rgb(229, 231, 235)' : '1px solid rgb(75, 85, 99)',
      borderTop: theme === 'light' ? '1px solid rgb(229, 231, 235)' : '1px solid rgb(75, 85, 99)',
      transform: 'rotate(45deg)'
    }
    switch (side) {
      case 'bottom':
        return { ...base, top: -4, left: '50%', marginLeft: -4 }
      case 'left':
        return { ...base, right: -4, top: '50%', marginTop: -4 }
      case 'right':
        return { ...base, left: -4, top: '50%', marginTop: -4 }
      case 'top':
      default:
        return { ...base, bottom: -4, left: '50%', marginLeft: -4 }
    }
  }, [side, showArrow])

  const clonedChild = React.cloneElement(children, {
    'aria-describedby': open ? id : undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      children.props.onMouseEnter?.(e)
      handleShow()
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props.onMouseLeave?.(e)
      handleHide()
    },
    onFocus: (e: React.FocusEvent) => {
      children.props.onFocus?.(e)
      handleShow()
    },
    onBlur: (e: React.FocusEvent) => {
      children.props.onBlur?.(e)
      handleHide()
    }
  })

  return (
    <span className={className} style={{ position: 'relative', display: 'inline-block' }}>
      {clonedChild}
      {open && content && !disabled && (
        <div
          id={id}
          role="tooltip"
          className={`absolute z-[1000] px-3 py-2 text-sm rounded-md shadow-lg pointer-events-none select-none ${positionClasses}`}
          style={{
            maxWidth,
            backgroundColor: theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(55, 65, 81)',
            color: theme === 'light' ? 'rgb(31, 41, 55)' : 'rgb(255, 255, 255)',
            border: theme === 'light' ? '1px solid rgb(229, 231, 235)' : '1px solid rgb(75, 85, 99)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
          }}
          data-theme={theme}
          aria-hidden={!open}
        >
          {content}
          {showArrow && <span style={arrowPositionStyles} />}
        </div>
      )}
    </span>
  )
}

export default SimpleTooltip


