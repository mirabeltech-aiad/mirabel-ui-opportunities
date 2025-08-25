import React, { useState, useEffect } from "react";
import { Search, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import apiService from "@/features/Opportunity/Services/apiService";
import { API_URLS } from "@/utils";

const OpportunitySearchBar = ({
  onSearch,
  onCustomerSelect,
  placeholder = "Type to search customers...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const inputRef = React.useRef(null);
  const suppressSearchRef = React.useRef(false);
  const MIN_CHARS = 3;

  // Enhanced error handling for customer search
  const parseSearchError = (error) => {
    console.error("Customer Search Error:", error);

    // Network or connection errors
    if (!error.response && error.code) {
      switch (error.code) {
        case "NETWORK_ERROR":
          return {
            message:
              "Network connection failed. Please check your internet connection.",
            isRetryable: true,
            type: "network",
          };
        case "TIMEOUT":
          return {
            message: "Search request timed out. Please try again.",
            isRetryable: true,
            type: "timeout",
          };
        default:
          return {
            message: "Connection failed. Please try again.",
            isRetryable: true,
            type: "connection",
          };
      }
    }

    // HTTP status based errors
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          return {
            message:
              "Invalid search criteria. Please try a different search term.",
            isRetryable: false,
            type: "validation",
          };
        case 401:
          return {
            message: "Session expired. Please refresh the page.",
            isRetryable: false,
            type: "auth",
          };
        case 403:
          return {
            message: "You do not have permission to search customers.",
            isRetryable: false,
            type: "permission",
          };
        case 500:
          return {
            message: "Server error occurred. Please try again.",
            isRetryable: true,
            type: "server",
          };
        default:
          return {
            message: "Search failed. Please try again.",
            isRetryable: status >= 500,
            type: "unknown",
          };
      }
    }

    // Generic fallback
    return {
      message: error.message || "Search failed. Please try again.",
      isRetryable: true,
      type: "generic",
    };
  };

  // Search customers based on search term
  const searchCustomers = async (searchText) => {


    if (!searchText || searchText.length < MIN_CHARS) {
  
      setCustomers([]);
      //setOpen(true); // open to show min characters message
      return;
    }

    try {
      setIsLoading(true);
      setSearchError(null);
      console.log("OpportunitySearchBar: Making API call...");

      // Use hardcoded user ID like the working CustomerSearchField
      const response = await apiService.post(
        API_URLS.CONTACTS.DISTINCT_CUSTOMERS,        
        searchText
      );
    
      if (!response) {
        throw new Error("No response received from server");
      }

      // Handle the specific API response structure
      if (
        response &&
        response.content &&
        response.content.Status === "Success" &&
        response.content.JSONContent
      ) {
       

        try {
          const parsedData = JSON.parse(response.content.JSONContent);
        
          if (Array.isArray(parsedData) && parsedData.length > 0) {
           

            const customerList = parsedData.map((customer, index) => {
              const isPrimary =
                customer.PrimaryContact === 1 ||
                customer.PrimaryContact === "1" ||
                customer.PrimaryContact === true;
              const primaryContactText = isPrimary ? " - Primary" : "";

              return {
                id: customer.ID,
                company: customer.Company || "Unknown Company",
                firstName: customer.FirstName || "Unknown Contact",
                primaryContact: customer.PrimaryContact,
                displayLabel: `${customer.Company || "Unknown Company"} (${
                  customer.FirstName || "Unknown Contact"
                }${primaryContactText})`,
                value: customer.ID?.toString() || `customer-${index}`,
              };
            });

            setCustomers(customerList);
            setOpen(true);
          } else {
            console.log(
              "OpportunitySearchBar: No customers found for search term"
            );
            setCustomers([]);
            setOpen(true); // Still open to show "no results"
          }
        } catch (parseError) {
          console.error(
            "OpportunitySearchBar: Error parsing JSONContent:",
            parseError
          );
          throw new Error("Invalid response format from server");
        }
      } else if (
        response &&
        response.content &&
        response.content.Status === "Error"
      ) {
        throw new Error(response.content.Message || "Server returned an error");
      } else {
        console.warn(
          "OpportunitySearchBar: Invalid response structure:",
          response
        );
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("OpportunitySearchBar: Search customers error:", error);
      const errorInfo = parseSearchError(error);
      setSearchError(errorInfo);
      setCustomers([]);
      setOpen(true); // Show error state
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  // Debounced search - search automatically as user types (but not when just editing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Do not auto-search during selection commit cycle
      if (suppressSearchRef.current) return;

      if (searchTerm && searchTerm.length >= MIN_CHARS) {
        // If a customer is selected and the input equals the selected company, do not re-search
        if (selectedCustomer && searchTerm === selectedCustomer.company) {
          return;
        }

        const isAddingChars = searchTerm.length > lastSearchTerm.length;
        const isDifferentTerm = searchTerm !== lastSearchTerm;

        if (isDifferentTerm && (isAddingChars || !isEditing)) {
          searchCustomers(searchTerm);
          setLastSearchTerm(searchTerm);
        }
      } else if (searchTerm.length < MIN_CHARS) {
        setCustomers([]);
        //setOpen(true); // open to show hint message
        setHasSearched(false);
        setLastSearchTerm("");
      }
    }, 400); // Slightly longer debounce to avoid flicker

    return () => clearTimeout(timeoutId);
  }, [searchTerm, lastSearchTerm, isEditing, selectedCustomer]);

  const handleCustomerSelect = (customer) => {
    console.log("OpportunitySearchBar: Customer selected:", customer);

    // Set the selected customer and update the search term to show selection
    suppressSearchRef.current = true; // prevent debounce from firing a new search
    setSelectedCustomer(customer);
    setSearchTerm(customer.company); // Use company name only, not full display label
    setOpen(false);
    setCustomers([]); // clear results so dropdown won't re-open on focus
    setHasSearched(false); // Prevent further searching after selection
    setIsEditing(false); // Reset editing state
    setLastSearchTerm(customer.company); // Set last search term to prevent re-searching

    // Keep focus on input after selection
    setTimeout(() => {
      // Do not immediately focus to avoid reopening; blur first to commit selection
      inputRef.current?.blur();
      suppressSearchRef.current = false;
      // Re-focus after a short delay only if user clicks back
    }, 0);

    // Pass the complete customer data with both name and ID to parent component
    if (onCustomerSelect) {
      onCustomerSelect({
        id: customer.id,
        name: customer.company,
        contactName: customer.firstName,
        displayLabel: customer.displayLabel,
        primaryContact: customer.primaryContact,
      });
    }

    if (onSearch) {
      onSearch(customer.company); // Use company name, not full display label
    }
  };

  const handleInputChange = (value) => {
    console.log("OpportunitySearchBar: Input changed to:", value);

    // Track if user is editing (removing characters) vs typing new content
    const isRemoving = value.length < searchTerm.length;
    setIsEditing(isRemoving && selectedCustomer !== null);

    setSearchTerm(value);

    // Clear previous errors and selections when user starts typing
    setSearchError(null);

    // Clear selection if user starts typing again
    if (selectedCustomer && value !== selectedCustomer.company) {
      setSelectedCustomer(null);
      if (onCustomerSelect) {
        onCustomerSelect(null); // Clear selection in parent
      }
    }

    if (!value) {
      setSelectedCustomer(null);
      setSearchError(null);
      setOpen(false); // Close dropdown when input is empty
      setHasSearched(false);
      setIsEditing(false);
      if (onCustomerSelect) {
        onCustomerSelect(null);
      }
    }
  };

  const handleInputFocus = () => {
    // Open if we have results or to display min-length message while typing
    if (
      customers.length > 0 ||
      (searchTerm.length > 0 && searchTerm.length < MIN_CHARS)
    ) {
      setOpen(true);
    }
  };

  const handleInputClick = () => {
    handleInputFocus();
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleRetrySearch = () => {
    if (searchTerm && searchTerm.length >= MIN_CHARS) {
      searchCustomers(searchTerm);
    }
  };

  // Close dropdown when clicking outside (but maintain input focus)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("customer-search-dropdown");
      const input = document.getElementById("customer-search-input");

      if (
        dropdown &&
        input &&
        !dropdown.contains(event.target) &&
        !input.contains(event.target)
      ) {
        setOpen(false);
        // Don't blur the input - let user continue typing
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Ensure customers is always an array to prevent iteration errors
  const safeCustomers = Array.isArray(customers) ? customers : [];
  console.log(
    "OpportunitySearchBar: Rendering with",
    safeCustomers.length,
    "safe customers"
  );

  return (
    <div className="w-full mb-6 relative">
      <div className="relative">
        <Input
          ref={inputRef}
          id="customer-search-input"
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          onBlur={(e) => {
            // Keep focus if user is interacting with dropdown
            const dropdown = document.getElementById(
              "customer-search-dropdown"
            );
            if (dropdown && dropdown.contains(e.relatedTarget)) {
              e.preventDefault();
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }}
          className="w-full pr-10"
          disabled={isLoading}
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          ) : searchError ? (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          ) : (
            <Search className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </div>

      {/* Dropdown positioned absolutely */}
      {open && (
        <div
          id="customer-search-dropdown"
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center">
              <Loader2 className="mx-auto h-4 w-4 animate-spin mb-2" />
              <div className="text-sm text-gray-500">
                Searching customers...
              </div>
            </div>
          )}

          {/* Error State with Retry */}
          {searchError && !isLoading && (
            <div className="p-4">
              <Alert variant="destructive" className="mb-3">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <div className="font-medium">{searchError.message}</div>
                  {searchError.isRetryable && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetrySearch}
                      className="mt-2 h-7"
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Try Again
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* No Results Message */}
          {!searchError &&
            !isLoading &&
            safeCustomers.length === 0 &&
            hasSearched &&
            searchTerm.length >= 2 && (
              <div className="p-4 text-center text-gray-500">
                <div className="text-sm">
                  No customers found for "{searchTerm}"
                </div>
                <div className="text-xs mt-1">
                  Try searching with a different term
                </div>
              </div>
            )}

          {/* Minimum characters message */}
          {!isLoading &&
            !hasSearched &&
            searchTerm.length > 0 &&
            searchTerm.length < MIN_CHARS && (
              <div className="p-4 text-center text-gray-500">
                <div className="text-sm">
                  Search phrase cannot be less than three characters.
                </div>
              </div>
            )}

          {/* Customer List */}
          {!isLoading && safeCustomers.length > 0 && (
            <div className="py-2">
              {safeCustomers.map((customer) => (
                <div
                  key={customer.value}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCustomerSelect(customer);
                  }}
                  onMouseDown={(e) => {
                    // Prevent focus loss when clicking dropdown items
                    e.preventDefault();
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCustomer?.value === customer.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {customer.company}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({customer.firstName})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpportunitySearchBar;
