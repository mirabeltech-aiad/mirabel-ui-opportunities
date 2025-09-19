import React, { useState, useMemo } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'
import { Button } from './button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface AccordionSection<T = any> {
  id: string
  title: string
  items: T[]
  accentColor?: string
  badges?: Array<{
    text: string
    className: string
  }>
}

interface StandardAccordionViewProps<T = any> {
  sections: AccordionSection<T>[]
  renderContent: (items: T[], sectionId: string) => React.ReactNode
  title?: string
  description?: string
  showExpandCollapseAll?: boolean
  expandCollapseAllText?: {
    expand: string
    collapse: string
  }
  className?: string
  onSectionToggle?: (sectionId: string, isExpanded: boolean) => void
  defaultExpandedSections?: string[]
  emptyStateMessage?: string
}

const StandardAccordionView = <T,>({
  sections,
  renderContent,
  title,
  description,
  showExpandCollapseAll = true,
  expandCollapseAllText = {
    expand: 'Expand All',
    collapse: 'Collapse All'
  },
  className = '',
  onSectionToggle,
  defaultExpandedSections = [],
  emptyStateMessage = 'No items found'
}: StandardAccordionViewProps<T>) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(defaultExpandedSections)
  )
  const [isAllExpanded, setIsAllExpanded] = useState(
    defaultExpandedSections.length === sections.length
  )

  const handleExpandCollapseAll = () => {
    if (isAllExpanded) {
      setExpandedSections(new Set())
      setIsAllExpanded(false)
    } else {
      setExpandedSections(new Set(sections.map(section => section.id)))
      setIsAllExpanded(true)
    }
  }

  const handleValueChange = (value: string[]) => {
    const newExpandedSections = new Set(value)
    setExpandedSections(newExpandedSections)
    setIsAllExpanded(value.length === sections.length)
    
    // Call onSectionToggle for each changed section
    if (onSectionToggle) {
      sections.forEach(section => {
        const wasExpanded = expandedSections.has(section.id)
        const isExpanded = newExpandedSections.has(section.id)
        if (wasExpanded !== isExpanded) {
          onSectionToggle(section.id, isExpanded)
        }
      })
    }
  }

  // Default accent colors for sections
  const getDefaultAccentColor = (index: number): string => {
    const colors = [
      'bg-green-500',    // First section
      'bg-blue-500',     // Second section  
      'bg-yellow-500',   // Third section
      'bg-purple-500',   // Fourth section
      'bg-orange-500',   // Fifth section
      'bg-pink-500',     // Sixth section
      'bg-indigo-500',   // Seventh section
      'bg-red-500',      // Eighth section
    ]
    return colors[index % colors.length]
  }

  if (sections.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        {emptyStateMessage}
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Page Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-bold text-ocean-800 mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Sections Panel */}
      <div>
        {/* Expand/Collapse All Control */}
        {showExpandCollapseAll && (
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              onClick={handleExpandCollapseAll}
              className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-base font-normal"
            >
              {isAllExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  {expandCollapseAllText.collapse}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  {expandCollapseAllText.expand}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Accordion Sections */}
        <Accordion
          type="multiple"
          value={Array.from(expandedSections)}
          onValueChange={handleValueChange}
          className="space-y-2"
        >
          {sections.map((section, index) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="bg-white border-b border-gray-200"
            >
              <AccordionTrigger className="flex items-center w-full py-4 px-4 text-ocean-800 text-base leading-6 font-normal hover:no-underline">
                <div className="flex items-center flex-1">
                  <div 
                    className={`w-1 h-6 rounded-full mr-3 ${
                      section.accentColor || getDefaultAccentColor(index)
                    }`} 
                  />
                  <span className="flex-1 text-left">
                    {section.title} ({section.items.length})
                  </span>
                  {section.badges && section.badges.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      {section.badges.map((badge, badgeIndex) => (
                        <span
                          key={badgeIndex}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}
                        >
                          {badge.text}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-0 pb-4">
                <div className="overflow-hidden">
                  {renderContent(section.items, section.id)}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default StandardAccordionView
export type { AccordionSection, StandardAccordionViewProps }