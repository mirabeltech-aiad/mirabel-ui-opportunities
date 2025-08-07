
import { useState } from 'react';
import ProposalsTable from './table/ProposalsTable';

const TableTestPage = () => {
  const [view, setView] = useState('table');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [filters, setFilters] = useState({
    status: "All Proposals",
    probability: "All Probability", 
    assignedRep: "Karp, Courtney"
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // Sample data for testing the table
  const sampleProposals = [
    {
      id: 1,
      status: 'Under Review',
      name: 'Website Redesign Project',
      company: 'Tech Solutions Inc',
      createdDate: '2024-01-15',
      assignedRep: 'John Smith',
      stage: 'Proposal',
      amount: 25000,
      projCloseDate: '2024-02-15'
    },
    {
      id: 2,
      status: 'Approved',
      name: 'Mobile App Development',
      company: 'Digital Innovations LLC',
      createdDate: '2024-01-20',
      assignedRep: 'Sarah Johnson',
      stage: 'Negotiation',
      amount: 45000,
      projCloseDate: '2024-03-01'
    },
    {
      id: 3,
      status: 'Draft',
      name: 'Cloud Migration Services',
      company: 'Enterprise Corp',
      createdDate: '2024-01-25',
      assignedRep: 'Mike Davis',
      stage: 'Closed Won',
      amount: 75000,
      projCloseDate: '2024-02-28'
    },
    {
      id: 4,
      status: 'Rejected',
      name: 'Database Optimization',
      company: 'StartupXYZ',
      createdDate: '2024-01-10',
      assignedRep: 'Lisa Wilson',
      stage: 'Closed Lost',
      amount: 15000,
      projCloseDate: '2024-01-30'
    },
    {
      id: 5,
      status: 'Submitted',
      name: 'Security Audit',
      company: 'Financial Services Group',
      createdDate: '2024-01-30',
      assignedRep: 'David Brown',
      stage: 'Proposal',
      amount: 30000,
      projCloseDate: '2024-03-15'
    }
  ];

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    // Reset any selections or filters if needed
    setSelectedCompany('');
    // In a real app, this would trigger a data fetch
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Table Component Test</h2>
          <p className="text-gray-600 mt-1">Testing the imported proposals table system</p>
        </div>
        <div className="text-sm text-gray-500">
          Current View: <span className="font-medium capitalize">{view}</span>
          {refreshKey > 0 && <span className="ml-2 text-green-600">(Refreshed {refreshKey} time{refreshKey > 1 ? 's' : ''})</span>}
        </div>
      </div>

      <ProposalsTable
        key={refreshKey}
        proposals={sampleProposals}
        view={view}
        onViewChange={handleViewChange}
        onCompanySelect={handleCompanySelect}
        selectedCompany={selectedCompany}
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default TableTestPage;
