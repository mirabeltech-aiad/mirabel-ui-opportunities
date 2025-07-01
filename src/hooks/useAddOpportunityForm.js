import { useState } from 'react';
import apiService from '../services/apiService';
import { userId } from '../services/httpClient';

export const useAddOpportunityForm = () => {
  // Initial form data for new opportunity
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    assignedRep: '',
    stage: '',
    status: 'Open',
    amount: '',
    probability: '',
    projCloseDate: '',
    description: '',
    nextSteps: '',
    leadSource: '',
    leadType: '',
    leadStatus: '',
    priority: 'Medium',
    industry: '',
    companySize: '',
    timeframe: '',
    territory: '',
    contractLength: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    businessUnit: '',
    product: '',
    opportunityType: '',
    primaryCampaignSource: '',
    createdBy: '',
    createdDate: new Date().toISOString().split('T')[0],
    modifiedBy: '',
    modifiedDate: '',
    notes: '',
    tags: [],
    customFields: {},
    customerId: '', // Add customerId field to store the selected customer's ID
    
    // Additional fields for API payload mapping
    contactId: '',
    businessUnitId: '',
    assignedRepDetails: {},
    salesPresenterDetails: {},
    contactDetails: {},
    stageDetails: {},
    opportunityTypeDetails: {},
    productDetails: [],
    lossReasonDetails: {},
    customerData: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    console.log('Add Opportunity - Field changed:', field, 'Value:', value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveOpportunity = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      console.log('Add Opportunity - Saving new opportunity with data:', formData);
      
      // Format data for API - mapping to the required payload structure
      const opportunityData = {
        ID: 0, // Always 0 for new opportunities
        Name: formData.name || '',
        Status: formData.status || 'Open',
        CloseDate: formData.projCloseDate || '',
        Amount: formData.amount || '',
        Probability: parseInt(formData.probability) || 0,
        AssignedTODetails: formData.assignedRepDetails?.ID ? 
          { ID: parseInt(formData.assignedRepDetails.ID), Name: formData.assignedRepDetails.Name } : 
          { ID: userId },
        BusinessUnitDetails: formData.businessUnitId ? 
          [{ ID: "", Name: "" }, { ID: parseInt(formData.businessUnitId), Name: formData.businessUnit }] : 
          [{ ID: "", Name: "" }],
        BusinessUnitIDS: formData.businessUnitId || "",
        ContactDetails: formData.contactDetails?.ID ? 
          { ID: formData.contactDetails.ID.toString(), SalesRepID: userId } : 
          { ID: formData.contactId || "", SalesRepID: userId },
        CreatedDate: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        ModfiedDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'numeric', 
          day: 'numeric' 
        }) + ' ' + new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: false 
        }),
        NextStep: formData.nextSteps || "",
        Notes: formData.notes || "",
        OppLossReasonDetails: formData.lossReasonDetails?.ID ? 
          { ID: formData.lossReasonDetails.ID, Name: formData.lossReasonDetails.Name } : 
          { ID: null, Name: "" },
        OppStageDetails: formData.stageDetails?.ID ? 
          { ID: formData.stageDetails.ID, Stage: formData.stageDetails.Stage } : 
          { ID: null, Stage: formData.stage || "" },
        OppTypeDetails: formData.opportunityTypeDetails?.id ? 
          { ID: formData.opportunityTypeDetails.id, Name: formData.opportunityTypeDetails.name } : 
          { ID: null, Name: "" },
        OwnerDetails: formData.assignedRepDetails?.ID ? 
          { ID: parseInt(formData.assignedRepDetails.ID) } : 
          { ID: userId },
        ProductDetails: formData.productDetails?.length > 0 ? formData.productDetails : [{ ID: "", Name: "" }],
        ProductIDS: formData.productDetails?.length > 0 ? 
          formData.productDetails.map(p => p.ID).join(',') : "",
        ProposalID: "",
        SalesPresenterDetails: formData.salesPresenterDetails?.ID ? 
          { ID: parseInt(formData.salesPresenterDetails.ID), Name: formData.salesPresenterDetails.Name } : 
          { ID: userId },
        Source: formData.primaryCampaignSource || null,
        StageAction: "Add",
        SubContactDetails: formData.contactDetails?.ID ? 
          { ID: parseInt(formData.contactDetails.ID), Name: formData.contactDetails.Name || formData.contactName } : 
          { ID: parseInt(formData.contactId) || 0, Name: formData.contactName || "" }
      };

      console.log('Add Opportunity - API payload:', opportunityData);
      
      // Call API to create new opportunity using the new endpoint
      const response = await apiService.createOpportunity(opportunityData);
      
      console.log('Add Opportunity - API response:', response);
      
      if (response && (response.Status === 'Success' || response.content?.Status === 'Success')) {
        console.log('Add Opportunity - Successfully created opportunity');
        return true;
      } else {
        throw new Error('Failed to create opportunity');
      }
    } catch (err) {
      console.error('Add Opportunity - Error saving opportunity:', err);
      setError(err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    handleInputChange,
    isLoading,
    saveOpportunity,
    isSaving,
    error
  };
};
