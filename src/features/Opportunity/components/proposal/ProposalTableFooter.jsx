
import React from 'react';

const ProposalTableFooter = ({ proposals, selectedRows }) => {
  return (
    <div className="p-2 border-t border-gray-200 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Page 1 of 6 ({proposals.length} total proposals)
      </div>
      {selectedRows.size > 0 && (
        <div className="text-sm text-blue-600 font-medium">
          {selectedRows.size} proposal{selectedRows.size !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};

export default ProposalTableFooter;
