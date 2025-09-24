
import React, { useState, useEffect } from "react";
import FloatingLabelInput from "../EditOpportunity/FloatingLabelInput";
import FloatingLabelSelect from "@/components/ui/FloatingLabelSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { OPPORTUNITY_OPTIONS } from "@OpportunityConstants/opportunityOptions";
import { userService } from "@/features/Opportunity/Services/userService";

const SalesProcessFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const [leadSources, setLeadSources] = useState([]);
  const [isLoadingLeadSources, setIsLoadingLeadSources] = useState(true);
  const [leadTypes, setLeadTypes] = useState([]);
  const [isLoadingLeadTypes, setIsLoadingLeadTypes] = useState(true);
  const [leadStatus, setLeadStatus] = useState([]);
  const [isLoadingLeadStatus, setIsLoadingLeadStatus] = useState(true);
  const [salesPresentations, setSalesPresentations] = useState([]);
  const [isLoadingSalesPresentations, setIsLoadingSalesPresentations] = useState(true);
  const [campaignSources, setCampaignSources] = useState([]);
  const [isLoadingCampaignSources, setIsLoadingCampaignSources] = useState(true);

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

    const fetchCampaignSources = async () => {
      try {
        setIsLoadingCampaignSources(true);
        const sources = await userService.getCampaigns();
        setCampaignSources(sources);
      } catch (error) {
        console.error('Failed to fetch campaign sources:', error);
        setCampaignSources([]);
      } finally {
        setIsLoadingCampaignSources(false);
      }
    };

    fetchLeadSources();
    fetchLeadTypes();
    fetchLeadStatus();
    fetchSalesPresentations();
    fetchCampaignSources();
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
          <MultiSelectDropdown
            id="source"
            label="Source"
            value={Array.isArray(searchParams.source) ? searchParams.source : (searchParams.source ? [searchParams.source] : [])}
            onChange={handleSelectFieldChange("source")}
            options={OPPORTUNITY_OPTIONS.source}
            placeholder="Select source"
            disabled={false}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="lead-source"
            label="Lead Source"
            value={Array.isArray(searchParams.leadSource) ? searchParams.leadSource : (searchParams.leadSource ? [searchParams.leadSource] : [])}
            onChange={handleSelectFieldChange("leadSource")}
            options={leadSources}
            placeholder={isLoadingLeadSources ? "Loading lead sources..." : "Select source"}
            disabled={isLoadingLeadSources}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="lead-type"
            label="Lead Type"
            value={Array.isArray(searchParams.leadType) ? searchParams.leadType : (searchParams.leadType ? [searchParams.leadType] : [])}
            onChange={handleSelectFieldChange("leadType")}
            options={leadTypes}
            placeholder={isLoadingLeadTypes ? "Loading lead types..." : "Select type"}
            disabled={isLoadingLeadTypes}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="lead-status"
            label="Lead Status"
            value={Array.isArray(searchParams.leadStatus) ? searchParams.leadStatus : (searchParams.leadStatus ? [searchParams.leadStatus] : [])}
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
          <MultiSelectDropdown
            id="sales-presentation"
            label="Sales Presentation"
            value={Array.isArray(searchParams.salesPresentation) ? searchParams.salesPresentation : (searchParams.salesPresentation ? [searchParams.salesPresentation] : [])}
            onChange={handleSelectFieldChange("salesPresentation")}
            options={salesPresentations}
            placeholder={isLoadingSalesPresentations ? "Loading presentations..." : "Select presentation"}
            disabled={isLoadingSalesPresentations}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <MultiSelectDropdown
            id="next-steps"
            label="Next Steps"
            value={Array.isArray(searchParams.nextSteps) ? searchParams.nextSteps : (searchParams.nextSteps ? [searchParams.nextSteps] : [])}
            onChange={handleSelectFieldChange("nextSteps")}
            options={OPPORTUNITY_OPTIONS.nextStep}
            placeholder="Select next step"
            disabled={false}
          />
        </div>
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <MultiSelectDropdown
            id="primary-campaign"
            label="Primary Campaign Source"
            value={Array.isArray(searchParams.primaryCampaign) ? searchParams.primaryCampaign : (searchParams.primaryCampaign ? [searchParams.primaryCampaign] : [])}
            onChange={handleSelectFieldChange("primaryCampaign")}
            options={campaignSources}
            placeholder={isLoadingCampaignSources ? "Loading campaign sources..." : "Select campaign"}
            disabled={isLoadingCampaignSources}
          />
        </div>
      </div>

      {/* Row 3 - Territory and Competitive Info */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="territory"
            label="Territory"
            value={Array.isArray(searchParams.territory) ? searchParams.territory : (searchParams.territory ? [searchParams.territory] : [])}
            onChange={handleSelectFieldChange("territory")}
            options={OPPORTUNITY_OPTIONS.territory}
            placeholder="Select territory"
            disabled={false}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="referral-source"
            label="Referral Source"
            value={Array.isArray(searchParams.referralSource) ? searchParams.referralSource : (searchParams.referralSource ? [searchParams.referralSource] : [])}
            onChange={handleSelectFieldChange("referralSource")}
            options={OPPORTUNITY_OPTIONS.referral}
            placeholder="Select referral"
            disabled={false}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="competitors"
            label="Competitors"
            value={Array.isArray(searchParams.competitors) ? searchParams.competitors : (searchParams.competitors ? [searchParams.competitors] : [])}
            onChange={handleSelectFieldChange("competitors")}
            options={OPPORTUNITY_OPTIONS.competitor}
            placeholder="Select competitor"
            disabled={false}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="decision-criteria"
            label="Decision Criteria"
            value={Array.isArray(searchParams.decisionCriteria) ? searchParams.decisionCriteria : (searchParams.decisionCriteria ? [searchParams.decisionCriteria] : [])}
            onChange={handleSelectFieldChange("decisionCriteria")}
            options={OPPORTUNITY_OPTIONS.decisionCriteria}
            placeholder="Select criteria"
            disabled={false}
          />
        </div>
      </div>

      {/* Row 4 - Win/Loss Reason */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-6 space-y-2">
          <MultiSelectDropdown
            id="win-loss-reason"
            label="Win/Loss Reason"
            value={Array.isArray(searchParams.winLossReason) ? searchParams.winLossReason : (searchParams.winLossReason ? [searchParams.winLossReason] : [])}
            onChange={handleSelectFieldChange("winLossReason")}
            options={[...OPPORTUNITY_OPTIONS.winReason, ...OPPORTUNITY_OPTIONS.lossReason]}
            placeholder="Select reason"
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesProcessFields;
