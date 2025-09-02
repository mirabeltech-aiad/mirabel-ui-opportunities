
import React from 'react';
import ProposalTableRow from './ProposalTableRow';

const ProposalTableGrid = ({ proposals, selectedRows, selectAll, onRowSelect, onSelectAll }) => {
  return (
    <div className="table-container table-horizontal-scroll table-smooth-scroll">
      <div className="table-content-wrapper">
        <table className="proposals-table w-full">
          <thead className="table-header">
            <tr>
              <th className="w-8">
                <input 
                  type="checkbox" 
                  className="checkbox-input"
                  checked={selectAll}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th className="w-8"></th>
              <th>Status</th>
              <th>Proposal Name</th>
              <th>Company Name</th>
              <th>Created Date</th>
              <th>Assigned Rep</th>
              <th>Stage</th>
              <th>Amount</th>
              <th>Proj Close Date</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => (
              <ProposalTableRow 
                key={proposal.id}
                proposal={proposal}
                isSelected={selectedRows.has(proposal.id)}
                onSelect={(checked) => onRowSelect(proposal.id, checked)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalTableGrid;
