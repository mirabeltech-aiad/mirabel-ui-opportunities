import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  User,
  Building2,
  Edit,
  Trash2,
} from "lucide-react";
import { getDragId } from "../../utils/kanbanUtils";

const KanbanCard = ({
  opportunity,
  index,
  isUpdating = false,
  onDeleteOpportunity,
  onEditOpportunity,
}) => {
  const handleEditOpportunity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const opportunityId = opportunity.id || opportunity.ID;
    if (onEditOpportunity) {
      onEditOpportunity(opportunityId);
    }
  };

  const handleDeleteOpportunity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const opportunityId = opportunity.id || opportunity.ID;
    const opportunityName = opportunity.opportunityName || opportunity.name;

    if (
      window.confirm(
        `Are you sure you want to delete opportunity "${opportunityName}"? This action cannot be undone.`
      )
    ) {
      onDeleteOpportunity(opportunityId);
    }
  };

  const getStatusVariant = (status) => {
    if (!status) return "default";

    switch (status.toLowerCase()) {
      case "open":
        return "open";
      case "won":
        return "won";
      case "lost":
        return "lost";
      default:
        return "default";
    }
  };

  const draggableId = getDragId(opportunity, index);

  if (!draggableId) {
    return null;
  }

  return (
    <Draggable
      draggableId={draggableId}
      index={index}
      isDragDisabled={isUpdating}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 cursor-grab active:cursor-grabbing ${
            snapshot.isDragging ? "opacity-50" : ""
          }`}
          style={{
            ...provided.draggableProps.style,
          }}
          title="Drag to move this opportunity"
        >
          <Card
            className={`hover:shadow-md transition-shadow bg-white border border-gray-200 ${
              isUpdating ? "opacity-75" : ""
            }`}
          >
            <CardHeader className="pb-1 p-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight flex-1">
                  {opportunity.opportunityName || opportunity.name}
                </CardTitle>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEditOpportunity}
                    className="h-5 w-5"
                    disabled={isUpdating}
                    title="Edit opportunity"
                  >
                    <Edit className="h-3 w-3 text-gray-500 hover:text-blue-600" />
                  </Button>
                  {onDeleteOpportunity && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDeleteOpportunity}
                      className="h-5 w-5"
                      disabled={isUpdating}
                      title="Delete opportunity"
                    >
                      <Trash2 className="h-3 w-3 text-gray-500 hover:text-red-600" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Building2 className="h-3 w-3 text-indigo-500" />
                <span className="text-xs text-gray-600 font-medium">
                  {opportunity.companyName || opportunity.company}
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-0 px-2 pb-1.5 space-y-0.5">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-600">
                  {typeof opportunity.amount === "number"
                    ? opportunity.amount.toLocaleString()
                    : opportunity.amount || "0"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-purple-500" />
                <span className="text-xs text-gray-600">
                  {opportunity.assignedRep || opportunity.assignedTo}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-gray-600">
                  {opportunity.projCloseDate || opportunity.closeDate}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <Badge
                  variant={getStatusVariant(opportunity.status)}
                  className="text-xs"
                >
                  {opportunity.status}
                </Badge>
                <span className="text-xs text-gray-400">#{draggableId}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;