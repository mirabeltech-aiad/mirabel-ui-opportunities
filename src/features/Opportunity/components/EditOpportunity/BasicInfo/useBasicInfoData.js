import React, { useState, useEffect } from "react";
import apiService from "@/services/apiService";

export const useBasicInfoData = (formData, isAddMode) => {
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
  const shouldDisableFields = false;
  const addModeStatusOptions = [
    { value: "Open", label: "Open" },
    { value: "Closed Won", label: "Closed Won" },
    { value: "Closed Lost", label: "Closed Lost" }
  ];

  // Fetch contact names when component mounts or when customer is selected in Add Mode
  useEffect(() => {
    const fetchContactNames = async () => {
      if (!isAddMode) return;
      if (!formData.customerId) {
        setContactOptions([]);
        return;
      }
      
      try {
        setIsLoadingContacts(true);
        const response = await apiService.getContactNames(formData.customerId);
        
        if (response && response.content && response.content.List) {
          const contacts = response.content.List.map(contact => ({
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
        const response = await apiService.getOpportunityTypes();
        
        console.log('Opportunity Types API Response:', response);
        
        if (response && response.content && response.content.List) {
          const types = response.content.List.map(type => ({
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
        const response = await apiService.getBusinessUnits();
        
        console.log('Business Units API Response:', response);
        
        if (response && response.content && response.content.List) {
          const units = response.content.List.map(unit => ({
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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await apiService.getProductsByCriteria("");
        
        console.log('Products API Response:', response);
        
        if (response && response.content && response.content.List) {
          const products = response.content.List.map(product => ({
            value: product.Display || product.Name,
            label: product.Display || product.Name,
            id: product.Value || product.ID,
            name: product.Display || product.Name
          }));
          console.log('Processed Products:', products);
          setApiProducts(products);
        } else {
          console.warn('No products found in API response');
          setApiProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch products by criteria:', error);
        setApiProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch user accounts from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const response = await apiService.getUserAccounts();
        
        console.log('Users API Response:', response);
        
        if (response && response.content && response.content.List) {
          const users = response.content.List.map(user => ({
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
        const response = await apiService.getOpportunityLossReasons();
        
        console.log('Loss Reasons API Response:', response);
        
        if (response && response.content && response.content.List) {
          const lossReasons = response.content.List.map(reason => ({
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
        const response = await apiService.getOpportunityStages();
        
        console.log('Stages API Response:', response);
        
        if (response && response.content && response.content.List) {
          const stages = response.content.List.map(stage => ({
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
    addModeStatusOptions
  };
};
