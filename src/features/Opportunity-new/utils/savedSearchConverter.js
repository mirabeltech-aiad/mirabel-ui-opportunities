/**
 * Utility functions to convert between form fields and API payload for SavedSearch
 */

/**
 * Convert API payload back to form field values
 * This is the reverse of buildSearchJson in searchJsonBuilder.js
 */
export const convertApiPayloadToFormFields = (apiPayload) => {
  if (!apiPayload) return {};

  try {
    const formFields = {};

    // Helper function to extract value from formatted strings
    const extractValue = (formattedValue, format) => {
      if (!formattedValue) return '';
      
      if (format === 'SW') {
        // Handle multiple SW values: "SW=value1~SW=value2~SW=value3~"
        if (formattedValue.includes('SW=') && formattedValue.includes('~')) {
          const matches = formattedValue.match(/SW=([^~]+)~/g);
          if (matches && matches.length > 1) {
            // Multiple values - return as array
            return matches.map(match => match.replace(/SW=|~/g, ''));
          } else if (matches && matches.length === 1) {
            // Single value
            return matches[0].replace(/SW=|~/g, '');
          }
        }
        // Fallback for any remaining SW= or ~ characters
        return formattedValue.replace(/SW=|~/g, '');
      } else if (format === 'IE') {
        // Handle multiple IE values: "IE=id1~IE=id2~IE=id3~"
        if (formattedValue.includes('IE=') && formattedValue.includes('~')) {
          const matches = formattedValue.match(/IE=([^~]+)~/g);
          if (matches && matches.length > 1) {
            // Multiple values - return as array
            return matches.map(match => match.replace(/IE=|~/g, ''));
          } else if (matches && matches.length === 1) {
            // Single value
            return matches[0].replace(/IE=|~/g, '');
          }
        }
        // Fallback for any remaining IE= or ~ characters
        return formattedValue.replace(/IE=|~/g, '');
      } else if (format === 'IN') {
        // Handle IN format: "IN=value~"
        if (formattedValue.includes('IN=') && formattedValue.includes('~')) {
          return formattedValue.replace(/IN=|~/g, '');
        }
        return formattedValue.replace(/IN=|~/g, '');
      } else if (format === 'date') {
        // Handle ISO date format (with T and Z)
        if (formattedValue && formattedValue.includes('T')) {
          const isoDate = new Date(formattedValue);
          return isoDate.toISOString().split('T')[0];
        }
        // Convert MM/DD/YYYY format to YYYY-MM-DD format for HTML5 date inputs
        if (formattedValue && formattedValue.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
          const [month, day, year] = formattedValue.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return formattedValue;
      }
      
      return formattedValue;
    };

    // Map main fields back to form field names
    if (apiPayload.CustomerName) {
      formFields.companyName = extractValue(apiPayload.CustomerName, 'SW');
    }
    
    if (apiPayload.OppName) {
      formFields.opportunityName = extractValue(apiPayload.OppName, 'SW');
      formFields.opportunityNameBasic = extractValue(apiPayload.OppName, 'SW');
    }
    
    if (apiPayload.Type) {
      formFields.type = extractValue(apiPayload.Type, 'IE');
    }
    
    if (apiPayload.BusinessUnit) {
      formFields.businessUnit = extractValue(apiPayload.BusinessUnit, 'IE');
    }
    
    if (apiPayload.Source) {
      formFields.source = extractValue(apiPayload.Source, 'IE');
      formFields.primaryCampaign = extractValue(apiPayload.Source, 'IE');
    }
    
    if (apiPayload.Products) {
      formFields.product = extractValue(apiPayload.Products, 'IE');
    }
    
    if (apiPayload.LossReason) {
      formFields.lossReason = extractValue(apiPayload.LossReason, 'IE');
      formFields.winLossReason = extractValue(apiPayload.LossReason, 'IE');
    }
    
    if (apiPayload.AssignedTo) {
      formFields.assignedRep = extractValue(apiPayload.AssignedTo, 'IE');
    }
    
    if (apiPayload.Arth) {
      formFields.arth = apiPayload.Arth;
    }
    
    if (apiPayload.SalesPresenter) {
      formFields.salesPresenter = extractValue(apiPayload.SalesPresenter, 'IE');
    }
    
    if (apiPayload.Stage) {
      formFields.stage = extractValue(apiPayload.Stage, 'IE');
    }
    
    if (apiPayload.CreatedBy) {
      formFields.createdRep = extractValue(apiPayload.CreatedBy, 'IE');
    }
    
    if (apiPayload.CreatedFrom) {
      formFields.createdDateFrom = extractValue(apiPayload.CreatedFrom, 'date');
      formFields.createdFrom = extractValue(apiPayload.CreatedFrom, 'date');
    }
    
    if (apiPayload.CreatedTo) {
      formFields.createdDateTo = extractValue(apiPayload.CreatedTo, 'date');
      formFields.createdTo = extractValue(apiPayload.CreatedTo, 'date');
    }
    
    if (apiPayload.CloseFrom) {
      formFields.projectedCloseDateFrom = extractValue(apiPayload.CloseFrom, 'date');
      formFields.closeDateFrom = extractValue(apiPayload.CloseFrom, 'date');
    }
    
    if (apiPayload.CloseTo) {
      formFields.projectedCloseDateTo = extractValue(apiPayload.CloseTo, 'date');
      formFields.closeDateTo = extractValue(apiPayload.CloseTo, 'date');
    }



    if (apiPayload.ActualCloseFrom) {
      formFields.actualCloseDateFrom = extractValue(apiPayload.ActualCloseFrom, 'date');
      formFields.actualCloseFrom = extractValue(apiPayload.ActualCloseFrom, 'date');
    }
    
    if (apiPayload.ActualCloseTo) {
      formFields.actualCloseDateTo = extractValue(apiPayload.ActualCloseTo, 'date');
      formFields.actualCloseTo = extractValue(apiPayload.ActualCloseTo, 'date');
    }
    
    if (apiPayload.Status) {
      formFields.status = apiPayload.Status === 'all' ? '' : apiPayload.Status;
    }
    
    if (apiPayload.Probability) {
      formFields.probability = extractValue(apiPayload.Probability, 'IE');
    }

    // Map AdvSearch fields
    if (apiPayload.AdvSearch) {
      const advSearch = apiPayload.AdvSearch;
      
      if (advSearch.City) {
        formFields.city = extractValue(advSearch.City, 'IE');
      }
      
      if (advSearch.State) {
        formFields.state = extractValue(advSearch.State, 'IE');
      }
      
      if (advSearch.Email) {
        formFields.contactEmail = extractValue(advSearch.Email, 'SW');
        formFields.email = extractValue(advSearch.Email, 'SW');
      }
      
      if (advSearch.Phone) {
        formFields.contactPhone = extractValue(advSearch.Phone, 'SW');
      }
      
      if (advSearch.Country) {
        formFields.country = extractValue(advSearch.Country, 'IE');
      }
      
      if (advSearch.County) {
        formFields.county = extractValue(advSearch.County, 'IE');
      }
      
      if (advSearch.Zip) {
        formFields.postalCode = extractValue(advSearch.Zip, 'SW');
      }
      
      if (advSearch.LeadQuality) {
        formFields.leadQuality = extractValue(advSearch.LeadQuality, 'IE');
      }
      
      if (advSearch.LeadTypes) {
        formFields.leadType = extractValue(advSearch.LeadTypes, 'IE');
      }
      
      if (advSearch.LeadSources) {
        formFields.leadSource = extractValue(advSearch.LeadSources, 'IE');
      }
      
      if (advSearch.ProspectingStages) {
        formFields.prospectingStages = extractValue(advSearch.ProspectingStages, 'IE');
      }
      
      if (advSearch.WorkFlows) {
        formFields.workFlows = extractValue(advSearch.WorkFlows, 'IE');
      }
      
      if (advSearch.LeadStatus) {
        formFields.leadStatus = extractValue(advSearch.LeadStatus, 'IE');
      }
    }

    // Map Proposal-specific fields
    if (apiPayload.ProposalRep) {
      formFields.proposalRep = extractValue(apiPayload.ProposalRep, 'IE');
    }
    
    if (apiPayload.ProposalName) {
      formFields.proposalName = extractValue(apiPayload.ProposalName, 'SW');
    }
    
    if (apiPayload.ProposalStatus) {
      formFields.proposalStatus = extractValue(apiPayload.ProposalStatus, 'IE');
    }
    
    if (apiPayload.ProposalIDs) {
      formFields.proposalId = extractValue(apiPayload.ProposalIDs, 'SW');
    }
    
    if (apiPayload.ProposalApprovalStatus) {
      formFields.proposalApprovalStatus = extractValue(apiPayload.ProposalApprovalStatus, 'IE');
    }
    
    if (apiPayload.ProposalESignStatus) {
      formFields.proposalESignStatus = extractValue(apiPayload.ProposalESignStatus, 'IE');
    }
    
    if (apiPayload.ProposalCreateDateRangeFrom) {
      // Handle ISO date format from API response
      const dateValue = apiPayload.ProposalCreateDateRangeFrom;
      console.log('Processing ProposalCreateDateRangeFrom:', dateValue);
      if (dateValue && dateValue.includes('T')) {
        // Convert ISO date to YYYY-MM-DD format
        const isoDate = new Date(dateValue);
        formFields.proposalCreatedDateFrom = isoDate.toISOString().split('T')[0];
        console.log('Converted ISO date to YYYY-MM-DD:', formFields.proposalCreatedDateFrom);
      } else {
        formFields.proposalCreatedDateFrom = extractValue(dateValue, 'date');
        console.log('Extracted date value:', formFields.proposalCreatedDateFrom);
      }
    }
    
    if (apiPayload.ProposalCreateDateRangeTo) {
      // Handle ISO date format from API response
      const dateValue = apiPayload.ProposalCreateDateRangeTo;
      console.log('Processing ProposalCreateDateRangeTo:', dateValue);
      if (dateValue && dateValue.includes('T')) {
        // Convert ISO date to YYYY-MM-DD format
        const isoDate = new Date(dateValue);
        formFields.proposalCreatedDateTo = isoDate.toISOString().split('T')[0];
        console.log('Converted ISO date to YYYY-MM-DD:', formFields.proposalCreatedDateTo);
      } else {
        formFields.proposalCreatedDateTo = extractValue(dateValue, 'date');
        console.log('Extracted date value:', formFields.proposalCreatedDateTo);
      }
    }
    
    // Also handle the direct field names if they exist
    if (apiPayload.proposalCreatedDateFrom) {
      const dateValue = apiPayload.proposalCreatedDateFrom;
      console.log('Processing proposalCreatedDateFrom:', dateValue);
      if (dateValue && dateValue.includes('T')) {
        const isoDate = new Date(dateValue);
        formFields.proposalCreatedDateFrom = isoDate.toISOString().split('T')[0];
        console.log('Converted ISO date to YYYY-MM-DD:', formFields.proposalCreatedDateFrom);
      } else {
        formFields.proposalCreatedDateFrom = extractValue(dateValue, 'date');
        console.log('Extracted date value:', formFields.proposalCreatedDateFrom);
      }
    }
    
    if (apiPayload.proposalCreatedDateTo) {
      const dateValue = apiPayload.proposalCreatedDateTo;
      console.log('Processing proposalCreatedDateTo:', dateValue);
      if (dateValue && dateValue.includes('T')) {
        const isoDate = new Date(dateValue);
        formFields.proposalCreatedDateTo = isoDate.toISOString().split('T')[0];
        console.log('Converted ISO date to YYYY-MM-DD:', formFields.proposalCreatedDateTo);
      } else {
        formFields.proposalCreatedDateTo = extractValue(dateValue, 'date');
        console.log('Extracted date value:', formFields.proposalCreatedDateTo);
      }
    }
    
    if (apiPayload.ProposalTotalRangeFrom) {
      formFields.proposalAmountFrom = apiPayload.ProposalTotalRangeFrom;
    }
    
    if (apiPayload.ProposalTotalRangeTo) {
      formFields.proposalAmountTo = apiPayload.ProposalTotalRangeTo;
    }
    
    if (apiPayload.InternalApprovalStage) {
      formFields.proposalApprovalStages = extractValue(apiPayload.InternalApprovalStage, 'IE');
    }

    console.log('Converted API payload to form fields:', {
      apiPayload,
      formFields
    });

    return formFields;
    
  } catch (error) {
    console.error('Error converting API payload to form fields:', error);
    return {};
  }
};

/**
 * Convert API response to searchParams format for Advanced Search
 * This converts the API response to the format shown in the image
 */
export const convertApiResponseToSearchParams = (apiResponse) => {
  if (!apiResponse || !apiResponse.content || !apiResponse.content.Data) {
    return {};
  }

  try {
    // Parse the Data field which contains the search criteria as JSON string
    const searchData = JSON.parse(apiResponse.content.Data);
    
    console.log('Converting API response to searchParams:', searchData);
    
    // Convert to form fields first
    const formFields = convertApiPayloadToFormFields(searchData);
    
    // Convert form fields to searchParams format (arrays for multi-select fields)
    const searchParams = {};
    
    Object.entries(formFields).forEach(([key, value]) => {
      if (value) {
        // Handle different value types and convert to appropriate format
        if (typeof value === 'string') {
          // Check if it's a formatted string with SW=, IE=, or IN=
          if (value.includes('SW=') || value.includes('IE=') || value.includes('IN=')) {
            // Extract the actual value from the formatted string
            const extractedValue = value.replace(/SW=|IE=|IN=|~/g, '');
            if (extractedValue) {
              // For date fields, keep as string; for others, use array
              if (key.includes('Date') || key.includes('From') || key.includes('To')) {
                searchParams[key] = extractedValue;
              } else {
                searchParams[key] = [extractedValue];
              }
            }
          } else if (value.includes(',')) {
            // Handle comma-separated values
            searchParams[key] = value.split(',').map(v => v.trim()).filter(Boolean);
          } else {
            // Single string value - for date fields, keep as string; for others, use array
            if (key.includes('Date') || key.includes('From') || key.includes('To')) {
              searchParams[key] = value;
            } else {
              searchParams[key] = [value];
            }
          }
        } else if (Array.isArray(value)) {
          // Already an array
          searchParams[key] = value;
        } else if (typeof value === 'number') {
          // Numeric value
          searchParams[key] = [value.toString()];
        } else {
          // Other types
          searchParams[key] = [value];
        }
      }
    });
    
    console.log('Converted searchParams:', searchParams);
    return searchParams;
    
  } catch (error) {
    console.error('Error converting API response to searchParams:', error);
    return {};
  }
};

/**
 * Get search summary from form fields for display
 */
export const getSearchSummaryFromFormFields = (formFields) => {
  const activeCriteria = [];
  
  // Check each field and add to summary if it has a value
  Object.entries(formFields).forEach(([key, value]) => {
    if (value && value.trim && value.trim() !== '') {
      // Convert camelCase to readable format
      const readableKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      
      activeCriteria.push(`${readableKey}: ${value}`);
    }
  });
  
  return {
    count: activeCriteria.length,
    summary: activeCriteria.join(', '),
    hasCriteria: activeCriteria.length > 0
  };
};

/**
 * Determine search type from form fields or API payload
 */
export const getSearchTypeFromData = (data) => {
  if (data.ResultType) {
    return data.ResultType === 2 ? 'proposal' : 'opportunity';
  }
  
  // Check if proposal-specific fields are present
  const proposalFields = [
    'proposalRep', 'proposalName', 'proposalStatus', 'proposalId',
    'proposalApprovalStatus', 'proposalESignStatus', 'proposalCreatedDateFrom',
    'proposalCreatedDateTo', 'proposalAmountFrom', 'proposalAmountTo',
    'proposalApprovalStages'
  ];
  
  const hasProposalFields = proposalFields.some(field => data[field]);
  
  return hasProposalFields ? 'proposal' : 'opportunity';
};