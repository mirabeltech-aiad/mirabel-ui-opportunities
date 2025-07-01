
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MainNavbar from "@OpportunityComponents/MainNavbar";
import AddOpportunityHeader from "@/features/Opportunity/components/AddOpportunity/AddOpportunityHeader";
import AddOpportunityTabs from "@/features/Opportunity/components/AddOpportunity/AddOpportunityTabs";
import Loader from "@/features/Opportunity/components/ui/loader";
import { useAddOpportunityForm } from "@/hooks/useAddOpportunityForm";
import { OPPORTUNITY_OPTIONS } from "@/features/Opportunity/constants/opportunityOptions";

const AddOpportunity = () => {
  const navigate = useNavigate();
  const { formData, handleInputChange, isLoading, saveOpportunity, isSaving, error } = useAddOpportunityForm();

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
              The opportunity has been successfully created.
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
      
      <AddOpportunityHeader 
        onCancel={handleCancel}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">
                Add New Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddOpportunityTabs
                formData={formData}
                handleInputChange={handleInputChange}
                opportunityOptions={OPPORTUNITY_OPTIONS}
                onLinkProposal={handleLinkProposal}
                onSave={handleSave}
                isSaving={isSaving}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddOpportunity;
