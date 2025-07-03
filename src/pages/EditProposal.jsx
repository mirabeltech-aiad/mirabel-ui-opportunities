
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MainNavbar from "@OpportunityComponents/MainNavbar";
import EditProposalHeader from "@/features/Opportunity/components/EditProposal/EditProposalHeader";
import EditProposalTabs from "@/features/Opportunity/components/EditProposal/EditProposalTabs";
import { useProposalForm } from "@/hooks/useProposalForm";
import { PROPOSAL_OPTIONS } from "@/features/Opportunity/constants/proposalOptions";

const EditProposal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formData, handleInputChange } = useProposalForm(id);

  const handleSave = () => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-lg font-semibold">Success!</span>
        </div>
      ),
      description: (
        <div className="mt-2">
          <p className="text-base text-gray-700">The proposal has been successfully updated.</p>
          <p className="text-sm text-gray-500 mt-1">All changes have been saved to the database.</p>
        </div>
      ),
      className: "border-green-200 bg-green-50 text-green-900 shadow-lg",
      duration: 4000,
    });
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleLinkOpportunity = () => {
    navigate('/linked-opportunities');
  };

  return (
    <div className="flex flex-col bg-gray-50 w-full min-h-screen">
      <MainNavbar />
      
      <EditProposalHeader 
        proposalId={id}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Proposal Details</CardTitle>
            </CardHeader>
            <CardContent>
              <EditProposalTabs
                formData={formData}
                handleInputChange={handleInputChange}
                proposalId={id}
                proposalOptions={PROPOSAL_OPTIONS}
                onLinkOpportunity={handleLinkOpportunity}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProposal;
