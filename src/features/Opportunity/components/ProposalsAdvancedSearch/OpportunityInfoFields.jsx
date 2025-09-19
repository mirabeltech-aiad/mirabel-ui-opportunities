import React, { useState, useEffect } from "react";
import FloatingLabelInput from "@/shared/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { userService } from "@/features/Opportunity/Services/userService";
import { safeStringToArray } from "@OpportunityUtils/searchUtils";

// Helper to normalize probability values for the dropdown (matching Quick Filters logic)
function normalizeProbabilityValues(val) {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map(v => String(v).replace('%', ''));
  }
  if (typeof val === 'string') {
    // Split IE format or comma-separated
    return val.split(/[~,]/).filter(Boolean).map(v => v.replace(/^IE=/, '').replace(/~$/, '').replace('%', ''));
  }
  return [String(val).replace('%', '')];
}

// Helper to normalize selected probability values to plain numbers as strings
function normalizeSelectedProbabilities(values) {
  if (!values) return [];
  return values.map(v => {
    let str = String(v).trim();
    if (str.startsWith('IE=')) str = str.replace('IE=', '');
    return str.replace('%', '').replace(/~$/, '');
  });
}

const OpportunityInfoFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const [statusOptions, setStatusOptions] = useState([]);
  const [stageOptions, setStageOptions] = useState([]);
  const [probabilityOptions, setProbabilityOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [lossReasonOptions, setLossReasonOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching opportunity info dropdown data for Proposals tab...');
        
        // Set hardcoded status options
        const hardcodedStatus = [
          { label: 'All', value: 'all' },
          { label: 'Open', value: 'open' },
          { label: 'Won', value: 'won' },
          { label: 'Lost', value: 'lost' }
        ];
        setStatusOptions(hardcodedStatus);
        
        // Set hardcoded probability options
        const hardcodedProbability = [
          { label: 'All', value: 'All' },
          { label: '0%', value: '0' }
        ];
        for (let i = 10; i <= 100; i += 10) {
          hardcodedProbability.push({ label: `${i}%`, value: i.toString() });
        }
        setProbabilityOptions(hardcodedProbability);
        
        // Fetch all dropdown data
        const [
          stagesData,
          typesData,
          lossReasonsData
        ] = await Promise.allSettled([
          userService.getStages(),
          userService.getOpportunityTypes(),
          userService.getLossReasons()
        ]);

        // Process stages
        if (stagesData.status === 'fulfilled' && Array.isArray(stagesData.value)) {
          setStageOptions(stagesData.value);
        }

        // Process types
        if (typesData.status === 'fulfilled' && Array.isArray(typesData.value)) {
          setTypeOptions(typesData.value);
        }

        // Process loss reasons
        if (lossReasonsData.status === 'fulfilled' && Array.isArray(lossReasonsData.value)) {
          setLossReasonOptions(lossReasonsData.value);
        }

      } catch (error) {
        console.error('Failed to fetch opportunity info dropdown data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleMultiSelectChange = field => values => {
    if (field === 'probability') {
      handleSelectChange(field, normalizeSelectedProbabilities(values));
    } else {
      // For multiselect fields, store values as comma-separated string
      const valueString = Array.isArray(values) ? values.join(',') : values;
      handleSelectChange(field, valueString);
    }
  };

  const handleSingleSelectChange = field => value => {
    // For single select fields, store value directly
    handleSelectChange(field, value);
    };

  const getSelectedValues = field => {
    const value = searchParams[field];
    if (!value) return [];
    
    // If it's already an array (from context parsing), return as is
    if (Array.isArray(value)) return value;
    
    // If it's a string, parse it
    if (typeof value === 'string') {
      if (value.includes('~')) {
        // Handle IE format string (e.g., "IE=178~IE=170~")
        return value.split('~').filter(Boolean).map(v => v + '~');
      }
      if (value.includes(',')) {
        // Handle comma-separated string
        return value.split(',').filter(v => v.trim());
      }
      // Single value
      return [value];
    }
    
    return [];
  };

  if (isLoading) {
    return (
      <div className="pt-2">
        <div className="space-y-3">
          <div className="text-center py-4 text-gray-500">Loading dropdown options...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="space-y-3">
      {/* Row 1 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
            <FloatingLabelSelect
              id="status"
              label="Status"
              value={searchParams.status || ""}
              onChange={handleSingleSelectChange("status")}
              options={statusOptions}
              placeholder="Select status"
              disabled={isLoading}
            />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="created-date-from"
            label="Created Date From"
            type="date"
            value={searchParams.createdDateFrom || ""}
            onChange={handleFieldChange("createdDateFrom")}
            max={searchParams.createdDateTo || undefined}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="created-date-to"
            label="Created Date To"
            type="date"
            value={searchParams.createdDateTo || ""}
            onChange={handleFieldChange("createdDateTo")}
            min={searchParams.createdDateFrom || undefined}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
            <MultiSelectDropdown
              id="type"
              label="Type"
              value={getSelectedValues("type")}
              onChange={handleMultiSelectChange("type")}
              options={typeOptions}
              placeholder="Select type"
              disabled={isLoading}
            />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
            <MultiSelectDropdown
              id="stage"
              label="Stage"
              value={getSelectedValues("stage")}
              onChange={handleMultiSelectChange("stage")}
              options={stageOptions}
              placeholder="Select stage"
              disabled={isLoading}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="projected-close-date-from"
            label="Projected Close Date From"
            type="date"
            value={searchParams.projectedCloseDateFrom || ""}
            onChange={handleFieldChange("projectedCloseDateFrom")}
            max={searchParams.projectedCloseDateTo || undefined}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="projected-close-date-to"
            label="Projected Close Date To"
            type="date"
            value={searchParams.projectedCloseDateTo || ""}
            onChange={handleFieldChange("projectedCloseDateTo")}
            min={searchParams.projectedCloseDateFrom || undefined}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
            <MultiSelectDropdown
              id="loss-reason"
              label="Loss Reason"
              value={getSelectedValues("lossReason")}
              onChange={handleMultiSelectChange("lossReason")}
              options={lossReasonOptions}
              placeholder="Select loss reason"
              disabled={isLoading}
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
            <MultiSelectDropdown
              id="probability"
              label="Probability"
              value={normalizeProbabilityValues(safeStringToArray(searchParams.probability))}
              onChange={handleMultiSelectChange("probability")}
              options={probabilityOptions}
              placeholder="Select probability"
              disabled={isLoading}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="actual-close-date-from"
            label="Actual Close Date From"
            type="date"
            value={searchParams.actualCloseDateFrom || ""}
            onChange={handleFieldChange("actualCloseDateFrom")}
            max={searchParams.actualCloseDateTo || undefined}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="actual-close-date-to"
            label="Actual Close Date To"
            type="date"
            value={searchParams.actualCloseDateTo || ""}
            onChange={handleFieldChange("actualCloseDateTo")}
            min={searchParams.actualCloseDateFrom || undefined}
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default OpportunityInfoFields;
