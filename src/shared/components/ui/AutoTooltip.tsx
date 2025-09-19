import React from 'react'
import { Tooltip } from './tooltip'
import { Info } from 'lucide-react'

interface AutoTooltipProps {
  children: React.ReactElement
  content?: string
  type?: 'metric' | 'abbreviation' | 'technical' | 'field' | 'status' | 'custom'
  value?: string | number
  unit?: string
  calculation?: string
  definition?: string
  className?: string
}

/**
 * AutoTooltip component that automatically generates explanatory tooltips
 * based on the comprehensive tooltip implementation guide.
 * 
 * Follows the rule: EXPLANATORY ONLY - explains what something IS or MEANS
 */
export const AutoTooltip: React.FC<AutoTooltipProps> = ({
  children,
  content,
  type = 'custom',
  value,
  unit,
  calculation,
  definition,
  className
}) => {
  const generateTooltipContent = (): string => {
    if (content) return content

    switch (type) {
      case 'metric':
        if (calculation) {
          return `${definition || 'Metric'} calculated as ${calculation}`
        }
        if (unit) {
          return `${definition || 'Value'} measured in ${unit}`
        }
        return definition || 'Performance metric'

      case 'abbreviation':
        return definition || 'Abbreviated term'

      case 'technical':
        return definition || 'Technical specification'

      case 'field':
        return definition || 'Form field explanation'

      case 'status':
        return definition || 'Current status indicator'

      default:
        return definition || 'Additional information'
    }
  }

  const tooltipContent = generateTooltipContent()

  // Don't render tooltip if no meaningful content
  if (!tooltipContent || tooltipContent.trim() === '') {
    return children
  }

  return (
    <Tooltip content={tooltipContent} theme="default" className={className}>
      {children}
    </Tooltip>
  )
}

// Convenience components for common patterns
export const MetricTooltip: React.FC<{
  children: React.ReactElement
  metric: string
  calculation?: string
  unit?: string
}> = ({ children, metric, calculation, unit }) => (
  <AutoTooltip
    type="metric"
    definition={metric}
    calculation={calculation}
    unit={unit}
  >
    {children}
  </AutoTooltip>
)

export const AbbreviationTooltip: React.FC<{
  children: React.ReactElement
  abbreviation: string
  fullForm: string
  definition?: string
}> = ({ children, abbreviation, fullForm, definition }) => (
  <AutoTooltip
    type="abbreviation"
    definition={`${abbreviation}: ${fullForm}${definition ? ` - ${definition}` : ''}`}
  >
    {children}
  </AutoTooltip>
)

export const TechnicalTooltip: React.FC<{
  children: React.ReactElement
  term: string
  definition: string
}> = ({ children, term, definition }) => (
  <AutoTooltip
    type="technical"
    definition={`${term} - ${definition}`}
  >
    {children}
  </AutoTooltip>
)

export const StatusTooltip: React.FC<{
  children: React.ReactElement
  status: string
  meaning: string
}> = ({ children, status, meaning }) => (
  <AutoTooltip
    type="status"
    definition={`${status} status means ${meaning}`}
  >
    {children}
  </AutoTooltip>
)

// Helper component for adding info icons with tooltips
export const InfoTooltip: React.FC<{
  content: string
  className?: string
}> = ({ content, className }) => (
  <AutoTooltip content={content} className={className}>
    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
  </AutoTooltip>
)

export default AutoTooltip