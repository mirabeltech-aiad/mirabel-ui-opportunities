import React, { useState, useMemo, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OpportunitySearchBar from "./OpportunitySearchBar";
import EditOpportunityAccordion from "../EditOpportunity/EditOpportunityAccordion";
import LinkedProposalsSection from "../EditOpportunity/LinkedProposalsSection";

const AddOpportunityTabs = ({
  formData,
  handleInputChange,
  opportunityOptions,
  onSave,
  isCustomerSelected,
  getFieldError,
  hasValidationErrors,
  hasSubmitted,
  isStageDisabled,
  isProbabilityDisabled,
  onApiStagesLoaded, // Add callback to pass apiStages up
}) => {
  const [activeTab, setActiveTab] = useState("opportunity-info");

  const handleSearch = () => {};
  const isProposalCurrentlyLinked = !!(
    formData.proposalId && formData.proposalId.trim() !== ""
  );

  const handleCustomerSelect = (customer) => {
    // Update form data with selected customer information
    if (customer) {
      handleInputChange("company", customer.name || customer.company);
      handleInputChange("contactName", "");
      handleInputChange("customerId", customer.id);
      handleInputChange("contactId", "");

      // Auto-populate additional fields for Add Opportunity mode
      handleInputChange("forecastRevenue", "0"); // Default forecast revenue
      handleInputChange("createdBy", "Current User"); // Default created by
      handleInputChange("createdDate", new Date().toISOString().split("T")[0]); // Current date

      // Store additional customer data if needed
      handleInputChange("customerData", {
        id: customer.id,
        company: customer.name || customer.company,
        firstName: customer.contactName || customer.firstName,
        primaryContact: customer.primaryContact,
      });
    } else {
      // Clear customer data when selection is cleared
      handleInputChange("company", "");
      handleInputChange("contactName", "");
      handleInputChange("customerId", "");
      handleInputChange("contactId", "");
      handleInputChange("forecastRevenue", "");
      handleInputChange("createdBy", "");
      handleInputChange("createdDate", new Date().toISOString().split("T")[0]);
      handleInputChange("customerData", null);
    }

    // Clear proposal linkage and dependent fields on customer change (unlock fields)
    handleInputChange("proposalId", "");
    handleInputChange("proposalName", "");
    handleInputChange("amount", "");
    handleInputChange("businessUnit", []);
    handleInputChange("businessUnitId", []);
    handleInputChange("businessUnitDetails", []);
    handleInputChange("product", []);
    handleInputChange("productId", []);
    handleInputChange("productDetails", []);
  };

  // Enhanced proposal linking handler
  const handleProposalLinked = (
    proposalId,
    proposalName,
    net,
    productId,
    productNames,
    businessUnitIds,
    businessUnitNames,
    updatedOpportunityData
  ) => {
    // Unlink/clear case
    if (!proposalId) {
      handleInputChange("proposalId", "");
      handleInputChange("proposalName", "");
      handleInputChange("amount", "");
      handleInputChange("product", []);
      handleInputChange("productId", []);
      handleInputChange("productDetails", []);
      handleInputChange("businessUnit", []);
      handleInputChange("businessUnitId", []);
      handleInputChange("businessUnitDetails", []);
      return;
    }

    // Link: prefer normalized arrays from updatedOpportunityData
    const normalizedProducts =
      updatedOpportunityData?.product ||
      (typeof productNames === "string"
        ? productNames
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(productNames)
        ? productNames
        : []);
    const normalizedProductIds =
      updatedOpportunityData?.productId ||
      (typeof productId === "string" || typeof productId === "number"
        ? productId
            .toString()
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(productId)
        ? productId
        : []);
    const normalizedBUs =
      updatedOpportunityData?.businessUnit ||
      (typeof businessUnitNames === "string"
        ? businessUnitNames
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(businessUnitNames)
        ? businessUnitNames
        : []);
    const normalizedBUIds =
      updatedOpportunityData?.businessUnitId ||
      (typeof businessUnitIds === "string" ||
      typeof businessUnitIds === "number"
        ? businessUnitIds
            .toString()
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(businessUnitIds)
        ? businessUnitIds
        : []);

    handleInputChange("proposalId", proposalId, { fromProposal: true });
    handleInputChange("proposalName", proposalName, { fromProposal: true });
    handleInputChange("amount", net ?? 0, { fromProposal: true });
    handleInputChange("product", normalizedProducts, { fromProposal: true });
    handleInputChange("productId", normalizedProductIds, {
      fromProposal: true,
    });
    handleInputChange(
      "productDetails",
      updatedOpportunityData?.productDetails || [],
      { fromProposal: true }
    );
    handleInputChange("businessUnit", normalizedBUs, { fromProposal: true });
    handleInputChange("businessUnitId", normalizedBUIds, {
      fromProposal: true,
    });
    handleInputChange(
      "businessUnitDetails",
      updatedOpportunityData?.businessUnitDetails || [],
      { fromProposal: true }
    );
  };

  // Enhanced validation for all required fields with comprehensive business rules
  const validateOpportunityInfo = useCallback(() => {
    const errors = {};

    // Required field validation
    const requiredFields = [
      {
        field: "name",
        label: "Opportunity Name",
        minLength: 3,
        maxLength: 100,
      },
      { field: "company", label: "Company Name", minLength: 2, maxLength: 100 },
      { field: "status", label: "Status" },
      { field: "stage", label: "Stage" },
      {
        field: "amount",
        label: "Amount",
        isNumeric: true,
        min: 0,
        max: 999999999,
      },
      { field: "projCloseDate", label: "Projected Close Date", isDate: true },
      { field: "opportunityType", label: "Opportunity Type" },
      { field: "createdBy", label: "Created By", minLength: 2, maxLength: 50 },
      { field: "createdDate", label: "Created Date", isDate: true },
    ];

    const missingFields = [];
    const invalidFields = [];

    requiredFields.forEach(
      ({ field, label, minLength, maxLength, isNumeric, min, max, isDate }) => {
        const value = formData[field];

        // Check if field is empty or invalid
        let isEmpty = false;

        if (field === "opportunityType") {
          isEmpty =
            !value ||
            (typeof value === "object" && !value.name) ||
            (typeof value === "string" && value.trim() === "");
        } else if (field === "amount") {
          isEmpty =
            !formData.proposalId &&
            (!(parseFloat(value) > 0) ||
              (typeof value === "string" && value.trim() === ""));
        } else {
          isEmpty =
            !value || (typeof value === "string" && value.trim() === "");
        }

        if (isEmpty) {
          missingFields.push(label);
          errors[field] = `${label} is required`;
        } else {
          // Additional validation for existing values
          const stringValue = typeof value === "string" ? value : String(value);

          // String length validation
          if (minLength && stringValue.trim().length < minLength) {
            invalidFields.push(
              `${label} must be at least ${minLength} characters`
            );
            errors[field] = `${label} must be at least ${minLength} characters`;
            // keep variable for historical reference; not needed further
          }

          if (maxLength && stringValue.trim().length > maxLength) {
            invalidFields.push(
              `${label} must be less than ${maxLength} characters`
            );
            errors[
              field
            ] = `${label} must be less than ${maxLength} characters`;
            // keep variable for historical reference; not needed further
          }

          // Numeric validation
          if (isNumeric) {
            const numValue = parseFloat(stringValue);
            if (isNaN(numValue)) {
              invalidFields.push(`${label} must be a valid number`);
              errors[field] = `${label} must be a valid number`;
              // keep variable for historical reference; not needed further
            } else {
              if (min !== undefined && numValue < min) {
                invalidFields.push(`${label} must be at least ${min}`);
                errors[field] = `${label} must be at least ${min}`;
                // keep variable for historical reference; not needed further
              }
              if (max !== undefined && numValue > max) {
                invalidFields.push(`${label} cannot exceed ${max}`);
                errors[field] = `${label} cannot exceed ${max}`;
                // keep variable for historical reference; not needed further
              }
            }
          }

          // Date validation
          if (isDate && stringValue) {
            const dateValue = new Date(stringValue);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (isNaN(dateValue.getTime())) {
              invalidFields.push(`${label} must be a valid date`);
              errors[field] = `${label} must be a valid date`;
              // keep variable for historical reference; not needed further
            } else if (field === "projCloseDate") {
              // Projected close date should be in the future
              if (dateValue < today) {
                invalidFields.push(`${label} should be a future date`);
                errors[field] = `${label} should be a future date`;
              }

              // Check if projected close date is too far in the future (more than 5 years)
              const fiveYearsFromNow = new Date();
              fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
              if (dateValue > fiveYearsFromNow) {
                invalidFields.push(`${label} should be within 5 years`);
                errors[field] = `${label} should be within 5 years`;
              }
            } else if (field === "createdDate") {
              // For system-generated fields like createdDate, we don't show validation errors
              // since users can't edit them. The auto-correction happens in handleInputChange.
              if (dateValue > today) {
                console.warn(
                  `System field ${field} has future date: ${stringValue}. This should be auto-corrected by the form handler.`
                );
                // Don't add to validation errors since user can't fix this system field
              }
            }
          }
        }
      }
    );

    // Optional field validation
    const optionalFields = [
      {
        field: "probability",
        label: "Probability",
        isNumeric: true,
        min: 0,
        max: 100,
      },
      {
        field: "contactName",
        label: "Contact Name",
        minLength: 2,
        maxLength: 50,
      },
      {
        field: "primaryCampaignSource",
        label: "Primary Campaign Source",
        maxLength: 100,
      },
      { field: "nextSteps", label: "Next Steps", maxLength: 500 },
    ];

    optionalFields.forEach(
      ({ field, label, minLength, maxLength, isNumeric, min, max }) => {
        const value = formData[field];

        if (value && typeof value === "string" && value.trim() !== "") {
          const stringValue = value.trim();

          // String length validation for optional fields
          if (minLength && stringValue.length < minLength) {
            invalidFields.push(
              `${label} must be at least ${minLength} characters`
            );
            errors[field] = `${label} must be at least ${minLength} characters`;
          }

          if (maxLength && stringValue.length > maxLength) {
            invalidFields.push(
              `${label} must be less than ${maxLength} characters`
            );
            errors[
              field
            ] = `${label} must be less than ${maxLength} characters`;
          }

          // Numeric validation for optional fields
          if (isNumeric) {
            const numValue = parseFloat(stringValue);
            if (isNaN(numValue)) {
              invalidFields.push(`${label} must be a valid number`);
              errors[field] = `${label} must be a valid number`;
            } else {
              if (min !== undefined && numValue < min) {
                invalidFields.push(`${label} must be at least ${min}`);
                errors[field] = `${label} must be at least ${min}`;
              }
              if (max !== undefined && numValue > max) {
                invalidFields.push(`${label} cannot exceed ${max}`);
                errors[field] = `${label} cannot exceed ${max}`;
              }
            }
          }
        }
      }
    );

    // Business logic validation
    if (formData.amount && formData.probability) {
      const amount = parseFloat(formData.amount);
      const probability = parseFloat(formData.probability);

      if (!isNaN(amount) && !isNaN(probability)) {
        // If stage is "Closed Won", probability should be 100%
        if (formData.stage === "Closed Won" && probability !== 100) {
          invalidFields.push(
            "Probability should be 100% for Closed Won opportunities"
          );
          errors.probability =
            "Probability should be 100% for Closed Won opportunities";
        }

        // If stage is "Closed Lost", probability should be 0%
        if (formData.stage === "Closed Lost" && probability !== 0) {
          invalidFields.push(
            "Probability should be 0% for Closed Lost opportunities"
          );
          errors.probability =
            "Probability should be 0% for Closed Lost opportunities";
        }

        // Check for unrealistic probability for early stages
        if (formData.stage === "Lead" && probability > 25) {
          invalidFields.push(
            "Probability seems high for Lead stage (typically 25% or less)"
          );
          errors.probability =
            "Probability seems high for Lead stage (typically 25% or less)";
        }
      }
    }

    return {
      isValid: missingFields.length === 0 && invalidFields.length === 0,
      missingFields,
      invalidFields,
      errors,
      allIssues: [...missingFields, ...invalidFields],
    };
  }, [formData]);

  const handleTabChange = (value) => {
    if (value === "proposals") {
      // Use memoized validation result instead of calling validateOpportunityInfo()
      if (!validationResult.isValid) {
        // Show warning but allow tab switch for better UX
        setActiveTab(value);
      } else {
        setActiveTab(value);
      }
    } else {
      setActiveTab(value);
    }
  };

  // Footer removed; no separate proposal save handler

  // Recompute validation whenever form data changes after first submit
  const validationResult = useMemo(
    () => validateOpportunityInfo(),
    [validateOpportunityInfo]
  );

  // Enhanced getFieldError function that uses memoized validation
  const getFieldValidationError = (fieldName) => {
    if (!hasSubmitted) return null;

    // First check if there's an error from the parent component
    const parentError = getFieldError ? getFieldError(fieldName) : null;
    if (parentError) return parentError;

    // Use memoized validation result instead of calling validateOpportunityInfo() every time
    return validationResult.errors[fieldName] || null;
  };

  const SaveButton = () => (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="flex justify-end">
        <Button
          onClick={onSave}
          className="bg-blue-500 text-white hover:bg-blue-600"
          disabled={false}
        >
          <Save className="h-4 w-4 mr-2" />
          Create Opportunity
        </Button>
      </div>
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-50 p-1 rounded-md">
        <TabsTrigger
          value="opportunity-info"
          className="text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200"
        >
          Opportunity Information
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
          probabilityOptions={opportunityOptions.probability}
          isAddMode={true}
          isCustomerSelected={isCustomerSelected}
          getFieldError={getFieldValidationError}
          hasValidationErrors={hasValidationErrors}
          hasSubmitted={hasSubmitted}
          isStageDisabled={isStageDisabled}
          isProbabilityDisabled={isProbabilityDisabled}
          onApiStagesLoaded={onApiStagesLoaded}
          isProposalLinkedFieldsDisabled={isProposalCurrentlyLinked}
        />
        <SaveButton />
      </TabsContent>

      <TabsContent value="proposals" className="mt-4">
        <LinkedProposalsSection
          opportunityId={null}
          opportunityData={formData}
          companyDetails={{ customerName: formData.company }}
          onProposalLinked={handleProposalLinked}
        />
        {/* No footer button on proposals tab */}
      </TabsContent>
    </Tabs>
  );
};

export default AddOpportunityTabs;
