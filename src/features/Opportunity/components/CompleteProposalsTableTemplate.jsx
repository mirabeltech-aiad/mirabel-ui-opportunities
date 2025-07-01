
import React from 'react';
import ProposalTableTemplate from './proposal/ProposalTableTemplate';
import ProposalTableStyles from './proposal/ProposalTableStyles';

// Complete Proposals Table Template - Now refactored into smaller components
const CompleteProposalsTableTemplate = () => {
  return (
    <>
      <ProposalTableStyles />
      <ProposalTableTemplate />
    </>
  );
};

export default CompleteProposalsTableTemplate;
