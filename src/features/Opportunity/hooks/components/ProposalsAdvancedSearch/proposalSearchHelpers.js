// Helper function to get ICODE from array (proposal-specific implementation)
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

// Format date helper - MM/DD/YYYY format
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Process search parameters specifically for proposals API
export const processProposalSearchParams = (searchParams) => {
  let processedParams = { ...searchParams };

  // For Proposals, ensure opportunityName is passed as is
  if (searchParams.opportunityName) {
    processedParams.opportunityName = searchParams.opportunityName;
    console.log('Proposal search - Setting opportunityName:', searchParams.opportunityName);
  }

  // Handle Assigned Rep field - convert to ICODE format
  if (searchParams.assignedRep) {
    const assignedRepValues = searchParams.assignedRep.split(',').filter(v => v);
    const assignedRepIcode = getIcodeFromArray(assignedRepValues);
    processedParams.assignedRep = assignedRepIcode;
    console.log('Proposal search - Converting assignedRep to ICODE format:', {
      original: searchParams.assignedRep,
      converted: assignedRepIcode
    });
  }

  // Handle Sales Presenter field - convert to ICODE format
  if (searchParams.salesPresenter) {
    const salesPresenterValues = searchParams.salesPresenter.split(',').filter(v => v);
    const salesPresenterIcode = getIcodeFromArray(salesPresenterValues);
    processedParams.salesPresenter = salesPresenterIcode;
    console.log('Proposal search - Converting salesPresenter to ICODE format:', {
      original: searchParams.salesPresenter,
      converted: salesPresenterIcode
    });
  }

  // Handle Loss Reason field - convert to ICODE format
  if (searchParams.lossReason) {
    const lossReasonValues = searchParams.lossReason.split(',').filter(v => v);
    const lossReasonIcode = getIcodeFromArray(lossReasonValues);
    processedParams.lossReason = lossReasonIcode;
    console.log('Proposal search - Converting lossReason to ICODE format:', {
      original: searchParams.lossReason,
      converted: lossReasonIcode
    });
  }

  // Handle Type field - convert to ICODE format
  if (searchParams.type) {
    const typeValues = searchParams.type.split(',').filter(v => v);
    const typeIcode = getIcodeFromArray(typeValues);
    processedParams.type = typeIcode;
    console.log('Proposal search - Converting type to ICODE format:', {
      original: searchParams.type,
      converted: typeIcode
    });
  }

  // Handle Stage field - convert to ICODE format
  if (searchParams.stage) {
    const stageValues = searchParams.stage.split(',').filter(v => v);
    const stageIcode = getIcodeFromArray(stageValues);
    processedParams.stage = stageIcode;
    console.log('Proposal search - Converting stage to ICODE format:', {
      original: searchParams.stage,
      converted: stageIcode
    });
  }

  // Handle Probability field - convert to ICODE format
  if (searchParams.probability) {
    const probabilityValues = searchParams.probability.split(',').filter(v => v);
    const probabilityIcode = getIcodeFromArray(probabilityValues);
    processedParams.probability = probabilityIcode;
    console.log('Proposal search - Converting probability to ICODE format:', {
      original: searchParams.probability,
      converted: probabilityIcode
    });
  }

  // Handle City field - convert to ICODE format
  if (searchParams.city) {
    const cityValues = searchParams.city.split(',').filter(v => v);
    const cityIcode = getIcodeFromArray(cityValues);
    processedParams.city = cityIcode;
    console.log('Proposal search - Converting city to ICODE format:', {
      original: searchParams.city,
      converted: cityIcode
    });
  }

  // Handle Country field - convert to ICODE format
  if (searchParams.country) {
    const countryValues = searchParams.country.split(',').filter(v => v);
    const countryIcode = getIcodeFromArray(countryValues);
    processedParams.country = countryIcode;
    console.log('Proposal search - Converting country to ICODE format:', {
      original: searchParams.country,
      converted: countryIcode
    });
  }

  // Handle County field - convert to ICODE format
  if (searchParams.county) {
    const countyValues = searchParams.county.split(',').filter(v => v);
    const countyIcode = getIcodeFromArray(countyValues);
    processedParams.county = countyIcode;
    console.log('Proposal search - Converting county to ICODE format:', {
      original: searchParams.county,
      converted: countyIcode
    });
  }

  // Handle State field - convert to ICODE format
  if (searchParams.state) {
    const stateValues = searchParams.state.split(',').filter(v => v);
    const stateIcode = getIcodeFromArray(stateValues);
    processedParams.state = stateIcode;
    console.log('Proposal search - Converting state to ICODE format:', {
      original: searchParams.state,
      converted: stateIcode
    });
  }

  // Handle Email field - convert to SW format
  if (searchParams.contactEmail || searchParams.email) {
    const emailValue = searchParams.contactEmail || searchParams.email;
    processedParams.contactEmail = `SW=${emailValue.trim()}~`;
    processedParams.email = `SW=${emailValue.trim()}~`;
    console.log('Proposal search - Converting email to SW format:', {
      original: emailValue,
      converted: processedParams.contactEmail
    });
  }

  // Handle Phone field - convert to SW format
  if (searchParams.contactPhone || searchParams.phoneNumber) {
    const phoneValue = searchParams.contactPhone || searchParams.phoneNumber;
    processedParams.contactPhone = `SW=${phoneValue.trim()}~`;
    processedParams.phoneNumber = `SW=${phoneValue.trim()}~`;
    console.log('Proposal search - Converting phone to SW format:', {
      original: phoneValue,
      converted: processedParams.contactPhone
    });
  }

  // Handle Zip field - convert to SW format
  if (searchParams.postalCode || searchParams.zipPostalCode) {
    const zipValue = searchParams.postalCode || searchParams.zipPostalCode;
    processedParams.postalCode = `SW=${zipValue.trim()}~`;
    processedParams.zipPostalCode = `SW=${zipValue.trim()}~`;
    console.log('Proposal search - Converting zip to SW format:', {
      original: zipValue,
      converted: processedParams.postalCode
    });
  }

  // Handle Customer Name field - convert to SW format
  if (searchParams.customerName || searchParams.companyName || searchParams.companyNameBasic) {
    const customerName = searchParams.customerName || searchParams.companyName || searchParams.companyNameBasic;
    processedParams.customerName = `SW=${customerName.trim()}~`;
    processedParams.companyName = `SW=${customerName.trim()}~`;
    processedParams.companyNameBasic = `SW=${customerName.trim()}~`;
    console.log('Proposal search - Converting customerName to SW format:', {
      original: customerName,
      converted: processedParams.customerName
    });
  }

  // Handle InternalApprovalStage field - convert to ICODE format
  if (searchParams.proposalApprovalStages || searchParams.internalApprovalStage) {
    const approvalStageValues = (searchParams.proposalApprovalStages || searchParams.internalApprovalStage).split(',').filter(v => v);
    const approvalStageIcode = getIcodeFromArray(approvalStageValues);
    processedParams.proposalApprovalStages = approvalStageIcode;
    processedParams.internalApprovalStage = approvalStageIcode;
    console.log('Proposal search - Converting InternalApprovalStage to ICODE format:', {
      original: searchParams.proposalApprovalStages || searchParams.internalApprovalStage,
      converted: approvalStageIcode
    });
  }

  // Handle ProposalApprovalStatus field - convert to ICODE format (for IDs)
  if (searchParams.proposalApprovalStatus) {
    const approvalStatusValues = searchParams.proposalApprovalStatus.split(',').filter(v => v);
    const approvalStatusIcode = getIcodeFromArray(approvalStatusValues);
    processedParams.proposalApprovalStatus = approvalStatusIcode;
    console.log('Proposal search - Converting ProposalApprovalStatus to ICODE format:', {
      original: searchParams.proposalApprovalStatus,
      converted: approvalStatusIcode
    });
  }

  // Handle ProposalIDs field - convert to SW format
  if (searchParams.proposalId) {
    processedParams.proposalId = `SW=${searchParams.proposalId.trim()}~`;
    console.log('Proposal search - Converting proposalId to SW format:', {
      original: searchParams.proposalId,
      converted: processedParams.proposalId
    });
  }

  // Handle ProposalName field - convert to SW format
  if (searchParams.proposalName) {
    processedParams.proposalName = `SW=${searchParams.proposalName.trim()}~`;
    console.log('Proposal search - Converting proposalName to SW format:', {
      original: searchParams.proposalName,
      converted: processedParams.proposalName
    });
  }

  // Handle ProposalStatus field - convert to ICODE format (for IDs)
  if (searchParams.proposalStatus) {
    const proposalStatusValues = searchParams.proposalStatus.split(',').filter(v => v);
    const proposalStatusIcode = getIcodeFromArray(proposalStatusValues);
    processedParams.proposalStatus = proposalStatusIcode;
    console.log('Proposal search - Converting ProposalStatus to ICODE format:', {
      original: searchParams.proposalStatus,
      converted: proposalStatusIcode
    });
  }

  // Handle Proposal Creation Date From - format to MM/DD/YYYY
  if (searchParams.proposalCreatedDateFrom) {
    processedParams.proposalCreatedDateFrom = formatDate(searchParams.proposalCreatedDateFrom);
    console.log('Proposal search - Converting proposalCreatedDateFrom to MM/DD/YYYY format:', {
      original: searchParams.proposalCreatedDateFrom,
      converted: processedParams.proposalCreatedDateFrom
    });
  }

  // Handle Proposal Creation Date To - format to MM/DD/YYYY
  if (searchParams.proposalCreatedDateTo) {
    processedParams.proposalCreatedDateTo = formatDate(searchParams.proposalCreatedDateTo);
    console.log('Proposal search - Converting proposalCreatedDateTo to MM/DD/YYYY format:', {
      original: searchParams.proposalCreatedDateTo,
      converted: processedParams.proposalCreatedDateTo
    });
  }

  // Handle Proposal Rep field - convert to ICODE format
  if (searchParams.proposalRep) {
    const proposalRepValues = searchParams.proposalRep.split(',').filter(v => v);
    const proposalRepIcode = getIcodeFromArray(proposalRepValues);
    processedParams.proposalRep = proposalRepIcode;
    console.log('Proposal search - Converting proposalRep to ICODE format:', {
      original: searchParams.proposalRep,
      converted: proposalRepIcode
    });
  }

  // Handle Source field - convert to ICODE format
  if (searchParams.source || searchParams.primaryCampaignSource) {
    const sourceValues = (searchParams.source || searchParams.primaryCampaignSource).split(',').filter(v => v);
    const sourceIcode = getIcodeFromArray(sourceValues);
    processedParams.source = sourceIcode;
    processedParams.primaryCampaignSource = sourceIcode;
    console.log('Proposal search - Converting source to ICODE format:', {
      original: searchParams.source || searchParams.primaryCampaignSource,
      converted: sourceIcode
    });
  }

  // Handle Client Company field if needed
  if (searchParams.clientCompany) {
    processedParams.company = searchParams.clientCompany;
    console.log('Proposal search - Mapping clientCompany to company field:', searchParams.clientCompany);
  }

  console.log('Final processed proposal search params:', processedParams);
  return processedParams;
};
