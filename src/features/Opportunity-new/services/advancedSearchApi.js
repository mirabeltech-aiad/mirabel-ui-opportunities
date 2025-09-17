// Simplified API service for the new components structure
// This is a mock implementation to avoid import errors

export const getApiMethod = (fieldKey, tabType) => {
  // Mock API methods - replace with actual API calls later
  const mockApiMethods = {
    // Common fields
    opportunityName: () => Promise.resolve([
      { id: 1, label: 'Opportunity 1' },
      { id: 2, label: 'Opportunity 2' }
    ]),
    companyName: () => Promise.resolve([
      { id: 1, label: 'Company A' },
      { id: 2, label: 'Company B' }
    ]),
    salesPresenter: () => Promise.resolve([
      { id: 1, label: 'John Smith' },
      { id: 2, label: 'Jane Doe' }
    ]),
    createdRep: () => Promise.resolve([
      { id: 1, label: 'John Smith' },
      { id: 2, label: 'Jane Doe' }
    ]),
    assignedRep: () => Promise.resolve([
      { id: 1, label: 'John Smith' },
      { id: 2, label: 'Jane Doe' }
    ]),
    businessUnit: () => Promise.resolve([
      { id: 1, label: 'Sales' },
      { id: 2, label: 'Marketing' }
    ]),
    product: () => Promise.resolve([
      { id: 1, label: 'Product A' },
      { id: 2, label: 'Product B' }
    ]),
    status: () => Promise.resolve([
      { id: 1, label: 'Open' },
      { id: 2, label: 'Closed' }
    ]),
    stage: () => Promise.resolve([
      { id: 1, label: 'Prospecting' },
      { id: 2, label: 'Qualification' }
    ]),
    probability: () => Promise.resolve([
      { id: 1, label: '10%' },
      { id: 2, label: '50%' },
      { id: 3, label: '90%' }
    ])
  };

  return mockApiMethods[fieldKey] || null;
};

export default { getApiMethod };