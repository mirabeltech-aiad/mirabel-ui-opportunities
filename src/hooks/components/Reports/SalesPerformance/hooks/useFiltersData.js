
import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';

export const useFiltersData = () => {
  const [salesReps, setSalesReps] = useState([]);
  const [products, setProducts] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllFiltersData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [salesRepsData, productsData, businessUnitsData] = await Promise.all([
          userService.getUsersForDropdown(),
          userService.getProducts(),
          userService.getBusinessUnits()
        ]);

        console.log('Sales reps data:', salesRepsData);
        console.log('Products data:', productsData);
        console.log('Business units data:', businessUnitsData);

        setSalesReps(salesRepsData || []);
        setProducts(productsData || []);
        setBusinessUnits(businessUnitsData || []);
      } catch (err) {
        console.error('Error fetching filters data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllFiltersData();
  }, []);

  return {
    salesReps,
    products,
    businessUnits,
    isLoading,
    error
  };
};
