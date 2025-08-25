import { OPPORTUNITY_OPTIONS } from "@/features/Opportunity/constants/opportunityOptions";

// Helper function to get display label for a value in Proposals Advanced Search
export const getLabelForValue = (fieldName, value, optionsMap = {}) => {
  if (!value) return '';
  
  const strValue = String(value);
  
  // Special handling for user-related fields (createdRep, assignedRep, salesPresenter)
  if (fieldName === 'createdRep' || fieldName === 'assignedRep' || fieldName === 'salesPresenter') {
    
    // Handle IE= format (ID-based values)
    if (strValue.includes('IE=')) {
      const idMatch = strValue.match(/IE=([^~]+)~/g);
      if (idMatch) {
        const ids = idMatch.map(match => match.replace('IE=', '').replace('~', ''));
        return ids.map(id => {
          // Try to find the label in the provided options map (for API-fetched data)
          if (optionsMap[fieldName]) {
            const option = optionsMap[fieldName].find(opt => opt.value === id || opt.value === String(id));
            if (option) return option.label;
          }
          return id;
        }).join(', ');
      }
    }
    
    // Handle comma-separated values (direct values without IE= format)
    if (strValue.includes(',')) {
      return strValue.split(',').map(v => v.trim()).map(id => {
        // Try to find the label in the provided options map
        if (optionsMap[fieldName]) {
          const option = optionsMap[fieldName].find(opt => opt.value === id || opt.value === String(id));
          if (option) return option.label;
        }
        return id;
      }).join(', ');
    }
    
    // Handle single value
    if (optionsMap[fieldName]) {
      const option = optionsMap[fieldName].find(opt => opt.value === strValue || opt.value === String(strValue));
      if (option) return option.label;
    }
    
    return strValue;
  }
  
  // Special handling for businessUnit and product fields
  if (fieldName === 'businessUnit' || fieldName === 'product') {
    // Handle IE= format (ID-based values)
    if (strValue.includes('IE=')) {
      const idMatch = strValue.match(/IE=([^~]+)~/g);
      if (idMatch) {
        const ids = idMatch.map(match => match.replace('IE=', '').replace('~', ''));
        return ids.map(id => {
          // Try to find the label in the provided options map (for API-fetched data)
          if (optionsMap[fieldName]) {
            const option = optionsMap[fieldName].find(opt => opt.value === id || opt.value === String(id));
            if (option) return option.label;
          }
          return id;
        }).join(', ');
      }
    }
    
    // Handle comma-separated values (direct values without IE= format)
    if (strValue.includes(',')) {
      return strValue.split(',').map(v => v.trim()).map(id => {
        // Try to find the label in the provided options map
        if (optionsMap[fieldName]) {
          const option = optionsMap[fieldName].find(opt => opt.value === id || opt.value === String(id));
          if (option) return option.label;
        }
        return id;
      }).join(', ');
    }
    
    // Handle single value
    if (optionsMap[fieldName]) {
      const option = optionsMap[fieldName].find(opt => opt.value === strValue || opt.value === String(strValue));
      if (option) return option.label;
    }
    
    return strValue;
  }
  
  // Special handling for type and lossReason fields
  if (fieldName === 'type' || fieldName === 'lossReason') {
    // Handle IE= format (ID-based values) - this is the actual format stored in search params
    if (strValue.includes('IE=')) {
      const idMatch = strValue.match(/IE=([^~]+)~/g);
      if (idMatch) {
        const ids = idMatch.map(match => match.replace('IE=', '').replace('~', ''));
        return ids.map(id => {
          // Try to find the label in the provided options map (for API-fetched data)
          if (optionsMap[fieldName]) {
            // Try multiple ways to match the value - the API returns objects with value and label
            const option = optionsMap[fieldName].find(opt => 
              opt.value === id || 
              opt.value === String(id) || 
              opt.value === Number(id) ||
              opt.ID === id ||
              opt.ID === String(id) ||
              opt.ID === Number(id)
            );
            if (option) {
              return option.label || option.Name;
            }
          }
          return id;
        }).join(', ');
      }
    }
    
    // Handle comma-separated values (direct values without IE= format)
    if (strValue.includes(',') && !strValue.includes('IE=')) {
      const ids = strValue.split(',').map(v => v.trim());
      return ids.map(id => {
        // Try to find the label in the provided options map
        if (optionsMap[fieldName]) {
          // Try multiple ways to match the value
          const option = optionsMap[fieldName].find(opt => 
            opt.value === id || 
            opt.value === String(id) || 
            opt.value === Number(id) ||
            opt.ID === id ||
            opt.ID === String(id) ||
            opt.ID === Number(id)
          );
          if (option) {
            return option.label || option.Name;
          }
        }
        return id;
      }).join(', ');
    }
    
    // Handle single value (not in IE= format)
    if (!strValue.includes('IE=') && !strValue.includes(',')) {
      if (optionsMap[fieldName]) {
        // Try multiple ways to match the value
        const option = optionsMap[fieldName].find(opt => 
          opt.value === strValue || 
          opt.value === String(strValue) || 
          opt.value === Number(strValue) ||
          opt.ID === strValue ||
          opt.ID === String(strValue) ||
          opt.ID === Number(strValue)
        );
        if (option) {
          return option.label || option.Name;
        }
      }
    }
    
    return strValue;
  }
  
  // Special handling for proposalStatus field
  if (fieldName === 'proposalStatus') {
    // Handle IE= format (ID-based values) - this is the actual format stored in search params
    if (strValue.includes('IE=')) {
      const idMatch = strValue.match(/IE=([^~]+)~/g);
      if (idMatch) {
        const ids = idMatch.map(match => match.replace('IE=', '').replace('~', ''));
        return ids.map(id => {
          // Map numeric values to display labels
          const statusMap = {
            '1': 'No Line Items',
            '2': 'InActive',
            '3': 'Active',
            '4': 'Converted to contract'
          };
          return statusMap[id] || id;
        }).join(', ');
      }
    }
    
    // Handle comma-separated values (direct values without IE= format)
    if (strValue.includes(',') && !strValue.includes('IE=')) {
      const ids = strValue.split(',').map(v => v.trim());
      return ids.map(id => {
        // Map numeric values to display labels
        const statusMap = {
          '1': 'No Line Items',
          '2': 'InActive',
          '3': 'Active',
          '4': 'Converted to contract'
        };
        return statusMap[id] || id;
      }).join(', ');
    }
    
    // Handle single value (not in IE= format)
    if (!strValue.includes('IE=') && !strValue.includes(',')) {
      const statusMap = {
        '1': 'No Line Items',
        '2': 'InActive',
        '3': 'Active',
        '4': 'Converted to contract'
      };
      return statusMap[strValue] || strValue;
    }
    
    return strValue;
  }

  // Special handling for proposalApprovalStatus field
  if (fieldName === 'proposalApprovalStatus') {
    // Handle IE= format (ID-based values) - this is the actual format stored in search params
    if (strValue.includes('IE=')) {
      const idMatch = strValue.match(/IE=([^~]+)~/g);
      if (idMatch) {
        const ids = idMatch.map(match => match.replace('IE=', '').replace('~', ''));
        return ids.map(id => {
          // Map numeric values to display labels
          const statusMap = {
            '0': '[Blank]',
            '1': 'Sent',
            '2': 'Approved'
          };
          return statusMap[id] || id;
        }).join(', ');
      }
    }
    
    // Handle comma-separated values (direct values without IE= format)
    if (strValue.includes(',') && !strValue.includes('IE=')) {
      const ids = strValue.split(',').map(v => v.trim());
      return ids.map(id => {
        // Map numeric values to display labels
        const statusMap = {
          '0': '[Blank]',
          '1': 'Sent',
          '2': 'Approved'
        };
        return statusMap[id] || id;
      }).join(', ');
    }
    
    // Handle single value (not in IE= format)
    if (!strValue.includes('IE=') && !strValue.includes(',')) {
      const statusMap = {
        '0': '[Blank]',
        '1': 'Sent',
        '2': 'Approved'
      };
      return statusMap[strValue] || strValue;
    }
    
    return strValue;
  }

  // Special handling for stage field
  if (fieldName === 'stage') {
    // Handle IE= format (ID-based values) - this is the actual format stored in search params
    if (strValue.includes('IE=')) {
      const idMatch = strValue.match(/IE=([^~]+)~/g);
      if (idMatch) {
        const ids = idMatch.map(match => match.replace('IE=', '').replace('~', ''));
        return ids.map(id => {
          // Try to find the label in the provided options map (for API-fetched data)
          if (optionsMap[fieldName]) {
            // Try multiple ways to match the value - the API returns objects with value and label
            const option = optionsMap[fieldName].find(opt => 
              opt.value === id || 
              opt.value === String(id) || 
              opt.value === Number(id) ||
              opt.ID === id ||
              opt.ID === String(id) ||
              opt.ID === Number(id)
            );
            if (option) {
              return option.label || option.Name;
            }
          }
          return id;
        }).join(', ');
      }
    }
    
    // Handle comma-separated values (direct values without IE= format)
    if (strValue.includes(',') && !strValue.includes('IE=')) {
      const ids = strValue.split(',').map(v => v.trim());
      return ids.map(id => {
        // Try to find the label in the provided options map
        if (optionsMap[fieldName]) {
          // Try multiple ways to match the value
          const option = optionsMap[fieldName].find(opt => 
            opt.value === id || 
            opt.value === String(id) || 
            opt.value === Number(id) ||
            opt.ID === id ||
            opt.ID === String(id) ||
            opt.ID === Number(id)
          );
          if (option) {
            return option.label || option.Name;
          }
        }
        return id;
      }).join(', ');
    }
    
    // Handle single value (not in IE= format)
    if (!strValue.includes('IE=') && !strValue.includes(',')) {
      if (optionsMap[fieldName]) {
        // Try multiple ways to match the value
        const option = optionsMap[fieldName].find(opt => 
          opt.value === strValue || 
          opt.value === String(strValue) || 
          opt.value === Number(strValue) ||
          opt.ID === strValue ||
          opt.ID === String(strValue) ||
          opt.ID === Number(strValue)
        );
        if (option) {
          return option.label || option.Name;
        }
      }
    }
    
    return strValue;
  }
  
  // Special handling for primaryCampaign field
  if (fieldName === 'primaryCampaign') {
    // Handle IE= format (ID-based values)
    if (strValue.includes('IE=')) {
      const idMatch = strValue.match(/IE=([^~]+)~/g);
      if (idMatch) {
        const ids = idMatch.map(match => match.replace('IE=', '').replace('~', ''));
        return ids.map(id => {
          // Try to find the label in the provided options map (for API-fetched data)
          if (optionsMap.primaryCampaign) {
            const option = optionsMap.primaryCampaign.find(opt => opt.value === id);
            if (option) return option.label;
          }
          
          // Fallback to OPPORTUNITY_OPTIONS
          const option = OPPORTUNITY_OPTIONS.source?.find(opt => opt.value === id);
          return option ? option.label : id;
        }).join(', ');
      }
    }
    
    // Handle comma-separated values (direct values without IE= format)
    if (strValue.includes(',')) {
      return strValue.split(',').map(v => v.trim()).map(id => {
        // Try to find the label in the provided options map
        if (optionsMap.primaryCampaign) {
          const option = optionsMap.primaryCampaign.find(opt => opt.value === id);
          if (option) return option.label;
        }
        
        // Fallback to OPPORTUNITY_OPTIONS
        const option = OPPORTUNITY_OPTIONS.source?.find(opt => opt.value === id);
        return option ? option.label : id;
      }).join(', ');
    }
    
    // Handle single value
    if (optionsMap.primaryCampaign) {
      const option = optionsMap.primaryCampaign.find(opt => opt.value === strValue);
      if (option) return option.label;
    }
    
    // Fallback to OPPORTUNITY_OPTIONS
    const option = OPPORTUNITY_OPTIONS.source?.find(opt => opt.value === strValue);
    return option ? option.label : strValue;
  }
  
  // Special handling for proposalRep field
  if (fieldName === 'proposalRep') {
    // Handle IE= format (ID-based values) - this is the actual format stored in search params
    if (strValue.includes('IE=')) {
      const idMatch = strValue.match(/IE=([^~]+)~/g);
      if (idMatch) {
        const ids = idMatch.map(match => match.replace('IE=', '').replace('~', ''));
        return ids.map(id => {
          // Try to find the label in the provided options map (for API-fetched data)
          if (optionsMap[fieldName]) {
            // Try multiple ways to match the value - the API returns objects with value and label
            const option = optionsMap[fieldName].find(opt => 
              opt.value === id || 
              opt.value === String(id) || 
              opt.value === Number(id) ||
              opt.ID === id ||
              opt.ID === String(id) ||
              opt.ID === Number(id)
            );
            if (option) {
              return option.label || option.Name;
            }
          }
          return id;
        }).join(', ');
      }
    }
    
    // Handle comma-separated values (direct values without IE= format)
    if (strValue.includes(',') && !strValue.includes('IE=')) {
      const ids = strValue.split(',').map(v => v.trim());
      return ids.map(id => {
        // Try to find the label in the provided options map
        if (optionsMap[fieldName]) {
          // Try multiple ways to match the value
          const option = optionsMap[fieldName].find(opt => 
            opt.value === id || 
            opt.value === String(id) || 
            opt.value === Number(id) ||
            opt.ID === id ||
            opt.ID === String(id) ||
            opt.ID === Number(id)
          );
          if (option) {
            return option.label || option.Name;
          }
        }
        return id;
      }).join(', ');
    }
    
    // Handle single value (not in IE= format)
    if (!strValue.includes('IE=') && !strValue.includes(',')) {
      if (optionsMap[fieldName]) {
        // Try multiple ways to match the value
        const option = optionsMap[fieldName].find(opt => 
          opt.value === strValue || 
          opt.value === String(strValue) || 
          opt.value === Number(strValue) ||
          opt.ID === strValue ||
          opt.ID === String(strValue) ||
          opt.ID === Number(strValue)
        );
        if (option) {
          return option.label || option.Name;
        }
      }
    }
    
    return strValue;
  }
  
  // Special handling for proposalApprovalStage and proposalApprovalStages fields
  if (fieldName === 'proposalApprovalStage' || fieldName === 'proposalApprovalStages') {
    // Handle IE= format (ID-based values) - this is the actual format stored in search params
    if (strValue.includes('IE=')) {
      const idMatch = strValue.match(/IE=([^~]+)~/g);
      if (idMatch) {
        const ids = idMatch.map(match => match.replace('IE=', '').replace('~', ''));
        return ids.map(id => {
          // Try to find the label in the provided options map (for API-fetched data)
          // Check both singular and plural field names
          const optionsData = optionsMap[fieldName] || optionsMap['proposalApprovalStage'] || optionsMap['proposalApprovalStages'];
          if (optionsData) {
            // Try multiple ways to match the value - the API returns objects with value and label
            const option = optionsData.find(opt => 
              opt.value === id || 
              opt.value === String(id) || 
              opt.value === Number(id) ||
              opt.ID === id ||
              opt.ID === String(id) ||
              opt.ID === Number(id)
            );
            if (option) {
              return option.label || option.Name;
            }
          }
          return id;
        }).join(', ');
      }
    }
    
    // Handle comma-separated values (direct values without IE= format)
    if (strValue.includes(',') && !strValue.includes('IE=')) {
      const ids = strValue.split(',').map(v => v.trim());
      return ids.map(id => {
        // Try to find the label in the provided options map
        // Check both singular and plural field names
        const optionsData = optionsMap[fieldName] || optionsMap['proposalApprovalStage'] || optionsMap['proposalApprovalStages'];
        if (optionsData) {
          // Try multiple ways to match the value
          const option = optionsData.find(opt => 
            opt.value === id || 
            opt.value === String(id) || 
            opt.value === Number(id) ||
            opt.ID === id ||
            opt.ID === String(id) ||
            opt.ID === Number(id)
          );
          if (option) {
            return option.label || option.Name;
          }
        }
        return id;
      }).join(', ');
    }
    
    // Handle single value (not in IE= format)
    if (!strValue.includes('IE=') && !strValue.includes(',')) {
      // Check both singular and plural field names
      const optionsData = optionsMap[fieldName] || optionsMap['proposalApprovalStage'] || optionsMap['proposalApprovalStages'];
      if (optionsData) {
        // Try multiple ways to match the value
        const option = optionsData.find(opt => 
          opt.value === strValue || 
          opt.value === String(strValue) || 
          opt.value === Number(strValue) ||
          opt.ID === strValue ||
          opt.ID === String(strValue) ||
          opt.ID === Number(strValue)
        );
        if (option) {
          return option.label || option.Name;
        }
      }
    }
    
    return strValue;
  }
  
  // Handle IE= format (ID-based values) for other fields
  if (strValue.includes('IE=')) {
    const idMatch = strValue.match(/IE=([^~]+)~/g);
    if (idMatch) {
      const ids = idMatch.map(match => match.replace('IE=', '').replace('~', ''));
      return ids.map(id => {
        // First try to find the label in the provided options map (for API-fetched data)
        if (optionsMap[fieldName]) {
          const option = optionsMap[fieldName].find(opt => opt.value === id);
          if (option) return option.label;
        }
        
        // Fallback to OPPORTUNITY_OPTIONS
        const option = OPPORTUNITY_OPTIONS[fieldName]?.find(opt => opt.value === id);
        return option ? option.label : id;
      }).join(', ');
    }
  }
  
  // Handle SW= format (text-based values)
  if (strValue.includes('SW=')) {
    const textMatch = strValue.match(/SW=([^~]+)~/g);
    if (textMatch) {
      return textMatch.map(match => match.replace('SW=', '').replace('~', '')).join(', ');
    }
  }
  
  // Handle predefined options
  if (strValue === 'IN=Is Empty~') return 'Is Empty';
  if (strValue === 'INN=Is Not Empty~') return 'Is Not Empty';
  
  // Handle comma-separated values
  if (strValue.includes(',')) {
    return strValue.split(',').map(v => v.trim()).join(', ');
  }
  
  return strValue;
};

// Helper function to format field values for display in Proposals Advanced Search
export const formatFieldValue = (fieldName, value) => {
  return getLabelForValue(fieldName, value);
}; 