// Standard pipeline stage mapping utility

// Define standard pipeline stages
export const STANDARD_STAGES = {
    PROSPECTING: 'Prospecting',
    QUALIFICATION: 'Qualification', 
    NEEDS_ANALYSIS: 'Needs Analysis',
    PROPOSAL: 'Proposal',
    NEGOTIATION: 'Negotiation',
    CLOSED_WON: 'Closed Won',
    CLOSED_LOST: 'Closed Lost'
  };
  
  // Map API stages to standard stages - Comprehensive mapping for all 41+ stages
  export const STAGE_MAPPING = {
    // Training stages - map to appropriate business stages
    'Train: CB Products & Plans': STANDARD_STAGES.QUALIFICATION,
    'Train: CB NI': STANDARD_STAGES.NEEDS_ANALYSIS,
    'Train: Legal Review': STANDARD_STAGES.NEGOTIATION,
    'Train: Final Review': STANDARD_STAGES.NEGOTIATION,
    
    // Demo and presentation stages
    '1st Demo': STANDARD_STAGES.QUALIFICATION,
    'Setup Demo': STANDARD_STAGES.QUALIFICATION,
    'Demo': STANDARD_STAGES.QUALIFICATION,
    'Demo Scheduled': STANDARD_STAGES.QUALIFICATION,
    'Demo Complete': STANDARD_STAGES.NEEDS_ANALYSIS,
    
    // Discovery and analysis stages
    'Discovery': STANDARD_STAGES.NEEDS_ANALYSIS,
    'Needs Analysis': STANDARD_STAGES.NEEDS_ANALYSIS,
    'Requirements Analysis': STANDARD_STAGES.NEEDS_ANALYSIS,
    'Solution Design': STANDARD_STAGES.NEEDS_ANALYSIS,
    
    // Proposal stages
    'Proposal': STANDARD_STAGES.PROPOSAL,
    'Proposal Development': STANDARD_STAGES.PROPOSAL,
    'Proposal Submitted': STANDARD_STAGES.PROPOSAL,
    'Proposal Review': STANDARD_STAGES.PROPOSAL,
    
    // Negotiation stages
    'Negotiation': STANDARD_STAGES.NEGOTIATION,
    'Contract Review': STANDARD_STAGES.NEGOTIATION,
    'Legal Review': STANDARD_STAGES.NEGOTIATION,
    'Final Approval': STANDARD_STAGES.NEGOTIATION,
    
    // Standard outcome stages
    'Prospecting': STANDARD_STAGES.PROSPECTING,
    'Qualification': STANDARD_STAGES.QUALIFICATION,
    'Closed Won': STANDARD_STAGES.CLOSED_WON,
    'Closed Lost': STANDARD_STAGES.CLOSED_LOST,
    
    // Alternate names and variations
    'Won': STANDARD_STAGES.CLOSED_WON,
    'Lost': STANDARD_STAGES.CLOSED_LOST,
    'Open': STANDARD_STAGES.PROSPECTING,
    'New': STANDARD_STAGES.PROSPECTING,
    'Lead': STANDARD_STAGES.PROSPECTING,
    'Initial Contact': STANDARD_STAGES.PROSPECTING,
    'Follow Up': STANDARD_STAGES.QUALIFICATION,
    'Interested': STANDARD_STAGES.QUALIFICATION,
    
    // Specialized stages (ASG, MagHub, etc.)
    'ASG': STANDARD_STAGES.NEEDS_ANALYSIS,
    'MagHub': STANDARD_STAGES.QUALIFICATION,
    'Technical Review': STANDARD_STAGES.NEEDS_ANALYSIS,
    'Security Review': STANDARD_STAGES.NEGOTIATION,
    'Implementation Planning': STANDARD_STAGES.NEGOTIATION
  };
  
  // Map API stage to standard stage
  export const mapStageToStandard = (apiStage) => {
    if (!apiStage) return STANDARD_STAGES.PROSPECTING;
    return STAGE_MAPPING[apiStage] || apiStage;
  };
  
  // Get stage color for UI display
  export const getStageColor = (stage) => {
    const standardStage = mapStageToStandard(stage);
    
    switch (standardStage) {
      case STANDARD_STAGES.PROSPECTING:
        return 'bg-gray-100 text-gray-800';
      case STANDARD_STAGES.QUALIFICATION:
        return 'bg-blue-100 text-blue-800';
      case STANDARD_STAGES.NEEDS_ANALYSIS:
        return 'bg-yellow-100 text-yellow-800';
      case STANDARD_STAGES.PROPOSAL:
        return 'bg-purple-100 text-purple-800';
      case STANDARD_STAGES.NEGOTIATION:
        return 'bg-orange-100 text-orange-800';
      case STANDARD_STAGES.CLOSED_WON:
        return 'bg-green-100 text-green-800';
      case STANDARD_STAGES.CLOSED_LOST:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get standard stage list for dropdowns
  export const getStandardStageOptions = () => {
    return Object.values(STANDARD_STAGES).map(stage => ({
      value: stage,
      label: stage
    }));
  };