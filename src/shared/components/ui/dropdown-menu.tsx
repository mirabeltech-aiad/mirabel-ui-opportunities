import React, { useState, useRef, useEffect } from 'react'
import { Button } from './button'

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

interface DropdownMenuContentProps {
  align?: 'start' | 'center' | 'end'
  className?: string
  children: React.ReactNode
}

interface DropdownMenuItemProps {
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

interface DropdownMenuLabelProps {
  className?: string
  children: React.ReactNode
}

interface DropdownMenuSeparatorProps {
  className?: string
}

interface DropdownMenuRadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

interface DropdownMenuRadioItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

// Context for dropdown state
const DropdownContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  radioValue?: string
  onRadioValueChange?: (value: string) => void
}>({
  isOpen: false,
  setIsOpen: () => {}
})

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [radioValue, setRadioValue] = useState('')
  const [onRadioValueChange, setOnRadioValueChange] = useState<((value: string) => void) | undefined>()

  return (
    <DropdownContext.Provider value={{ 
      isOpen, 
      setIsOpen, 
      radioValue, 
      onRadioValueChange 
    }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ 
  asChild = false, 
  children 
}) => {
  const { isOpen, setIsOpen } = React.useContext(DropdownContext)
  
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => setIsOpen(!isOpen)
    })
  }

  return (
    <Button onClick={() => setIsOpen(!isOpen)}>
      {children}
    </Button>
  )
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ 
  align = 'start', 
  className = '', 
  children 
}) => {
  const { isOpen, setIsOpen } = React.useContext(DropdownContext)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  if (!isOpen) return null

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0'
  }

  return (
    <div
      ref={contentRef}
      className={`
        absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 shadow-lg
        ${alignmentClasses[align]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ 
  className = '', 
  onClick, 
  children 
}) => {
  const { setIsOpen } = React.useContext(DropdownContext)

  const handleClick = () => {
    onClick?.()
    setIsOpen(false)
  }

  return (
    <div
      className={`
        relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
        hover:bg-slate-100 focus:bg-slate-100 transition-colors
        ${className}
      `}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

export const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`px-2 py-1.5 text-sm font-semibold ${className}`}>
      {children}
    </div>
  )
}

export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({ 
  className = '' 
}) => {
  return <div className={`-mx-1 my-1 h-px bg-slate-200 ${className}`} />
}

export const DropdownMenuRadioGroup: React.FC<DropdownMenuRadioGroupProps> = ({ 
  value, 
  onValueChange, 
  children 
}) => {
  const context = React.useContext(DropdownContext)
  
  // Update context with radio group state
  React.useEffect(() => {
    context.radioValue = value
    context.onRadioValueChange = onValueChange
  }, [value, onValueChange])

  return <>{children}</>
}

export const DropdownMenuRadioItem: React.FC<DropdownMenuRadioItemProps> = ({ 
  value, 
  className = '', 
  children 
}) => {
  const { radioValue, onRadioValueChange, setIsOpen } = React.useContext(DropdownContext)
  const isSelected = radioValue === value

  const handleClick = () => {
    onRadioValueChange?.(value)
    setIsOpen(false)
  }

  return (
    <div
      className={`
        relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
        hover:bg-slate-100 focus:bg-slate-100 transition-colors
        ${isSelected ? 'bg-ocean-50 text-ocean-900' : ''}
        ${className}
      `}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className="mr-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && (
            <div className="h-2 w-2 rounded-full bg-ocean-600" />
          )}
        </div>
        {children}
      </div>
    </div>
  )
}