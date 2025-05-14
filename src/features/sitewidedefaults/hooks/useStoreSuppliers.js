import { useStoreSupply } from '../context/StoreSupplyContext';

/**
 * Custom hook for working with store suppliers
 * Provides supplier-specific state and functions
 */
export const useStoreSuppliers = () => {
  const { 
    storeSupply, 
    updateSuppliers,
    isLoading, 
    error 
  } = useStoreSupply();
  
  // Extract suppliers data from the store supply state
  const suppliers = storeSupply.suppliers;
  
  // Function to add a preferred supplier
  const addPreferredSupplier = (supplier) => {
    if (!supplier || suppliers.preferredSuppliers.includes(supplier)) {
      return;
    }
    
    updateSuppliers({
      preferredSuppliers: [...suppliers.preferredSuppliers, supplier]
    });
  };
  
  // Function to remove a preferred supplier
  const removePreferredSupplier = (supplierToRemove) => {
    updateSuppliers({
      preferredSuppliers: suppliers.preferredSuppliers.filter(
        supplier => supplier !== supplierToRemove
      )
    });
  };
  
  // Function to update lead time for a supplier
  const updateLeadTime = (supplier, leadTime) => {
    updateSuppliers({
      leadTimes: {
        ...suppliers.leadTimes,
        [supplier]: Number(leadTime)
      }
    });
  };
  
  // Function to update minimum order quantity for a supplier
  const updateMinimumOrderQuantity = (supplier, quantity) => {
    updateSuppliers({
      minimumOrderQuantities: {
        ...suppliers.minimumOrderQuantities,
        [supplier]: Number(quantity)
      }
    });
  };
  
  return {
    suppliers,
    isLoading,
    error,
    updateSuppliers,
    addPreferredSupplier,
    removePreferredSupplier,
    updateLeadTime,
    updateMinimumOrderQuantity
  };
}; 