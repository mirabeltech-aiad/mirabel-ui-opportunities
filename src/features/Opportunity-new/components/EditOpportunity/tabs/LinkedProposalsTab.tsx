import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Link2Off, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { OpportunityFormData } from '../../../types/opportunity';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { opportunityService } from '../../../services/opportunityService';
import AdvancedDataTable from '@/shared/components/ui/advanced-table/AdvancedDataTable';
import { ColumnDefinition } from '@/shared/components/ui/advanced-table/types/column.types';
import { getRepColor } from '@/utils/commonHelpers';
import RepAvatar from '@/shared/components/ui/RepAvatar';

interface LinkedProposalsTabProps {
  formData: OpportunityFormData;
  handleBatchInputChange: (updates: Partial<OpportunityFormData>) => void;
  opportunityId?: string;
  onUnlinkProposal: () => Promise<boolean>;
  shouldShowUnlinkOption: () => boolean;
  isProposalReplacement: (proposalId: string) => boolean;
  originalProposalId: string;
}
interface SalesRep {
  ID: string,
  Name: string
}
interface Proposal {
  ID: string;
  Name: string,
  ProductNames: string;
  Status: string;
  Amount: number;
  CustomerName: string;
  Products: string;
  Description: string;
  Rep: SalesRep;
  CreatedDate: string;
  OpportunityID: number;
  repWithInitials: HTMLElement
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
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(formData.proposalId);
  const [error, setError] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Define columns for AdvancedDataTable
  const columns: ColumnDefinition<Proposal>[] = [
    {
      id: 'select',
      header: '',
      accessor: () => '',
      render: (value, row) => (
        <div className="flex items-center justify-center">
          <RadioGroupItem
            value={row.ID}
            checked={selectedProposal === row.ID}
            onClick={() => handleProposalSelect(row.ID)}
          />
        </div>
      ),
      sortable: false,
      width: 50
    },
    {
      id: 'name',
      header: 'Proposal Name',
      accessor: 'Name',
      render: (value, row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.Name}</div>
          <div className="text-xs text-gray-500">#{row.ID}</div>
        </div>
      )
    },
    {
      id: 'products',
      header: 'Products',
      accessor: 'ProductNames',
      render: (value, row) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {row.ProductNames}
        </div>
      )
    },
    {
      id: 'description',
      header: 'Description',
      accessor: 'Description',
      render: (value, row) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {row.Description}
        </div>
      )
    },
    {
      id: 'rep',
      header: 'Rep',
      accessor: (row) => row.Rep?.Name || '',
      render: (value, row) => {
        const repName = row.Rep?.Name || 'N/A';
        return (
          <div className="flex items-center gap-2">
            <RepAvatar name={repName} size="sm" />
            <span className="text-sm text-gray-900">{repName}</span>
          </div>
        );
      }
    },
    {
      id: 'createdDate',
      header: 'Created Date',
      accessor: 'CreatedDate',
      render: (value, row) => (
        <div className="text-sm text-gray-900">
          {formatDate(row.CreatedDate)}
        </div>
      )
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: 'Amount',
      render: (value, row) => (
        <div className="text-sm font-medium text-gray-900">
          {formatCurrency(row.Amount)}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      render: (value, row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`/proposals/${row.ID}`, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      ),
      sortable: false,
      width: 80
    }
  ];

  // Search for proposals based on BU/Product from formData
  const searchProposals = async () => {
    const customerSelected = !!(formData.company || formData.contactDetails?.ID);
    const productSelected = !!(formData.businessUnitId?.length || formData.productId?.length);

    // Only show error if NEITHER condition is met (both are false)
    if (!customerSelected && !productSelected) {
      setError("Please select either a customer OR at least one Business Unit/Product to proceed");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Build search parameters DTO
      const BaseSearchParametersDTO = {
        Customer: formData.company || "",
        ProductIDs: formData.productId?.join(",") || "",
        BusinessUnitIDs: formData.businessUnitId?.join(",") || "",
        Status: 'Active',
        ExcludeLinked: true
      };

      // Use the opportunityService method with the specified logic
      const data = await opportunityService.getProposalsBasedOnOpportunity("ALL", BaseSearchParametersDTO);

      // Apply the filtering logic as specified
      if (formData.productId?.length > 1 || formData.company !== "") {
        // Filter proposals that match current opportunity ID (if editing existing)
        if (opportunityId) {
          // You can use proposalPageRecordData if needed for current proposal
        }


        // Filter proposals that are not linked to any opportunity (OpportunityID == 0)
        const availableProposals = data.filter((item) => item.OpportunityID == 0);
        // Get distinct rep names and apply colors
        const distinctReps = [...new Set(availableProposals.map(p => p.SalesRep?.Name).filter(Boolean))];

        const proposalsWithColors = availableProposals.map(proposal => ({
          ...proposal,
          repWithInitials: proposal.Rep?.Name ? getRepColor(proposal.Rep.Name, distinctReps) : undefined
        }));

        setProposals(proposalsWithColors);
      }

      // Check if no proposals are available
      if (data === null ||
        data.length === 0 ||
        data.filter((item) => item.OpportunityID == 0).length === 0) {
        setError("No Proposal Available");
        setProposals([]);
      }

    } catch (error) {
      console.error('Failed to search proposals:', error);
      setError('Failed to fetch proposal');
      setProposals([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle proposal selection
  const handleProposalSelect = (proposalId: string) => {
    const proposal = proposals.find(p => p.ID === proposalId);
    if (!proposal) return;

    setSelectedProposal(proposalId);

    // Update form data with proposal information
    handleBatchInputChange({
      proposalId: proposal.ID,
      proposalName: proposal.Name,
      amount: proposal.Amount.toString(),
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

  // Auto-search when BU/Product changes
  useEffect(() => {
    if (formData.businessUnitId?.length || formData.productId?.length || formData.company?.length) {
      searchProposals();
    }
  }, [formData.businessUnitId, formData.productId, formData.company]);

  return (
    <div className="space-y-6">
      {/* Current Proposal Information */}
      {formData.proposalId && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
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

      {/* Available Proposals Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Available Proposals for {formData.company || 'Selected Customer'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {proposals.length} proposal(s) found • Select a proposal to auto-populate fields (optional)
              </p>
            </div>
            <Button
              onClick={searchProposals}
              disabled={isLoading || (!formData.businessUnitId?.length && !formData.productId?.length)}
              variant="outline"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 border-b border-gray-200">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Proposals Table with AdvancedDataTable */}
        {proposals.length > 0 ? (
          <div className="p-4">
            <RadioGroup value={selectedProposal} onValueChange={handleProposalSelect}>
              <AdvancedDataTable
                data={proposals}
                columns={columns}
                loading={isLoading}
                enableSelection={false}
                enablePagination={true}
                initialPageSize={10}
                className="border border-gray-200 rounded-lg"
                onRowClick={(row) => handleProposalSelect(row.ID)}
              />
            </RadioGroup>
          </div>
        ) : !isLoading && !error && (
          <div className="p-8 text-center text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No proposals found</p>
            <p className="text-sm mt-1">
              {!formData.businessUnitId?.length && !formData.productId?.length
                ? 'Please select Business Unit or Product in the Opportunity Information tab to see available proposals.'
                : 'No active proposals match the selected Business Unit and Product criteria.'}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading proposals...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedProposalsTab;


