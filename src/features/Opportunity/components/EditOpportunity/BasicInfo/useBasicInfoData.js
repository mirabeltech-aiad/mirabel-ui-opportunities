import React, { useState, useEffect } from "react";
import { opportunitiesService } from "@/features/Opportunity/Services/opportunitiesService";
import apiService from "@/features/Opportunity/Services/apiService";

// Helper function to extract List from different response structures
const extractListFromResponse = (response, listName = 'List') => {
  if (response && response[listName]) {
    return response[listName];
  } else if (response && Array.isArray(response)) {
    return response;
  } else if (response && response.data && response.data[listName]) {
    return response.data[listName];
  } else if (response && response.content && response.content[listName]) {
    return response.content[listName];
  }
  return [];
};

export const useBasicInfoData = (formData, isAddMode, isCustomerSelected, isProposalLinkedFieldsDisabled = false) => {
  const [contactOptions, setContactOptions] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [apiOpportunityTypes, setApiOpportunityTypes] = useState([]);
  const [isLoadingOpportunityTypes, setIsLoadingOpportunityTypes] = useState(false);
  const [apiBusinessUnits, setApiBusinessUnits] = useState([]);
  const [isLoadingBusinessUnits, setIsLoadingBusinessUnits] = useState(false);
  const [apiProducts, setApiProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [apiUsers, setApiUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [apiLossReasons, setApiLossReasons] = useState([]);
  const [isLoadingLossReasons, setIsLoadingLossReasons] = useState(false);
  const [apiStages, setApiStages] = useState([]);
  const [isLoadingStages, setIsLoadingStages] = useState(false);

  // Add derived values that were missing
  const businessUnitOptionsToUse = apiBusinessUnits;
  const productOptionsToUse = apiProducts;
  const userOptionsToUse = apiUsers;

  // Check if fields should be disabled based on customer selection in Add mode
  const shouldDisableFields = isAddMode && !isCustomerSelected;

  // Check if specific fields should be disabled due to proposal linking
  const shouldDisableProposalLinkedFields = (fieldName) => {
    if (!isProposalLinkedFieldsDisabled) return false;

    // Fields that should be disabled when proposals are linked
    const proposalLinkedFields = ['amount', 'product', 'businessUnit'];
    return proposalLinkedFields.includes(fieldName);
  };

  const addModeStatusOptions = [
    { value: "Open", label: "Open" },
    { value: "Won", label: "Won" },
    { value: "Lost", label: "Lost" }
  ];

  // Fetch contact names when component mounts or when customer is selected in Add Mode
  useEffect(() => {
    const fetchContactNames = async () => {
      //if (!isAddMode) return;
     
      if (!(formData.customerId || formData.contactDetails.ID)) {
        setContactOptions([]);
        return;
      }

      try {
        setIsLoadingContacts(true);
        
        const rawResponse = await apiService.getContactNames(formData.customerId || formData.contactDetails.ID);
        const response = rawResponse?.content;
        // const response = await apiService.getContactNames(formData.customerId);

        if (response && response.List) {
          const contacts = response.List.map(contact => ({
            value: contact.ContactFullName,
            label: contact.ContactFullName,
            id: contact.ID,
            name: contact.ContactFullName
          }));
          setContactOptions(contacts);
        }
      } catch (error) {
        console.error('Failed to fetch contact names:', error);
        setContactOptions([]);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    fetchContactNames();
  }, [isAddMode, formData.customerId]);

  // Fetch opportunity types from API
  useEffect(() => {
    const fetchOpportunityTypes = async () => {
      try {
        setIsLoadingOpportunityTypes(true);
        const rawResponse = await opportunitiesService.getOpportunityTypes();
        const response = rawResponse.content;
        // const response = await opportunitiesService.getOpportunityTypes();

        console.log('Opportunity Types API Response:', response);

        if (response && response.List) {
          const types = response.List.map(type => ({
            value: type.Name || type.Display || type.Type,
            label: type.Name || type.Display || type.Type,
            id: type.ID || type.Value,
            name: type.Name || type.Display || type.Type
          }));
          console.log('Processed Opportunity Types:', types);
          setApiOpportunityTypes(types);
        } else {
          console.warn('No opportunity types found in API response');
          setApiOpportunityTypes([]);
        }
      } catch (error) {
        console.error('Failed to fetch opportunity types:', error);
        setApiOpportunityTypes([]);
      } finally {
        setIsLoadingOpportunityTypes(false);
      }
    };

    fetchOpportunityTypes();
  }, []);

  // Fetch business units from API
  useEffect(() => {
    const fetchBusinessUnits = async () => {
      try {
        setIsLoadingBusinessUnits(true);
        const rawResponse = await apiService.getBusinessUnits();
        const response = rawResponse?.content || rawResponse;
        // const response = await apiService.getBusinessUnits();

        console.log('Business Units API Response:', response);

        const list = response?.List || response?.list || [];
        if (Array.isArray(list) && list.length > 0) {
          const units = list.map(unit => ({
            value: unit.Display || unit.Name,
            label: unit.Display || unit.Name,
            id: unit.Value || unit.ID,
            name: unit.Display || unit.Name
          }));
          console.log('Processed Business Units:', units);
          setApiBusinessUnits(units);
        } else {
          console.warn('No business units found in API response');
          setApiBusinessUnits([]);
        }
      } catch (error) {
        console.error('Failed to fetch business units:', error);
        setApiBusinessUnits([]);
      } finally {
        setIsLoadingBusinessUnits(false);
      }
    };

    fetchBusinessUnits();
  }, []);

  // Fetch products from API based on selected Business Units (Edit should load with existing BU)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        // Build BU IDs string from formData (array -> comma-separated)
        const buIds = Array.isArray(formData?.businessUnitId)
          ? formData.businessUnitId.filter(Boolean).join(',')
          : (formData?.businessUnitId || '');

        console.log('Fetching products by criteria for BU IDs:', buIds);
        const rawResponse = await apiService.getProductsByCriteria(buIds);
        // rawResponse is server data; prefer .content if present
        const response = rawResponse?.content || rawResponse;

        // Normalize list
        const productsList = extractListFromResponse(response);
        if (!productsList || productsList.length === 0) {
          setApiProducts([]);
          return;
        }

        const products = productsList.map(product => ({
          value: product.Display || product.Name,
          label: product.Display || product.Name,
          id: product.Value || product.ID,
          name: product.Display || product.Name
        }));

        setApiProducts(products);
      } catch (error) {
        console.error('Failed to fetch products by criteria:', error);
        setApiProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    // Trigger on mount and whenever selected business units change
    fetchProducts();
  }, [formData?.businessUnitId]);

  // Fetch user accounts from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const rawResponse = await apiService.getUserAccounts();
        const response = rawResponse.content;
        // const response = await apiService.getUserAccounts();

        console.log('Users API Response:', response);

        if (response && response.List) {
          const users = response.List.map(user => ({
            value: user.Display || `${user.FirstName} ${user.LastName}`.trim(),
            label: user.Display || `${user.FirstName} ${user.LastName}`.trim(),
            id: user.Value || user.ID,
            name: user.Display || `${user.FirstName} ${user.LastName}`.trim()
          }));
          console.log('Processed Users:', users);
          setApiUsers(users);
        } else {
          console.warn('No users found in API response');
          setApiUsers([]);
        }
      } catch (error) {
        console.error('Failed to fetch user accounts:', error);
        setApiUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch loss reasons from API
  useEffect(() => {
    const fetchLossReasons = async () => {
      try {
        setIsLoadingLossReasons(true);
        const rawResponse = await opportunitiesService.getOpportunityLossReasons();
        const response = rawResponse?.content;
        //const response = await opportunitiesService.getOpportunityLossReasons();

        console.log('Loss Reasons API Response:', response);

        if (response && response.List) {
          const lossReasons = response.List.map(reason => ({
            value: reason.Name || reason.Display || reason.LossReason,
            label: reason.Name || reason.Display || reason.LossReason,
            id: reason.ID || reason.Value,
            name: reason.Name || reason.Display || reason.LossReason
          }));
          console.log('Processed Loss Reasons:', lossReasons);
          setApiLossReasons(lossReasons);
        } else {
          console.warn('No loss reasons found in API response');
          setApiLossReasons([]);
        }
      } catch (error) {
        console.error('Failed to fetch loss reasons:', error);
        setApiLossReasons([]);
      } finally {
        setIsLoadingLossReasons(false);
      }
    };

    fetchLossReasons();
  }, []);

  // Fetch stages from API
  useEffect(() => {
    const fetchStages = async () => {
      try {
        setIsLoadingStages(true);
        const rawResponse = await opportunitiesService.getOpportunityStages();
        const response = rawResponse.content;
        // const response = await opportunitiesService.getOpportunityStages();

        console.log('Stages API Response:', response);

        if (response && response.List) {
          const stages = response.List.map(stage => ({
            value: stage.Stage || stage.Display || stage.Name,
            label: stage.Stage || stage.Display || stage.Name,
            id: stage.ID || stage.Value,
            name: stage.Stage || stage.Display || stage.Name,
            description: stage.Description,
            percentClosed: stage.PercentClosed,
            sortOrder: stage.SortOrder,
            colorCode: stage.ColorCode
          }));
          console.log('Processed Stages:', stages);
          setApiStages(stages);
        } else {
          console.warn('No stages found in API response');
          setApiStages([]);
        }
      } catch (error) {
        console.error('Failed to fetch opportunity stages:', error);
        setApiStages([]);
      } finally {
        setIsLoadingStages(false);
      }
    };

    fetchStages();
  }, []);

  return {
    contactOptions,
    isLoadingContacts,
    apiOpportunityTypes,
    isLoadingOpportunityTypes,
    apiBusinessUnits,
    businessUnitOptionsToUse,
    isLoadingBusinessUnits,
    apiProducts,
    productOptionsToUse,
    isLoadingProducts,
    apiUsers,
    userOptionsToUse,
    isLoadingUsers,
    apiLossReasons,
    isLoadingLossReasons,
    apiStages,
    isLoadingStages,
    shouldDisableFields,
    shouldDisableProposalLinkedFields,
    addModeStatusOptions
  };
};
