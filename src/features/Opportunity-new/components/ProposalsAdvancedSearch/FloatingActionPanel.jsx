
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { getLabelForValue } from "./proposalFieldValueFormatter";
import { userService } from "@/features/Opportunity/Services/userService";

const FloatingActionPanel = ({ searchParams, onSearch, onClear, openAccordions, onAccordionChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [campaignSourceOptions, setCampaignSourceOptions] = useState([]);
  const [createdRepsData, setCreatedRepsData] = useState([]);
  const [assignedRepsData, setAssignedRepsData] = useState([]);
  const [salesPresentersData, setSalesPresentersData] = useState([]);
  const [businessUnitsData, setBusinessUnitsData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [lossReasonData, setLossReasonData] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [proposalRepData, setProposalRepData] = useState([]);
  const [proposalApprovalStagesData, setProposalApprovalStagesData] = useState([]);

  // Count active filters
  const activeFilterCount = Object.values(searchParams || {}).filter(
    value => value && value.toString().trim() !== ''
  ).length;

  // Get active filters for display
  const activeFilters = Object.entries(searchParams || {}).filter(
    ([key, value]) => value && value.toString().trim() !== ''
  );

  // Fetch data for field value formatting
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all necessary data in parallel
        const [
          campaigns,
          createdReps,
          assignedReps,
          salesPresenters,
          businessUnits,
          products,
          types,
          lossReasons,
          stages,
          proposalReps,
          proposalApprovalStages
        ] = await Promise.allSettled([
          userService.getCampaigns(),
          userService.getOpportunityCreators(),
          userService.getOpportunityCreators(),
          userService.getOpportunityCreators(), // salesPresenter should use the same service as other user fields
          userService.getBusinessUnits(),
          userService.getProducts(),
          userService.getOpportunityTypes(),
          userService.getLossReasons(),
          userService.getStages(),
          userService.getProposalReps(),
          userService.getProposalApprovalStages()
        ]);

        // Set campaign sources
        if (campaigns.status === 'fulfilled' && Array.isArray(campaigns.value)) {
          setCampaignSourceOptions(campaigns.value);
        }

        // Set created reps
        if (createdReps.status === 'fulfilled' && Array.isArray(createdReps.value)) {
          setCreatedRepsData(createdReps.value);
        }

        // Set assigned reps
        if (assignedReps.status === 'fulfilled' && Array.isArray(assignedReps.value)) {
          setAssignedRepsData(assignedReps.value);
        }

        // Set sales presenters
        if (salesPresenters.status === 'fulfilled' && Array.isArray(salesPresenters.value)) {
          setSalesPresentersData(salesPresenters.value);
        }

        // Set business units
        if (businessUnits.status === 'fulfilled' && Array.isArray(businessUnits.value)) {
          setBusinessUnitsData(businessUnits.value);
        }

        // Set products
        if (products.status === 'fulfilled' && Array.isArray(products.value)) {
          setProductsData(products.value);
        }

        // Set types
        if (types.status === 'fulfilled' && Array.isArray(types.value)) {
          setTypeData(types.value);
        }

        // Set loss reasons
        if (lossReasons.status === 'fulfilled' && Array.isArray(lossReasons.value)) {
          setLossReasonData(lossReasons.value);
        }

        // Set stages
        if (stages.status === 'fulfilled' && Array.isArray(stages.value)) {
          setStageData(stages.value);
        }

        // Set proposal reps
        if (proposalReps.status === 'fulfilled' && Array.isArray(proposalReps.value)) {
          setProposalRepData(proposalReps.value);
        }

        // Set proposal approval stages
        if (proposalApprovalStages.status === 'fulfilled' && Array.isArray(proposalApprovalStages.value)) {
          setProposalApprovalStagesData(proposalApprovalStages.value);
        }

      } catch (error) {
        console.error('Failed to fetch data for FloatingActionPanel:', error);
      }
    };

    fetchData();
  }, []);

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

  // Define accordion sections with their labels for proposals - only original 4 sections
  const allSections = [
    { value: "primary-fields", label: "Quick Search" },
    { value: "opportunity-info", label: "Opportunity Info" },
    { value: "contact-address-info", label: "Contact/Address Info" },
    { value: "proposal-info", label: "Proposal Info" }
  ];

  const handleSectionToggle = (sectionValue, checked) => {
    if (checked) {
      onAccordionChange([...openAccordions, sectionValue]);
    } else {
      onAccordionChange(openAccordions.filter(section => section !== sectionValue));
    }
  };

  const handleClearAll = () => {
    onClear();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="bg-white rounded-lg shadow-lg border p-3 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Active Filters ({activeFilterCount})
            </span>
            <button
              onClick={handleClearAll}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {activeFilters.map(([key, value]) => {
              const optionsMap = { 
                primaryCampaign: campaignSourceOptions,
                createdRep: createdRepsData,
                assignedRep: assignedRepsData,
                salesPresenter: salesPresentersData,
                businessUnit: businessUnitsData,
                product: productsData,
                type: typeData,
                lossReason: lossReasonData,
                stage: stageData,
                proposalRep: proposalRepData,
                proposalApprovalStage: proposalApprovalStagesData,
                proposalApprovalStages: proposalApprovalStagesData
              };
              
              return (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 truncate">
                    {key}: {getLabelForValue(key, value, optionsMap)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accordion Controls */}
      <div className="bg-white rounded-lg shadow-lg border p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Sections</span>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {allSections.map((section) => (
            <div key={section.value} className="flex items-center gap-2">
              <Checkbox 
                id={`accordion-${section.value}`}
                checked={openAccordions.includes(section.value)}
                onCheckedChange={(checked) => handleSectionToggle(section.value, checked)}
              />
              <label 
                htmlFor={`accordion-${section.value}`} 
                className="text-xs font-medium text-gray-600 cursor-pointer leading-none"
              >
                {section.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Search Button */}
      <Button 
        onClick={onSearch}
        className="bg-[#4fb3ff] hover:bg-[#4fb3ff]/90 text-white gap-2 shadow-lg"
        size="lg"
      >
        <Search className="h-4 w-4" />
        Search Proposals
      </Button>
    </div>
  );
};

export default FloatingActionPanel;
