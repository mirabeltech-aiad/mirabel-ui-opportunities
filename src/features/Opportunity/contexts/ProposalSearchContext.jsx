import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { safeStringToArray } from "@OpportunityUtils/searchUtils";

const ProposalSearchContext = createContext();

export const useProposalSearch = () => {
  const context = useContext(ProposalSearchContext);
  if (!context) {
    throw new Error(
      "useProposalSearch must be used within a ProposalSearchProvider"
    );
  }
  return context;
};

export const ProposalSearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilters, setActiveFilters] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on a proposal-related page
  const isProposalPage =
    location.pathname.includes("/proposals") ||
    (location.pathname.includes("/advanced-search") &&
      searchParams.get("tab") === "proposals");

  // Check if we're specifically on the proposals tab of advanced search
  const isProposalsTab =
    location.pathname.includes("/advanced-search") &&
    searchParams.get("tab") === "proposals";

  // Helper to parse IE string to array for dropdowns
  function parseIEStringToArray(val) {
    if (typeof val === "string" && val.includes("IE=")) {
      // Handle IE format (e.g., "IE=178~IE=170~")
      return val
        .split("~")
        .filter(Boolean)
        .map((v) => v.replace("IE=", ""))
        .filter(Boolean);
    }
    if (typeof val === "string" && val.includes(",")) {
      // Handle comma-separated format (e.g., "178,170")
      return val
        .split(",")
        .filter(Boolean)
        .map((v) => v.trim())
        .filter(Boolean);
    }
    if (Array.isArray(val)) return val;
    if (typeof val === "string" && val.length > 0) return [val];
    return [];
  }

  // Helper to parse SW format string to array for opportunity name and company name
  function parseSWStringToArray(val) {
    if (typeof val === "string" && val.includes("SW=")) {
      // Handle SW format (e.g., "SW=value1~SW=value2~")
      const parts = val.split("SW=").filter((part) => part.trim() !== "");
      return parts.map((part) => {
        // Remove the trailing ~ from each part
        return part.replace(/~$/, "");
      });
    }
    if (typeof val === "string" && val.includes(",")) {
      // Handle comma-separated format (e.g., "value1,value2")
      return val
        .split(",")
        .filter(Boolean)
        .map((v) => v.trim())
        .filter(Boolean);
    }
    if (Array.isArray(val)) return val;
    if (typeof val === "string" && val.length > 0) return [val];
    return [];
  }

  // Mapping of dropdown fields to their value parser
  const dropdownFieldParsers = {
    assignedRep: parseIEStringToArray, // IE format
    salesPresenter: parseIEStringToArray, // IE format
    createdRep: parseIEStringToArray, // IE format
    businessUnit: parseIEStringToArray, // IE format
    product: parseIEStringToArray, // IE format
    primaryCampaign: parseIEStringToArray, // IE format
    opportunityName: safeStringToArray, // comma-separated (no SW format)
    companyName: parseSWStringToArray, // SW format or comma-separated
    customerName: parseSWStringToArray, // SW format or comma-separated
    contactPhone: parseSWStringToArray, // SW format or comma-separated
    phoneNumber: parseSWStringToArray, // SW format or comma-separated
    postalCode: parseSWStringToArray, // SW format or comma-separated
    zipPostalCode: parseSWStringToArray, // SW format or comma-separated
    contactEmail: parseSWStringToArray, // SW format or comma-separated
    city: parseIEStringToArray, // IE format
    state: parseIEStringToArray, // IE format
    county: parseIEStringToArray, // IE format
    country: parseIEStringToArray, // IE format
    // Proposal-specific fields
    proposalName: parseSWStringToArray, // SW format or comma-separated
    proposalId: parseSWStringToArray, // SW format or comma-separated
    proposalStatus: parseIEStringToArray, // IE format
    proposalRep: parseIEStringToArray, // IE format (same as assignedRep)
    proposalApprovalStatus: parseIEStringToArray, // IE format
    proposalApprovalStages: parseIEStringToArray, // IE format
    // Date fields - keep as strings
    createdDateFrom: (val) => val, // Keep as string
    createdDateTo: (val) => val, // Keep as string
    projectedCloseDateFrom: (val) => val, // Keep as string
    projectedCloseDateTo: (val) => val, // Keep as string
    actualCloseDateFrom: (val) => val, // Keep as string
    actualCloseDateTo: (val) => val, // Keep as string
    proposalCreatedDateFrom: (val) => val, // Keep as string
    proposalCreatedDateTo: (val) => val, // Keep as string
    // Amount fields - keep as strings
    amountFrom: (val) => val, // Keep as string
    amountTo: (val) => val, // Keep as string
    proposalAmountFrom: (val) => val, // Keep as string
    proposalAmountTo: (val) => val, // Keep as string
    // Other fields
    type: parseIEStringToArray, // IE format
    stage: parseIEStringToArray, // IE format
    probability: parseIEStringToArray, // IE format
    lossReason: parseIEStringToArray, // IE format
    status: (val) => {
      // For status, we want to keep it as a string, not convert to array
      if (Array.isArray(val)) {
        return val[0] || val; // Return first element or the array itself
      }
      return val;
    },
    // Add more dropdown fields as needed
  };

  useEffect(() => {
    // Only process proposal-specific parameters when on proposal pages
    if (!isProposalPage) {
      setActiveFilters({});
      return;
    }

    const urlFilters = {};
    let hasProposalRep = false;

    for (const [key, value] of searchParams.entries()) {
      // Skip the tab parameter itself
      if (key === "tab") continue;

      // Remove proposal_ prefix if present
      const cleanKey = key.startsWith("proposal_")
        ? key.replace("proposal_", "")
        : key;

      // Process proposal-specific parameters and common fields used in proposals
      if (
        value &&
        value.trim() !== "" &&
        (key.startsWith("proposal_") ||
          // Proposal-specific fields
          [
            "proposalName",
            "proposalStatus",
            "proposalRep",
            "proposalApprovalStatus",
            "proposalId",
            "proposalCreatedDateFrom",
            "proposalCreatedDateTo",
            "proposalApprovalStages",
          ].includes(cleanKey) ||
          // Common fields used in proposals that should not be processed by opportunity context
          [
            "opportunityName",
            "companyName",
            "assignedRep",
            "salesPresenter",
            "createdRep",
            "businessUnit",
            "product",
            "primaryCampaign",
            "customerName",
            "contactPhone",
            "phoneNumber",
            "postalCode",
            "zipPostalCode",
            "contactEmail",
            "city",
            "state",
            "county",
            "country",
            "type",
            "stage",
            "probability",
            "status",
            "lossReason",
            "createdDateFrom",
            "createdDateTo",
            "projectedCloseDateFrom",
            "projectedCloseDateTo",
            "actualCloseDateFrom",
            "actualCloseDateTo",
            "amountFrom",
            "amountTo",
            "proposalAmountFrom",
            "proposalAmountTo",
          ].includes(cleanKey))
      ) {
        if (dropdownFieldParsers[cleanKey]) {
          const parsedValue = dropdownFieldParsers[cleanKey](value);
          urlFilters[cleanKey] = parsedValue;
        } else {
          urlFilters[cleanKey] = value;
        }

        // Track if we found proposalRep
        if (cleanKey === "proposalRep") {
          hasProposalRep = true;
        }

        // Special debugging for proposalRep
        if (cleanKey === "proposalRep") {
          // console.log('🔍 DEBUG - ProposalSearchContext: proposalRep processing:', {
          //   key: cleanKey,
          //   originalValue: value,
          //   parsedValue: urlFilters[cleanKey],
          //   parser: dropdownFieldParsers[cleanKey] ? 'parseIEStringToArray' : 'none',
          //   timestamp: new Date().toISOString()
          // });
        }
      } else {
        console.log("🔍 DEBUG - ProposalSearchContext: Skipping parameter:", {
          key,
          cleanKey,
          value,
          reason: !value ? "empty value" : "not in allowed fields list",
        });
      }
    }

    // If we didn't find proposalRep in URL but it exists in current activeFilters, preserve it
    if (!hasProposalRep && activeFilters.proposalRep) {
      console.log(
        "🔍 DEBUG - ProposalSearchContext: Preserving existing proposalRep from activeFilters:",
        activeFilters.proposalRep
      );
      urlFilters.proposalRep = activeFilters.proposalRep;
    }

    if (Object.keys(urlFilters).length > 0) {
      setActiveFilters(urlFilters);
    } else {
    }
  }, [searchParams, isProposalPage]);

  const updateFilters = (newFilters, options = { updateUrl: true }) => {
    setActiveFilters(newFilters);

    if (options.updateUrl && isProposalPage) {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value.toString().trim() !== "") {
          // Format values for URL storage based on field type
          let urlValue = value;

          if (dropdownFieldParsers[key] === parseIEStringToArray) {
            // For fields that use IE format, convert array to IE=value~ format
            if (Array.isArray(value)) {
              urlValue = value.map((v) => `IE=${v}~`).join("");
            } else if (typeof value === "string" && !value.includes("IE=")) {
              // If it's a string but not already in IE format, convert it
              urlValue = `IE=${value}~`;
            }
          } else if (dropdownFieldParsers[key] === parseSWStringToArray) {
            // For fields that use SW format, convert array to SW=value~ format
            if (Array.isArray(value)) {
              urlValue = value.map((v) => `SW=${v}~`).join("");
            } else if (typeof value === "string" && !value.includes("SW=")) {
              // If it's a string but not already in SW format, convert it
              urlValue = `SW=${value}~`;
            }
          } else if (dropdownFieldParsers[key] === safeStringToArray) {
            // For fields that use safeStringToArray, convert array to comma-separated string
            if (Array.isArray(value)) {
              urlValue = value.join(",");
            } else if (typeof value === "string") {
              // If it's already a string, keep as is
              urlValue = value;
            }
          } else if (
            typeof dropdownFieldParsers[key] === "function" &&
            dropdownFieldParsers[key].toString().includes("val) => val")
          ) {
            // For date and amount fields that should be kept as strings
            if (Array.isArray(value)) {
              urlValue = value[0] || value; // Take first element if array
            } else {
              urlValue = value; // Keep as is
            }
          }

          // Don't add proposal_ prefix - store parameters directly
          params.set(key, urlValue);
        }
      });
      // Use location.pathname from React Router instead of window.location.pathname
      // to avoid issues with the base path /ui60/
      const currentPath = location.pathname;
      const newUrl = params.toString()
        ? `${currentPath}?${params.toString()}`
        : currentPath;
      navigate(newUrl, { replace: true });
    } else {
    }
  };

  const clearAllFilters = () => {
    console.log("ProposalSearchContext: Clearing all filters");
    setActiveFilters({});
    if (isProposalPage) {
      // Clear all URL parameters except the tab parameter
      const newSearchParams = new URLSearchParams();
      const currentTab = searchParams.get("tab");
      if (currentTab) {
        newSearchParams.set("tab", currentTab);
      }
      console.log(
        "ProposalSearchContext: Setting URL params to:",
        newSearchParams.toString()
      );
      setSearchParams(newSearchParams, { replace: true });
    }
  };

  const addFilter = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    updateFilters(newFilters);
  };

  const removeFilter = (key) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    updateFilters(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(
      (value) => value && value.toString().trim() !== ""
    ).length;
  };

  const value = {
    activeFilters,
    updateFilters,
    clearAllFilters,
    addFilter,
    removeFilter,
    getActiveFilterCount,
  };

  return (
    <ProposalSearchContext.Provider value={value}>
      {children}
    </ProposalSearchContext.Provider>
  );
};
