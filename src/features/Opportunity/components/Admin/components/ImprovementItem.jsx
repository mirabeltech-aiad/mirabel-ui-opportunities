
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar } from "lucide-react";
import { formatDate, getPriorityColor, formatPriorityLabel } from "../utils/improvementUtils";

// Extracted for clarity - displays individual improvement item
const ImprovementItem = ({ improvement, onEdit, onDelete }) => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="text-sm font-semibold text-gray-900 truncate mb-2">{improvement.title}</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-full ${getPriorityColor(improvement.priority)}`}>
                <span className="leading-none">{formatPriorityLabel(improvement.priority)}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(improvement.createdAt)}
                {improvement.updatedAt !== improvement.createdAt && (
                  <span className="ml-1 text-xs">(Upd: {formatDate(improvement.updatedAt)})</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-1 ml-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(improvement)}
              className="h-6 w-6 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(improvement.id)}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {improvement.description && (
          <p className="text-xs text-gray-700 whitespace-pre-wrap line-clamp-3">{improvement.description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ImprovementItem;
