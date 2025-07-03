
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@OpportunityComponents/ui/accordion";
import ProposalsBasicSearchFields from "../ProposalsAdvancedSearch/BasicSearchFields";
import ProposalsOpportunityInfoFields from "../ProposalsAdvancedSearch/OpportunityInfoFields";
import ProposalsContactAddressInfoFields from "../ProposalsAdvancedSearch/ContactAddressInfoFields";
import ProposalsProposalInfoFields from "../ProposalsAdvancedSearch/ProposalInfoFields";

const ProposalsTabContent = ({ 
  searchParams, 
  handleInputChange, 
  handleSelectChange, 
  handleSearch, 
  openAccordions, 
  setOpenAccordions 
}) => {
  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="space-y-4">
        <AccordionItem value="primary-fields" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 text-blue-800 hover:no-underline">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
              Quick Search
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <ProposalsBasicSearchFields handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="opportunity-info" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 text-blue-800 hover:no-underline">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
              Opportunity Info
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <ProposalsOpportunityInfoFields handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact-address-info" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 text-blue-800 hover:no-underline">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-pink-500 rounded-full mr-3"></div>
              Contact/Address Info
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <ProposalsContactAddressInfoFields handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="proposal-info" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 text-blue-800 hover:no-underline">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
              Proposal Info
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <ProposalsProposalInfoFields handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <button type="submit" className="hidden">Submit</button>
    </form>
  );
};

export default ProposalsTabContent;
