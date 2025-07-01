
import React, { useState } from 'react';
import ProposalTableFilters from './ProposalTableFilters';
import ProposalTableGrid from './ProposalTableGrid';
import ProposalTableFooter from './ProposalTableFooter';

const ProposalTableTemplate = () => {
  const [view, setView] = useState('table');
  const [filters, setFilters] = useState({
    status: "All Proposals",
    probability: "All Probability", 
    assignedRep: "All Agents"
  });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Sample data structure
  const sampleProposals = [
    {
      id: 1,
      status: 'Under Review',
      name: 'Digital Marketing Campaign Proposal',
      company: 'Tech Solutions Inc.',
      createdDate: '2024-01-15',
      assignedRep: 'John Smith',
      stage: 'Technical Review',
      amount: 45000,
      projCloseDate: '2024-03-15'
    },
    // Add more sample data as needed
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleRowSelect = (id, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === sampleProposals.length);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(sampleProposals.map(p => p.id)));
    } else {
      setSelectedRows(new Set());
    }
    setSelectAll(checked);
  };

  return (
    <div className="w-full bg-white">
      <div className="proposals-table-container">
        <ProposalTableFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          view={view}
          onViewChange={setView}
        />
        
        <ProposalTableGrid 
          proposals={sampleProposals}
          selectedRows={selectedRows}
          selectAll={selectAll}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
        />
        
        <ProposalTableFooter 
          proposals={sampleProposals}
          selectedRows={selectedRows}
        />
      </div>
    </div>
  );
};

export default ProposalTableTemplate;
