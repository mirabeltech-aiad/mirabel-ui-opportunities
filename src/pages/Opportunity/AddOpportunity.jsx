import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/features/Opportunity/hooks/use-toast";

import AddOpportunityHeader from "@/features/Opportunity/components/AddOpportunity/AddOpportunityHeader";
import AddOpportunityTabs from "@/features/Opportunity/components/AddOpportunity/AddOpportunityTabs";
import Loader from "@/components/ui/loader";
import StatusChangeConfirmDialog from "@/components/ui/StatusChangeConfirmDialog";
import { useAddOpportunityForm } from "@/features/Opportunity/hooks/useAddOpportunityForm";
import { OPPORTUNITY_OPTIONS } from "@/features/Opportunity/constants/opportunityOptions";

const AddOpportunity = () => {
  const navigate = useNavigate();
  const [apiStages, setApiStages] = React.useState([]);

  const {
    formData,
    handleInputChange,
    isLoading,
    saveOpportunity,
    isSaving,
    error,
    isCustomerSelected,
    getFieldError,
    hasValidationErrors,
    hasSubmitted,
    retryCount,
    statusConfirmDialog,
    handleStatusConfirm,
    handleStatusCancel,
    isStageDisabled,
    isProbabilityDisabled,
  } = useAddOpportunityForm(apiStages);

  const handleApiStagesLoaded = React.useCallback((stages) => {
    setApiStages(stages);
  }, []);

  const handleSave = async () => {
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

  const handleRetry = async () => {
    await handleSave();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleLinkProposal = () => {
    navigate("/linked-proposals");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col bg-gray-50 w-full min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <Loader size="lg" text="Loading opportunity details..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 w-full min-h-screen">
      <AddOpportunityHeader
        onCancel={handleCancel}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Enhanced Error Display */}
          {error && (
            <div className="mb-6">
              <Alert
                className={`border-2 ${
                  error.type === "validation"
                    ? "border-amber-200 bg-amber-50"
                    : error.type === "network" || error.type === "timeout"
                    ? "border-blue-200 bg-blue-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <AlertTriangle
                  className={`h-4 w-4 ${
                    error.type === "validation"
                      ? "text-amber-600"
                      : error.type === "network" || error.type === "timeout"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                />
                <AlertDescription>
                  <div className="flex flex-col gap-2">
                    <div
                      className={`font-medium ${
                        error.type === "validation"
                          ? "text-amber-800"
                          : error.type === "network" || error.type === "timeout"
                          ? "text-blue-800"
                          : "text-red-800"
                      }`}
                    >
                      {error.type === "validation" && "Validation Error"}
                      {error.type === "network" && "Network Error"}
                      {error.type === "timeout" && "Timeout Error"}
                      {error.type === "server" && "Server Error"}
                      {error.type === "auth" && "Authentication Error"}
                      {error.type === "permission" && "Permission Error"}
                      {error.type === "conflict" && "Conflict Error"}
                      {![
                        "validation",
                        "network",
                        "timeout",
                        "server",
                        "auth",
                        "permission",
                        "conflict",
                      ].includes(error.type) && "Error"}
                    </div>
                    <div
                      className={`text-sm ${
                        error.type === "validation"
                          ? "text-amber-700"
                          : error.type === "network" || error.type === "timeout"
                          ? "text-blue-700"
                          : "text-red-700"
                      }`}
                    >
                      {error.message}
                    </div>
                    {retryCount > 0 && (
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Retry attempt {retryCount}
                      </div>
                    )}
                    {error.isRetryable && !isSaving && (
                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleRetry}
                          className="text-xs"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Try Again
                        </Button>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

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
                isCustomerSelected={isCustomerSelected}
                getFieldError={getFieldError}
                hasValidationErrors={hasValidationErrors}
                hasSubmitted={hasSubmitted}
                isStageDisabled={isStageDisabled}
                isProbabilityDisabled={isProbabilityDisabled}
                onApiStagesLoaded={handleApiStagesLoaded}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Change Confirmation Dialog */}
      <StatusChangeConfirmDialog
        isOpen={statusConfirmDialog.isOpen}
        onOpenChange={(open) => !open && handleStatusCancel()}
        statusValue={statusConfirmDialog.newStatus}
        onConfirm={handleStatusConfirm}
        onCancel={handleStatusCancel}
      />
    </div>
  );
};

export default AddOpportunity;
