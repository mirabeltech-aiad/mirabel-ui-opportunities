import { safeStringToArray } from '@OpportunityUtils/searchUtils';

// Helper function to get ICODE from array (similar to backend implementation)
const getIcodeFromArray = valueArray => {
  if (!valueArray || valueArray.length === 0) return "";

  // If it's already a string with IE= format, return as is
  if (typeof valueArray === 'string' && valueArray.includes('IE=')) {
    return valueArray;
  }

  // // If it's a string but not in IE format, convert it to array first
  // if (typeof valueArray === 'string') {
  //   // Split by comma and process each value
  //   const values = valueArray.split(',').filter(v => v.trim());
  //   const icodes = values.map(value => {
  //     const trimmedValue = value.trim();
  //     // If value already has IE= format, use as is
  //     if (trimmedValue.includes('IE=')) {
  //       return trimmedValue;
  //     }
  //     // Otherwise, wrap with IE= format
  //     return `IE=${trimmedValue}~`;
  //   }).join('');
  //   return icodes;
  // }

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

// Helper function to format date strings
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.warn('Invalid date format:', dateString);
    return "";
  }
};

// Process search parameters for proposals API
export const processProposalSearchParams = (searchParams) => {
  let processedParams = { ...searchParams };

  // Handle Assigned Rep field - convert to ICODE format
  if (searchParams.assignedRep) {
    const assignedRepValues = safeStringToArray(searchParams.assignedRep);
    const assignedRepIcode = getIcodeFromArray(assignedRepValues);
    processedParams.assignedRep = assignedRepIcode;
    console.log('Proposal search - Converting assignedRep to ICODE format:', {
      original: searchParams.assignedRep,
      converted: assignedRepIcode
    });
  }

  // Handle Sales Presenter field - convert to ICODE format
  if (searchParams.salesPresenter) {
    const salesPresenterValues = safeStringToArray(searchParams.salesPresenter);
    const salesPresenterIcode = getIcodeFromArray(salesPresenterValues);
    processedParams.salesPresenter = salesPresenterIcode;
    console.log('Proposal search - Converting salesPresenter to ICODE format:', {
      original: searchParams.salesPresenter,
      converted: salesPresenterIcode
    });
  }

  // Handle Created Rep field - convert to ICODE format
  if (searchParams.createdRep) {
    const createdRepValues = safeStringToArray(searchParams.createdRep);
    const createdRepIcode = getIcodeFromArray(createdRepValues);
    processedParams.createdRep = createdRepIcode;
    console.log('Proposal search - Converting createdRep to ICODE format:', {
      original: searchParams.createdRep,
      converted: createdRepIcode
    });
  }

  // Handle Business Unit field - convert to ICODE format
  if (searchParams.businessUnit) {
    const businessUnitValues = safeStringToArray(searchParams.businessUnit);
    const businessUnitIcode = getIcodeFromArray(businessUnitValues);
    processedParams.businessUnit = businessUnitIcode;
    console.log('Proposal search - Converting businessUnit to ICODE format:', {
      original: searchParams.businessUnit,
      converted: businessUnitIcode
    });
  }

  // Handle Product field - convert to ICODE format
  if (searchParams.product) {
    const productValues = safeStringToArray(searchParams.product);
    const productIcode = getIcodeFromArray(productValues);
    processedParams.product = productIcode;
    console.log('Proposal search - Converting product to ICODE format:', {
      original: searchParams.product,
      converted: productIcode
    });
  }

  // Handle Loss Reason field - convert to ICODE format
  if (searchParams.lossReason) {
    const lossReasonValues = safeStringToArray(searchParams.lossReason);
    const lossReasonIcode = getIcodeFromArray(lossReasonValues);
    processedParams.lossReason = lossReasonIcode;
    console.log('Proposal search - Converting lossReason to ICODE format:', {
      original: searchParams.lossReason,
      converted: lossReasonIcode
    });
  }

  // Handle Type field - convert to ICODE format
  if (searchParams.type) {
    const typeValues = safeStringToArray(searchParams.type);
    const typeIcode = getIcodeFromArray(typeValues);
    processedParams.type = typeIcode;
    console.log('Proposal search - Converting type to ICODE format:', {
      original: searchParams.type,
      converted: typeIcode
    });
  }

  // Handle Stage field - convert to ICODE format
  if (searchParams.stage) {
    const stageValues = safeStringToArray(searchParams.stage);
    const stageIcode = getIcodeFromArray(stageValues);
    processedParams.stage = stageIcode;
    console.log('Proposal search - Converting stage to ICODE format:', {
      original: searchParams.stage,
      converted: stageIcode
    });
  }

  // Handle Probability field - convert to ICODE format
  if (searchParams.probability) {
    const probabilityValues = safeStringToArray(searchParams.probability);
    
    // Check if "All" is selected or if the array is empty
    const hasAll = probabilityValues.some(value => 
      value === "All" || value === "All Probabilities" || value === ""
    );
    
    if (hasAll || probabilityValues.length === 0) {
      // If "All" is selected, set to empty string (means all probabilities)
      processedParams.probability = "";
      console.log('Proposal search - Probability set to empty string for "All":', {
        original: searchParams.probability,
        converted: ""
      });
    } else {
      // Process normal probability values
      const probabilityIcode = getIcodeFromArray(probabilityValues);
      processedParams.probability = probabilityIcode;
      console.log('Proposal search - Converting probability to ICODE format:', {
        original: searchParams.probability,
        converted: probabilityIcode
      });
    }
  }

  // Handle Status field - single select, send value directly
  if (searchParams.status) {
    const statusValue = String(searchParams.status).trim();
    if (statusValue && statusValue !== '') {
      // For single select status, send value directly without IE= format
      processedParams.status = statusValue;
      console.log('Proposal search - Processing status value directly:', {
        original: searchParams.status,
        processed: statusValue
      });
    }
  }

  // Handle Created Date From - format to MM/DD/YYYY
  if (searchParams.createdDateFrom) {
    processedParams.createdDateFrom = formatDate(searchParams.createdDateFrom);
    console.log('Proposal search - Converting createdDateFrom to MM/DD/YYYY format:', {
      original: searchParams.createdDateFrom,
      converted: processedParams.createdDateFrom
    });
  }

  // Handle Created Date To - format to MM/DD/YYYY
  if (searchParams.createdDateTo) {
    processedParams.createdDateTo = formatDate(searchParams.createdDateTo);
    console.log('Proposal search - Converting createdDateTo to MM/DD/YYYY format:', {
      original: searchParams.createdDateTo,
      converted: processedParams.createdDateTo
    });
  }

  // Handle Projected Close Date From - format to MM/DD/YYYY
  if (searchParams.projectedCloseDateFrom) {
    processedParams.projectedCloseDateFrom = formatDate(searchParams.projectedCloseDateFrom);
    console.log('Proposal search - Converting projectedCloseDateFrom to MM/DD/YYYY format:', {
      original: searchParams.projectedCloseDateFrom,
      converted: processedParams.projectedCloseDateFrom
    });
  }

  // Handle Projected Close Date To - format to MM/DD/YYYY
  if (searchParams.projectedCloseDateTo) {
    processedParams.projectedCloseDateTo = formatDate(searchParams.projectedCloseDateTo);
    console.log('Proposal search - Converting projectedCloseDateTo to MM/DD/YYYY format:', {
      original: searchParams.projectedCloseDateTo,
      converted: processedParams.projectedCloseDateTo
    });
  }

  // Handle Actual Close Date From - format to MM/DD/YYYY
  if (searchParams.actualCloseDateFrom) {
    processedParams.actualCloseDateFrom = formatDate(searchParams.actualCloseDateFrom);
    console.log('Proposal search - Converting actualCloseDateFrom to MM/DD/YYYY format:', {
      original: searchParams.actualCloseDateFrom,
      converted: processedParams.actualCloseDateFrom
    });
  }

  // Handle Actual Close Date To - format to MM/DD/YYYY
  if (searchParams.actualCloseDateTo) {
    processedParams.actualCloseDateTo = formatDate(searchParams.actualCloseDateTo);
    console.log('Proposal search - Converting actualCloseDateTo to MM/DD/YYYY format:', {
      original: searchParams.actualCloseDateTo,
      converted: processedParams.actualCloseDateTo
    });
  }

  // Handle City field - convert to ICODE format for multiselect
  if (searchParams.city) {
    const cityValues = safeStringToArray(searchParams.city);
    const cityIcode = getIcodeFromArray(cityValues);
    processedParams.city = cityIcode;
    console.log('Proposal search - Converting city to ICODE format:', {
      original: searchParams.city,
      converted: cityIcode
    });
  }

  // Handle State field - convert to ICODE format for multiselect
  if (searchParams.state) {
    const stateValues = safeStringToArray(searchParams.state);
    const stateIcode = getIcodeFromArray(stateValues);
    processedParams.state = stateIcode;
    console.log('Proposal search - Converting state to ICODE format:', {
      original: searchParams.state,
      converted: stateIcode
    });
  }

  // Handle County field - convert to ICODE format for multiselect
  if (searchParams.county) {
    const countyValues = safeStringToArray(searchParams.county);
    const countyIcode = getIcodeFromArray(countyValues);
    processedParams.county = countyIcode;
    console.log('Proposal search - Converting county to ICODE format:', {
      original: searchParams.county,
      converted: countyIcode
    });
  }

  // Handle Country field - convert to ICODE format for multiselect
  if (searchParams.country) {
    const countryValues = safeStringToArray(searchParams.country);
    const countryIcode = getIcodeFromArray(countryValues);
    processedParams.country = countryIcode;
    console.log('Proposal search - Converting country to ICODE format:', {
      original: searchParams.country,
      converted: countryIcode
    });
  }

  // Handle Opportunity Name field - support both predefined options and custom text
  if (searchParams.opportunityName) {
    const opportunityNameValues = safeStringToArray(searchParams.opportunityName);
    const processedValues = opportunityNameValues
      .filter(v => v && String(v).trim() !== '')
      .map(value => {
        const str = String(value).trim();
        // If it's a predefined option (IN= or INN=), keep as is
        if (str.startsWith('IN=') || str.startsWith('INN=')) {
          return str;
        }
        // For custom text, keep as plain text (no SW= format)
        return str;
      });
    
    // Join multiple values with commas (simple format)
    processedParams.opportunityName = processedValues.join(',');
    console.log('Proposal search - Processing opportunityName:', {
      original: searchParams.opportunityName,
      processed: processedValues,
      final: processedParams.opportunityName
    });
  }



  // Handle Email field - format as SW=value~ for backend compatibility
  if (searchParams.contactEmail || searchParams.email) {
    const emailValues = safeStringToArray(searchParams.contactEmail || searchParams.email);
    const processedValues = emailValues
      .filter(v => v && String(v).trim() !== '')
      .map(value => {
        const str = String(value).trim();
        // If it's already formatted as SW=value~, keep as is
        if (str.startsWith('SW=') && str.endsWith('~')) {
          return str;
        }
        // For email addresses, format as SW=value~
        return `SW=${str}~`;
      });
    
    // Join multiple values with no separator (same as Opportunities)
    const processedEmail = processedValues.join('');
    processedParams.contactEmail = processedEmail;
    processedParams.email = processedEmail;
    console.log('Proposal search - Processing contactEmail:', {
      original: searchParams.contactEmail || searchParams.email,
      processed: processedValues,
      final: processedEmail
    });
  }

  // Handle Phone field - support both predefined options and custom text
  if (searchParams.contactPhone || searchParams.phoneNumber) {
    const phoneValues = safeStringToArray(searchParams.contactPhone || searchParams.phoneNumber);
    const processedValues = phoneValues
      .filter(v => v && String(v).trim() !== '')
      .map(value => {
        const str = String(value).trim();
        // If it's a predefined option (IN= or INN=), keep as is
        if (str.startsWith('IN=') || str.startsWith('INN=')) {
          return str;
        }
        // If it's already formatted as SW=value~, keep as is
        if (str.startsWith('SW=') && str.endsWith('~')) {
          return str;
        }
        // For custom text, format as SW=value~
        return `SW=${str}~`;
      });
    
    // Join multiple values with no separator (same as Opportunities)
    const processedPhone = processedValues.join('');
    processedParams.contactPhone = processedPhone;
    processedParams.phoneNumber = processedPhone;
    console.log('Proposal search - Processing contactPhone:', {
      original: searchParams.contactPhone || searchParams.phoneNumber,
      processed: processedValues,
      final: processedPhone
    });
  }

  // Handle Zip field - support both predefined options and custom text
  if (searchParams.postalCode || searchParams.zipPostalCode) {
    const zipValues = safeStringToArray(searchParams.postalCode || searchParams.zipPostalCode);
    const processedValues = zipValues
      .filter(v => v && String(v).trim() !== '')
      .map(value => {
        const str = String(value).trim();
        // If it's a predefined option (IN= or INN=), keep as is
        if (str.startsWith('IN=') || str.startsWith('INN=')) {
          return str;
        }
        // If it's already formatted as SW=value~, keep as is
        if (str.startsWith('SW=') && str.endsWith('~')) {
          return str;
        }
        // For custom text, format as SW=value~
        return `SW=${str}~`;
      });
    
    // Join multiple values with no separator (same as Opportunities)
    const processedZip = processedValues.join('');
    processedParams.postalCode = processedZip;
    processedParams.zipPostalCode = processedZip;
    console.log('Proposal search - Processing postalCode:', {
      original: searchParams.postalCode || searchParams.zipPostalCode,
      processed: processedValues,
      final: processedZip
    });
  }

  // Handle Company Name field - support both predefined options and custom text
  if (searchParams.companyName || searchParams.companyNameBasic) {
    const companyNameValues = safeStringToArray(searchParams.companyName || searchParams.companyNameBasic);
    const processedValues = companyNameValues
      .filter(v => v && String(v).trim() !== '')
      .map(value => {
        const str = String(value).trim();
        // If it's a predefined option (IN= or INN=), keep as is
        if (str.startsWith('IN=') || str.startsWith('INN=')) {
          return str;
        }
        // If it's already formatted as SW=value~, keep as is
        if (str.startsWith('SW=') && str.endsWith('~')) {
          return str;
        }
        // For custom text, format as SW=value~
        return `SW=${str}~`;
      });
    
    // Join multiple values with the SW= format (no separator between values)
    const processedCompanyName = processedValues.join('');
    processedParams.companyName = processedCompanyName;
    processedParams.companyNameBasic = processedCompanyName;
    console.log('Proposal search - Processing companyName:', {
      original: searchParams.companyName || searchParams.companyNameBasic,
      processed: processedValues,
      final: processedCompanyName
    });
  }

  // Handle Customer Name field - support both predefined options and custom text
  if (searchParams.customerName) {
    const customerNameValues = safeStringToArray(searchParams.customerName);
    const processedValues = customerNameValues
      .filter(v => v && String(v).trim() !== '')
      .map(value => {
        const str = String(value).trim();
        // If it's a predefined option (IN= or INN=), keep as is
        if (str.startsWith('IN=') || str.startsWith('INN=')) {
          return str;
        }
        // If it's already formatted as SW=value~, keep as is
        if (str.startsWith('SW=') && str.endsWith('~')) {
          return str;
        }
        // For custom text, format as SW=value~
        return `SW=${str}~`;
      });
    
    // Join multiple values with the SW= format (no separator between values)
    const processedCustomerName = processedValues.join('');
    processedParams.customerName = processedCustomerName;
    console.log('Proposal search - Processing customerName:', {
      original: searchParams.customerName,
      processed: processedValues,
      final: processedCustomerName
    });
  }

  // Handle InternalApprovalStage field - convert to ICODE format
  if (searchParams.proposalApprovalStages || searchParams.internalApprovalStage) {
    const approvalStageValues = safeStringToArray(searchParams.proposalApprovalStages || searchParams.internalApprovalStage);
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
    const approvalStatusValues = safeStringToArray(searchParams.proposalApprovalStatus);
    const approvalStatusIcode = getIcodeFromArray(approvalStatusValues);
    processedParams.proposalApprovalStatus = approvalStatusIcode;
    console.log('Proposal search - Converting ProposalApprovalStatus to ICODE format:', {
      original: searchParams.proposalApprovalStatus,
      converted: approvalStatusIcode
    });
  }

  // Handle Proposal ID field - support multiple values with SW format
  if (searchParams.proposalId) {
    const proposalIdValues = safeStringToArray(searchParams.proposalId);
    const processedValues = proposalIdValues
      .filter(v => v && String(v).trim() !== '')
      .map(value => {
        const str = String(value).trim();
        // If it's already formatted as SW=value~, keep as is
        if (str.startsWith('SW=') && str.endsWith('~')) {
          return str;
        }
        // For custom text, format as SW=value~
        return `SW=${str}~`;
      });
    
    // Join multiple values with no separator (same as other enhanced fields)
    const processedProposalId = processedValues.join('');
    processedParams.proposalId = processedProposalId;
    console.log('Proposal search - Processing proposalId:', {
      original: searchParams.proposalId,
      processed: processedValues,
      final: processedProposalId
    });
  }

  // Handle Proposal Name field - support multiple values with SW format
  if (searchParams.proposalName) {
    const proposalNameValues = safeStringToArray(searchParams.proposalName);
    const processedValues = proposalNameValues
      .filter(v => v && String(v).trim() !== '')
      .map(value => {
        const str = String(value).trim();
        // If it's already formatted as SW=value~, keep as is
        if (str.startsWith('SW=') && str.endsWith('~')) {
          return str;
        }
        // For custom text, format as SW=value~
        return `SW=${str}~`;
      });
    
    // Join multiple values with no separator (same as other enhanced fields)
    const processedProposalName = processedValues.join('');
    processedParams.proposalName = processedProposalName;
    console.log('Proposal search - Processing proposalName:', {
      original: searchParams.proposalName,
      processed: processedValues,
      final: processedProposalName
    });
  }

  // Handle ProposalStatus field - convert to ICODE format (for IDs)
  if (searchParams.proposalStatus) {
    const proposalStatusValues = safeStringToArray(searchParams.proposalStatus);
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

  // Handle Proposal Amount From field
  if (searchParams.proposalAmountFrom) {
    const amountFromValue = String(searchParams.proposalAmountFrom).trim();
    if (amountFromValue && amountFromValue !== '') {
      processedParams.proposalAmountFrom = amountFromValue;
      console.log('Proposal search - Processing proposalAmountFrom:', {
        original: searchParams.proposalAmountFrom,
        processed: amountFromValue
      });
    }
  }

  // Handle Proposal Amount To field
  if (searchParams.proposalAmountTo) {
    const amountToValue = String(searchParams.proposalAmountTo).trim();
    if (amountToValue && amountToValue !== '') {
      processedParams.proposalAmountTo = amountToValue;
      console.log('Proposal search - Processing proposalAmountTo:', {
        original: searchParams.proposalAmountTo,
        processed: amountToValue
      });
    }
  }

  // Handle Proposal Rep field - convert to IE format (same as assignedRep)
  if (searchParams.proposalRep) {
    // Convert to IE format (same as assignedRep)
    let proposalRepValue;
    if (Array.isArray(searchParams.proposalRep)) {
      // Convert array to IE format
      proposalRepValue = searchParams.proposalRep
        .filter(v => v && v.toString().trim() !== '')
        .map(v => `IE=${v.toString().trim()}~`)
        .join('');
    } else if (typeof searchParams.proposalRep === 'string') {
      if (searchParams.proposalRep.includes('IE=')) {
        // Already in IE format, keep as is
        proposalRepValue = searchParams.proposalRep;
      } else if (searchParams.proposalRep.includes(',')) {
        // Convert comma-separated to IE format
        proposalRepValue = searchParams.proposalRep
          .split(',')
          .filter(v => v.trim())
          .map(v => `IE=${v.trim()}~`)
          .join('');
      } else {
        // Single value, convert to IE format
        proposalRepValue = `IE=${searchParams.proposalRep.trim()}~`;
      }
    } else {
      // Other type, convert to IE format
      proposalRepValue = `IE=${String(searchParams.proposalRep).trim()}~`;
    }
    
    processedParams.proposalRep = proposalRepValue;
  } else {
  }

  // Handle Primary Campaign Source - convert to IE format for campaign sources (ID-based search format)
  if (searchParams.primaryCampaign) {
    // Check if it's already a string in IE format (avoid double processing)
    if (typeof searchParams.primaryCampaign === 'string' && 
        searchParams.primaryCampaign.startsWith('IE=') && 
        searchParams.primaryCampaign.endsWith('~')) {
      processedParams.primaryCampaign = searchParams.primaryCampaign;
      console.log('Primary Campaign Source already in IE format, keeping as is:', {
        original: searchParams.primaryCampaign,
        final: searchParams.primaryCampaign
      });
    } else {
      // Process array or non-IE format string
      const campaignValues = safeStringToArray(searchParams.primaryCampaign);
      const processedValues = campaignValues
        .filter(v => v && String(v).trim() !== '')
        .map(value => {
          const str = String(value).trim();
          // If it's already formatted as IE=value~, keep as is
          if (str.startsWith('IE=') && str.endsWith('~')) {
            return str;
          }
          // For campaign sources, format as IE=value~ (ID-based search format)
          return `IE=${str}~`;
        });
      
      // Join multiple values with the IE= format (no separator between values)
      const processedSource = processedValues.join('');
      processedParams.primaryCampaign = processedSource;
      console.log('Proposal search - Converting primaryCampaign to IE format:', {
        original: searchParams.primaryCampaign,
        processed: processedValues,
        final: processedSource
      });
    }
  }

  // Handle Source field - convert to SW format for general sources (text-based search)
  if (searchParams.source) {
    const sourceValues = safeStringToArray(searchParams.source);
    const processedValues = sourceValues
      .filter(v => v && String(v).trim() !== '')
      .map(value => {
        const str = String(value).trim();
        // If it's already formatted as SW=value~, keep as is
        if (str.startsWith('SW=') && str.endsWith('~')) {
          return str;
        }
        // For general sources, format as SW=value~ (text search format)
        return `SW=${str}~`;
      });
    
    // Join multiple values with the SW= format (no separator between values)
    const processedSource = processedValues.join('');
    processedParams.source = processedSource;
    console.log('Proposal search - Converting source to SW format:', {
      original: searchParams.source,
      processed: processedValues,
      final: processedSource
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
