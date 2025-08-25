import React from "react";
import { Button } from "@/components/ui/button";
import SidePanel from "@/components/shared/SidePanel";
import EditOpportunityHeader from "../EditOpportunity/EditOpportunityHeader";
import EditOpportunityTabs from "../EditOpportunity/EditOpportunityTabs";
import StatusChangeConfirmDialog from "@/components/ui/StatusChangeConfirmDialog";
import { useOpportunityForm } from "../../hooks/useOpportunityForm";
import { OPPORTUNITY_OPTIONS } from "../../constants/opportunityOptions";
import Loader from "@/components/ui/loader";

/**
 * Edit Opportunity Panel - Opportunity module specific implementation
 * Uses the generic SidePanel component from components/shared
 */
const EditOpportunityPanel = ({ 
  isOpen, 
  onClose, 
  opportunityId,
  onSaveSuccess 
}) => {
  const [apiStages, setApiStages] = React.useState([]);
  
  const { 
    formData, 
    handleInputChange, 
    isLoading, 
    saveOpportunity, 
    isSaving,
    statusConfirmDialog,
    handleStatusConfirm,
    handleStatusCancel,
    isStageDisabled,
    isProbabilityDisabled
  } = useOpportunityForm(opportunityId, apiStages);

  const handleSave = async () => {
    const success = await saveOpportunity();
    if (success) {
      onSaveSuccess?.(formData);
      onClose();
    }
  };

  const panelTitle = `Edit Opportunity ${opportunityId ? `#${opportunityId}` : ''}`;

  const panelFooter = (
    <div className="flex items-center justify-end gap-3">
      <Button
        variant="outline"
        onClick={onClose}
        disabled={isSaving}
      >
        Cancel
      </Button>
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="min-w-[100px]"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );

  const panelContent = isLoading ? (
    <div className="flex items-center justify-center h-64">
      <Loader />
    </div>
  ) : (
    <div className="space-y-6">
      {/* Opportunity Header Info */}
      <EditOpportunityHeader
        formData={formData}
        handleInputChange={handleInputChange}
        isSaving={isSaving}
        onSave={handleSave}
        isStageDisabled={isStageDisabled}
        isProbabilityDisabled={isProbabilityDisabled}
        opportunityOptions={OPPORTUNITY_OPTIONS}
        apiStages={apiStages}
        setApiStages={setApiStages}
      />

      {/* Opportunity Tabs */}
      <EditOpportunityTabs
        formData={formData}
        handleInputChange={handleInputChange}
        isAddMode={!opportunityId}
        apiStages={apiStages}
        isStageDisabled={isStageDisabled}
        isProbabilityDisabled={isProbabilityDisabled}
      />
    </div>
  );

  return (
    <>
      <SidePanel
        isOpen={isOpen}
        onClose={onClose}
        title={panelTitle}
        footer={panelFooter}
        width="60vw"
        maxWidth="max-w-4xl"
        position="right"
      >
        {panelContent}
      </SidePanel>

      {/* Status Change Confirmation Dialog */}
      <StatusChangeConfirmDialog
        isOpen={statusConfirmDialog.isOpen}
        newStatus={statusConfirmDialog.newStatus}
        onConfirm={handleStatusConfirm}
        onCancel={handleStatusCancel}
      />
    </>
  );
};

export default EditOpportunityPanel;