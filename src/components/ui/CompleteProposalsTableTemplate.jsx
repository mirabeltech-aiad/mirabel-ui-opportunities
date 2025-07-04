
import React from 'react';
import ProposalTableTemplate from '../../features/Opportunity/components/proposal/ProposalTableTemplate';
import ProposalTableStyles from '../../features/Opportunity/components/proposal/ProposalTableStyles';

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
