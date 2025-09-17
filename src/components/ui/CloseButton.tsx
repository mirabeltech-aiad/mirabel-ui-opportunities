import React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Size variant of the close button */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** Theme variant */
  variant?: 'default' | 'dark' | 'colored' | 'danger'
  /** Additional CSS classes */
  className?: string
  /** Accessible label for screen readers */
  'aria-label'?: string
}

/**
 * CloseButton component with consistent styling and enhanced visibility
 * 
 * This component provides standardized close buttons across the application
 * with improved size, hover states, and accessibility features.
 */
export const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ 
    size = 'md', 
    variant = 'default', 
    className, 
    'aria-label': ariaLabel = 'Close',
    ...props 
  }, ref) => {
    const baseClasses = 'close-button-base'
    const sizeClasses = `close-button-${size}`
    const variantClasses = variant !== 'default' ? `close-button-${variant}` : ''
    
    return (
      <button
        ref={ref}
        type="button"
        className={cn(baseClasses, sizeClasses, variantClasses, className)}
        aria-label={ariaLabel}
        {...props}
      >
        <X className={cn(
          // Icon sizes based on button size
          size === 'xs' && 'w-3 h-3',
          size === 'sm' && 'w-4 h-4',
          size === 'md' && 'w-5 h-5',
          size === 'lg' && 'w-6 h-6',
          size === 'xl' && 'w-7 h-7',
          size === '2xl' && 'w-8 h-8'
        )} />
      </button>
    )
  }
)

CloseButton.displayName = 'CloseButton'

// Convenience components for common use cases
export const ModalCloseButton = React.forwardRef<HTMLButtonElement, Omit<CloseButtonProps, 'size' | 'className'>>(
  (props, ref) => (
    <CloseButton
      ref={ref}
      size="xl"
      className="close-button-modal"
      {...props}
    />
  )
)

export const CardCloseButton = React.forwardRef<HTMLButtonElement, Omit<CloseButtonProps, 'size' | 'className'>>(
  (props, ref) => (
    <CloseButton
      ref={ref}
      size="sm"
      className="close-button-card"
      {...props}
    />
  )
)

export const InlineCloseButton = React.forwardRef<HTMLButtonElement, Omit<CloseButtonProps, 'className'>>(
  ({ size = 'sm', ...props }, ref) => (
    <CloseButton
      ref={ref}
      size={size}
      className="close-button-inline"
      {...props}
    />
  )
)

export const BadgeCloseButton = React.forwardRef<HTMLButtonElement, Omit<CloseButtonProps, 'size' | 'className'>>(
  (props, ref) => (
    <CloseButton
      ref={ref}
      size="xs"
      className="close-button-badge"
      {...props}
    />
  )
)

ModalCloseButton.displayName = 'ModalCloseButton'
CardCloseButton.displayName = 'CardCloseButton'
InlineCloseButton.displayName = 'InlineCloseButton'
BadgeCloseButton.displayName = 'BadgeCloseButton'