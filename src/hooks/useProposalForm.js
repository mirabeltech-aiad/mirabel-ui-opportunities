
import { useState, useEffect } from 'react';

export const useProposalForm = (proposalId) => {
  const [formData, setFormData] = useState({
    // Basic Information
    proposalId: proposalId || '',
    opportunityId: '',
    title: '',
    company: '',
    contactName: '',
    state: '',
    type: '',
    businessUnit: '',
    product: '',
    description: '',
    
    // Status & Progress
    status: '',
    stage: '',
    priority: '',
    submissionDate: '',
    reviewDate: '',
    
    // Financial Information
    proposedValue: '',
    estimatedCost: '',
    margin: '',
    currency: 'USD',
    
    // Team Assignment
    assignedRep: '',
    proposalManager: '',
    technicalLead: '',
    territory: '',
    
    // Company Details
    industry: '',
    companySize: '',
    decisionMaker: '',
    
    // Delivery & Implementation
    deliveryTimeframe: '',
    implementationDate: '',
    deliveryMethod: '',
    
    // Additional Information
    competitorAnalysis: '',
    riskAssessment: '',
    notes: ''
  });

  useEffect(() => {
    // In a real application, you would fetch the proposal data here
    // For now, we'll use mock data
    if (proposalId) {
      setFormData(prevData => ({
        ...prevData,
        proposalId: proposalId,
        title: `Proposal ${proposalId}`,
        company: 'Sample Company',
        status: 'Draft',
        stage: 'Initial Draft'
      }));
    }
  }, [proposalId]);

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  return {
    formData,
    handleInputChange
  };
};
