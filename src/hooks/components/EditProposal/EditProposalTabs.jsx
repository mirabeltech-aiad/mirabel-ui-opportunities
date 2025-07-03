
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@OpportunityComponents/ui/tabs";
import { Button } from "@OpportunityComponents/ui/button";
import EditProposalAccordion from "./EditProposalAccordion";
import ProposalTasksSection from "./ProposalTasksSection";
import ProposalTimelineSection from "./ProposalTimelineSection";
import ProposalStageTrailSection from "./ProposalStageTrailSection";
import ProposalStatsSection from "./ProposalStatsSection";

const EditProposalTabs = ({ 
  formData, 
  handleInputChange, 
  proposalId, 
  proposalOptions,
  onLinkOpportunity 
}) => {
  return (
    <Tabs defaultValue="proposal-info" className="w-full">
      <div className="flex justify-center mb-6">
        <TabsList className="grid w-auto grid-cols-6 bg-blue-50 border-blue-200">
          <TabsTrigger value="proposal-info" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Proposal Information</TabsTrigger>
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Linked Opportunities</TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Tasks</TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Activities</TabsTrigger>
          <TabsTrigger value="stage-trail" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Stage Progression</TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Analytics</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="proposal-info" className="mt-4">
        <EditProposalAccordion
          formData={formData}
          handleInputChange={handleInputChange}
          statusOptions={proposalOptions.status}
          stageOptions={proposalOptions.stage}
          typeOptions={proposalOptions.type}
          priorityOptions={proposalOptions.priority}
          industryOptions={proposalOptions.industry}
          companySizeOptions={proposalOptions.companySize}
          timeframeOptions={proposalOptions.timeframe}
          territoryOptions={proposalOptions.territory}
          stateOptions={proposalOptions.state}
          businessUnitOptions={proposalOptions.businessUnit}
          productOptions={proposalOptions.product}
          repOptions={proposalOptions.rep}
        />
      </TabsContent>
      
      <TabsContent value="opportunities" className="mt-4">
        <div className="text-center py-8 text-blue-600">
          <p>No linked opportunities found for this proposal.</p>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700" variant="outline" onClick={onLinkOpportunity}>
            Link Opportunity
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="tasks" className="mt-4">
        <ProposalTasksSection proposalId={proposalId} />
      </TabsContent>
      
      <TabsContent value="activities" className="mt-4">
        <ProposalTimelineSection proposalId={proposalId} />
      </TabsContent>
      
      <TabsContent value="stage-trail" className="mt-4">
        <ProposalStageTrailSection proposalId={proposalId} />
      </TabsContent>

      <TabsContent value="stats" className="mt-4">
        <ProposalStatsSection proposalId={proposalId} />
      </TabsContent>
    </Tabs>
  );
};

export default EditProposalTabs;
