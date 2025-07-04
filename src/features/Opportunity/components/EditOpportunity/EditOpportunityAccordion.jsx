
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  isAddMode = false
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
            isAddMode={isAddMode}
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
