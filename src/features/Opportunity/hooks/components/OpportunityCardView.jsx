
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, User, Building2, MoreVertical } from "lucide-react";
import TableFilterControls from "./table/TableFilterControls";
import TableStatusBadge from "./table/TableStatusBadge";

const OpportunityCardView = ({
  opportunities,
  view,
  onViewChange,
  filters,
  onFilterChange,
  users = [],
  onRefresh
}) => {
  // Apply filters to opportunities - this should match the server-side filtering
  // Since we're getting filtered data from the API, we mainly need to display it
  const filteredOpportunities = opportunities; // API already filters based on the filters passed

  const formatAmount = (amount) => {
    // Handle null, undefined, or empty values
    if (!amount) return '$0';
    
    // Convert to string for processing
    const amountStr = String(amount);
    
    // If it already has a dollar sign, remove it first
    const cleanAmount = amountStr.replace(/^\$/, '');
    
    // Try to parse as number
    const numAmount = parseFloat(cleanAmount.replace(/,/g, ''));
    
    // If it's a valid number, format it
    if (!isNaN(numAmount)) {
      return `$${numAmount.toLocaleString()}`;
    }
    
    // If we can't parse it, return as-is but ensure single dollar sign
    return amountStr.startsWith('$') ? amountStr : `$${amountStr}`;
  };

  return <div className="bg-white border border-gray-200 rounded-md shadow-sm">
      {/* Filter Controls */}
      <TableFilterControls filters={filters} onFilterChange={onFilterChange} totalItems={filteredOpportunities.length} view={view} onViewChange={onViewChange} users={users} onRefresh={onRefresh} />
      
      {/* Cards Grid */}
      <div className="p-4 bg-neutral-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOpportunities.map(opportunity => <Card key={opportunity.id} className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200 flex flex-col h-full">
              <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-900 min-h-[2.5rem] flex items-start">
                    <div className="line-clamp-2">{opportunity.opportunityName || opportunity.name}</div>
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 h-5">
                  <Building2 className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 font-medium truncate">{opportunity.companyName || opportunity.company}</span>
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
                    <span className="text-sm text-gray-600 truncate">{opportunity.assignedRep}</span>
                  </div>

                  {/* Close Date - Fixed height row */}
                  <div className="flex items-center gap-2 h-6">
                    <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{opportunity.projCloseDate}</span>
                  </div>
                </div>

                {/* Bottom section with fixed positioning */}
                <div className="mt-4 pt-2 space-y-2">
                  {/* Stage and Status */}
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs border-indigo-200 text-indigo-700">
                      {opportunity.stage}
                    </Badge>
                    <TableStatusBadge status={opportunity.status} />
                  </div>

                  {/* Probability */}
                  {opportunity.probability && <div className="text-xs text-gray-500 h-4">
                      <span className="text-cyan-600 font-medium">{opportunity.probability}%</span> probability
                    </div>}
                </div>
              </CardContent>
            </Card>)}
        </div>
        
        {filteredOpportunities.length === 0 && <div className="text-center py-8 text-gray-500">
            No opportunities match the current filters
          </div>}
      </div>
      
      {/* Footer */}
      <div className="p-2 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {filteredOpportunities.length} opportunities
        </div>
      </div>
    </div>;
};

export default OpportunityCardView;
