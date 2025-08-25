import { safeStringToArray } from '@OpportunityUtils/searchUtils';

// Helper function to get ICODE from array (similar to backend implementation)
export const getIcodeFromArray = valueArray => {
  if (!valueArray || valueArray.length === 0) return "";

  // If it's already a string with IE= format, return as is
  if (typeof valueArray === 'string') {
    return valueArray;
  }

  // Convert array of values to ICODE format
  const icodes = valueArray
    .filter(v => v && String(v).trim() !== '')
    .map(value => {
      let str = String(value).trim();
      
      // If it already starts with IE=, it's already in IE format
      if (str.startsWith('IE=')) {
        // Remove any trailing ~ and add a single ~
        return str.replace(/~+$/, '') + '~';
      }
      
      // Remove % symbol if present (for probability values)
      str = str.replace('%', '');
      
      // Otherwise, wrap with IE= and add a single ~
      return `IE=${str.replace(/~+$/, '')}~`;
    }).join('');
  return icodes;
};

// Process search parameters for opportunities API
export const processOpportunitySearchParams = (searchParams) => {
  let processedParams = { ...searchParams };

  // Handle Source field - convert to simple comma-separated string
  if (searchParams.source) {
    const sourceValues = safeStringToArray(searchParams.source);
    const processedValues = sourceValues
      .filter(v => v && String(v).trim() !== '')
      .map(value => String(value).trim());
    
    // Join multiple values with commas
    processedParams.source = processedValues.join(',');
    console.log('Converting source to comma-separated format:', {
      original: searchParams.source,
      processed: processedValues,
      final: processedParams.source
    });
  }

  // Handle Primary Campaign Source - convert to IE format for campaign sources
  if (searchParams.primaryCampaign) {
    // Check if it's already a string in IE format (avoid double processing)
    if (typeof searchParams.primaryCampaign === 'string' && 
        searchParams.primaryCampaign.startsWith('IE=') && 
        searchParams.primaryCampaign.endsWith('~')) {
      processedParams.primaryCampaign = searchParams.primaryCampaign;
      console.log('Primary Campaign already in IE format, keeping as is:', {
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
      console.log('Converting primaryCampaign to IE format:', {
        original: searchParams.primaryCampaign,
        processed: processedValues,
        final: processedSource
      });
    }
  }

  // Handle Assigned Rep field - convert to ICODE format
  if (searchParams.assignedRep) {
    const assignedRepValues = safeStringToArray(searchParams.assignedRep);
    
    // Check if "All Reps" is selected or if the array is empty
    const hasAllReps = assignedRepValues.some(value => 
      value === "All Reps" || value === "ALL_REPS" || value === ""
    );
    
    if (hasAllReps || assignedRepValues.length === 0) {
      // If "All Reps" is selected, set to empty string
      processedParams.assignedRep = "";
      console.log('Assigned Rep set to empty string for "All Reps":', {
        original: searchParams.assignedRep,
        converted: ""
      });
    } else {
      // Process normal assigned rep values
    const assignedRepIcode = getIcodeFromArray(assignedRepValues);
    processedParams.assignedRep = assignedRepIcode;
    console.log('Converting assignedRep to ICODE format:', {
      original: searchParams.assignedRep,
      converted: assignedRepIcode
    });
    }
  }

  // Handle Sales Presenter field - convert to ICODE format if needed
  if (searchParams.salesPresenter) {
    const salesPresenterValues = safeStringToArray(searchParams.salesPresenter);
    const salesPresenterIcode = getIcodeFromArray(salesPresenterValues);
    processedParams.salesPresenter = salesPresenterIcode;
    console.log('Converting salesPresenter to ICODE format:', {
      original: searchParams.salesPresenter,
      converted: salesPresenterIcode
    });
  }

  // Handle Probability field - convert to ICODE format (matching Quick Filters logic)
  if (searchParams.probability) {
    const probabilityValues = safeStringToArray(searchParams.probability);
    
    // Check if "All" is selected or if the array is empty
    const hasAll = probabilityValues.some(value => 
      value === "All" || value === "All Probabilities" || value === ""
    );
    
    if (hasAll || probabilityValues.length === 0) {
      // If "All" is selected, set to empty string (means all probabilities)
      processedParams.probability = "";
      console.log('Converting probability to empty string for "All":', {
        original: searchParams.probability,
        converted: ""
      });
    } else {
      // Filter out empty values and process normal probability values
      const cleanProbabilityValues = probabilityValues
        .filter(v => v && String(v).trim() !== '');
      
      const probabilityIcode = getIcodeFromArray(cleanProbabilityValues);
      processedParams.probability = probabilityIcode;
      console.log('Converting probability to ICODE format:', {
        original: searchParams.probability,
        cleaned: cleanProbabilityValues,
        converted: probabilityIcode
      });
    }
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
        // If it's already formatted as SW=value~, keep as is
        if (str.startsWith('SW=') && str.endsWith('~')) {
          return str;
        }
        // For custom text, format as SW=value~
        return `SW=${str}~`;
      });
    
    // Join multiple values with the SW= format
    processedParams.opportunityName = processedValues.join('');
    console.log('Processing opportunityName:', {
      original: searchParams.opportunityName,
      processed: processedValues,
      final: processedParams.opportunityName
    });
  }

  // Handle Opportunity Name Basic field (from BasicSearchFields)
  if (searchParams.opportunityNameBasic) {
    const opportunityNameBasicValues = safeStringToArray(searchParams.opportunityNameBasic);
    const processedValues = opportunityNameBasicValues
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
    
    // Join multiple values with the SW= format
    processedParams.opportunityNameBasic = processedValues.join('');
    console.log('Processing opportunityNameBasic:', {
      original: searchParams.opportunityNameBasic,
      processed: processedValues,
      final: processedParams.opportunityNameBasic
    });
  }

  // Handle Company Name field - support both predefined options and custom text
  if (searchParams.companyName) {
    const companyNameValues = safeStringToArray(searchParams.companyName);
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
    console.log('Processing companyName:', {
      original: searchParams.companyName,
      processed: processedValues,
      final: processedCompanyName
    });
  }

  // Handle Company Name Basic field - support both predefined options and custom text
  if (searchParams.companyNameBasic) {
    const companyNameBasicValues = safeStringToArray(searchParams.companyNameBasic);
    const processedValues = companyNameBasicValues
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
    const processedCompanyNameBasic = processedValues.join('');
    processedParams.companyNameBasic = processedCompanyNameBasic;
    console.log('Processing companyNameBasic:', {
      original: searchParams.companyNameBasic,
      processed: processedValues,
      final: processedCompanyNameBasic
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
    console.log('Processing customerName:', {
      original: searchParams.customerName,
      processed: processedValues,
      final: processedCustomerName
    });
  }

  // Handle ZIP/Postal Code field - support both predefined options and custom text
  if (searchParams.postalCode) {
    const postalCodeValues = safeStringToArray(searchParams.postalCode);
    const processedValues = postalCodeValues
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
    
    // Join multiple values with the SW= format
    processedParams.postalCode = processedValues.join('');
    console.log('Processing postalCode:', {
      original: searchParams.postalCode,
      processed: processedValues,
      final: processedParams.postalCode
    });
  }

  // Handle Phone field - support both predefined options and custom text
  if (searchParams.contactPhone) {
    const phoneValues = safeStringToArray(searchParams.contactPhone);
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
    
    // Join multiple values with the SW= format
    processedParams.contactPhone = processedValues.join('');
    console.log('Processing contactPhone:', {
      original: searchParams.contactPhone,
      processed: processedValues,
      final: processedParams.contactPhone
    });
  }

  // Handle Status field - ensure it's properly formatted
  if (searchParams.status) {
    const statusValue = String(searchParams.status).trim();
    if (statusValue && statusValue !== 'All' && statusValue !== 'All Opportunities') {
      processedParams.status = statusValue;
    }
  }

  // Handle Quick Status field (Quick Filter) - ensure it's properly formatted
  if (searchParams.quickStatus) {
    const quickStatusValue = String(searchParams.quickStatus).trim();
    if (quickStatusValue && quickStatusValue !== 'All' && quickStatusValue !== 'All Opportunities') {
      processedParams.quickStatus = quickStatusValue;
    }
  }

  // Handle Lead Status field - convert to ICODE format
  if (searchParams.leadStatus) {
    console.log('Processing Lead Status - Original value:', searchParams.leadStatus);
    console.log('Processing Lead Status - Type:', typeof searchParams.leadStatus);
    console.log('Processing Lead Status - Is Array:', Array.isArray(searchParams.leadStatus));
    
    const leadStatusValues = safeStringToArray(searchParams.leadStatus);
    console.log('Processing Lead Status - After safeStringToArray:', leadStatusValues);
    
    const leadStatusIcode = getIcodeFromArray(leadStatusValues);
    console.log('Processing Lead Status - After getIcodeFromArray:', leadStatusIcode);
    
    processedParams.leadStatus = leadStatusIcode;
    console.log('Converting leadStatus to ICODE format:', {
      original: searchParams.leadStatus,
      converted: leadStatusIcode
    });
  } else {
    console.log('Lead Status is not present in searchParams');
  }

  // Handle Lead Type field - convert to ICODE format
  if (searchParams.leadType) {
    const leadTypeValues = safeStringToArray(searchParams.leadType);
    const leadTypeIcode = getIcodeFromArray(leadTypeValues);
    processedParams.leadType = leadTypeIcode;
    console.log('Converting leadType to ICODE format:', {
      original: searchParams.leadType,
      converted: leadTypeIcode
    });
  }

  // Handle Lead Source field - convert to ICODE format
  if (searchParams.leadSource) {
    const leadSourceValues = safeStringToArray(searchParams.leadSource);
    const leadSourceIcode = getIcodeFromArray(leadSourceValues);
    processedParams.leadSource = leadSourceIcode;
    console.log('Converting leadSource to ICODE format:', {
      original: searchParams.leadSource,
      converted: leadSourceIcode
    });
  }

  return processedParams;
};

// Process search parameters for proposals API
export const processProposalSearchParams = (searchParams) => {
  let processedParams = { ...searchParams };

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
        // If it's already formatted as SW=value~, keep as is
        if (str.startsWith('SW=') && str.endsWith('~')) {
          return str;
        }
        // For custom text, format as SW=value~
        return `SW=${str}~`;
      });
    
    // Join multiple values with the SW= format
    processedParams.opportunityName = processedValues.join('');
    console.log('Processing opportunityName:', {
      original: searchParams.opportunityName,
      processed: processedValues,
      final: processedParams.opportunityName
    });
  }

  return processedParams;
};
