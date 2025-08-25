
import React from "react";
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";

const FinancialDataFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  const currencyOptions = [
    { value: "usd", label: "USD" },
    { value: "eur", label: "EUR" },
    { value: "gbp", label: "GBP" },
    { value: "cad", label: "CAD" }
  ];

  const contractTypeOptions = [
    { value: "fixed-price", label: "Fixed Price" },
    { value: "time-materials", label: "Time & Materials" },
    { value: "cost-plus", label: "Cost Plus" },
    { value: "milestone", label: "Milestone-based" }
  ];

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="proposed-value-min"
            label="Proposed Value (Min)"
            type="number"
            value={searchParams.proposedValueMin || ""}
            onChange={handleFieldChange("proposedValueMin")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="proposed-value-max"
            label="Proposed Value (Max)"
            type="number"
            value={searchParams.proposedValueMax || ""}
            onChange={handleFieldChange("proposedValueMax")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="currency"
            label="Currency"
            value={searchParams.currency || ""}
            onChange={handleSelectFieldChange("currency")}
            options={currencyOptions}
            placeholder="Select currency"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="contract-type"
            label="Contract Type"
            value={searchParams.contractType || ""}
            onChange={handleSelectFieldChange("contractType")}
            options={contractTypeOptions}
            placeholder="Select contract type"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="contract-duration"
            label="Contract Duration (months)"
            type="number"
            value={searchParams.contractDuration || ""}
            onChange={handleFieldChange("contractDuration")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="estimated-margin"
            label="Estimated Margin %"
            type="number"
            value={searchParams.estimatedMargin || ""}
            onChange={handleFieldChange("estimatedMargin")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="project-start-date"
            label="Project Start Date"
            type="date"
            value={searchParams.projectStartDate || ""}
            onChange={handleFieldChange("projectStartDate")}
            max={searchParams.projectEndDate || undefined}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="project-end-date"
            label="Project End Date"
            type="date"
            value={searchParams.projectEndDate || ""}
            onChange={handleFieldChange("projectEndDate")}
            min={searchParams.projectStartDate || undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialDataFields;
