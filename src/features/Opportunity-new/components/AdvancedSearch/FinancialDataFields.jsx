
import React from "react";
import FloatingLabelInput from "@/shared/components/ui/FloatingLabelInput";
import FloatingLabelSelect from "@/shared/components/ui/FloatingLabelSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { OPPORTUNITY_OPTIONS } from "@OpportunityConstants/opportunityOptions";

const FinancialDataFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 - Contract and Forecast Revenue - optimized for number inputs */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="contract-length"
            label="Contract Length"
            value={Array.isArray(searchParams.contractLength) ? searchParams.contractLength : (searchParams.contractLength ? [searchParams.contractLength] : [])}
            onChange={handleSelectFieldChange("contractLength")}
            options={[{ value: "Month-to-Month", label: "Month-to-Month" }, { value: "3 months", label: "3 months" }, { value: "6 months", label: "6 months" }, { value: "1 year", label: "1 year" }, { value: "2 years", label: "2 years" }, { value: "3 years", label: "3 years" }, { value: "Multi-year", label: "Multi-year" }, { value: "Custom Term", label: "Custom Term" }]}
            placeholder="Select length"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="forecast-revenue-min"
            label="Forecast Min"
            type="number"
            value={searchParams.forecastRevenueMin || ""}
            onChange={handleFieldChange("forecastRevenueMin")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="forecast-revenue-max"
            label="Forecast Max"
            type="number"
            value={searchParams.forecastRevenueMax || ""}
            onChange={handleFieldChange("forecastRevenueMax")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="annual-revenue"
            label="Annual Revenue"
            type="number"
            value={searchParams.annualRevenue || ""}
            onChange={handleFieldChange("annualRevenue")}
          />
        </div>
      </div>

      {/* Row 2 - Implementation and Renewal Dates - date fields need less space */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="implementation-date-from"
            label="Implementation From"
            type="date"
            value={searchParams.implementationDateFrom || ""}
            onChange={handleFieldChange("implementationDateFrom")}
            max={searchParams.implementationDateTo || undefined}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="implementation-date-to"
            label="Implementation To"
            type="date"
            value={searchParams.implementationDateTo || ""}
            onChange={handleFieldChange("implementationDateTo")}
            min={searchParams.implementationDateFrom || undefined}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="renewal-date"
            label="Renewal Date"
            type="date"
            value={searchParams.renewalDate || ""}
            onChange={handleFieldChange("renewalDate")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="credit-score"
            label="Credit Score"
            type="number"
            value={searchParams.creditScore || ""}
            onChange={handleFieldChange("creditScore")}
          />
        </div>
      </div>

      {/* Row 3 - Budget and Payment - optimized for dropdown options */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <MultiSelectDropdown
            id="budget-range"
            label="Budget Range"
            value={Array.isArray(searchParams.budgetRange) ? searchParams.budgetRange : (searchParams.budgetRange ? [searchParams.budgetRange] : [])}
            onChange={handleSelectFieldChange("budgetRange")}
            options={[{ value: "0-10k", label: "$0 - $10,000" }, { value: "10k-50k", label: "$10,000 - $50,000" }, { value: "50k-100k", label: "$50,000 - $100,000" }, { value: "100k-500k", label: "$100,000 - $500,000" }, { value: "500k+", label: "$500,000+" }]}
            placeholder="Select budget range"
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <MultiSelectDropdown
            id="payment-terms"
            label="Payment Terms"
            value={Array.isArray(searchParams.paymentTerms) ? searchParams.paymentTerms : (searchParams.paymentTerms ? [searchParams.paymentTerms] : [])}
            onChange={handleSelectFieldChange("paymentTerms")}
            options={[{ value: "net-30", label: "Net 30" }, { value: "net-60", label: "Net 60" }, { value: "net-90", label: "Net 90" }]}
            placeholder="Select payment terms"
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <MultiSelectDropdown
            id="fiscal-year"
            label="Fiscal Year End"
            value={Array.isArray(searchParams.fiscalYear) ? searchParams.fiscalYear : (searchParams.fiscalYear ? [searchParams.fiscalYear] : [])}
            onChange={handleSelectFieldChange("fiscalYear")}
            options={[{ value: "january", label: "January" }, { value: "june", label: "June" }, { value: "december", label: "December" }]}
            placeholder="Select month"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialDataFields;
