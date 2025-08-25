import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link2Off } from "lucide-react";
import { toast } from "@/features/Opportunity/hooks/use-toast";
// import apiService from "@/features/Opportunity/Services/apiService";
import BasicInfoSection from "./BasicInfoSection";
import CompanyDetailsSection from "./CompanyDetailsSection";
import SalesDetailsSection from "./SalesDetailsSection";
import LinkedProposalsSection from "./LinkedProposalsSection";
import TasksSection from "./TasksSection";
import AuditTrailSection from "./AuditTrailSection";
import StageTrailSection from "./StageTrailSection";
import OpportunityStatsSection from "./OpportunityStatsSection";
import TimelineSection from "./TimelineSection";
import StatusProgressSection from "./StatusProgressSection";


// Helper functions (copied from useOpportunityForm.js)
// const getBusinessUnitId = (businessUnitName, businessUnitId) => {
//   if (businessUnitId) return businessUnitId;
//   if (!businessUnitName) return "";
//   return "1";
// };
const getAssignedRepId = (repName) => {
  if (!repName) return 1;
  return 1;
};
// const getProductId = (productName, productId) => {
//   if (productId) return productId;
//   if (!productName) return "4";
//   return "4";
// };
const formatDateForApi = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const EditOpportunityTabs = ({
  formData,
  handleInputChange,
  handleBatchInputChange,
  opportunityId,
  opportunityOptions,
  onLinkProposal,
  onUnlinkProposal,
  shouldShowUnlinkOption,
  isProposalReplacement,
  originalProposalId,
  // onSave,
  // isSaving,
  isAddMode,
  onApiStagesLoaded, // Add callback prop
  getFieldError,
  // hasValidationErrors,
  hasSubmitted,
}) => {
  const [activeTab, setActiveTab] = useState("opportunity-info");
  const [isUnlinking, setIsUnlinking] = useState(false);

  // Check if proposal is linked to determine field disable state
  const isProposalCurrentlyLinked = !!(
    formData.proposalId && formData.proposalId.trim() !== ""
  );

  const handleUnlinkProposal = async () => {
    if (!window.confirm('Are you sure you want to unlink this proposal? This action will clear the linked proposal data and cannot be undone.')) {
      return;
    }
    
    setIsUnlinking(true);
    try {
      const success = await onUnlinkProposal();
      if (success) {
        // Success message is handled in the hook
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unlink proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUnlinking(false);
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      defaultValue="opportunity-info"
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-6 bg-blue-50 p-1 rounded-md">
        <TabsTrigger
          value="opportunity-info"
          className="text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200"
        >
          Opportunity Information
        </TabsTrigger>
        <TabsTrigger
          value="linked-proposals"
          className="text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200"
        >
          Linked Proposals
        </TabsTrigger>
        <TabsTrigger
          value="tasks"
          className="text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200"
        >
          Tasks
        </TabsTrigger>
        <TabsTrigger
          value="activities"
          className="text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200"
        >
          Activities
        </TabsTrigger>
        <TabsTrigger
          value="stage-progression"
          className="text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200"
        >
          Stage Progression
        </TabsTrigger>
        <TabsTrigger
          value="stats"
          className="text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200"
        >
          Stats
        </TabsTrigger>
      </TabsList>

      {/* Show Proposal Information in Edit tab header */}
      {activeTab === "opportunity-info" &&
        !isAddMode &&
        formData?.proposalName && (
          <div className="flex items-center justify-center gap-3 mt-[2px] mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-700 font-medium">Linked Proposal:</span>
              <a 
                href={`/proposals/${formData.proposalId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                {formData.proposalName}
              </a>
              {/* TODO: Check if proposal is converted to contract and show indicator */}
              {formData.isProposalConverted && (
                <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                  (Converted to Contract)
                </span>
              )}
              {/* Show proposal replacement indicator */}
              {isProposalReplacement(formData.proposalId) && (
                <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded">
                  (New Selection - Save to Confirm)
                </span>
              )}
            </div>
            {/* Only show unlink button for existing proposals, not new selections */}
            {shouldShowUnlinkOption() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUnlinkProposal}
                className="text-gray-600 hover:text-red-600 ml-auto"
                disabled={isUnlinking}
                title="Unlink Proposal"
              >
                <Link2Off className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

      <TabsContent value="opportunity-info" className="mt-6">
        <div className="space-y-6">
          <BasicInfoSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleBatchInputChange={handleBatchInputChange}
            opportunityOptions={opportunityOptions}
            onApiStagesLoaded={onApiStagesLoaded}
            getFieldError={getFieldError}
            // hasValidationErrors={hasValidationErrors}
            isAddMode={ formData.opportunityId === 0}
            hasSubmitted={hasSubmitted}
            isProposalLinkedFieldsDisabled={isProposalCurrentlyLinked}
          />

          <CompanyDetailsSection
            formData={formData}
            handleInputChange={handleInputChange}
            opportunityOptions={opportunityOptions}
          />

          <SalesDetailsSection
            formData={formData}
            handleInputChange={handleInputChange}
            opportunityOptions={opportunityOptions}
          />
        </div>
      </TabsContent>

      <TabsContent value="linked-proposals" className="mt-6">
        <LinkedProposalsSection
          opportunityId={opportunityId}
          opportunityData={formData}
          companyDetails={{
            customerName: formData.company,
            company: formData.company,
          }}
          onLinkProposal={onLinkProposal}
          onProposalLinked={(
            proposalId,
            proposalName,
            net,
            productId,
            productNames,
            businessUnitIds,
            businessUnitNames,
            updatedOpportunityData
          ) => {
            // Handle proposal linking callback with immediate field population

           

            // Handle linking case - immediately populate all fields using batch update
            if (proposalId && proposalId !== "") {
              // Check if this is a proposal replacement
              const isReplacement = isProposalReplacement(proposalId);
              if (isReplacement) {
                console.log('Replacing existing proposal:', originalProposalId, 'with:', proposalId);
              }
              // Prepare batch update object with all proposal data
              const batchUpdate = {
                proposalId: proposalId,
                proposalName: proposalName,
              };

              // Add amount if available
              if (net !== undefined && net !== null) {
                batchUpdate.amount = net.toString();
              }

              // Add products if available - ensure arrays are properly formatted
              if (updatedOpportunityData?.productId && Array.isArray(updatedOpportunityData.productId)) {
                console.log('Adding productId to batch:', updatedOpportunityData.productId);
                batchUpdate.productId = updatedOpportunityData.productId;
              }
              if (updatedOpportunityData?.product && Array.isArray(updatedOpportunityData.product)) {
                console.log('Adding product to batch:', updatedOpportunityData.product);
                batchUpdate.product = updatedOpportunityData.product;
              }
              if (updatedOpportunityData?.productDetails && Array.isArray(updatedOpportunityData.productDetails)) {
                console.log('Adding productDetails to batch:', updatedOpportunityData.productDetails);
                batchUpdate.productDetails = updatedOpportunityData.productDetails;
              }

              // Add business units if available - ensure arrays are properly formatted
              if (updatedOpportunityData?.businessUnitId && Array.isArray(updatedOpportunityData.businessUnitId)) {
                console.log('Adding businessUnitId to batch:', updatedOpportunityData.businessUnitId);
                batchUpdate.businessUnitId = updatedOpportunityData.businessUnitId;
              }
              if (updatedOpportunityData?.businessUnit && Array.isArray(updatedOpportunityData.businessUnit)) {
                console.log('Adding businessUnit to batch:', updatedOpportunityData.businessUnit);
                batchUpdate.businessUnit = updatedOpportunityData.businessUnit;
              }
              if (updatedOpportunityData?.businessUnitDetails && Array.isArray(updatedOpportunityData.businessUnitDetails)) {
                console.log('Adding businessUnitDetails to batch:', updatedOpportunityData.businessUnitDetails);
                batchUpdate.businessUnitDetails = updatedOpportunityData.businessUnitDetails;
              }

              console.log('Performing batch update with:', batchUpdate);
              
              // Perform single batch update for better performance and consistency
              handleBatchInputChange(batchUpdate);

              // Verify update after a short delay
              setTimeout(() => {
                console.log('Form data after proposal batch linking:', {
                  proposalId: formData.proposalId,
                  proposalName: formData.proposalName,
                  amount: formData.amount,
                  product: formData.product,
                  productId: formData.productId,
                  businessUnit: formData.businessUnit,
                  businessUnitId: formData.businessUnitId
                });
              }, 100);

            } else if (proposalId === "" && proposalName === "") {
              // Handle unlinking case - clear the proposal data only
              handleInputChange("proposalId", "");
              handleInputChange("proposalName", "");
              // Note: Don't clear products/business units on explicit unlink as per user preference
            }
          }}
        />
      </TabsContent>

      <TabsContent value="tasks" className="mt-6">
        <TasksSection companyId={formData.contactDetails?.ID} />
      </TabsContent>

      <TabsContent value="activities" className="mt-6">
        <div className="space-y-6">
          <TimelineSection opportunityId={opportunityId} />
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Audit Trail</h3>
            <AuditTrailSection opportunityId={opportunityId} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="stage-progression" className="mt-6">
        <div className="space-y-6">
          <StageTrailSection opportunityId={opportunityId} />
          <StatusProgressSection
            formData={formData}
            handleInputChange={handleInputChange}
            opportunityOptions={opportunityOptions}
          />
        </div>
      </TabsContent>

      <TabsContent value="stats" className="mt-6">
        <OpportunityStatsSection opportunityId={opportunityId} />
      </TabsContent>
    </Tabs>
  );
};

export default EditOpportunityTabs;
