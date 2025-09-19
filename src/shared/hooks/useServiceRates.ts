import { useState, useEffect } from 'react'

export interface ServiceRate {
  value: string
  label: string
  rate: number
}

const DEFAULT_SERVICE_RATES: ServiceRate[] = [
  { value: 'development', label: 'Development', rate: 100 },
  { value: 'design', label: 'Design', rate: 80 },
  { value: 'consulting', label: 'Consulting', rate: 120 },
  { value: 'training', label: 'Training', rate: 90 }
]

export const useServiceRates = () => {
  const [serviceRates, setServiceRates] = useState<ServiceRate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServiceRates = () => {
      try {
        const stored = localStorage.getItem('time-tracking-service-rates')
        if (stored) {
          const parsed = JSON.parse(stored)
          setServiceRates(parsed)
        } else {
          setServiceRates([...DEFAULT_SERVICE_RATES])
        }
      } catch (error) {
        console.error('Failed to load service rates:', error)
        setServiceRates([...DEFAULT_SERVICE_RATES])
      } finally {
        setLoading(false)
      }
    }

    loadServiceRates()
  }, [])

  const getServiceRate = (serviceType: string): number => {
    const service = serviceRates.find(rate => rate.value === serviceType)
    return service?.rate || 0
  }

  const getServiceOptions = () => {
    return serviceRates.map(rate => ({
      value: rate.value,
      label: rate.label
    }))
  }

  const calculateBillingAmount = (hours: number, serviceType: string): number => {
    const rate = getServiceRate(serviceType)
    return hours * rate
  }

  return {
    serviceRates,
    loading,
    getServiceRate,
    getServiceOptions,
    calculateBillingAmount
  }
}

export default useServiceRates