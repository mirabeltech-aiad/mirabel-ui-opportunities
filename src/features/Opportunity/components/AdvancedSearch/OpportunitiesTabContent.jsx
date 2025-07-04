
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import BasicSearchFields from "./BasicSearchFields";
import CustomerInfoFields from "./CustomerInfoFields";
import FinancialDataFields from "./FinancialDataFields";
import OpportunityDetailsFields from "./OpportunityDetailsFields";
import ProductDetailsFields from "./ProductDetailsFields";
import ContactDetailsFields from "./ContactDetailsFields";
import LocationDetailsFields from "./LocationDetailsFields";
import SalesProcessFields from "./SalesProcessFields";

const OpportunitiesTabContent = ({ 
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
            <BasicSearchFields handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sales-pipeline" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 text-blue-800 hover:no-underline">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
              Sales Pipeline & Process
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <SalesProcessFields handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="financial-commercial" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 text-blue-800 hover:no-underline">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-yellow-500 rounded-full mr-3"></div>
              Financial & Commercial Terms
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <FinancialDataFields handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="opportunity-details" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 text-blue-800 hover:no-underline">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
              Opportunity Details
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <OpportunityDetailsFields handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="account-company" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 text-blue-800 hover:no-underline">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
              Account & Company Information
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <CustomerInfoFields handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact-info" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 text-blue-800 hover:no-underline">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-pink-500 rounded-full mr-3"></div>
              Contact Information
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <ContactDetailsFields handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="product-solution" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 text-blue-800 hover:no-underline">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
              Product & Solution Details
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <ProductDetailsFields handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="geographic-territory" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 text-blue-800 hover:no-underline">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-red-500 rounded-full mr-3"></div>
              Geographic & Territory
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <LocationDetailsFields handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} searchParams={searchParams} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <button type="submit" className="hidden">Submit</button>
    </form>
  );
};

export default OpportunitiesTabContent;
