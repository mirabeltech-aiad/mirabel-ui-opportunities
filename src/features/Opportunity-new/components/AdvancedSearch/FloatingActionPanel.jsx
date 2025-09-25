
import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { OPPORTUNITY_OPTIONS } from "@OpportunityConstants/opportunityOptions";
import { userService } from "@/features/Opportunity/Services/userService";

const FloatingActionPanel = ({ searchParams, onSearch, onClear, openAccordions, onAccordionChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [assignedRepsData, setAssignedRepsData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [businessUnitsData, setBusinessUnitsData] = useState([]);
  const [salesPresentersData, setSalesPresentersData] = useState([]);
  const [leadTypesData, setLeadTypesData] = useState([]);
  const [leadStatusData, setLeadStatusData] = useState([]);
  const [leadSourcesData, setLeadSourcesData] = useState([]);

  // Count active filters
  const activeFilterCount = Object.values(searchParams || {}).filter(
    value => value && value.toString().trim() !== ''
  ).length;

  // Get active filters for display
  const activeFilters = Object.entries(searchParams || {}).filter(
    ([key, value]) => value && value.toString().trim() !== ''
  );

  // Show floating panel when user scrolls down or has active filters
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const shouldShow = scrollTop > 50 || activeFilterCount > 0;
      setIsVisible(shouldShow);
    };

    // Check initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeFilterCount]);

  // Fetch assigned reps data for display
  useEffect(() => {
    const fetchAssignedReps = async () => {
      try {
        const reps = await userService.getOpportunityCreators();
        if (Array.isArray(reps) && reps.length > 0) {
          const validReps = reps.filter(rep => 
            rep && typeof rep === 'object' && rep.value && rep.label
          ).map(rep => ({
            value: String(rep.value || ''),
            label: String(rep.label || '')
          }));
          setAssignedRepsData(validReps);
        }
      } catch (error) {
        console.error('Failed to fetch assigned reps for FloatingActionPanel:', error);
        setAssignedRepsData([]);
      }
    };

    fetchAssignedReps();
  }, []);

  // Fetch products data for display
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await userService.getProducts();
        if (Array.isArray(products) && products.length > 0) {
          setProductsData(products);
        }
      } catch (error) {
        console.error('Failed to fetch products for FloatingActionPanel:', error);
        setProductsData([]);
      }
    };

    fetchProducts();
  }, []);

  // Fetch business units data for display
  useEffect(() => {
    const fetchBusinessUnits = async () => {
      try {
        const businessUnits = await userService.getBusinessUnits();
        if (Array.isArray(businessUnits) && businessUnits.length > 0) {
          setBusinessUnitsData(businessUnits);
        }
      } catch (error) {
        console.error('Failed to fetch business units for FloatingActionPanel:', error);
        setBusinessUnitsData([]);
      }
    };

    fetchBusinessUnits();
  }, []);

  // Fetch sales presenters data for display
  useEffect(() => {
    const fetchSalesPresenters = async () => {
      try {
        const salesPresenters = await userService.getSalesPresentations();
        if (Array.isArray(salesPresenters) && salesPresenters.length > 0) {
          setSalesPresentersData(salesPresenters);
        }
      } catch (error) {
        console.error('Failed to fetch sales presenters for FloatingActionPanel:', error);
        setSalesPresentersData([]);
      }
    };

    fetchSalesPresenters();
  }, []);

  // Fetch lead types data for display
  useEffect(() => {
    const fetchLeadTypes = async () => {
      try {
        const leadTypes = await userService.getLeadTypes();
        if (Array.isArray(leadTypes) && leadTypes.length > 0) {
          setLeadTypesData(leadTypes);
        }
      } catch (error) {
        console.error('Failed to fetch lead types for FloatingActionPanel:', error);
        setLeadTypesData([]);
      }
    };

    fetchLeadTypes();
  }, []);

  // Fetch lead status data for display
  useEffect(() => {
    const fetchLeadStatus = async () => {
      try {
        const leadStatus = await userService.getLeadStatus();
        if (Array.isArray(leadStatus) && leadStatus.length > 0) {
          setLeadStatusData(leadStatus);
        }
      } catch (error) {
        console.error('Failed to fetch lead status for FloatingActionPanel:', error);
        setLeadStatusData([]);
      }
    };

    fetchLeadStatus();
  }, []);

  // Fetch lead sources data for display
  useEffect(() => {
    const fetchLeadSources = async () => {
      try {
        const leadSources = await userService.getLeadSources();
        if (Array.isArray(leadSources) && leadSources.length > 0) {
          setLeadSourcesData(leadSources);
        }
      } catch (error) {
        console.error('Failed to fetch lead sources for FloatingActionPanel:', error);
        setLeadSourcesData([]);
      }
    };

    fetchLeadSources();
  }, []);

  // Define accordion sections with their labels
  const allSections = [
    { value: "primary-fields", label: "Quick Search" },
    { value: "sales-pipeline", label: "Sales Pipeline" },
    { value: "financial-commercial", label: "Financial Terms" },
    { value: "opportunity-details", label: "Opportunity Details" },
    { value: "account-company", label: "Account Info" },
    { value: "contact-info", label: "Contact Info" },
    { value: "product-solution", label: "Product Details" },
    { value: "geographic-territory", label: "Geographic" }
  ];

  const handleSectionToggle = (sectionValue, checked) => {
    if (checked) {
      // Add section to open accordions
      onAccordionChange([...openAccordions, sectionValue]);
    } else {
      // Remove section from open accordions
      onAccordionChange(openAccordions.filter(item => item !== sectionValue));
    }
  };

  // Handle clearing all filters and closing panel
  const handleClearAll = () => {
    onClear(); // Clear all search parameters
    onAccordionChange([]); // Close all accordions
    setIsVisible(false); // Hide the floating panel
  };

  // Format field names for display
  const formatFieldName = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Truncate long values
  const formatFieldValue = (value) => {
    const str = value.toString();
    return str.length > 20 ? `${str.substring(0, 20)}...` : str;
  };

  // Helper to get label from value for known fields
  const getLabelForValue = (key, value) => {
    // Special handling for opportunity name basic - handle predefined options
    if (key === "opportunityName") {
      if (value === "IN=Is Empty~") {
        return "Is Empty";
      }
      if (value === "INN=Is Not Empty~") {
        return "Is Not Empty";
      }
      // For custom text, handle multiple SW= values concatenated together
      if (value && value.includes('SW=')) {
        // Split by SW= and process each part
        const parts = value.split('SW=').filter(part => part.trim() !== '');
        const cleanValues = parts.map(part => {
          // Remove the trailing ~ from each part
          return part.replace(/~$/, '');
        });
        return cleanValues.join(', ');
      }
      return value;
    }

    // Special handling for opportunity name - handle predefined options
    if (key === "opportunityName") {
      if (value === "IN=Is Empty~") {
        return "Is Empty";
      }
      if (value === "INN=Is Not Empty~") {
        return "Is Not Empty";
      }
      // For custom text, handle multiple SW= values concatenated together
      if (value && value.includes('SW=')) {
        // Split by SW= and process each part
        const parts = value.split('SW=').filter(part => part.trim() !== '');
        const cleanValues = parts.map(part => {
          // Remove the trailing ~ from each part
          return part.replace(/~$/, '');
        });
        return cleanValues.join(', ');
      }
      return value;
    }

    // Special handling for assigned reps - use the fetched assignedRepsData
    if (key === "assignedRep" || key === "createdRep") {
      if (Array.isArray(assignedRepsData) && assignedRepsData.length > 0) {
        // Handle both array and single value cases
        if (Array.isArray(value)) {
          return value.map(v => {
            const found = assignedRepsData.find(rep => rep.value === v || rep.value === String(v));
            return found ? found.label : v;
          }).join(", ");
        } else {
          const found = assignedRepsData.find(rep => rep.value === value || rep.value === String(value));
          return found ? found.label : value;
        }
      }
      return value;
    }

    // Special handling for products - use the fetched productsData
    if (key === "product") {
      console.log("productsData",productsData);  
      if (Array.isArray(productsData) && productsData.length > 0) {
        // Handle both array and single value cases
        if (Array.isArray(value)) {
          return value.map(v => {
            const found = productsData.find(product => product.value === v || product.value === String(v));
            return found ? found.label : v;
          }).join(", ");
        } else {
          const found = productsData.find(product => product.value === value || product.value === String(value));
          return found ? found.label : value;
        }
      }
      return value;
    }

    // Special handling for business units - use the fetched businessUnitsData
    if (key === "businessUnit") {
      if (Array.isArray(businessUnitsData) && businessUnitsData.length > 0) {
        // Handle both array and single value cases
        if (Array.isArray(value)) {
          return value.map(v => {
            const found = businessUnitsData.find(unit => unit.value === v || unit.value === String(v));
            return found ? found.label : v;
          }).join(", ");
        } else {
          const found = businessUnitsData.find(unit => unit.value === value || unit.value === String(value));
          return found ? found.label : value;
        }
      }
      return value;
    }

    // Special handling for sales presenters - use the fetched salesPresentersData
    if (key === "salesPresenter") {
      if (Array.isArray(salesPresentersData) && salesPresentersData.length > 0) {
        // Handle both array and single value cases
        if (Array.isArray(value)) {
          return value.map(v => {
            // Extract numeric value from IE=value~ format for comparison
            const numericValue = v.replace('IE=', '').replace('~', '');
            const found = salesPresentersData.find(presenter => {
              const presenterValue = presenter.value.replace('IE=', '').replace('~', '');
              return presenterValue === numericValue;
            });
            return found ? found.label : v;
          }).join(", ");
        } else {
          // Extract numeric value from IE=value~ format for comparison
          const numericValue = value.replace('IE=', '').replace('~', '');
          const found = salesPresentersData.find(presenter => {
            const presenterValue = presenter.value.replace('IE=', '').replace('~', '');
            return presenterValue === numericValue;
          });
          return found ? found.label : value;
        }
      }
      return value;
    }

    // Special handling for lead types - use the fetched leadTypesData
    if (key === "leadType") {
      if (Array.isArray(leadTypesData) && leadTypesData.length > 0) {
        // Handle both array and single value cases
        if (Array.isArray(value)) {
          return value.map(v => {
            // Extract numeric value from IE=value~ format for comparison
            const numericValue = v.replace('IE=', '').replace('~', '');
            const found = leadTypesData.find(type => {
              const typeValue = type.value.replace('IE=', '').replace('~', '');
              return typeValue === numericValue;
            });
            return found ? found.label : v;
          }).join(", ");
        } else {
          // Extract numeric value from IE=value~ format for comparison
          const numericValue = value.replace('IE=', '').replace('~', '');
          const found = leadTypesData.find(type => {
            const typeValue = type.value.replace('IE=', '').replace('~', '');
            return typeValue === numericValue;
          });
          return found ? found.label : value;
        }
      }
      return value;
    }

    // Special handling for lead status - use the fetched leadStatusData
    if (key === "leadStatus") {
      if (Array.isArray(leadStatusData) && leadStatusData.length > 0) {
        // Handle both array and single value cases
        if (Array.isArray(value)) {
          return value.map(v => {
            // Extract numeric value from IE=value~ format for comparison
            const numericValue = v.replace('IE=', '').replace('~', '');
            const found = leadStatusData.find(status => {
              const statusValue = status.value.replace('IE=', '').replace('~', '');
              return statusValue === numericValue;
            });
            return found ? found.label : v;
          }).join(", ");
        } else {
          // Extract numeric value from IE=value~ format for comparison
          const numericValue = value.replace('IE=', '').replace('~', '');
          const found = leadStatusData.find(status => {
            const statusValue = status.value.replace('IE=', '').replace('~', '');
            return statusValue === numericValue;
          });
          return found ? found.label : value;
        }
      }
      return value;
    }

    // Special handling for lead sources - use the fetched leadSourcesData
    if (key === "leadSource") {
      if (Array.isArray(leadSourcesData) && leadSourcesData.length > 0) {
        // Handle both array and single value cases
        if (Array.isArray(value)) {
          return value.map(v => {
            // Extract numeric value from IE=value~ format for comparison
            const numericValue = v.replace('IE=', '').replace('~', '');
            const found = leadSourcesData.find(source => {
              const sourceValue = source.value.replace('IE=', '').replace('~', '');
              return sourceValue === numericValue;
            });
            return found ? found.label : v;
          }).join(", ");
        } else {
          // Extract numeric value from IE=value~ format for comparison
          const numericValue = value.replace('IE=', '').replace('~', '');
          const found = leadSourcesData.find(source => {
            const sourceValue = source.value.replace('IE=', '').replace('~', '');
            return sourceValue === numericValue;
          });
          return found ? found.label : value;
        }
      }
      return value;
    }

    // Map of field keys to their options
    const optionsMap = {
      "primaryCampaign": OPPORTUNITY_OPTIONS.source,
      "source": OPPORTUNITY_OPTIONS.source,
      "status": OPPORTUNITY_OPTIONS.status,
      "probability": OPPORTUNITY_OPTIONS.probability,
      "confidenceLevel": OPPORTUNITY_OPTIONS.confidence,
      "priority": OPPORTUNITY_OPTIONS.priority,
      "territory": OPPORTUNITY_OPTIONS.territory,
      "referral": OPPORTUNITY_OPTIONS.referral,
      "competitor": OPPORTUNITY_OPTIONS.competitor,
      "decisionCriteria": OPPORTUNITY_OPTIONS.decisionCriteria,
      "nextStep": OPPORTUNITY_OPTIONS.nextStep,
      "winReason": OPPORTUNITY_OPTIONS.winReason,
      "lossReason": OPPORTUNITY_OPTIONS.lossReason,
      "companySize": OPPORTUNITY_OPTIONS.companySize,
      "timeframe": OPPORTUNITY_OPTIONS.timeframe,
      "solution": OPPORTUNITY_OPTIONS.solution,
      // Add more mappings as needed
    };
    const options = optionsMap[key];
    if (Array.isArray(options)) {
      const found = options.find(opt => (opt.value === value || opt.value === String(value)));
      if (found) return found.label;
    }
    return value;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
    

    {activeFilterCount > 0 && (
        <div className="bg-white rounded-lg shadow-lg border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Active Filters ({activeFilterCount})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
              title="Clear all filters and close panel"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {activeFilters.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1">
                <span className="font-medium text-gray-600">
                  {formatFieldName(key)}:
                </span>
                <span className="text-gray-800 ml-1">
                  {getLabelForValue(key,value)}
                  {/* {formatFieldValue(value)} */}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Button */}
      <Button 
        onClick={onSearch}
        className="bg-[#4fb3ff] hover:bg-[#4fb3ff]/90 text-white gap-2 shadow-lg"
        size="lg"
      >
        <Search className="h-4 w-4" />
        Search
      </Button>
    </div>
  );
};

export default FloatingActionPanel;
