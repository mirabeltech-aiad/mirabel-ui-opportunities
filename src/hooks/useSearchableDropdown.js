import { useState, useEffect, useCallback } from 'react';
import axiosService from '@/services/axiosService';
import { API_URLS } from '@/utils/apiUrls';

// Generic, minimal searchable dropdown hook
const createDropdownHook = (endpointOrFn) => () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = typeof endpointOrFn === 'function' ? endpointOrFn() : endpointOrFn;
      const res = await axiosService.get(endpoint);
      
      const root = res?.content ?? res ?? {};
      const list = root?.Data?.ProspectingStages || root?.Data?.List || root?.List || root?.Data ||  [];

      const mapped = (Array.isArray(list) ? list : []).map((item) => ({
        id: item.ID ?? item.Id ?? item.Value ?? item.value,
        name: item.Stage ?? item.Name ?? item.Display ?? item.label ?? '',
        value: String(
          item.Value ?? item.ID ?? item.Id ?? item.value ?? item.Name ?? item.Display ?? ''
        ),
        label: item.Stage ?? item.Name ?? item.Display ?? item.label ?? '',
        colorCode: item.ColorCode ?? item.colorCode,
        percentClosed: item.PercentClosed ?? item.percentClosed
      }));
      console.log("mapped", mapped);
      setOptions(mapped);
    } catch (e) {
      setError(e?.message || 'Failed to load options');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const handleSearch = useCallback(async () => {
    // Server-side search can be added here if needed
    return;
  }, []);

  const refreshOptions = useCallback(() => {
    fetchOptions();
  }, [fetchOptions]);

  const hasOptions = options && options.length > 0;

  const getOptionByValue = useCallback(
    (v) => options.find((o) => String(o.value) === String(v)),
    [options]
  );

  return { options, loading, error, handleSearch, refreshOptions, hasOptions, getOptionByValue };
};

// Specific dropdowns used around Opportunity module
export const useStagesDropdown = createDropdownHook(API_URLS.ADMIN.OPPORTUNITY_STAGES);
export const useBusinessUnitsDropdown = createDropdownHook(API_URLS.MASTERS.BUSINESS_UNIT);
export const useProductsDropdown = (/* businessUnitId */) => createDropdownHook(API_URLS.ADMIN.PRODUCTS_MASTER)();
export const useUsersDropdown = createDropdownHook(API_URLS.USER.ACCOUNTS_MASTER(1));
export const useContactsDropdown = (/* customerId */) => createDropdownHook(API_URLS.CONTACTS.DISTINCT_CUSTOMERS)();
export const useOpportunityTypesDropdown = createDropdownHook(API_URLS.ADMIN.OPPORTUNITY_TYPES);
export const useLossReasonsDropdown = createDropdownHook(API_URLS.ADMIN.OPPORTUNITY_LOSS_REASONS);

export default useStagesDropdown;


