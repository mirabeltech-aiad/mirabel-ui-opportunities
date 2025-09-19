import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FloatingLabelSearchInput } from '@/shared/components/ui/FloatingLabelSearchInput';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link2Off, Search } from 'lucide-react';
import { OpportunityFormData } from '../../../types/opportunity';
import axiosService from '@/services/axiosService.js';

interface LinkedProposalsTabProps {
  formData: OpportunityFormData;
  handleBatchInputChange: (updates: Partial<OpportunityFormData>) => void;
  opportunityId?: string;
  onUnlinkProposal: () => Promise<boolean>;
  shouldShowUnlinkOption: () => boolean;
  isProposalReplacement: (proposalId: string) => boolean;
  originalProposalId: string;
}

interface Proposal {
  ID: string;
  Name: string;
  Status: string;
  Amount: number;
  CustomerName: string;
  Products: Array<{ ID: number; Name: string }>;
  BusinessUnits: Array<{ ID: number; Name: string }>;
}

const LinkedProposalsTab: React.FC<LinkedProposalsTabProps> = ({
  formData,
  handleBatchInputChange,
  opportunityId,
  onUnlinkProposal,
  shouldShowUnlinkOption,
  isProposalReplacement,
  originalProposalId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(formData.proposalId);

  // Search for proposals
  const searchProposals = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const payload = {
        Customer: formData.company || searchTerm,
        ProductIDs: [],
        BusinessUnitIDs: [],
        Status: 'Active',
        ExcludeLinked: true
      };

      const response = await axiosService.post('/services/production/proposals/bycriteria/ALL', payload);
      
      if (response?.content && Array.isArray(response.content)) {
        setProposals(response.content);
      }
    } catch (error) {
      console.error('Failed to search proposals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle proposal selection
  const handleProposalSelect = (proposal: Proposal) => {
    setSelectedProposal(proposal.ID);
    
    // Update form data with proposal information
    handleBatchInputChange({
      proposalId: proposal.ID,
      proposalName: proposal.Name,
      amount: proposal.Amount.toString(),
      product: proposal.Products.map(p => p.Name),
      productId: proposal.Products.map(p => p.ID.toString()),
      productDetails: proposal.Products,
      businessUnit: proposal.BusinessUnits.map(bu => bu.Name),
      businessUnitId: proposal.BusinessUnits.map(bu => bu.ID.toString()),
      businessUnitDetails: proposal.BusinessUnits
    });
  };

  // Handle proposal unlinking
  const handleUnlink = async () => {
    if (!window.confirm('Are you sure you want to unlink this proposal? This action will clear the linked proposal data and cannot be undone.')) {
      return;
    }

    const success = await onUnlinkProposal();
    if (success) {
      setSelectedProposal('');
      setProposals([]);
    }
  };

  // Auto-search when component mounts if company is available
  useEffect(() => {
    if (formData.company) {
      setSearchTerm(formData.company);
      searchProposals();
    }
  }, [formData.company]);

  return (
    <div className="space-y-6">
      {/* Current Proposal Information */}
      {formData.proposalId && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Currently Linked Proposal</h3>
              <p className="text-blue-700 mt-1">
                <strong>{formData.proposalName}</strong> (ID: {formData.proposalId})
              </p>
              {isProposalReplacement(formData.proposalId) && (
                <p className="text-orange-700 text-sm mt-1">
                  ⚠️ This is a new selection. Save the opportunity to confirm the change.
                </p>
              )}
            </div>
            
            {shouldShowUnlinkOption() && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnlink}
                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
              >
                <Link2Off className="h-4 w-4 mr-2" />
                Unlink Proposal
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Available Proposals</h3>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <FloatingLabelSearchInput
              id="proposalSearch"
              label="Search by Company or Proposal Name"
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Enter company name or proposal name..."
              onSearch={searchProposals}
            />
          </div>
          
          <Button
            onClick={searchProposals}
            disabled={!searchTerm.trim() || isLoading}
            className="px-6"
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Search Results */}
        {proposals.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Available Proposals ({proposals.length})
            </h4>
            
            <RadioGroup
              value={selectedProposal}
              onValueChange={(value) => {
                const proposal = proposals.find(p => p.ID === value);
                if (proposal) {
                  handleProposalSelect(proposal);
                }
              }}
              className="space-y-3"
            >
              {proposals.map((proposal) => (
                <div
                  key={proposal.ID}
                  className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <RadioGroupItem
                    value={proposal.ID}
                    id={`proposal-${proposal.ID}`}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`proposal-${proposal.ID}`}
                      className="block cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-900">
                          {proposal.Name}
                        </h5>
                        <span className="text-sm text-gray-500">
                          ${proposal.Amount.toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        Customer: {proposal.CustomerName}
                      </p>
                      
                      {proposal.Products.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Products: {proposal.Products.map(p => p.Name).join(', ')}
                        </p>
                      )}
                      
                      {proposal.BusinessUnits.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Business Units: {proposal.BusinessUnits.map(bu => bu.Name).join(', ')}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          proposal.Status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {proposal.Status}
                        </span>
                        
                        <span className="text-xs text-gray-400">
                          ID: {proposal.ID}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* No Results Message */}
        {searchTerm && !isLoading && proposals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No available proposals found for "{searchTerm}"</p>
            <p className="text-sm mt-1">Try searching with a different company name or proposal name.</p>
          </div>
        )}

        {/* Instructions */}
        {!searchTerm && (
          <div className="text-center py-8 text-gray-500">
            <p>Enter a company name or proposal name to search for available proposals.</p>
            <p className="text-sm mt-1">Only unlinked, active proposals will be shown.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedProposalsTab;