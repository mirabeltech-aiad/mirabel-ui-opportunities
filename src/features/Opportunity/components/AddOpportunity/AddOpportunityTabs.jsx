
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import OpportunitySearchBar from "./OpportunitySearchBar";
import EditOpportunityAccordion from "../EditOpportunity/EditOpportunityAccordion";
import LinkedProposalsSection from "../EditOpportunity/LinkedProposalsSection";

const AddOpportunityTabs = ({ 
  formData, 
  handleInputChange, 
  opportunityOptions,
  onLinkProposal,
  onSave,
  isSaving
}) => {
  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
    // TODO: Implement search functionality
  };

  const handleCustomerSelect = (customer) => {
    console.log('Customer selected:', customer);
    
    // Update form data with selected customer information
    if (customer) {
      handleInputChange("company", customer.name || customer.company);
      handleInputChange("contactName", customer.contactName || customer.firstName);
      handleInputChange("customerId", customer.id);
      
      // Auto-populate additional fields for Add Opportunity mode
      handleInputChange("forecastRevenue", "0"); // Default forecast revenue
      handleInputChange("createdBy", "Current User"); // Default created by
      handleInputChange("createdDate", new Date().toISOString().split('T')[0]); // Current date
      
      // Store additional customer data if needed
      handleInputChange("customerData", {
        id: customer.id,
        company: customer.name || customer.company,
        firstName: customer.contactName || customer.firstName,
        primaryContact: customer.primaryContact
      });
    } else {
      // Clear customer data when selection is cleared
      handleInputChange("company", "");
      handleInputChange("contactName", "");
      handleInputChange("customerId", "");
      handleInputChange("forecastRevenue", "");
      handleInputChange("createdBy", "");
      handleInputChange("createdDate", new Date().toISOString().split('T')[0]);
      handleInputChange("customerData", null);
    }
  };

  const SaveButton = () => {
    return (
      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
        <Button
          onClick={onSave}
          className="bg-blue-500 text-white hover:bg-blue-600"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Create Opportunity
            </>
          )}
        </Button>
      </div>
    );
  };

  return (
    <Tabs defaultValue="opportunity-info" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-50 p-1 rounded-md">
        <TabsTrigger 
          value="opportunity-info"
          className="text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200"
        >
          Opportunity Info
        </TabsTrigger>
        <TabsTrigger 
          value="proposals"
          className="text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200"
        >
          Proposals
        </TabsTrigger>
      </TabsList>

      <TabsContent value="opportunity-info" className="mt-4">
        {/* Search Bar - prominently displayed at the top of Opportunity Info tab */}
        <div className="mb-6">
          <OpportunitySearchBar 
            onSearch={handleSearch}
            onCustomerSelect={handleCustomerSelect}
            placeholder="Search existing customers to link to this opportunity..."
          />
        </div>

        <EditOpportunityAccordion
          formData={formData}
          handleInputChange={handleInputChange}
          statusOptions={opportunityOptions.status}
          stageOptions={opportunityOptions.stage}
          repOptions={opportunityOptions.rep}
          sourceOptions={opportunityOptions.source}
          leadTypeOptions={opportunityOptions.leadType}
          leadStatusOptions={opportunityOptions.leadStatus}
          priorityOptions={opportunityOptions.priority}
          industryOptions={opportunityOptions.industry}
          companySizeOptions={opportunityOptions.companySize}
          timeframeOptions={opportunityOptions.timeframe}
          territoryOptions={opportunityOptions.territory}
          contractLengthOptions={opportunityOptions.contractLength}
          stateOptions={opportunityOptions.state}
          opportunityTypeOptions={opportunityOptions.opportunityType}
          businessUnitOptions={opportunityOptions.businessUnit}
          productOptions={opportunityOptions.product}
          isAddMode={true}
        />
        <SaveButton />
      </TabsContent>
      
      <TabsContent value="proposals" className="mt-4">
        <LinkedProposalsSection 
          opportunityId={null}
          opportunityData={formData}
          companyDetails={{ customerName: formData.company }}
        />
        <SaveButton />
      </TabsContent>
    </Tabs>
  );
};

export default AddOpportunityTabs;
