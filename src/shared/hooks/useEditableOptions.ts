import { useState, useEffect } from 'react'

interface Option {
  value: string
  label: string
}

interface UseEditableOptionsProps {
  storageKey: string
  defaultOptions: Option[]
}

export function useEditableOptions({ storageKey, defaultOptions }: UseEditableOptionsProps) {
  const [options, setOptions] = useState<Option[]>(defaultOptions)
  const [isAdding, setIsAdding] = useState(false)
  const [newOptionLabel, setNewOptionLabel] = useState('')

  // Load options from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsedOptions = JSON.parse(stored)
        setOptions(parsedOptions)
      } catch (error) {
        console.error('Failed to parse stored options:', error)
        setOptions(defaultOptions)
      }
    }
  }, [storageKey, defaultOptions])

  // Save options to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(options))
  }, [options, storageKey])

  const addOption = (label: string) => {
    if (!label.trim()) return false

    const value = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    // Check if option already exists
    if (options.some(opt => opt.value === value || opt.label.toLowerCase() === label.toLowerCase())) {
      return false
    }

    const newOption = { value, label: label.trim() }
    setOptions(prev => [...prev, newOption])
    return true
  }

  const removeOption = (valueToRemove: string) => {
    setOptions(prev => prev.filter(opt => opt.value !== valueToRemove))
  }

  const startAdding = () => {
    setIsAdding(true)
    setNewOptionLabel('')
  }

  const cancelAdding = () => {
    setIsAdding(false)
    setNewOptionLabel('')
  }

  const confirmAdd = () => {
    if (addOption(newOptionLabel)) {
      setIsAdding(false)
      setNewOptionLabel('')
      return true
    }
    return false
  }

  return {
    options,
    isAdding,
    newOptionLabel,
    setNewOptionLabel,
    startAdding,
    cancelAdding,
    confirmAdd,
    addOption,
    removeOption
  }
}