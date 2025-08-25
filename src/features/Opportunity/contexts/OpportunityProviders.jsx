import React from 'react';
import { OpportunitySearchProvider } from './OpportunitySearchContext';
import { ProposalSearchProvider } from './ProposalSearchContext';
import { EditModeProvider } from './EditModeContext';

export default function OpportunityProviders({ children }) {
	return (
		<OpportunitySearchProvider>
			<ProposalSearchProvider>
				<EditModeProvider>
					{children}
				</EditModeProvider>
			</ProposalSearchProvider>
		</OpportunitySearchProvider>
	);
}


