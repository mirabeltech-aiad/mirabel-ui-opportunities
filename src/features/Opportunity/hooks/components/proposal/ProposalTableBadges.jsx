
import React from 'react';

const ProposalTableBadges = {
  Status: ({ status }) => {
    const statusColors = {
      'Draft': 'bg-gray-100 text-gray-800 border-gray-300',
      'Submitted': 'bg-blue-100 text-blue-800 border-blue-300',
      'Under Review': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Approved': 'bg-green-100 text-green-800 border-green-300',
      'Rejected': 'bg-red-100 text-red-800 border-red-300'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {status}
      </span>
    );
  },

  Stage: ({ stage }) => {
    const stageColors = {
      'Initial Draft': 'bg-gray-100 text-gray-700',
      'Technical Review': 'bg-blue-100 text-blue-700',
      'Client Review': 'bg-purple-100 text-purple-700',
      'Final Approval': 'bg-green-100 text-green-700'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${stageColors[stage] || 'bg-gray-100 text-gray-700'}`}>
        {stage}
      </span>
    );
  }
};

export default ProposalTableBadges;
