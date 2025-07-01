
// Utility functions for audit trail tracking
export const createAuditEntry = (field, oldValue, newValue, userId = "Current User") => {
  return {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    field,
    oldValue,
    newValue,
    userId,
    type: getChangeType(field)
  };
};

const getChangeType = (field) => {
  const statusFields = ['status', 'stage'];
  const assignmentFields = ['assignedRep', 'territory'];
  
  if (statusFields.includes(field)) return 'status';
  if (assignmentFields.includes(field)) return 'assignment';
  return 'field';
};

export const getFieldDisplayName = (field) => {
  const fieldNames = {
    name: 'Opportunity Name',
    company: 'Company Name',
    contactName: 'Contact Name',
    status: 'Status',
    stage: 'Stage',
    amount: 'Amount',
    probability: 'Probability',
    assignedRep: 'Assigned Rep',
    territory: 'Territory',
    projCloseDate: 'Projected Close Date',
    priority: 'Priority',
    opportunityType: 'Opportunity Type',
    businessUnit: 'Business Unit',
    product: 'Product',
    source: 'Source',
    leadType: 'Lead Type'
  };
  
  return fieldNames[field] || field;
};

export const formatValue = (value, field) => {
  if (value === null || value === undefined || value === '') {
    return '(empty)';
  }
  
  if (field === 'amount' || field === 'budget' || field === 'forecastRevenue') {
    return `$${Number(value).toLocaleString()}`;
  }
  
  if (field === 'probability') {
    return `${value}%`;
  }
  
  return value;
};
