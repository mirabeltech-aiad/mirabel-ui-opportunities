import React from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { getSectionColorClass } from "./sectionColors";

const SearchAccordion = ({ 
  items, 
  openAccordions, 
  onAccordionChange, 
  onSearch,
  handleInputChange, 
  handleSelectChange 
}) => {
  // If items are provided, render dynamic accordion
  if (items) {
    return (
      <div className="mt-4">
        <Accordion type="multiple" value={openAccordions} onValueChange={onAccordionChange}>
          {items.map((item, index) => (
            <React.Fragment key={item.value}>
              <AccordionItem value={item.value} className="border-0">
                <AccordionTrigger className="text-blue-800">
                  <div className="flex items-center">
                    <div className={`w-1 h-6 ${getSectionColorClass(item.value)} rounded-full mr-3`}></div>
                    {item.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {item.content}
                </AccordionContent>
                <Separator className="mt-4" />
              </AccordionItem>
            </React.Fragment>
          ))}
        </Accordion>
      </div>
    );
  }

  // Legacy support for Opportunity search (hardcoded items)
  return (
    <div className="mt-4">
      <Accordion type="multiple" value={openAccordions} onValueChange={onAccordionChange}>
        {/* Step 1: Reordered by usage frequency - Sales Pipeline first (daily workflow) */}
        <AccordionItem value="sales-pipeline" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className={`w-1 h-6 ${getSectionColorClass("sales-pipeline")} rounded-full mr-3`}></div>
              Sales Pipeline & Process
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {/* This will be handled by the dynamic items approach */}
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>

        {/* Financial data moved up - key business metrics */}
        <AccordionItem value="financial-commercial" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className={`w-1 h-6 ${getSectionColorClass("financial-commercial")} rounded-full mr-3`}></div>
              Financial & Commercial Terms
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {/* This will be handled by the dynamic items approach */}
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>

        {/* Opportunity Details - core opportunity data */}
        <AccordionItem value="opportunity-details" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className={`w-1 h-6 ${getSectionColorClass("opportunity-details")} rounded-full mr-3`}></div>
              Opportunity Details
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {/* This will be handled by the dynamic items approach */}
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>

        {/* Account & Company - good position for customer info */}
        <AccordionItem value="account-company" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className={`w-1 h-6 ${getSectionColorClass("account-company")} rounded-full mr-3`}></div>
              Account & Company Information
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {/* This will be handled by the dynamic items approach */}
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>

        {/* Contact Information - stakeholder details */}
        <AccordionItem value="contact-info" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className={`w-1 h-6 ${getSectionColorClass("contact-info")} rounded-full mr-3`}></div>
              Contact Information
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {/* This will be handled by the dynamic items approach */}
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>
        
        {/* Product & Solution - technical details, less frequently searched */}
        <AccordionItem value="product-solution" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className={`w-1 h-6 ${getSectionColorClass("product-solution")} rounded-full mr-3`}></div>
              Product & Solution Details
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {/* This will be handled by the dynamic items approach */}
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>

        {/* Geographic - keep last for filtering/reporting */}
        <AccordionItem value="geographic-territory" className="border-0">
          <AccordionTrigger className="text-blue-800">
            <div className="flex items-center">
              <div className={`w-1 h-6 ${getSectionColorClass("geographic-territory")} rounded-full mr-3`}></div>
              Geographic & Territory
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {/* This will be handled by the dynamic items approach */}
          </AccordionContent>
          <Separator className="mt-4" />
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SearchAccordion;
