import { useState, useCallback } from 'react'

interface FloatingFieldState {
  isOpen: boolean
  activeSection?: string
}

export const useFloatingField = (initialState: FloatingFieldState = { isOpen: false }) => {
  const [state, setState] = useState<FloatingFieldState>(initialState)

  const open = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }))
  }, [])

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const toggle = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }))
  }, [])

  const setActiveSection = useCallback((section?: string) => {
    setState(prev => ({ ...prev, activeSection: section }))
  }, [])

  return {
    state,
    open,
    close,
    toggle,
    setActiveSection
  }
}

interface MultiFieldState {
  [fieldId: string]: {
    isOpen: boolean
    activeSection?: string
    data?: any
  }
}

export const useMultipleFloatingFields = () => {
  const [fields, setFields] = useState<MultiFieldState>({})

  const openField = useCallback((fieldId: string) => {
    setFields(prev => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], isOpen: true }
    }))
  }, [])

  const closeField = useCallback((fieldId: string) => {
    setFields(prev => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], isOpen: false }
    }))
  }, [])

  const closeAllFields = useCallback(() => {
    setFields(prev => {
      const updated = { ...prev }
      Object.keys(updated).forEach(key => {
        updated[key] = { ...updated[key], isOpen: false }
      })
      return updated
    })
  }, [])

  const toggleField = useCallback((fieldId: string) => {
    setFields(prev => ({
      ...prev,
      [fieldId]: { 
        ...prev[fieldId], 
        isOpen: !prev[fieldId]?.isOpen 
      }
    }))
  }, [])

  const getFieldState = useCallback((fieldId: string) => {
    return fields[fieldId] || { isOpen: false }
  }, [fields])

  return {
    fields,
    openField,
    closeField,
    closeAllFields,
    toggleField,
    getFieldState
  }
}