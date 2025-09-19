import React from 'react'
import { CopyButton } from './CopyButton'

interface DocumentationLinkProps {
  path: string
  className?: string
  prefix?: string
}

export const DocumentationLink: React.FC<DocumentationLinkProps> = ({ 
  path, 
  className = '',
  prefix = '📁 Documentation: '
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-blue-600">
        {prefix}<code>{path}</code>
      </span>
      <CopyButton text={path} size="xs" />
    </div>
  )
}

interface DocumentationListItemProps {
  path: string
  className?: string
}

export const DocumentationListItem: React.FC<DocumentationListItemProps> = ({ 
  path, 
  className = '' 
}) => {
  return (
    <li className={`flex items-center justify-between ${className}`}>
      <code className="text-gray-600">{path}</code>
      <CopyButton text={path} size="xs" />
    </li>
  )
}