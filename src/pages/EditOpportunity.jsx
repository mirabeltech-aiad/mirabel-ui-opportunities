import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MainNavbar from "@OpportunityComponents/MainNavbar";
import EditOpportunityHeader from "@/features/Opportunity/components/EditOpportunity/EditOpportunityHeader";
import EditOpportunityTabs from "@/features/Opportunity/components/EditOpportunity/EditOpportunityTabs";
import Loader from "@/features/Opportunity/components/ui/loader";
import { useOpportunityForm } from "@/hooks/useOpportunityForm";
import { OPPORTUNITY_OPTIONS } from "@/features/Opportunity/constants/opportunityOptions";

// Refactored main component - extracted logic into smaller, focused components
const EditOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAddMode = !id; // If no ID, we're in add mode
  const { formData, handleInputChange, isLoading, saveOpportunity, isSaving } = useOpportunityForm(id);

  const handleSave = async () => {
    console.log('Save button clicked - calling saveOpportunity function');
    const success = await saveOpportunity();
    if (success) {
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-lg font-semibold">Success!</span>
          </div>
        ),
        description: (
          <div className="mt-2">
            <p className="text-base text-gray-700">
              The opportunity has been successfully {isAddMode ? 'created' : 'updated'}.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              All changes have been saved to the database.
            </p>
          </div>
        ),
        className: "border-green-200 bg-green-50 text-green-900 shadow-lg",
        duration: 4000,
      });
      navigate(-1);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleLinkProposal = () => {
    navigate('/linked-proposals');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col bg-gray-50 w-full min-h-screen">
        <MainNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader size="lg" text="Loading opportunity details..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 w-full min-h-screen">
      <MainNavbar />
      
      <EditOpportunityHeader 
        opportunityId={id}
        onCancel={handleCancel}
        onSave={handleSave}
        isSaving={isSaving}
        isAddMode={isAddMode}
        formData={formData}
      />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">
                {isAddMode ? 'Add New Opportunity' : 'Opportunity Details'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EditOpportunityTabs
                formData={formData}
                handleInputChange={handleInputChange}
                opportunityId={id}
                opportunityOptions={OPPORTUNITY_OPTIONS}
                onLinkProposal={handleLinkProposal}
                onSave={handleSave}
                isSaving={isSaving}
                isAddMode={isAddMode}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditOpportunity;
