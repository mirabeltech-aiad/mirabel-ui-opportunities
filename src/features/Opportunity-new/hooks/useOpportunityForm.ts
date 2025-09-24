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
  isLostReasonRequired,
  shouldAmountBeReadOnly,
  shouldAutoUpdateStage,
  shouldAutoUpdateProbability,
  isValidProbabilityForStatus,
  isValidStageForStatus
} from '../utils/validation';
import { STAGE_PERCENTAGES, STAGE_NAMES, findStageIdByName } from '../constants/opportunityOptions';

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
  
  // Stage options for ID lookup
  const [stageOptions, setStageOptions] = useState<Array<{id: string, name: string}>>([]);

  // Load stages on mount
  useEffect(() => {
    const loadStages = async () => {
      try {
        const response = await opportunityService.getOpportunityStages();
        if (response?.content?.List) {
          const stages = response.content.List.map((stageData: any) => ({
            id: stageData.ID,
            name: stageData.Stage
          }));
          setStageOptions(stages);
        }
      } catch (error) {
        console.error('Failed to load stages:', error);
      }
    };
    loadStages();
  }, []);

  // Load opportunity data on mount
  useEffect(() => {
    if (opportunityId && opportunityId !== '0') {
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
    if (!opportunityId || opportunityId === '0') return;

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

  // Helper functions to get stage IDs
  const getClosedWonStageId = () => findStageIdByName(stageOptions, STAGE_NAMES.CLOSED_WON);
  const getClosedLostStageId = () => findStageIdByName(stageOptions, STAGE_NAMES.CLOSED_LOST);
  const getStageNameById = (stageId: string) => {
    const stage = stageOptions.find(s => s.id === stageId);
    return stage ? stage.name : '';
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

    // Handle probability changes that would trigger status changes
    if (field === 'probability' && !isBatchUpdating) {
      const probValue = parseInt(value) || 0;
      if (probValue === 100 && formData.status !== 'Won') {
        setStatusConfirmDialog({
          isOpen: true,
          newStatus: 'Won',
          pendingChange: { field, value, oldValue }
        });
        return;
      }
      if (probValue === 0 && formData.status !== 'Lost') {
        setStatusConfirmDialog({
          isOpen: true,
          newStatus: 'Lost',
          pendingChange: { field, value, oldValue }
        });
        return;
      }
    }

    // Handle stage changes that would trigger status changes
    if (field === 'stage' && !isBatchUpdating) {
      const stageName = getStageNameById(value);
      if (stageName === STAGE_NAMES.CLOSED_WON && formData.status !== 'Won') {
        setStatusConfirmDialog({
          isOpen: true,
          newStatus: 'Won',
          pendingChange: { field, value, oldValue }
        });
        return;
      }
      if (stageName === STAGE_NAMES.CLOSED_LOST && formData.status !== 'Lost') {
        setStatusConfirmDialog({
          isOpen: true,
          newStatus: 'Lost',
          pendingChange: { field, value, oldValue }
        });
        return;
      }
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

      // Business Logic: Handle Probability, Status, and Stage interactions
      
      // 1. PROBABILITY CHANGES - Auto-update Status and Stage
      if (field === 'probability') {
        const probValue = parseInt(value) || 0;
        
        if (probValue === 100) {
          // 100% probability = Won status + Closed Won stage
          updatedData.status = 'Won';
          const closedWonStageId = getClosedWonStageId();
          if (closedWonStageId) {
            updatedData.stage = closedWonStageId;
          }
          updatedData.stagePercentage = '100';
          if (!prev.actualCloseDate) {
            updatedData.actualCloseDate = new Date().toISOString().split('T')[0];
          }
          // Clear lost reason if previously set
          updatedData.lostReason = '';
        } else if (probValue === 0) {
          // 0% probability = Lost status + Closed Lost stage
          updatedData.status = 'Lost';
          const closedLostStageId = getClosedLostStageId();
          if (closedLostStageId) {
            updatedData.stage = closedLostStageId;
          }
          updatedData.stagePercentage = '0';
          if (!prev.actualCloseDate) {
            updatedData.actualCloseDate = new Date().toISOString().split('T')[0];
          }
          // Clear win reason if previously set
          updatedData.winReason = '';
        } else {
          // Any other probability = Open status (if currently Won/Lost)
          if (prev.status === 'Won' || prev.status === 'Lost') {
            updatedData.status = 'Open';
            updatedData.actualCloseDate = '';
            updatedData.winReason = '';
            updatedData.lostReason = '';
            
            // Reset stage if it was closed, or set based on stage percentages
            const currentStageName = getStageNameById(prev.stage);
            if (currentStageName === STAGE_NAMES.CLOSED_WON || currentStageName === STAGE_NAMES.CLOSED_LOST) {
              // Find appropriate stage based on probability
              const appropriateStageName = Object.keys(STAGE_PERCENTAGES).find(
                stage => STAGE_PERCENTAGES[stage] === probValue
              );
              if (appropriateStageName) {
                const appropriateStageId = findStageIdByName(stageOptions, appropriateStageName);
                updatedData.stage = appropriateStageId || '';
              } else {
                updatedData.stage = '';
              }
              updatedData.stagePercentage = probValue.toString();
            }
          }
        }
      }

      // 2. STATUS CHANGES - Auto-update Probability and Stage
      if (field === 'status') {
        if (value === 'Won') {
          // Won status = 100% probability + Closed Won stage
          updatedData.probability = '100';
          const closedWonStageId = getClosedWonStageId();
          if (closedWonStageId) {
            updatedData.stage = closedWonStageId;
          }
          updatedData.stagePercentage = '100';
          if (!prev.actualCloseDate) {
            updatedData.actualCloseDate = new Date().toISOString().split('T')[0];
          }
          // Clear lost reason
          updatedData.lostReason = '';
        } else if (value === 'Lost') {
          // Lost status = 0% probability + Closed Lost stage
          updatedData.probability = '0';
          const closedLostStageId = getClosedLostStageId();
          if (closedLostStageId) {
            updatedData.stage = closedLostStageId;
          }
          updatedData.stagePercentage = '0';
          if (!prev.actualCloseDate) {
            updatedData.actualCloseDate = new Date().toISOString().split('T')[0];
          }
          // Clear win reason
          updatedData.winReason = '';
        } else if (value === 'Open') {
          // Open status = clear close dates and reasons
          updatedData.actualCloseDate = '';
          updatedData.winReason = '';
          updatedData.lostReason = '';
          
          // Reset closed stages
          const currentStageName = getStageNameById(prev.stage);
          if (currentStageName === STAGE_NAMES.CLOSED_WON || currentStageName === STAGE_NAMES.CLOSED_LOST) {
            updatedData.stage = '';
            updatedData.stagePercentage = '';
            // Set probability to a reasonable default for open opportunities
            if (prev.probability === '0' || prev.probability === '100') {
              updatedData.probability = '50'; // Default to 50% for open opportunities
            }
          }
        }
      }

      // 3. STAGE CHANGES - Auto-update Status and Probability
      if (field === 'stage') {
        const stageName = getStageNameById(value);
        
        if (stageName === STAGE_NAMES.CLOSED_WON) {
          // Closed Won stage = Won status + 100% probability
          updatedData.status = 'Won';
          updatedData.probability = '100';
          updatedData.stagePercentage = '100';
          if (!prev.actualCloseDate) {
            updatedData.actualCloseDate = new Date().toISOString().split('T')[0];
          }
          updatedData.lostReason = '';
        } else if (stageName === STAGE_NAMES.CLOSED_LOST) {
          // Closed Lost stage = Lost status + 0% probability
          updatedData.status = 'Lost';
          updatedData.probability = '0';
          updatedData.stagePercentage = '0';
          if (!prev.actualCloseDate) {
            updatedData.actualCloseDate = new Date().toISOString().split('T')[0];
          }
          updatedData.winReason = '';
        } else if (stageName && STAGE_PERCENTAGES[stageName]) {
          // Regular stage = Update probability based on stage percentage + Open status
          const stagePercentage = STAGE_PERCENTAGES[stageName];
          updatedData.stagePercentage = stagePercentage.toString();
          
          // Only auto-update probability if not manually set to extreme values
          if (prev.probability !== '0' && prev.probability !== '100') {
            updatedData.probability = stagePercentage.toString();
          }
          
          // Ensure status is Open for non-closed stages
          if (prev.status === 'Won' || prev.status === 'Lost') {
            updatedData.status = 'Open';
            updatedData.actualCloseDate = '';
            updatedData.winReason = '';
            updatedData.lostReason = '';
          }
        } else if (value === '') {
          // Empty stage = reset stage percentage
          updatedData.stagePercentage = '';
        }
      }

      return updatedData;
    });

    // Real-time validation if form has been submitted
    if (hasSubmitted) {
      setTimeout(() => {
        // Use the updated form data for validation
        setFormData(currentData => {
          const errors = validateRequiredFields(currentData);
          setValidationErrors(errors);
          return currentData;
        });
      }, 100);
    }
  }, [formData, hasSubmitted, isBatchUpdating, stageOptions]);

  // Handle batch updates (for proposal linking)
  const handleBatchInputChange = useCallback((updates: Partial<OpportunityFormData>) => {
    setIsBatchUpdating(true);
    
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      // Auto-calculate forecast revenue if amount or probability changed
      if (updates.amount || updates.probability) {
        newData.forecastRevenue = calculateForecastRevenue(
          newData.amount || prev.amount, 
          newData.probability || prev.probability
        );
      }

      // Apply business logic for batch updates too
      if (updates.probability) {
        const probValue = parseInt(updates.probability) || 0;
        if (probValue === 100) {
          newData.status = 'Won';
          const closedWonStageId = getClosedWonStageId();
          if (closedWonStageId) {
            newData.stage = closedWonStageId;
          }
          newData.stagePercentage = '100';
        } else if (probValue === 0) {
          newData.status = 'Lost';
          const closedLostStageId = getClosedLostStageId();
          if (closedLostStageId) {
            newData.stage = closedLostStageId;
          }
          newData.stagePercentage = '0';
        }
      }

      if (updates.status) {
        if (updates.status === 'Won') {
          newData.probability = '100';
          const closedWonStageId = getClosedWonStageId();
          if (closedWonStageId) {
            newData.stage = closedWonStageId;
          }
          newData.stagePercentage = '100';
        } else if (updates.status === 'Lost') {
          newData.probability = '0';
          const closedLostStageId = getClosedLostStageId();
          if (closedLostStageId) {
            newData.stage = closedLostStageId;
          }
          newData.stagePercentage = '0';
        }
      }

      if (updates.stage) {
        const stageName = getStageNameById(updates.stage);
        if (stageName === STAGE_NAMES.CLOSED_WON) {
          newData.status = 'Won';
          newData.probability = '100';
          newData.stagePercentage = '100';
        } else if (stageName === STAGE_NAMES.CLOSED_LOST) {
          newData.status = 'Lost';
          newData.probability = '0';
          newData.stagePercentage = '0';
        } else if (stageName && STAGE_PERCENTAGES[stageName]) {
          const stagePercentage = STAGE_PERCENTAGES[stageName];
          newData.stagePercentage = stagePercentage.toString();
          if (!updates.probability && prev.probability !== '0' && prev.probability !== '100') {
            newData.probability = stagePercentage.toString();
          }
        }
      }
      
      return newData;
    });

    // Re-validate after batch update
    if (hasSubmitted) {
      setTimeout(() => {
        setFormData(currentData => {
          const errors = validateRequiredFields(currentData);
          setValidationErrors(errors);
          return currentData;
        });
      }, 100);
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

      // Apply the change by setting isBatchUpdating to true to bypass confirmation
      setIsBatchUpdating(true);
      
      // Apply the change directly
      setFormData(prev => {
        const updatedData = { ...prev, [field]: value };

        // Auto-calculate forecast revenue when amount or probability changes
        if (field === 'amount' || field === 'probability') {
          const amount = field === 'amount' ? value : prev.amount;
          const probability = field === 'probability' ? value : prev.probability;
          updatedData.forecastRevenue = calculateForecastRevenue(amount, probability);
        }

        // Apply all business logic based on the field that was changed
        if (field === 'probability') {
          const probValue = parseInt(value) || 0;
          if (probValue === 100) {
            updatedData.status = 'Won';
            const closedWonStageId = getClosedWonStageId();
            if (closedWonStageId) {
              updatedData.stage = closedWonStageId;
            }
            updatedData.stagePercentage = '100';
            if (!prev.actualCloseDate) {
              updatedData.actualCloseDate = new Date().toISOString().split('T')[0];
            }
            updatedData.lostReason = '';
          } else if (probValue === 0) {
            updatedData.status = 'Lost';
            const closedLostStageId = getClosedLostStageId();
            if (closedLostStageId) {
              updatedData.stage = closedLostStageId;
            }
            updatedData.stagePercentage = '0';
            if (!prev.actualCloseDate) {
              updatedData.actualCloseDate = new Date().toISOString().split('T')[0];
            }
            updatedData.winReason = '';
          }
        }

        if (field === 'status') {
          if (value === 'Won') {
            updatedData.probability = '100';
            const closedWonStageId = getClosedWonStageId();
            if (closedWonStageId) {
              updatedData.stage = closedWonStageId;
            }
            updatedData.stagePercentage = '100';
            if (!prev.actualCloseDate) {
              updatedData.actualCloseDate = new Date().toISOString().split('T')[0];
            }
            updatedData.lostReason = '';
          } else if (value === 'Lost') {
            updatedData.probability = '0';
            const closedLostStageId = getClosedLostStageId();
            if (closedLostStageId) {
              updatedData.stage = closedLostStageId;
            }
            updatedData.stagePercentage = '0';
            if (!prev.actualCloseDate) {
              updatedData.actualCloseDate = new Date().toISOString().split('T')[0];
            }
            updatedData.winReason = '';
          }
        }

        if (field === 'stage') {
          const stageName = getStageNameById(value);
          if (stageName === STAGE_NAMES.CLOSED_WON) {
            updatedData.status = 'Won';
            updatedData.probability = '100';
            updatedData.stagePercentage = '100';
            if (!prev.actualCloseDate) {
              updatedData.actualCloseDate = new Date().toISOString().split('T')[0];
            }
            updatedData.lostReason = '';
          } else if (stageName === STAGE_NAMES.CLOSED_LOST) {
            updatedData.status = 'Lost';
            updatedData.probability = '0';
            updatedData.stagePercentage = '0';
            if (!prev.actualCloseDate) {
              updatedData.actualCloseDate = new Date().toISOString().split('T')[0];
            }
            updatedData.winReason = '';
          } else if (stageName && STAGE_PERCENTAGES[stageName]) {
            const stagePercentage = STAGE_PERCENTAGES[stageName];
            updatedData.stagePercentage = stagePercentage.toString();
            if (prev.probability !== '0' && prev.probability !== '100') {
              updatedData.probability = stagePercentage.toString();
            }
            if (prev.status === 'Won' || prev.status === 'Lost') {
              updatedData.status = 'Open';
              updatedData.actualCloseDate = '';
              updatedData.winReason = '';
              updatedData.lostReason = '';
            }
          }
        }

        return updatedData;
      });

      // Reset batch updating flag
      setTimeout(() => {
        setIsBatchUpdating(false);
      }, 100);

      // Re-validate if form has been submitted
      if (hasSubmitted) {
        setTimeout(() => {
          setFormData(currentData => {
            const errors = validateRequiredFields(currentData);
            setValidationErrors(errors);
            return currentData;
          });
        }, 150);
      }
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
    const hasLinkedProposal = formData.proposalId && String(formData.proposalId).trim() !== '';
    const isOriginalProposal = formData.proposalId === originalProposalId;
    return hasLinkedProposal && isOriginalProposal;
  };

  const isProposalReplacement = (newProposalId: string): boolean => {
    const hasOriginalProposal = originalProposalId && String(originalProposalId).trim() !== '';
    const isDifferentProposal = newProposalId !== originalProposalId;
    return hasOriginalProposal && isDifferentProposal;
  };

  const isAmountReadOnly = (): boolean => {
    return shouldAmountBeReadOnly(formData.proposalId || '');
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
    hasValidationErrors,
    isAmountReadOnly
  };
};