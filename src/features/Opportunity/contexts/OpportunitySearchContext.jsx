import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  safeStringToArray,
  getMultiSelectValue,
} from "@OpportunityUtils/searchUtils";

const OpportunitySearchContext = createContext();

export const useOpportunitySearch = () => {
  const context = useContext(OpportunitySearchContext);
  if (!context) {
    throw new Error(
      "useOpportunitySearch must be used within an OpportunitySearchProvider"
    );
  }
  return context;
};

export const OpportunitySearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilters, setActiveFilters] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on an opportunity-related page
  const isOpportunityPage =
    location.pathname.includes("/opportunities") ||
    location.pathname.includes("/advanced-search");

  // Check if we're specifically on the opportunities tab of advanced search
  const isOpportunitiesTab =
    location.pathname.includes("/advanced-search") &&
    searchParams.get("tab") !== "proposals";

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

  // Helper to parse SW string to array for dropdowns (always returns plain names)
  function parseSWStringToArray(val) {
    if (typeof val === "string" && val.includes("SW=")) {
      // Handle SW format (e.g., "SW=value1~SW=value2~")
      const parts = val.split("SW=").filter((part) => part.trim() !== "");
      return parts.map((part) => part.replace(/~$/, ""));
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
    probability: parseIEStringToArray, // IE format
    createdRep: safeStringToArray, // comma or array
    businessUnit: safeStringToArray, // comma or array
    product: safeStringToArray, // comma or array
    opportunityCreator: safeStringToArray, // comma or array
    opportunityNameBasic: safeStringToArray, // comma or array
    stage: safeStringToArray, // comma or array
    status: (val) => {
      // For status, we want to keep it as a string, not convert to array
      if (Array.isArray(val)) {
        return val[0] || val; // Return first element or the array itself
      }
      return val;
    },
    confidenceLevel: safeStringToArray, // comma or array
    primaryCampaign: parseIEStringToArray, // campaign uses IE= format
    // Sales Pipeline & Process fields:
    source: getMultiSelectValue,
    leadSource: parseIEStringToArray,
    leadType: parseIEStringToArray,
    leadStatus: parseIEStringToArray,
    salesPresentation: safeStringToArray,
    nextSteps: safeStringToArray,
    territory: safeStringToArray,
    referralSource: safeStringToArray,
    competitors: safeStringToArray,
    decisionCriteria: safeStringToArray,
    winLossReason: safeStringToArray,
    contractLength: safeStringToArray,
    // Account & Company Information fields:
    industry: safeStringToArray,
    companySize: safeStringToArray,
    timeframe: safeStringToArray,
    currentSolution: safeStringToArray,
    // Company Name field - use SW format parser (similar to Proposals)
    companyName: parseSWStringToArray, // SW format or comma-separated
    // Company Name Basic field - use SW format parser (similar to Proposals)
    companyNameBasic: parseSWStringToArray, // SW format or comma-separated
    // Postal Code field - use SW format parser (similar to Proposals)
    postalCode: parseSWStringToArray, // SW format or comma-separated
    // Phone field - use SW format parser (similar to Proposals)
    contactPhone: parseSWStringToArray, // SW format or comma-separated
    // Geographic & Territory fields:
    country: safeStringToArray,
    state: safeStringToArray,
    city: safeStringToArray,
    salesRegion: safeStringToArray,
    // Contact Info fields:
    contactRole: safeStringToArray,
    // Add more dropdown fields as needed
  };

  useEffect(() => {
    // Only process opportunity-specific parameters when on opportunity pages
    if (!isOpportunityPage) {
      console.log(
        "OpportunitySearchContext: Not on opportunity page, clearing filters"
      );
      setActiveFilters({});
      return;
    }

    // If we're on advanced search and it's the proposals tab, don't process any parameters
    if (
      location.pathname.includes("/advanced-search") &&
      searchParams.get("tab") === "proposals"
    ) {
      console.log(
        "OpportunitySearchContext: On proposals tab, clearing filters"
      );
      setActiveFilters({});
      return;
    }

    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      // Skip the tab parameter itself
      if (key === "tab") continue;

      // Only process parameters that don't start with 'proposal_' and are not proposal-specific fields
      if (
        value &&
        value.trim() !== "" &&
        !key.startsWith("proposal_") &&
        ![
          "proposalName",
          "proposalStatus",
          "proposalRep",
          "proposalApprovalStatus",
          "proposalId",
          "proposalCreatedDateFrom",
          "proposalCreatedDateTo",
          "proposalApprovalStages",
        ].includes(key)
      ) {
        if (dropdownFieldParsers[key]) {
          const parsedValue = dropdownFieldParsers[key](value);
          urlFilters[key] = parsedValue;
          console.log(`OpportunitySearchContext: Parsed ${key}:`, {
            original: value,
            parsed: parsedValue,
          });

          // Special debugging for Lead Status
          if (key === "leadStatus") {
            console.log(
              "OpportunitySearchContext: Lead Status special debugging:"
            );
            console.log("  Original value:", value);
            console.log("  Parsed value:", parsedValue);
            console.log("  Parser used:", dropdownFieldParsers[key].name);
          }
        } else {
          urlFilters[key] = value;
        }
      }
    }
    if (Object.keys(urlFilters).length > 0) {
      console.log(
        "OpportunitySearchContext: Setting active filters:",
        urlFilters
      );
      setActiveFilters(urlFilters);
    } else {
      console.log("OpportunitySearchContext: No URL filters to set");
    }
  }, [searchParams, isOpportunityPage, location.pathname]);

  const updateFilters = (newFilters, options = { updateUrl: true }) => {
    // Always store plain values in state
    const plainFilters = { ...newFilters };
    if (plainFilters.companyName && Array.isArray(plainFilters.companyName)) {
      plainFilters.companyName = plainFilters.companyName.map((v) =>
        v.replace(/^SW=/, "").replace(/~$/, "")
      );
    }
    if (
      plainFilters.companyNameBasic &&
      Array.isArray(plainFilters.companyNameBasic)
    ) {
      plainFilters.companyNameBasic = plainFilters.companyNameBasic.map((v) =>
        v.replace(/^SW=/, "").replace(/~$/, "")
      );
    }
    if (plainFilters.postalCode && Array.isArray(plainFilters.postalCode)) {
      plainFilters.postalCode = plainFilters.postalCode.map((v) =>
        v.replace(/^SW=/, "").replace(/~$/, "")
      );
    }
    if (plainFilters.contactPhone && Array.isArray(plainFilters.contactPhone)) {
      plainFilters.contactPhone = plainFilters.contactPhone.map((v) =>
        v.replace(/^SW=/, "").replace(/~$/, "")
      );
    }
    setActiveFilters(plainFilters);
    if (options.updateUrl && isOpportunityPage) {
      const params = new URLSearchParams();
      Object.entries(plainFilters).forEach(([key, value]) => {
        if (value && value.toString().trim() !== "") {
          let urlValue = value;
          if (dropdownFieldParsers[key] === parseIEStringToArray) {
            if (Array.isArray(value)) {
              urlValue = value.map((v) => `IE=${v}~`).join("");
            } else if (typeof value === "string" && !value.includes("IE=")) {
              urlValue = `IE=${value}~`;
            }
          } else if (dropdownFieldParsers[key] === safeStringToArray) {
            if (Array.isArray(value)) {
              urlValue = value.join(",");
            } else if (typeof value === "string") {
              urlValue = value;
            }
          } else if (dropdownFieldParsers[key] === getMultiSelectValue) {
            if (Array.isArray(value)) {
              urlValue = value.join(",");
            } else if (typeof value === "string") {
              urlValue = value;
            }
          } else if (dropdownFieldParsers[key] === parseSWStringToArray) {
            // Only format for URL, not for state
            if (Array.isArray(value)) {
              urlValue = value.map((v) => `SW=${v}~`).join("");
            } else if (typeof value === "string" && !value.includes("SW=")) {
              urlValue = `SW=${value}~`;
            }
          }
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
    }
  };

  const clearAllFilters = () => {
    console.log("OpportunitySearchContext: Clearing all filters");
    setActiveFilters({});
    if (isOpportunityPage) {
      // Clear all URL parameters except the tab parameter
      const newSearchParams = new URLSearchParams();
      const currentTab = searchParams.get("tab");
      if (currentTab) {
        newSearchParams.set("tab", currentTab);
      }
      console.log(
        "OpportunitySearchContext: Setting URL params to:",
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
    <OpportunitySearchContext.Provider value={value}>
      {children}
    </OpportunitySearchContext.Provider>
  );
};
