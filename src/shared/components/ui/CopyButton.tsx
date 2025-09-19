import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Tooltip } from '@/shared/components/ui/tooltip'

interface CopyButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'xs'
}

export const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  className = '', 
  size = 'xs' 
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const sizeClasses = {
    xs: 'h-6 w-6 p-0',
    sm: 'h-8 w-8 p-0'
  }

  const iconSizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4'
  }

  return (
    <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'} theme="default">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className={`${sizeClasses[size]} hover:bg-gray-100 transition-colors duration-200 ${className}`}
      >
        {copied ? (
          <Check className={`${iconSizeClasses[size]} text-green-600`} />
        ) : (
          <Copy className={`${iconSizeClasses[size]} text-gray-500`} />
        )}
      </Button>
    </Tooltip>
  )
}