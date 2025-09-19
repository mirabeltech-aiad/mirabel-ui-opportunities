import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/features/Opportunity/hooks/use-toast';
import { opportunityService } from '../services/opportunityService';
import { 
  OpportunityFormData, 
  ValidationErrors, 
  StatusConfirmDialog 
} from '../types/opportunity';
import { 
  validateRequiredFields, 
  calculateForecastRevenue,
  isLostReasonRequired 
} from '../utils/validation';
import { STAGE_PERCENTAGES } from '../constants/opportunityOptions';

// Function to generate unique opportunity ID
const generateOpportunityId = (): string => {
  const prefix = 'OPP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const useOpportunityForm = (opportunityId?: string) => {
  // Form state
  const [formData, setFormData] = useState<OpportunityFormData>({
    opportunityId: '',
    proposalId: '',
    proposalName: '',
    name: '',
    company: '',
    contactName: '',
    status: 'Open',
    stage: '',
    stageDetails: {},
    amount: '',
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
    assignedRep: '',
    assignedRepDetails: {},
    createdBy: '',
    source: '',
    leadSource: '',
    leadType: '',
    leadStatus: '',
    salesPresentation: '',
    salesPresenterDetails: {},
    projCloseDate: '',
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
  });

  // Loading and validation state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Status change confirmation state
  const [statusConfirmDialog, setStatusConfirmDialog] = useState<StatusConfirmDialog>({
    isOpen: false,
    newStatus: null,
    pendingChange: null
  });

  // Proposal state tracking
  const [originalProposalId, setOriginalProposalId] = useState('');
  const [previousStage, setPreviousStage] = useState('');
  const [previousProbability, setPreviousProbability] = useState('');
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);

  // Load opportunity data on mount
  useEffect(() => {
    if (opportunityId) {
      loadOpportunityData();
    } else {
      // For new opportunities, set defaults
      setFormData(prev => ({
        ...prev,
        opportunityId: generateOpportunityId(),
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: 'Current User'
      }));
    }
  }, [opportunityId]);

  const loadOpportunityData = async () => {
    if (!opportunityId) return;

    setIsLoading(true);
    try {
      const response = await opportunityService.getOpportunityDetails(opportunityId);
      
      if (response?.content?.Data) {
        const mappedData = opportunityService.mapApiResponseToFormData(response.content.Data);
        setFormData(mappedData);
        setOriginalProposalId(mappedData.proposalId || '');
      }
    } catch (error) {
      console.error('Failed to load opportunity:', error);
      toast({
        title: 'Error',
        description: 'Failed to load opportunity details. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes with validation and business logic
  const handleInputChange = useCallback((field: string, value: any) => {
    const oldValue = formData[field as keyof OpportunityFormData];

    // Skip confirmation for proposal-driven updates
    const isProposalDrivenUpdate = field === 'proposalId' || field === 'proposalName' || isBatchUpdating;

    // Handle status change with confirmation
    if (field === 'status' && (value === 'Won' || value === 'Lost') && !isBatchUpdating) {
      setStatusConfirmDialog({
        isOpen: true,
        newStatus: value,
        pendingChange: { field, value, oldValue }
      });
      return;
    }

    // Update form data
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value };

      // Auto-calculate forecast revenue when amount or probability changes
      if (field === 'amount' || field === 'probability') {
        const amount = field === 'amount' ? value : prev.amount;
        const probability = field === 'probability' ? value : prev.probability;
        updatedData.forecastRevenue = calculateForecastRevenue(amount, probability);
      }

      // Auto-update stage percentage when stage changes
      if (field === 'stage' && STAGE_PERCENTAGES[value]) {
        updatedData.stagePercentage = STAGE_PERCENTAGES[value].toString();
        updatedData.probability = STAGE_PERCENTAGES[value].toString();
      }

      // Auto-update probability when status changes
      if (field === 'status') {
        if (value === 'Won') {
          updatedData.probability = '100';
          updatedData.stage = 'Closed Won';
        } else if (value === 'Lost') {
          updatedData.probability = '0';
          updatedData.stage = 'Closed Lost';
        }
      }

      return updatedData;
    });

    // Real-time validation if form has been submitted
    if (hasSubmitted) {
      setTimeout(() => {
        const newFormData = { ...formData, [field]: value };
        const errors = validateRequiredFields(newFormData);
        setValidationErrors(errors);
      }, 50);
    }
  }, [formData, hasSubmitted, isBatchUpdating]);

  // Handle batch updates (for proposal linking)
  const handleBatchInputChange = useCallback((updates: Partial<OpportunityFormData>) => {
    setIsBatchUpdating(true);
    
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      // Auto-calculate forecast revenue if amount or probability changed
      if (updates.amount || updates.probability) {
        newData.forecastRevenue = calculateForecastRevenue(
          newData.amount, 
          newData.probability
        );
      }
      
      return newData;
    });

    // Re-validate after batch update
    if (hasSubmitted) {
      setTimeout(() => {
        const newFormData = { ...formData, ...updates };
        const errors = validateRequiredFields(newFormData);
        setValidationErrors(errors);
      }, 50);
    }

    setTimeout(() => {
      setIsBatchUpdating(false);
    }, 100);
  }, [formData, hasSubmitted]);

  // Save opportunity
  const saveOpportunity = async (): Promise<boolean> => {
    setHasSubmitted(true);
    
    // Validate form
    const errors = validateRequiredFields(formData);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the validation errors before saving.',
        variant: 'destructive'
      });
      return false;
    }

    setIsSaving(true);
    try {
      const response = await opportunityService.saveOpportunity(formData);
      
      if (response) {
        // Update original proposal ID after successful save
        if (formData.proposalId) {
          setOriginalProposalId(formData.proposalId);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save opportunity:', error);
      toast({
        title: 'Error',
        description: 'Failed to save opportunity. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Unlink proposal
  const unlinkProposal = async (): Promise<boolean> => {
    try {
      // Clear proposal data
      handleBatchInputChange({
        proposalId: '',
        proposalName: '',
        amount: '0'
      });

      toast({
        title: 'Proposal Unlinked',
        description: 'The proposal has been successfully unlinked from this opportunity.',
        variant: 'default'
      });

      return true;
    } catch (error) {
      console.error('Failed to unlink proposal:', error);
      toast({
        title: 'Error',
        description: 'Failed to unlink proposal. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Status change confirmation handlers
  const handleStatusConfirm = () => {
    if (statusConfirmDialog.pendingChange) {
      const { field, value } = statusConfirmDialog.pendingChange;
      
      // Store previous values for potential restoration
      if (field === 'status') {
        setPreviousStage(formData.stage);
        setPreviousProbability(formData.probability);
      }

      // Apply the change
      handleInputChange(field, value);
    }
    
    setStatusConfirmDialog({ isOpen: false, newStatus: null, pendingChange: null });
  };

  const handleStatusCancel = () => {
    setStatusConfirmDialog({ isOpen: false, newStatus: null, pendingChange: null });
  };

  // Helper functions
  const getFieldError = (fieldName: string): string | null => {
    if (!hasSubmitted) return null;
    return validationErrors[fieldName] || null;
  };

  const hasValidationErrors = (): boolean => {
    return Object.keys(validationErrors).length > 0;
  };

  const shouldShowUnlinkOption = (): boolean => {
    const hasLinkedProposal = formData.proposalId && formData.proposalId.trim() !== '';
    const isOriginalProposal = formData.proposalId === originalProposalId;
    return hasLinkedProposal && isOriginalProposal;
  };

  const isProposalReplacement = (newProposalId: string): boolean => {
    const hasOriginalProposal = originalProposalId && originalProposalId.trim() !== '';
    const isDifferentProposal = newProposalId !== originalProposalId;
    return hasOriginalProposal && isDifferentProposal;
  };

  return {
    formData,
    handleInputChange,
    handleBatchInputChange,
    isLoading,
    isSaving,
    saveOpportunity,
    unlinkProposal,
    shouldShowUnlinkOption,
    isProposalReplacement,
    originalProposalId,
    getFieldError,
    hasSubmitted,
    statusConfirmDialog,
    handleStatusConfirm,
    handleStatusCancel,
    validationErrors,
    hasValidationErrors
  };
};