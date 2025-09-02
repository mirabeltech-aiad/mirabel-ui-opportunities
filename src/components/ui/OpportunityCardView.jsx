import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, User, Building2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableFilterControls from "../../features/Opportunity/components/table/TableFilterControls";
import TableStatusBadge from "../../features/Opportunity/components/table/TableStatusBadge";

const OpportunityCardView = ({
  opportunities,
  view,
  onViewChange,
  filters,
  onFilterChange,
  users = [],
  onRefresh,
}) => {
  const navigate = useNavigate();

  const handleEditOpportunity = (opportunityId, e) => {
    if (e) {
      e.stopPropagation();
    }
    navigate(`/edit-opportunity/${opportunityId}`);
  };

  const handleCardDoubleClick = (opportunityId) => {
    navigate(`/edit-opportunity/${opportunityId}`);
  };
  // Apply filters to opportunities - this should match the server-side filtering
  // Since we're getting filtered data from the API, we mainly need to display it
  const filteredOpportunities = opportunities; // API already filters based on the filters passed

  const formatAmount = (amount) => {
    // Handle null, undefined, or empty values
    if (!amount && amount !== 0) return "0";

    // Convert to string for processing
    let amountStr = String(amount);

    // Remove ALL currency symbols, commas, and spaces
    amountStr = amountStr.replace(/[$,\s]/g, "").trim();

    // Try to parse as number
    const numAmount = parseFloat(amountStr);

    // If it's a valid number, format it (without dollar sign since we have the icon)
    if (!isNaN(numAmount)) {
      return numAmount.toLocaleString();
    }

    // If we can't parse it, return 0
    return "0";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm">
      {/* Filter Controls */}
      <TableFilterControls
        filters={filters}
        onFilterChange={onFilterChange}
        totalItems={filteredOpportunities.length}
        view={view}
        onViewChange={onViewChange}
        users={users}
        onRefresh={onRefresh}
      />

      {/* Cards Grid */}
      <div className="p-4 bg-neutral-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOpportunities.map((opportunity) => (
            <Card
              key={opportunity.id}
              className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200 flex flex-col h-full"
              onDoubleClick={() => handleCardDoubleClick(opportunity.id)}
            >
              <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-blue-800 min-h-[2.5rem] flex items-start">
                    <div className="line-clamp-2">
                      {opportunity.opportunityName || opportunity.name}
                    </div>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleEditOpportunity(opportunity.id, e)}
                    className="h-6 w-6 flex-shrink-0"
                    title="Edit opportunity"
                  >
                    <Edit className="h-3 w-3 text-gray-500 hover:text-blue-600" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 h-5">
                  <Building2 className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 font-medium truncate">
                    {opportunity.companyName || opportunity.company}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0 flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                  {/* Amount - Fixed height row */}
                  <div className="flex items-center gap-2 h-6">
                    <DollarSign className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-lg font-bold text-emerald-600">
                      {formatAmount(opportunity.amount)}
                    </span>
                  </div>

                  {/* Assigned Rep - Fixed height row */}
                  <div className="flex items-center gap-2 h-6">
                    <User className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">
                      {opportunity.assignedRep}
                    </span>
                  </div>

                  {/* Close Date - Fixed height row */}
                  <div className="flex items-center gap-2 h-6">
                    <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      {opportunity.projCloseDate}
                    </span>
                  </div>
                </div>

                {/* Bottom section with fixed positioning */}
                <div className="mt-3 pt-2">
                  {/* Stage and Status - Fixed height container */}
                  <div className="flex justify-between items-center min-h-[24px]">
                    <Badge
                      variant="outline"
                      className="text-xs border-indigo-200 text-indigo-700"
                    >
                      {opportunity.stage}
                    </Badge>
                    {(() => {
                      // Don't show status badge if it's redundant with the stage
                      if (!opportunity.status) return null;
                      const status = opportunity.status.toLowerCase();
                      const stage = opportunity.stage?.toLowerCase() || "";

                      // Hide status if:
                      // - Stage is "Closed Won" and status is "Won"
                      // - Stage is "Closed Lost" and status is "Lost"
                      // - Stage contains the status (e.g., stage includes the status word)
                      if (
                        (stage === "closed won" && status === "won") ||
                        (stage === "closed lost" && status === "lost") ||
                        stage.includes(status)
                      ) {
                        return null;
                      }

                      return <TableStatusBadge status={opportunity.status} />;
                    })()}
                  </div>

                  {/* Probability container - Always rendered with fixed height */}
                  <div className="h-5 mt-2">
                    {(() => {
                      const prob = opportunity.probability;
                      if (
                        !prob ||
                        prob === "0" ||
                        prob === 0 ||
                        prob === "" ||
                        prob === null
                      ) {
                        return null;
                      }
                      return (
                        <div className="text-xs text-gray-500">
                          <span className="text-cyan-600 font-medium">
                            {prob}%
                          </span>{" "}
                          probability
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No opportunities match the current filters
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {filteredOpportunities.length} opportunities
        </div>
      </div>
    </div>
  );
};

export default OpportunityCardView;
