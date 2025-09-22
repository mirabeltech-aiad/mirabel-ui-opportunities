import { useState, useEffect } from 'react';
import { opportunityService } from '../services/opportunityService';

interface SimpleOpportunityData {
  opportunityName: string;
  companyName: string;
  amount: number;
  status: string;
  stage: string;
  assignedRep: string;
  closeDate: string;
}

export const useKanbanOpportunityForm = (opportunityId?: string) => {
  const [formData, setFormData] = useState<SimpleOpportunityData>({
    opportunityName: '',
    companyName: '',
    amount: 0,
    status: 'Open',
    stage: '',
    assignedRep: '',
    closeDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (opportunityId) {
      loadOpportunity(opportunityId);
    }
  }, [opportunityId]);

  const loadOpportunity = async (id: string) => {
    setIsLoading(true);
    
    try {
      const response = await opportunityService.getOpportunityDetails(id);
      if (response?.content?.Data) {
        const data = response.content.Data;
        setFormData({
          opportunityName: data.Name || '',
          companyName: data.ContactDetails?.Name || '',
          amount: parseFloat(data.Amount) || 0,
          status: data.Status || 'Open',
          stage: data.OppStageDetails?.Stage || '',
          assignedRep: data.AssignedTODetails?.Name || '',
          closeDate: data.CloseDate ? new Date(data.CloseDate).toISOString().split('T')[0] : '',
        });
      }
    } catch (err) {
      console.error('Error loading opportunity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SimpleOpportunityData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveOpportunity = async (): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      // Convert simple form data to the format expected by the service
      const fullFormData = {
        opportunityId: opportunityId || '',
        name: formData.opportunityName,
        amount: formData.amount.toString(),
        status: formData.status,
        stage: formData.stage,
        projCloseDate: formData.closeDate,
        // Add other required fields with defaults
        proposalId: '',
        proposalName: '',
        company: formData.companyName,
        contactName: '',
        stageDetails: {},
        probability: '',
        stagePercentage: '',
        opportunityType: { id: '', name: '' },
        opportunityTypeId: '',
        businessUnit: [],
        businessUnitId: [],
        businessUnitDetails: [],
        product: [],
        productId: [],
        productDetails: [],
        primaryCampaignSource: '',
        assignedRep: formData.assignedRep,
        assignedRepDetails: {},
        createdBy: '',
        source: '',
        leadSource: '',
        leadType: '',
        leadStatus: '',
        salesPresentation: '',
        salesPresenterDetails: {},
        actualCloseDate: '',
        createdDate: '',
        description: '',
        priority: '',
        location: '',
        remote: false,
        industry: '',
        companySize: '',
        budget: '',
        decisionMaker: '',
        timeframe: '',
        competitors: '',
        nextSteps: '',
        lastActivity: '',
        territory: '',
        campaign: '',
        referralSource: '',
        productInterest: '',
        painPoints: '',
        currentSolution: '',
        decisionCriteria: '',
        implementationDate: '',
        contractLength: '',
        renewalDate: '',
        lostReason: '',
        winReason: '',
        tags: '',
        notes: '',
        forecastRevenue: '',
        lossReasonDetails: {},
        contactDetails: {}
      };

      await opportunityService.saveOpportunity(fullFormData);
      return true;
    } catch (err) {
      console.error('Error saving opportunity:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    handleInputChange,
    isLoading,
    isSaving,
    saveOpportunity,
  };
};