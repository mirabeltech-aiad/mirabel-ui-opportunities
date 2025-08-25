import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BasicInfoSection from "./BasicInfoSection";
import AdditionalInfoSection from "./AdditionalInfoSection";
import AddressSection from "./AddressSection";

const EditOpportunityAccordion = ({
  formData,
  handleInputChange,
  statusOptions,
  stageOptions,
  repOptions,
  sourceOptions,
  leadTypeOptions,
  leadStatusOptions,
  priorityOptions,
  industryOptions,
  companySizeOptions,
  timeframeOptions,
  territoryOptions,
  contractLengthOptions,
  stateOptions,
  opportunityTypeOptions,
  businessUnitOptions,
  productOptions,
  probabilityOptions, // ✅ Add this prop
  isAddMode = false,
  isCustomerSelected = false,
  getFieldError,
  hasValidationErrors,
  hasSubmitted,
  isStageDisabled, // Add stage disabled prop
  isProbabilityDisabled, // Add probability disabled prop
  onApiStagesLoaded, // Add callback to pass apiStages up
  isProposalLinkedFieldsDisabled, // Add proposal linked disabled prop
}) => {
  return (
    <Accordion type="multiple" defaultValue={["basic-info"]} className="w-full">
      <AccordionItem value="basic-info">
        <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900">
          Basic Information
        </AccordionTrigger>
        <AccordionContent>
          <BasicInfoSection
            formData={formData}
            handleInputChange={handleInputChange}
            stateOptions={stateOptions}
            opportunityTypeOptions={opportunityTypeOptions}
            businessUnitOptions={businessUnitOptions}
            productOptions={productOptions}
            probabilityOptions={probabilityOptions} // ✅ Pass probability options
            isAddMode={isAddMode}
            isCustomerSelected={isCustomerSelected}
            getFieldError={getFieldError}
            hasValidationErrors={hasValidationErrors}
            hasSubmitted={hasSubmitted}
            isStageDisabled={isStageDisabled}
            isProbabilityDisabled={isProbabilityDisabled}
            onApiStagesLoaded={onApiStagesLoaded}
            isProposalLinkedFieldsDisabled={isProposalLinkedFieldsDisabled}
          />
        </AccordionContent>
      </AccordionItem>

      {!isAddMode && (
        <AccordionItem value="additional-info">
          <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900">
            Additional Information
          </AccordionTrigger>
          <AccordionContent>
            <AdditionalInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
              statusOptions={statusOptions}
              stageOptions={stageOptions}
              repOptions={repOptions}
              sourceOptions={sourceOptions}
              leadTypeOptions={leadTypeOptions}
              leadStatusOptions={leadStatusOptions}
              priorityOptions={priorityOptions}
              industryOptions={industryOptions}
              companySizeOptions={companySizeOptions}
              timeframeOptions={timeframeOptions}
              territoryOptions={territoryOptions}
              contractLengthOptions={contractLengthOptions}
              isAddMode={isAddMode}
            />
          </AccordionContent>
        </AccordionItem>
      )}

      {!isAddMode && (
        <AccordionItem value="address-info">
          <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900">
            Address Information
          </AccordionTrigger>
          <AccordionContent>
            <AddressSection
              formData={formData}
              handleInputChange={handleInputChange}
              stateOptions={stateOptions}
            />
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};

export default EditOpportunityAccordion;
