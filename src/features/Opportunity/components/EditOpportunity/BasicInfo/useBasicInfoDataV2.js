import { useState, useEffect } from 'react';
import {
  useBusinessUnitsDropdown,
  useProductsDropdown,
  useUsersDropdown,
  useContactsDropdown,
  useOpportunityTypesDropdown,
  useLossReasonsDropdown,
  useStagesDropdown
} from '@/hooks/useSearchableDropdown';

/**
 * Updated useBasicInfoData hook using the new unified API system
 * This provides consistent response handling and search functionality
 */
export const useBasicInfoData = (formData, isAddMode, isCustomerSelected) => {
  // Use the new searchable dropdown hooks
  const businessUnits = useBusinessUnitsDropdown();
  const products = useProductsDropdown(formData.businessUnitId || '');
  const users = useUsersDropdown();
  const contacts = useContactsDropdown(formData.customerId);
  const opportunityTypes = useOpportunityTypesDropdown();
  const lossReasons = useLossReasonsDropdown();
  const stages = useStagesDropdown();

  // Additional state for UI feedback
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on mount
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Refresh products when business unit changes
  useEffect(() => {
    if (formData.businessUnitId && products.refreshOptions) {
      products.refreshOptions();
    }
  }, [formData.businessUnitId]);

  // Refresh contacts when customer changes in add mode
  useEffect(() => {
    if (isAddMode && formData.customerId && contacts.refreshOptions) {
      contacts.refreshOptions();
    }
  }, [isAddMode, formData.customerId]);

  return {
    // Contact options (for Add mode)
    contactOptions: contacts.options,
    isLoadingContacts: contacts.loading,
    searchContacts: contacts.handleSearch,
    hasContactError: !!contacts.error,

    // Opportunity Types
    apiOpportunityTypes: opportunityTypes.options,
    isLoadingOpportunityTypes: opportunityTypes.loading,
    searchOpportunityTypes: opportunityTypes.handleSearch,
    refreshOpportunityTypes: opportunityTypes.refreshOptions,

    // Business Units
    apiBusinessUnits: businessUnits.options,
    isLoadingBusinessUnits: businessUnits.loading,
    searchBusinessUnits: businessUnits.handleSearch,
    refreshBusinessUnits: businessUnits.refreshOptions,

    // Products (dependent on business unit)
    apiProducts: products.options,
    isLoadingProducts: products.loading,
    searchProducts: products.handleSearch,
    refreshProducts: products.refreshOptions,
    hasProductsForBusinessUnit: products.hasOptions,

    // Users/Sales Reps
    apiUsers: users.options,
    isLoadingUsers: users.loading,
    searchUsers: users.handleSearch,
    refreshUsers: users.refreshOptions,

    // Loss Reasons
    apiLossReasons: lossReasons.options,
    isLoadingLossReasons: lossReasons.loading,
    searchLossReasons: lossReasons.handleSearch,
    refreshLossReasons: lossReasons.refreshOptions,

    // Stages
    apiStages: stages.options,
    isLoadingStages: stages.loading,
    searchStages: stages.handleSearch,
    refreshStages: stages.refreshOptions,

    // Overall loading state
    isLoading: 
      businessUnits.loading || 
      products.loading || 
      users.loading || 
      opportunityTypes.loading || 
      lossReasons.loading || 
      stages.loading,

    // Overall error state
    hasError: 
      !!businessUnits.error || 
      !!products.error || 
      !!users.error || 
      !!contacts.error || 
      !!opportunityTypes.error || 
      !!lossReasons.error || 
      !!stages.error,

    // Error messages
    errors: {
      businessUnits: businessUnits.error,
      products: products.error,
      users: users.error,
      contacts: contacts.error,
      opportunityTypes: opportunityTypes.error,
      lossReasons: lossReasons.error,
      stages: stages.error
    },

    // Utility functions
    getBusinessUnitById: businessUnits.getOptionByValue,
    getProductById: products.getOptionByValue,
    getUserById: users.getOptionByValue,
    getContactById: contacts.getOptionByValue,
    getOpportunityTypeById: opportunityTypes.getOptionByValue,
    getLossReasonById: lossReasons.getOptionByValue,
    getStageById: stages.getOptionByValue,

    // Refresh all data
    refreshAllData: () => {
      businessUnits.refreshOptions();
      products.refreshOptions();
      users.refreshOptions();
      opportunityTypes.refreshOptions();
      lossReasons.refreshOptions();
      stages.refreshOptions();
      if (formData.customerId) {
        contacts.refreshOptions();
      }
    },

    // Initialization state
    isInitialized
  };
};

export default useBasicInfoData;