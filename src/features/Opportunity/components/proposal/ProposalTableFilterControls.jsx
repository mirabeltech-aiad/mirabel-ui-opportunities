import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  RefreshCw,
  Settings,
  ArrowUpDown,
  Table,
  LayoutGrid,
  PanelRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProposalSortOptionsDropdown from "./ProposalSortOptionsDropdown";
import { userService } from "@/features/Opportunity/Services/userService";

const ProposalTableFilterControls = ({
  filters = {}, // Add default empty object
  onFilterChange,
  totalItems,
  view,
  onViewChange,
  onViewsClick,
  onRefresh,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  sortConfig,
  onSort,
}) => {
  const navigate = useNavigate();
  const [proposalReps, setProposalReps] = useState([]);

  // Fetch proposal reps from API
  useEffect(() => {
    const fetchProposalReps = async () => {
      try {
        const reps = await userService.getUsersForDropdown();
        setProposalReps(reps);
      } catch (error) {
        console.error("Failed to fetch proposal reps:", error);
      }
    };

    fetchProposalReps();
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleSearchClick = () => {
    // Navigate to advanced search with proposals tab and preserve current search params
    const currentSearchParams = new URLSearchParams(window.location.search);
    currentSearchParams.set("tab", "proposals");

    // Convert proposal-specific parameters to the format expected by advanced search
    const advancedSearchParams = new URLSearchParams();

    // Copy all current search parameters to preserve them
    for (const [key, value] of currentSearchParams.entries()) {
      if (key !== "tab") {
        // Don't copy the tab parameter as we're setting it explicitly
        advancedSearchParams.set(key, value);
      }
    }

    // Set the tab parameter
    advancedSearchParams.set("tab", "proposals");

    const finalUrl = `/advanced-search?${advancedSearchParams.toString()}`;
    console.log("Navigating to advanced search with proposals tab:", finalUrl);
    navigate(finalUrl);
  };

  const proposalRepOptions = [
    { value: "all", label: "All Proposal Reps" },
    ...proposalReps.map((rep) => ({
      value: rep.value,
      label: rep.display,
    })),
  ];

  // Multi-select logic for Proposal Rep (like Opportunity Grid)
  const [proposalRepDropdownOpen, setProposalRepDropdownOpen] = useState(false);
  const proposalRepDropdownRef = React.useRef(null);
  const selectedProposalReps = React.useMemo(() => {
    if (!filters?.proposalRep) return [];
    if (Array.isArray(filters.proposalRep)) return filters.proposalRep;
    if (typeof filters.proposalRep === "string") {
      if (filters.proposalRep === "all" || filters.proposalRep === "")
        return [];

      // Handle IE format (e.g., "IE=178~IE=170~")
      if (filters.proposalRep.includes("IE=")) {
        return filters.proposalRep
          .split("~")
          .filter(Boolean)
          .map((v) => v.replace("IE=", ""))
          .filter(Boolean);
      }

      // Handle comma-separated format (e.g., "178,170")
      if (filters.proposalRep.includes(",")) {
        return filters.proposalRep.split(",").filter(Boolean);
      }

      // Single value
      return [filters.proposalRep];
    }
    return [];
  }, [filters?.proposalRep]);

  const handleProposalRepDropdownToggle = () => {
    setProposalRepDropdownOpen((open) => !open);
  };

  const handleProposalRepTagRemove = (value) => {
    const updated = selectedProposalReps.filter((v) => v !== value);
    onFilterChange("proposalRep", updated);
  };

  const handleProposalRepCheckbox = (value) => {
    if (value === "ALL_PROPOSAL_REPS") {
      onFilterChange("proposalRep", []);
      return;
    }
    let updated = selectedProposalReps.filter((v) => v !== "ALL_PROPOSAL_REPS");
    if (updated.includes(value)) {
      updated = updated.filter((v) => v !== value);
    } else {
      updated = [...updated, value];
    }
    onFilterChange("proposalRep", updated);
  };

  // Utility to summarize selected values for button
  const getProposalRepSummary = (selected, reps) => {
    if (!selected || selected.length === 0) return "All Proposal Reps";
    if (selected.length === 1) {
      const rep = reps.find((r) => {
        const numericValue = r.value.replace("IE=", "").replace("~", "");
        return numericValue === selected[0];
      });
      return rep ? rep.label : selected[0];
    }
    return selected
      .map((val) => {
        const rep = reps.find((r) => {
          const numericValue = r.value.replace("IE=", "").replace("~", "");
          return numericValue === val;
        });
        return rep ? rep.label : val;
      })
      .join(", ");
  };

  // Search/filter state for Proposal Rep dropdown
  const [proposalRepSearch, setProposalRepSearch] = useState("");

  // Filtered reps based on search
  const filteredProposalReps = proposalReps.filter((rep) =>
    rep.display.toLowerCase().includes(proposalRepSearch.toLowerCase())
  );

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutsideButton =
        proposalRepDropdownRef.current &&
        !proposalRepDropdownRef.current.contains(e.target);
      const isOutsideDropdown = !e.target.closest(
        "[data-proposal-rep-dropdown]"
      );
      if (isOutsideButton && isOutsideDropdown) {
        setProposalRepDropdownOpen(false);
      }
    };
    if (proposalRepDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [proposalRepDropdownOpen]);

  return (
    <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* Multi-select Proposal Rep Filter (custom, like Opportunity Grid) */}
        <div
          className="relative min-w-[200px] flex items-center px-2 bg-white"
          ref={proposalRepDropdownRef}
        >
          <button
            type="button"
            className="flex items-center h-9 text-sm outline-none bg-white w-full justify-between px-2 rounded focus:ring-2 focus:ring-blue-400 border border-gray-300 hover:border-blue-300 transition-colors"
            onClick={handleProposalRepDropdownToggle}
            aria-haspopup="listbox"
            aria-expanded={proposalRepDropdownOpen}
            style={{ minWidth: 180, maxWidth: 260 }}
          >
            <span
              className="truncate block text-left w-full"
              title={getProposalRepSummary(
                selectedProposalReps,
                proposalRepOptions
              )}
            >
              {getProposalRepSummary(selectedProposalReps, proposalRepOptions)}
            </span>
            {proposalRepDropdownOpen ? (
              <ChevronUp className="h-4 w-4 ml-2 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
            )}
          </button>
          {proposalRepDropdownOpen && (
            <div
              className="fixed z-[9999] bg-white border border-gray-300 rounded-md shadow-xl max-h-72 overflow-y-auto mt-1"
              role="listbox"
              data-proposal-rep-dropdown
              style={{
                minWidth: "220px",
                width: proposalRepDropdownRef.current
                  ? proposalRepDropdownRef.current.offsetWidth
                  : 220,
                top: proposalRepDropdownRef.current
                  ? proposalRepDropdownRef.current.getBoundingClientRect()
                      .bottom + 4
                  : 0,
                left: proposalRepDropdownRef.current
                  ? proposalRepDropdownRef.current.getBoundingClientRect().left
                  : 0,
              }}
            >
              {/* Selected tags/chips at the top */}
              {selectedProposalReps.length > 0 && (
                <div className="flex flex-wrap gap-1 px-3 pt-3 pb-1 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                  {selectedProposalReps.map((rep) => {
                    const repObj = proposalRepOptions.find((r) => {
                      const numericValue = r.value
                        .replace("IE=", "")
                        .replace("~", "");
                      return numericValue === rep;
                    });
                    const displayName = repObj ? repObj.label : rep;
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
                            handleProposalRepTagRemove(rep);
                          }}
                        />
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="px-3 py-2">
                {/* Search input for Proposal Rep */}
                <input
                  type="text"
                  placeholder="Search reps..."
                  value={proposalRepSearch}
                  onChange={(e) => setProposalRepSearch(e.target.value)}
                  className="w-full mb-2 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="proposal-rep-all"
                    checked={selectedProposalReps.length === 0}
                    onChange={() =>
                      handleProposalRepCheckbox("ALL_PROPOSAL_REPS")
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="proposal-rep-all"
                    className="ml-2 text-sm cursor-pointer"
                  >
                    All Proposal Reps
                  </label>
                </div>
                {filteredProposalReps && filteredProposalReps.length > 0 ? (
                  filteredProposalReps.map((rep) => (
                    <div
                      key={rep.id || rep.value}
                      className="flex items-center mb-1"
                    >
                      <input
                        type="checkbox"
                        id={`proposal-rep-${rep.value}`}
                        checked={selectedProposalReps.includes(
                          rep.value.replace("IE=", "").replace("~", "")
                        )}
                        onChange={() => {
                          const numericValue = rep.value
                            .replace("IE=", "")
                            .replace("~", "");
                          handleProposalRepCheckbox(numericValue);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`proposal-rep-${rep.value}`}
                        className="ml-2 text-sm cursor-pointer"
                      >
                        {rep.display}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">No reps found</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          {(() => {
            const start = (currentPage - 1) * pageSize + 1;
            const end = Math.min(currentPage * pageSize, totalItems);
            return totalItems > 0
              ? `${start}-${end} of ${totalItems}`
              : "No proposals found";
          })()}
        </div>

        <div className="flex">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage <= 1}
            className="h-9 w-9 p-0 rounded-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="h-9 w-9 p-0 rounded-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Compact plus icon to match Opportunities filters */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/add-opportunity")}
          className="h-9 w-9 p-0 rounded-sm"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="h-9 w-9 p-0 rounded-sm"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-sm">
          <Settings className="h-4 w-4" />
        </Button>

        <ProposalSortOptionsDropdown sortConfig={sortConfig} onSort={onSort}>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 rounded-sm"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </ProposalSortOptionsDropdown>

        <div className="flex items-center border border-gray-200 rounded-sm">
          <Button
            variant={view === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("table")}
            className="h-9 w-9 rounded-none p-0"
          >
            <Table className="h-4 w-4" />
          </Button>

          <Button
            variant={view === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("cards")}
            className="h-9 w-9 rounded-none p-0"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>

          <Button
            variant={view === "split" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("split")}
            className="h-9 w-9 rounded-none p-0"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500 h-9 px-3 rounded-sm"
          onClick={handleSearchClick}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onViewsClick}
          className="h-9 px-3 rounded-sm"
        >
          Views
        </Button>
      </div>
    </div>
  );
};

export default ProposalTableFilterControls;
