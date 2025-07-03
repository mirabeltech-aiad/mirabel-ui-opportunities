
import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@OpportunityComponents/ui/accordion";
import { Toggle } from "@OpportunityComponents/ui/toggle";
import { Maximize2, Minimize2 } from "lucide-react";
import ProposalBasicInfoSection from "./ProposalBasicInfoSection";
import ProposalStatusProgressSection from "./ProposalStatusProgressSection";
import ProposalFinancialSection from "./ProposalFinancialSection";
import ProposalCompanyDetailsSection from "./ProposalCompanyDetailsSection";
import ProposalTeamAssignmentSection from "./ProposalTeamAssignmentSection";
import ProposalDeliverySection from "./ProposalDeliverySection";
import ProposalAdditionalInfoSection from "./ProposalAdditionalInfoSection";

const EditProposalAccordion = ({ 
  formData, 
  handleInputChange, 
  statusOptions, 
  stageOptions, 
  typeOptions,
  priorityOptions, 
  industryOptions, 
  companySizeOptions, 
  timeframeOptions, 
  territoryOptions, 
  stateOptions, 
  businessUnitOptions, 
  productOptions,
  repOptions 
}) => {
  const [openItems, setOpenItems] = useState(["basic-info", "status-progress", "financial"]);
  const [isExpanded, setIsExpanded] = useState(false);

  const allItems = [
    "basic-info", 
    "status-progress", 
    "financial", 
    "team-assignment",
    "company-details", 
    "delivery", 
    "additional-info"
  ];

  const toggleExpandCollapse = () => {
    if (isExpanded) {
      setOpenItems([]);
      setIsExpanded(false);
    } else {
      setOpenItems(allItems);
      setIsExpanded(true);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-start mb-4">
        <Toggle
          pressed={isExpanded}
          onPressedChange={toggleExpandCollapse}
          aria-label={isExpanded ? "Collapse all sections" : "Expand all sections"}
          className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 hover:bg-blue-50"
        >
          {isExpanded ? (
            <>
              <Minimize2 className="h-4 w-4 mr-2" />
              Collapse All
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4 mr-2" />
              Expand All
            </>
          )}
        </Toggle>
      </div>

      <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="w-full">
        <AccordionItem value="basic-info">
          <AccordionTrigger className="text-left text-blue-800">Basic Information</AccordionTrigger>
          <AccordionContent>
            <ProposalBasicInfoSection 
              formData={formData} 
              handleInputChange={handleInputChange}
              stateOptions={stateOptions}
              typeOptions={typeOptions}
              businessUnitOptions={businessUnitOptions}
              productOptions={productOptions}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="status-progress">
          <AccordionTrigger className="text-left text-blue-800">Status & Progress</AccordionTrigger>
          <AccordionContent>
            <ProposalStatusProgressSection 
              formData={formData} 
              handleInputChange={handleInputChange}
              statusOptions={statusOptions}
              stageOptions={stageOptions}
              priorityOptions={priorityOptions}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="financial">
          <AccordionTrigger className="text-left text-blue-800">Financial Information</AccordionTrigger>
          <AccordionContent>
            <ProposalFinancialSection 
              formData={formData} 
              handleInputChange={handleInputChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="team-assignment">
          <AccordionTrigger className="text-left text-blue-800">Team Assignment</AccordionTrigger>
          <AccordionContent>
            <ProposalTeamAssignmentSection 
              formData={formData} 
              handleInputChange={handleInputChange}
              repOptions={repOptions}
              territoryOptions={territoryOptions}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="company-details">
          <AccordionTrigger className="text-left text-blue-800">Company & Contact Details</AccordionTrigger>
          <AccordionContent>
            <ProposalCompanyDetailsSection 
              formData={formData} 
              handleInputChange={handleInputChange}
              industryOptions={industryOptions}
              companySizeOptions={companySizeOptions}
              stateOptions={stateOptions}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery">
          <AccordionTrigger className="text-left text-blue-800">Delivery & Implementation</AccordionTrigger>
          <AccordionContent>
            <ProposalDeliverySection 
              formData={formData} 
              handleInputChange={handleInputChange}
              timeframeOptions={timeframeOptions}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="additional-info">
          <AccordionTrigger className="text-left text-blue-800">Additional Information</AccordionTrigger>
          <AccordionContent>
            <ProposalAdditionalInfoSection 
              formData={formData} 
              handleInputChange={handleInputChange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default EditProposalAccordion;
