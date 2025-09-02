import React, { useState, useRef } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { opportunitiesService } from "@/features/Opportunity/Services/opportunitiesService";
import StageDropdown from "./StageDropdown";
import ProspectingStageDropdown from "./ProspectingStageDropdown";
import TableStatusBadge from "./TableStatusBadge";
import UserAvatar from "./UserAvatar";
import TruncatedText from "@/components/ui/TruncatedText";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import contactsApi from "@/services/contactsApi";

const OpportunityTableRow = ({
  opportunity,
  isSelected,
  onSelect,
  columnOrder,
  columnWidths,
  onCompanySelect,
  selectedCompany,
  stages = [],
  prospectingStages = [],
  onRefresh,
  isSplitScreenMode = false,
}) => {
  const navigate = useNavigate();

  // Local state for tracking prospecting stage dropdown values
  const [
    chosenValueForProspectingStageDropdown,
    setChosenValueForProspectingStageDropdown,
  ] = useState({});
  const [leadSourceDisplaysByContactId, setLeadSourceDisplaysByContactId] =
    useState({});
  const [leadTypeDisplaysByContactId, setLeadTypeDisplaysByContactId] =
    useState({});
  // Local toggle used to force a lightweight rerender after dropdown changes
  const [, setResultsUpdated] = useState(false);

  // Generic alert dialog state (shared validation UX)
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("Alert");
  const showAlert = (message, title = "Alert") => {
    setAlertMessage(message || "Action not allowed.");
    setAlertTitle(title);
    setAlertOpen(true);
  };

  // Debounced grid refresh to avoid reloading on every single checkbox click
  const refreshDebounceRef = useRef(null);
  const scheduleRefresh = () => {
    if (!onRefresh) return;
    if (refreshDebounceRef.current) {
      clearTimeout(refreshDebounceRef.current);
    }
    refreshDebounceRef.current = setTimeout(() => {
      onRefresh();
      refreshDebounceRef.current = null;
    }, 2100);
  };

  const handleRowClick = (e) => {
    // Prevent navigation when clicking on interactive elements
    if (
      e.target.closest(
        'input, button, [role="button"], [data-radix-select-trigger]'
      )
    ) {
      return;
    }

    if (isSplitScreenMode) {
      // In split screen mode, row click triggers company selection
      if (onCompanySelect) {
        onCompanySelect(
          opportunity.companyName || opportunity.company,
          opportunity
        );
      }
    } else {
      // In normal mode, single click selects the row for bulk actions
      onSelect(!isSelected);
    }
  };

  const handleRowDoubleClick = (e) => {
    // Prevent navigation when double-clicking on interactive elements
    if (
      e.target.closest(
        'input, button, [role="button"], [data-radix-select-trigger]'
      )
    ) {
      return;
    }
    // Double click opens edit opportunity
    navigate(`/edit-opportunity/${opportunity.id}`);
  };

  const handleCompanyClick = (e) => {
    e.stopPropagation();
    // Call onCompanySelect for sidebar functionality
    if (onCompanySelect) {
      onCompanySelect(
        opportunity.companyName || opportunity.company,
        opportunity
      );
    }
    // No external redirect - just show in split view sidebar
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/edit-opportunity/${opportunity.id}`);
  };

  const handleStageChange = (opportunityId, newStage) => {
    console.log(
      `Stage changed for opportunity ${opportunityId} to ${newStage}`
    );
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const renderCellContent = (column) => {
    // Utility: get a date for a given stage label from various possible shapes
    const getStageDateByLabel = (stageLabel) => {
      if (!stageLabel) return null;
      // 1) Stages dictionary coming from API (preferred)
      if (opportunity.Stages && typeof opportunity.Stages === "object") {
        const direct = opportunity.Stages[stageLabel];
        if (direct) return direct;
      }
      // 2) Flattened keys like Stage_<Name> or stage_<Name>
      const variants = [
        `Stage_${stageLabel}`,
        `stage_${stageLabel}`,
        `Stage_${stageLabel.replace(/\s+/g, "_")}`,
        `stage_${stageLabel.replace(/\s+/g, "_")}`,
      ];
      for (const key of variants) {
        if (opportunity[key]) return opportunity[key];
      }
      return null;
    };

    const handleStageCheckToggle = async (stageLabel) => {
      // Snapshots so we can revert on API failure
      let prevStagesSnapshot = null;
      let prevStageLabelSnapshot = null;
      try {
        const stageMeta = stages.find((s) => s.name === stageLabel);
        if (!stageMeta) {
          showAlert("Invalid stage. Please reload and try again.");
          return;
        }

        // Optional: row-level restrictions if provided by API
        const isReadOnly =
          opportunity?.CanView === 1 ||
          opportunity?.canView === 1 ||
          opportunity?.isReadOnly === true;
        if (isReadOnly) {
          showAlert(
            "You do not have permission to modify this opportunity.",
            "Action not allowed"
          );
          // Do not mutate UI and do not call API
          return;
        }

        // Guard: block edits for closed states without mutating UI
        const stageLc = String(opportunity?.stage || "").toLowerCase();
        if (stageLc === "closed won" || stageLc === "closed lost") {
          showAlert(
            "Closed opportunities cannot be modified via the grid. Use the Edit page.",
            "Action not allowed"
          );
          return;
        }
        const currentDate = getStageDateByLabel(stageLabel);
        const shouldInsert = !currentDate;

        // Optimistic UI update for timeline date and main Stage pill
        const prevStages = { ...(opportunity.Stages || {}) };
        prevStagesSnapshot = prevStages;
        prevStageLabelSnapshot = opportunity.stage;
        if (shouldInsert) {
          opportunity.Stages = {
            ...prevStages,
            [stageLabel]: new Date().toISOString(),
          };
          // Do not mutate stage pill optimistically; server is source of truth
        } else {
          opportunity.Stages = { ...prevStages, [stageLabel]: null };
          // Do not mutate stage pill optimistically; server is source of truth
        }
        setResultsUpdated((v) => !v);

        const apiResp = await opportunitiesService.toggleOpportunityStageDate(
          opportunity.id,
          stageMeta.id,
          shouldInsert
        );

        // If API returns OppStageDetails use its date
        const serverDetail =
          apiResp?.content?.OppStageDetails ||
          apiResp?.OppStageDetails ||
          apiResp?.Data?.OppStageDetails ||
          apiResp?.OppStageDetails ||
          apiResp?.Data?.OppStageDetails;
        if (serverDetail) {
          opportunity.Stages = {
            ...opportunity.Stages,
            [stageLabel]: serverDetail.Date || opportunity.Stages[stageLabel],
          };
          if (serverDetail.Stage) {
            opportunity.OppStageDetails = serverDetail;
            opportunity.stage = serverDetail.Stage;
            // Update related fields for special cases
            if (serverDetail.Stage === "Closed Won") {
              opportunity.probability = 100;
              opportunity.actualCloseDate =
                opportunity.actualCloseDate || new Date().toISOString();
              opportunity.status = opportunity.status || "Won";
            }
            if (serverDetail.Status) {
              opportunity.status = serverDetail.Status;
            }
          }
        }
        // Trigger re-render so row reflects mutation immediately
        setResultsUpdated((v) => !v);
        // Ask parent to refresh grid so API-driven stage pill is updated consistently
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error("Stage toggle failed", error);
        // Revert optimistic changes on failure
        if (prevStagesSnapshot) opportunity.Stages = prevStagesSnapshot;
        if (prevStageLabelSnapshot !== null)
          opportunity.stage = prevStageLabelSnapshot;
        setResultsUpdated((v) => !v);

        // Show server-provided validation message
        const msg =
          error?.response?.data?.Message ||
          error?.response?.data?.message ||
          error?.response?.Message ||
          error?.message ||
          "Unable to update stage.";
        showAlert(msg, "Alert");
      }
    };
    // Normalize API-provided column ids (PropertyMappingName/DBName) to canonical ids
    const normalizeColumnId = (rawId) => {
      const map = {
        // People
        AssignedTo: "assignedRep",
        OwnerName: "createdBy",
        "OwnerDetails.Name": "createdBy",
        // Names
        Name: "opportunityName",
        CustomerName: "companyName",
        Customer: "companyName",
        "ContactDetails.Name": "contactName",
        "ContactDetails.FullNameWithCompany": "companyName",
        SubContactName: "contactName",
        "SubContactDetails.Name": "contactName",
        // Status/Stage
        Status: "status",
        Stage: "stage",
        "OppStageDetails.Stage": "stage",
        "ProposalHistory.Created": "proposalCreated",
        Hist_created: "proposalCreated",
        // Dates
        CloseDate: "closeDate",
        CreatedDate: "createdDate",
        // Misc
        Probability: "probability",
        Amount: "amount",
        ForecastRevenue: "forecastRevenue",
        "ProductDetails.Name": "product",
        ProductName: "product",
        Product: "product",
        Products: "product",
        SalesPresenter: "salesPresenter",
        // Lead fields
        LeadSource: "leadSource",
        LeadType: "leadType",
        LeadStatus: "leadStatus",
        "SubContactDetails.LeadSource": "leadSource",
        "SubContactDetails.LeadType": "leadType",
        "SubContactDetails.LeadStatus": "leadStatus",
        "ContactDetails.LeadSource": "leadSource",
        "ContactDetails.LeadType": "leadType",
        "ContactDetails.LeadStatus": "leadStatus",
        // Prospecting Stage fields
        ProspectingStage: "prospectingStage",
        "SubContactDetails.ProspectingStage": "prospectingStage",
        "ContactDetails.ProspectingStage": "prospectingStage",
      };
      return map[rawId] || rawId;
    };

    const getValue = (columnId) => {
      const apiFieldMappings = {
        assignedRep: ["AssignedTo", "assignedRep"],
        createdBy: ["OwnerName", "OwnerDetails.Name", "createdBy"],
        opportunityType: ["TypeName", "OppTypeDetails.Name", "opportunityType"],
        companyName: [
          "Customer",
          "CustomerName",
          "ContactDetails.FullNameWithCompany",
          "ContactDetails.Name",
          "companyName",
        ],
        projCloseDate: ["CloseDate", "closeDate", "projCloseDate"],
        closeDate: ["CloseDate", "projCloseDate", "closeDate"],
        description: ["Description", "Notes", "description"],
        source: ["Source", "source"],
        status: ["Status", "status"],
        opportunityName: ["name", "Name", "opportunityName"],
        name: ["name", "Name", "opportunityName"],
        createdDate: ["CreatedDateFrom", "CreatedDate", "createdDate"],
        contactName: [
          "SubContactName",
          "SubContactDetails.Name",
          "contactName",
        ],
        stage: ["Stage", "OppStageDetails.Stage", "stage"],
        nextStep: ["NextStep", "nextStep"],
        amount: ["Amount", "amount"],
        probability: ["Probability", "probability"],
        actualCloseDate: ["ActualCloseDate", "actualCloseDate"],
        proposalId: ["ProposalID", "proposalId"],
        lossReason: [
          "LossReasonName",
          "OppLossReasonDetails.Name",
          "lossReason",
        ],
        salesPresenter: ["SalesPresenter", "salesPresenter"],
        businessUnit: ["BusinessUnit", "businessUnit"],
        forecastRevenue: ["ForecastRevenue", "forecastRevenue"],
        lastActivity: [
          "OpportunityField",
          "LastActivity.Display",
          "lastActivity",
        ],
        lastActivityDate: [
          "ActivityField",
          "LastActivity.LastActivity",
          "lastActivityDate",
        ],
        // Proposals timeline
        proposalCreated: [
          "ProposalHistory.Created",
          "Hist_created",
          "histCreated",
          "proposalCreated",
        ],
        opportunityId: ["ID", "opportunityId"],
        contactId: [
          "gsCustomersID",
          "ContactID",
          "ContactDetails.ID",
          "contactId",
        ],
        leadStatus: [
          "LeadStatus",
          "SubContactDetails.LeadStatus",
          "ContactDetails.LeadStatus",
          "leadStatus",
        ],
        leadSource: [
          "LeadSource",
          "SubContactDetails.LeadSource",
          "ContactDetails.LeadSource",
          "leadSource",
          "AdvSearch.LeadSources",
        ],
        leadType: [
          "LeadType",
          "SubContactDetails.LeadType",
          "ContactDetails.LeadType",
          "leadType",
          "AdvSearch.LeadTypes",
        ],
        prospectingStage: [
          "ProspectingStage",
          "prospectingStage",
          "SubContactDetails.ProspectingStage",
          "ContactDetails.ProspectingStage",
          "AdvSearch.ProspectingStageID",
          "ProspectingStageId",
          "ProspectingStageID",
        ],
        product: [
          "ProductDetails.Name",
          "ProductName",
          "Product",
          "Products",
          "product",
        ],
      };

      if (
        opportunity[columnId] !== undefined &&
        opportunity[columnId] !== null &&
        opportunity[columnId] !== ""
      ) {
        return opportunity[columnId];
      }

      const mappings = apiFieldMappings[columnId] || [columnId];
      for (const fieldPath of mappings) {
        if (fieldPath.includes(".")) {
          const parts = fieldPath.split(".");
          let value = opportunity;
          for (const part of parts) {
            if (
              value &&
              typeof value === "object" &&
              value[part] !== undefined
            ) {
              value = value[part];
            } else {
              value = null;
              break;
            }
          }
          if (value !== null && value !== undefined && value !== "") {
            return value;
          }
        } else {
          if (
            opportunity[fieldPath] !== undefined &&
            opportunity[fieldPath] !== null &&
            opportunity[fieldPath] !== ""
          ) {
            return opportunity[fieldPath];
          }
        }
      }

      return null;
    };

    // Prefer API-provided mapping path to bind genuine values (supports custom fields)
    const mappingPath =
      column.propertyMappingName ||
      column.propertyMapping ||
      column.PropertyMappingName ||
      column.dbName ||
      column.DBName ||
      null;

    const getByPath = (path) => {
      if (!path || typeof path !== "string") return null;
      // Use exact case as provided by API and traverse nested objects
      if (path.includes(".")) {
        const parts = path.split(".");
        let current = opportunity;
        for (const part of parts) {
          if (
            current &&
            typeof current === "object" &&
            current[part] !== undefined
          ) {
            current = current[part];
          } else {
            return null;
          }
        }
        // If the resolved value is an object with common display props, surface those
        if (current && typeof current === "object") {
          if (current.Name) return current.Name;
          if (current.Display) return current.Display;
          if (current.FullNameWithCompany) return current.FullNameWithCompany;
        }
        return current;
      }
      return opportunity[path] !== undefined ? opportunity[path] : null;
    };

    // Use normalized id for rendering/presentation, then classify renderer by mapping path
    const normalizedId = normalizeColumnId(column.id);
    const labelText = String(
      column.label || column.displayName || column.DisplayName || ""
    )
      .toLowerCase()
      .trim();

    let renderId = normalizedId;
    const pathLc = String(mappingPath || "").toLowerCase();

    // Classify based on mapping path first (authoritative), then fall back to label when path is missing
    if (/(^|\.)status$/.test(pathLc)) {
      renderId = "status";
    } else if (/(^|\.)assignedto$/.test(pathLc)) {
      renderId = "assignedRep";
    } else if (
      /oppstagedetails\.stage$/.test(pathLc) ||
      /(^|\.)stage$/.test(pathLc)
    ) {
      renderId = "stage";
    } else if (
      /proposalhistory\.created$/.test(pathLc) ||
      /(^|\.)hist_created$/.test(pathLc)
    ) {
      renderId = "proposalCreated";
    } else if (
      /(^|\.)customer(name)?$/.test(pathLc) ||
      /contactdetails\.(fullnamewithcompany|name)$/.test(pathLc)
    ) {
      renderId = "companyName";
    } else if (
      /opptypedetails\.name$/.test(pathLc) ||
      /(^|\.)typename$/.test(pathLc) ||
      /(^|\.)type$/.test(pathLc)
    ) {
      renderId = "opportunityType";
    } else if (/forecastrevenue$/.test(pathLc)) {
      renderId = "forecastRevenue";
    } else if (/(^|\.)amount$/.test(pathLc) || /proposalamount$/.test(pathLc)) {
      renderId = "amount";
    } else if (/(^|\.)probability$/.test(pathLc)) {
      renderId = "probability";
    } else if (
      /(^|\.)product(details\.name)?$/.test(pathLc) ||
      /(^|\.)productname$/.test(pathLc) ||
      /(^|\.)products$/.test(pathLc)
    ) {
      renderId = "product";
    } else if (/(^|\.)closedate$/.test(pathLc)) {
      renderId = "closeDate";
    } else if (/(^|\.)actualclosedate$/.test(pathLc)) {
      renderId = "actualCloseDate";
    } else if (/lastactivity(\.lastactivity)?$/.test(pathLc)) {
      renderId = "lastActivityDate";
    } else if (/createddate$/.test(pathLc)) {
      renderId = "createdDate";
    } else if (
      /(^|\.)prospectingstage$/.test(pathLc) ||
      /contactdetails\.prospectingstage$/.test(pathLc) ||
      /subcontactdetails\.prospectingstage$/.test(pathLc)
    ) {
      renderId = "prospectingStage";
    } else if (!mappingPath) {
      // Fallback to label-only when mapping path is not provided
      if (labelText.includes("proposal created")) {
        renderId = "proposalCreated";
      } else if (
        labelText.includes("status") &&
        !labelText.includes("approval")
      ) {
        renderId = "status";
      } else if (labelText.includes("assigned") || labelText.includes("rep")) {
        renderId = "assignedRep";
      } else if (
        labelText.includes("opportunity type") ||
        labelText === "type"
      ) {
        renderId = "opportunityType";
      } else if (
        labelText.includes("prospecting stage") ||
        labelText === "prospecting stage"
      ) {
        renderId = "prospectingStage";
      }
    }

    // Resolve value using mapping first, then canonical field mappings
    let value = getByPath(mappingPath);
    if (value === null || value === undefined || value === "") {
      value = getValue(renderId);
    }

    // Stage timeline checkmark columns: detect by label matched to known stages
    const isStageTimelineColumn = stages?.some(
      (s) => String(s.name).toLowerCase() === labelText
    );
    if (
      isStageTimelineColumn &&
      renderId !== "stage" &&
      renderId !== "status" &&
      renderId !== "assignedRep"
    ) {
      const stage = stages.find(
        (s) => String(s.name).toLowerCase() === labelText
      );
      const stageDate = getStageDateByLabel(stage?.name);
      const isCompleted = Boolean(stageDate);
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleStageCheckToggle(stage?.name);
          }}
          className="flex items-center gap-2 text-sm text-gray-700"
          title={
            isCompleted
              ? `Completed on ${formatDate(stageDate)}`
              : "Not completed"
          }
        >
          <span
            className={`h-4 w-4 rounded-full flex items-center justify-center ${
              isCompleted ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <Check className="h-3 w-3 text-white" />
          </span>
          <span className="min-w-[84px] inline-block">
            {isCompleted ? formatDate(stageDate) : ""}
          </span>
        </button>
      );
    }

    switch (renderId) {
      case "name":
      case "opportunityName":
        return (
          <span className="font-medium text-blue-600 text-sm cursor-pointer hover:text-blue-700 transition-colors underline">
            {value || "Untitled Opportunity"}
          </span>
        );
      case "companyName":
        return (
          <Button
            variant="link"
            className={`p-0 h-auto font-medium text-sm hover:underline transition-colors justify-start max-w-full ${
              selectedCompany === (value || opportunity.companyName)
                ? "text-blue-600"
                : "text-gray-900 hover:text-blue-600"
            }`}
            onClick={handleCompanyClick}
            title={value || opportunity.companyName || "Unknown Company"}
          >
            <span className="truncate block max-w-full">
              {value || opportunity.companyName || "Unknown Company"}
            </span>
          </Button>
        );
      case "status":
        return <TableStatusBadge status={value || opportunity.status} />;
      case "stage":
        return (
          <StageDropdown
            stage={opportunity.stage ?? value}
            opportunityId={opportunity.id}
            onStageChange={handleStageChange}
            stages={stages}
          />
        );
      case "amount":
      case "forecastRevenue":
      case "proposalAmount":
        return (
          <div className="font-medium text-gray-900 text-sm">
            {formatCurrency(value)}
          </div>
        );
      case "probability":
        return (
          <div className="text-gray-700 text-sm">
            {value ? `${value}%` : ""}
          </div>
        );
      case "assignedRep":
        return (
          <div className="flex justify-center">
            <UserAvatar user={value || opportunity.assignedRep} />
          </div>
        );
      case "createdBy":
        return <UserAvatar user={value || opportunity.createdBy} />;
      case "salesPresenter":
        return <UserAvatar user={value || opportunity.salesPresenter} />;
      case "closeDate":
      case "projCloseDate":
      case "actualCloseDate":
      case "createdDate":
      case "lastActivityDate":
      case "proposalCreated":
        return <div className="text-gray-700 text-sm">{formatDate(value)}</div>;
      case "leadSource": {
        const contactIdForRow =
          opportunity?.SubContactDetails?.ID ||
          opportunity?.gsCustomersID ||
          opportunity?.ContactDetails?.ID;
        const selectedDisplaysFromRow = Array.isArray(value)
          ? value
          : typeof value === "string"
          ? value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        const selectedDisplays =
          leadSourceDisplaysByContactId[contactIdForRow] ??
          selectedDisplaysFromRow;
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <MultiSelectDropdown
              id={`lead-source-${opportunity.id}`}
              options={opportunity._leadSourceOptions || []}
              value={selectedDisplays}
              onChange={async (selectedLabels) => {
                try {
                  // Map selected display names back to their IDs
                  const selectedIds = selectedLabels
                    .map((labelOrId) => {
                      const option = (
                        opportunity._leadSourceOptions || []
                      ).find(
                        (opt) =>
                          opt.label === labelOrId ||
                          String(opt.value) === String(labelOrId)
                      );
                      return option ? option.value : null;
                    })
                    .filter((id) => id !== null && id !== undefined);

                  // Get target contact ID
                  const contactId = contactIdForRow;

                  if (contactId) {
                    // Optimistic UI update
                    setLeadSourceDisplaysByContactId((prev) => ({
                      ...prev,
                      [contactId]: selectedLabels,
                    }));
                    await contactsApi.updateContact({
                      ID: contactId,
                      fieldName: "LeadSource",
                      fieldValue: selectedIds.join(","),
                      IsEmailIDVerificationEnabled: false,
                      IsSubContactUpdate: false,
                    });

                    console.log(
                      "LeadSource updated successfully",
                      opportunity.id,
                      selectedLabels
                    );
                    // Debounce grid refresh to avoid reload for each click
                    scheduleRefresh();
                  }
                } catch (error) {
                  console.error("Failed to update lead source:", error);
                  // Revert optimistic change on error
                  setLeadSourceDisplaysByContactId((prev) => {
                    const next = { ...prev };
                    delete next[contactIdForRow];
                    return next;
                  });
                }
              }}
            />
          </div>
        );
      }
      case "leadType": {
        const contactIdForRow =
          opportunity?.SubContactDetails?.ID ||
          opportunity?.gsCustomersID ||
          opportunity?.ContactDetails?.ID;
        const selectedDisplaysFromRow = Array.isArray(value)
          ? value
          : typeof value === "string"
          ? value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        const selectedDisplays =
          leadTypeDisplaysByContactId[contactIdForRow] ??
          selectedDisplaysFromRow;
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <MultiSelectDropdown
              id={`lead-type-${opportunity.id}`}
              options={opportunity._leadTypeOptions || []}
              value={selectedDisplays}
              onChange={async (selectedLabels) => {
                try {
                  const selectedIds = selectedLabels
                    .map((labelOrId) => {
                      const option = (opportunity._leadTypeOptions || []).find(
                        (opt) =>
                          opt.label === labelOrId ||
                          String(opt.value) === String(labelOrId)
                      );
                      return option ? option.value : null;
                    })
                    .filter((id) => id !== null && id !== undefined);

                  const contactId = contactIdForRow;
                  if (contactId) {
                    // optimistic update
                    setLeadTypeDisplaysByContactId((prev) => ({
                      ...prev,
                      [contactId]: selectedLabels,
                    }));
                    await contactsApi.updateContact({
                      ID: contactId,
                      fieldName: "LeadType",
                      fieldValue: selectedIds.join(","),
                      IsEmailIDVerificationEnabled: false,
                      IsSubContactUpdate: false,
                    });
                    scheduleRefresh();
                  }
                } catch (error) {
                  console.error("Failed to update lead type:", error);
                  // revert optimistic update on error
                  setLeadTypeDisplaysByContactId((prev) => {
                    const next = { ...prev };
                    delete next[contactIdForRow];
                    return next;
                  });
                }
              }}
            />
          </div>
        );
      }
      case "leadStatus":
        return (
          <input
            type="text"
            maxLength={50}
            defaultValue={value || ""}
            onClick={(e) => e.stopPropagation()}
            onBlur={async (e) => {
              try {
                const newValue = (e.target.value || "").trim();
                // Get target contact ID
                const contactId =
                  opportunity?.SubContactDetails?.ID ||
                  opportunity?.gsCustomersID ||
                  opportunity?.ContactDetails?.ID;

                if (contactId && newValue !== String(value || "").trim()) {
                  await contactsApi.updateContact({
                    fieldName: "LeadStatus",
                    fieldValue: newValue,
                    ID: contactId,
                    IsEmailIDVerificationEnabled: false,
                    IsSubContactUpdate: false,
                  });

                  console.log(
                    "LeadStatus updated successfully",
                    opportunity.id,
                    newValue
                  );
                  // Refresh grid from DB after successful save
                  onRefresh && onRefresh();
                }
              } catch (error) {
                console.error("Failed to update lead status:", error);
              }
            }}
            className="w-full h-7 px-2 py-1 text-sm border border-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        );
      case "prospectingStage": {
        // Get current value from local state or fall back to opportunity data
        const subContactID =
          opportunity?.SubContactDetails?.ID || opportunity?.gsCustomersID;
        const currentFromState =
          chosenValueForProspectingStageDropdown[subContactID];
        const rawStage = currentFromState || String(value || "");
        const currentStage = rawStage === "" ? "" : rawStage;

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ProspectingStageDropdown
              prospectingStage={currentStage}
              opportunity={opportunity}
              onStageChange={(oppId, newStage) => {
                // Update local state for immediate UI feedback
                const stageValue = newStage === "" ? "__none__" : newStage;
                setChosenValueForProspectingStageDropdown((prev) => ({
                  ...prev,
                  [subContactID]: stageValue,
                }));
                setResultsUpdated((prev) => !prev);
              }}
              prospectingStages={prospectingStages}
              onRefresh={onRefresh}
            />
          </div>
        );
      }
      case "contactName":
      case "product":
      case "nextStep":
      case "description":
      case "proposalId":
      case "lossReason":
      case "businessUnit":
      case "opportunityType":
      case "source":
      case "lastActivity":
        return <div className="text-gray-700 text-sm">{value || ""}</div>;
      case "opportunityId":
      case "contactId":
        return <div className="text-gray-700 text-sm">{value || ""}</div>;
      default:
        if (value !== undefined && value !== null && value !== "") {
          if (
            typeof value === "number" &&
            column.id.toLowerCase().includes("amount")
          ) {
            return (
              <div className="font-medium text-gray-900 text-sm">
                {formatCurrency(value)}
              </div>
            );
          } else if (
            typeof value === "string" &&
            (column.id.toLowerCase().includes("date") ||
              value.match(/^\d{4}-\d{2}-\d{2}/))
          ) {
            return (
              <div className="text-gray-700 text-sm">{formatDate(value)}</div>
            );
          } else if (typeof value === "boolean") {
            return (
              <div className="text-gray-700 text-sm">
                {value ? "Yes" : "No"}
              </div>
            );
          } else {
            return <div className="text-gray-700 text-sm">{String(value)}</div>;
          }
        }

        return <div className="text-gray-700 text-sm"></div>;
    }
  };

  return (
    <>
      <TableRow
        className={`transition-colors border-b border-gray-100 cursor-pointer select-none ${
          isSelected ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
        }`}
        onClick={handleRowClick}
        onDoubleClick={handleRowDoubleClick}
        title="Click to select, double-click to edit"
      >
        {!isSplitScreenMode && (
          <TableCell className="w-12 px-4 py-1.5">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(checked)}
              onClick={(e) => e.stopPropagation()}
              className="focus:ring-ocean-500"
            />
          </TableCell>
        )}
        <TableCell className="w-12 px-2 py-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditClick}
            className="h-8 w-8 p-0 rounded"
            title="Edit opportunity"
          >
            <Edit className="h-4 w-4 text-gray-500 hover:text-blue-600" />
          </Button>
        </TableCell>
        {columnOrder.map((column) => (
          <TableCell
            key={column.id}
            className={`px-4 py-1.5 text-sm border-r border-gray-50 last:border-r-0 overflow-hidden ${
              column.id === 'AssignedTo' ? 'text-center' : ''
            }`}
            style={{
              width: columnWidths[column.id]
                ? `${columnWidths[column.id]}px`
                : undefined,
              minWidth: column.id === 'Status' ? "70px" : column.id === 'AssignedTo' ? "90px" : column.id === 'Probability' ? "90px" : column.id === 'Amount' ? "90px" : "150px",
              maxWidth: columnWidths[column.id]
                ? `${columnWidths[column.id]}px`
                : "250px",
            }}
          >
            {renderCellContent(column)}
          </TableCell>
        ))}
      </TableRow>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OpportunityTableRow;
