import React from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import CustomerInfoFields from "./CustomerInfoFields";
import FinancialDataFields from "./FinancialDataFields";
import OpportunityDetailsFields from "./OpportunityDetailsFields";
import ProductDetailsFields from "./ProductDetailsFields";
import ContactDetailsFields from "./ContactDetailsFields";
import LocationDetailsFields from "./LocationDetailsFields";
import SalesProcessFields from "./SalesProcessFields";

const SearchAccordion = ({ handleInputChange, handleSelectChange, openAccordions, onValueChange }) => {
  return (
    <div className="mt-4">
      <Accordion type="multiple" value={openAccordions} onValueChange={onValueChange}>
        {/* Step 1: Reordered by usage frequency - Sales Pipeline first (daily workflow) */}
        <AccordionItem value="sales-pipeline" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
              Sales Pipeline & Process
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SalesProcessFields 
              handleInputChange={handleInputChange} 
              handleSelectChange={handleSelectChange} 
            />
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>

        {/* Financial data moved up - key business metrics */}
        <AccordionItem value="financial-commercial" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-yellow-500 rounded-full mr-3"></div>
              Financial & Commercial Terms
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <FinancialDataFields 
              handleInputChange={handleInputChange} 
              handleSelectChange={handleSelectChange} 
            />
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>

        {/* Opportunity Details - core opportunity data */}
        <AccordionItem value="opportunity-details" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
              Opportunity Details
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <OpportunityDetailsFields 
              handleInputChange={handleInputChange} 
              handleSelectChange={handleSelectChange} 
            />
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>

        {/* Account & Company - good position for customer info */}
        <AccordionItem value="account-company" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
              Account & Company Information
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CustomerInfoFields 
              handleInputChange={handleInputChange} 
              handleSelectChange={handleSelectChange} 
            />
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>

        {/* Contact Information - stakeholder details */}
        <AccordionItem value="contact-info" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-pink-500 rounded-full mr-3"></div>
              Contact Information
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ContactDetailsFields 
              handleInputChange={handleInputChange} 
              handleSelectChange={handleSelectChange} 
            />
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>
        
        {/* Product & Solution - technical details, less frequently searched */}
        <AccordionItem value="product-solution" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
              Product & Solution Details
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ProductDetailsFields 
              handleInputChange={handleInputChange} 
              handleSelectChange={handleSelectChange} 
            />
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>

        {/* Geographic - keep last for filtering/reporting */}
        <AccordionItem value="geographic-territory" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-red-500 rounded-full mr-3"></div>
              Geographic & Territory
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <LocationDetailsFields 
              handleInputChange={handleInputChange} 
              handleSelectChange={handleSelectChange} 
            />
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SearchAccordion;
