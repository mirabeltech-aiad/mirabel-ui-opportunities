import React from 'react'
import { cn } from '../../utils/cn'

interface DropdownSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export const DropdownSection: React.FC<DropdownSectionProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <div className={cn("px-3 py-2", className)} role="group">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        {title}
      </h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}

export const DropdownSeparator: React.FC = () => {
  return <div className="mx-3 my-2 border-t border-gray-200" />
}