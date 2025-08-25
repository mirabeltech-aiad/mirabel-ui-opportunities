import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { userService } from "@/features/Opportunity/Services/userService";

const FilterDataContext = createContext();

export const useFilterData = () => {
  const context = useContext(FilterDataContext);
  if (!context) {
    throw new Error("useFilterData must be used within a FilterDataProvider");
  }
  return context;
};

export const FilterDataProvider = ({ children }) => {
  const [filterData, setFilterData] = useState({
    salesReps: [],
    products: [],
    businessUnits: [],
  });

  const [loadingStates, setLoadingStates] = useState({
    salesReps: false,
    products: false,
    businessUnits: false,
  });

  const [errors, setErrors] = useState({
    salesReps: null,
    products: null,
    businessUnits: null,
  });

  const [lastFetched, setLastFetched] = useState({
    salesReps: null,
    products: null,
    businessUnits: null,
  });

  // Cache timeout: 5 minutes
  const CACHE_TIMEOUT = 5 * 60 * 1000;

  const setLoading = useCallback((type, isLoading) => {
    setLoadingStates((prev) => ({ ...prev, [type]: isLoading }));
  }, []);

  const setError = useCallback((type, error) => {
    setErrors((prev) => ({ ...prev, [type]: error }));
  }, []);

  const setData = useCallback((type, data) => {
    setFilterData((prev) => ({ ...prev, [type]: data }));
    setLastFetched((prev) => ({ ...prev, [type]: Date.now() }));
  }, []);

  const isCacheValid = useCallback(
    (type) => {
      const lastFetch = lastFetched[type];
      return lastFetch && Date.now() - lastFetch < CACHE_TIMEOUT;
    },
    [lastFetched, CACHE_TIMEOUT]
  );

  const fetchSalesReps = useCallback(
    async (forceRefresh = false) => {
      if (
        !forceRefresh &&
        isCacheValid("salesReps") &&
        filterData.salesReps.length > 0
      ) {
        console.log("Using cached sales reps");
        return filterData.salesReps;
      }

      try {
        setLoading("salesReps", true);
        setError("salesReps", null);

        console.log("Fetching sales reps from API");
        const reps = await userService.getUsersForDropdown();

        setData("salesReps", reps);
        console.log("Sales reps loaded successfully:", reps.length);
        return reps;
      } catch (error) {
        console.error("Failed to fetch sales reps:", error);
        setError("salesReps", error.message);
        throw error;
      } finally {
        setLoading("salesReps", false);
      }
    },
    [filterData.salesReps, isCacheValid, setLoading, setError, setData]
  );

  const fetchProducts = useCallback(
    async (forceRefresh = false) => {
      if (
        !forceRefresh &&
        isCacheValid("products") &&
        filterData.products.length > 0
      ) {
        console.log("Using cached products");
        return filterData.products;
      }

      try {
        setLoading("products", true);
        setError("products", null);

        console.log("Fetching products from API");
        const products = await userService.getProducts();

        setData("products", products);
        console.log("Products loaded successfully:", products.length);
        return products;
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("products", error.message);
        throw error;
      } finally {
        setLoading("products", false);
      }
    },
    [filterData.products, isCacheValid, setLoading, setError, setData]
  );

  const fetchBusinessUnits = useCallback(
    async (forceRefresh = false) => {
      if (
        !forceRefresh &&
        isCacheValid("businessUnits") &&
        filterData.businessUnits.length > 0
      ) {
        console.log("Using cached business units");
        return filterData.businessUnits;
      }

      try {
        setLoading("businessUnits", true);
        setError("businessUnits", null);

        console.log("Fetching business units from API");
        const businessUnits = await userService.getBusinessUnits();

        setData("businessUnits", businessUnits);
        console.log(
          "Business units loaded successfully:",
          businessUnits.length
        );
        return businessUnits;
      } catch (error) {
        console.error("Failed to fetch business units:", error);
        setError("businessUnits", error.message);
        throw error;
      } finally {
        setLoading("businessUnits", false);
      }
    },
    [filterData.businessUnits, isCacheValid, setLoading, setError, setData]
  );

  const refreshAllData = useCallback(async () => {
    console.log("Refreshing all filter data");
    try {
      await Promise.all([
        fetchSalesReps(true),
        fetchProducts(true),
        fetchBusinessUnits(true),
      ]);
      console.log("All filter data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing filter data:", error);
    }
  }, [fetchSalesReps, fetchProducts, fetchBusinessUnits]);

  // Initial load on mount
  useEffect(() => {
    console.log("FilterDataProvider: Initial load of filter data");
    Promise.all([
      fetchSalesReps(),
      fetchProducts(),
      fetchBusinessUnits(),
    ]).catch((error) => {
      console.error("Error during initial filter data load:", error);
    });
  }, [fetchSalesReps, fetchProducts, fetchBusinessUnits]);

  // Prepare options for dropdowns
  const salesRepOptions = [
    { value: "all", label: "All Sales Reps" },
    ...filterData.salesReps.map((rep) => ({
      value: rep.value,
      label: rep.display,
    })),
  ];

  const productOptions = [
    { value: "all", label: "All Products" },
    ...filterData.products.map((product) => ({
      value: product.value,
      label: product.label,
    })),
  ];

  const businessUnitOptions = [
    { value: "all", label: "All Business Units" },
    ...filterData.businessUnits.map((unit) => ({
      value: unit.value,
      label: unit.label,
    })),
  ];

  const value = {
    // Raw data
    filterData,

    // Formatted options for dropdowns
    salesRepOptions,
    productOptions,
    businessUnitOptions,

    // Loading states
    loadingStates,

    // Errors
    errors,

    // Methods
    fetchSalesReps,
    fetchProducts,
    fetchBusinessUnits,
    refreshAllData,

    // Computed states
    isLoading:
      loadingStates.salesReps ||
      loadingStates.products ||
      loadingStates.businessUnits,
    hasErrors:
      !!errors.salesReps || !!errors.products || !!errors.businessUnits,
  };

  return (
    <FilterDataContext.Provider value={value}>
      {children}
    </FilterDataContext.Provider>
  );
};
