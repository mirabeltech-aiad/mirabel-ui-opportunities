import React, { useState, useEffect, useRef } from 'react'
import { Button } from './button'
import { X } from 'lucide-react'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface SheetContentProps {
  side?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
  children: React.ReactNode
}

interface SheetHeaderProps {
  children: React.ReactNode
  className?: string
}

interface SheetTitleProps {
  children: React.ReactNode
  className?: string
}

interface SheetTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

// Context for sheet state
const SheetContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {}
})

export const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

export const SheetTrigger: React.FC<SheetTriggerProps> = ({ asChild = false, children }) => {
  const { onOpenChange } = React.useContext(SheetContext)
  
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => onOpenChange(true)
    })
  }

  return (
    <Button onClick={() => onOpenChange(true)}>
      {children}
    </Button>
  )
}

export const SheetContent: React.FC<SheetContentProps> = ({ 
  side = 'right', 
  className = '', 
  children 
}) => {
  const { open, onOpenChange } = React.useContext(SheetContext)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      // Don't close if clicking on a dropdown or modal
      if (target.closest('[data-dropdown]') || target.closest('[data-modal]')) {
        return
      }
      
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [open, onOpenChange])

  if (!open) return null

  const sideClasses = {
    left: 'left-0 top-0 h-full w-80 sm:w-96',
    right: 'right-0 top-0 h-full w-80 sm:w-96 lg:w-[540px]',
    top: 'top-0 left-0 w-full h-80',
    bottom: 'bottom-0 left-0 w-full h-80'
  }

  const slideClasses = {
    left: 'animate-slide-in-from-left',
    right: 'animate-slide-in-from-right',
    top: 'animate-slide-in-from-top',
    bottom: 'animate-slide-in-from-bottom'
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      
      {/* Sheet Content */}
      <div
        ref={contentRef}
        className={`
          fixed z-50 bg-white shadow-lg border-l border-slate-200
          ${sideClasses[side]}
          ${slideClasses[side]}
          ${className}
        `}
      >
        {children}
      </div>
    </>
  )
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-between p-6 border-b border-slate-200 ${className}`}>
      {children}
    </div>
  )
}

export const SheetTitle: React.FC<SheetTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-lg font-semibold text-ocean-800 ${className}`}>
      {children}
    </h2>
  )
}

export const SheetClose: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { onOpenChange } = React.useContext(SheetContext)
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onOpenChange(false)}
      className={`h-10 w-10 p-2 rounded-full hover:bg-gray-100 hover:scale-110 transition-all duration-200 ${className}`}
    >
      <X className="close-button-md" />
    </Button>
  )
}