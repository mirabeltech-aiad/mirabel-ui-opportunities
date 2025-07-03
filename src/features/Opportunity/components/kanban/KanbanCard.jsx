
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { Badge } from "@OpportunityComponents/ui/badge";
import { Button } from "@OpportunityComponents/ui/button";
import { Calendar, DollarSign, User, Building2, MoreVertical } from "lucide-react";

const KanbanCard = ({ opportunity, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'text-blue-700 border-blue-300';
      case 'Closed': return 'text-green-700 border-green-300';
      case 'Won': return 'text-green-700 border-green-300';
      case 'Lost': return 'text-red-700 border-red-300';
      case 'Draft': return 'text-gray-700 border-gray-300';
      default: return 'text-gray-700 border-gray-300';
    }
  };

  return (
    <Draggable draggableId={opportunity.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 ${snapshot.isDragging ? 'opacity-50' : ''}`}
        >
          <Card className="cursor-pointer hover:shadow-md transition-shadow bg-white border border-gray-200">
            <CardHeader className="pb-1 p-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {opportunity.opportunityName}
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-5 w-5 flex-shrink-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Building2 className="h-3 w-3 text-indigo-500" />
                <span className="text-xs text-gray-600 font-medium">{opportunity.companyName}</span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 px-2 pb-1.5 space-y-0.5">
              {/* Amount */}
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-600">
                  {typeof opportunity.amount === 'number' ? `$${opportunity.amount.toLocaleString()}` : opportunity.amount}
                </span>
              </div>

              {/* Assigned Rep */}
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-purple-500" />
                <span className="text-xs text-gray-600">{opportunity.assignedRep}</span>
              </div>

              {/* Close Date */}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-gray-600">{opportunity.projCloseDate}</span>
              </div>

              {/* Status Badge */}
              <div className="flex justify-between items-center pt-0.5">
                <Badge className={`${getStatusColor(opportunity.status)} text-xs border`}>
                  {opportunity.status}
                </Badge>
                <span className="text-xs text-gray-400">#{opportunity.id}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
