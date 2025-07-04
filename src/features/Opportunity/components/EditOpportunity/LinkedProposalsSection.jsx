import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import apiService from "@/features/Opportunity/Services/apiService";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/features/Opportunity/hooks/use-toast";

const LinkedProposalsSection = ({ opportunityId, opportunityData = {}, companyDetails = {}, onProposalLinked }) => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProposals, setSelectedProposals] = useState(new Set());

  // Check if customer is selected - get from multiple possible sources
  const customerName = companyDetails.customerName || 
                      companyDetails.company || 
                      opportunityData.company || 
                      opportunityData.customerName || '';
  const hasCustomerSelected = customerName.trim() !== '';

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = proposals.map(proposal => proposal.ID);
      setSelectedProposals(new Set(allIds));
    } else {
      setSelectedProposals(new Set());
    }
  };

  const handleSelectProposal = (proposalId, checked) => {
    const newSelected = new Set(selectedProposals);
    if (checked) {
      newSelected.add(proposalId);
    } else {
      newSelected.delete(proposalId);
    }
    setSelectedProposals(newSelected);
  };

  useEffect(() => {
    // Only fetch proposals if customer is selected
    if (!hasCustomerSelected) {
      setProposals([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchLinkedProposals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching linked proposals for customer:', customerName);
        console.log('Opportunity data:', opportunityData);
        
        // Use the correct payload structure
        const payload = {
          ConvertedToContract: "NO",
          Customer: customerName,
          FromDate: "",
          ProductIDs: opportunityData.productId ? String(opportunityData.productId) : "",
          ProductTypeID: opportunityData.businessUnit ? parseInt(opportunityData.businessUnit) : -1,
          ToDate: "",
          UserID: -1
        };

        console.log('Searching proposals with payload:', payload);
        
        // Call the correct API endpoint
        const response = await apiService.post('/services/production/proposals/bycriteria/ALL', payload);
        
        console.log('Proposal search response:', response);
        
        if (response && response.content && response.content.List) {
          setProposals(response.content.List);
        } else if (response && Array.isArray(response)) {
          setProposals(response);
        } else {
          setProposals([]);
        }
      } catch (error) {
        console.error('Failed to fetch linked proposals:', error);
        setError('Failed to load proposals. Please try again.');
        setProposals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkedProposals();
  }, [opportunityId, customerName, hasCustomerSelected, opportunityData.product, opportunityData.businessUnit]);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00" || dateString === "1/1/0001 12:00:00 AM") return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return "-";
    }
  };

  const formatAmount = (amount) => {
    if (!amount || amount === 0) return "-";
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "-";
    return `$${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount)}`;
  };

  const getStatusBadgeVariant = (status) => {
    if (!status) return "secondary";
    const statusLower = status.toLowerCase();
    if (statusLower.includes('won') || statusLower.includes('approved')) return "default";
    if (statusLower.includes('lost') || statusLower.includes('rejected')) return "destructive";
    if (statusLower.includes('pending') || statusLower.includes('review')) return "secondary";
    return "outline";
  };

  const handleSave = async () => {
    // Validation for required fields
    const missingFields = [];
    if (!opportunityData.name) missingFields.push('Opportunity Name');
    if (!opportunityData.status) missingFields.push('Status');
    if (!opportunityData.stage) missingFields.push('Stage');
    if (!opportunityData.amount) missingFields.push('Amount');
    if (!opportunityData.probability) missingFields.push('Probability');
    if (!opportunityData.projCloseDate) missingFields.push('Projected Close Date');
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    try {
      if (selectedProposals.size === 0) {
        toast({
          title: "Warning",
          description: "Please select at least one proposal to save.",
          variant: "destructive"
        });
        return;
      }

      const selectedProposalIds = Array.from(selectedProposals);
      console.log('Saving selected proposals:', selectedProposalIds);

      // Get the selected proposal details
      const selectedProposalsData = proposals.filter(proposal => selectedProposals.has(proposal.ID));

      // Create payload matching the main opportunity save structure
      const payload = {
        Amount: opportunityData.amount ? opportunityData.amount.toString() : "0",
        AssignedTODetails: opportunityData.assignedRepDetails && opportunityData.assignedRepDetails.ID ? {
          ID: parseInt(opportunityData.assignedRepDetails.ID),
          Name: opportunityData.assignedRepDetails.Name || opportunityData.assignedRep || ""
        } : {
          ID: opportunityData.assignedRepId || 0,
          Name: opportunityData.assignedRep || ""
        },
        BusinessUnitDetails: [{
          ID: opportunityData.businessUnitId || "",
          Name: opportunityData.businessUnit || ""
        }],
        BusinessUnitIDS: opportunityData.businessUnitId || "",
        CloseDate: opportunityData.projCloseDate || "",
        ContactDetails: opportunityData.contactDetails && opportunityData.contactDetails.ID ? {
          ID: parseInt(opportunityData.contactDetails.ID),
          SalesRepID: 1
        } : {
          ID: parseInt(opportunityData.contactId) || 1611,
          SalesRepID: 1
        },
        CreatedDate: opportunityData.createdDate || "",
        ID: opportunityId ? parseInt(opportunityId) : 0,
        ModfiedDate: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):(\d+)/, '$3-$1-$2 $4:$5:$6'),
        Name: opportunityData.name || "Opportunity",
        NextStep: opportunityData.nextSteps || "",
        Notes: opportunityData.notes || "",
        OppLossReasonDetails: opportunityData.lossReasonDetails && opportunityData.lossReasonDetails.ID ? {
          ID: parseInt(opportunityData.lossReasonDetails.ID),
          Name: opportunityData.lossReasonDetails.Name || opportunityData.lostReason || ""
        } : {
          ID: null,
          Name: opportunityData.lostReason || ""
        },
        OppStageDetails: {
          ID: opportunityData.stageDetails && opportunityData.stageDetails.ID ? parseInt(opportunityData.stageDetails.ID) : null,
          Stage: opportunityData.stage || ""
        },
        OppTypeDetails: {
          ID: opportunityData.opportunityType && opportunityData.opportunityType.id ? parseInt(opportunityData.opportunityType.id) : (opportunityData.opportunityTypeId ? parseInt(opportunityData.opportunityTypeId) : null),
          Name: opportunityData.opportunityType && opportunityData.opportunityType.name ? opportunityData.opportunityType.name : ""
        },
        OwnerDetails: {
          ID: opportunityData.assignedRepDetails?.ID ? parseInt(opportunityData.assignedRepDetails.ID) : null
        },
        Probability: opportunityData.probability ? parseInt(opportunityData.probability) : 0,
        ProductDetails: selectedProposalsData.map(proposal => ({
          ID: proposal.ID,
          Name: proposal.Name || proposal.ProposalName || ""
        })),
        ProductIDS: selectedProposalIds.join(','),
        ProposalID: selectedProposalIds.join(','),
        SalesPresenterDetails: opportunityData.salesPresenterDetails && opportunityData.salesPresenterDetails.ID ? {
          ID: parseInt(opportunityData.salesPresenterDetails.ID),
          Name: opportunityData.salesPresenterDetails.Name || opportunityData.salesPresentation || ""
        } : {
          ID: 0,
          Name: opportunityData.salesPresentation || ""
        },
        Source: opportunityData.primaryCampaignSource || null,
        StageAction: "Add",
        Status: opportunityData.status || "Open",
        SubContactDetails: opportunityData.contactDetails && opportunityData.contactDetails.ID ? {
          ID: parseInt(opportunityData.contactDetails.ID),
          Name: opportunityData.contactDetails.Name || opportunityData.contactName || ""
        } : {
          ID: parseInt(opportunityData.contactId) || 0,
          Name: opportunityData.contactName || ""
        }
      };

      console.log('Saving to /services/Opportunities with payload:', payload);

      // Call the services/Opportunities API
      const response = await apiService.post('/services/Opportunities', payload);

      console.log('Save response:', response);

      if (response) {
        toast({
          title: "Success",
          description: "Proposals have been successfully linked to the opportunity.",
          variant: "default"
        });
        // Notify parent of the new proposal link
        if (onProposalLinked && selectedProposalsData.length > 0) {
          onProposalLinked(selectedProposalIds.join(','), selectedProposalsData[0].Name || selectedProposalsData[0].ProposalName || "");
        }
      } else {
        throw new Error('No response received from API');
      }
    } catch (error) {
      console.error('Failed to save proposals:', error);
      toast({
        title: "Error",
        description: "Failed to link proposals. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Show "Select Customer" message if no customer is selected
  if (!hasCustomerSelected) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg mb-2">Select Customer</p>
        <p className="text-sm">Please select a customer to view linked proposals.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader text="Loading proposals..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg mb-2">No linked proposals found</p>
        <p className="text-sm">There are currently no proposals associated with this customer: {customerName}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-800">
          Linked Proposals ({proposals.length}) - {customerName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedProposals.size === proposals.length && proposals.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="font-semibold">Proposal Name</TableHead>
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Rep</TableHead>
                <TableHead className="font-semibold">Create Date</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal, index) => (
                <TableRow key={proposal.ID || index} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedProposals.has(proposal.ID)}
                      onCheckedChange={(checked) => handleSelectProposal(proposal.ID, checked)}
                      aria-label={`Select proposal ${proposal.Name || proposal.ProposalName}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="max-w-xs">
                      <div className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        {proposal.Name || proposal.ProposalName || '-'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {proposal.ProductNames || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={proposal.Description}>
                      {proposal.Description || proposal.Notes || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {proposal.SalesRep?.Name || '-'}
                  </TableCell>
                  <TableCell>
                    {formatDate(proposal.StartDate)}
                  </TableCell>
                  <TableCell>
                    {formatAmount(proposal.Amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedProposalsSection;
