import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info, Link2Off } from "lucide-react";
import Loader from "@/components/ui/loader";
import apiService from "@/features/Opportunity/Services/apiService";
import { Button } from "@/components/ui/button";
import { toast } from "@/features/Opportunity/hooks/use-toast";
import { cn } from "@/lib/utils";

const LinkedProposalsSection = ({
  opportunityId,
  opportunityData = {},
  companyDetails = {},
  onProposalLinked,
}) => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  // Persist the last selected proposal so we can keep it visible even if
  // subsequent API responses exclude it (e.g., due to server-side filtering)
  const lastSelectedProposalRef = useRef(null);
  const lastSelectedIndexRef = useRef(null);
  const selectedProposalRef = useRef(null);

  // Keep a ref in sync so effects do not need to depend on selectedProposal
  useEffect(() => {
    selectedProposalRef.current = selectedProposal;
  }, [selectedProposal]);

  // Ensure local selectedProposal always mirrors the parent when it changes
  useEffect(() => {
    if (!opportunityData?.proposalId) return;
    const first = opportunityData.proposalId.toString().split(",")[0];
    if (first && first !== selectedProposalRef.current) {
      setSelectedProposal(first);
    }
  }, [opportunityData?.proposalId]);

  // Check if customer/product is selected - get from multiple possible sources
  const customerName =
    companyDetails.customerName ||
    companyDetails.company ||
    opportunityData.company ||
    opportunityData.customerName ||
    "";
  const hasCustomerSelected = customerName.trim() !== "";
  const isEditMode = !!opportunityId;
  // We intentionally avoid coupling fetch criteria to product/BU selections.
  // Proposals should load for the selected company only and not refetch when
  // product/business unit change due to proposal selection.

  // Initialize selectedProposal with currently linked proposal when component mounts
  useEffect(() => {
    if (!opportunityData.proposalId) return;
    // If multiple proposals were linked before (comma-separated), take the first one for single selection
    const firstProposalId = opportunityData.proposalId.split(",")[0];
    // Always store as string for consistent comparisons
    setSelectedProposal(firstProposalId.toString());
  }, [opportunityData.proposalId]);

  // Simplified gating logic - only require company to be selected
  const shouldShowProposals = useCallback(() => {
    // If no company selected → show alert and do not show proposals
    if (!hasCustomerSelected) {
      return {
        canShow: false,
        message: "Select Company to view available proposals",
      };
    }

    // If company is selected → always show proposals (products are optional)
    return { canShow: true, message: null };
  }, [hasCustomerSelected]);

  // Validate proposal selection logic for single selection
  const validateProposalSelection = () => {
    if (!selectedProposal) {
      return {
        isValid: false,
        message: "Please select a proposal to link.",
      };
    }

    // Get selected proposal data for validation
    const selectedProposalData = proposals.find(
      (proposal) => proposal.ID === selectedProposal
    );

    if (!selectedProposalData) {
      return {
        isValid: false,
        message: "Selected proposal not found.",
      };
    }

    // Validate proposal amount vs opportunity amount (optional validation)
    if (opportunityData.amount && selectedProposalData) {
      const proposalAmount = parseFloat(
        selectedProposalData.Amount || selectedProposalData.TotalAmount || 0
      );
      const opportunityAmount = parseFloat(opportunityData.amount || 0);

      if (proposalAmount > opportunityAmount * 1.5) {
        // Allow 50% variance - more lenient
        return {
          isValid: false,
          message: `Proposal amount ($${proposalAmount.toLocaleString()}) significantly exceeds opportunity amount ($${opportunityAmount.toLocaleString()}). Please review the amounts.`,
          type: "warning",
        };
      }
    }

    return { isValid: true };
  };

  const handleSelectProposal = (proposalId) => {
    console.log(
      "handleSelectProposal called with:",
      proposalId,
      "type:",
      typeof proposalId
    );
    console.log(
      "Current selectedProposal:",
      selectedProposal,
      "type:",
      typeof selectedProposal
    );

    // Optimistically update local selection immediately for snappy UI
    setSelectedProposal(proposalId.toString());

    // Reference behavior: Selection immediately populates and links the proposal
    const selectedProposalData = proposals.find(
      (proposal) => proposal.ID === proposalId
    );

    if (!selectedProposalData) {
      toast({
        title: "Error",
        description: "Selected proposal not found.",
        variant: "destructive",
      });
      return;
    }

    // Remember the selected proposal row for future list refreshes
    lastSelectedProposalRef.current = selectedProposalData;
    // Capture current index so we can re-insert at the same spot after refresh
    const currentIndex = proposals.findIndex(
      (p) => p.ID === proposalId || p.ID?.toString() === proposalId?.toString()
    );
    lastSelectedIndexRef.current = currentIndex >= 0 ? currentIndex : null;

    // Parse proposal data according to reference
    const proposalProductIds = selectedProposalData.ProductID
      ? selectedProposalData.ProductID.toString()
          .split(",")
          .filter((id) => id.trim())
      : [];
    const proposalProductNames = selectedProposalData.ProductNames
      ? selectedProposalData.ProductNames.split(",")
          .map((name) => name.trim())
          .filter((name) => name)
      : [];
    const proposalBusinessUnitIds = selectedProposalData.BusinessUnitIDs
      ? selectedProposalData.BusinessUnitIDs.toString()
          .split(",")
          .filter((id) => id.trim())
      : [];
    const proposalBusinessUnitNames = selectedProposalData.BusinessUnitNames
      ? selectedProposalData.BusinessUnitNames.split(",")
          .map((name) => name.trim())
          .filter((name) => name)
      : [];

    // Create updated opportunity data - immediately link and populate
    const updatedOpportunityData = {
      ...opportunityData,
      // Link the proposal immediately
      proposalId: proposalId.toString(),
      proposalName:
        selectedProposalData.Name || selectedProposalData.ProposalName || "",
      // Populate fields from proposal (these will be locked)
      amount:
        selectedProposalData.Net ||
        selectedProposalData.Amount ||
        selectedProposalData.TotalAmount ||
        0,
      productId: proposalProductIds,
      product: proposalProductNames,
      productDetails: proposalProductIds.map((id, index) => ({
        ID: id,
        Name: proposalProductNames[index] || `Product ${id}`,
      })),
      businessUnitId: proposalBusinessUnitIds,
      businessUnit: proposalBusinessUnitNames,
      businessUnitDetails: proposalBusinessUnitIds.map((id, index) => ({
        ID: id,
        Name: proposalBusinessUnitNames[index] || `Business Unit ${id}`,
      })),
    };

    // Call the parent callback to handle linking with immediate persistence
    if (onProposalLinked) {
      onProposalLinked(
        proposalId.toString(),
        selectedProposalData.Name || selectedProposalData.ProposalName || "",
        selectedProposalData.Net ??
          selectedProposalData.Amount ??
          selectedProposalData.TotalAmount ??
          0,
        selectedProposalData.ProductID,
        selectedProposalData.ProductNames,
        selectedProposalData.BusinessUnitIDs,
        selectedProposalData.BusinessUnitNames,
        updatedOpportunityData
      );
    }

    // Show success message for linking
    toast({
      title: "Proposal Linked",
      description: `${selectedProposalData.Name || 'Proposal'} has been linked to this opportunity and fields have been populated.`,
      variant: "default",
    });

    // Local selection already updated above
  };

  useEffect(() => {
    // Reference gating logic - no caching, fresh API call every time
    console.log("LinkedProposalsSection useEffect triggered:", {
      customerName,
      hasCustomerSelected,
      isEditMode,
    });

    const gatingResult = shouldShowProposals();
    console.log("Gating result:", gatingResult);

    if (!gatingResult.canShow) {
      console.log("Gating failed, not loading proposals");
      setProposals([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchProposals = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching proposals for customer:", customerName);

        // Build payload – query by company only to prevent refetching when
        // product or business unit are auto-filled from selection
        const productIds = ""; // do not filter by products
        const businessUnitId = -1; // do not filter by BU

        const payload = {
          ProductIDs: productIds, // CSV from opportunityData.Product
          ProductTypeID: isNaN(businessUnitId) ? -1 : businessUnitId,
          Customer: customerName, // from companyDetails.customerName
          ConvertedToContract: "NO",
          FromDate: "",
          ToDate: "",
          UserID: -1,
        };

        console.log("API payload:", payload);

        // Reference endpoint: POST /services/production/proposals/bycriteria/ALL
        const response = await apiService.post(
          "/services/production/proposals/bycriteria/ALL",
          payload
        );


        if (response && response.content && response.content.List) {
          // Reference filtering: only proposals not yet linked (OpportunityID == 0)
          const unlinkedProposals = response.content.List.filter(
            (proposal) => proposal.OpportunityID === 0
          );

          // Ensure currently selected proposal stays in the list even if it gets linked
          if (selectedProposalRef.current) {
            let currentlySelected = response.content.List.find(
              (proposal) =>
                proposal.ID === selectedProposalRef.current ||
                proposal.ID?.toString() ===
                  selectedProposalRef.current?.toString()
            );
            // Fallback: if API omitted it, reuse the last known selected row
            if (!currentlySelected && lastSelectedProposalRef.current) {
              const ls = lastSelectedProposalRef.current;
              if (
                ls &&
                (ls.ID === selectedProposalRef.current ||
                  ls.ID?.toString() === selectedProposalRef.current?.toString())
              ) {
                currentlySelected = ls;
              }
            }
            if (
              currentlySelected &&
              !unlinkedProposals.find(
                (p) =>
                  p.ID === selectedProposalRef.current ||
                  p.ID?.toString() === selectedProposalRef.current?.toString()
              )
            ) {
              const insertIndex =
                typeof lastSelectedIndexRef.current === "number" &&
                lastSelectedIndexRef.current >= 0 &&
                lastSelectedIndexRef.current <= unlinkedProposals.length
                  ? lastSelectedIndexRef.current
                  : unlinkedProposals.length;
              unlinkedProposals.splice(insertIndex, 0, currentlySelected);
            }
          }

          setProposals(unlinkedProposals);
        } else if (response && Array.isArray(response)) {
          const unlinkedProposals = response.filter(
            (proposal) => proposal.OpportunityID === 0
          );

          // Ensure currently selected proposal stays in the list even if it gets linked
          if (selectedProposalRef.current) {
            let currentlySelected = response.find(
              (proposal) =>
                proposal.ID === selectedProposalRef.current ||
                proposal.ID?.toString() ===
                  selectedProposalRef.current?.toString()
            );
            if (!currentlySelected && lastSelectedProposalRef.current) {
              const ls = lastSelectedProposalRef.current;
              if (
                ls &&
                (ls.ID === selectedProposalRef.current ||
                  ls.ID?.toString() === selectedProposalRef.current?.toString())
              ) {
                currentlySelected = ls;
              }
            }
            if (
              currentlySelected &&
              !unlinkedProposals.find(
                (p) =>
                  p.ID === selectedProposalRef.current ||
                  p.ID?.toString() === selectedProposalRef.current?.toString()
              )
            ) {
              const insertIndex =
                typeof lastSelectedIndexRef.current === "number" &&
                lastSelectedIndexRef.current >= 0 &&
                lastSelectedIndexRef.current <= unlinkedProposals.length
                  ? lastSelectedIndexRef.current
                  : unlinkedProposals.length;
              unlinkedProposals.splice(insertIndex, 0, currentlySelected);
            }
          }

          setProposals(unlinkedProposals);
        } else {
          setProposals([]);
        }
      } catch (error) {
        console.error("Failed to fetch proposals:", error);
        setError("Failed to load proposals. Please try again.");
        setProposals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, [customerName, hasCustomerSelected, isEditMode, shouldShowProposals]);

  // Note: handleLinkProposal removed - linking now happens immediately on selection

  // Reference gating behavior - show proper alerts when conditions not met
  const gatingResult = shouldShowProposals();

  // Get proposal validation result for warning display
  const proposalValidation = validateProposalSelection();

  // Determine if proposals can be linked (basic validation)
  const canLinkProposals = !!(opportunityData.name && customerName);

  if (!gatingResult.canShow) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg mb-2 font-medium">{gatingResult.message}</p>
        <p className="text-sm">
          After selecting a company, you can optionally choose a proposal to
          auto-populate fields.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader size="md" text="Loading proposals..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Alert className="border-red-200 bg-red-50 max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="text-red-800 font-medium mb-1">
              Failed to Load Proposals
            </div>
            <div className="text-sm text-red-700">{error}</div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg mb-2 font-medium">No Proposals Found</p>
        <p className="text-sm">
          No proposals were found for customer: <strong>{customerName}</strong>
        </p>
        <p className="text-xs mt-2 text-gray-400">
          This company may not have any available proposals, or they may already
          be linked to other opportunities.
        </p>
      </div>
    );
  }

  // No validation needed - immediate linking on selection

  return (
    <div className="space-y-4">
      {/* Simple proposal summary */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="font-medium text-blue-900">
          Available Proposals for {customerName}
        </p>
        <p className="text-sm text-blue-700">
          {proposals.length} proposal(s) found • Select a proposal to
          auto-populate fields (optional)
        </p>
      </div>

      {/* Validation warnings for proposal amounts */}
      {selectedProposal &&
        !proposalValidation.isValid &&
        proposalValidation.type === "warning" &&
        canLinkProposals && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              <div className="text-amber-800 font-medium mb-1">
                Amount Validation Warning
              </div>
              <div className="text-sm text-amber-700">
                {proposalValidation.message}
              </div>
            </AlertDescription>
          </Alert>
        )}

      {/* Proposals Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Available Proposals</CardTitle>
            <div className="text-sm text-gray-600">
              Select a proposal to link with opportunity created
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Proposal Name</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Description</TableHead>

                <TableHead>Rep</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => {
                const isChecked =
                  selectedProposal?.toString() === proposal.ID.toString();
                const isLinkedByParent =
                  opportunityData.proposalId &&
                  opportunityData.proposalId
                    .toString()
                    .split(",")
                    .includes(proposal.ID.toString());
                // Combined check retained for possible future use

                return (
                  <TableRow
                    key={proposal.ID}
                    className={cn(
                      "hover:bg-gray-50 cursor-pointer",
                      (isLinkedByParent || isChecked) &&
                        "bg-green-50 border-green-200"
                    )}
                    onClick={() => handleSelectProposal(proposal.ID)}
                  >
                    <TableCell>
                      <input
                        type="radio"
                        name="proposalSelection"
                        checked={isChecked}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProposal(proposal.ID);
                        }}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectProposal(proposal.ID);
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      {/* Linked label removed per requirements */}
                    </TableCell>
                    <TableCell className="font-medium">
                      {proposal.Name ||
                        proposal.ProposalName ||
                        "Unnamed Proposal"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {proposal.ProductNames || proposal.Products || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {proposal.Description || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {proposal.SalesRep?.Name || proposal.Rep || "N/A"}
                    </TableCell>
                    <TableCell>
                      {proposal.CreatedDate || proposal.StartDate
                        ? new Date(
                            proposal.CreatedDate || proposal.StartDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const val =
                          proposal.Net ??
                          proposal.Amount ??
                          proposal.TotalAmount ??
                          proposal.NetAmount ??
                          proposal.TotalNet ??
                          proposal.Total ??
                          null;
                        return val
                          ? `$${parseFloat(val).toLocaleString()}`
                          : "";
                      })()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Note: Selection populates opportunity details - no immediate linking message */}
    </div>
  );
};

export default LinkedProposalsSection;
