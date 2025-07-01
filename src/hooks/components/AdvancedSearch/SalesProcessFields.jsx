
import React, { useState, useEffect } from "react";
import FloatingLabelInput from "../EditOpportunity/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";
import { OPPORTUNITY_OPTIONS } from "@/constants/opportunityOptions";
import { userService } from "../../services/userService";

const SalesProcessFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const [leadSources, setLeadSources] = useState([]);
  const [isLoadingLeadSources, setIsLoadingLeadSources] = useState(true);
  const [leadTypes, setLeadTypes] = useState([]);
  const [isLoadingLeadTypes, setIsLoadingLeadTypes] = useState(true);
  const [leadStatus, setLeadStatus] = useState([]);
  const [isLoadingLeadStatus, setIsLoadingLeadStatus] = useState(true);
  const [salesPresentations, setSalesPresentations] = useState([]);
  const [isLoadingSalesPresentations, setIsLoadingSalesPresentations] = useState(true);

  useEffect(() => {
    const fetchLeadSources = async () => {
      try {
        setIsLoadingLeadSources(true);
        const sources = await userService.getLeadSources();
        setLeadSources(sources);
      } catch (error) {
        console.error('Failed to fetch lead sources:', error);
        setLeadSources([]);
      } finally {
        setIsLoadingLeadSources(false);
      }
    };

    const fetchLeadTypes = async () => {
      try {
        setIsLoadingLeadTypes(true);
        const types = await userService.getLeadTypes();
        setLeadTypes(types);
      } catch (error) {
        console.error('Failed to fetch lead types:', error);
        setLeadTypes([]);
      } finally {
        setIsLoadingLeadTypes(false);
      }
    };

    const fetchLeadStatus = async () => {
      try {
        setIsLoadingLeadStatus(true);
        const status = await userService.getLeadStatus();
        setLeadStatus(status);
      } catch (error) {
        console.error('Failed to fetch lead status:', error);
        setLeadStatus([]);
      } finally {
        setIsLoadingLeadStatus(false);
      }
    };

    const fetchSalesPresentations = async () => {
      try {
        setIsLoadingSalesPresentations(true);
        const presentations = await userService.getSalesPresentations();
        setSalesPresentations(presentations);
      } catch (error) {
        console.error('Failed to fetch sales presentations:', error);
        setSalesPresentations([]);
      } finally {
        setIsLoadingSalesPresentations(false);
      }
    };

    fetchLeadSources();
    fetchLeadTypes();
    fetchLeadStatus();
    fetchSalesPresentations();
  }, []);

  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 - Source Information */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="source"
            label="Source"
            value={searchParams.source || ""}
            onChange={handleSelectFieldChange("source")}
            options={OPPORTUNITY_OPTIONS.source}
            placeholder="Select source"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="lead-source"
            label="Lead Source"
            value={searchParams.leadSource || ""}
            onChange={handleSelectFieldChange("leadSource")}
            options={leadSources}
            placeholder={isLoadingLeadSources ? "Loading lead sources..." : "Select source"}
            disabled={isLoadingLeadSources}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="lead-type"
            label="Lead Type"
            value={searchParams.leadType || ""}
            onChange={handleSelectFieldChange("leadType")}
            options={leadTypes}
            placeholder={isLoadingLeadTypes ? "Loading lead types..." : "Select type"}
            disabled={isLoadingLeadTypes}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="lead-status"
            label="Lead Status"
            value={searchParams.leadStatus || ""}
            onChange={handleSelectFieldChange("leadStatus")}
            options={leadStatus}
            placeholder={isLoadingLeadStatus ? "Loading lead status..." : "Select status"}
            disabled={isLoadingLeadStatus}
          />
        </div>
      </div>

      {/* Row 2 - Sales Activities */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelSelect
            id="sales-presentation"
            label="Sales Presentation"
            value={searchParams.salesPresentation || ""}
            onChange={handleSelectFieldChange("salesPresentation")}
            options={salesPresentations}
            placeholder={isLoadingSalesPresentations ? "Loading presentations..." : "Select presentation"}
            disabled={isLoadingSalesPresentations}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelSelect
            id="next-steps"
            label="Next Steps"
            value={searchParams.nextSteps || ""}
            onChange={handleSelectFieldChange("nextSteps")}
            options={OPPORTUNITY_OPTIONS.nextStep}
            placeholder="Select next step"
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelSelect
            id="primary-campaign"
            label="Primary Campaign Source"
            value={searchParams.primaryCampaign || ""}
            onChange={handleSelectFieldChange("primaryCampaign")}
            options={OPPORTUNITY_OPTIONS.campaign}
            placeholder="Select campaign"
          />
        </div>
      </div>

      {/* Row 3 - Territory and Competitive Info */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="territory"
            label="Territory"
            value={searchParams.territory || ""}
            onChange={handleSelectFieldChange("territory")}
            options={OPPORTUNITY_OPTIONS.territory}
            placeholder="Select territory"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="referral-source"
            label="Referral Source"
            value={searchParams.referralSource || ""}
            onChange={handleSelectFieldChange("referralSource")}
            options={OPPORTUNITY_OPTIONS.referral}
            placeholder="Select referral"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="competitors"
            label="Competitors"
            value={searchParams.competitors || ""}
            onChange={handleSelectFieldChange("competitors")}
            options={OPPORTUNITY_OPTIONS.competitor}
            placeholder="Select competitor"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="decision-criteria"
            label="Decision Criteria"
            value={searchParams.decisionCriteria || ""}
            onChange={handleSelectFieldChange("decisionCriteria")}
            options={OPPORTUNITY_OPTIONS.decisionCriteria}
            placeholder="Select criteria"
          />
        </div>
      </div>

      {/* Row 4 - Win/Loss Reason */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-6 space-y-2">
          <FloatingLabelSelect
            id="win-loss-reason"
            label="Win/Loss Reason"
            value={searchParams.winLossReason || ""}
            onChange={handleSelectFieldChange("winLossReason")}
            options={[...OPPORTUNITY_OPTIONS.winReason, ...OPPORTUNITY_OPTIONS.lossReason]}
            placeholder="Select reason"
          />
        </div>
      </div>
    </div>
  );
};

export default SalesProcessFields;
