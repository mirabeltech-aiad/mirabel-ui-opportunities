
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import apiService from "@/features/Opportunity/Services/apiService";
import { API_URLS } from "@/utils/apiUrls"; 

const CustomerSearchField = ({ onCustomerSelect }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    console.log('🔍 CustomerSearchField: handleSearch called with searchText:', searchText);
    
    if (!searchText || searchText.length < 2) {
      console.log('CustomerSearchField: Search text too short, clearing customers');
      setCustomers([]);
      return;
    }

    try {
      setIsLoading(true);
     
      
      // Use POST method like in OpportunitySearchBar
      const response = await apiService.post(API_URLS.CONTACTS.DISTINCT_CUSTOMERS, 
        searchText
      );
      
     
      
      // Handle the specific API response structure
      if (response && response.content && response.content.Status === 'Success' && response.content.JSONContent) {
        console.log('CustomerSearchField: JSONContent found:', response.content.JSONContent);
        
        try {
          const parsedData = JSON.parse(response.content.JSONContent);
           
          if (Array.isArray(parsedData)) {
            const customerList = parsedData.map((customer, index) => {
              console.log(`CustomerSearchField: Processing customer ${index}:`, customer);
              
              const isPrimary = customer.PrimaryContact === 1 || customer.PrimaryContact === "1" || customer.PrimaryContact === true;
              const primaryContactText = isPrimary ? ' - Primary' : '';
              
              return {
                value: customer.ID,
                label: `${customer.Company || 'Unknown Company'} (${customer.FirstName || 'Unknown Contact'}${primaryContactText})`,
                company: customer.Company || 'Unknown Company',
                firstName: customer.FirstName || 'Unknown Contact',
                primaryContact: customer.PrimaryContact,
                id: customer.ID
              };
            });
            
           
            setCustomers(customerList);
          } else {
            console.warn('CustomerSearchField: Parsed data is not an array:', parsedData);
            setCustomers([]);
          }
        } catch (parseError) {
          console.error('CustomerSearchField: Error parsing JSONContent:', parseError);
          console.error('CustomerSearchField: JSONContent that failed to parse:', response.content.JSONContent);
          setCustomers([]);
        }
      } else {
        console.warn('CustomerSearchField: Invalid response structure:', {
          hasContent: !!response?.content,
          status: response?.content?.Status,
          hasJSONContent: !!response?.content?.JSONContent
        });
        setCustomers([]);
      }
    } catch (error) {
      console.error('CustomerSearchField: Network or API error:', error);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (customer) => {
    console.log('CustomerSearchField: Customer selected:', customer);
    setValue(customer.value);
    setOpen(false);
    onCustomerSelect(customer);
  };

  // Ensure customers is always an array to prevent iteration errors
  const safeCustomers = Array.isArray(customers) ? customers : [];
  console.log('CustomerSearchField: Rendering with', safeCustomers.length, 'safe customers');

  return (
    <div className="relative">
      <Label className="absolute left-3 top-2 text-xs text-primary bg-background px-1">
        Search Customer
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-11 pt-6"
          >
            {value
              ? safeCustomers.find((customer) => customer.value === value)?.label
              : "Search customer..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white shadow-lg border border-gray-200 z-50">
          <Command>
            <div className="flex items-center border-b">
              <CommandInput 
                placeholder="Enter customer name..." 
                value={searchText}
                onValueChange={setSearchText}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 m-1"
                disabled={isLoading || !searchText || searchText.length < 2}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>
                  {searchText.length < 2 
                    ? "Enter at least 2 characters to search" 
                    : "No customers found. Click the search button to search."}
                </CommandEmpty>
                <CommandGroup>
                  {safeCustomers.map((customer) => (
                    <CommandItem
                      key={customer.value}
                      value={customer.value}
                      onSelect={() => handleSelect(customer)}
                      className="cursor-pointer hover:bg-gray-100 px-3 py-2"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === customer.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="text-sm font-medium">{customer.company}</span>
                      <span className="text-xs text-gray-500 ml-2">({customer.firstName})</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomerSearchField;
