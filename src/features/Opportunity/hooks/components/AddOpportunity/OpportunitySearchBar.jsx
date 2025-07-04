import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import apiService from "@/features/Opportunity/Services/apiService";
import { userId } from "@/services/httpClient";

const OpportunitySearchBar = ({ onSearch, onCustomerSelect, placeholder = "Search opportunities..." }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSearch = async () => {
    console.log('🔍 OpportunitySearchBar: handleSearch called with searchTerm:', searchTerm);
    
    if (!searchTerm || searchTerm.length < 2) {
      console.log('OpportunitySearchBar: Search term too short, clearing customers');
      setCustomers([]);
      setOpen(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('OpportunitySearchBar: Making API call...');
      
      const response = await apiService.post(`/services/crm/contacts/GetDistinctCustomers/${userId}/false/false/false/false`, 
        searchTerm
      );
      
      console.log('OpportunitySearchBar: Raw API response:', response);
      
      if (!response) {
        console.error('OpportunitySearchBar: No response received');
        setCustomers([]);
        setOpen(false);
        return;
      }

      if (response && response.content && response.content.Status === 'Success' && response.content.JSONContent) {
        console.log('OpportunitySearchBar: JSONContent found:', response.content.JSONContent);
        
        try {
          const parsedData = JSON.parse(response.content.JSONContent);
          console.log('OpportunitySearchBar: Parsed JSON data:', parsedData);
          
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            console.log('OpportunitySearchBar: Processing', parsedData.length, 'customers');
            
            const customerList = parsedData.map((customer, index) => {
              console.log(`OpportunitySearchBar: Processing customer ${index}:`, customer);
              
              const isPrimary = customer.PrimaryContact === 1 || customer.PrimaryContact === "1" || customer.PrimaryContact === true;
              const primaryContactText = isPrimary ? ' - Primary' : '';
              
              return {
                id: customer.ID,
                company: customer.Company || 'Unknown Company',
                firstName: customer.FirstName || 'Unknown Contact',
                primaryContact: customer.PrimaryContact,
                displayLabel: `${customer.Company || 'Unknown Company'} (${customer.FirstName || 'Unknown Contact'}${primaryContactText})`,
                value: customer.ID?.toString() || `customer-${index}`
              };
            });
            
            console.log('OpportunitySearchBar: Final customer list:', customerList);
            setCustomers(customerList);
            setOpen(true);
          } else {
            console.warn('OpportunitySearchBar: No valid data found. Parsed data:', parsedData);
            setCustomers([]);
            setOpen(false);
          }
        } catch (parseError) {
          console.error('OpportunitySearchBar: Error parsing JSONContent:', parseError);
          console.error('OpportunitySearchBar: JSONContent that failed to parse:', response.content.JSONContent);
          setCustomers([]);
          setOpen(false);
        }
      } else {
        console.warn('OpportunitySearchBar: Invalid response structure or unsuccessful status:', {
          hasContent: !!response.content,
          status: response.content?.Status,
          hasJSONContent: !!response.content?.JSONContent
        });
        setCustomers([]);
        setOpen(false);
      }
    } catch (error) {
      console.error('OpportunitySearchBar: Network or API error:', error);
      setCustomers([]);
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerSelect = (customer) => {
    console.log('OpportunitySearchBar: Customer selected:', customer);
    
    // Set the selected customer and update the search term to show selection
    setSelectedCustomer(customer);
    setSearchTerm(customer.displayLabel);
    setOpen(false);
    setCustomers([]); // Clear the list after selection
    
    // Pass the complete customer data with both name and ID to parent component
    if (onCustomerSelect) {
      onCustomerSelect({
        id: customer.id,
        name: customer.company,
        contactName: customer.firstName,
        displayLabel: customer.displayLabel,
        primaryContact: customer.primaryContact
      });
    }
    
    if (onSearch) {
      onSearch(customer.displayLabel);
    }
  };

  const handleInputChange = (value) => {
    console.log('OpportunitySearchBar: Input changed to:', value);
    setSearchTerm(value);
    
    // Clear selection if user starts typing again
    if (selectedCustomer && value !== selectedCustomer.displayLabel) {
      setSelectedCustomer(null);
      if (onCustomerSelect) {
        onCustomerSelect(null); // Clear selection in parent
      }
    }
    
    if (!value) {
      setCustomers([]);
      setSelectedCustomer(null);
      setOpen(false);
      if (onCustomerSelect) {
        onCustomerSelect(null);
      }
    }
  };

  const handleInputClick = () => {
    // Open dropdown when clicking on input if we have customers to show
    if (customers.length > 0) {
      setOpen(true);
    }
  };

  // Ensure customers is always an array to prevent iteration errors
  const safeCustomers = Array.isArray(customers) ? customers : [];
  console.log('OpportunitySearchBar: Rendering with', safeCustomers.length, 'safe customers');

  return (
    <div className="w-full mb-6">
      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <div className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <PopoverTrigger asChild>
                <Input
                  type="text"
                  placeholder={placeholder}
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onClick={handleInputClick}
                  className={cn(
                    "pl-10 pr-4 py-2 w-full border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer",
                    selectedCustomer && "bg-blue-50 border-blue-300"
                  )}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  readOnly={false}
                />
              </PopoverTrigger>
              {selectedCustomer && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              )}
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchTerm || searchTerm.length < 2}
              className="rounded-l-none border-l-0"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          <PopoverContent 
            className="w-[var(--radix-popover-trigger-width)] p-0 mt-1 bg-white shadow-lg border border-gray-200 z-50" 
            align="start"
            side="bottom"
            sideOffset={4}
          >
            {safeCustomers.length > 0 && (
              <div className="max-h-[200px] overflow-y-auto">
                <div className="py-1">
                  {safeCustomers.map((customer) => (
                    <div
                      key={customer.value}
                      onClick={() => handleCustomerSelect(customer)}
                      className="cursor-pointer hover:bg-gray-100 px-3 py-2 flex items-center transition-colors"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCustomer?.value === customer.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{customer.company}</span>
                        <span className="text-xs text-gray-500">({customer.firstName})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default OpportunitySearchBar;
