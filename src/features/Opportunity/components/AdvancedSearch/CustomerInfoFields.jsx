
import React from "react";
import FloatingLabelInput from "../EditOpportunity/FloatingLabelInput";
import FloatingLabelSelect from "../EditOpportunity/FloatingLabelSelect";
import { OPPORTUNITY_OPTIONS } from "@OpportunityConstants/opportunityOptions";

const CustomerInfoFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 - Company Details - company name gets more space */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-5 space-y-2">
          <FloatingLabelInput
            id="company-name"
            label="Company Name"
            value={searchParams.companyName || ""}
            onChange={handleFieldChange("companyName")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelSelect
            id="industry"
            label="Industry"
            value={searchParams.industry || ""}
            onChange={handleSelectFieldChange("industry")}
            options={OPPORTUNITY_OPTIONS.industry}
            placeholder="Select industry"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="customer-id"
            label="Customer ID"
            value={searchParams.customerId || ""}
            onChange={handleFieldChange("customerId")}
          />
        </div>
      </div>
      
      {/* Row 2 - Company Size and Personnel - optimized for different field types */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="company-size"
            label="Company Size"
            value={searchParams.companySize || ""}
            onChange={handleSelectFieldChange("companySize")}
            options={OPPORTUNITY_OPTIONS.companySize}
            placeholder="Select size"
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="account-manager"
            label="Account Manager"
            value={searchParams.accountManager || ""}
            onChange={handleFieldChange("accountManager")}
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="customer-since"
            label="Customer Since"
            type="date"
            value={searchParams.customerSince || ""}
            onChange={handleFieldChange("customerSince")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="timeframe"
            label="Timeframe"
            value={searchParams.timeframe || ""}
            onChange={handleSelectFieldChange("timeframe")}
            options={OPPORTUNITY_OPTIONS.timeframe}
            placeholder="Select timeframe"
          />
        </div>
      </div>

      {/* Row 3 - Decision Maker and Solution - better spacing for text vs dropdown */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="decision-maker"
            label="Decision Maker"
            value={searchParams.decisionMaker || ""}
            onChange={handleFieldChange("decisionMaker")}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelSelect
            id="current-solution"
            label="Current Solution"
            value={searchParams.currentSolution || ""}
            onChange={handleSelectFieldChange("currentSolution")}
            options={OPPORTUNITY_OPTIONS.solution}
            placeholder="Select solution"
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="budget"
            label="Budget"
            type="number"
            value={searchParams.budget || ""}
            onChange={handleFieldChange("budget")}
          />
        </div>
      </div>

      {/* Row 4 - Budget Range - compact for number inputs */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="budget-min"
            label="Budget (Min)"
            type="number"
            value={searchParams.budgetMin || ""}
            onChange={handleFieldChange("budgetMin")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="budget-max"
            label="Budget (Max)"
            type="number"
            value={searchParams.budgetMax || ""}
            onChange={handleFieldChange("budgetMax")}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoFields;
