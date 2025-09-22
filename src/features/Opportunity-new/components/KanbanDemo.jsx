import React, { useState } from 'react';
import { KanbanView } from './kanban';

// Mock data for demonstration
const mockOpportunities = [
  {
    id: '1',
    opportunityName: 'Website Redesign Project',
    companyName: 'Tech Corp Inc',
    amount: 50000,
    status: 'Open',
    stage: 'Qualification',
    assignedRep: 'John Smith',
    projCloseDate: '2024-03-15',
  },
  {
    id: '2',
    opportunityName: 'Mobile App Development',
    companyName: 'StartUp LLC',
    amount: 75000,
    status: 'Open',
    stage: 'Proposal',
    assignedRep: 'Jane Doe',
    projCloseDate: '2024-04-20',
  },
  {
    id: '3',
    opportunityName: 'Cloud Migration',
    companyName: 'Enterprise Solutions',
    amount: 120000,
    status: 'Open',
    stage: 'Meeting',
    assignedRep: 'Mike Johnson',
    projCloseDate: '2024-05-10',
  },
];

const KanbanDemo = () => {
  const [opportunities, setOpportunities] = useState(mockOpportunities);

  const handleRefresh = () => {
    console.log('Refreshing opportunities...');
    // In a real implementation, this would fetch fresh data from the API
  };

  return (
    <div className="h-screen p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Opportunity Kanban Board - Clean Implementation
        </h1>
        <p className="text-gray-600">
          This is the new, clean Kanban implementation for opportunities.
        </p>
      </div>
      
      <KanbanView
        opportunities={opportunities}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default KanbanDemo;