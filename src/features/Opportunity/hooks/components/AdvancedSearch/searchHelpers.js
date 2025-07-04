// Helper function to get ICODE from array (similar to backend implementation)
export const getIcodeFromArray = valueArray => {
  if (!valueArray || valueArray.length === 0) return "";

  // If it's already a string with IE= format, return as is
  if (typeof valueArray === 'string') {
    return valueArray;
  }

  // Convert array of values to ICODE format
  const icodes = valueArray.map(value => {
    // If value already has IE= format, use as is
    if (typeof value === 'string' && value.includes('IE=')) {
      return value;
    }
    // Otherwise, wrap with IE= format
    return `IE=${value}~`;
  }).join('');
  return icodes;
};

// Process search parameters for opportunities API
export const processOpportunitySearchParams = (searchParams) => {
  let processedParams = { ...searchParams };

  // Handle Primary Campaign Source mapping to source field
  if (searchParams.primaryCampaign) {
    processedParams.source = searchParams.primaryCampaign;
    console.log('Mapping primaryCampaign to source field:', searchParams.primaryCampaign);
  }

  // Handle Assigned To field - convert to ICODE format
  if (searchParams.assignedTo) {
    const assignedToValues = searchParams.assignedTo.split(',').filter(v => v);
    const assignedToIcode = getIcodeFromArray(assignedToValues);
    processedParams.assignedTo = assignedToIcode;
    console.log('Converting assignedTo to ICODE format:', {
      original: searchParams.assignedTo,
      converted: assignedToIcode
    });
  }

  // Handle Sales Presenter field - convert to ICODE format if needed
  if (searchParams.salesPresenter) {
    const salesPresenterValues = searchParams.salesPresenter.split(',').filter(v => v);
    const salesPresenterIcode = getIcodeFromArray(salesPresenterValues);
    processedParams.salesPresenter = salesPresenterIcode;
    console.log('Converting salesPresenter to ICODE format:', {
      original: searchParams.salesPresenter,
      converted: salesPresenterIcode
    });
  }

  return processedParams;
};

// Process search parameters for proposals API
export const processProposalSearchParams = (searchParams) => {
  let processedParams = { ...searchParams };

  // For Proposals tab, ensure opportunityName is passed as is
  if (searchParams.opportunityName) {
    processedParams.opportunityName = searchParams.opportunityName;
    console.log('Setting opportunityName for Proposals:', searchParams.opportunityName);
  }

  return processedParams;
};
