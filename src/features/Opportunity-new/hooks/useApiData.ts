import { useState, useEffect } from 'react';
import axiosService from '@/services/axiosService';
// Simplified types for API data

interface LoadingState {
  opportunityTypes: boolean;
  stages: boolean;
  businessUnits: boolean;
  products: boolean;
  users: boolean;
  contacts: boolean;
  lossReasons: boolean;
}

export const useApiData = () => {
  // Data state
  const [opportunityTypes, setOpportunityTypes] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [businessUnits, setBusinessUnits] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [lossReasons, setLossReasons] = useState<any[]>([]);

  // Loading state
  const [isLoading, setIsLoading] = useState<LoadingState>({
    opportunityTypes: false,
    stages: false,
    businessUnits: false,
    products: false,
    users: false,
    contacts: false,
    lossReasons: false
  });

  // Load opportunity types
  useEffect(() => {
    const loadOpportunityTypes = async () => {
      setIsLoading(prev => ({ ...prev, opportunityTypes: true }));
      try {
        const response = await axiosService.get('/services/Admin/Masters/OpportunityType');
        if (response?.content && Array.isArray(response.content)) {
          setOpportunityTypes(response.content);
        }
      } catch (error) {
        console.error('Failed to load opportunity types:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, opportunityTypes: false }));
      }
    };

    loadOpportunityTypes();
  }, []);

  // Load stages
  useEffect(() => {
    const loadStages = async () => {
      setIsLoading(prev => ({ ...prev, stages: true }));
      try {
        const response = await axiosService.get('/services/Admin/Masters/OpportunityStages');
        if (response?.content && Array.isArray(response.content)) {
          setStages(response.content);
        }
      } catch (error) {
        console.error('Failed to load stages:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, stages: false }));
      }
    };

    loadStages();
  }, []);

  // Load business units
  useEffect(() => {
    const loadBusinessUnits = async () => {
      setIsLoading(prev => ({ ...prev, businessUnits: true }));
      try {
        const response = await axiosService.get('/services/Admin/Masters/BusinessUnit');
        if (response?.content && Array.isArray(response.content)) {
          setBusinessUnits(response.content);
        }
      } catch (error) {
        console.error('Failed to load business units:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, businessUnits: false }));
      }
    };

    loadBusinessUnits();
  }, []);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(prev => ({ ...prev, products: true }));
      try {
        const response = await axiosService.get('/services/Admin/Masters/Product');
        if (response?.content && Array.isArray(response.content)) {
          setProducts(response.content);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, products: false }));
      }
    };

    loadProducts();
  }, []);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(prev => ({ ...prev, users: true }));
      try {
        const response = await axiosService.get('/services/User/Accounts/Master/1/false/true');
        if (response?.content && Array.isArray(response.content)) {
          setUsers(response.content);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, users: false }));
      }
    };

    loadUsers();
  }, []);

  // Load contacts (placeholder - would need actual endpoint)
  useEffect(() => {
    const loadContacts = async () => {
      setIsLoading(prev => ({ ...prev, contacts: true }));
      try {
        // This would be replaced with actual contact endpoint
        // const response = await axiosService.get('/services/Contacts/Master');
        // For now, using empty array
        setContacts([]);
      } catch (error) {
        console.error('Failed to load contacts:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, contacts: false }));
      }
    };

    loadContacts();
  }, []);

  // Load loss reasons
  useEffect(() => {
    const loadLossReasons = async () => {
      setIsLoading(prev => ({ ...prev, lossReasons: true }));
      try {
        const response = await axiosService.get('/services/Admin/Masters/OpportunityLossReason');
        if (response?.content && Array.isArray(response.content)) {
          setLossReasons(response.content);
        }
      } catch (error) {
        console.error('Failed to load loss reasons:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, lossReasons: false }));
      }
    };

    loadLossReasons();
  }, []);

  return {
    opportunityTypes,
    stages,
    businessUnits,
    products,
    users,
    contacts,
    lossReasons,
    isLoading
  };
};

// Default export as well
export default useApiData;