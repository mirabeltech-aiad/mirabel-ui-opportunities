import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@OpportunityComponents/ui/tabs";
import { Button } from "@OpportunityComponents/ui/button";
import { Link2Off } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import apiService from "@/services/apiService";
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
const getBusinessUnitId = (businessUnitName, businessUnitId) => {
  if (businessUnitId) return businessUnitId;
  if (!businessUnitName) return "";
  return "1";
};
const getAssignedRepId = (repName) => {
  if (!repName) return 1;
  return 1;
};
const getProductId = (productName, productId) => {
  if (productId) return productId;
  if (!productName) return "4";
  return "4";
};
const formatDateForApi = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

const EditOpportunityTabs = ({ 
  formData, 
  handleInputChange, 
  opportunityId,
  opportunityOptions,
  onLinkProposal,
  onSave,
  isSaving,
  isAddMode
}) => {
  const [activeTab, setActiveTab] = useState("opportunity-info");
  const [isUnlinking, setIsUnlinking] = useState(false);

  const handleUnlinkProposal = async () => {
    setIsUnlinking(true);
    try {
      // Build payload as in saveOpportunity, but ProposalID and ProposalName are empty
      const payload = {
        Amount: formData.amount ? formData.amount.toString() : "0",
        AssignedTODetails: formData.assignedRepDetails && formData.assignedRepDetails.ID ? {
          ID: parseInt(formData.assignedRepDetails.ID),
          Name: formData.assignedRepDetails.Name || formData.assignedRep || ""
        } : {
          ID: getAssignedRepId(formData.assignedRep),
          Name: formData.assignedRep || ""
        },
        BusinessUnitDetails: [{
          ID: getBusinessUnitId(formData.businessUnit, formData.businessUnitId),
          Name: formData.businessUnit || ""
        }],
        BusinessUnitIDS: getBusinessUnitId(formData.businessUnit, formData.businessUnitId),
        CloseDate: formatDateForApi(formData.projCloseDate),
        ContactDetails: formData.contactDetails && formData.contactDetails.ID ? {
          ID: parseInt(formData.contactDetails.ID),
          SalesRepID: 1
        } : {
          ID: parseInt(formData.contactId) || 1611,
          SalesRepID: 1
        },
        CreatedDate: formatDateForApi(formData.createdDate),
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
        Name: formData.name || "Opportunity",
        NextStep: formData.nextSteps || "",
        Notes: formData.notes || "",
        ProposalID: "",
        ProposalName: "",
        OppLossReasonDetails: formData.lossReasonDetails && formData.lossReasonDetails.ID ? {
          ID: parseInt(formData.lossReasonDetails.ID),
          Name: formData.lossReasonDetails.Name || formData.lostReason || ""
        } : {
          ID: null,
          Name: formData.lostReason || ""
        },
        OppStageDetails: {
          ID: formData.stageDetails && formData.stageDetails.ID ? parseInt(formData.stageDetails.ID) : null,
          Stage: formData.stage || ""
        },
        OppTypeDetails: {
          ID: formData.opportunityType && formData.opportunityType.id ? parseInt(formData.opportunityType.id) : (formData.opportunityTypeId ? parseInt(formData.opportunityTypeId) : null),
          Name: formData.opportunityType && formData.opportunityType.name ? formData.opportunityType.name : ""
        },
        OwnerDetails: {
          ID: formData.assignedRepDetails?.ID ? parseInt(formData.assignedRepDetails.ID) : null
        },
        Probability: formData.probability ? parseInt(formData.probability) : 0,
        ProductDetails: formData.productDetails && formData.productDetails.length > 0 
          ? formData.productDetails 
          : [{
              ID: formData.product ? getProductId(formData.product, formData.productId) : "",
              Name: formData.product || ""
            }],
        ProductIDS: formData.productDetails && formData.productDetails.length > 0 
          ? formData.productDetails[0].ID 
          : (formData.product ? getProductId(formData.product, formData.productId) : ""),
        SalesPresenterDetails: formData.salesPresenterDetails && formData.salesPresenterDetails.ID ? {
          ID: parseInt(formData.salesPresenterDetails.ID),
          Name: formData.salesPresenterDetails.Name || formData.salesPresentation || ""
        } : {
          ID: 0,
          Name: formData.salesPresentation || ""
        },
        Source: formData.primaryCampaignSource || null,
        StageAction: "Add",
        Status: formData.status || "Open",
        SubContactDetails: formData.contactDetails && formData.contactDetails.ID ? {
          ID: parseInt(formData.contactDetails.ID),
          Name: formData.contactDetails.Name || formData.contactName || ""
        } : {
          ID: parseInt(formData.contactId) || 0,
          Name: formData.contactName || ""
        }
      };
      await apiService.updateOpportunity(payload);
      toast({ title: "Unlinked", description: "Proposal has been unlinked.", variant: "default" });
      handleInputChange("proposalId", "");
      handleInputChange("proposalName", "");
    } catch (error) {
      toast({ title: "Error", description: "Failed to unlink proposal.", variant: "destructive" });
    } finally {
      setIsUnlinking(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="opportunity-info" className="w-full">
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

      {/* Show Proposal Name only for Opportunity Information tab */}
      {activeTab === "opportunity-info" && !isAddMode && formData?.proposalName && (
        <div className="flex items-center justify-center gap-2 mt-[2px] mb-6">
          <span className="text-blue-600">{formData.proposalName}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnlinkProposal}
            className="text-gray-600 hover:text-red-600"
            disabled={isUnlinking}
          >
            <Link2Off className="h-4 w-4" />
          </Button>
        </div>
      )}

      <TabsContent value="opportunity-info" className="mt-6">
        <div className="space-y-6">
          <BasicInfoSection 
            formData={formData} 
            handleInputChange={handleInputChange}
            opportunityOptions={opportunityOptions}
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
            company: formData.company 
          }}
          onLinkProposal={onLinkProposal} 
          onProposalLinked={(proposalId, proposalName) => {
            handleInputChange("proposalId", proposalId);
            handleInputChange("proposalName", proposalName);
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
