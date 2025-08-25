import React, { useState, useEffect } from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import EnhancedProposalIdField from "@/features/Opportunity/components/ProposalsAdvancedSearch/EnhancedProposalIdField";
import EnhancedProposalNameField from "@/features/Opportunity/components/ProposalsAdvancedSearch/EnhancedProposalNameField";
import { userService } from "@/features/Opportunity/Services/userService";

const ProposalInfoFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const [proposalRepOptions, setProposalRepOptions] = useState([]);
  const [proposalApprovalStagesOptions, setProposalApprovalStagesOptions] = useState([]);
  const [proposalApprovalStatusOptions, setProposalApprovalStatusOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hardcoded proposal status options with correct numeric mapping
  const proposalStatusOptions = [
    { value: "1", label: "No Line Items" },
    { value: "2", label: "InActive" },
    { value: "3", label: "Active" },
    { value: "4", label: "Converted to contract" }
  ];

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching proposal info dropdown data for Proposals tab...');
        
        // Fetch all dropdown data
        const [
          proposalRepsData,
          proposalApprovalStagesData,
          proposalApprovalStatusData
        ] = await Promise.allSettled([
          userService.getProposalReps(),
          userService.getProposalApprovalStages(),
          userService.getProposalApprovalStatuses()
        ]);

        // Process proposal reps
        if (proposalRepsData.status === 'fulfilled' && Array.isArray(proposalRepsData.value)) {
          setProposalRepOptions(proposalRepsData.value);
        }

        // Process proposal approval stages
        if (proposalApprovalStagesData.status === 'fulfilled' && Array.isArray(proposalApprovalStagesData.value)) {
          setProposalApprovalStagesOptions(proposalApprovalStagesData.value);
        }

        // Process proposal approval statuses
        if (proposalApprovalStatusData.status === 'fulfilled' && Array.isArray(proposalApprovalStatusData.value)) {
          setProposalApprovalStatusOptions(proposalApprovalStatusData.value);
        }

      } catch (error) {
        console.error('Failed to fetch proposal info dropdown data:', error);
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
    // For enhanced fields (proposalName, proposalId), pass arrays directly
    if (field === 'proposalName' || field === 'proposalId') {
      handleSelectChange(field, values);
    } else {
      // handleSelectChange(field, values);
      const valueString = Array.isArray(values) ? values.join(',') : values;
      handleSelectChange(field, valueString);
    }
  };

  const getSelectedValues = field => {
    const value = searchParams[field];
    if (!value) {
      return [];
    }
    
    // If it's already an array (from context parsing), return as is
    if (Array.isArray(value)) {
      return value;
    }
    
    // If it's a string, parse it
    // if (typeof value === 'string') {
    //   if (value.includes('~')) {
    //     // Handle IE format string (e.g., "IE=178~IE=170~")
    //     const parsed = value.split('~').filter(Boolean).map(v => v.replace('IE=', ''));
    //     return parsed;
    //   }
    //   if (value.includes(',')) {
    //     // Handle comma-separated string
    //     const parsed = value.split(',').filter(v => v.trim());
    //     return parsed;
    //   }

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
        <div className="col-span-12 sm:col-span-4 space-y-2">
            <MultiSelectDropdown
              id="proposal-rep"
              label="Proposal Rep"
              value={getSelectedValues("proposalRep")}
              onChange={handleMultiSelectChange("proposalRep")}
              options={proposalRepOptions}
              placeholder="Select proposal rep"
              disabled={isLoading}
            />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
            <MultiSelectDropdown
              id="proposal-status"
              label="Proposal Status"
              value={getSelectedValues("proposalStatus")}
              onChange={handleMultiSelectChange("proposalStatus")}
              options={proposalStatusOptions}
              placeholder="Select proposal status"
              disabled={isLoading}
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="proposal-amount-from"
            label="Proposal Amount
From"
            type="number"
            value={searchParams.proposalAmountFrom || ""}
            onChange={handleFieldChange("proposalAmountFrom")}
            className="small-label"
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="proposal-amount-to"
            label="Proposal Amount
To"
            type="number"
            value={searchParams.proposalAmountTo || ""}
            onChange={handleFieldChange("proposalAmountTo")}
            className="small-label"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <EnhancedProposalNameField
            label="Proposal Name"
            value={searchParams.proposalName || []}
            onChange={handleMultiSelectChange("proposalName")}
            placeholder="Type proposal name..."
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
            <MultiSelectDropdown
              id="proposal-approval-status"
              label="Proposal Approval Status"
              value={getSelectedValues("proposalApprovalStatus")}
              onChange={handleMultiSelectChange("proposalApprovalStatus")}
              options={proposalApprovalStatusOptions}
              placeholder="Select approval status"
              disabled={isLoading}
            />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="proposal-created-date-from"
            label="Proposal Created
Date From"
            type="date"
            value={searchParams.proposalCreatedDateFrom || ""}
            onChange={handleFieldChange("proposalCreatedDateFrom")}
            max={searchParams.proposalCreatedDateTo || undefined}
            className="small-label"
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="proposal-created-date-to"
            label="Proposal Created
Date To"
            type="date"
            value={searchParams.proposalCreatedDateTo || ""}
            onChange={handleFieldChange("proposalCreatedDateTo")}
            min={searchParams.proposalCreatedDateFrom || undefined}
            className="small-label"
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <EnhancedProposalIdField
            label="Proposal ID"
            value={searchParams.proposalId || []}
            onChange={handleMultiSelectChange("proposalId")}
            placeholder="Type proposal ID..."
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
            <MultiSelectDropdown
              id="proposal-approval-stages"
              label="Proposal Approval Stages"
              value={getSelectedValues("proposalApprovalStages")}
              onChange={handleMultiSelectChange("proposalApprovalStages")}
              options={proposalApprovalStagesOptions}
              placeholder="Select approval stages"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalInfoFields;
