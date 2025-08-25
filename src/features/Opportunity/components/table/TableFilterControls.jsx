import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  RefreshCw,
  Search,
  LayoutGrid,
  List,
  Kanban,
  PanelRight,
  ArrowUpDown,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import SortOptionsDropdown from "./SortOptionsDropdown";
import SettingsPanel from "../../../../components/ui/SettingsPanel";

const TableFilterControls = ({
  filters,
  onFilterChange,
  view,
  onViewChange,
  onViewsClick,
  users = [],
  savedSearches = {
    allOpportunities: [],
    myOpportunities: [],
  },
  onRefresh,
  currentPage = 1,
  onNextPage,
  onPreviousPage,
  totalCount = 0,
  onAddOpportunity, // Add the new prop
}) => {
  const navigate = useNavigate();
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  const PROBABILITY_OPTIONS = [
    "10%",
    "20%",
    "30%",
    "40%",
    "50%",
    "60%",
    "70%",
    "80%",
    "90%",
    "100%",
  ];

  const [probDropdownOpen, setProbDropdownOpen] = useState(false);
  const probDropdownRef = useRef(null);

  // Rep dropdown state declarations
  const assignedRepDropdownRef = useRef(null);
  const [repDropdownOpen, setRepDropdownOpen] = useState(false);

  // Search/filter state for Probability and Rep dropdowns
  const [probabilitySearch, setProbabilitySearch] = useState("");
  const [repSearch, setRepSearch] = useState("");

  // Filtered options based on search
  const filteredProbabilities = PROBABILITY_OPTIONS.filter((prob) =>
    prob.toLowerCase().includes(probabilitySearch.toLowerCase())
  );
  const filteredReps = users.filter((user) =>
    user.display.toLowerCase().includes(repSearch.toLowerCase())
  );

  // Ensure filters.probability is always an array
  const selectedProbabilities = React.useMemo(() => {
    try {
      if (!filters?.probability) return [];
      if (Array.isArray(filters.probability)) {
        // Normalize array values to match option format (add % if missing)
        return filters.probability.map((val) => {
          const strVal = String(val);
          return strVal.includes("%") ? strVal : `${strVal}%`;
        });
      }
      if (typeof filters.probability === "string") {
        if (filters.probability === "All" || filters.probability === "")
          return [];

        // Handle IE format (e.g., "IE=20~IE=30~")
        if (filters.probability.includes("IE=")) {
          return filters.probability
            .split("~")
            .filter(Boolean)
            .map((item) => item.replace("IE=", ""))
            .filter(Boolean)
            .map((val) => (val.includes("%") ? val : `${val}%`));
        }

        // Handle comma-separated format
        return filters.probability
          .split(",")
          .filter(Boolean)
          .map((val) => (val.includes("%") ? val : `${val}%`));
      }
      return [];
    } catch (error) {
      console.error("Error parsing probability filter:", error);
      return [];
    }
  }, [filters?.probability]);

  const handleStatusChange = (e) => {
    onFilterChange("quickStatus", e.target.value);
  };
  const handleProbabilityTagRemove = (value) => {
    try {
      // Remove % for comparison and storage
      const cleanValue = value.replace("%", "");
      const updated = selectedProbabilities
        .map((v) => v.replace("%", ""))
        .filter((v) => v !== cleanValue);
      onFilterChange("probability", updated);
    } catch (error) {
      console.error("Error removing probability tag:", error);
    }
  };

  const handleProbabilityCheckbox = (value) => {
    try {
      if (value === "ALL_PROB") {
        // Selecting 'All Probabilities' clears all others
        onFilterChange("probability", []);
        return;
      }
      // If 'All Probabilities' is currently selected (no probabilities selected),
      // selecting any individual probability should only select that one
      if (selectedProbabilities.length === 0) {
        // Store value without % for API consistency
        const cleanValue = value.replace("%", "");
        onFilterChange("probability", [cleanValue]);
        return;
      }
      // Otherwise, add/remove the value as usual
      let updated = selectedProbabilities.map((v) => v.replace("%", "")); // Remove % for comparison
      const cleanValue = value.replace("%", "");
      if (updated.includes(cleanValue)) {
        updated = updated.filter((v) => v !== cleanValue);
      } else {
        updated = [...updated, cleanValue];
      }
      onFilterChange("probability", updated);
    } catch (error) {
      console.error("Error handling probability checkbox:", error);
    }
  };

  const handleProbabilityDropdownToggle = () => {
    setProbDropdownOpen((open) => !open);
  };

  const handleClickOutside = (e) => {
    // Check if click is outside both the button and the dropdown for probability
    const isOutsideProbButton =
      probDropdownRef.current && !probDropdownRef.current.contains(e.target);
    const isOutsideProbDropdown = !e.target.closest(
      "[data-probability-dropdown]"
    );

    if (isOutsideProbButton && isOutsideProbDropdown) {
      setProbDropdownOpen(false);
    }

    // Check if click is outside both the button and the dropdown for rep
    const isOutsideRepButton =
      assignedRepDropdownRef.current &&
      !assignedRepDropdownRef.current.contains(e.target);
    const isOutsideRepDropdown = !e.target.closest("[data-rep-dropdown]");

    if (isOutsideRepButton && isOutsideRepDropdown) {
      setRepDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (probDropdownOpen || repDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [probDropdownOpen, repDropdownOpen]);

  // Utility to summarize selected values for button
  const getProbabilitySummary = (selected) => {
    if (!selected || selected.length === 0) return "All Probabilities";
    if (selected.length === 1) return selected[0];
    return selected.join(", ");
  };

  const selectedReps = React.useMemo(() => {
    try {
      console.log(
        "TableFilterControls: Processing assignedRep filter:",
        filters?.assignedRep
      );
      if (!filters?.assignedRep) return [];
      if (Array.isArray(filters.assignedRep)) {
        console.log(
          "TableFilterControls: assignedRep is array:",
          filters.assignedRep
        );
        return filters.assignedRep;
      }
      if (typeof filters.assignedRep === "string") {
        if (filters.assignedRep === "All Reps" || filters.assignedRep === "")
          return [];

        // Handle IE format (e.g., "IE=178~IE=170~")
        if (filters.assignedRep.includes("IE=")) {
          const parsed = filters.assignedRep
            .split("~")
            .filter(Boolean)
            .map((item) => item.replace("IE=", ""))
            .filter(Boolean);
          console.log(
            "TableFilterControls: Parsed IE format assignedRep:",
            parsed
          );
          return parsed;
        }

        // Handle comma-separated format
        const parsed = filters.assignedRep.split(",").filter(Boolean);
        console.log(
          "TableFilterControls: Parsed comma-separated assignedRep:",
          parsed
        );
        return parsed;
      }
      return [];
    } catch (error) {
      console.error("Error parsing assignedRep filter:", error);
      return [];
    }
  }, [filters?.assignedRep]);

  const handleRepDropdownToggle = () => {
    setRepDropdownOpen((open) => !open);
  };

  const handleRepTagRemove = (value) => {
    try {
      const updated = selectedReps.filter((v) => v !== value);
      onFilterChange("assignedRep", updated);
    } catch (error) {
      console.error("Error removing rep tag:", error);
    }
  };

  const handleRepCheckbox = (value) => {
    try {
      // If user selects 'All Reps', clear all others
      if (value === "ALL_REPS") {
        onFilterChange("assignedRep", []);
        return;
      }

      // If 'All Reps' is currently selected (no specific reps selected),
      // or if we're selecting a new rep, remove 'ALL_REPS' and add the new value
      let updated = selectedReps.filter((v) => v !== "ALL_REPS");

      if (updated.includes(value)) {
        // If the value is already selected, remove it
        updated = updated.filter((v) => v !== value);
      } else {
        // If the value is not selected, add it
        updated = [...updated, value];
      }

      onFilterChange("assignedRep", updated);
    } catch (error) {
      console.error("Error handling rep checkbox:", error);
    }
  };

  const handleSearchClick = () => {
    console.log("Search button clicked, navigating to /advanced-search");
    try {
      // Navigate to advanced search with opportunities tab and preserve current filters
      const advancedSearchParams = new URLSearchParams();

      // Copy all current filters to preserve them, but exclude default "All Opportunities" status
      for (const [key, value] of Object.entries(filters)) {
        // Skip empty values, empty arrays, "All" selections, and default "All Opportunities" status
        if (
          value &&
          value.toString().trim() !== "" &&
          !(key === "status" && value === "All Opportunities")
        ) {
          // Handle array values properly for Advanced Search
          if (Array.isArray(value)) {
            if (value.length > 0) {
              // For multi-select fields, join with commas
              advancedSearchParams.set(key, value.join(","));
            }
            // Skip empty arrays (like when "All Reps" is selected)
          } else {
            // For single values, pass as is
            advancedSearchParams.set(key, value);
          }
        }
      }

      // Set the tab parameter to opportunities
      advancedSearchParams.set("tab", "opportunities");

      const finalUrl = `/advanced-search?${advancedSearchParams.toString()}`;
      console.log(
        "Navigating to advanced search with opportunities tab:",
        finalUrl
      );
      console.log("Quick Filter filters being passed:", filters);
      navigate(finalUrl);
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback: just refresh the current data if navigation fails
      onRefresh?.();
    }
  };
  const handleRefreshClick = () => {
    console.log("Refresh button clicked");
    onRefresh?.();
  };
  const handleSetDefaultTable = () => {
    localStorage.setItem("pipeline_default_view", "table");
    console.log("Default view set to table");
  };
  const handleSetDefaultSearch = () => {
    localStorage.setItem("pipeline_default_view", "search");
    console.log("Default view set to search page");
  };
  const handleSettingsClick = () => {
    setIsSettingsPanelOpen(true);
  };

  // Utility to summarize selected values for button
  const getRepSummary = (selected, users) => {
    if (!selected || selected.length === 0) return "All Reps";
    if (selected.length === 1) {
      // Find user by matching the numeric value with the ICODE format
      const user = users.find((u) => {
        const numericValue = u.value.replace("IE=", "").replace("~", "");
        return numericValue === selected[0];
      });
      return user ? user.display : selected[0];
    }
    return selected
      .map((val) => {
        // Find user by matching the numeric value with the ICODE format
        const user = users.find((u) => {
          const numericValue = u.value.replace("IE=", "").replace("~", "");
          return numericValue === val;
        });
        return user ? user.display : val;
      })
      .join(", ");
  };

  return (
    <>
      <TooltipProvider delayDuration={200} skipDelayDuration={100}>
        <div className="p-3 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between gap-[15%] min-w-0">
            {/* Left Section: Filter Controls */}
            <div
              className="flex items-center min-w-0 flex-1"
              style={{ justifyContent: "inherit" }}
            >
              <div className="border border-gray-300 rounded-md flex min-w-0 flex-shrink overflow-hidden bg-white shadow-sm">
                <select
                  className="bg-white h-9 px-3 text-sm border-r border-gray-300 outline-none min-w-[120px] max-w-[200px] appearance-none cursor-pointer focus:bg-blue-50"
                  value={filters?.quickStatus || "All Opportunities"}
                  onChange={handleStatusChange}
                >
                  <optgroup label="All Opportunities">
                    {savedSearches.allOpportunities &&
                      savedSearches.allOpportunities.map((search) => (
                        <option key={search.ID} value={search.Name}>
                          {search.Name}
                        </option>
                      ))}
                  </optgroup>
                  {savedSearches.myOpportunities &&
                    savedSearches.myOpportunities.length > 0 && (
                      <optgroup label="My Opportunities">
                        {savedSearches.myOpportunities.map((search) => (
                          <option key={search.ID} value={search.Name}>
                            {search.Name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                </select>

                {/* Probability Multi-select Dropdown */}
                <div
                  className="relative border-r border-gray-300 flex items-center bg-white min-w-0"
                  ref={probDropdownRef}
                >
                  <button
                    type="button"
                    className="flex items-center h-9 text-sm outline-none bg-white w-full justify-between px-3 hover:bg-gray-50 transition-colors min-w-[100px] max-w-[140px] focus:bg-blue-50"
                    onClick={handleProbabilityDropdownToggle}
                    aria-haspopup="listbox"
                    aria-expanded={probDropdownOpen}
                  >
                    <span
                      className="truncate block text-left flex-1"
                      title={getProbabilitySummary(selectedProbabilities)}
                    >
                      {getProbabilitySummary(selectedProbabilities)}
                    </span>
                    {probDropdownOpen ? (
                      <ChevronUp className="h-4 w-4 ml-2 flex-shrink-0 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Assigned Rep Multi-select Dropdown */}
                <div
                  className="relative flex items-center bg-white min-w-0"
                  ref={assignedRepDropdownRef}
                >
                  <button
                    type="button"
                    className="flex items-center h-9 text-sm outline-none bg-white w-full justify-between px-3 hover:bg-gray-50 transition-colors min-w-[80px] max-w-[120px] focus:bg-blue-50"
                    onClick={handleRepDropdownToggle}
                    aria-haspopup="listbox"
                    aria-expanded={repDropdownOpen}
                  >
                    <span
                      className="truncate block text-left flex-1"
                      title={getRepSummary(selectedReps, users)}
                    >
                      {getRepSummary(selectedReps, users)}
                    </span>
                    {repDropdownOpen ? (
                      <ChevronUp className="h-4 w-4 ml-2 flex-shrink-0 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Pagination Controls - Compact for split screen */}
              <div className="flex items-center gap-2 flex-shrink-0 bg-white rounded-md px-3 py-1  shadow-sm">
                <div className="text-sm text-gray-600 whitespace-nowrap">
                  {(() => {
                    const pageSize = 25;
                    const start = (currentPage - 1) * pageSize + 1;
                    const end = Math.min(currentPage * pageSize, totalCount);
                    return totalCount > 0
                      ? `${start}-${end} of ${totalCount}`
                      : "No data";
                  })()}
                </div>

                <div className="flex border-l border-gray-200 pl-2 ml-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-blue-50"
                        onClick={onPreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      Previous page
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-blue-50"
                        onClick={onNextPage}
                        disabled={currentPage >= Math.ceil(totalCount / 25)}
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      Next page
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Right Section: Action Buttons - More compact for split screen */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Primary Actions */}
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAddOpportunity}
                      className="h-8 w-8 p-0 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    Create opportunity
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefreshClick}
                      className="h-8 w-8 p-0 rounded"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    Refresh data
                  </TooltipContent>
                </Tooltip>

                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSettingsClick}
                          className="h-8 w-8 p-0 rounded"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={5}>
                        Settings
                      </TooltipContent>
                    </Tooltip>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-56">
                    <ContextMenuItem onClick={handleSetDefaultTable}>
                      Set Table as Default View
                    </ContextMenuItem>
                    <ContextMenuItem onClick={handleSetDefaultSearch}>
                      Set Search Page as Default View
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>

              {/* View Toggle - Compact */}
              <div className="flex items-center border border-gray-200 rounded-md">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={view === "table" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onViewChange("table")}
                      className="h-8 w-8 rounded-none p-0"
                    >
                      <List className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    Table view
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={view === "cards" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onViewChange("cards")}
                      className="h-8 w-8 rounded-none p-0"
                    >
                      <LayoutGrid className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    Card view
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={view === "kanban" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onViewChange("kanban")}
                      className="h-8 w-8 rounded-none p-0"
                    >
                      <Kanban className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    Kanban view
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={view === "split" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onViewChange("split")}
                      className="h-8 w-8 rounded-none p-0"
                    >
                      <PanelRight className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    Split view
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={handleSearchClick}
                      className="gap-1 text-white h-8 px-2 bg-ocean-500 hover:bg-ocean-600 border-ocean-500 text-xs"
                    >
                      <Search className="h-3 w-3" />
                      Search
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    Advanced search
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onViewsClick}
                      className="h-8 px-2 text-xs"
                    >
                      Views
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    Manage custom views
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Dropdown containers remain the same but with improved positioning */}
          {repDropdownOpen && (
            <div
              className="fixed z-[9999] bg-white border border-gray-300 rounded-md shadow-xl max-h-72 overflow-y-auto mt-1"
              role="listbox"
              data-rep-dropdown
              style={{
                minWidth: "220px",
                width: Math.max(
                  assignedRepDropdownRef.current
                    ? assignedRepDropdownRef.current.offsetWidth
                    : 220,
                  220
                ),
                top: assignedRepDropdownRef.current
                  ? assignedRepDropdownRef.current.getBoundingClientRect()
                      .bottom + 4
                  : 0,
                left: assignedRepDropdownRef.current
                  ? Math.max(
                      assignedRepDropdownRef.current.getBoundingClientRect()
                        .left,
                      8
                    )
                  : 0,
              }}
            >
              {/* Selected tags/chips at the top */}
              {selectedReps.length > 0 && (
                <div className="flex flex-wrap gap-1 px-3 pt-3 pb-1 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                  {selectedReps.map((rep) => {
                    // Find user by matching the numeric value with the ICODE format
                    const user = users.find((u) => {
                      const numericValue = u.value
                        .replace("IE=", "")
                        .replace("~", "");
                      return numericValue === rep;
                    });
                    const displayName = user ? user.display : rep;
                    return (
                      <span
                        key={rep}
                        className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded mr-1 border border-blue-200"
                      >
                        {displayName}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRepTagRemove(rep);
                          }}
                        />
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="px-3 py-2">
                {/* Search input for Assigned Rep */}
                <input
                  type="text"
                  placeholder="Search reps..."
                  value={repSearch}
                  onChange={(e) => setRepSearch(e.target.value)}
                  className="w-full mb-2 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="rep-all"
                    checked={selectedReps.length === 0}
                    onChange={() => handleRepCheckbox("ALL_REPS")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="rep-all"
                    className="ml-2 text-sm cursor-pointer"
                  >
                    All Reps
                  </label>
                </div>
                {filteredReps && filteredReps.length > 0 ? (
                  filteredReps.map((user) => (
                    <div
                      key={user.id || user.value}
                      className="flex items-center mb-1"
                    >
                      <input
                        type="checkbox"
                        id={`rep-${user.value}`}
                        checked={selectedReps.includes(
                          user.value.replace("IE=", "").replace("~", "")
                        )}
                        onChange={() => {
                          const numericValue = user.value
                            .replace("IE=", "")
                            .replace("~", "");
                          handleRepCheckbox(numericValue);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`rep-${user.value}`}
                        className="ml-2 text-sm cursor-pointer"
                      >
                        {user.display}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">No reps found</div>
                )}
              </div>
            </div>
          )}

          {/* Probability Dropdown Menu */}
          {probDropdownOpen && (
            <div
              className="fixed z-[9999] bg-white border border-gray-300 rounded-md shadow-xl max-h-72 overflow-y-auto mt-1"
              role="listbox"
              data-probability-dropdown
              style={{
                minWidth: "220px",
                width: Math.max(
                  probDropdownRef.current
                    ? probDropdownRef.current.offsetWidth
                    : 220,
                  220
                ),
                top: probDropdownRef.current
                  ? probDropdownRef.current.getBoundingClientRect().bottom + 4
                  : 0,
                left: probDropdownRef.current
                  ? Math.max(
                      probDropdownRef.current.getBoundingClientRect().left,
                      8
                    )
                  : 0,
              }}
            >
              {/* Selected tags/chips at the top */}
              {selectedProbabilities.length > 0 && (
                <div className="flex flex-wrap gap-1 px-3 pt-3 pb-1 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                  {selectedProbabilities.map((prob) => (
                    <span
                      key={prob}
                      className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded mr-1 border border-blue-200"
                    >
                      {prob}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProbabilityTagRemove(prob);
                        }}
                      />
                    </span>
                  ))}
                </div>
              )}
              <div className="px-3 py-2">
                {/* Search input for Probability */}
                <input
                  type="text"
                  placeholder="Search probabilities..."
                  value={probabilitySearch}
                  onChange={(e) => setProbabilitySearch(e.target.value)}
                  className="w-full mb-2 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="probability-all"
                    checked={selectedProbabilities.length === 0}
                    onChange={() => handleProbabilityCheckbox("ALL_PROB")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="probability-all"
                    className="ml-2 text-sm cursor-pointer"
                  >
                    All Probabilities
                  </label>
                </div>
                {filteredProbabilities.map((prob) => (
                  <div key={prob} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`probability-${prob}`}
                      checked={selectedProbabilities.includes(prob)}
                      onChange={() => handleProbabilityCheckbox(prob)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`probability-${prob}`}
                      className="ml-2 text-sm cursor-pointer"
                    >
                      {prob}
                    </label>
                  </div>
                ))}
                {filteredProbabilities.length === 0 && (
                  <div className="text-gray-400 text-sm">
                    No probabilities found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
      />
    </>
  );
};

export default TableFilterControls;
