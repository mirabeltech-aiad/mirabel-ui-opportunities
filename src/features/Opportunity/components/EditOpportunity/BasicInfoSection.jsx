import React from "react";
import BasicFieldsGroup from "./BasicInfo/BasicFieldsGroup";
import ContactSelectionGroup from "./BasicInfo/ContactSelectionGroup";
import BusinessInfoGroup from "./BasicInfo/BusinessInfoGroup";
import TeamAssignmentGroup from "./BasicInfo/TeamAssignmentGroup";
import NotesSection from "./BasicInfo/NotesSection";
import { useBasicInfoData } from "./BasicInfo/useBasicInfoData";
import { useBasicInfoHandlers } from "./BasicInfo/useBasicInfoHandlers";
import { OPPORTUNITY_OPTIONS } from "../../constants/opportunityOptions";

const BasicInfoSection = ({
  formData,
  handleInputChange,
  handleBatchInputChange,
  opportunityOptions,
  opportunityId,
  isAddMode,
  isCustomerSelected,
  getFieldError,
  hasSubmitted,
  probabilityOptions, // Add this line
  isStageDisabled, // Add stage disabled prop
  isProbabilityDisabled, // Add probability disabled prop
  onApiStagesLoaded, // Add callback to pass apiStages up
  isProposalLinkedFieldsDisabled, // Add proposal linked disabled prop
}) => {
 
  const {
    apiOpportunityTypes,
    apiStages,
    businessUnitOptionsToUse,
    productOptionsToUse,
    userOptionsToUse,
    contactOptions,
    apiLossReasons,
    addModeStatusOptions,
    isLoadingOpportunityTypes,
    isLoadingStages,
    isLoadingBusinessUnits,
    isLoadingProducts,
    isLoadingUsers,
    isLoadingContacts,
    isLoadingLossReasons,
    shouldDisableFields,
    shouldDisableProposalLinkedFields,
  } = useBasicInfoData(
    formData,
    isAddMode,
    isCustomerSelected,
    isProposalLinkedFieldsDisabled
  );
  
  // Pass apiStages up to parent when loaded
  React.useEffect(() => {
    
    if (onApiStagesLoaded && apiStages && apiStages.length > 0) {
      onApiStagesLoaded(apiStages);
    }
  }, [apiStages, onApiStagesLoaded]);

  const {
    handleOpportunityTypeChange,
    handleStageChange,
    handleBusinessUnitChange,
    handleProductChange,
    handleAssignedRepChange,
    handleSalesPresenterChange,
    handleLossReasonChange,
    handleContactNameChange,
  } = useBasicInfoHandlers(
    handleInputChange,
    handleBatchInputChange,
    businessUnitOptionsToUse,
    apiOpportunityTypes,
    productOptionsToUse,
    userOptionsToUse,
    apiLossReasons,
    apiStages,
    contactOptions
  );

  return (
    <div className="space-y-6">
      {/* Three-column adaptive grid with content-aware sizing */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Row 1: Name (spans 6), Company (spans 4), Status (spans 2) */}
        <div className="md:col-span-6">
          <BasicFieldsGroup
            formData={formData}
            handleInputChange={handleInputChange}
            apiOpportunityTypes={apiOpportunityTypes}
            isLoadingOpportunityTypes={isLoadingOpportunityTypes}
            apiStages={apiStages}
            isLoadingStages={isLoadingStages}
            handleOpportunityTypeChange={handleOpportunityTypeChange}
            handleStageChange={handleStageChange}
            shouldDisableFields={shouldDisableFields}
            isAddMode={isAddMode}
            addModeStatusOptions={addModeStatusOptions}
            fieldName="name"
            getFieldError={getFieldError}
            hasSubmitted={hasSubmitted}
          />
        </div>
        <div className="md:col-span-4">
          <BasicFieldsGroup
            formData={formData}
            handleInputChange={handleInputChange}
            apiOpportunityTypes={apiOpportunityTypes}
            isLoadingOpportunityTypes={isLoadingOpportunityTypes}
            apiStages={apiStages}
            isLoadingStages={isLoadingStages}
            handleOpportunityTypeChange={handleOpportunityTypeChange}
            handleStageChange={handleStageChange}
            shouldDisableFields={shouldDisableFields}
            isAddMode={isAddMode}
            addModeStatusOptions={addModeStatusOptions}
            fieldName="company"
            getFieldError={getFieldError}
            hasSubmitted={hasSubmitted}
          />
        </div>
        <div className="md:col-span-2">
          <BasicFieldsGroup
            formData={formData}
            handleInputChange={handleInputChange}
            apiOpportunityTypes={apiOpportunityTypes}
            isLoadingOpportunityTypes={isLoadingOpportunityTypes}
            apiStages={apiStages}
            isLoadingStages={isLoadingStages}
            handleOpportunityTypeChange={handleOpportunityTypeChange}
            handleStageChange={handleStageChange}
            shouldDisableFields={shouldDisableFields}
            isAddMode={isAddMode}
            addModeStatusOptions={addModeStatusOptions}
            fieldName="status"
            getFieldError={getFieldError}
            hasSubmitted={hasSubmitted}
          />
        </div>

        {/* Row 2: Contact (spans 4), Stage (spans 4), Amount (spans 2), Probability (spans 2) */}
        <div className="md:col-span-4">
          <ContactSelectionGroup
            formData={formData}
            handleInputChange={handleInputChange}
            contactOptions={contactOptions}
            isLoadingContacts={isLoadingContacts}
            handleContactNameChange={handleContactNameChange}
            shouldDisableFields={shouldDisableFields}
            isAddMode={isAddMode}
          />
        </div>
        <div className="md:col-span-4">
          <BasicFieldsGroup
            formData={formData}
            handleInputChange={handleInputChange}
            apiOpportunityTypes={apiOpportunityTypes}
            isLoadingOpportunityTypes={isLoadingOpportunityTypes}
            apiStages={apiStages}
            isLoadingStages={isLoadingStages}
            handleOpportunityTypeChange={handleOpportunityTypeChange}
            handleStageChange={handleStageChange}
            shouldDisableFields={shouldDisableFields}
            isAddMode={isAddMode}
            addModeStatusOptions={addModeStatusOptions}
            fieldName="stage"
            getFieldError={getFieldError}
            hasSubmitted={hasSubmitted}
            isStageDisabled={isStageDisabled}
          />
        </div>
        <div className="md:col-span-2">
          <BasicFieldsGroup
            formData={formData}
            handleInputChange={handleInputChange}
            apiOpportunityTypes={apiOpportunityTypes}
            isLoadingOpportunityTypes={isLoadingOpportunityTypes}
            apiStages={apiStages}
            isLoadingStages={isLoadingStages}
            handleOpportunityTypeChange={handleOpportunityTypeChange}
            handleStageChange={handleStageChange}
            shouldDisableFields={shouldDisableFields}
            shouldDisableProposalLinkedFields={
              shouldDisableProposalLinkedFields
            }
            isAddMode={isAddMode}
            addModeStatusOptions={addModeStatusOptions}
            fieldName="amount"
            getFieldError={getFieldError}
            hasSubmitted={hasSubmitted}
          />
        </div>
        <div className="md:col-span-2">
          <BasicFieldsGroup
            formData={formData}
            handleInputChange={handleInputChange}
            apiOpportunityTypes={apiOpportunityTypes}
            isLoadingOpportunityTypes={isLoadingOpportunityTypes}
            apiStages={apiStages}
            isLoadingStages={isLoadingStages}
            handleOpportunityTypeChange={handleOpportunityTypeChange}
            handleStageChange={handleStageChange}
            shouldDisableFields={shouldDisableFields}
            isAddMode={isAddMode}
            addModeStatusOptions={addModeStatusOptions}
            fieldName="probability"
            probabilityOptions={OPPORTUNITY_OPTIONS.probability}
            getFieldError={getFieldError}
            hasSubmitted={hasSubmitted}
            isProbabilityDisabled={isProbabilityDisabled}
          />
        </div>

        {/* Row 3: Opportunity Type (spans 4), Business Unit (spans 4), Product (spans 4) */}
        <div className="md:col-span-4">
          <BasicFieldsGroup
            formData={formData}
            handleInputChange={handleInputChange}
            apiOpportunityTypes={apiOpportunityTypes}
            isLoadingOpportunityTypes={isLoadingOpportunityTypes}
            apiStages={apiStages}
            isLoadingStages={isLoadingStages}
            handleOpportunityTypeChange={handleOpportunityTypeChange}
            handleStageChange={handleStageChange}
            shouldDisableFields={shouldDisableFields}
            isAddMode={isAddMode}
            addModeStatusOptions={addModeStatusOptions}
            fieldName="opportunityType"
            getFieldError={getFieldError}
            hasSubmitted={hasSubmitted}
          />
        </div>
        <div className="md:col-span-4">
          <BusinessInfoGroup
            key="businessUnit"
            formData={formData}
            isAddMode={isAddMode}
            handleInputChange={handleInputChange}
            businessUnitOptionsToUse={businessUnitOptionsToUse}
            productOptionsToUse={productOptionsToUse}
            isLoadingBusinessUnits={isLoadingBusinessUnits}
            isLoadingProducts={isLoadingProducts}
            handleBusinessUnitChange={handleBusinessUnitChange}
            handleProductChange={handleProductChange}
            shouldDisableFields={shouldDisableFields}
            shouldDisableProposalLinkedFields={shouldDisableProposalLinkedFields(
              "businessUnit"
            )}
            fieldName="businessUnit"
          />
        </div>
        <div className="md:col-span-4">
          <BusinessInfoGroup
            key="product"
            formData={formData}
            handleInputChange={handleInputChange}
            businessUnitOptionsToUse={businessUnitOptionsToUse}
            productOptionsToUse={productOptionsToUse}
            isLoadingBusinessUnits={isLoadingBusinessUnits}
            isLoadingProducts={isLoadingProducts}
            handleBusinessUnitChange={handleBusinessUnitChange}
            handleProductChange={handleProductChange}
            shouldDisableFields={shouldDisableFields}
            shouldDisableProposalLinkedFields={shouldDisableProposalLinkedFields(
              "product"
            )}
            fieldName="product"
          />
        </div>

        {/* Row 4: Campaign Source (spans 4), Close Date (spans 3), Assigned Rep (spans 5) */}
        <div className="md:col-span-4">
          <BusinessInfoGroup
            key="primaryCampaignSource"
            formData={formData}
            handleInputChange={handleInputChange}
            businessUnitOptionsToUse={businessUnitOptionsToUse}
            productOptionsToUse={productOptionsToUse}
            isLoadingBusinessUnits={isLoadingBusinessUnits}
            isLoadingProducts={isLoadingProducts}
            handleBusinessUnitChange={handleBusinessUnitChange}
            handleProductChange={handleProductChange}
            shouldDisableFields={shouldDisableFields}
            fieldName="primaryCampaignSource"
          />
        </div>
        <div className="md:col-span-3">
          <BusinessInfoGroup
            key="projCloseDate"
            formData={formData}
            handleInputChange={handleInputChange}
            businessUnitOptionsToUse={businessUnitOptionsToUse}
            productOptionsToUse={productOptionsToUse}
            isLoadingBusinessUnits={isLoadingBusinessUnits}
            isLoadingProducts={isLoadingProducts}
            handleBusinessUnitChange={handleBusinessUnitChange}
            handleProductChange={handleProductChange}
            shouldDisableFields={shouldDisableFields}
            fieldName="projCloseDate"
            getFieldError={getFieldError}
            hasSubmitted={hasSubmitted}
          />
        </div>
        <div className="md:col-span-5">
          <TeamAssignmentGroup
            formData={formData}
            handleInputChange={handleInputChange}
            userOptionsToUse={userOptionsToUse}
            apiLossReasons={apiLossReasons}
            isLoadingUsers={isLoadingUsers}
            isLoadingLossReasons={isLoadingLossReasons}
            handleAssignedRepChange={handleAssignedRepChange}
            handleSalesPresenterChange={handleSalesPresenterChange}
            handleLossReasonChange={handleLossReasonChange}
            shouldDisableFields={shouldDisableFields}
            fieldName="assignedRep"
          />
        </div>

        {/* Row 5: Sales Rep (spans 4), Loss Reason (spans 4), Forecast Revenue (spans 4) */}
        <div className="md:col-span-4">
          <TeamAssignmentGroup
            formData={formData}
            handleInputChange={handleInputChange}
            userOptionsToUse={userOptionsToUse}
            apiLossReasons={apiLossReasons}
            isLoadingUsers={isLoadingUsers}
            isLoadingLossReasons={isLoadingLossReasons}
            handleAssignedRepChange={handleAssignedRepChange}
            handleSalesPresenterChange={handleSalesPresenterChange}
            handleLossReasonChange={handleLossReasonChange}
            shouldDisableFields={shouldDisableFields}
            fieldName="salesPresentation"
          />
        </div>
        <div className="md:col-span-4">
          <TeamAssignmentGroup
            formData={formData}
            handleInputChange={handleInputChange}
            userOptionsToUse={userOptionsToUse}
            apiLossReasons={apiLossReasons}
            isLoadingUsers={isLoadingUsers}
            isLoadingLossReasons={isLoadingLossReasons}
            handleAssignedRepChange={handleAssignedRepChange}
            handleSalesPresenterChange={handleSalesPresenterChange}
            handleLossReasonChange={handleLossReasonChange}
            shouldDisableFields={shouldDisableFields}
            fieldName="lostReason"
          />
        </div>
        <div className="md:col-span-4">
          <TeamAssignmentGroup
            formData={formData}
            handleInputChange={handleInputChange}
            userOptionsToUse={userOptionsToUse}
            apiLossReasons={apiLossReasons}
            isLoadingUsers={isLoadingUsers}
            isLoadingLossReasons={isLoadingLossReasons}
            handleAssignedRepChange={handleAssignedRepChange}
            handleSalesPresenterChange={handleSalesPresenterChange}
            handleLossReasonChange={handleLossReasonChange}
            shouldDisableFields={shouldDisableFields}
            fieldName="forecastRevenue"
          />
        </div>

        {/* Row 6: Created By (spans 4), Created Date (spans 3) */}
        <div className="md:col-span-4">
          <TeamAssignmentGroup
            formData={formData}
            handleInputChange={handleInputChange}
            userOptionsToUse={userOptionsToUse}
            apiLossReasons={apiLossReasons}
            isLoadingUsers={isLoadingUsers}
            isLoadingLossReasons={isLoadingLossReasons}
            handleAssignedRepChange={handleAssignedRepChange}
            handleSalesPresenterChange={handleSalesPresenterChange}
            handleLossReasonChange={handleLossReasonChange}
            shouldDisableFields={shouldDisableFields}
            fieldName="createdBy"
            getFieldError={getFieldError}
            hasSubmitted={hasSubmitted}
          />
        </div>
        <div className="md:col-span-3">
          <TeamAssignmentGroup
            formData={formData}
            handleInputChange={handleInputChange}
            userOptionsToUse={userOptionsToUse}
            apiLossReasons={apiLossReasons}
            isLoadingUsers={isLoadingUsers}
            isLoadingLossReasons={isLoadingLossReasons}
            handleAssignedRepChange={handleAssignedRepChange}
            handleSalesPresenterChange={handleSalesPresenterChange}
            handleLossReasonChange={handleLossReasonChange}
            shouldDisableFields={shouldDisableFields}
            fieldName="createdDate"
            getFieldError={getFieldError}
            hasSubmitted={hasSubmitted}
          />
        </div>

        {/* Notes Section - Full width */}
        <div className="md:col-span-12">
          <NotesSection
            formData={formData}
            handleInputChange={handleInputChange}
            shouldDisableFields={shouldDisableFields}
            getFieldError={getFieldError}
            hasSubmitted={hasSubmitted}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
